import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Platform, ScrollView } from 'react-native';
import { MediaItem } from '@/types';
import Colors from '@/constants/colors';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';

interface MediaGalleryProps {
  media: MediaItem[];
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!media || media.length === 0) {
    return null;
  }

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setModalVisible(true);
  };

  const navigateMedia = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1));
    } else {
      setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evidence ({media.length})</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mediaList}
      >
        {media.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.mediaThumbnail}
            onPress={() => openGallery(index)}
          >
            <Image source={{ uri: item.uri }} style={styles.thumbnailImage} />
            {item.type === 'video' && (
              <View style={styles.videoIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {Platform.OS !== 'web' && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.mediaContainer}>
              <Image 
                source={{ uri: media[currentIndex]?.uri }} 
                style={styles.fullImage}
                resizeMode="contain"
              />
              
              {media.length > 1 && (
                <>
                  <TouchableOpacity 
                    style={[styles.navButton, styles.prevButton]}
                    onPress={() => navigateMedia('prev')}
                  >
                    <ChevronLeft size={30} color="#FFFFFF" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.navButton, styles.nextButton]}
                    onPress={() => navigateMedia('next')}
                  >
                    <ChevronRight size={30} color="#FFFFFF" />
                  </TouchableOpacity>
                </>
              )}
            </View>
            
            <Text style={styles.mediaCounter}>
              {currentIndex + 1} / {media.length}
            </Text>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  mediaList: {
    paddingRight: 8,
  },
  mediaThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 255, 255, 0.8)',
    transform: [{ rotate: '90deg' }],
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  mediaContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  navButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
  mediaCounter: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
  },
});