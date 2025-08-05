import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Content, ContentFilter } from '../../types';
import { ContentService } from '../../utils/mockData';
import ContentCard from '../../components/ui/ContentCard';
import ContentFilterComponent from '../../components/ui/ContentFilter';
import { 
  BookOpenIcon, 
  MicrophoneIcon, 
  ArrowRightIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [filter, setFilter] = useState<ContentFilter>({
    content_type: 'all',
    search: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const publishedContent = await ContentService.getPublishedContent(filter);
        setContent(publishedContent);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, [filter]);

  const [allTags, setAllTags] = useState<string[]>([]);
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await ContentService.getAllTags();
        setAllTags(tags);
      } catch {
        setAllTags([]);
      }
    };
    fetchTags();
  }, []);

  const featuredContent = content.slice(0, 3);
  const recentArticles = content.filter(c => c.content_type === 'article').slice(0, 4);
  const recentPodcasts = content.filter(c => c.content_type === 'podcast').slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-gray-600">Loading content...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to ContentHub
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Discover amazing articles and podcasts from talented creators. 
              Share knowledge, spark conversations, and explore new ideas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/articles"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                <BookOpenIcon className="w-5 h-5 mr-2" />
                Browse Articles
              </Link>
              <Link
                to="/podcasts"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                <MicrophoneIcon className="w-5 h-5 mr-2" />
                Listen to Podcasts
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <ContentFilterComponent
            filter={filter}
            onFilterChange={setFilter}
            availableTags={allTags}
          />
        </div>

        {/* Featured Content */}
        {featuredContent.length > 0 && !filter.search && filter.content_type === 'all' && (
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <SparklesIcon className="w-6 h-6 text-primary-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Content</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredContent.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          </section>
        )}

        {/* All Content or Filtered Results */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {filter.search || filter.content_type !== 'all' || filter.tag
                ? 'Search Results'
                : 'Latest Content'
              }
            </h2>
            {content.length > 6 && (
              <Link
                to="/browse"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                View all
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            )}
          </div>

          {content.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
              <p className="text-gray-600">
                {filter.search || filter.content_type !== 'all' || filter.tag
                  ? 'Try adjusting your search criteria'
                  : 'No content has been published yet'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.slice(0, 12).map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          )}
        </section>

        {/* Category Sections - Only show when not filtering */}
        {!filter.search && filter.content_type === 'all' && !filter.tag && (
          <>
            {/* Recent Articles */}
            {recentArticles.length > 0 && (
              <section className="mt-16">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <BookOpenIcon className="w-6 h-6 text-blue-600 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900">Recent Articles</h2>
                  </div>
                  <Link
                    to="/articles"
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  >
                    View all articles
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentArticles.map((article) => (
                    <ContentCard key={article.id} content={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Recent Podcasts */}
            {recentPodcasts.length > 0 && (
              <section className="mt-16">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <MicrophoneIcon className="w-6 h-6 text-purple-600 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900">Recent Podcasts</h2>
                  </div>
                  <Link
                    to="/podcasts"
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                  >
                    View all podcasts
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentPodcasts.map((podcast) => (
                    <ContentCard key={podcast.id} content={podcast} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;