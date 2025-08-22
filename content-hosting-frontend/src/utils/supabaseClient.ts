
// import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// const url = process.env.REACT_APP_SUPABASE_URL!;
// const anon = process.env.REACT_APP_SUPABASE_ANON_KEY!;

// export const supabase: SupabaseClient = createClient(url, anon);




// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }


// src/utils/supabaseClient.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Create React App envs (REACT_APP_*)
const url  = process.env.REACT_APP_SUPABASE_URL!;
const anon = process.env.REACT_APP_SUPABASE_ANON_KEY!;

export const supabase: SupabaseClient = createClient(url, anon);
