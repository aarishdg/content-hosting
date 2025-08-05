import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Content, ContentFilter } from '../../types';
import { ContentService } from '../../utils/mockData';
import ContentFilterComponent from '../../components/ui/ContentFilter';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import {
  PlusIcon,
  BookOpenIcon,
  MicrophoneIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [content, setContent] = useState<Content[]>([]);
  const [filter, setFilter] = useState<ContentFilter>({
    content_type: 'all',
    status: 'all',
    search: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadContent = async () => {
      setLoading(true);
      try {
        const userContent = await ContentService.getContentByAuthor(user.id, filter);
        setContent(userContent);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [user, filter]);

  const handleDeleteContent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await ContentService.deleteContent(id);
        // Reload content
        if (user) {
          const userContent = await ContentService.getContentByAuthor(user.id, filter);
          setContent(userContent);
        }
      } catch (error) {
        console.error('Error deleting content:', error);
        alert('Failed to delete content');
      }
    }
  };

  const stats = {
    total: content.length,
    published: content.filter(c => c.status === 'published').length,
    drafts: content.filter(c => c.status === 'draft').length,
    articles: content.filter(c => c.content_type === 'article').length,
    podcasts: content.filter(c => c.content_type === 'podcast').length,
  };

  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await ContentService.getAllTags();
        setAllTags(tags);
      } catch (error) {
        setAllTags([]);
      }
    };
    fetchTags();
  }, []);

  if (!user || user.role !== 'contributor') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You need to be a contributor to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Content Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your articles and podcasts</p>
            </div>
            <Link to="/dashboard/create" className="btn-primary flex items-center space-x-2">
              <PlusIcon className="w-5 h-5" />
              <span>Create Content</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-3">
              <ChartBarIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Content</div>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <EyeIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.published}</div>
            <div className="text-sm text-gray-600">Published</div>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
              <PencilIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.drafts}</div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
              <BookOpenIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.articles}</div>
            <div className="text-sm text-gray-600">Articles</div>
          </div>

          <div className="card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <MicrophoneIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.podcasts}</div>
            <div className="text-sm text-gray-600">Podcasts</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ContentFilterComponent
            filter={filter}
            onFilterChange={setFilter}
            availableTags={allTags}
            showStatusFilter={true}
          />
        </div>

        {/* Content List */}
        <div className="card">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Content</h2>
            <div className="text-sm text-gray-500">
              {content.length} {content.length === 1 ? 'item' : 'items'}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <span className="text-gray-600">Loading your content...</span>
            </div>
          ) : content.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-600 mb-6">
                {filter.search || filter.content_type !== 'all' || filter.status !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start by creating your first piece of content'
                }
              </p>
              {(!filter.search && filter.content_type === 'all' && filter.status === 'all') && (
                <Link to="/dashboard/create" className="btn-primary">
                  Create Content
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {content.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                          {item.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {item.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  #{tag}
                                </span>
                              ))}
                              {item.tags.length > 3 && (
                                <span className="text-xs text-gray-500">+{item.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${item.content_type === 'article' ? 'badge-article' : 'badge-podcast'}`}>
                          {item.content_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${item.status === 'published' ? 'badge-published' : 'badge-draft'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatRelativeTime(item.updated_at)}</div>
                        <div className="text-xs">{formatDate(item.updated_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {item.status === 'published' && (
                            <Link
                              to={`/content/${item.id}`}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                              title="View"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </Link>
                          )}
                          <Link
                            to={`/dashboard/edit/${item.id}`}
                            className="text-primary-600 hover:text-primary-700 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteContent(item.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;