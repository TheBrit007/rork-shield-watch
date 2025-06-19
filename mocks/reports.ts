import { Report, MediaItem } from '@/types';

export const generateMockReports = (): Report[] => {
  // Los Angeles area coordinates
  const baseLatitude = 34.0522;
  const baseLongitude = -118.2437;
  
  const reports: Report[] = [];
  
  // Mock usernames for reports
  const usernames = ['observer1', 'citizen_watch', 'community_alert', 'eyewitness', 'vigilant_user'];
  
  for (let i = 0; i < 15; i++) {
    // Random coordinates within ~5 miles of LA
    const latOffset = (Math.random() - 0.5) * 0.15;
    const lngOffset = (Math.random() - 0.5) * 0.15;
    
    // Generate random media for some reports
    const hasMedia = Math.random() > 0.6;
    const media: MediaItem[] = [];
    
    if (hasMedia) {
      // Add 1-3 random images
      const mediaCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < mediaCount; j++) {
        const isVideo = Math.random() > 0.7;
        const randomId = Math.floor(Math.random() * 1000);
        
        media.push({
          uri: isVideo 
            ? `https://example.com/video-${randomId}.mp4` // Placeholder URL
            : `https://picsum.photos/id/${randomId}/400/300`, // Random image from Lorem Picsum
          type: isVideo ? 'video' : 'image',
        });
      }
    }
    
    // Add user info to some reports
    const hasUser = Math.random() > 0.4;
    const userId = hasUser ? `user-${i + 1}` : undefined;
    const username = hasUser ? usernames[Math.floor(Math.random() * usernames.length)] : undefined;
    
    const report: Report = {
      id: `report-${i + 1}`,
      agencyId: String(Math.floor(Math.random() * 8) + 1),
      latitude: baseLatitude + latOffset,
      longitude: baseLongitude + lngOffset,
      description: getRandomDescription(),
      timestamp: Date.now() - Math.floor(Math.random() * 86400000 * 7), // Within last week
      upvotes: Math.floor(Math.random() * 50),
      verified: Math.random() > 0.7,
      media: media,
      userId,
      username,
    };
    
    reports.push(report);
  }
  
  return reports;
};

const descriptions = [
  "Two officers patrolling on foot",
  "Unmarked vehicle parked outside building",
  "Multiple vehicles with lights on",
  "Checkpoint set up on main road",
  "Officers questioning people at bus stop",
  "Surveillance van parked for several hours",
  "Agents entering apartment building",
  "Patrol car monitoring traffic",
  "Officers conducting ID checks",
  "Helicopter circling overhead",
];

const getRandomDescription = (): string => {
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};