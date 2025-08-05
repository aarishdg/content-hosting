import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Content } from '../../types';
import { ContentService } from '../../utils/mockData';
import AudioPlayer from '../../components/ui/AudioPlayer';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import { 
  BookOpenIcon, 
  MicrophoneIcon, 
  CalendarIcon, 
  TagIcon,
  ArrowLeftIcon,
  ShareIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

const ContentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [relatedContent, setRelatedContent] = useState<Content[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadContent = async () => {
      setLoading(true);
      try {
        const contentItem = await ContentService.getContentById(id);
        if (contentItem && contentItem.status === 'published') {
          setContent(contentItem);
          // Load related content (same type or similar tags)
          const allContent = await ContentService.getPublishedContent();
          const related = allContent
            .filter(item =>
              item.id !== contentItem.id &&
              (item.content_type === contentItem.content_type ||
               item.tags.some(tag => contentItem.tags.includes(tag)))
            )
            .slice(0, 3);
          setRelatedContent(related);
        }
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share && content) {
      try {
        await navigator.share({
          title: content.title,
          text: content.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleLike = () => {
    setLiked(!liked);
    // In a real app, this would make an API call
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-gray-600">Loading content...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpenIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Content not found</h1>
            <p className="text-gray-600 mb-6">
              The content you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/" className="btn-primary">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        {/* Content Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {content.content_type === 'article' ? (
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpenIcon className="w-6 h-6 text-blue-600" />
                </div>
              ) : (
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MicrophoneIcon className="w-6 h-6 text-purple-600" />
                </div>
              )}
              <div>
                <span className={`badge ${content.content_type === 'article' ? 'badge-article' : 'badge-podcast'}`}>
                  {content.content_type}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLike}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title={liked ? 'Unlike' : 'Like'}
              >
                {liked ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Share"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            {content.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <CalendarIcon className="w-4 h-4 mr-1" />
              <span>Published {formatDate(content.published_at || content.created_at)}</span>
            </div>
            <div className="flex items-center">
              <span>•</span>
              <span className="ml-1">{formatRelativeTime(content.published_at || content.created_at)}</span>
            </div>
          </div>

          {/* Tags */}
          {content.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <TagIcon className="w-4 h-4 text-gray-400" />
              {content.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/?tag=${tag}`}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        {content.content_type === 'article' && content.rich_text_content ? (
          <div className="card mb-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.rich_text_content }}
            />
          </div>
        ) : content.content_type === 'podcast' && content.audio_file_url ? (
          <div className="mb-8">
            <AudioPlayer
              src={content.audio_file_url}
              title={content.title}
              duration={content.audio_duration}
            />
          </div>
        ) : null}

        {/* Related Content */}
        {relatedContent.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Related Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedContent.map((item) => (
                <Link
                  key={item.id}
                  to={`/content/${item.id}`}
                  className="group block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {item.content_type === 'article' ? (
                      <BookOpenIcon className="w-4 h-4 text-blue-600" />
                    ) : (
                      <MicrophoneIcon className="w-4 h-4 text-purple-600" />
                    )}
                    <span className={`badge ${item.content_type === 'article' ? 'badge-article' : 'badge-podcast'}`}>
                      {item.content_type}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    {formatRelativeTime(item.published_at || item.created_at)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetailPage;