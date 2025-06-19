import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Report, Coordinates, MediaItem } from '@/types';
import { generateMockReports } from '@/mocks/reports';

interface ReportState {
  reports: Report[];
  selectedReportId: string | null;
  userLocation: Coordinates | null;
  mapRegion: Coordinates;
  
  addReport: (report: Omit<Report, 'id' | 'timestamp' | 'upvotes' | 'verified'>) => void;
  upvoteReport: (id: string) => void;
  selectReport: (id: string | null) => void;
  setUserLocation: (location: Coordinates | null) => void;
  setMapRegion: (region: Coordinates) => void;
}

// Default map region (Los Angeles)
const DEFAULT_REGION: Coordinates = {
  latitude: 34.0522,
  longitude: -118.2437,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export const useReportStore = create<ReportState>()(
  persist(
    (set) => ({
      reports: generateMockReports(),
      selectedReportId: null,
      userLocation: null,
      mapRegion: DEFAULT_REGION,
      
      addReport: (reportData) => set((state) => {
        const newReport: Report = {
          ...reportData,
          id: `report-${Date.now()}`,
          timestamp: Date.now(),
          upvotes: 0,
          verified: false,
          media: reportData.media || [],
        };
        
        return { reports: [newReport, ...state.reports] };
      }),
      
      upvoteReport: (id) => set((state) => ({
        reports: state.reports.map((report) => 
          report.id === id ? { ...report, upvotes: report.upvotes + 1 } : report
        ),
      })),
      
      selectReport: (id) => set({ selectedReportId: id }),
      
      setUserLocation: (location) => set({ userLocation: location }),
      
      setMapRegion: (region) => set({ mapRegion: region }),
    }),
    {
      name: 'report-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ reports: state.reports }),
    }
  )
);