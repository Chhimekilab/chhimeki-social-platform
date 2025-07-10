// Safety Service
// Handles all neighborhood safety and community features

import locationService from './locationService';

class SafetyService {
  constructor() {
    this.safetyReports = [];
    this.emergencyContacts = [];
    this.communityPolls = [];
    this.lostAndFound = [];
  }

  // ==========================================
  // SAFETY REPORTS
  // ==========================================

  // Get safety reports
  async getSafetyReports(filters = {}) {
    try {
      const reports = [
        {
          id: 'report_1',
          reporterId: 'user_1',
          reporterName: 'Sarah Chen',
          incidentType: 'suspicious_activity',
          severity: 'medium',
          title: 'Suspicious Person Near School',
          description: 'Noticed someone taking photos of children at the elementary school playground. Reported to authorities.',
          locationDescription: 'Lincoln Elementary School playground',
          locationLat: 37.7749,
          locationLng: -122.4194,
          neighborhoodId: 'nb_1',
          neighborhood: 'Downtown',
          incidentTime: '2024-01-25T15:30:00Z',
          policeNotified: true,
          emergencyServicesCalled: false,
          images: ['/safety/suspicious1.jpg'],
          status: 'active',
          priority: 4,
          upvotes: 8,
          downvotes: 1,
          commentCount: 5,
          distance: 0.2,
          createdAt: '2024-01-25T16:00:00Z'
        },
        {
          id: 'report_2',
          reporterId: 'user_2',
          reporterName: 'Alex Rodriguez',
          incidentType: 'crime',
          severity: 'high',
          title: 'Break-in Attempt on Main St',
          description: 'Someone tried to break into the corner store around 2 AM. Owner was alerted by security system.',
          locationDescription: 'Corner Market, 123 Main St',
          locationLat: 37.7599,
          locationLng: -122.4148,
          neighborhoodId: 'nb_2',
          neighborhood: 'Mission District',
          incidentTime: '2024-01-24T02:15:00Z',
          policeNotified: true,
          emergencyServicesCalled: false,
          images: ['/safety/breakin1.jpg', '/safety/breakin2.jpg'],
          status: 'investigating',
          priority: 5,
          upvotes: 15,
          downvotes: 0,
          commentCount: 12,
          distance: 1.1,
          createdAt: '2024-01-24T08:30:00Z'
        },
        {
          id: 'report_3',
          reporterId: 'user_3',
          reporterName: 'Maya Patel',
          incidentType: 'accident',
          severity: 'low',
          title: 'Pothole on Oak Street',
          description: 'Large pothole causing damage to vehicles. Several neighbors have reported tire damage.',
          locationDescription: 'Oak Street between 5th and 6th Ave',
          locationLat: 37.7609,
          locationLng: -122.4350,
          neighborhoodId: 'nb_3',
          neighborhood: 'Castro',
          incidentTime: '2024-01-23T00:00:00Z',
          policeNotified: false,
          emergencyServicesCalled: false,
          images: ['/safety/pothole1.jpg'],
          status: 'active',
          priority: 2,
          upvotes: 23,
          downvotes: 2,
          commentCount: 8,
          distance: 0.8,
          createdAt: '2024-01-23T12:00:00Z'
        },
        {
          id: 'report_4',
          reporterId: 'user_4',
          reporterName: 'David Kim',
          incidentType: 'emergency',
          severity: 'critical',
          title: 'Gas Leak on Pine Street',
          description: 'Strong gas smell detected. Area has been evacuated. Gas company and fire department on scene.',
          locationDescription: 'Pine Street apartment complex',
          locationLat: 37.7941,
          locationLng: -122.4078,
          neighborhoodId: 'nb_4',
          neighborhood: 'Chinatown',
          incidentTime: '2024-01-25T09:00:00Z',
          policeNotified: true,
          emergencyServicesCalled: true,
          images: [],
          status: 'resolved',
          priority: 5,
          upvotes: 45,
          downvotes: 0,
          commentCount: 18,
          distance: 2.3,
          createdAt: '2024-01-25T09:15:00Z'
        }
      ];

      // Apply filters
      let filteredReports = reports;

      if (filters.incidentType) {
        filteredReports = filteredReports.filter(report => 
          report.incidentType === filters.incidentType
        );
      }

      if (filters.severity) {
        filteredReports = filteredReports.filter(report => 
          report.severity === filters.severity
        );
      }

      if (filters.status) {
        filteredReports = filteredReports.filter(report => 
          report.status === filters.status
        );
      }

      if (filters.neighborhoodId) {
        filteredReports = filteredReports.filter(report => 
          report.neighborhoodId === filters.neighborhoodId
        );
      }

      if (filters.radiusMiles) {
        filteredReports = filteredReports.filter(report => 
          report.distance <= filters.radiusMiles
        );
      }

      if (filters.dateRange) {
        const { startDate, endDate } = filters.dateRange;
        filteredReports = filteredReports.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
        });
      }

