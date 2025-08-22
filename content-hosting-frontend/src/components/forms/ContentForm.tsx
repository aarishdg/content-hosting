

// src/components/forms/ContentForm.tsx
import React, { useState, useEffect } from 'react';
import { ContentFormData } from '../../types';
import RichTextEditor from './RichTextEditor';
import {
  CloudArrowUpIcon,
  TagIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface ContentFormProps {
  initialData?: Partial<ContentFormData>;
  onSubmit: (data: ContentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  isEditing?: boolean;
  /** Hide the podcast option and lock to article-only */
  onlyArticle?: boolean;
  /** Hide the article option and lock to podcast-only */
  onlyPodcast?: boolean;
}

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}


const ContentForm: React.FC<ContentFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  isEditing = false,
  onlyArticle = false,
  onlyPodcast = false,
}) => {
  // ─── In the “hooks & state” section ───
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = Array.from(e.dataTransfer.files).find(f =>
      f.type.startsWith('audio/')
    );
    if (file) handleFileUpload(file);
  };


  const [formData, setFormData] = useState<ContentFormData>({
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'draft',
    content_type: (initialData.content_type as any) || 'article',
    tags: initialData.tags || [],
    rich_text_content: initialData.rich_text_content || '',
    audio_file: initialData.audio_file || null,
  });

  const [newTag, setNewTag] = useState('');

  // Lock content_type when in a forced mode
  useEffect(() => {
    if (onlyArticle) {
      setFormData(f => ({ ...f, content_type: 'article' }));
    } else if (onlyPodcast) {
      setFormData(f => ({ ...f, content_type: 'podcast' }));
    }
  }, [onlyArticle, onlyPodcast]);

  const handleContentTypeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const ct = e.target.value as 'article' | 'podcast';
    setFormData(prev => ({
      ...prev,
      content_type: ct,
      rich_text_content:
        ct === 'article' ? prev.rich_text_content : '',
      audio_file: ct === 'podcast' ? prev.audio_file : null,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRichTextChange = (content: string) => {
    setFormData(prev => ({ ...prev, rich_text_content: content }));
  };

  // ─── add this in the “handlers” section, just after handleRichTextChange ───
/**
 * Called when the user picks or drops a file.
 * Ensures only audio files get stored in formData.audio_file.
 */
const handleFileUpload = (file: File) => {
  if (file.type.startsWith('audio/')) {
    setFormData(prev => ({ ...prev, audio_file: file }));
  } else {
    alert('Please select an audio file (mp3, m4a, wav, etc.)');
  }
};


  const addTag = () => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setNewTag('');
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag:string) => {
  setFormData(prev => ({
    ...prev,
    tags: prev.tags.filter(t => t !== tag),
  }));
};

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;
    setFormData(prev => ({ ...prev, audio_file: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // basic validation (tweak as you like)
  if (!formData.title.trim()) {
    alert('Title is required');
    return;
  }
  if (!formData.description.trim()) {
    alert('Description is required');
    return;
  }
  if (formData.content_type === 'podcast' && !formData.audio_file) {
    alert('Please select an audio file for podcasts');
    return;
  }

  // enforce type when the page is locked to one mode
  const content_type =
    (onlyArticle && 'article') ||
    (onlyPodcast && 'podcast') ||
    formData.content_type;

  // call the page’s submit handler
  onSubmit({
    ...formData,
    content_type,
    tags: (formData.tags ?? []).filter(Boolean),
  });
};


  return (
  <div className="max-w-4xl mx-auto">
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Content Type Selection */}
      {onlyArticle && (
        <div className="card mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Content Type
          </h3>
          <div className="p-4 border-2 rounded-lg border-blue-600 bg-blue-50">
            <div className="font-medium text-blue-700">Article</div>
            <div className="text-sm text-blue-600">Write rich text content</div>
          </div>
        </div>
      )}

      {onlyPodcast && (
        <div className="card mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Content Type
          </h3>
          <div className="p-4 border-2 rounded-lg border-blue-600 bg-blue-50">
            <div className="font-medium text-blue-700">Podcast</div>
            <div className="text-sm text-blue-600">Upload audio content</div>
          </div>
        </div>
      )}

      {!onlyArticle && !onlyPodcast && (
        <div className="card mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Content Type
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Article Option */}
            <label
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.content_type === 'article'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="content_type"
                value="article"
                checked={formData.content_type === 'article'}
                onChange={handleContentTypeChange}
                className="sr-only"
              />
              <div>
                <div className="font-medium text-gray-900">Article</div>
                <div className="text-sm text-gray-500">
                  Write rich text content
                </div>
              </div>
            </label>

            {/* Podcast Option */}
            <label
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                formData.content_type === 'podcast'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="content_type"
                value="podcast"
                checked={formData.content_type === 'podcast'}
                onChange={handleContentTypeChange}
                className="sr-only"
              />
              <div>
                <div className="font-medium text-gray-900">Podcast</div>
                <div className="text-sm text-gray-500">
                  Upload audio content
                </div>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="card mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Basic Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Enter a compelling title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              placeholder="Provide a brief description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="card mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleTagKeyPress}
            className="flex-grow border-gray-300 rounded-md shadow-sm"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full space-x-1"
            >
              <TagIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{tag}</span>
              <TrashIcon
                className="h-4 w-4 text-gray-500 cursor-pointer"
                onClick={() => removeTag(tag)}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Article Content */}
      {formData.content_type === 'article' && (
        <div className="card mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Article Content
          </h3>
          <RichTextEditor
            content={formData.rich_text_content ?? ''}
            onChange={handleRichTextChange}
            placeholder="Start writing your article..."
          />
        </div>
      )
      }

      {/* Audio Upload */}
      {formData.content_type === 'podcast' && (
        <div className="card mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Audio Upload
          </h3>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <CloudArrowUpIcon className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2">
              <label className="cursor-pointer text-blue-600 hover:text-blue-700">
                Upload an audio file
                <input
                  type="file"
                  accept="audio/*"
                  onChange={e =>
                    e.target.files?.[0] && handleFileUpload(e.target.files[0])
                  }
                  className="sr-only"
                />
              </label>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              MP3, M4A, WAV up to 100MB
            </p>
            {formData.audio_file && (
              <p className="mt-2 text-sm text-green-700">
                Selected: {formData.audio_file.name}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading
            ? isEditing
              ? 'Updating…'
              : 'Creating…'
            : isEditing
            ? 'Update Content'
            : 'Create Content'}
        </button>
      </div>
    </form>
  </div>
);

};

export default ContentForm;
