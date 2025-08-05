export interface User {
  id: string;
  email: string;
  role: 'contributor' | 'public';
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  content_type: 'article' | 'podcast';
  status: 'draft' | 'published';
  tags: string[];
  rich_text_content?: string; // For articles
  audio_file_url?: string; // For podcasts
  audio_duration?: number; // Duration in seconds
  author_id: string;
  author?: User;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ContentFilter {
  content_type?: 'article' | 'podcast' | 'all';
  status?: 'draft' | 'published' | 'all';
  tag?: string;
  search?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'contributor' | 'public') => Promise<void>;
  logout: () => Promise<void>;
}

export interface ContentFormData {
  title: string;
  description: string;
  content_type: 'article' | 'podcast';
  status: 'draft' | 'published';
  tags: string[];
  rich_text_content?: string;
  audio_file?: File | null;
}

export interface AudioPlayerProps {
  src: string;
  title: string;
  duration?: number;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}