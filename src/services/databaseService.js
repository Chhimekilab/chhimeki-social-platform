import { supabase } from './supabaseClient'

// User Management
export const userService = {
  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in user
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out user
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Update user profile
  updateProfile: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
    return { data, error }
  },

  // Get user profile
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  }
}

// Posts Management
export const postService = {
  // Create new post
  createPost: async (postData) => {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
    return { data, error }
  },

  // Get all posts with user info
  getPosts: async (limit = 20, offset = 0) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        ),
        likes:post_likes(count),
        comments:post_comments(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return { data, error }
  },

  // Get single post
  getPost: async (postId) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        ),
        likes:post_likes(count),
        comments:post_comments(count)
      `)
      .eq('id', postId)
      .single()
    return { data, error }
  },

  // Update post
  updatePost: async (postId, updates) => {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select()
    return { data, error }
  },

  // Delete post
  deletePost: async (postId) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
    return { error }
  }
}

// Comments Management
export const commentService = {
  // Create comment
  createComment: async (commentData) => {
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select()
    return { data, error }
  },

  // Get comments for a post
  getComments: async (postId) => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    return { data, error }
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)
    return { error }
  }
}

// Likes Management
export const likeService = {
  // Toggle like on post
  toggleLike: async (postId, userId) => {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id)
      return { liked: false, error }
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert([{ post_id: postId, user_id: userId }])
      return { liked: true, error }
    }
  },

  // Get like count for post
  getLikeCount: async (postId) => {
    const { count, error } = await supabase
      .from('likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
    return { count, error }
  },

  // Check if user liked post
  hasUserLiked: async (postId, userId) => {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()
    return { liked: !!data, error }
  }
}

// Followers Management
export const followService = {
  // Follow user
  followUser: async (followerId, followingId) => {
    const { data, error } = await supabase
      .from('followers')
      .insert([{ follower_id: followerId, following_id: followingId }])
      .select()
    return { data, error }
  },

  // Unfollow user
  unfollowUser: async (followerId, followingId) => {
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
    return { error }
  },

  // Get followers count
  getFollowersCount: async (userId) => {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId)
    return { count, error }
  },

  // Get following count
  getFollowingCount: async (userId) => {
    const { count, error } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId)
    return { count, error }
  },

  // Check if user is following another user
  isFollowing: async (followerId, followingId) => {
    const { data, error } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single()
    return { following: !!data, error }
  }
}

// Analytics Service
export const analyticsService = {
  // Track post view
  trackPostView: async (postId, userId = null) => {
    const { data, error } = await supabase
      .from('post_views')
      .insert([{ post_id: postId, user_id: userId }])
    return { data, error }
  },

  // Get post analytics
  getPostAnalytics: async (postId) => {
    const { data, error } = await supabase
      .from('post_views')
      .select('*', { count: 'exact' })
      .eq('post_id', postId)
    return { data, error }
  }
}

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to new posts
  subscribeToPosts: (callback) => {
    return supabase
      .channel('posts')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' }, 
        callback
      )
      .subscribe()
  },

  // Subscribe to post updates
  subscribeToPostUpdates: (postId, callback) => {
    return supabase
      .channel(`post:${postId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'posts', filter: `id=eq.${postId}` }, 
        callback
      )
      .subscribe()
  },

  // Subscribe to comments
  subscribeToComments: (postId, callback) => {
    return supabase
      .channel(`comments:${postId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, 
        callback
      )
      .subscribe()
  }
}

export default {
  userService,
  postService,
  commentService,
  likeService,
  followService,
  analyticsService,
  realtimeService
} 