import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReportStore } from '@/store/reportStore';
import { useUserStore } from '@/store/userStore';
import { agencies } from '@/mocks/agencies';
import { MediaGallery } from '@/components/MediaGallery';
import Colors from '@/constants/colors';
import { ThumbsUp, Clock, MapPin, CheckCircle, Flag, Share2, Camera, Shield, Globe, BadgeAlert, Pill, Map, Car, Scale, UserCog, User } from 'lucide-react-native';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { reports, upvoteReport } = useReportStore();
  const { isAuthenticated } = useUserStore();
  
  const report = reports.find(r => r.id === id);
  const agency = report ? agencies.find(a => a.id === report.agencyId) : null;
  
  if (!report || !agency) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Report not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const formattedDate = () => {
    const date = new Date(report.timestamp);
    return date.toLocaleString();
  };
  
  const handleUpvote = () => {
    upvoteReport(report.id);
  };
  
  const handleShare = () => {
    Alert.alert('Share', 'Sharing functionality would be implemented here');
  };
  
  const handleReport = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'You need to be signed in to report content',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    
    Alert.alert(
      'Report Content',
      'Do you want to report this content as inappropriate or inaccurate?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', style: 'destructive' },
      ]
    );
  };

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.agencyHeader}>
            <View style={[styles.agencyBadge, { backgroundColor: agency.color }]}>
              {getAgencyIcon(agency.icon, '#FFFFFF', 24)}
            </View>
            <Text style={styles.agencyName}>{agency.name}</Text>
          </View>
          {report.verified && (
            <View style={styles.verifiedBadge}>
              <CheckCircle size={14} color={Colors.success} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        
        {report.username && (
          <View style={styles.reporterContainer}>
            <User size={16} color={Colors.textSecondary} />
            <Text style={styles.reporterText}>Reported by {report.username}</Text>
          </View>
        )}
        
        <Text style={styles.description}>{report.description}</Text>
        
        {report.media && report.media.length > 0 && (
          <MediaGallery media={report.media} />
        )}
        
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <Clock size={16} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{formattedDate()}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <MapPin size={16} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
            </Text>
          </View>
          
          {report.media && report.media.length > 0 && (
            <View style={styles.metaItem}>
              <Camera size={16} color={Colors.textSecondary} />
              <Text style={styles.metaText}>
                {report.media.length} {report.media.length === 1 ? 'media item' : 'media items'} attached
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>
            {Platform.OS === 'web' 
              ? 'Map view not available on web' 
              : 'Map view would be displayed here'}
          </Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleUpvote}>
          <ThumbsUp size={20} color={Colors.primary} />
          <Text style={styles.actionText}>Upvote ({report.upvotes})</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color={Colors.text} />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleReport}>
          <Flag size={20} color={Colors.danger} />
          <Text style={[styles.actionText, { color: Colors.danger }]}>Report</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>About This Report</Text>
        <Text style={styles.infoText}>
          This report was submitted by a community member. Reports are not verified by default unless multiple users confirm the same sighting.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  agencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  agencyBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  agencyName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.success,
    marginLeft: 4,
  },
  reporterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reporterText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  metaInfo: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 0,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.card,
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    margin: 16,
    padding: 16,
    marginTop: 0,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});