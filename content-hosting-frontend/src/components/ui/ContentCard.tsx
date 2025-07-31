import React from 'react';
import { Link } from 'react-router-dom';
import { Content } from '../../types';
import { formatDate, formatDuration, stripHtml, truncateText } from '../../utils/helpers';
import { BookOpenIcon, MicrophoneIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface ContentCardProps {
  content: Content;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const {
    id,
    title,
    description,
    content_type,
    status,
    tags,
    rich_text_content,
    audio_duration,
    created_at,
    published_at,
  } = content;

  const displayDate = published_at || created_at;
  const preview = content_type === 'article' && rich_text_content 
    ? stripHtml(rich_text_content) 
    : description;

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {content_type === 'article' ? (
            <BookOpenIcon className="w-5 h-5 text-blue-600" />
          ) : (
            <MicrophoneIcon className="w-5 h-5 text-purple-600" />
          )}
          <span className={`badge ${content_type === 'article' ? 'badge-article' : 'badge-podcast'}`}>
            {content_type}
          </span>
        </div>
        
        {status && (
          <span className={`badge ${status === 'published' ? 'badge-published' : 'badge-draft'}`}>
            {status}
          </span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
        <Link to={`/content/${id}`}>
          {title}
        </Link>
      </h3>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {truncateText(preview, 150)}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-gray-500">+{tags.length - 3} more</span>
          )}
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-4 h-4" />
          <span>{formatDate(displayDate)}</span>
        </div>
        
        {content_type === 'podcast' && audio_duration && (
          <div className="flex items-center space-x-1">
            <ClockIcon className="w-4 h-4" />
            <span>{formatDuration(audio_duration)}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <Link
          to={`/content/${id}`}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
        >
          {content_type === 'article' ? 'Read article' : 'Listen to podcast'} →
        </Link>
      </div>
    </div>
  );
};

export default ContentCard;