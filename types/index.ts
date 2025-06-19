export type Agency = {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  icon: string;
};

export type MediaItem = {
  uri: string;
  type: 'image' | 'video';
};

export type Report = {
  id: string;
  agencyId: string;
  latitude: number;
  longitude: number;
  description: string;
  timestamp: number;
  upvotes: number;
  verified: boolean;
  media: MediaItem[];
  userId?: string;
  username?: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type SubscriptionTier = 'guest' | 'free' | 'monthly' | 'yearly';

export type Subscription = {
  tier: SubscriptionTier;
  startDate: number;
  endDate?: number;
  autoRenew?: boolean;
  paymentMethod?: string;
};