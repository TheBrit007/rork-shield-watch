import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  useWindowDimensions,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import { LogIn, UserPlus, Eye, Shield } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { initializeDeviceId, setHasSeenWelcome } = useUserStore();
  
  useEffect(() => {
    // Initialize device ID for anonymous users
    initializeDeviceId();
  }, []);
  
  const handleContinueAsGuest = () => {
    setHasSeenWelcome(true);
    router.replace('/');
  };
  
  const handleLogin = () => {
    router.push('/login');
  };
  
  const handleSignUp = () => {
    router.push('/register');
  };

  return (
    <>
      <StatusBar style="dark" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Shield size={60} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Law Enforcement Sightings</Text>
          <Text style={styles.subtitle}>Community-powered awareness</Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Eye size={24} color={Colors.primary} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Real-time Sightings</Text>
              <Text style={styles.featureDescription}>
                View real-time reports of law enforcement activity in your area
              </Text>
            </View>
          </View>
          
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
              <Shield size={24} color={Colors.secondary} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Community Reporting</Text>
              <Text style={styles.featureDescription}>
                Contribute to the community by reporting sightings you observe
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.subscriptionInfo}>
          <Text style={styles.subscriptionTitle}>Choose Your Plan</Text>
          
          <View style={styles.planCard}>
            <Text style={styles.planName}>Guest</Text>
            <Text style={styles.planPrice}>Free</Text>
            <Text style={styles.planFeature}>• 2 posts every 30 days</Text>
            <Text style={styles.planFeature}>• Basic access</Text>
          </View>
          
          <View style={styles.planCard}>
            <Text style={styles.planName}>Free Account</Text>
            <Text style={styles.planPrice}>Free</Text>
            <Text style={styles.planFeature}>• 10 posts every 30 days</Text>
            <Text style={styles.planFeature}>• Save favorite locations</Text>
          </View>
          
          <View style={[styles.planCard, styles.premiumCard]}>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>
            <Text style={styles.planName}>Premium</Text>
            <Text style={styles.planPrice}>$5/month or $50/year</Text>
            <Text style={styles.planFeature}>• Unlimited posts</Text>
            <Text style={styles.planFeature}>• Priority notifications</Text>
            <Text style={styles.planFeature}>• Ad-free experience</Text>
          </View>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={styles.guestButton}
            onPress={handleContinueAsGuest}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
            <Text style={styles.guestButtonSubtext}>Limited to 2 posts every 30 days</Text>
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <LogIn size={20} color="#FFFFFF" />
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.signupButton}
            onPress={handleSignUp}
          >
            <UserPlus size={20} color={Colors.primary} />
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  subscriptionInfo: {
    marginBottom: 32,
  },
  subscriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
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
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
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
    marginBottom: 12,
  },
  planFeature: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  guestButton: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  guestButtonSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  signupButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  signupButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  termsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});