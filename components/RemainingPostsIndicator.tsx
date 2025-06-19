import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import { Clock } from 'lucide-react-native';

interface RemainingPostsIndicatorProps {
  compact?: boolean;
}

export const RemainingPostsIndicator: React.FC<RemainingPostsIndicatorProps> = ({ 
  compact = false 
}) => {
  const { isAuthenticated, getRemainingPosts, getPostLimit } = useUserStore();
  
  const remainingPosts = getRemainingPosts();
  const postLimit = getPostLimit();
  
  // Don't show for premium users with unlimited posts
  if (remainingPosts === Infinity) {
    return null;
  }
  
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Clock size={12} color={remainingPosts < 3 ? Colors.warning : Colors.primary} />
        <Text style={[
          styles.compactText,
          remainingPosts < 3 ? styles.warningText : null
        ]}>
          {remainingPosts} post{remainingPosts !== 1 ? 's' : ''} left
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[
      styles.container,
      remainingPosts < 3 ? styles.warningContainer : styles.normalContainer
    ]}>
      <Clock size={16} color={remainingPosts < 3 ? Colors.warning : Colors.primary} />
      <Text style={[
        styles.text,
        remainingPosts < 3 ? styles.warningText : styles.normalText
      ]}>
        {remainingPosts} of {postLimit} post{postLimit !== 1 ? 's' : ''} remaining this month
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  normalContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  warningContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
  },
  text: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  normalText: {
    color: Colors.primary,
  },
  warningText: {
    color: Colors.warning,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  compactText: {
    fontSize: 12,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
});