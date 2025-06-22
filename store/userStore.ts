import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Subscription, SubscriptionTier } from '@/types';
import { signInWithGoogle, signInWithApple, SocialAuthResponse } from '@/utils/socialAuth';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: number;
  subscription: Subscription;
  postsThisMonth: number;
  authProvider?: 'email' | 'google' | 'apple';
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
  loginWithGoogle: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
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
    authProvider: 'email' as 'email',
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
    authProvider: 'email' as 'email',
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
            authProvider: 'email',
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
      
      loginWithGoogle: async () => {
        try {
          const response = await signInWithGoogle();
          
          if (response.success && response.userData) {
            // In a real app, you would check if this Google user exists in your database
            // and either log them in or create a new account
            
            // For this demo, we'll create a new user
            const { id, email, name, picture, provider } = response.userData;
            
            const newUser: User = {
              id: `google-${id}`,
              username: name || `user-${id.substring(0, 8)}`,
              email: email || `${id}@example.com`,
              avatar: picture,
              createdAt: Date.now(),
              subscription: {
                tier: 'free',
                startDate: Date.now(),
              },
              postsThisMonth: 0,
              authProvider: 'google',
            };
            
            set({
              user: newUser,
              isAuthenticated: true,
            });
            
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Google login error:', error);
          return false;
        }
      },
      
      loginWithApple: async () => {
        try {
          const response = await signInWithApple();
          
          if (response.success && response.userData) {
            // In a real app, you would check if this Apple user exists in your database
            // and either log them in or create a new account
            
            // For this demo, we'll create a new user
            const { id, email, name, provider } = response.userData;
            
            const newUser: User = {
              id: `apple-${id}`,
              username: name || `user-${id.substring(0, 8)}`,
              email: email || `${id}@example.com`,
              createdAt: Date.now(),
              subscription: {
                tier: 'free',
                startDate: Date.now(),
              },
              postsThisMonth: 0,
              authProvider: 'apple',
            };
            
            set({
              user: newUser,
              isAuthenticated: true,
            });
            
            return true;
          }
          
          return false;
        } catch (error) {
          console.error('Apple login error:', error);
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
          } else