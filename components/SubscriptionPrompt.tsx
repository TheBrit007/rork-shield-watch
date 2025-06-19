import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import { LogIn, UserPlus, CreditCard, CheckCircle, AlertCircle } from 'lucide-react-native';

interface SubscriptionPromptProps {
  isAuthenticated: boolean;
  onDismiss?: () => void;
}

export const SubscriptionPrompt: React.FC<SubscriptionPromptProps> = ({
  isAuthenticated,
  onDismiss,
}) => {
  const router = useRouter();
  const { upgradeSubscription } = useUserStore();

  const handleLogin = () => {
    router.push('/login');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleUpgrade = async (tier: 'monthly' | 'yearly') => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please sign in or create an account to upgrade your subscription.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: handleLogin }
        ]
      );
      return;
    }

    // Simulate Google Pay payment flow
    Alert.alert(
      'Google Pay',
      `You will be charged ${tier === 'monthly' ? '$5.00' : '$50.00'} for a ${tier} subscription.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Pay Now', 
          onPress: async () => {
            try {
              const success = await upgradeSubscription(tier, 'Google Pay');
              if (success) {
                Alert.alert(
                  'Subscription Activated',
                  `Your ${tier} subscription has been activated successfully!`,
                  [{ text: 'OK', onPress: () => router.push('/') }]
                );
              } else {
                Alert.alert('Error', 'There was a problem processing your payment. Please try again.');
              }
            } catch (error) {
              Alert.alert('Error', 'There was a problem processing your payment. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <AlertCircle size={40} color={Colors.warning} />
        </View>
        
        <Text style={styles.title}>Posting Limit Reached</Text>
        <Text style={styles.message}>
          {isAuthenticated
            ? "You've reached your monthly posting limit. Upgrade your subscription to continue posting."
            : "Guest users are limited to 2 posts every 30 days. Sign in or create an account for more posts."}
        </Text>
        
        <View style={styles.plansContainer}>
          <Text style={styles.plansTitle}>Available Plans</Text>
          
          {!isAuthenticated && (
            <View style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>Free Account</Text>
                <Text style={styles.planPrice}>Free</Text>
              </View>
              <View style={styles.planFeatures}>
                <View style={styles.featureItem}>
                  <CheckCircle size={16} color={Colors.success} />
                  <Text style={styles.featureText}>10 posts every 30 days</Text>
                </View>
                <View style={styles.featureItem}>
                  <CheckCircle size={16} color={Colors.success} />
                  <Text style={styles.featureText}>Save favorite locations</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.planButton}
                onPress={handleRegister}
              >
                <UserPlus size={18} color="#FFFFFF" />
                <Text style={styles.planButtonText}>Create Free Account</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={[styles.planCard, styles.premiumCard]}>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>BEST VALUE</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Premium Monthly</Text>
              <Text style={styles.planPrice}>$5/month</Text>
            </View>
            <View style={styles.planFeatures}>
              <View style={styles.featureItem}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.featureText}>Unlimited posts</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.featureText}>Priority notifications</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.featureText}>Ad-free experience</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.premiumButton}
              onPress={() => handleUpgrade('monthly')}
            >
              <CreditCard size={18} color="#FFFFFF" />
              <Text style={styles.planButtonText}>Subscribe with Google Pay</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.planCard, styles.premiumCard]}>
            <View style={styles.savingBadge}>
              <Text style={styles.savingBadgeText}>SAVE 17%</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Premium Yearly</Text>
              <Text style={styles.planPrice}>$50/year</Text>
            </View>
            <View style={styles.planFeatures}>
              <View style={styles.featureItem}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.featureText}>Unlimited posts</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.featureText}>Priority notifications</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.featureText}>Ad-free experience</Text>
              </View>
              <View style={styles.featureItem}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.featureText}>Annual savings of $10</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.premiumButton}
              onPress={() => handleUpgrade('yearly')}
            >
              <CreditCard size={18} color="#FFFFFF" />
              <Text style={styles.planButtonText}>Subscribe with Google Pay</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {isAuthenticated ? (
          <Text style={styles.paymentInfo}>
            Payments are processed securely through Google Pay. You can cancel your subscription at any time.
          </Text>
        ) : (
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {onDismiss && (
          <TouchableOpacity 
            style={styles.dismissButton}
            onPress={onDismiss}
          >
            <Text style={styles.dismissButtonText}>Continue Browsing</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  plansContainer: {
    width: '100%',
    marginBottom: 16,
  },
  plansTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
  },
  premiumCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  premiumBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  savingBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: Colors.success,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  savingBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  planHeader: {
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  planFeatures: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  planButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  paymentInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginRight: 4,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  dismissButton: {
    padding: 8,
  },
  dismissButtonText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
});