import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Content, ContentFormData } from '../../types';
import { ContentService } from '../../utils/mockData';
import ContentForm from '../../components/forms/ContentForm';

const EditContentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [content, setContent] = useState<Content | null>(null);

  useEffect(() => {
    if (!id || !user) return;

    const loadContent = async () => {
      setFormLoading(true);
      try {
        const contentItem = await ContentService.getContentById(id);
        if (contentItem && contentItem.author_id === user.id) {
          setContent(contentItem);
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading content:', error);
        navigate('/dashboard');
      } finally {
        setFormLoading(false);
      }
    };

    loadContent();
  }, [id, user, navigate]);

  const handleSubmit = async (formData: ContentFormData) => {
    if (!user || !id) return;

    setLoading(true);
    try {
      const updatedContent = await ContentService.updateContent(id, {
        title: formData.title,
        description: formData.description,
        content_type: formData.content_type,
        status: formData.status,
        tags: formData.tags,
        rich_text_content: formData.rich_text_content,
        // Note: In a real app, you'd handle file uploads differently
        audio_file_url: formData.audio_file ? 'mock-audio-url' : content?.audio_file_url,
        audio_duration: formData.audio_file ? 1800 : content?.audio_duration,
      });

      if (updatedContent) {
        console.log('Updated content:', updatedContent);
        navigate('/dashboard');
      } else {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Failed to update content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (!user || user.role !== 'contributor') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You need to be a contributor to edit content.</p>
          </div>
        </div>
      </div>
    );
  }

  if (formLoading) {
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

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Not Found</h1>
            <p className="text-gray-600 mb-6">
              The content you're trying to edit doesn't exist or you don't have permission to edit it.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initialFormData: Partial<ContentFormData> = {
    title: content.title,
    description: content.description,
    content_type: content.content_type,
    status: content.status,
    tags: content.tags,
    rich_text_content: content.rich_text_content,
    // Note: We can't pre-populate the file input, so audio_file remains null
    audio_file: null,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
          <p className="text-gray-600 mt-2">Update your {content.content_type}</p>
        </div>

        {/* Current Audio Info */}
        {content.content_type === 'podcast' && content.audio_file_url && (
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Current Audio File</h3>
                <p className="text-sm text-gray-600">
                  {content.audio_duration ? `Duration: ${Math.floor(content.audio_duration / 60)}:${(content.audio_duration % 60).toString().padStart(2, '0')}` : 'Audio file uploaded'}
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Upload a new file to replace the current one
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <ContentForm
          initialData={initialFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default EditContentPage;