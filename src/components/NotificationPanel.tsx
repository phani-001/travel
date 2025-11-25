import { Bell, Check } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
}

export function NotificationPanel({ notifications, onMarkRead }: NotificationPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h2 className="text-gray-900">Recent Activity</h2>
        </div>
        {unreadCount > 0 && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No notifications yet</p>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-colors ${
                notification.read
                  ? 'bg-white border-gray-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => onMarkRead(notification.id)}
                    className="p-1 hover:bg-blue-100 rounded transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4 text-blue-600" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length > 5 && (
        <button className="w-full mt-3 text-sm text-blue-600 hover:text-blue-700 transition-colors">
          View all notifications
        </button>
      )}
    </div>
  );
}
