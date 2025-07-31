import { Content, ContentFilter } from '../types';

// Mock content data for development
export const mockContent: Content[] = [
  {
    id: '1',
    title: 'Getting Started with React TypeScript',
    description: 'A comprehensive guide to building modern React applications with TypeScript.',
    content_type: 'article',
    status: 'published',
    tags: ['react', 'typescript', 'development'],
    rich_text_content: `
      <h2>Introduction to React TypeScript</h2>
      <p>React with TypeScript provides excellent developer experience with strong typing and better tooling support.</p>
      <h3>Key Benefits</h3>
      <ul>
        <li>Type safety at compile time</li>
        <li>Better IDE support</li>
        <li>Improved refactoring capabilities</li>
        <li>Enhanced code documentation</li>
      </ul>
      <p>In this article, we'll explore how to set up and use React with TypeScript effectively.</p>
    `,
    author_id: '1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    published_at: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'The Future of Web Development',
    description: 'Exploring upcoming trends and technologies in web development.',
    content_type: 'podcast',
    status: 'published',
    tags: ['web development', 'trends', 'technology'],
    audio_file_url: 'https://www.soundjay.com/misc/bell-ringing-05.wav',
    audio_duration: 1800, // 30 minutes
    author_id: '1',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z',
    published_at: '2024-01-10T14:30:00Z',
  },
  {
    id: '3',
    title: 'Building Scalable APIs',
    description: 'Best practices for designing and implementing scalable REST APIs.',
    content_type: 'article',
    status: 'draft',
    tags: ['api', 'backend', 'scalability'],
    rich_text_content: `
      <h2>Designing Scalable APIs</h2>
      <p>This article covers essential patterns and practices for building APIs that can handle growth.</p>
      <h3>Core Principles</h3>
      <ol>
        <li>RESTful design principles</li>
        <li>Proper error handling</li>
        <li>Caching strategies</li>
        <li>Rate limiting</li>
      </ol>
    `,
    author_id: '1',
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-20T09:15:00Z',
  },
  {
    id: '4',
    title: 'Understanding Modern CSS',
    description: 'Deep dive into CSS Grid, Flexbox, and modern layout techniques.',
    content_type: 'podcast',
    status: 'published',
    tags: ['css', 'frontend', 'design'],
    audio_file_url: 'https://www.soundjay.com/misc/bell-ringing-05.wav',
    audio_duration: 2400, // 40 minutes
    author_id: '1',
    created_at: '2024-01-08T11:20:00Z',
    updated_at: '2024-01-08T11:20:00Z',
    published_at: '2024-01-08T11:20:00Z',
  },
];

export class ContentService {
  private static content: Content[] = [...mockContent];

  static getPublishedContent(filter?: ContentFilter): Content[] {
    let filtered = this.content.filter(c => c.status === 'published');
    
    if (filter?.content_type && filter.content_type !== 'all') {
      filtered = filtered.filter(c => c.content_type === filter.content_type);
    }
    
    if (filter?.tag) {
      filtered = filtered.filter(c => c.tags.includes(filter.tag!));
    }
    
    if (filter?.search) {
      const search = filter.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }
    
    return filtered.sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
  }

  static getContentByAuthor(authorId: string, filter?: ContentFilter): Content[] {
    let filtered = this.content.filter(c => c.author_id === authorId);
    
    if (filter?.content_type && filter.content_type !== 'all') {
      filtered = filtered.filter(c => c.content_type === filter.content_type);
    }
    
    if (filter?.status && filter.status !== 'all') {
      filtered = filtered.filter(c => c.status === filter.status);
    }
    
    if (filter?.search) {
      const search = filter.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
      );
    }
    
    return filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  static getContentById(id: string): Content | undefined {
    return this.content.find(c => c.id === id);
  }

  static createContent(data: Omit<Content, 'id' | 'created_at' | 'updated_at'>): Content {
    const newContent: Content = {
      ...data,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    this.content.push(newContent);
    return newContent;
  }

  static updateContent(id: string, data: Partial<Content>): Content | null {
    const index = this.content.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    this.content[index] = {
      ...this.content[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    return this.content[index];
  }

  static deleteContent(id: string): boolean {
    const index = this.content.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    this.content.splice(index, 1);
    return true;
  }

  static getAllTags(): string[] {
    const allTags = this.content.flatMap(c => c.tags);
    return Array.from(new Set(allTags)).sort();
  }
}