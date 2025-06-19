import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Subscription, SubscriptionTier } from '@/types';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: number;
  subscription: Subscription;
  postsThisMonth: number;
}

export interface AnonymousPost {
  timestamp: number;
  id: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  deviceId: string | null;
  anonymousPosts: AnonymousPost[];
  hasSeenWelcome: boolean;
  
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  initializeDeviceId: () => Promise<void>;
  addAnonymousPost: (postId: string) => void;
  getRemainingAnonymousPosts: () => number;
  canPostAnonymously: () => boolean;
  setHasSeenWelcome: (seen: boolean) => void;
  
  // Subscription methods
  upgradeSubscription: (tier: SubscriptionTier, paymentMethod?: string) => Promise<boolean>;
  getRemainingPosts: () => number;
  canPost: () => boolean;
  getPostLimit: () => number;
  addPost: () => void;
}

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: 'password',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    subscription: {
      tier: 'free' as SubscriptionTier,
      startDate: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    postsThisMonth: 3,
  },
  {
    id: '2',
    username: 'premium',
    email: 'premium@example.com',
    password: 'password',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
    subscription: {
      tier: 'monthly' as SubscriptionTier,
      startDate: Date.now() - 15 * 24 * 60 * 60 * 1000,
      endDate: Date.now() + 15 * 24 * 60 * 60 * 1000,
      autoRenew: true,
      paymentMethod: 'Google Pay',
    },
    postsThisMonth: 25,
  }
];

// Maximum number of anonymous posts allowed in a 30-day period
const MAX_ANONYMOUS_POSTS = 2;
// Maximum number of posts for free registered users
const MAX_FREE_POSTS = 10;
// Period in milliseconds (30 days)
const ANONYMOUS_POST_PERIOD = 30 * 24 * 60 * 60 * 1000;

