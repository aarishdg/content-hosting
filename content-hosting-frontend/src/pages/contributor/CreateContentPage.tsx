import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ContentFormData } from '../../types';
import { ContentService } from '../../utils/mockData';
import ContentForm from '../../components/forms/ContentForm';

const CreateContentPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: ContentFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create content
      const newContent = ContentService.createContent({
        title: formData.title,
        description: formData.description,
        content_type: formData.content_type,
        status: formData.status,
        tags: formData.tags,
        rich_text_content: formData.rich_text_content,
        audio_file_url: formData.audio_file ? 'mock-audio-url' : undefined,
        audio_duration: formData.audio_file ? 1800 : undefined, // Mock duration
        author_id: user.id,
      });

      console.log('Created content:', newContent);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating content:', error);
      alert('Failed to create content. Please try again.');
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
            <p className="text-gray-600">You need to be a contributor to create content.</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
          <p className="text-gray-600 mt-2">Share your knowledge with the world</p>
        </div>

        {/* Form */}
        <ContentForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          isEditing={false}
        />
      </div>
    </div>
  );
};

export default CreateContentPage;