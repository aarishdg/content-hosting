import React, { useState, useEffect } from 'react';
import { Content, ContentFilter } from '../../types';
import { ContentService } from '../../utils/mockData';
import ContentCard from '../../components/ui/ContentCard';
import ContentFilterComponent from '../../components/ui/ContentFilter';
import { MicrophoneIcon } from '@heroicons/react/24/outline';

const PodcastsPage: React.FC = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [filter, setFilter] = useState<ContentFilter>({
    content_type: 'podcast',
    search: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = () => {
      setLoading(true);
      try {
        const publishedContent = ContentService.getPublishedContent(filter);
        setContent(publishedContent);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [filter]);

  const allTags = ContentService.getAllTags();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-gray-600">Loading podcasts...</span>
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
          <div className="flex items-center mb-4">
            <MicrophoneIcon className="w-8 h-8 text-purple-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Podcasts</h1>
          </div>
          <p className="text-gray-600">
            Listen to engaging podcasts from our community of creators
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <ContentFilterComponent
            filter={filter}
            onFilterChange={(newFilter) => setFilter({ ...newFilter, content_type: 'podcast' })}
            availableTags={allTags}
          />
        </div>

        {/* Content Grid */}
        {content.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MicrophoneIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No podcasts found</h3>
            <p className="text-gray-600">
              {filter.search || filter.tag
                ? 'Try adjusting your search criteria'
                : 'No podcasts have been published yet'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {content.length} {content.length === 1 ? 'Podcast' : 'Podcasts'}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PodcastsPage;