import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { useReportStore } from '@/store/reportStore';
import { useUserStore } from '@/store/userStore';
import { ReportForm } from '@/components/ReportForm';
import { SubscriptionPrompt } from '@/components/SubscriptionPrompt';
import { MediaItem } from '@/types';
import Colors from '@/constants/colors';
import { MapPin, AlertCircle, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ReportScreen() {
  const router = useRouter();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addReport } = useReportStore();
  const { 
    isAuthenticated, 
    user, 
    canPost,
    getRemainingPosts,
    getPostLimit,
    addPost,
    addAnonymousPost,
    hasSeenWelcome
  } = useUserStore();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
        setIsLoading(false);
        return;
      }
      
      try {
        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        setLocationError('Could not determine your location');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSubmit = (agencyId: string, description: string, media: MediaItem[]) => {
    if (!location) {
      Alert.alert('Error', 'Location data is not available');
      return;
    }
    
    // Check if user can post based on their subscription
    if (!canPost()) {
      return;
    }
    
    // Create the report
    const newReportId = `report-${Date.now()}`;
    
    addReport({
      agencyId,
      latitude: location.latitude,
      longitude: location.longitude,
      description,
      media,
      userId: user?.id,
      username: isAuthenticated ? user?.username : 'Anonymous User',
    });
    
    // Track the post
    if (isAuthenticated) {
      addPost();
    } else {
      addAnonymousPost(newReportId);
    }
    
    Alert.alert(
      'Report Submitted',
      'Thank you for your report. It has been added to the map.',
      [{ text: 'OK', onPress: () => router.push('/') }]
    );
  };

  const handleCancel = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (locationError) {
    return (
      <View style={styles.centerContainer}>
        <AlertCircle size={48} color={Colors.danger} />
        <Text style={styles.errorTitle}>Location Error</Text>
        <Text style={styles.errorText}>{locationError}</Text>
        <Text style={styles.errorHint}>
          To report a sighting, we need access to your location.
          Please enable location services and try again.
        </Text>
        
        {Platform.OS !== 'web' && (
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => router.replace('/report')}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Check if user has reached their posting limit
  const remainingPosts = getRemainingPosts();
  const canPostNow = canPost();
  const postLimit = getPostLimit();

  // Show subscription prompt if user has reached their limit
  if (!canPostNow) {
    return (
      <View style={styles.authContainer}>
        <SubscriptionPrompt 
          isAuthenticated={isAuthenticated}
          onDismiss={() => router.push('/')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {location ? (
          <>
            <View style={styles.postLimitContainer}>
              <Clock size={20} color={remainingPosts < 3 ? Colors.warning : Colors.primary} />
              <Text style={[
                styles.postLimitText, 
                remainingPosts < 3 ? styles.warningText : null
              ]}>
                {remainingPosts === Infinity ? (
                  "Unlimited posts available"
                ) : (
                  `${remainingPosts} of ${postLimit} posts remaining this month`
                )}
              </Text>
            </View>
            <ReportForm
              latitude={location.latitude}
              longitude={location.longitude}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </>
        ) : (
          <View style={styles.centerContainer}>
            <Text>Unable to get your location</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <MapPin size={20} color={Colors.primary} />
          <Text style={styles.infoText}>
            Your report will be added to the map at your current location
          </Text>
        </View>
        
        <View style={styles.infoBox}>
          <AlertCircle size={20} color={Colors.warning} />
          <Text style={styles.infoText}>
            Please only report what you have personally observed
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: Colors.text,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.danger,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorHint: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
    flex: 1,
  },
  postLimitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  postLimitText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: '500',
  },
  warningText: {
    color: Colors.warning,
  },
});