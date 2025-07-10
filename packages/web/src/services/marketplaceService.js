// Marketplace Service
// Handles all local marketplace and business features

import locationService from './locationService';

class MarketplaceService {
  constructor() {
    this.userListings = [];
    this.localBusinesses = [];
    this.userInquiries = [];
  }

  // ==========================================
  // MARKETPLACE LISTINGS
  // ==========================================

  // Get marketplace listings
  async getMarketplaceListings(filters = {}) {
    try {
      const listings = [
        {
          id: 'listing_1',
          sellerId: 'user_1',
          sellerName: 'Sarah Chen',
          sellerAvatar: 'SC',
          title: 'MacBook Pro 13" (2021)',
          description: 'Excellent condition MacBook Pro with M1 chip. Includes original charger and box. Used for light development work.',
          price: 1200.00,
          priceNegotiable: true,
          category: 'electronics',
          subcategory: 'laptops',
          condition: 'like_new',
          brand: 'Apple',
          model: 'MacBook Pro 13"',
          images: ['/marketplace/macbook1.jpg', '/marketplace/macbook2.jpg'],
          locationLat: 37.7749,
          locationLng: -122.4194,
          neighborhoodId: 'nb_1',
          neighborhood: 'Downtown',
          deliveryAvailable: false,
          pickupOnly: true,
          status: 'active',
          viewsCount: 45,
          favoritesCount: 8,
          distance: 0.5,
          postedAt: '2024-01-20T00:00:00Z'
        },
        {
          id: 'listing_2',
          sellerId: 'user_2',
          sellerName: 'Alex Rodriguez',
          sellerAvatar: 'AR',
          title: 'Vintage Oak Dining Table',
          description: 'Beautiful solid oak dining table seats 6. Perfect for family dinners. Some minor wear but very sturdy.',
          price: 350.00,
          priceNegotiable: true,
          category: 'furniture',
          subcategory: 'dining',
          condition: 'good',
          brand: 'Handmade',
          model: 'Custom',
          images: ['/marketplace/table1.jpg', '/marketplace/table2.jpg'],
          locationLat: 37.7599,
          locationLng: -122.4148,
          neighborhoodId: 'nb_2',
          neighborhood: 'Mission District',
          deliveryAvailable: true,
          pickupOnly: false,
          status: 'active',
          viewsCount: 23,
          favoritesCount: 4,
          distance: 1.2,
          postedAt: '2024-01-18T00:00:00Z'
        },
        {
          id: 'listing_3',
          sellerId: 'user_3',
          sellerName: 'Maya Patel',
          sellerAvatar: 'MP',
          title: 'Professional Photography Services',
          description: 'Experienced photographer offering portrait, event, and product photography. 5+ years experience.',
          price: 150.00,
          priceNegotiable: true,
          category: 'services',
          subcategory: 'photography',
          condition: 'new',
          brand: 'Independent',
          model: 'Professional Service',
          images: ['/marketplace/photo1.jpg', '/marketplace/photo2.jpg'],
          locationLat: 37.7609,
          locationLng: -122.4350,
          neighborhoodId: 'nb_3',
          neighborhood: 'Castro',
          deliveryAvailable: false,
          pickupOnly: false,
          status: 'active',
          viewsCount: 67,
          favoritesCount: 12,
          distance: 0.8,
          postedAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 'listing_4',
          sellerId: 'user_4',
          sellerName: 'David Kim',
          sellerAvatar: 'DK',
          title: '2018 Honda Civic',
          description: 'Reliable car with low mileage. Great gas mileage and recent maintenance. Clean title.',
          price: 18500.00,
          priceNegotiable: true,
          category: 'vehicles',
          subcategory: 'cars',
          condition: 'good',
          brand: 'Honda',
          model: 'Civic',
          images: ['/marketplace/civic1.jpg', '/marketplace/civic2.jpg'],
          locationLat: 37.7941,
          locationLng: -122.4078,
          neighborhoodId: 'nb_4',
          neighborhood: 'Chinatown',
          deliveryAvailable: false,
          pickupOnly: true,
          status: 'active',
          viewsCount: 89,
          favoritesCount: 15,
          distance: 2.1,
          postedAt: '2024-01-12T00:00:00Z'
        }
      ];

      // Apply filters
      let filteredListings = listings;

      if (filters.category) {
        filteredListings = filteredListings.filter(listing => 
          listing.category === filters.category
        );
      }

      if (filters.priceMin !== undefined) {
        filteredListings = filteredListings.filter(listing => 
          listing.price >= filters.priceMin
        );
      }

      if (filters.priceMax !== undefined) {
        filteredListings = filteredListings.filter(listing => 
          listing.price <= filters.priceMax
        );
      }

      if (filters.condition) {
        filteredListings = filteredListings.filter(listing => 
          listing.condition === filters.condition
        );
      }

      if (filters.deliveryAvailable !== undefined) {
        filteredListings = filteredListings.filter(listing => 
          listing.deliveryAvailable === filters.deliveryAvailable
        );
      }

      if (filters.radiusMiles) {
        filteredListings = filteredListings.filter(listing => 
          listing.distance <= filters.radiusMiles
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredListings = filteredListings.filter(listing =>
          listing.title.toLowerCase().includes(searchTerm) ||
          listing.description.toLowerCase().includes(searchTerm) ||
          listing.brand.toLowerCase().includes(searchTerm)
        );
      }

      // Sort by distance, date, or price
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'distance':
            filteredListings.sort((a, b) => a.distance - b.distance);
            break;
          case 'price_low':
            filteredListings.sort((a, b) => a.price - b.price);
            break;
          case 'price_high':
            filteredListings.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            filteredListings.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
            break;
          default:
            break;
        }
      }

      return filteredListings;
    } catch (error) {
      console.error('Failed to get marketplace listings:', error);
      return [];
    }
  }

  // Get listing by ID
  async getListingById(listingId) {
    try {
      const listings = await this.getMarketplaceListings();
      return listings.find(listing => listing.id === listingId) || null;
    } catch (error) {
      console.error('Failed to get listing by ID:', error);
      return null;
    }
  }

  // Create new listing
  async createListing(listingData) {
    try {
      const newListing = {
        id: `listing_${Date.now()}`,
        sellerId: listingData.sellerId,
        ...listingData,
        status: 'active',
        viewsCount: 0,
        favoritesCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.userListings.push(newListing);
      return newListing;
    } catch (error) {
      console.error('Failed to create listing:', error);
      throw error;
    }
  }

  // Update listing
  async updateListing(listingId, updates) {
    try {
      const index = this.userListings.findIndex(listing => listing.id === listingId);
      if (index === -1) {
        throw new Error('Listing not found');
      }

      this.userListings[index] = {
        ...this.userListings[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return this.userListings[index];
    } catch (error) {
      console.error('Failed to update listing:', error);
      throw error;
    }
  }

  // Delete listing
  async deleteListing(listingId) {
    try {
      const index = this.userListings.findIndex(listing => listing.id === listingId);
      if (index === -1) {
        throw new Error('Listing not found');
      }

      this.userListings.splice(index, 1);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true };
    } catch (error) {
      console.error('Failed to delete listing:', error);
      throw error;
    }
  }

  // Get user's listings
  async getUserListings(userId) {
    try {
      const allListings = await this.getMarketplaceListings();
      return allListings.filter(listing => listing.sellerId === userId);
    } catch (error) {
      console.error('Failed to get user listings:', error);
      return [];
    }
  }

  // ==========================================
  // MARKETPLACE INQUIRIES
  // ==========================================

  // Send inquiry about listing
  async sendInquiry(listingId, inquiryData) {
    try {
      const inquiry = {
        id: `inquiry_${Date.now()}`,
        listingId: listingId,
        buyerId: inquiryData.buyerId,
        message: inquiryData.message,
        offerPrice: inquiryData.offerPrice,
        status: 'active',
        createdAt: new Date().toISOString()
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.userInquiries.push(inquiry);
      return inquiry;
    } catch (error) {
      console.error('Failed to send inquiry:', error);
      throw error;
    }
  }

  // Get inquiries for listing
  async getListingInquiries(listingId) {
    try {
      return this.userInquiries.filter(inquiry => 
        inquiry.listingId === listingId && inquiry.status === 'active'
      );
    } catch (error) {
      console.error('Failed to get listing inquiries:', error);
      return [];
    }
  }

  // Respond to inquiry
  async respondToInquiry(inquiryId, response) {
    try {
      const inquiry = this.userInquiries.find(inq => inq.id === inquiryId);
      if (!inquiry) {
        throw new Error('Inquiry not found');
      }

      inquiry.status = response; // 'accepted', 'declined', 'countered'
      inquiry.respondedAt = new Date().toISOString();

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return inquiry;
    } catch (error) {
      console.error('Failed to respond to inquiry:', error);
      throw error;
    }
  }

  // ==========================================
  // LOCAL BUSINESSES
  // ==========================================

  // Get local businesses
  async getLocalBusinesses(filters = {}) {
    try {
      const businesses = [
        {
          id: 'business_1',
          ownerId: 'user_5',
          businessName: 'Café Brew',
          description: 'Cozy neighborhood coffee shop with freshly roasted beans and homemade pastries.',
          category: 'restaurant',
          subcategory: 'coffee',
          address: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94102',
          phone: '(415) 555-0123',
          email: 'info@cafebrew.com',
          website: 'https://cafebrew.com',
          hoursOfOperation: {
            monday: '7:00-19:00',
            tuesday: '7:00-19:00',
            wednesday: '7:00-19:00',
            thursday: '7:00-19:00',
            friday: '7:00-20:00',
            saturday: '8:00-20:00',
            sunday: '8:00-18:00'
          },
          images: ['/businesses/cafe1.jpg', '/businesses/cafe2.jpg'],
          logoUrl: '/businesses/cafe-logo.png',
          priceRange: '$$',
          acceptsCash: true,
          acceptsCards: true,
          deliveryAvailable: true,
          pickupAvailable: true,
          rating: 4.5,
          reviewCount: 127,
          isVerified: true,
          distance: 0.3
        },
        {
          id: 'business_2',
          ownerId: 'user_6',
          businessName: 'Tech Repair Pro',
          description: 'Professional computer and phone repair services. Quick turnaround, competitive prices.',
          category: 'service',
          subcategory: 'technology',
          address: '456 Tech Ave',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94103',
          phone: '(415) 555-0456',
          email: 'repairs@techrepairpro.com',
          website: 'https://techrepairpro.com',
          hoursOfOperation: {
            monday: '9:00-18:00',
            tuesday: '9:00-18:00',
            wednesday: '9:00-18:00',
            thursday: '9:00-18:00',
            friday: '9:00-18:00',
            saturday: '10:00-16:00',
            sunday: 'Closed'
          },
          images: ['/businesses/repair1.jpg', '/businesses/repair2.jpg'],
          logoUrl: '/businesses/repair-logo.png',
          priceRange: '$$$',
          acceptsCash: true,
          acceptsCards: true,
          deliveryAvailable: false,
          pickupAvailable: true,
          rating: 4.8,
          reviewCount: 89,
          isVerified: true,
          distance: 0.7
        },
        {
          id: 'business_3',
          ownerId: 'user_7',
          businessName: 'Green Garden Nursery',
          description: 'Local plant nursery with a wide selection of indoor and outdoor plants, garden supplies.',
          category: 'retail',
          subcategory: 'garden',
          address: '789 Garden Blvd',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94104',
          phone: '(415) 555-0789',
          email: 'info@greengarden.com',
          website: 'https://greengarden.com',
          hoursOfOperation: {
            monday: '8:00-17:00',
            tuesday: '8:00-17:00',
            wednesday: '8:00-17:00',
            thursday: '8:00-17:00',
            friday: '8:00-17:00',
            saturday: '8:00-18:00',
            sunday: '9:00-16:00'
          },
          images: ['/businesses/nursery1.jpg', '/businesses/nursery2.jpg'],
          logoUrl: '/businesses/nursery-logo.png',
          priceRange: '$$',
          acceptsCash: true,
          acceptsCards: true,
          deliveryAvailable: true,
          pickupAvailable: true,
          rating: 4.3,
          reviewCount: 203,
          isVerified: true,
          distance: 1.1
        }
      ];

      // Apply filters
      let filteredBusinesses = businesses;

      if (filters.category) {
        filteredBusinesses = filteredBusinesses.filter(business => 
          business.category === filters.category
        );
      }

      if (filters.priceRange) {
        filteredBusinesses = filteredBusinesses.filter(business => 
          business.priceRange === filters.priceRange
        );
      }

      if (filters.deliveryAvailable !== undefined) {
        filteredBusinesses = filteredBusinesses.filter(business => 
          business.deliveryAvailable === filters.deliveryAvailable
        );
      }

      if (filters.isVerified !== undefined) {
        filteredBusinesses = filteredBusinesses.filter(business => 
          business.isVerified === filters.isVerified
        );
      }

      if (filters.radiusMiles) {
        filteredBusinesses = filteredBusinesses.filter(business => 
          business.distance <= filters.radiusMiles
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredBusinesses = filteredBusinesses.filter(business =>
          business.businessName.toLowerCase().includes(searchTerm) ||
          business.description.toLowerCase().includes(searchTerm) ||
          business.category.toLowerCase().includes(searchTerm)
        );
      }

      return filteredBusinesses;
    } catch (error) {
      console.error('Failed to get local businesses:', error);
      return [];
    }
  }

  // Get business by ID
  async getBusinessById(businessId) {
    try {
      const businesses = await this.getLocalBusinesses();
      return businesses.find(business => business.id === businessId) || null;
    } catch (error) {
      console.error('Failed to get business by ID:', error);
      return null;
    }
  }

  // Create business profile
  async createBusiness(businessData) {
    try {
      const newBusiness = {
        id: `business_${Date.now()}`,
        ...businessData,
        rating: 0.0,
        reviewCount: 0,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.localBusinesses.push(newBusiness);
      return newBusiness;
    } catch (error) {
      console.error('Failed to create business:', error);
      throw error;
    }
  }

  // ==========================================
  // BUSINESS REVIEWS
  // ==========================================

  // Get business reviews
  async getBusinessReviews(businessId) {
    try {
      const reviews = [
        {
          id: 'review_1',
          businessId: businessId,
          reviewerId: 'user_1',
          reviewerName: 'Sarah Chen',
          reviewerAvatar: 'SC',
          rating: 5,
          reviewText: 'Amazing coffee and friendly staff! The atmosphere is perfect for working or catching up with friends.',
          images: ['/reviews/cafe-review1.jpg'],
          visitDate: '2024-01-20',
          recommended: true,
          helpfulCount: 8,
          createdAt: '2024-01-21T00:00:00Z'
        },
        {
          id: 'review_2',
          businessId: businessId,
          reviewerId: 'user_2',
          reviewerName: 'Alex Rodriguez',
          reviewerAvatar: 'AR',
          rating: 4,
          reviewText: 'Great service and quality. Fixed my laptop quickly and for a reasonable price.',
          images: [],
          visitDate: '2024-01-18',
          recommended: true,
          helpfulCount: 5,
          createdAt: '2024-01-19T00:00:00Z'
        },
        {
          id: 'review_3',
          businessId: businessId,
          reviewerId: 'user_3',
          reviewerName: 'Maya Patel',
          reviewerAvatar: 'MP',
          rating: 5,
          reviewText: 'Best plant selection in the neighborhood! Staff is very knowledgeable and helpful.',
          images: ['/reviews/nursery-review1.jpg'],
          visitDate: '2024-01-15',
          recommended: true,
          helpfulCount: 12,
          createdAt: '2024-01-16T00:00:00Z'
        }
      ];

      return reviews.filter(review => review.businessId === businessId);
    } catch (error) {
      console.error('Failed to get business reviews:', error);
      return [];
    }
  }

  // Add business review
  async addBusinessReview(reviewData) {
    try {
      const review = {
        id: `review_${Date.now()}`,
        ...reviewData,
        helpfulCount: 0,
        createdAt: new Date().toISOString()
      };

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return review;
    } catch (error) {
      console.error('Failed to add business review:', error);
      throw error;
    }
  }

  // Mark review as helpful
  async markReviewHelpful(reviewId) {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, helpfulCount: Math.floor(Math.random() * 20) + 1 };
    } catch (error) {
      console.error('Failed to mark review as helpful:', error);
      throw error;
    }
  }

  // ==========================================
  // MARKETPLACE CATEGORIES
  // ==========================================

  // Get marketplace categories
  getMarketplaceCategories() {
    return [
      {
        id: 'electronics',
        name: 'Electronics',
        icon: '📱',
        subcategories: ['phones', 'laptops', 'tablets', 'gaming', 'accessories']
      },
      {
        id: 'furniture',
        name: 'Furniture',
        icon: '🪑',
        subcategories: ['seating', 'tables', 'storage', 'bedroom', 'outdoor']
      },
      {
        id: 'vehicles',
        name: 'Vehicles',
        icon: '🚗',
        subcategories: ['cars', 'motorcycles', 'bicycles', 'trucks', 'parts']
      },
      {
        id: 'clothing',
        name: 'Clothing',
        icon: '👕',
        subcategories: ['mens', 'womens', 'kids', 'shoes', 'accessories']
      },
      {
        id: 'home',
        name: 'Home & Garden',
        icon: '🏠',
        subcategories: ['appliances', 'decor', 'tools', 'garden', 'cleaning']
      },
      {
        id: 'services',
        name: 'Services',
        icon: '🔧',
        subcategories: ['repair', 'cleaning', 'tutoring', 'photography', 'fitness']
      },
      {
        id: 'books',
        name: 'Books & Media',
        icon: '📚',
        subcategories: ['books', 'movies', 'music', 'games', 'magazines']
      },
      {
        id: 'sports',
        name: 'Sports & Recreation',
        icon: '⚽',
        subcategories: ['equipment', 'fitness', 'outdoor', 'team-sports', 'individual']
      }
    ];
  }

  // Get business categories
  getBusinessCategories() {
    return [
      {
        id: 'restaurant',
        name: 'Restaurants',
        icon: '🍽️',
        subcategories: ['coffee', 'fast-food', 'fine-dining', 'ethnic', 'bakery']
      },
      {
        id: 'retail',
        name: 'Retail',
        icon: '🛍️',
        subcategories: ['clothing', 'electronics', 'grocery', 'books', 'gifts']
      },
      {
        id: 'service',
        name: 'Services',
        icon: '🔧',
        subcategories: ['repair', 'beauty', 'fitness', 'professional', 'automotive']
      },
      {
        id: 'healthcare',
        name: 'Healthcare',
        icon: '🏥',
        subcategories: ['medical', 'dental', 'pharmacy', 'veterinary', 'wellness']
      },
      {
        id: 'entertainment',
        name: 'Entertainment',
        icon: '🎭',
        subcategories: ['theater', 'music', 'sports', 'nightlife', 'recreation']
      },
      {
        id: 'education',
        name: 'Education',
        icon: '📚',
        subcategories: ['schools', 'tutoring', 'training', 'libraries', 'workshops']
      }
    ];
  }

  // ==========================================
  // UTILITY METHODS
  // ==========================================

  // Format price for display
  formatPrice(price, currency = 'USD') {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });

    return formatter.format(price);
  }

  // Get condition display
  getConditionDisplay(condition) {
    const conditions = {
      new: 'New',
      like_new: 'Like New',
      good: 'Good',
      fair: 'Fair',
      poor: 'Poor'
    };

    return conditions[condition] || condition;
  }

  // Calculate average rating
  calculateAverageRating(reviews) {
    if (!reviews || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }

  // Format business hours
  formatBusinessHours(hoursOfOperation) {
    const today = new Date().toLocaleLowerCase();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[new Date().getDay()];
    
    const todayHours = hoursOfOperation[currentDay];
    
    if (!todayHours || todayHours === 'Closed') {
      return 'Closed today';
    }

    const [open, close] = todayHours.split('-');
    return `Open today: ${open} - ${close}`;
  }

  // Check if business is open now
  isBusinessOpen(hoursOfOperation) {
    const now = new Date();
    const currentDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const todayHours = hoursOfOperation[currentDay];
    
    if (!todayHours || todayHours === 'Closed') {
      return false;
    }

    const [openTime, closeTime] = todayHours.split('-');
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
    
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;
    
    return currentTime >= openMinutes && currentTime < closeMinutes;
  }

  // Generate listing description suggestions
  getListingDescriptionSuggestions(category) {
    const suggestions = {
      electronics: [
        'Include model number and year',
        'Mention any included accessories',
        'Note any warranty remaining',
        'Describe condition in detail'
      ],
      furniture: [
        'Provide dimensions',
        'Mention material and brand',
        'Note any assembly required',
        'Describe wear and tear'
      ],
      vehicles: [
        'Include mileage and year',
        'Mention maintenance history',
        'Note any recent repairs',
        'Include VIN if comfortable'
      ],
      services: [
        'Describe your experience level',
        'Mention availability',
        'Include portfolio or examples',
        'Note service area coverage'
      ]
    };

    return suggestions[category] || [
      'Be honest about condition',
      'Include clear photos',
      'Mention pickup/delivery options',
      'Respond promptly to inquiries'
    ];
  }
}

// Export singleton instance
export default new MarketplaceService();