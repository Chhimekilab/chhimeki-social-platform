import { supabase, db } from '../lib/supabase';

// Helper function to handle database errors
const handleDatabaseError = (error, operation) => {
  console.error(`Database error during ${operation}:`, error);
  throw new Error(error.message || `Failed to ${operation}`);
};

// Users service
export const usersService = {
  // Get user profile by ID
  getProfile: async (userId) => {
    try {
      const { data, error } = await db.users
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'get user profile');
    }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    try {
      const { data, error } = await db.users
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'update user profile');
    }
  },

  // Search users
  searchUsers: async (query, limit = 10) => {
    try {
      const { data, error } = await db.users
        .select('id, username, full_name, avatar_url, verified, bio')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(limit);
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'search users');
    }
  },

  // Get user followers
  getFollowers: async (userId, limit = 20, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower_id,
          created_at,
          users:follower_id (
            id, username, full_name, avatar_url, verified
          )
        `)
        .eq('following_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data.map(item => ({ ...item.users, followed_at: item.created_at }));
    } catch (error) {
      handleDatabaseError(error, 'get followers');
    }
  },

  // Get user following
  getFollowing: async (userId, limit = 20, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following_id,
          created_at,
          users:following_id (
            id, username, full_name, avatar_url, verified
          )
        `)
        .eq('follower_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data.map(item => ({ ...item.users, followed_at: item.created_at }));
    } catch (error) {
      handleDatabaseError(error, 'get following');
    }
  }
};

// Posts service
export const postsService = {
  // Create a new post
  create: async (postData) => {
    try {
      const { data, error } = await db.posts
        .insert(postData)
        .select(`
          *,
          users (id, username, full_name, avatar_url, verified)
        `)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'create post');
    }
  },

  // Get posts feed
  getFeed: async (limit = 20, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (id, username, full_name, avatar_url, verified),
          likes!inner(count),
          comments(count)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'get posts feed');
    }
  },

  // Get posts by user
  getByUser: async (userId, limit = 20, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (id, username, full_name, avatar_url, verified)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'get user posts');
    }
  },

  // Get single post with comments
  getById: async (postId) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (id, username, full_name, avatar_url, verified),
          comments (
            *,
            users (id, username, full_name, avatar_url, verified)
          )
        `)
        .eq('id', postId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'get post');
    }
  },

  // Update post
  update: async (postId, updates) => {
    try {
      const { data, error } = await db.posts
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', postId)
        .select(`
          *,
          users (id, username, full_name, avatar_url, verified)
        `)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'update post');
    }
  },

  // Delete post
  delete: async (postId) => {
    try {
      const { error } = await db.posts
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, 'delete post');
    }
  },

  // Like/unlike post
  toggleLike: async (postId, userId) => {
    try {
      // Check if already liked
      const { data: existingLike } = await db.likes
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await db.likes
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);
        
        if (error) throw error;
        return { liked: false };
      } else {
        // Like
        const { error } = await db.likes
          .insert({ post_id: postId, user_id: userId });
        
        if (error) throw error;
        return { liked: true };
      }
    } catch (error) {
      handleDatabaseError(error, 'toggle post like');
    }
  }
};

// Comments service
export const commentsService = {
  // Create comment
  create: async (commentData) => {
    try {
      const { data, error } = await db.comments
        .insert(commentData)
        .select(`
          *,
          users (id, username, full_name, avatar_url, verified)
        `)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'create comment');
    }
  },

  // Get comments for post
  getByPost: async (postId, limit = 50, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users (id, username, full_name, avatar_url, verified)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'get comments');
    }
  },

  // Delete comment
  delete: async (commentId) => {
    try {
      const { error } = await db.comments
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, 'delete comment');
    }
  }
};

// Follows service
export const followsService = {
  // Follow user
  follow: async (followerId, followingId) => {
    try {
      const { error } = await db.follows
        .insert({ follower_id: followerId, following_id: followingId });
      
      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, 'follow user');
    }
  },

  // Unfollow user
  unfollow: async (followerId, followingId) => {
    try {
      const { error } = await db.follows
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, 'unfollow user');
    }
  },

  // Check if following
  isFollowing: async (followerId, followingId) => {
    try {
      const { data, error } = await db.follows
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();
      
      return !!data;
    } catch (error) {
      return false;
    }
  }
};

// Communities service
export const communitiesService = {
  // Create community
  create: async (communityData) => {
    try {
      const { data, error } = await db.communities
        .insert(communityData)
        .select()
        .single();
      
      if (error) throw error;

      // Add creator as admin member
      await db.community_memberships
        .insert({
          community_id: data.id,
          user_id: communityData.creator_id,
          role: 'admin'
        });

      return data;
    } catch (error) {
      handleDatabaseError(error, 'create community');
    }
  },

  // Get all communities
  getAll: async (limit = 20, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          users!creator_id (id, username, full_name, avatar_url, verified)
        `)
        .order('members_count', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'get communities');
    }
  },

  // Get community by ID
  getById: async (communityId) => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select(`
          *,
          users!creator_id (id, username, full_name, avatar_url, verified)
        `)
        .eq('id', communityId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'get community');
    }
  }
};

// Events service
export const eventsService = {
  // Create event
  create: async (eventData) => {
    try {
      const { data, error } = await db.events
        .insert(eventData)
        .select(`
          *,
          users!creator_id (id, username, full_name, avatar_url, verified)
        `)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'create event');
    }
  },

  // Get upcoming events
  getUpcoming: async (limit = 20, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          users!creator_id (id, username, full_name, avatar_url, verified)
        `)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'get upcoming events');
    }
  },

  // RSVP to event
  rsvp: async (eventId, userId, status = 'going') => {
    try {
      const { error } = await supabase
        .from('event_attendees')
        .upsert({ 
          event_id: eventId, 
          user_id: userId, 
          status 
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, 'RSVP to event');
    }
  }
};

// Notifications service
export const notificationsService = {
  // Get user notifications
  getByUser: async (userId, limit = 50, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:actor_id (id, username, full_name, avatar_url, verified)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'get notifications');
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const { error } = await db.notifications
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, 'mark notification as read');
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (userId) => {
    try {
      const { error } = await db.notifications
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      
      if (error) throw error;
      return true;
    } catch (error) {
      handleDatabaseError(error, 'mark all notifications as read');
    }
  }
};

// Export all services
export default {
  users: usersService,
  posts: postsService,
  comments: commentsService,
  follows: followsService,
  communities: communitiesService,
  events: eventsService,
  notifications: notificationsService
};