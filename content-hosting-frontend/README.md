# Supabase Setup Checklist

1. **Create a Supabase Project**
   - Go to https://app.supabase.com/ and create a new project.
   - Get your Project URL and Anon Key from Project Settings > API.

2. **Create Tables**
   - Use the SQL Editor to create the following tables:
   - `profiles` (for user roles)
   - `content` (for articles and podcasts)

3. **Enable Row Level Security (RLS) and Policies**
   - Enable RLS for both `profiles` and `content` tables.
   - Add policies:
     - Public users: Can only select content where status = 'published'.
     - Contributors: Can insert, update, delete only their own content.
     - Users can only view/update their own profile.

4. **Environment Variables**
   - Copy `.env.example` to `.env` and fill in your Supabase URL and Anon Key.

5. **Install Dependencies**
   - Run `npm install` in this folder.

6. **Start the Frontend**
   - Run `npm start`.

See the main project README for full SQL and policy examples.
# ContentHub Frontend

A modern React TypeScript frontend for a content hosting platform that supports articles and podcasts.

## 🚀 Features

### Public Features
- **Home Page**: Browse featured content, articles, and podcasts
- **Content Discovery**: Search and filter by type, tags, and keywords
- **Article Reading**: Rich text content with modern typography
- **Podcast Listening**: Built-in audio player with controls
- **Responsive Design**: Works seamlessly on desktop and mobile

### Contributor Features
- **Dashboard**: Manage all your content in one place
- **Content Creation**: Create articles with rich text editor or upload podcast audio
- **Content Management**: Edit, publish, or delete your content
- **Draft Support**: Save content as drafts before publishing
- **Tag Management**: Add tags to organize and categorize content

### Technical Features
- **TypeScript**: Fully typed for better development experience
- **Tailwind CSS**: Modern utility-first styling
- **Tiptap Rich Text Editor**: WYSIWYG editor for articles
- **Audio Player**: Custom audio player for podcasts
- **Mock Authentication**: Ready for Supabase integration
- **Responsive Layout**: Mobile-first design approach

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Tiptap** for rich text editing
- **Heroicons** for icons
- **Context API** for state management

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd content-hosting-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)
   
   The app will automatically open in your browser!

## 🔐 Demo Credentials

The app includes mock authentication for testing. Use these credentials:

### Contributor Account
- **Email**: `contributor@example.com`
- **Password**: `password`
- **Features**: Can create, edit, and manage content

### Public User Account
- **Email**: `user@example.com`
- **Password**: `password`
- **Features**: Can view published content only

## 📱 Pages & Routes

### Public Routes
- `/` - Home page with featured content
- `/articles` - Browse all published articles
- `/podcasts` - Browse all published podcasts
- `/content/:id` - View individual content (article or podcast)
- `/login` - User authentication
- `/register` - New user registration

### Contributor Routes (requires contributor account)
- `/dashboard` - Content management dashboard
- `/dashboard/create` - Create new content
- `/dashboard/edit/:id` - Edit existing content

## 🎨 Design System

### Colors
- **Primary**: Blue (`#3b82f6`)
- **Secondary**: Gray scale
- **Success**: Green (`#10b981`)
- **Warning**: Yellow (`#f59e0b`)
- **Error**: Red (`#ef4444`)

### Components
- **Cards**: Consistent card layout for content
- **Buttons**: Primary, secondary, and danger variants
- **Forms**: Styled form inputs with validation
- **Badges**: Status and category indicators
- **Navigation**: Sticky header with responsive menu

## 🔧 Key Components

### Content Management
- `ContentCard` - Displays content in lists and grids
- `ContentFilter` - Search and filter functionality
- `ContentForm` - Create/edit form for articles and podcasts
- `RichTextEditor` - WYSIWYG editor using Tiptap

### Audio Features
- `AudioPlayer` - Custom audio player with controls
- Drag & drop audio file upload
- Progress bar and volume controls

### Authentication
- `AuthContext` - Manages user state and authentication
- `LoginForm` & `RegisterForm` - Authentication UI
- Role-based access control

## 🎯 Mock Data

The app includes realistic mock data for demonstration:
- 4 sample content items (2 articles, 2 podcasts)
- Various tags and categories
- Published and draft content states
- Mock user accounts with different roles

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
When integrating with Supabase, you'll need to:

1. **Replace mock authentication** with Supabase Auth
2. **Update ContentService** to use Supabase APIs
3. **Add environment variables** for Supabase configuration
4. **Implement file upload** for podcast audio files
5. **Add user management** and role assignments

### Recommended Environment Variables
```env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📖 Usage Examples

### Creating Content
1. Login with contributor account
2. Navigate to Dashboard
3. Click "Create Content"
4. Choose Article or Podcast
5. Fill in details and content
6. Save as draft or publish immediately

### Browsing Content
1. Visit the home page
2. Use filters to search by type or tags
3. Click on content cards to read/listen
4. Use the audio player for podcasts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔮 Future Enhancements

- User profiles and author pages
- Content analytics and stats
- Comments and engagement features
- Social sharing functionality
- Advanced search with full-text search
- Content recommendations
- Email notifications
- Dark mode theme
- Offline support with PWA features

---

**Ready to start creating amazing content!** 🎉
