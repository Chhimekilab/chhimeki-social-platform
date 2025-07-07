import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file and ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Auth event helpers
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Database helpers
export const db = {
  // Users
  users: {
    select: (query = '*') => supabase.from('users').select(query),
    insert: (data) => supabase.from('users').insert(data),
    update: (id, data) => supabase.from('users').update(data).eq('id', id),
    delete: (id) => supabase.from('users').delete().eq('id', id),
  },
  
  // Posts
  posts: {
    select: (query = '*') => supabase.from('posts').select(query),
    insert: (data) => supabase.from('posts').insert(data),
    update: (id, data) => supabase.from('posts').update(data).eq('id', id),
    delete: (id) => supabase.from('posts').delete().eq('id', id),
  },
  
  // Communities
  communities: {
    select: (query = '*') => supabase.from('communities').select(query),
    insert: (data) => supabase.from('communities').insert(data),
    update: (id, data) => supabase.from('communities').update(data).eq('id', id),
    delete: (id) => supabase.from('communities').delete().eq('id', id),
  },
  
  // Events
  events: {
    select: (query = '*') => supabase.from('events').select(query),
    insert: (data) => supabase.from('events').insert(data),
    update: (id, data) => supabase.from('events').update(data).eq('id', id),
    delete: (id) => supabase.from('events').delete().eq('id', id),
  }
};

export default supabase;