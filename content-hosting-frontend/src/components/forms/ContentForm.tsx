import React, { useState, useEffect } from 'react';
import { ContentFormData } from '../../types';
import RichTextEditor from './RichTextEditor';
import { CloudArrowUpIcon, TagIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ContentFormProps {
  initialData?: Partial<ContentFormData>;
  onSubmit: (data: ContentFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  isEditing?: boolean;
}

const ContentForm: React.FC<ContentFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    content_type: 'article',
    status: 'draft',
    tags: [],
    rich_text_content: '',
    audio_file: null,
    ...initialData,
  });

  const [newTag, setNewTag] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const contentType = e.target.value as 'article' | 'podcast';
    setFormData(prev => ({
      ...prev,
      content_type: contentType,
      // Clear content when switching types
      rich_text_content: contentType === 'article' ? prev.rich_text_content : '',
      audio_file: contentType === 'podcast' ? prev.audio_file : null,
    }));
  };

  const handleRichTextChange = (content: string) => {
    setFormData(prev => ({ ...prev, rich_text_content: content }));
  };

  const handleFileUpload = (file: File) => {
    if (file.type.startsWith('audio/')) {
      setFormData(prev => ({ ...prev, audio_file: file }));
    } else {
      alert('Please select an audio file (.mp3, .m4a, .wav, etc.)');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    
    if (audioFile) {
      handleFileUpload(audioFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const addTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    
    if (formData.content_type === 'article' && !formData.rich_text_content?.trim()) {
      alert('Please add content to your article');
      return;
    }
    
    if (formData.content_type === 'podcast' && !formData.audio_file && !isEditing) {
      alert('Please upload an audio file for your podcast');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content Type Selection */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Content Type</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.content_type === 'article' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
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
                <div className="text-sm text-gray-500">Write rich text content</div>
              </div>
            </label>
            
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              formData.content_type === 'podcast' 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
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
                <div className="text-sm text-gray-500">Upload audio content</div>
              </div>
            </label>
          </div>
        </div>

        {/* Basic Information */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter a compelling title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Provide a brief description"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
          
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="form-input"
                  placeholder="Add a tag"
                />
              </div>
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary flex items-center space-x-1"
              >
                <TagIcon className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {formData.content_type === 'article' ? (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Article Content</h3>
            <RichTextEditor
              content={formData.rich_text_content || ''}
              onChange={handleRichTextChange}
              placeholder="Start writing your article..."
            />
          </div>
        ) : (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Audio Upload</h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <span className="text-sm font-medium text-primary-600 hover:text-primary-700">
                    Upload an audio file
                  </span>
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    className="sr-only"
                  />
                </label>
                <span className="text-sm text-gray-600"> or drag and drop</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                MP3, M4A, WAV up to 100MB
              </p>
              
              {formData.audio_file && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ {formData.audio_file.name} ({Math.round(formData.audio_file.size / 1024 / 1024 * 100) / 100} MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
              </div>
            ) : (
              isEditing ? 'Update Content' : 'Create Content'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentForm;