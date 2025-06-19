import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Agency } from '@/types';
import { agencies } from '@/mocks/agencies';
import Colors from '@/constants/colors';
import { Shield, Globe, BadgeAlert, Pill, Map, Car, UserCog, Scale } from 'lucide-react-native';

interface AgencySelectorProps {
  selectedAgencyId: string;
  onSelectAgency: (agencyId: string) => void;
}

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

export const AgencySelector: React.FC<AgencySelectorProps> = ({
  selectedAgencyId,
  onSelectAgency,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Agency</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {agencies.map((agency) => (
          <TouchableOpacity
            key={agency.id}
            style={[
              styles.agencyItem,
              selectedAgencyId === agency.id && styles.selectedAgency,
            ]}
            onPress={() => onSelectAgency(agency.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: agency.color }]}>
              {getAgencyIcon(agency.icon, '#FFFFFF', 24)}
            </View>
            <Text style={styles.abbreviation}>{agency.abbreviation}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  scrollContent: {
    paddingRight: 16,
  },
  agencyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  selectedAgency: {
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  abbreviation: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
});