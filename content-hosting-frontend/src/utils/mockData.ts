
import { Content, ContentFilter } from '../types';
import { supabase } from './supabaseClient';

export class ContentService {
  // Fetch published content (for public users)
  static async getPublishedContent(filter?: ContentFilter): Promise<Content[]> {
    let query = supabase
      .from('content')
      .select('*')
      .eq('status', 'published');

    if (filter?.content_type && filter.content_type !== 'all') {
      query = query.eq('content_type', filter.content_type);
    }
    if (filter?.tag) {
      query = query.contains('tags', [filter.tag]);
    }
    if (filter?.search) {
      // Simple search on title/description
      query = query.or(`title.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
    }
    const { data, error } = await query.order('published_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // Fetch content by author (for contributors)
  static async getContentByAuthor(authorId: string, filter?: ContentFilter): Promise<Content[]> {
    let query = supabase
      .from('content')
      .select('*')
      .eq('author_id', authorId);

    if (filter?.content_type && filter.content_type !== 'all') {
      query = query.eq('content_type', filter.content_type);
    }
    if (filter?.status && filter.status !== 'all') {
      query = query.eq('status', filter.status);
    }
    if (filter?.search) {
      query = query.or(`title.ilike.%${filter.search}%,description.ilike.%${filter.search}%`);
    }
    const { data, error } = await query.order('updated_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async getContentById(id: string): Promise<Content | null> {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  }

  static async createContent(data: Omit<Content, 'id' | 'created_at' | 'updated_at'>): Promise<Content | null> {
    const { data: inserted, error } = await supabase
      .from('content')
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return inserted;
  }

  static async updateContent(id: string, data: Partial<Content>): Promise<Content | null> {
    const { data: updated, error } = await supabase
      .from('content')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return updated;
  }

  static async deleteContent(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('content')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }

  static async getAllTags(): Promise<string[]> {
    const { data, error } = await supabase
      .from('content')
      .select('tags');
    if (error) throw error;
    const allTags = (data || []).flatMap((c: any) => c.tags || []);
    return Array.from(new Set(allTags)).sort();
  }
}

