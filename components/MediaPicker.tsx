import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MediaItem } from '@/types';
import Colors from '@/constants/colors';
import { Camera, Video, X } from 'lucide-react-native';

interface MediaPickerProps {
  media: MediaItem[];
  onMediaChange: (media: MediaItem[]) => void;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({ media, onMediaChange }) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newMedia: MediaItem = {
        uri: result.assets[0].uri,
        type: 'image',
      };
      onMediaChange([...media, newMedia]);
    }
  };

  const pickVideo = async () => {
    // Video picking is not fully supported on web
    if (Platform.OS === 'web') {
      alert('Video upload is not fully supported on web. Please use the mobile app for this feature.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      videoMaxDuration: 60, // 1 minute max
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newMedia: MediaItem = {
        uri: result.assets[0].uri,
        type: 'video',
      };
      onMediaChange([...media, newMedia]);
    }
  };

  const removeMedia = (index: number) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    onMediaChange(updatedMedia);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Photos/Videos</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Camera size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, Platform.OS === 'web' ? styles.disabledButton : null]} 
          onPress={pickVideo}
        >
          <Video size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Add Video</Text>
        </TouchableOpacity>
      </View>
      
      {media.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mediaList}
        >
          {media.map((item, index) => (
            <View key={index} style={styles.mediaItem}>
              <Image 
                source={{ uri: item.uri }} 
                style={styles.mediaPreview} 
              />
              {item.type === 'video' && (
                <View style={styles.videoIndicator}>
                  <Video size={16} color="#FFFFFF" />
                </View>
              )}
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={() => removeMedia(index)}
              >
                <X size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      
      {media.length > 0 && (
        <Text style={styles.mediaCount}>
          {media.length} {media.length === 1 ? 'item' : 'items'} selected
        </Text>
      )}
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
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  mediaList: {
    paddingRight: 8,
  },
  mediaItem: {
    position: 'relative',
    marginRight: 8,
  },
  mediaPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.border,
  },
  videoIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.danger,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});