import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert, Linking } from 'react-native';
import Colors from '@/constants/colors';
import { Bell, Shield, MapPin, Info, ExternalLink, Trash2, CreditCard, CheckCircle } from 'lucide-react-native';
import { useReportStore } from '@/store/reportStore';
import { useUserStore } from '@/store/userStore';
import { ProfileSection } from '@/components/ProfileSection';
import { SubscriptionTier } from '@/types';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [locationEnabled, setLocationEnabled] = React.useState(true);
  const [showSubscriptionOptions, setShowSubscriptionOptions] = useState(false);
  
  const { reports } = useReportStore();
  const { 
    isAuthenticated, 
    user, 
    upgradeSubscription, 
    getRemainingPosts, 
    getPostLimit 
  } = useUserStore();
  
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all reports? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: () => {
            // In a real app, we would clear the store here
            Alert.alert('Data Cleared', 'All reports have been removed');
          }
        },
      ]
    );
  };
  
  const openPrivacyPolicy = () => {
    Linking.openURL('https://example.com/privacy');
  };
  
  const openTermsOfService = () => {
    Linking.openURL('https://example.com/terms');
  };

  const handleUpgrade = (tier: SubscriptionTier) => {
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
                  [{ text: 'OK' }]
                );
                setShowSubscriptionOptions(false);
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

  const renderSubscriptionStatus = () => {
    if (!isAuthenticated || !user) return null;

    const { subscription } = user;
    const remainingPosts = getRemainingPosts();
    const postLimit = getPostLimit();

    return (
      <View style={styles.subscriptionContainer}>
        <View style={styles.subscriptionHeader}>
          <Text style={styles.subscriptionTitle}>Subscription Status</Text>
          {subscription.tier !== 'monthly' && subscription.tier !== 'yearly' && (
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => setShowSubscriptionOptions(true)}
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[
          styles.subscriptionCard,
          subscription.tier === 'free' ? styles.freeCard : styles.premiumCard
        ]}>
          <View style={styles.tierInfo}>
            <Text style={styles.tierName}>
              {subscription.tier === 'free' ? 'Free Account' : 
               subscription.tier === 'monthly' ? 'Premium Monthly' : 'Premium Yearly'}
            </Text>
            {(subscription.tier === 'monthly' || subscription.tier === 'yearly') && (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>PREMIUM</Text>
              </View>
            )}
          </View>

          <View style={styles.usageInfo}>
            <Text style={styles.usageText}>
              {remainingPosts === Infinity ? (
                "Unlimited posts available"
              ) : (
                `${remainingPosts} of ${postLimit} posts remaining this month`
              )}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${remainingPosts === Infinity ? 100 : (remainingPosts / postLimit) * 100}%`,
                    backgroundColor: remainingPosts === Infinity ? 
                      Colors.success : 
                      remainingPosts < 3 ? Colors.warning : Colors.primary
                  }
                ]} 
              />
            </View>
          </View>

          {subscription.tier === 'monthly' || subscription.tier === 'yearly' ? (
            <View style={styles.subscriptionDetails}>
              <Text style={styles.detailText}>
                Renews: {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
              </Text>
              <Text style={styles.detailText}>
                Payment: {subscription.paymentMethod || 'Google Pay'}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const renderSubscriptionOptions = () => {
    if (!showSubscriptionOptions) return null;

    return (
      <View style={styles.subscriptionOptionsContainer}>
        <View style={styles.optionsHeader}>
          <Text style={styles.optionsTitle}>Upgrade Your Subscription</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowSubscriptionOptions(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

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

        <Text style={styles.paymentInfo}>
          Payments are processed securely through Google Pay. You can cancel your subscription at any time.
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ProfileSection />
      
      {isAuthenticated && renderSubscriptionStatus()}
      {isAuthenticated && renderSubscriptionOptions()}
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{reports.length}</Text>
          <Text style={styles.statLabel}>Reports</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {reports.reduce((sum, report) => sum + report.upvotes, 0)}
          </Text>
          <Text style={styles.statLabel}>Upvotes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {reports.filter(r => r.verified).length}
          </Text>
          <Text style={styles.statLabel}>Verified</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Preferences</Text>
      
      <View style={styles.settingsGroup}>
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={20} color={Colors.primary} />
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <MapPin size={20} color={Colors.primary} />
            <Text style={styles.settingLabel}>Location Services</Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>About</Text>
      
      <View style={styles.settingsGroup}>
        <TouchableOpacity style={styles.settingButton} onPress={openPrivacyPolicy}>
          <View style={styles.settingInfo}>
            <Shield size={20} color={Colors.primary} />
            <Text style={styles.settingLabel}>Privacy Policy</Text>
          </View>
          <ExternalLink size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingButton} onPress={openTermsOfService}>
          <View style={styles.settingInfo}>
            <Info size={20} color={Colors.primary} />
            <Text style={styles.settingLabel}>Terms of Service</Text>
          </View>
          <ExternalLink size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {isAuthenticated && (
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
            <Trash2 size={20} color={Colors.danger} />
            <Text style={styles.dangerText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    margin: 16,
    marginTop: 8,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  settingsGroup: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  dangerZone: {
    margin: 16,
    marginTop: 32,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.danger,
    marginBottom: 8,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  dangerText: {
    fontSize: 16,
    color: Colors.danger,
    marginLeft: 12,
  },
  versionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: 24,
  },
  // Subscription styles
  subscriptionContainer: {
    margin: 16,
    marginTop: 8,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  upgradeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  subscriptionCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  freeCard: {
    borderColor: Colors.border,
  },
  premiumCard: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  tierInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  premiumBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  usageInfo: {
    marginBottom: 12,
  },
  usageText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  subscriptionDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  detailText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  // Subscription options styles
  subscriptionOptionsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 16,
  },
  optionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  planCard: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
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
  paymentInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});