# content-hosting

## Supabase Setup Instructions

1. **Create a Supabase Project**
   - Go to [https://app.supabase.com/](https://app.supabase.com/) and create a new project.
   - Get your Project URL and Anon Key from Project Settings > API.

2. **Create Tables**
   - Go to the SQL Editor and run the following to create the required tables:


   ```sql
   -- Users table (managed by Supabase Auth)

   -- Profiles table for user roles
   create table profiles (
     id uuid primary key references auth.users(id) on delete cascade,
     email text unique,
     role text check (role in ('contributor', 'public')) not null default 'public'
   );

   -- Content table
   create table content (
     id uuid primary key default uuid_generate_v4(),
     title text not null,
     description text,
     content_type text check (content_type in ('article', 'podcast')) not null,
     status text check (status in ('draft', 'published')) not null default 'draft',
     tags text[],
     rich_text_content text,
     audio_file_url text,
     audio_duration int,
     author_id uuid references profiles(id) on delete cascade,
     created_at timestamptz default now(),
     updated_at timestamptz default now(),
     published_at timestamptz
   );

   -- Add unique constraint to title
   alter table content add constraint unique_title unique (title);
   ```

3. **Enable Row Level Security (RLS) and Policies**
   - Enable RLS for both `profiles` and `content` tables.
   - Add the following policies:

   **Profiles Table:**
   - Allow users to read/update their own profile:
     ```sql
     create policy "Users can view their profile" on profiles for select using (auth.uid() = id);
     create policy "Users can update their profile" on profiles for update using (auth.uid() = id);
     ```

   **Content Table:**
   - Public users: Can only select content where status = 'published'
     ```sql
     create policy "Public can view published content" on content for select using (status = 'published');
     ```
   - Contributors: Can insert, update, delete only their own content
     ```sql
     create policy "Contributors can manage their own content" on content for all using (author_id = auth.uid());
     ```

4. **Environment Variables**
   - Copy `.env.example` to `.env` in `content-hosting-frontend` and fill in your Supabase URL and Anon Key.

5. **Frontend**
   - The frontend is now configured to use Supabase for authentication and content management.
   - Run `npm install` in `content-hosting-frontend` to install dependencies.
   - Start the frontend with `npm start`.

---
For more details, see the Supabase documentation: https://supabase.com/docs
