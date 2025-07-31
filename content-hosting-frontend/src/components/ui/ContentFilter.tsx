import React from 'react';
import { ContentFilter as FilterType } from '../../types';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface ContentFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  availableTags: string[];
  showStatusFilter?: boolean;
}

const ContentFilter: React.FC<ContentFilterProps> = ({
  filter,
  onFilterChange,
  availableTags,
  showStatusFilter = false,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filter, search: e.target.value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ 
      ...filter, 
      content_type: e.target.value as 'article' | 'podcast' | 'all' 
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ 
      ...filter, 
      status: e.target.value as 'draft' | 'published' | 'all' 
    });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ 
      ...filter, 
      tag: e.target.value || undefined 
    });
  };

  const clearFilters = () => {
    onFilterChange({
      content_type: 'all',
      status: 'all',
      search: '',
      tag: undefined,
    });
  };

  const hasActiveFilters = 
    filter.search || 
    (filter.content_type && filter.content_type !== 'all') ||
    (filter.status && filter.status !== 'all') ||
    filter.tag;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={filter.search || ''}
              onChange={handleSearchChange}
              className="form-input pl-9 w-full"
            />
          </div>
        </div>

        {/* Content Type Filter */}
        <div className="min-w-32">
          <select
            value={filter.content_type || 'all'}
            onChange={handleTypeChange}
            className="form-input text-sm"
          >
            <option value="all">All Types</option>
            <option value="article">Articles</option>
            <option value="podcast">Podcasts</option>
          </select>
        </div>

        {/* Status Filter (for contributors) */}
        {showStatusFilter && (
          <div className="min-w-32">
            <select
              value={filter.status || 'all'}
              onChange={handleStatusChange}
              className="form-input text-sm"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        )}

        {/* Tag Filter */}
        <div className="min-w-32">
          <select
            value={filter.tag || ''}
            onChange={handleTagChange}
            className="form-input text-sm"
          >
            <option value="">All Tags</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                #{tag}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors flex items-center space-x-1"
          >
            <FunnelIcon className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Active filters:</span>
            
            {filter.search && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: {filter.search}
              </span>
            )}
            
            {filter.content_type && filter.content_type !== 'all' && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Type: {filter.content_type}
              </span>
            )}
            
            {filter.status && filter.status !== 'all' && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Status: {filter.status}
              </span>
            )}
            
            {filter.tag && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Tag: #{filter.tag}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentFilter;