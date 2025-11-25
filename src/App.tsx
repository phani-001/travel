import { useState } from 'react';
import { LandingPage } from './components/screens/LandingPage';
import { SignUpScreen } from './components/screens/SignUpScreen';
import { SignInScreen } from './components/screens/SignInScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { CreateTripScreen } from './components/screens/CreateTripScreen';
import { AIGeneratingScreen } from './components/screens/AIGeneratingScreen';
import { ItineraryOutputScreen } from './components/screens/ItineraryOutputScreen';
import { GroupMemberView } from './components/screens/GroupMemberView';
import { EmergencyOfflineMode } from './components/screens/EmergencyOfflineMode';
import { ManualPlanningScreen } from './components/screens/ManualPlanningScreen';
import { CheckInSurvey, type ActivityFeedback } from './components/CheckInSurvey';
import { AIReplanningScreen } from './components/AIReplanningScreen';
import { OfflineMapDownload } from './components/OfflineMapDownload';

export type Screen = 
  | 'landing' 
  | 'signup'
  | 'signin'
  | 'home'
  | 'planning-choice'
  | 'create-trip' 
  | 'manual-planning'
  | 'generating' 
  | 'itinerary' 
  | 'group-member'
  | 'emergency';

export interface UserData {
  name: string;
  email: string;
  phone: string;
}

export interface TripData {
  city: string;
  startDate: string;
  endDate: string;
  hotel: string;
  groupSize: number;
  mustDo: Array<{id: string; name: string; category: string}>;
  budgetTier: 'budget' | 'moderate' | 'luxury';
  intensityLevel: 'relaxed' | 'balanced' | 'active';
  maxTravelTime: number;
  dietary: string[];
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  category: string;
  location: string;
  distance: string;
  travelTime: number;
  energy: 'low' | 'medium' | 'high';
  indoor: boolean;
  cost: number;
  description: string;
  hours: string;
  weatherSuitable: string[];
  dietary: string[];
  image: string;
  rating: number;
  lat: number;
  lng: number;
}

export interface DayItinerary {
  date: string;
  activities: Activity[];
  totalDistance: string;
  totalCost: number;
  energyProfile: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('signin');
  const [user, setUser] = useState<UserData | null>(null);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [itinerary, setItinerary] = useState<DayItinerary[]>([]);
  const [userRole, setUserRole] = useState<'organizer' | 'member'>('organizer');
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [activityFeedbacks, setActivityFeedbacks] = useState<ActivityFeedback[]>([]);
  const [showCheckInSurvey, setShowCheckInSurvey] = useState<Activity | null>(null);
  const [showAIReplanning, setShowAIReplanning] = useState<{feedback: ActivityFeedback; activityName: string} | null>(null);
  const [offlineMapDownloaded, setOfflineMapDownloaded] = useState(false);
  const [showOfflineMapDownload, setShowOfflineMapDownload] = useState(false);

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleSignUp = (userData: { name: string; email: string; phone: string; password: string }) => {
    // Store user data (in real app, this would be sent to backend)
    setUser({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    });
    // After signup, go to signin with success message
    setCurrentScreen('signin');
  };

  const handleSignIn = (email: string, password: string) => {
    // Mock sign in (in real app, this would validate with backend)
    if (!user && email === 'demo@flowtrip.com') {
      // Demo user
      setUser({
        name: 'Demo User',
        email: email,
        phone: '+91 98765 43210',
      });
    }
    // After signin, go to home
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setTripData(null);
    setItinerary([]);
    setCompletedActivities(new Set());
    setActivityFeedbacks([]);
    setCurrentScreen('signin');
  };

  const handleCheckIn = (activity: Activity) => {
    setShowCheckInSurvey(activity);
  };

  const handleSurveyComplete = (feedback: ActivityFeedback) => {
    // Mark activity as completed
    setCompletedActivities(prev => new Set(prev).add(feedback.activityId));
    
    // Store feedback
    setActivityFeedbacks(prev => [...prev, feedback]);
    
    // Close survey
    setShowCheckInSurvey(null);
    
    // Find activity name
    const activity = itinerary
      .flatMap(day => day.activities)
      .find(a => a.id === feedback.activityId);
    
    if (activity) {
      // Show AI replanning screen
      setShowAIReplanning({ feedback, activityName: activity.title });
      
      // Automatically close AI replanning and apply changes after 5 seconds
      setTimeout(() => {
        setShowAIReplanning(null);
        
        // Apply replanning if needed
        applyReplanning(feedback);
      }, 5000);
    }
  };

  const applyReplanning = (feedback: ActivityFeedback) => {
    const needsReplanning = 
      feedback.overallRating <= 2 ||
      feedback.moodAfter === 'exhausted' ||
      feedback.moodAfter === 'sick' ||
      feedback.healthStatus === 'unwell' ||
      feedback.healthStatus === 'sick' ||
      feedback.energyLevel === 'low' ||
      feedback.weatherExperience === 'bad';

    if (needsReplanning && tripData) {
      // Find the day of the completed activity
      const completedDayIndex = itinerary.findIndex(day => 
        day.activities.some(a => a.id === feedback.activityId)
      );
      
      if (completedDayIndex >= 0) {
        // Get remaining days (including current day for rest of activities)
        const remainingDays = itinerary.slice(completedDayIndex);
        
        // Generate alternative low-energy indoor activities
        const alternativeActivities: Activity[] = [
          {
            id: `alt-${Date.now()}-1`,
            time: '14:00',
            title: 'Relaxing Spa & Wellness',
            category: 'Relaxation',
            location: 'Hotel Spa',
            distance: '0 km',
            travelTime: 0,
            energy: 'low',
            indoor: true,
            cost: 800,
            description: 'Rejuvenate with a relaxing spa session. Perfect for recovery and rest.',
            hours: '10:00 - 21:00',
            weatherSuitable: ['sunny', 'cloudy', 'rainy'],
            dietary: ['all'],
            image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjB3ZWxsbmVzc3xlbnwxfHx8fDE3NjQwNDk3ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.5,
            lat: 17.7100,
            lng: 83.3100,
          },
          {
            id: `alt-${Date.now()}-2`,
            time: '11:00',
            title: 'Shopping Mall - CMR Central',
            category: 'Shopping & Indoor',
            location: 'CMR Central',
            distance: '2 km',
            travelTime: 10,
            energy: 'low',
            indoor: true,
            cost: 500,
            description: 'Relaxed indoor shopping with air conditioning. Browse at your own pace.',
            hours: '10:00 - 22:00',
            weatherSuitable: ['sunny', 'cloudy', 'rainy'],
            dietary: ['all'],
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGx8ZW58MXx8fHwxNzY0MDQ5Nzg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.3,
            lat: 17.7100,
            lng: 83.3100,
          },
          {
            id: `alt-${Date.now()}-3`,
            time: '16:00',
            title: 'Movie at INOX Cinema',
            category: 'Entertainment',
            location: 'CMR Central',
            distance: '2 km',
            travelTime: 10,
            energy: 'low',
            indoor: true,
            cost: 300,
            description: 'Relax with a movie in comfortable air-conditioned theater.',
            hours: '10:00 - 23:00',
            weatherSuitable: ['sunny', 'cloudy', 'rainy'],
            dietary: ['all'],
            image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzY0MDQ5Nzg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.4,
            lat: 17.7105,
            lng: 83.3110,
          },
          {
            id: `alt-${Date.now()}-4`,
            time: '13:00',
            title: 'Cozy Cafe - Book & Relax',
            category: 'Dining & Relaxation',
            location: 'Dwaraka Nagar',
            distance: '1.5 km',
            travelTime: 8,
            energy: 'low',
            indoor: true,
            cost: 250,
            description: 'Quiet cafe perfect for resting. Light meals and beverages available.',
            hours: '09:00 - 22:00',
            weatherSuitable: ['sunny', 'cloudy', 'rainy'],
            dietary: ['vegetarian', 'vegan', 'gluten-free'],
            image: 'https://images.unsplash.com/photo-1757608510682-3ed000a510b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZSUyMGluZGlhfGVufDF8fHx8MTc2NDA0OTc4NXww&ixlib=rb-4.1.0&q=80&w=1080',
            rating: 4.2,
            lat: 17.7120,
            lng: 83.3130,
          },
        ];
        
        // Modify remaining activities based on feedback
        const updatedRemainingDays = remainingDays.map((day, dayOffset) => {
          let modifiedActivities = [...day.activities];
          
          // For severe health issues, replace ALL activities with rest and recovery
          if (feedback.healthStatus === 'sick' || feedback.moodAfter === 'sick') {
            // Replace with 1-2 very low energy indoor activities
            modifiedActivities = alternativeActivities
              .filter(a => a.energy === 'low' && a.indoor)
              .slice(0, 2);
          }
          // For unwell or exhausted, reduce and replace outdoor activities
          else if (feedback.healthStatus === 'unwell' || feedback.moodAfter === 'exhausted') {
            // Keep only indoor or low-energy activities, max 3 per day
            modifiedActivities = modifiedActivities
              .filter(a => a.indoor || a.energy === 'low')
              .slice(0, 3);
            
            // Add alternative activities if too few
            if (modifiedActivities.length < 2) {
              modifiedActivities = [
                ...modifiedActivities,
                ...alternativeActivities.slice(0, 2 - modifiedActivities.length)
              ];
            }
          }
          // For low energy, reduce intensity and number
          else if (feedback.energyLevel === 'low') {
            // Remove high-energy activities and reduce count
            modifiedActivities = modifiedActivities
              .filter(a => a.energy !== 'high')
              .slice(0, Math.ceil(modifiedActivities.length * 0.7));
            
            // Add one relaxing activity
            if (modifiedActivities.length > 0) {
              modifiedActivities.push(alternativeActivities[0]);
            }
          }
          // For bad weather, switch to indoor
          else if (feedback.weatherExperience === 'bad') {
            // Replace outdoor activities with indoor alternatives
            const indoorActivities = modifiedActivities.filter(a => a.indoor);
            const outdoorCount = modifiedActivities.length - indoorActivities.length;
            
            modifiedActivities = [
              ...indoorActivities,
              ...alternativeActivities.filter(a => a.indoor).slice(0, outdoorCount)
            ];
          }
          // For poor experience rating, mix things up
          else if (feedback.overallRating <= 2) {
            // Keep half of activities, replace rest with alternatives
            const keepCount = Math.ceil(modifiedActivities.length / 2);
            modifiedActivities = [
              ...modifiedActivities.slice(0, keepCount),
              ...alternativeActivities.slice(0, modifiedActivities.length - keepCount)
            ];
          }
          
          return {
            ...day,
            activities: modifiedActivities,
            totalCost: modifiedActivities.reduce((sum, a) => sum + a.cost, 0),
            energyProfile: feedback.healthStatus === 'sick' || feedback.moodAfter === 'sick' 
              ? 'Recovery & Rest Day'
              : feedback.energyLevel === 'low'
              ? 'Light & Relaxed'
              : day.energyProfile,
          };
        });
        
        // Update itinerary with modified days
        setItinerary([
          ...itinerary.slice(0, completedDayIndex),
          ...updatedRemainingDays
        ]);
      }
    }
  };

  const handleCreateTrip = (data: TripData) => {
    setTripData(data);
    setCurrentScreen('generating');
    
    // Simulate AI generation
    setTimeout(() => {
      // Generate mock itinerary
      const mockItinerary = generateMockItinerary(data);
      setItinerary(mockItinerary);
      setCurrentScreen('itinerary');
    }, 3500);
  };

  const generateMockItinerary = (data: TripData): DayItinerary[] => {
    const days: DayItinerary[] = [];
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    
    const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    for (let i = 0; i < dayCount; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const activities = getMockActivitiesForDay(i, data);
      const totalCost = activities.reduce((sum, activity) => sum + activity.cost, 0);
      const totalTravelTime = activities.reduce((sum, activity) => sum + activity.travelTime, 0);
      
      days.push({
        date: currentDate.toISOString().split('T')[0],
        activities: activities,
        totalDistance: `${(totalTravelTime * 0.4).toFixed(1)} km`,
        totalCost: totalCost,
        energyProfile: i === 0 ? 'Coastal & Beaches' : i === 1 ? 'Heritage & Culture' : 'Adventure Day Trip',
      });
    }
    
    return days;
  };

  const getMockActivitiesForDay = (dayIndex: number, data: TripData): Activity[] => {
    // Different activities for each day
    const allDayPlans: Activity[][] = [
      // DAY 1: Beaches & Coastal Visakhapatnam
      [
        {
          id: 'd1-a1',
          time: '08:00',
          title: 'Aadhya Cafe - Breakfast',
          category: 'Dining',
          location: 'Dwaraka Nagar',
          distance: '2 km from hotel',
          travelTime: 10,
          energy: 'low',
          indoor: true,
          cost: 250,
          description: 'Popular local cafe known for South Indian breakfast specialties. Try the idli-vada combo and filter coffee.',
          hours: '07:00 - 22:00',
          weatherSuitable: ['sunny', 'cloudy', 'rainy'],
          dietary: ['vegetarian', 'vegan', 'gluten-free'],
          image: 'https://images.unsplash.com/photo-1757608510682-3ed000a510b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZSUyMGluZGlhfGVufDF8fHx8MTc2NDA0OTc4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.4,
          lat: 17.7100,
          lng: 83.3100,
        },
        {
          id: 'd1-a2',
          time: '09:30',
          title: 'RK Beach Morning Walk',
          category: 'Nature & Scenic',
          location: 'Ramakrishna Beach',
          distance: '4.5 km',
          travelTime: 15,
          energy: 'low',
          indoor: false,
          cost: 0,
          description: 'Start your day with a refreshing walk along the famous Ramakrishna Beach. Watch local fishermen and enjoy the Bay of Bengal breeze.',
          hours: 'Open 24/7',
          weatherSuitable: ['sunny', 'cloudy'],
          dietary: ['all'],
          image: 'https://images.unsplash.com/photo-1653796002220-eb89f5f8e5fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjb2FzdGFsJTIwYmVhY2h8ZW58MXx8fHwxNzY0MDQ5Nzg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.7,
          lat: 17.7231,
          lng: 83.3250,
        },
        {
          id: 'd1-a3',
          time: '11:00',
          title: 'INS Kursura Submarine Museum',
          category: 'Museum & Heritage',
          location: 'Beach Road',
          distance: '0.5 km',
          travelTime: 5,
          energy: 'medium',
          indoor: true,
          cost: 40,
          description: 'Explore India\'s first submarine museum housed in the actual INS Kursura submarine. A unique naval experience.',
          hours: '14:00 - 20:30',
          weatherSuitable: ['sunny', 'cloudy', 'rainy'],
          dietary: ['all'],
          image: 'https://images.unsplash.com/photo-1700863555481-b7374a3a0e50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWJtYXJpbmUlMjBtdXNldW18ZW58MXx8fHwxNzY0MDQ5NzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.8,
          lat: 17.7240,
          lng: 83.3256,
        },
        {
          id: 'd1-a4',
          time: '13:00',
          title: 'Dakshin Restaurant - Coastal Lunch',
          category: 'Dining',
          location: 'The Park Hotel, Beach Road',
          distance: '1.2 km',
          travelTime: 8,
          energy: 'low',
          indoor: true,
          cost: 600,
          description: 'Fine dining with authentic Andhra seafood. Famous for prawns ghee roast, fish pulusu, and crab masala.',
          hours: '12:30 - 15:00, 19:00 - 23:00',
          weatherSuitable: ['sunny', 'cloudy', 'rainy'],
          dietary: ['gluten-free'],
          image: 'https://images.unsplash.com/photo-1707635569223-c759b3b0501b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzZWFmb29kJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjQwNDk3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.6,
          lat: 17.7245,
          lng: 83.3262,
        },
        {
          id: 'd1-a5',
          time: '15:30',
          title: 'Kailasagiri Hill Park',
          category: 'Nature & Scenic',
          location: 'Kailasagiri',
          distance: '6 km',
          travelTime: 20,
          energy: 'medium',
          indoor: false,
          cost: 50,
          description: 'Take the ropeway to this hilltop park with panoramic views of Visakhapatnam. Visit the giant Shiva-Parvati statue.',
          hours: '10:00 - 20:00',
          weatherSuitable: ['sunny', 'cloudy'],
          dietary: ['all'],
          image: 'https://images.unsplash.com/photo-1707340247339-5ad8eef7c04c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWxsdG9wJTIwdmlld3BvaW50JTIwY2l0eXxlbnwxfHx8fDE3NjQwNDk3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.5,
          lat: 17.7334,
          lng: 83.3231,
        },
        {
          id: 'd1-a6',
          time: '18:30',
          title: 'Rushikonda Beach Sunset',
          category: 'Relaxation',
          location: 'Rushikonda',
          distance: '8 km',
          travelTime: 25,
          energy: 'low',
          indoor: false,
          cost: 0,
          description: 'End the day at pristine Rushikonda Beach. Enjoy water sports or simply relax watching the sunset over the Bay of Bengal.',
          hours: 'Open 24/7',
          weatherSuitable: ['sunny', 'cloudy'],
          dietary: ['all'],
          image: 'https://images.unsplash.com/photo-1650124077868-1062f72a0ede?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMHN1bnNldCUyMGV2ZW5pbmd8ZW58MXx8fHwxNzY0MDQ5Nzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.7,
          lat: 17.7833,
          lng: 83.3850,
        },
      ],
      
      // DAY 2: Heritage & Temples
      [
        {
          id: 'd2-a1',
          time: '07:00',
          title: 'CMR Central - Breakfast',
          category: 'Dining',
          location: 'CMR Central, Maddilapalem',
          distance: '3 km from hotel',
          travelTime: 12,
          energy: 'low',
          indoor: true,
          cost: 200,
          description: 'Local favorite for Andhra breakfast. Try pesarattu, upma, and masala dosa with sambar.',
          hours: '06:30 - 22:30',
          weatherSuitable: ['sunny', 'cloudy', 'rainy'],
          dietary: ['vegetarian', 'vegan'],
          image: 'https://images.unsplash.com/photo-1757608510682-3ed000a510b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBzaG9wJTIwY2FmZSUyMGluZGlhfGVufDF8fHx8MTc2NDA0OTc4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.3,
          lat: 17.7147,
          lng: 83.3105,
        },
        {
          id: 'd2-a2',
          time: '08:30',
          title: 'Simhachalam Temple',
          category: 'Heritage & Spirituality',
          location: 'Simhachalam',
          distance: '16 km',
          travelTime: 35,
          energy: 'medium',
          indoor: true,
          cost: 0,
          description: 'Ancient hilltop temple dedicated to Lord Narasimha. Beautiful Kalinga architecture dating back to 11th century.',
          hours: '04:00 - 21:00',
          weatherSuitable: ['sunny', 'cloudy', 'rainy'],
          dietary: ['vegetarian', 'vegan'],
          image: 'https://images.unsplash.com/photo-1695692928769-7b4eec3803fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaW5kdSUyMHRlbXBsZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NjM5NjUzNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.8,
          lat: 17.7616,
          lng: 83.2419,
        },
        {
          id: 'd2-a3',
          time: '12:00',
          title: 'Tycoon Multi-Cuisine Restaurant',
          category: 'Dining',
          location: 'Dwaraka Nagar',
          distance: '14 km',
          travelTime: 30,
          energy: 'low',
          indoor: true,
          cost: 400,
          description: 'Popular restaurant offering North Indian, Chinese, and Andhra cuisine. Known for biryanis and tandoor items.',
          hours: '11:00 - 23:00',
          weatherSuitable: ['sunny', 'cloudy', 'rainy'],
          dietary: ['vegetarian', 'gluten-free'],
          image: 'https://images.unsplash.com/photo-1707635569223-c759b3b0501b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzZWFmb29kJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjQwNDk3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.4,
          lat: 17.7100,
          lng: 83.3150,
        },
        {
          id: 'd2-a4',
          time: '14:30',
          title: 'Thotlakonda Buddhist Complex',
          category: 'Heritage & History',
          location: 'Thotlakonda',
          distance: '10 km',
          travelTime: 25,
          energy: 'medium',
          indoor: false,
          cost: 25,
          description: 'Ancient Buddhist monastery ruins with stunning hilltop views. Dating from 2nd century BCE to 2nd century CE.',
          hours: '09:00 - 18:00',
          weatherSuitable: ['sunny', 'cloudy'],
          dietary: ['all'],
          image: 'https://images.unsplash.com/photo-1602143211370-2f783c6f0af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWRkaGlzdCUyMHRlbXBsZSUyMG1vbmFzdGVyeXxlbnwxfHx8fDE3NjQwNDk3ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.5,
          lat: 17.7622,
          lng: 83.3853,
        },
        {
          id: 'd2-a5',
          time: '17:00',
          title: 'VUDA Park Evening',
          category: 'Relaxation',
          location: 'VUDA Park',
          distance: '7 km',
          travelTime: 20,
          energy: 'low',
          indoor: false,
          cost: 20,
          description: 'Well-maintained park with musical fountain, boating, and children\'s play area. Perfect for evening relaxation.',
          hours: '15:00 - 21:00',
          weatherSuitable: ['sunny', 'cloudy'],
          dietary: ['all'],
          image: 'https://images.unsplash.com/photo-1707340247339-5ad8eef7c04c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWxsdG9wJTIwdmlld3BvaW50JTIwY2l0eXxlbnwxfHx8fDE3NjQwNDk3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.2,
          lat: 17.7300,
          lng: 83.3200,
        },
      ],

      // DAY 3: Araku Valley Day Trip
      [
        {
          id: 'd3-a1',
          time: '06:00',
          title: 'Early Start to Araku',
          category: 'Adventure & Travel',
          location: 'From Hotel',
          distance: '0 km',
          travelTime: 0,
          energy: 'medium',
          indoor: false,
          cost: 1500,
          description: 'Begin scenic journey to Araku Valley through Eastern Ghats. The 115km drive takes 3 hours through beautiful landscapes.',
          hours: 'Full Day Trip',
          weatherSuitable: ['sunny', 'cloudy'],
          dietary: ['all'],
          image: 'https://images.unsplash.com/photo-1625905787137-ccc933bcf46a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWxsZXklMjBtb3VudGFpbnMlMjBzY2VuZXJ5fGVufDF8fHx8MTc2NDA0OTc4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.9,
          lat: 17.7231,
          lng: 83.3250,
        },
        {
          id: 'd3-a2',
          time: '10:00',
          title: 'Borra Caves',
          category: 'Nature & Adventure',
          location: 'Borra Guhalu',
          distance: '90 km',
          travelTime: 180,
          energy: 'high',
          indoor: true,
          cost: 150,
          description: 'Magnificent natural limestone caves with stalactites and stalagmites. One of the largest caves in India.',
          hours: '10:00 - 17:30',
          weatherSuitable: ['sunny', 'cloudy', 'rainy'],
          dietary: ['all'],
          image: 'https://images.unsplash.com/photo-1668486115020-503f39e0c6f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXZlcyUyMGxpbWVzdG9uZSUyMG5hdHVyYWx8ZW58MXx8fHwxNzY0MDQ5Nzg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.6,
          lat: 18.2812,
          lng: 83.0531,
        },
        {
          id: 'd3-a3',
          time: '13:00',
          title: 'Araku Valley Tribal Lunch',
          category: 'Dining & Culture',
          location: 'Araku Valley',
          distance: '25 km',
          travelTime: 45,
          energy: 'low',
          indoor: true,
          cost: 350,
          description: 'Authentic tribal cuisine featuring bamboo chicken, local vegetables, and traditional preparations.',
          hours: '12:00 - 15:00',
          weatherSuitable: ['sunny', 'cloudy', 'rainy'],
          dietary: ['gluten-free'],
          image: 'https://images.unsplash.com/photo-1707635569223-c759b3b0501b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzZWFmb29kJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjQwNDk3ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.3,
          lat: 18.3273,
          lng: 82.8756,
        },
        {
          id: 'd3-a4',
          time: '15:00',
          title: 'Tribal Museum & Coffee Plantations',
          category: 'Culture & Nature',
          location: 'Araku Valley',
          distance: '2 km',
          travelTime: 5,
          energy: 'medium',
          indoor: false,
          cost: 100,
          description: 'Explore tribal heritage at the museum, then walk through aromatic coffee plantations. Buy fresh Araku coffee.',
          hours: '10:00 - 18:00',
          weatherSuitable: ['sunny', 'cloudy'],
          dietary: ['all'],
          image: 'https://images.unsplash.com/photo-1720945489924-19b707539b3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmliYWwlMjBtdXNldW0lMjBhcnRpZmFjdHN8ZW58MXx8fHwxNzY0MDQ5Nzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.4,
          lat: 18.3280,
          lng: 82.8780,
        },
        {
          id: 'd3-a5',
          time: '17:30',
          title: 'Return Journey to Vizag',
          category: 'Travel',
          location: 'Back to Visakhapatnam',
          distance: '115 km',
          travelTime: 180,
          energy: 'low',
          indoor: false,
          cost: 0,
          description: 'Scenic return drive through the Eastern Ghats as sun sets. Arrive back in Visakhapatnam by evening.',
          hours: 'Evening',
          weatherSuitable: ['sunny', 'cloudy'],
          dietary: ['all'],
          image: 'https://images.unsplash.com/photo-1625905787137-ccc933bcf46a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWxsZXklMjBtb3VudGFpbnMlMjBzY2VuZXJ5fGVufDF8fHx8MTc2NDA0OTc4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
          rating: 4.7,
          lat: 17.7231,
          lng: 83.3250,
        },
      ],
    ];

    // Return the appropriate day plan, cycling through if needed
    return allDayPlans[dayIndex % allDayPlans.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-peach-50">
      {currentScreen === 'landing' && (
        <LandingPage onNavigate={navigateToScreen} />
      )}
      
      {currentScreen === 'signup' && (
        <SignUpScreen onNavigate={navigateToScreen} onSignUp={handleSignUp} />
      )}
      
      {currentScreen === 'signin' && (
        <SignInScreen onNavigate={navigateToScreen} onSignIn={handleSignIn} />
      )}
      
      {currentScreen === 'home' && user && (
        <HomeScreen user={user} onNavigate={navigateToScreen} onLogout={handleLogout} />
      )}
      
      {currentScreen === 'create-trip' && (
        <CreateTripScreen 
          onBack={() => navigateToScreen('landing')}
          onCreateTrip={handleCreateTrip}
        />
      )}
      
      {currentScreen === 'manual-planning' && (
        <ManualPlanningScreen 
          onBack={() => navigateToScreen('home')}
          tripData={tripData}
          onComplete={(manualItinerary, manualTripData) => {
            setTripData(manualTripData);
            setItinerary(manualItinerary);
            setCurrentScreen('itinerary');
          }}
        />
      )}
      
      {currentScreen === 'generating' && (
        <AIGeneratingScreen tripData={tripData} />
      )}
      
      {currentScreen === 'itinerary' && tripData && (
        <ItineraryOutputScreen
          tripData={tripData}
          itinerary={itinerary}
          onNavigate={navigateToScreen}
          onRegenerate={(updatedData) => handleCreateTrip(updatedData)}
          onCheckIn={handleCheckIn}
          completedActivities={completedActivities}
          offlineMapDownloaded={offlineMapDownloaded}
          onDownloadMap={() => setShowOfflineMapDownload(true)}
        />
      )}
      
      {currentScreen === 'group-member' && tripData && (
        <GroupMemberView
          tripData={tripData}
          itinerary={itinerary}
          onBack={() => navigateToScreen('itinerary')}
        />
      )}
      
      {currentScreen === 'emergency' && tripData && (
        <EmergencyOfflineMode
          tripData={tripData}
          currentDay={itinerary[0]}
          onBack={() => navigateToScreen('itinerary')}
        />
      )}
      
      {showCheckInSurvey && (
        <CheckInSurvey
          activity={showCheckInSurvey}
          onComplete={handleSurveyComplete}
          onClose={() => setShowCheckInSurvey(null)}
        />
      )}
      
      {showAIReplanning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full">
            <AIReplanningScreen
              feedback={showAIReplanning.feedback}
              activityName={showAIReplanning.activityName}
            />
          </div>
        </div>
      )}
      
      {showOfflineMapDownload && tripData && (
        <OfflineMapDownload 
          cityName={tripData.city}
          onClose={() => setShowOfflineMapDownload(false)}
          onDownloadComplete={() => {
            setOfflineMapDownloaded(true);
            setShowOfflineMapDownload(false);
          }}
        />
      )}
    </div>
  );
}