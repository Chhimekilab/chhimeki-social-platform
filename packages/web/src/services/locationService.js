// Location and Neighborhood Service
// Handles all location-based features for neighborhood app functionality

class LocationService {
  constructor() {
    this.userLocation = null;
    this.currentNeighborhood = null;
  }

  // ==========================================
  // LOCATION MANAGEMENT
  // ==========================================

  // Get user's current location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          this.userLocation = location;
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }

  // Verify address using geocoding
  async verifyAddress(address) {
    try {
      // In production, use a real geocoding service like Google Maps API
      const mockVerification = {
        isValid: true,
        standardizedAddress: {
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country,
          latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
          longitude: -122.4194 + (Math.random() - 0.5) * 0.1
        },
        confidence: 0.95
      };
      
      return mockVerification;
    } catch (error) {
      console.error('Address verification failed:', error);
      return { isValid: false, error: error.message };
    }
  }

  // Save user location
  async saveUserLocation(locationData) {
    try {
      // In production, this would save to database
      const userLocation = {
        id: `loc_${Date.now()}`,
        userId: 'current_user',
        ...locationData,
        isVerified: locationData.verificationMethod !== 'self_reported',
        verificationDate: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.userLocation = userLocation;
      return userLocation;
    } catch (error) {
      console.error('Failed to save location:', error);
      throw error;
    }
  }

  // ==========================================
  // NEIGHBORHOOD MANAGEMENT
  // ==========================================

  // Get all neighborhoods
  async getNeighborhoods(city = 'San Francisco', state = 'CA') {
    try {
      // Mock neighborhood data
      const neighborhoods = [
        {
          id: 'nb_1',
          name: 'Downtown',
          description: 'Urban center with businesses and nightlife',
          city: 'San Francisco',
          state: 'CA',
          centerLat: 37.7749,
          centerLng: -122.4194,
          radiusMiles: 1.5,
          population: 15000,
          safetyRating: 4.2,
          isActive: true
        },
        {
          id: 'nb_2',
          name: 'Mission District',
          description: 'Vibrant arts and culture neighborhood',
          city: 'San Francisco',
          state: 'CA',
          centerLat: 37.7599,
          centerLng: -122.4148,
          radiusMiles: 2.0,
          population: 45000,
          safetyRating: 4.0,
          isActive: true
        },
        {
          id: 'nb_3',
          name: 'Castro',
          description: 'Historic LGBTQ+ neighborhood',
          city: 'San Francisco',
          state: 'CA',
          centerLat: 37.7609,
          centerLng: -122.4350,
          radiusMiles: 1.2,
          population: 8000,
          safetyRating: 4.5,
          isActive: true
        },
        {
          id: 'nb_4',
          name: 'Chinatown',
          description: 'Historic Chinese cultural district',
          city: 'San Francisco',
          state: 'CA',
          centerLat: 37.7941,
          centerLng: -122.4078,
          radiusMiles: 0.6,
          population: 10000,
          safetyRating: 4.3,
          isActive: true
        },
        {
          id: 'nb_5',
          name: 'North Beach',
          description: 'Italian heritage neighborhood',
          city: 'San Francisco',
          state: 'CA',
          centerLat: 37.8067,
          centerLng: -122.4103,
          radiusMiles: 1.2,
          population: 12000,
          safetyRating: 4.4,
          isActive: true
        }
      ];

      return neighborhoods.filter(n => n.city === city && n.state === state);
    } catch (error) {
      console.error('Failed to get neighborhoods:', error);
      return [];
    }
  }

  // Find nearest neighborhood
  async findNearestNeighborhood(latitude, longitude) {
    try {
      const neighborhoods = await this.getNeighborhoods();
      
      let nearest = null;
      let minDistance = Infinity;

      neighborhoods.forEach(neighborhood => {
        const distance = this.calculateDistance(
          latitude, longitude,
          neighborhood.centerLat, neighborhood.centerLng
        );
        
        if (distance < minDistance && distance <= neighborhood.radiusMiles) {
          minDistance = distance;
          nearest = neighborhood;
        }
      });

      this.currentNeighborhood = nearest;
      return nearest;
    } catch (error) {
      console.error('Failed to find nearest neighborhood:', error);
      return null;
    }
  }

  // Get neighborhood members
  async getNeighborhoodMembers(neighborhoodId, limit = 20) {
    try {
      // Mock neighborhood members
      const members = [
        {
          id: 'user_1',
          fullName: 'Sarah Chen',
          avatar: 'SC',
          joinedAt: '2024-01-10',
          verified: true,
          role: 'member',
          activityLevel: 'high'
        },
        {
          id: 'user_2',
          fullName: 'Alex Rodriguez',
          avatar: 'AR',
          joinedAt: '2024-01-05',
          verified: true,
          role: 'moderator',
          activityLevel: 'medium'
        },
        {
          id: 'user_3',
          fullName: 'Maya Patel',
          avatar: 'MP',
          joinedAt: '2024-01-15',
          verified: false,
          role: 'member',
          activityLevel: 'low'
        }
      ];

      return members.slice(0, limit);
    } catch (error) {
      console.error('Failed to get neighborhood members:', error);
      return [];
    }
  }

  // ==========================================
  // PROXIMITY FEATURES
  // ==========================================

  // Calculate distance between two points (in miles)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  toRad(degrees) {
    return degrees * (Math.PI/180);
  }

  // Find nearby users
  async findNearbyUsers(radiusMiles = 2, limit = 10) {
    try {
      if (!this.userLocation) {
        throw new Error('User location not available');
      }

      // Mock nearby users
      const nearbyUsers = [
        {
          id: 'nearby_1',
          fullName: 'John Smith',
          avatar: 'JS',
          distance: 0.3,
          neighborhood: 'Downtown',
          lastSeen: '2m ago'
        },
        {
          id: 'nearby_2',
          fullName: 'Lisa Wong',
          avatar: 'LW',
          distance: 0.7,
          neighborhood: 'Downtown',
          lastSeen: '15m ago'
        },
        {
          id: 'nearby_3',
          fullName: 'Mike Johnson',
          avatar: 'MJ',
          distance: 1.2,
          neighborhood: 'Mission District',
          lastSeen: '1h ago'
        }
      ];

      return nearbyUsers
        .filter(user => user.distance <= radiusMiles)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to find nearby users:', error);
      return [];
    }
  }

  // Find nearby events
  async findNearbyEvents(radiusMiles = 5, limit = 10) {
    try {
      const events = [
        {
          id: 'event_1',
          title: 'Community Clean-up Day',
          description: 'Join us for a neighborhood clean-up',
          date: '2024-02-15',
          time: '10:00 AM',
          location: 'Mission Dolores Park',
          distance: 0.8,
          attendees: 45,
          type: 'community'
        },
        {
          id: 'event_2',
          title: 'Local Business Fair',
          description: 'Support local businesses',
          date: '2024-02-20',
          time: '2:00 PM',
          location: 'Union Square',
          distance: 1.2,
          attendees: 120,
          type: 'business'
        },
        {
          id: 'event_3',
          title: 'Neighborhood Watch Meeting',
          description: 'Monthly safety meeting',
          date: '2024-02-10',
          time: '7:00 PM',
          location: 'Community Center',
          distance: 0.5,
          attendees: 25,
          type: 'safety'
        }
      ];

      return events
        .filter(event => event.distance <= radiusMiles)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to find nearby events:', error);
      return [];
    }
  }

  // ==========================================
  // LOCATION PRIVACY
  // ==========================================

  // Update location privacy settings
  async updateLocationPrivacy(privacyLevel) {
    try {
      const validLevels = ['private', 'neighborhood', 'city', 'public'];
      if (!validLevels.includes(privacyLevel)) {
        throw new Error('Invalid privacy level');
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, privacyLevel };
    } catch (error) {
      console.error('Failed to update location privacy:', error);
      throw error;
    }
  }

  // Check if user can see another user's location
  canSeeLocation(targetUser, currentUser) {
    if (!targetUser.location || !targetUser.location.privacyLevel) {
      return false;
    }

    switch (targetUser.location.privacyLevel) {
      case 'private':
        return false;
      case 'neighborhood':
        return targetUser.neighborhoodId === currentUser.neighborhoodId;
      case 'city':
        return targetUser.city === currentUser.city;
      case 'public':
        return true;
      default:
        return false;
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  // Get location display string
  getLocationDisplay(location, privacyLevel = 'neighborhood') {
    if (!location) return 'Location not set';

    switch (privacyLevel) {
      case 'private':
        return 'Private';
      case 'neighborhood':
        return location.neighborhood || `${location.city}, ${location.state}`;
      case 'city':
        return `${location.city}, ${location.state}`;
      case 'public':
        return `${location.addressLine1}, ${location.city}, ${location.state}`;
      default:
        return `${location.city}, ${location.state}`;
    }
  }

  // Format distance for display
  formatDistance(miles) {
    if (miles < 0.1) {
      return 'Very close';
    } else if (miles < 1) {
      return `${(miles * 5280).toFixed(0)} ft`;
    } else {
      return `${miles.toFixed(1)} mi`;
    }
  }

  // Check if location is in neighborhood
  isInNeighborhood(latitude, longitude, neighborhood) {
    const distance = this.calculateDistance(
      latitude, longitude,
      neighborhood.centerLat, neighborhood.centerLng
    );
    return distance <= neighborhood.radiusMiles;
  }
}

// Export singleton instance
export default new LocationService();