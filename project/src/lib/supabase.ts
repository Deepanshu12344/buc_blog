import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  bio: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  author_id: string;
  title: string;
  subtitle: string;
  content: string;
  cover_image: string | null;
  published: boolean;
  published_at: string | null;
  reading_time: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
};
