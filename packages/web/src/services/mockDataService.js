// Mock Data Service for Chhimeki Social Platform
// This provides realistic sample data for testing and demonstration

export const mockPosts = [
  {
    id: '1',
    user_id: '1',
    content: 'Just launched our new AI-powered social platform! 🚀 The future of community building is here. What features are you most excited about? #Chhimeki #AI #SocialMedia',
    post_type: 'text',
    likes_count: 156,
    comments_count: 23,
    shares_count: 45,
    views_count: 1234,
    created_at: '2024-08-01T10:30:00Z',
    author: {
      id: '1',
      username: 'demo_user',
      full_name: 'Demo User',
      avatar: null,
      verified: true
    }
  },
  {
    id: '2',
    user_id: '2',
    content: 'Designing user experiences that matter. Just finished a new project that focuses on accessibility and inclusivity. Every user deserves a great experience! 💡 #UX #Design #InclusiveDesign',
    post_type: 'text',
    likes_count: 89,
    comments_count: 12,
    shares_count: 8,
    views_count: 567,
    created_at: '2024-08-01T09:15:00Z',
    author: {
      id: '2',
      username: 'sarah_chen',
      full_name: 'Sarah Chen',
      avatar: null,
      verified: true
    }
  },
  {
    id: '3',
    user_id: '7',
    content: 'Breaking: Major tech companies are investing heavily in AI infrastructure. This could reshape the entire industry landscape. What do you think about the AI arms race? 🤖 #TechNews #AI #Innovation',
    post_type: 'text',
    likes_count: 234,
    comments_count: 67,
    shares_count: 123,
    views_count: 3456,
    created_at: '2024-08-01T08:45:00Z',
    author: {
      id: '7',
      username: 'tech_insider',
      full_name: 'Tech Insider',
      avatar: null,
      verified: true
    }
  },
  {
    id: '4',
    user_id: '12',
    content: 'Morning workout complete! 💪 Remember, consistency beats perfection. Small steps every day lead to big changes. What\'s your fitness goal for this week? #Fitness #Motivation #Wellness',
    post_type: 'text',
    likes_count: 445,
    comments_count: 34,
    shares_count: 56,
    views_count: 1890,
    created_at: '2024-08-01T07:30:00Z',
    author: {
      id: '12',
      username: 'mike_johnson',
      full_name: 'Mike Johnson',
      avatar: null,
      verified: true
    }
  },
  {
    id: '5',
    user_id: '9',
    content: 'New recipe alert! 🍳 Just created the most delicious avocado toast with a twist. Sometimes the simplest ingredients make the best meals. Recipe in comments! #Food #Cooking #HealthyEating',
    post_type: 'text',
    likes_count: 123,
    comments_count: 45,
    shares_count: 23,
    views_count: 789,
    created_at: '2024-08-01T06:20:00Z',
    author: {
      id: '9',
      username: 'emma_wilson',
      full_name: 'Emma Wilson',
      avatar: null,
      verified: true
    }
  },
  {
    id: '6',
    user_id: '5',
    content: 'Working on some exciting machine learning projects. The potential of AI to solve real-world problems is incredible. Anyone else passionate about AI/ML? Let\'s connect! 🤖 #MachineLearning #AI #Tech',
    post_type: 'text',
    likes_count: 78,
    comments_count: 15,
    shares_count: 12,
    views_count: 456,
    created_at: '2024-08-01T05:10:00Z',
    author: {
      id: '5',
      username: 'david_kim',
      full_name: 'David Kim',
      avatar: null,
      verified: false
    }
  },
  {
    id: '7',
    user_id: '13',
    content: 'Kitchen adventures today! 🍽️ Made homemade pasta from scratch. There\'s something therapeutic about kneading dough. What\'s your favorite dish to cook? #Cooking #Homemade #Pasta',
    post_type: 'text',
    likes_count: 234,
    comments_count: 28,
    shares_count: 19,
    views_count: 890,
    created_at: '2024-08-01T04:30:00Z',
    author: {
      id: '13',
      username: 'anna_lee',
      full_name: 'Anna Lee',
      avatar: null,
      verified: false
    }
  },
  {
    id: '8',
    user_id: '15',
    content: 'Welcome to Chhimeki! 🎉 We\'re building something special here. A social platform that combines the best of all worlds. Stay tuned for amazing features coming soon! #Chhimeki #SocialMedia #Innovation',
    post_type: 'text',
    likes_count: 567,
    comments_count: 89,
    shares_count: 234,
    views_count: 5678,
    created_at: '2024-08-01T03:00:00Z',
    author: {
      id: '15',
      username: 'chhimeki_admin',
      full_name: 'Chhimeki Admin',
      avatar: null,
      verified: true
    }
  }
];

