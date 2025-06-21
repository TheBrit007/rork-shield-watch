import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Report } from '@/types';
import { agencies } from '@/mocks/agencies';
import Colors from '@/constants/colors';
import { Shield, Globe, BadgeAlert, Pill, Map, Car, Scale, UserCog } from 'lucide-react-native';

interface MapMarkerProps {
  report: Report;
  isSelected: boolean;
}

// Only define this component for non-web platforms
const getAgencyIcon = (iconName: string, color: string, size: number) => {
  switch (iconName) {
    case 'shield':
      return <Shield size={size} color={color} />;
    case 'globe':
      return <Globe size={size} color={color} />;
    case 'badge':
      return <BadgeAlert size={size} color={color} />;
    case 'pill':
      return <Pill size={size} color={color} />;
    case 'map':
      return <Map size={size} color={color} />;
    case 'car':
      return <Car size={size} color={color} />;
    case 'badge-sheriff':
      return <Scale size={size} color={color} />;
    case 'user-cog':
      return <UserCog size={size} color={color} />;
    default:
      return <Shield size={size} color={color} />;
  }
};

// This component should only be used on native platforms
export const MapMarker: React.FC<MapMarkerProps> = ({ report, isSelected }) => {
  // Web doesn't support native map markers properly
  if (Platform.OS === 'web') {
    return null;
  }
  
  try {
    const agency = agencies.find((a) => a.id === report.agencyId);
    const agencyColor = agency?.color || Colors.primary;
    
    return (
      <View style={styles.container}>
        <View 
          style={[
            styles.marker, 
            { backgroundColor: agencyColor },
            isSelected && styles.selectedMarker,
          ]}
        >
          {isSelected ? (
            getAgencyIcon(agency?.icon || 'shield', '#FFFFFF', 16)
          ) : null}
        </View>
        {isSelected && <View style={styles.shadow} />}
      </View>
    );
  } catch (error) {
    console.error('Error rendering map marker:', error);
    // Return a simple fallback marker
    return (
      <View style={styles.container}>
        <View style={[styles.marker, { backgroundColor: Colors.primary }]} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  selectedMarker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    transform: [{ translateY: -6 }],
    zIndex: 2,
  },
  abbreviation: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  shadow: {
    position: 'absolute',
    bottom: -2,
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: 1,
  },
});