      // Sort by priority, date, or proximity
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'priority':
            filteredReports.sort((a, b) => b.priority - a.priority);
            break;
          case 'newest':
            filteredReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'distance':
            filteredReports.sort((a, b) => a.distance - b.distance);
            break;
          case 'upvotes':
            filteredReports.sort((a, b) => b.upvotes - a.upvotes);
            break;
          default:
            break;
        }
      }

      return filteredReports;
    } catch (error) {
      console.error('Failed to get safety reports:', error);
      return [];
    }
  }

  // Create safety report
  async createSafetyReport(reportData) {
    try {
      const newReport = {
        id: `report_${Date.now()}`,
        reporterId: reportData.reporterId,
        ...reportData,
        status: 'active',
        priority: this.calculatePriority(reportData.severity, reportData.incidentType),
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        createdAt: new Date().toISOString()
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.safetyReports.push(newReport);
      
      // Auto-notify emergency services for critical incidents
      if (newReport.severity === 'critical') {
        this.notifyEmergencyServices(newReport);
      }
      
      return newReport;
    } catch (error) {
      console.error('Failed to create safety report:', error);
      throw error;
    }
  }

  // Vote on safety report
  async voteOnSafetyReport(reportId, voteType) {
    try {
      const report = this.safetyReports.find(r => r.id === reportId);
      if (!report) {
        throw new Error('Report not found');
      }

      if (voteType === 'up') {
        report.upvotes += 1;
      } else if (voteType === 'down') {
        report.downvotes += 1;
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { upvotes: report.upvotes, downvotes: report.downvotes };
    } catch (error) {
      console.error('Failed to vote on safety report:', error);
      throw error;
    }
  }

  // Update report status
  async updateReportStatus(reportId, status) {
    try {
      const report = this.safetyReports.find(r => r.id === reportId);
      if (!report) {
        throw new Error('Report not found');
      }

      report.status = status;
      report.statusUpdatedAt = new Date().toISOString();

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return report;
    } catch (error) {
      console.error('Failed to update report status:', error);
      throw error;
    }
  }

  // ==========================================
  // EMERGENCY CONTACTS
  // ==========================================

  // Get user's emergency contacts
  async getEmergencyContacts(userId) {
    try {
      const contacts = [
        {
          id: 'contact_1',
          userId: userId,
          contactName: 'Jane Smith',
          relationship: 'family',
          phone: '(555) 123-4567',
          email: 'jane.smith@email.com',
          isPrimary: true,
          notifyOnEmergency: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'contact_2',
          userId: userId,
          contactName: 'John Doe',
          relationship: 'friend',
          phone: '(555) 987-6543',
          email: 'john.doe@email.com',
          isPrimary: false,
          notifyOnEmergency: true,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'contact_3',
          userId: userId,
          contactName: 'Sarah Johnson',
          relationship: 'neighbor',
          phone: '(555) 456-7890',
          email: 'sarah.johnson@email.com',
          isPrimary: false,
          notifyOnEmergency: false,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      this.emergencyContacts = contacts;
      return contacts;
    } catch (error) {
      console.error('Failed to get emergency contacts:', error);
      return [];
    }
  }

  // Add emergency contact
  async addEmergencyContact(contactData) {
    try {
      const newContact = {
        id: `contact_${Date.now()}`,
        ...contactData,
        createdAt: new Date().toISOString()
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.emergencyContacts.push(newContact);
      return newContact;
    } catch (error) {
      console.error('Failed to add emergency contact:', error);
      throw error;
    }
  }

  // Update emergency contact
  async updateEmergencyContact(contactId, updates) {
    try {
      const index = this.emergencyContacts.findIndex(contact => contact.id === contactId);
      if (index === -1) {
        throw new Error('Contact not found');
      }

      this.emergencyContacts[index] = {
        ...this.emergencyContacts[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return this.emergencyContacts[index];
    } catch (error) {
      console.error('Failed to update emergency contact:', error);
      throw error;
    }
  }

  // Delete emergency contact
  async deleteEmergencyContact(contactId) {
    try {
      const index = this.emergencyContacts.findIndex(contact => contact.id === contactId);
      if (index === -1) {
        throw new Error('Contact not found');
      }

      this.emergencyContacts.splice(index, 1);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete emergency contact:', error);
      throw error;
    }
  }

  // ==========================================
  // COMMUNITY POLLS
  // ==========================================

  // Get community polls
  async getCommunityPolls(neighborhoodId) {
    try {
      const polls = [
        {
          id: 'poll_1',
          creatorId: 'user_1',
          creatorName: 'Sarah Chen',
          neighborhoodId: neighborhoodId,
          title: 'New Traffic Light Installation',
          description: 'Should we petition for a traffic light at the intersection of Main St and Oak Ave?',
          pollType: 'yes_no',
          options: ['Yes, we need a traffic light', 'No, current stop signs are sufficient'],
          allowMultipleVotes: false,
          anonymousVoting: false,
          expiresAt: '2024-02-15T23:59:59Z',
          totalVotes: 47,
          status: 'active',
          results: [32, 15], // Votes for each option
          userHasVoted: false,
          createdAt: '2024-01-20T00:00:00Z'
        },
        {
          id: 'poll_2',
          creatorId: 'user_2',
          creatorName: 'Alex Rodriguez',
          neighborhoodId: neighborhoodId,
          title: 'Community Garden Location',
          description: 'Where should we establish our new community garden?',
          pollType: 'multiple_choice',
          options: ['Vacant lot on Pine St', 'Park corner on Elm Ave', 'School rooftop', 'Community center backyard'],
          allowMultipleVotes: false,
          anonymousVoting: true,
          expiresAt: '2024-02-10T23:59:59Z',
          totalVotes: 23,
          status: 'active',
          results: [8, 6, 4, 5],
          userHasVoted: true,
          createdAt: '2024-01-18T00:00:00Z'
        },
        {
          id: 'poll_3',
          creatorId: 'user_3',
          creatorName: 'Maya Patel',
          neighborhoodId: neighborhoodId,
          title: 'Street Cleaning Schedule',
          description: 'Rate your satisfaction with the current street cleaning schedule.',
          pollType: 'rating',
          options: ['1 - Very Poor', '2 - Poor', '3 - Average', '4 - Good', '5 - Excellent'],
          allowMultipleVotes: false,
          anonymousVoting: false,
          expiresAt: '2024-02-05T23:59:59Z',
          totalVotes: 34,
          status: 'expired',
          results: [2, 5, 12, 10, 5],
          userHasVoted: true,
          createdAt: '2024-01-15T00:00:00Z'
        }
      ];

      return polls.filter(poll => !neighborhoodId || poll.neighborhoodId === neighborhoodId);
    } catch (error) {
      console.error('Failed to get community polls:', error);
      return [];
    }
  }

  // Create community poll
  async createCommunityPoll(pollData) {
    try {
      const newPoll = {
        id: `poll_${Date.now()}`,
        ...pollData,
        totalVotes: 0,
        status: 'active',
        results: new Array(pollData.options.length).fill(0),
        userHasVoted: false,
        createdAt: new Date().toISOString()
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.communityPolls.push(newPoll);
      return newPoll;
    } catch (error) {
      console.error('Failed to create community poll:', error);
      throw error;
    }
  }

  // Vote on community poll
  async voteOnPoll(pollId, selectedOptions) {
    try {
      const poll = this.communityPolls.find(p => p.id === pollId);
      if (!poll) {
        throw new Error('Poll not found');
      }

      if (poll.userHasVoted && !poll.allowMultipleVotes) {
        throw new Error('User has already voted');
      }

      // Update results
      selectedOptions.forEach(optionIndex => {
        if (optionIndex >= 0 && optionIndex < poll.results.length) {
          poll.results[optionIndex] += 1;
        }
      });

      poll.totalVotes += 1;
      poll.userHasVoted = true;

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return poll;
    } catch (error) {
      console.error('Failed to vote on poll:', error);
      throw error;
    }
  }

  // ==========================================
  // LOST AND FOUND
  // ==========================================

  // Get lost and found items
  async getLostAndFoundItems(filters = {}) {
    try {
      const items = [
        {
          id: 'lost_1',
          userId: 'user_1',
          userName: 'Sarah Chen',
          type: 'lost',
          itemName: 'Golden Retriever - Max',
          description: 'Friendly golden retriever, 3 years old. Wearing blue collar with ID tag. Last seen near the park.',
          category: 'pet',
          lastSeenLocation: 'Mission Dolores Park',
          lastSeenDate: '2024-01-24',
          contactMethod: 'app',
          contactInfo: null,
          images: ['/lost-found/dog1.jpg', '/lost-found/dog2.jpg'],
          rewardOffered: 200.00,
          status: 'active',
          neighborhoodId: 'nb_2',
          neighborhood: 'Mission District',
          distance: 0.5,
          createdAt: '2024-01-24T18:00:00Z'
        },
        {
          id: 'found_1',
          userId: 'user_2',
          userName: 'Alex Rodriguez',
          type: 'found',
          itemName: 'iPhone 13 Pro',
          description: 'Found iPhone in black case near the coffee shop. Has a cracked screen protector.',
          category: 'electronics',
          lastSeenLocation: 'Café Brew, Main Street',
          lastSeenDate: '2024-01-25',
          contactMethod: 'phone',
          contactInfo: '(555) 123-4567',
          images: ['/lost-found/iphone1.jpg'],
          rewardOffered: null,
          status: 'active',
          neighborhoodId: 'nb_1',
          neighborhood: 'Downtown',
          distance: 0.3,
          createdAt: '2024-01-25T10:00:00Z'
        },
        {
          id: 'lost_2',
          userId: 'user_3',
          userName: 'Maya Patel',
          type: 'lost',
          itemName: 'Car Keys with Photo Keychain',
          description: 'Honda car keys with family photo keychain. Lost somewhere between home and grocery store.',
          category: 'keys',
          lastSeenLocation: 'Between Castro St and Market St',
          lastSeenDate: '2024-01-23',
          contactMethod: 'email',
          contactInfo: 'maya.patel@email.com',
          images: ['/lost-found/keys1.jpg'],
          rewardOffered: 50.00,
          status: 'active',
          neighborhoodId: 'nb_3',
          neighborhood: 'Castro',
          distance: 0.8,
          createdAt: '2024-01-23T14:00:00Z'
        },
        {
          id: 'found_2',
          userId: 'user_4',
          userName: 'David Kim',
          type: 'found',
          itemName: 'Child\'s Backpack',
          description: 'Small blue backpack with school supplies. Found at the playground.',
          category: 'clothing',
          lastSeenLocation: 'Portsmouth Square Playground',
          lastSeenDate: '2024-01-22',
          contactMethod: 'app',
          contactInfo: null,
          images: ['/lost-found/backpack1.jpg'],
          rewardOffered: null,
          status: 'resolved',
          neighborhoodId: 'nb_4',
          neighborhood: 'Chinatown',
          distance: 2.1,
          createdAt: '2024-01-22T16:00:00Z'
        }
      ];

      // Apply filters
      let filteredItems = items;

      if (filters.type) {
        filteredItems = filteredItems.filter(item => item.type === filters.type);
      }

      if (filters.category) {
        filteredItems = filteredItems.filter(item => item.category === filters.category);
      }

      if (filters.status) {
        filteredItems = filteredItems.filter(item => item.status === filters.status);
      }

      if (filters.neighborhoodId) {
        filteredItems = filteredItems.filter(item => item.neighborhoodId === filters.neighborhoodId);
      }

      if (filters.radiusMiles) {
        filteredItems = filteredItems.filter(item => item.distance <= filters.radiusMiles);
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.itemName.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm)
        );
      }

      return filteredItems;
    } catch (error) {
      console.error('Failed to get lost and found items:', error);
      return [];
    }
  }

  // Create lost and found item
  async createLostAndFoundItem(itemData) {
    try {
      const newItem = {
        id: `${itemData.type}_${Date.now()}`,
        ...itemData,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.lostAndFound.push(newItem);
      return newItem;
    } catch (error) {
      console.error('Failed to create lost and found item:', error);
      throw error;
    }
  }

  // Mark item as found/returned
  async markItemResolved(itemId) {
    try {
      const item = this.lostAndFound.find(i => i.id === itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      item.status = 'resolved';
      item.resolvedAt = new Date().toISOString();

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return item;
    } catch (error) {
      console.error('Failed to mark item as resolved:', error);
      throw error;
    }
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  // Calculate priority based on severity and incident type
  calculatePriority(severity, incidentType) {
    const severityScores = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4
    };

    const typeMultipliers = {
      emergency: 2,
      crime: 1.8,
      suspicious_activity: 1.5,
      accident: 1.2,
      infrastructure: 1,
      noise: 0.8,
      other: 1
    };

    const baseScore = severityScores[severity] || 1;
    const multiplier = typeMultipliers[incidentType] || 1;
    
    return Math.min(5, Math.round(baseScore * multiplier));
  }

  // Get incident type display
  getIncidentTypeDisplay(type) {
    const types = {
      crime: 'Crime',
      emergency: 'Emergency',
      suspicious_activity: 'Suspicious Activity',
      accident: 'Accident',
      infrastructure: 'Infrastructure Issue',
      noise: 'Noise Complaint',
      other: 'Other'
    };

    return types[type] || type;
  }

  // Get severity display
  getSeverityDisplay(severity) {
    const severities = {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      critical: 'Critical'
    };

    return severities[severity] || severity;
  }

  // Get severity color
  getSeverityColor(severity) {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-orange-600',
      critical: 'text-red-600'
    };

    return colors[severity] || 'text-gray-600';
  }

  // Format time since incident
  getTimeSinceIncident(incidentTime) {
    const now = new Date();
    const incident = new Date(incidentTime);
    const diffMs = now - incident;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  }

  // Get emergency contact suggestions
  getEmergencyContactSuggestions() {
    return [
      {
        name: 'Emergency Services',
        phone: '911',
        description: 'Police, Fire, Medical Emergency'
      },
      {
        name: 'Police Non-Emergency',
        phone: '(415) 553-0123',
        description: 'San Francisco Police Department'
      },
      {
        name: 'Poison Control',
        phone: '1-800-222-1222',
        description: '24/7 Poison Control Center'
      },
      {
        name: 'Mental Health Crisis',
        phone: '1-800-273-8255',
        description: 'National Suicide Prevention Lifeline'
      },
      {
        name: 'Animal Control',
        phone: '(415) 554-9400',
        description: 'SF Animal Care and Control'
      }
    ];
  }

  // Get lost and found categories
  getLostAndFoundCategories() {
    return [
      { id: 'pet', name: 'Pets', icon: '🐕' },
      { id: 'electronics', name: 'Electronics', icon: '📱' },
      { id: 'jewelry', name: 'Jewelry', icon: '💍' },
      { id: 'documents', name: 'Documents', icon: '📄' },
      { id: 'keys', name: 'Keys', icon: '🔑' },
      { id: 'clothing', name: 'Clothing', icon: '👕' },
      { id: 'bags', name: 'Bags', icon: '🎒' },
      { id: 'sports', name: 'Sports Equipment', icon: '⚽' },
      { id: 'toys', name: 'Toys', icon: '🧸' },
      { id: 'other', name: 'Other', icon: '❓' }
    ];
  }

  // Notify emergency services
  async notifyEmergencyServices(report) {
    try {
      console.log('🚨 EMERGENCY ALERT:', report.title);
      console.log('Location:', report.locationDescription);
      console.log('Severity:', report.severity);
      
      // In production, this would integrate with emergency services APIs
      return { success: true, notified: true };
    } catch (error) {
      console.error('Failed to notify emergency services:', error);
      return { success: false, error: error.message };
    }
  }

  // Send emergency alert to contacts
  async sendEmergencyAlert(userId, message, location) {
    try {
      const contacts = await this.getEmergencyContacts(userId);
      const alertContacts = contacts.filter(contact => contact.notifyOnEmergency);

      console.log('📱 Sending emergency alerts to:', alertContacts.length, 'contacts');
      console.log('Message:', message);
      console.log('Location:', location);

      // Mock notifications
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        alertsSent: alertContacts.length,
        contacts: alertContacts.map(c => ({ name: c.contactName, phone: c.phone }))
      };
    } catch (error) {
      console.error('Failed to send emergency alerts:', error);
      throw error;
    }
  }

  // Get safety statistics for neighborhood
  async getNeighborhoodSafetyStats(neighborhoodId) {
    try {
      const reports = await this.getSafetyReports({ neighborhoodId });
      const recentReports = reports.filter(report => {
        const reportDate = new Date(report.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return reportDate >= thirtyDaysAgo;
      });

      const stats = {
        totalReports: reports.length,
        recentReports: recentReports.length,
        crimeReports: reports.filter(r => r.incidentType === 'crime').length,
        emergencyReports: reports.filter(r => r.incidentType === 'emergency').length,
        resolvedReports: reports.filter(r => r.status === 'resolved').length,
        averageResponseTime: '15 minutes', // Mock data
        safetyRating: 4.2, // Mock data
        trendDirection: recentReports.length > 5 ? 'increasing' : 'stable'
      };

      return stats;
    } catch (error) {
      console.error('Failed to get safety statistics:', error);
      return null;
    }
  }
}

// Export singleton instance
export default new SafetyService();