// Helper function to generate a device ID
const generateDeviceId = () => {
  const randomPart = Math.random().toString(36).substring(2, 15);
  const timestampPart = Date.now().toString(36);
  const platformInfo = Platform.OS;
  return `${platformInfo}-${randomPart}-${timestampPart}`;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      deviceId: null,
      anonymousPosts: [],
      hasSeenWelcome: false,
      
      initializeDeviceId: async () => {
        try {
          // Generate a unique device identifier
          let deviceId = null;
          
          try {
            deviceId = await AsyncStorage.getItem('device_id');
          } catch (error) {
            console.error('Error reading device ID from storage:', error);
          }
          
          if (!deviceId) {
            // Create a new device ID if one doesn't exist
            deviceId = generateDeviceId();
            try {
              await AsyncStorage.setItem('device_id', deviceId);
            } catch (error) {
              console.error('Error saving device ID to storage:', error);
            }
          }
          
          set({ deviceId });
        } catch (error) {
          console.error('Failed to initialize device ID:', error);
          // Set a fallback device ID in case of errors
          set({ deviceId: generateDeviceId() });
        }
      },
      
      addAnonymousPost: (postId: string) => {
        const { anonymousPosts } = get();
        const newPost = {
          timestamp: Date.now(),
          id: postId
        };
        
        set({ 
          anonymousPosts: [...anonymousPosts, newPost] 
        });
      },
      
      getRemainingAnonymousPosts: () => {
        const { anonymousPosts } = get();
        const now = Date.now();
        
        // Filter posts from the last 30 days
        const recentPosts = anonymousPosts.filter(
          post => (now - post.timestamp) < ANONYMOUS_POST_PERIOD
        );
        
        return MAX_ANONYMOUS_POSTS - recentPosts.length;
      },
      
      canPostAnonymously: () => {
        return get().getRemainingAnonymousPosts() > 0;
      },
      
      login: async (email, password) => {
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find user with matching email and password
          const user = MOCK_USERS.find(
            u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
          );
          
          if (user) {
            const { password: _, ...userWithoutPassword } = user;
            set({ 
              user: userWithoutPassword,
              isAuthenticated: true 
            });
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      register: async (username, email, password) => {
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if email already exists
          const emailExists = MOCK_USERS.some(
            u => u.email.toLowerCase() === email.toLowerCase()
          );
          
          if (emailExists) {
            return false;
          }
          
          // In a real app, we would create a new user in the database
          // For this demo, we'll just simulate a successful registration
          const newUser: User = {
            id: `user-${Date.now()}`,
            username,
            email,
            createdAt: Date.now(),
            subscription: {
              tier: 'free',
              startDate: Date.now(),
            },
            postsThisMonth: 0,
          };
          
          set({ 
            user: newUser,
            isAuthenticated: true 
          });
          
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          return false;
        }
      },
      
      logout: () => {
        set({ 
          user: null,
          isAuthenticated: false 
        });
      },
      
      updateProfile: (updates) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, ...updates } 
          });
        }
      },
      
      setHasSeenWelcome: (seen) => {
        set({ hasSeenWelcome: seen });
      },
      
      // Subscription methods
      upgradeSubscription: async (tier, paymentMethod) => {
        try {
          const { user, isAuthenticated } = get();
          
          if (!isAuthenticated || !user) {
            return false;
          }
          
          // Simulate payment processing delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Calculate subscription end date
          let endDate;
          if (tier === 'monthly') {
            endDate = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
          } else if (tier === 'yearly') {
            endDate = Date.now() + 365 * 24 * 60 * 60 * 1000; // 365 days
          }
          
          const updatedUser = {
            ...user,
            subscription: {
              tier,
              startDate: Date.now(),
              endDate,
              autoRenew: true,
              paymentMethod: paymentMethod || 'Google Pay',
            }
          };
          
          set({ user: updatedUser });
          return true;
        } catch (error) {
          console.error('Subscription upgrade error:', error);
          return false;
        }
      },
      
      getRemainingPosts: () => {
        try {
          const { user, isAuthenticated } = get();
          
          if (!isAuthenticated || !user) {
            return get().getRemainingAnonymousPosts();
          }
          
          const { subscription, postsThisMonth } = user;
          
          // Premium users have unlimited posts
          if (subscription.tier === 'monthly' || subscription.tier === 'yearly') {
            return Infinity;
          }
          
          // Free registered users get 10 posts per month
          if (subscription.tier === 'free') {
            return MAX_FREE_POSTS - postsThisMonth;
          }
          
          return 0;
        } catch (error) {
          console.error('Error getting remaining posts:', error);
          return 0;
        }
      },
      
      canPost: () => {
        try {
          const { isAuthenticated } = get();
          
          if (!isAuthenticated) {
            return get().canPostAnonymously();
          }
          
          return get().getRemainingPosts() > 0;
        } catch (error) {
          console.error('Error checking if user can post:', error);
          return false;
        }
      },
      
      getPostLimit: () => {
        try {
          const { user, isAuthenticated } = get();
          
          if (!isAuthenticated) {
            return MAX_ANONYMOUS_POSTS;
          }
          
          if (!user) return 0;
          
          const { subscription } = user;
          
          if (subscription.tier === 'monthly' || subscription.tier === 'yearly') {
            return Infinity;
          }
          
          if (subscription.tier === 'free') {
            return MAX_FREE_POSTS;
          }
          
          return 0;
        } catch (error) {
          console.error('Error getting post limit:', error);
          return 0;
        }
      },
      
      addPost: () => {
        try {
          const { user, isAuthenticated } = get();
          
          if (!isAuthenticated || !user) {
            // For anonymous users, this is handled by addAnonymousPost
            return;
          }
          
          // Only increment for free users (premium users have unlimited)
          if (user.subscription.tier === 'free') {
            set({
              user: {
                ...user,
                postsThisMonth: user.postsThisMonth + 1
              }
            });
          }
        } catch (error) {
          console.error('Error adding post:', error);
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        deviceId: state.deviceId,
        anonymousPosts: state.anonymousPosts,
        hasSeenWelcome: state.hasSeenWelcome,
      }),
    }
  )
);