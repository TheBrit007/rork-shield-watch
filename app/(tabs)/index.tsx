import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useReportStore } from '@/store/reportStore';
import { useUserStore } from '@/store/userStore';
import { ReportCard } from '@/components/ReportCard';
import { RemainingPostsIndicator } from '@/components/RemainingPostsIndicator';
import Colors from '@/constants/colors';
import { Coordinates } from '@/types';
import { MapPin, List, Layers, Plus } from 'lucide-react-native';

// Only import MapView and related components for non-web platforms
let MapView: any;
let Marker: any;
let PROVIDER_GOOGLE: any;
let MapMarker: any;

if (Platform.OS !== 'web') {
  try {
    const MapComponents = require('react-native-maps');
    MapView = MapComponents.default;
    Marker = MapComponents.Marker;
    PROVIDER_GOOGLE = MapComponents.PROVIDER_GOOGLE;
    
    const MapMarkerComponent = require('@/components/MapMarker');
    MapMarker = MapMarkerComponent.MapMarker;
  } catch (error) {
    console.error('Error loading map components:', error);
  }
}

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef(null);
  const [showList, setShowList] = useState(Platform.OS === 'web');
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  
  const { 
    reports, 
    selectedReportId, 
    userLocation, 
    mapRegion,
    selectReport, 
    upvoteReport, 
    setUserLocation,
    setMapRegion
  } = useReportStore();
  
  const { isAuthenticated, canPost, getRemainingPosts } = useUserStore();

  useEffect(() => {
    const initializeLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermission(status === 'granted');
        
        if (status === 'granted') {
          try {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
              timeInterval: 5000,
            });
            
            const userCoords: Coordinates = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            };
            
            setUserLocation(userCoords);
            setMapRegion(userCoords);
          } catch (locationError) {
            console.error('Error getting location:', locationError);
            // Don't set an error message here, just use default location
          }
        }
      } catch (error) {
        console.error('Error requesting location permissions:', error);
        setMapError('Unable to access location services. Please check your permissions.');
      }
    };

    initializeLocation();
  }, []);

  const handleMarkerPress = (reportId: string) => {
    selectReport(reportId);
    
    const report = reports.find(r => r.id === reportId);
    if (report && mapRef.current && Platform.OS !== 'web') {
      try {
        // Use optional chaining to safely call animateToRegion
        (mapRef.current as any)?.animateToRegion?.({
          latitude: report.latitude,
          longitude: report.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }, 500);
      } catch (error) {
        console.error('Error animating map:', error);
      }
    }
  };

  const handleReportPress = (reportId: string) => {
    router.push(`/report/${reportId}`);
  };

  const handleUpvote = (reportId: string) => {
    upvoteReport(reportId);
  };

  const goToUserLocation = () => {
    if (!userLocation) {
      Alert.alert('Location Error', 'Unable to access your location. Please check your permissions.');
      return;
    }
    
    if (mapRef.current && Platform.OS !== 'web') {
      try {
        // Use optional chaining to safely call animateToRegion
        (mapRef.current as any)?.animateToRegion?.(userLocation, 500);
      } catch (error) {
        console.error('Error animating to user location:', error);
      }
    }
  };
  
  const handleAddReport = () => {
    router.push('/report');
  };

  const selectedReport = reports.find(r => r.id === selectedReportId);
  const remainingPosts = getRemainingPosts();

  // If there's a map error or we're on web, always show the list view
  const shouldShowList = showList || Platform.OS === 'web' || !!mapError;

  return (
    <View style={styles.container}>
      {Platform.OS !== 'web' && !mapError && MapView ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={mapRegion}
          onRegionChangeComplete={setMapRegion}
          showsUserLocation={locationPermission === true}
          showsMyLocationButton={false}
        >
          {reports.map((report) => (
            <Marker
              key={report.id}
              coordinate={{
                latitude: report.latitude,
                longitude: report.longitude,
              }}
              onPress={() => handleMarkerPress(report.id)}
            >
              {MapMarker && (
                <MapMarker 
                  report={report} 
                  isSelected={report.id === selectedReportId} 
                />
              )}
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.webMapFallback}>
          <Text style={styles.webMapText}>
            {mapError || "Map view is not available. Please use the list view to see reports."}
          </Text>
          <TouchableOpacity 
            style={styles.webListButton}
            onPress={() => setShowList(true)}
          >
            <List size={20} color="#FFFFFF" />
            <Text style={styles.webListButtonText}>Show List View</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.title}>Law Enforcement Sightings</Text>
          <TouchableOpacity 
            style={styles.listButton}
            onPress={() => setShowList(!showList)}
          >
            {shouldShowList ? (
              <Layers size={24} color={Colors.text} />
            ) : (
              <List size={24} color={Colors.text} />
            )}
          </TouchableOpacity>
        </View>

        {remainingPosts !== Infinity && remainingPosts < 3 && !shouldShowList && (
          <View style={styles.anonymousIndicator}>
            <RemainingPostsIndicator compact />
          </View>
        )}

        {shouldShowList && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>Recent Reports</Text>
            <View style={styles.reportsList}>
              {reports.slice(0, 10).map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onPress={() => handleReportPress(report.id)}
                  onUpvote={() => handleUpvote(report.id)}
                  compact
                />
              ))}
            </View>
          </View>
        )}

        {selectedReport && !shouldShowList && Platform.OS !== 'web' && (
          <View style={styles.selectedReportContainer}>
            <ReportCard
              report={selectedReport}
              onPress={() => handleReportPress(selectedReport.id)}
              onUpvote={() => handleUpvote(selectedReport.id)}
            />
          </View>
        )}

        {!shouldShowList && Platform.OS !== 'web' && (
          <>
            <TouchableOpacity 
              style={styles.locationButton}
              onPress={goToUserLocation}
            >
              <MapPin size={24} color={Colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddReport}
            >
              <Plus size={24} color="#FFFFFF" />
              {!canPost() && (
                <View style={styles.authIndicator} />
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  listButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 80,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  authIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.warning,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  selectedReportContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 144, // Adjusted to account for both buttons
  },
  listContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  reportsList: {
    flex: 1,
  },
  webMapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 20,
  },
  webMapText: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  webListButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  webListButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  anonymousIndicator: {
    position: 'absolute',
    top: 70,
    right: 16,
    zIndex: 10,
  },
});