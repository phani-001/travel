import { useState } from 'react';
import { X, Users, DollarSign, CheckCircle, AlertCircle, IndianRupee, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import type { DayItinerary } from '../App';

interface GroupMember {
  id: string;
  name: string;
  email: string;
}

interface Expense {
  activityId: string;
  activityName: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  isPaid?: boolean;
}

interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  isPaid: boolean;
}

interface ExpenditureSplittingProps {
  itinerary: DayItinerary[];
  onClose: () => void;
}

export function ExpenditureSplitting({ itinerary, onClose }: ExpenditureSplittingProps) {
  // Mock group members (in real app, this would come from props or context)
  const groupMembers: GroupMember[] = [
    { id: '1', name: 'Rajesh Kumar', email: 'rajesh@example.com' },
    { id: '2', name: 'Priya Sharma', email: 'priya@example.com' },
    { id: '3', name: 'Amit Patel', email: 'amit@example.com' },
    { id: '4', name: 'Sneha Reddy', email: 'sneha@example.com' },
  ];

  // Convert itinerary activities to initial expenses
  const initialExpenses: Expense[] = itinerary.flatMap(day =>
    day.activities.map(activity => ({
      activityId: activity.id,
      activityName: activity.title,
      amount: activity.cost,
      paidBy: groupMembers[0].id, // Default to first member
      splitAmong: groupMembers.map(m => m.id), // Equal split among all members
      isPaid: false,
    }))
  );

  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [editingExpense, setEditingExpense] = useState<string | null>(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: 0,
    paidBy: groupMembers[0].id,
    splitAmong: groupMembers.map(m => m.id),
  });
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  // Calculate who owes what to whom
  const calculateBalances = () => {
    const balances: { [key: string]: number } = {};
    
    // Initialize balances for all members
    groupMembers.forEach(member => {
      balances[member.id] = 0;
    });

    // Calculate balances based on expenses
    expenses.forEach(expense => {
      const splitAmount = expense.amount / expense.splitAmong.length;
      
      // Person who paid gets credited
      balances[expense.paidBy] += expense.amount;
      
      // Everyone in the split gets debited
      expense.splitAmong.forEach(memberId => {
        balances[memberId] -= splitAmount;
      });
    });

    return balances;
  };

  const balances = calculateBalances();

  // Calculate settlements (who owes whom)
  const calculateSettlements = () => {
    const newSettlements: Settlement[] = [];
    const creditors = Object.entries(balances).filter(([_, amount]) => amount > 0.01);
    const debtors = Object.entries(balances).filter(([_, amount]) => amount < -0.01);

    let creditorsCopy = creditors.map(([id, amount]) => ({ id, amount }));
    let debtorsCopy = debtors.map(([id, amount]) => ({ id, amount: Math.abs(amount) }));

    while (creditorsCopy.length > 0 && debtorsCopy.length > 0) {
      const creditor = creditorsCopy[0];
      const debtor = debtorsCopy[0];
      
      const settleAmount = Math.min(creditor.amount, debtor.amount);
      
      // Check if this settlement was already marked as paid
      const existingSettlement = settlements.find(
        s => s.from === debtor.id && s.to === creditor.id && Math.abs(s.amount - settleAmount) < 0.01
      );
      
      newSettlements.push({
        id: `${debtor.id}-${creditor.id}-${settleAmount}`,
        from: debtor.id,
        to: creditor.id,
        amount: settleAmount,
        isPaid: existingSettlement?.isPaid || false,
      });

      creditor.amount -= settleAmount;
      debtor.amount -= settleAmount;

      if (creditor.amount < 0.01) creditorsCopy.shift();
      if (debtor.amount < 0.01) debtorsCopy.shift();
    }

    return newSettlements;
  };

  const currentSettlements = calculateSettlements();

  const getMemberName = (memberId: string) => {
    return groupMembers.find(m => m.id === memberId)?.name || 'Unknown';
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const perPersonAverage = totalExpenses / groupMembers.length;

  const handleAddExpense = () => {
    if (newExpense.name && newExpense.amount > 0) {
      const expense: Expense = {
        activityId: `custom-${Date.now()}`,
        activityName: newExpense.name,
        amount: newExpense.amount,
        paidBy: newExpense.paidBy,
        splitAmong: newExpense.splitAmong,
        isPaid: false,
      };
      setExpenses([...expenses, expense]);
      setNewExpense({
        name: '',
        amount: 0,
        paidBy: groupMembers[0].id,
        splitAmong: groupMembers.map(m => m.id),
      });
      setShowAddExpense(false);
    }
  };

  const handleDeleteExpense = (activityId: string) => {
    setExpenses(expenses.filter(e => e.activityId !== activityId));
  };

  const handleUpdateExpense = (activityId: string, updates: Partial<Expense>) => {
    setExpenses(expenses.map(e => 
      e.activityId === activityId ? { ...e, ...updates } : e
    ));
    setEditingExpense(null);
  };

  const toggleMemberInSplit = (expenseId: string, memberId: string) => {
    setExpenses(expenses.map(e => {
      if (e.activityId === expenseId) {
        const splitAmong = e.splitAmong.includes(memberId)
          ? e.splitAmong.filter(id => id !== memberId)
          : [...e.splitAmong, memberId];
        return { ...e, splitAmong: splitAmong.length > 0 ? splitAmong : [memberId] };
      }
      return e;
    }));
  };

  const markSettlementPaid = (settlementId: string) => {
    setSettlements(prev => {
      const existing = prev.find(s => s.id === settlementId);
      if (existing) {
        return prev.map(s => s.id === settlementId ? { ...s, isPaid: !s.isPaid } : s);
      }
      const settlement = currentSettlements.find(s => s.id === settlementId);
      if (settlement) {
        return [...prev, { ...settlement, isPaid: true }];
      }
      return prev;
    });
  };

  const exportReport = () => {
    let report = `TRAVERSE - EXPENSE REPORT\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `\n=================================\n`;
    report += `SUMMARY\n`;
    report += `=================================\n`;
    report += `Total Expenses: ₹${totalExpenses.toFixed(2)}\n`;
    report += `Per Person Average: ₹${perPersonAverage.toFixed(2)}\n`;
    report += `Group Size: ${groupMembers.length} members\n`;
    report += `\n=================================\n`;
    report += `EXPENSES\n`;
    report += `=================================\n`;
    expenses.forEach((expense, i) => {
      report += `${i + 1}. ${expense.activityName}\n`;
      report += `   Amount: ₹${expense.amount}\n`;
      report += `   Paid by: ${getMemberName(expense.paidBy)}\n`;
      report += `   Split among: ${expense.splitAmong.map(id => getMemberName(id)).join(', ')}\n`;
      report += `   Per person: ₹${(expense.amount / expense.splitAmong.length).toFixed(2)}\n\n`;
    });
    report += `\n=================================\n`;
    report += `SETTLEMENTS REQUIRED\n`;
    report += `=================================\n`;
    currentSettlements.forEach((settlement, i) => {
      const status = settlements.find(s => s.id === settlement.id)?.isPaid ? '[PAID]' : '[PENDING]';
      report += `${i + 1}. ${status} ${getMemberName(settlement.from)} → ${getMemberName(settlement.to)}: ₹${settlement.amount.toFixed(2)}\n`;
    });
    
    // Create and download the file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `traverse-expenses-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white mb-1">Expense Splitting</h2>
              <p className="text-purple-100 text-sm">Track and settle group expenses</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <p className="text-purple-100 text-sm mb-1">Total Expenses</p>
              <p className="text-white">₹{totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <p className="text-purple-100 text-sm mb-1">Per Person</p>
              <p className="text-white">₹{perPersonAverage.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <p className="text-purple-100 text-sm mb-1">Members</p>
              <p className="text-white">{groupMembers.length}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)] p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Settlements */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="text-gray-900">Settlements Required</h3>
              </div>
              
              {currentSettlements.length === 0 ? (
                <Card className="bg-green-50 border-green-200">
                  <div className="text-center py-6">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-green-900 mb-1">All Settled!</p>
                    <p className="text-sm text-green-700">Everyone's expenses are balanced</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-3">
                  {currentSettlements.map((settlement) => {
                    const isPaid = settlements.find(s => s.id === settlement.id)?.isPaid || false;
                    return (
                      <Card 
                        key={settlement.id} 
                        className={`${isPaid ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 opacity-60' : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-8 h-8 ${isPaid ? 'bg-green-200 text-green-700' : 'bg-orange-200 text-orange-700'} rounded-full flex items-center justify-center text-sm`}>
                                {getMemberName(settlement.from).charAt(0)}
                              </div>
                              <div>
                                <p className="text-gray-900">{getMemberName(settlement.from)}</p>
                                <p className="text-xs text-gray-600">owes</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-10">
                              <div className={`w-8 h-8 ${isPaid ? 'bg-green-300 text-green-800' : 'bg-green-200 text-green-700'} rounded-full flex items-center justify-center text-sm`}>
                                {getMemberName(settlement.to).charAt(0)}
                              </div>
                              <p className="text-gray-900">{getMemberName(settlement.to)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`${isPaid ? 'text-green-900 line-through' : 'text-orange-900'}`}>₹{settlement.amount.toFixed(2)}</p>
                            <Button 
                              variant={isPaid ? "outline" : "primary"}
                              size="sm" 
                              className="mt-2"
                              icon={isPaid ? <Check className="w-3 h-3" /> : undefined}
                              onClick={() => markSettlementPaid(settlement.id)}
                            >
                              {isPaid ? 'Paid ✓' : 'Mark Paid'}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Individual Balances */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900">Member Balances</h3>
              </div>
              
              <div className="space-y-3">
                {groupMembers.map(member => {
                  const balance = balances[member.id];
                  const isPositive = balance > 0.01;
                  const isNegative = balance < -0.01;
                  const isBalanced = !isPositive && !isNegative;
                  
                  return (
                    <Card 
                      key={member.id}
                      className={`
                        ${isPositive ? 'bg-green-50 border-green-200' : ''}
                        ${isNegative ? 'bg-red-50 border-red-200' : ''}
                        ${isBalanced ? 'bg-gray-50 border-gray-200' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center text-white
                            ${isPositive ? 'bg-green-500' : ''}
                            ${isNegative ? 'bg-red-500' : ''}
                            ${isBalanced ? 'bg-gray-400' : ''}
                          `}>
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-600">{member.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {isPositive && (
                            <div>
                              <p className="text-green-900">+₹{balance.toFixed(2)}</p>
                              <p className="text-xs text-green-700">gets back</p>
                            </div>
                          )}
                          {isNegative && (
                            <div>
                              <p className="text-red-900">-₹{Math.abs(balance).toFixed(2)}</p>
                              <p className="text-xs text-red-700">owes</p>
                            </div>
                          )}
                          {isBalanced && (
                            <div>
                              <p className="text-gray-900">₹0.00</p>
                              <p className="text-xs text-gray-600">settled</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                  <h3 className="text-gray-900">Expense Breakdown</h3>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowAddExpense(true)}
                >
                  Add Expense
                </Button>
              </div>
              
              {/* Add Expense Form */}
              {showAddExpense && (
                <Card className="mb-4 bg-purple-50 border-purple-200">
                  <h4 className="text-gray-900 mb-3">Add Custom Expense</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-700 mb-1 block">Expense Name</label>
                      <input
                        type="text"
                        value={newExpense.name}
                        onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
                        placeholder="e.g., Taxi, Snacks, Tips"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-1 block">Amount (₹)</label>
                      <input
                        type="number"
                        value={newExpense.amount || ''}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-1 block">Paid By</label>
                      <select
                        value={newExpense.paidBy}
                        onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {groupMembers.map(member => (
                          <option key={member.id} value={member.id}>{member.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-700 mb-2 block">Split Among</label>
                      <div className="flex flex-wrap gap-2">
                        {groupMembers.map(member => (
                          <button
                            key={member.id}
                            onClick={() => {
                              const splitAmong = newExpense.splitAmong.includes(member.id)
                                ? newExpense.splitAmong.filter(id => id !== member.id)
                                : [...newExpense.splitAmong, member.id];
                              setNewExpense({ ...newExpense, splitAmong: splitAmong.length > 0 ? splitAmong : [member.id] });
                            }}
                            className={`px-3 py-1 rounded-full text-sm transition-all ${
                              newExpense.splitAmong.includes(member.id)
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {member.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" onClick={handleAddExpense} fullWidth>
                        Add Expense
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddExpense(false)} fullWidth>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              <div className="space-y-3">
                {expenses.map(expense => (
                  <Card key={expense.activityId} className="hover:shadow-md transition-shadow">
                    {editingExpense === expense.activityId ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-gray-700 mb-1 block">Paid By</label>
                          <select
                            value={expense.paidBy}
                            onChange={(e) => handleUpdateExpense(expense.activityId, { paidBy: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {groupMembers.map(member => (
                              <option key={member.id} value={member.id}>{member.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm text-gray-700 mb-2 block">Split Among</label>
                          <div className="flex flex-wrap gap-2">
                            {groupMembers.map(member => (
                              <button
                                key={member.id}
                                onClick={() => toggleMemberInSplit(expense.activityId, member.id)}
                                className={`px-3 py-1 rounded-full text-sm transition-all ${
                                  expense.splitAmong.includes(member.id)
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {member.name}
                              </button>
                            ))}
                          </div>
                        </div>
                        <Button variant="primary" size="sm" onClick={() => setEditingExpense(null)} fullWidth>
                          Done Editing
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-gray-900 mb-1">{expense.activityName}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span>Paid by: <span className="text-gray-900">{getMemberName(expense.paidBy)}</span></span>
                            <span>·</span>
                            <span>Split: {expense.splitAmong.length} people</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {expense.splitAmong.map(memberId => (
                              <span 
                                key={memberId}
                                className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs"
                              >
                                {getMemberName(memberId)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-gray-900 mb-1">₹{expense.amount}</p>
                          <p className="text-sm text-gray-600 mb-2">
                            ₹{(expense.amount / expense.splitAmong.length).toFixed(2)} each
                          </p>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingExpense(expense.activityId)}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.activityId)}
                              className="p-1.5 hover:bg-red-50 text-red-600 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
                
                {expenses.length === 0 && (
                  <Card className="bg-gray-50">
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No expenses recorded yet</p>
                      <p className="text-sm text-gray-500 mt-1">Click "Add Expense" to get started</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} · Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={exportReport}>
              Export Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
