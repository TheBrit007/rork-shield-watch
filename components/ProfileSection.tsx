import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import Colors from '@/constants/colors';
import { LogOut, User, Settings, ChevronRight } from 'lucide-react-native';

export const ProfileSection: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useUserStore();
  
  const handleLogout = () => {
    logout();
  };
  
  const handleLogin = () => {
    router.push('/login');
  };

  // Get auth provider badge text
  const getAuthProviderBadge = () => {
    if (!user || !user.authProvider) return null;
    
    switch (user.authProvider) {
      case 'google':
        return 'Google';
      case 'apple':
        return 'Apple';
      default:
        return null;
    }
  };
  
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.guestContainer}>
        <View style={styles.guestIconContainer}>
          <User size={32} color={Colors.textSecondary} />
        </View>
        <View style={styles.guestInfo}>
          <Text style={styles.guestTitle}>Guest User</Text>
          <Text style={styles.guestSubtitle}>Sign in to report sightings</Text>
        </View>
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          {user.avatar ? (
            <Image 
              source={{ uri: user.avatar }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {user.username.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{user.username}</Text>
              {getAuthProviderBadge() && (
                <View style={styles.providerBadge}>
                  <Text style={styles.providerBadgeText}>{getAuthProviderBadge()}</Text>
                </View>
              )}
            </View>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.profileOptions}>
        <TouchableOpacity style={styles.profileOption}>
          <View style={styles.optionLeft}>
            <User size={20} color={Colors.primary} />
            <Text style={styles.optionText}>Edit Profile</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.profileOption}>
          <View style={styles.optionLeft}>
            <Settings size={20} color={Colors.primary} />
            <Text style={styles.optionText}>Account Settings</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.profileOption, styles.logoutOption]}
          onPress={handleLogout}
        >
          <View style={styles.optionLeft}>
            <LogOut size={20} color={Colors.danger} />
            <Text style={[styles.optionText, styles.logoutText]}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  profileHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  providerBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  providerBadgeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  profileOptions: {
    paddingTop: 8,
  },
  profileOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  logoutOption: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    marginTop: 8,
    paddingTop: 16,
  },
  logoutText: {
    color: Colors.danger,
  },
  // Guest styles
  guestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
  },
  guestIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  guestInfo: {
    flex: 1,
  },
  guestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  guestSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});