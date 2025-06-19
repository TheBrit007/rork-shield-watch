import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Report } from '@/types';
import { agencies } from '@/mocks/agencies';
import Colors from '@/constants/colors';
import { ThumbsUp, Clock, MapPin, CheckCircle, Camera, Shield, Globe, BadgeAlert, Pill, Map, Car, Scale, UserCog, User } from 'lucide-react-native';

interface ReportCardProps {
  report: Report;
  onPress: () => void;
  onUpvote: () => void;
  compact?: boolean;
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

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onPress,
  onUpvote,
  compact = false,
}) => {
  const agency = agencies.find((a) => a.id === report.agencyId);
  
  const formattedTime = () => {
    const now = Date.now();
    const diff = now - report.timestamp;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const hasMedia = report.media && report.media.length > 0;

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={onPress}>
        <View style={[styles.agencyIndicator, { backgroundColor: agency?.color || Colors.primary }]} />
        <View style={styles.compactContent}>
          <View style={styles.compactAgencyContainer}>
            <View style={[styles.compactAgencyIcon, { backgroundColor: agency?.color || Colors.primary }]}>
              {getAgencyIcon(agency?.icon || 'shield', '#FFFFFF', 12)}
            </View>
            <Text style={styles.compactAgency}>{agency?.abbreviation || 'Unknown'}</Text>
            
            {report.username && (
              <View style={styles.compactUserContainer}>
                <User size={10} color={Colors.textSecondary} />
                <Text style={styles.compactUsername}>{report.username}</Text>
              </View>
            )}
          </View>
          <Text style={styles.compactDescription} numberOfLines={1}>
            {report.description}
          </Text>
          <View style={styles.compactFooter}>
            <Clock size={12} color={Colors.textSecondary} />
            <Text style={styles.compactTime}>{formattedTime()}</Text>
            <View style={styles.compactUpvotes}>
              <ThumbsUp size={12} color={Colors.textSecondary} />
              <Text style={styles.compactUpvoteCount}>{report.upvotes}</Text>
            </View>
            {hasMedia && (
              <View style={styles.compactMedia}>
                <Camera size={12} color={Colors.textSecondary} />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.agencyContainer}>
          <View style={[styles.agencyIconContainer, { backgroundColor: agency?.color || Colors.primary }]}>
            {getAgencyIcon(agency?.icon || 'shield', '#FFFFFF', 16)}
          </View>
          <Text style={styles.agencyName}>{agency?.name || 'Unknown Agency'}</Text>
        </View>
        {report.verified && (
          <View style={styles.verifiedBadge}>
            <CheckCircle size={14} color={Colors.success} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
      </View>
      
      {report.username && (
        <View style={styles.userContainer}>
          <User size={14} color={Colors.textSecondary} />
          <Text style={styles.username}>Reported by {report.username}</Text>
        </View>
      )}
      
      <Text style={styles.description}>{report.description}</Text>
      
      {hasMedia && (
        <View style={styles.mediaPreviewContainer}>
          <Image 
            source={{ uri: report.media[0].uri }} 
            style={styles.mediaPreview} 
          />
          {report.media.length > 1 && (
            <View style={styles.mediaCountBadge}>
              <Text style={styles.mediaCountText}>+{report.media.length - 1}</Text>
            </View>
          )}
        </View>
      )}
      
      <View style={styles.footer}>
        <View style={styles.locationTime}>
          <View style={styles.iconText}>
            <MapPin size={14} color={Colors.textSecondary} />
            <Text style={styles.locationText}>
              {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
            </Text>
          </View>
          <View style={styles.iconText}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.timeText}>{formattedTime()}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.upvoteButton} onPress={onUpvote}>
          <ThumbsUp size={16} color={Colors.primary} />
          <Text style={styles.upvoteCount}>{report.upvotes}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  agencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agencyIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  agencyName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.success,
    marginLeft: 4,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  username: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  description: {
    fontSize: 15,
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  mediaPreviewContainer: {
    position: 'relative',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
  },
  mediaCountBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mediaCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationTime: {
    flex: 1,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  timeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  upvoteCount: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 6,
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  agencyIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  compactContent: {
    flex: 1,
  },
  compactAgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  compactAgencyIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  compactAgency: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  compactUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  compactUsername: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginLeft: 3,
  },
  compactDescription: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 6,
  },
  compactFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactTime: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4,
    marginRight: 12,
  },
  compactUpvotes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactUpvoteCount: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4,
    marginRight: 12,
  },
  compactMedia: {
    marginLeft: 4,
  },
});