export const mockComments = [
  {
    id: '1',
    post_id: '1',
    user_id: '2',
    content: 'This looks amazing! The AI features are really innovative. Can\'t wait to try it out! 🚀',
    likes_count: 12,
    created_at: '2024-08-01T10:35:00Z',
    author: {
      id: '2',
      username: 'sarah_chen',
      full_name: 'Sarah Chen',
      avatar: null,
      verified: true
    }
  },
  {
    id: '2',
    post_id: '1',
    user_id: '7',
    content: 'Great work! The platform looks promising. What\'s the tech stack behind this?',
    likes_count: 8,
    created_at: '2024-08-01T10:40:00Z',
    author: {
      id: '7',
      username: 'tech_insider',
      full_name: 'Tech Insider',
      avatar: null,
      verified: true
    }
  },
  {
    id: '3',
    post_id: '3',
    user_id: '5',
    content: 'The AI arms race is definitely concerning. We need to ensure responsible AI development.',
    likes_count: 23,
    created_at: '2024-08-01T08:50:00Z',
    author: {
      id: '5',
      username: 'david_kim',
      full_name: 'David Kim',
      avatar: null,
      verified: false
    }
  }
];

export const mockTrendingTopics = [
  {
    id: '1',
    topic: 'AI Social Platforms',
    category: 'Technology',
    score: 95,
    mentions: 1234,
    growth: '+45%',
    url: '#',
    created_at: '2024-08-01T10:00:00Z'
  },
  {
    id: '2',
    topic: 'Sustainable Living',
    category: 'Environment',
    score: 87,
    mentions: 890,
    growth: '+32%',
    url: '#',
    created_at: '2024-08-01T09:30:00Z'
  },
  {
    id: '3',
    topic: 'Remote Work Culture',
    category: 'Business',
    score: 82,
    mentions: 756,
    growth: '+28%',
    url: '#',
    created_at: '2024-08-01T09:00:00Z'
  },
  {
    id: '4',
    topic: 'Mental Health Awareness',
    category: 'Health',
    score: 79,
    mentions: 654,
    growth: '+23%',
    url: '#',
    created_at: '2024-08-01T08:30:00Z'
  },
  {
    id: '5',
    topic: 'Cryptocurrency Markets',
    category: 'Finance',
    score: 76,
    mentions: 543,
    growth: '+19%',
    url: '#',
    created_at: '2024-08-01T08:00:00Z'
  }
];

export const mockNotifications = [
  {
    id: '1',
    user_id: '1',
    type: 'like',
    message: 'Sarah Chen liked your post',
    data: { post_id: '1', user_id: '2' },
    read: false,
    created_at: '2024-08-01T10:35:00Z'
  },
  {
    id: '2',
    user_id: '1',
    type: 'comment',
    message: 'Tech Insider commented on your post',
    data: { post_id: '1', user_id: '7' },
    read: false,
    created_at: '2024-08-01T10:40:00Z'
  },
  {
    id: '3',
    user_id: '1',
    type: 'follow',
    message: 'Emma Wilson started following you',
    data: { user_id: '9' },
    read: true,
    created_at: '2024-08-01T09:15:00Z'
  }
];

export const mockCommunities = [
  {
    id: '1',
    name: 'Tech Enthusiasts',
    description: 'A community for technology lovers, developers, and innovators',
    avatar_url: null,
    banner_url: null,
    creator_id: '1',
    members_count: 1234,
    posts_count: 567,
    is_private: false,
    is_premium: false,
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Design & Creativity',
    description: 'Share your creative work and get inspired by others',
    avatar_url: null,
    banner_url: null,
    creator_id: '2',
    members_count: 890,
    posts_count: 234,
    is_private: false,
    is_premium: false,
    created_at: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Fitness & Wellness',
    description: 'Supporting each other on our fitness and wellness journeys',
    avatar_url: null,
    banner_url: null,
    creator_id: '12',
    members_count: 567,
    posts_count: 123,
    is_private: false,
    is_premium: false,
    created_at: '2024-01-20T00:00:00Z'
  }
];

// Helper functions
export const getMockPosts = (limit = 10) => {
  return mockPosts.slice(0, limit);
};

export const getMockComments = (postId) => {
  return mockComments.filter(comment => comment.post_id === postId);
};

export const getMockTrendingTopics = (limit = 5) => {
  return mockTrendingTopics.slice(0, limit);
};

export const getMockNotifications = (userId, limit = 10) => {
  return mockNotifications
    .filter(notification => notification.user_id === userId)
    .slice(0, limit);
};

export const getMockCommunities = (limit = 5) => {
  return mockCommunities.slice(0, limit);
};

export default {
  posts: mockPosts,
  comments: mockComments,
  trendingTopics: mockTrendingTopics,
  notifications: mockNotifications,
  communities: mockCommunities,
  getMockPosts,
  getMockComments,
  getMockTrendingTopics,
  getMockNotifications,
  getMockCommunities
}; 