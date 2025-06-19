import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AgencySelector } from './AgencySelector';
import { MediaPicker } from './MediaPicker';
import { MediaItem } from '@/types';
import Colors from '@/constants/colors';
import { Send, X } from 'lucide-react-native';

interface ReportFormProps {
  latitude: number;
  longitude: number;
  onSubmit: (agencyId: string, description: string, media: MediaItem[]) => void;
  onCancel: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  latitude,
  longitude,
  onSubmit,
  onCancel,
}) => {
  const [selectedAgencyId, setSelectedAgencyId] = useState('1');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<MediaItem[]>([]);

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description of what you observed');
      return;
    }
    
    onSubmit(selectedAgencyId, description, media);
  };

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Report Sighting</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onCancel}>
            <X size={20} color={Colors.text} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.coordinates}>
          Location: {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </Text>
        
        <AgencySelector
          selectedAgencyId={selectedAgencyId}
          onSelectAgency={setSelectedAgencyId}
        />
        
        <MediaPicker 
          media={media}
          onMediaChange={setMedia}
        />
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe what you observed..."
            placeholderTextColor={Colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Send size={20} color="#FFFFFF" />
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    padding: 4,
  },
  coordinates: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: Colors.text,
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});