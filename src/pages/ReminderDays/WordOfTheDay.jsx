// src/pages/ReminderDays/WordOfTheDay.jsx
import React, { useState, useRef } from 'react';
import { 
  PlusIcon, 
  XMarkIcon,
  BookOpenIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { createSentenceOfDay } from '../../service/api';

export default function WordOfTheDay() {
  const [words, setWords] = useState([
    {
      id: 1,
      title: 'Serendipity',
      description: 'The occurrence and development of events by chance in a happy or beneficial way.',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
      author: 'Pek van Andel',
      date: '2026-08-05',
      category: 'inspirational'
    },
    {
      id: 2,
      title: 'Resilience',
      description: 'The capacity to recover quickly from difficulties; toughness.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      author: 'Elizabeth Edwards',
      date: '2026-08-06',
      category: 'motivational'
    }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    author: '',
    date: '',
    category: '',
    image: ''
  });
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    date: '',
    category: 'inspirational',
    image: null
  });

  const getCategoryColor = (category) => {
    const colors = {
      inspirational: 'bg-purple-100 text-purple-800',
      motivational: 'bg-blue-100 text-blue-800',
      educational: 'bg-green-100 text-green-800',
      spiritual: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      inspirational: '💫',
      motivational: '💪',
      educational: '📚',
      spiritual: '🕊️'
    };
    return emojis[category] || '📌';
  };

  // Validate form
  const validateForm = () => {
    const errors = {
      title: '',
      description: '',
      author: '',
      date: '',
      category: '',
      image: ''
    };
    let isValid = true;

    if (!formData.title || formData.title.trim() === '') {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (!formData.description || formData.description.trim() === '') {
      errors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.author || formData.author.trim() === '') {
      errors.author = 'Author name is required';
      isValid = false;
    }

    if (!formData.date) {
      errors.date = 'Date is required';
      isValid = false;
    }

    if (!formData.category) {
      errors.category = 'Category is required';
      isValid = false;
    }

    if (!formData.image && !imagePreview) {
      errors.image = 'Image is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Clear a specific error when user starts typing
  const clearFieldError = (field) => {
    setFormErrors({ ...formErrors, [field]: '' });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({...formData, image: file});
        setFormErrors({ ...formErrors, image: '' }); // Clear image error
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      category: 'inspirational',
      image: null
    });
    setImagePreview('');
    setFormErrors({
      title: '',
      description: '',
      author: '',
      date: '',
      category: '',
      image: ''
    });
    setSuccess(null);
    setError(null);
    setLoading(false);
    setShowModal(true);
  };

  // ✅ CREATE SENTENCE OF THE DAY - API CALL
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.focus();
      }
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('date', formData.date);
      submitData.append('category', formData.category);
      submitData.append('priority', 'Medium');
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (formData.author) {
        submitData.append('author', formData.author);
      }

      console.log('📤 Submitting Word of Day:', {
        title: formData.title,
        description: formData.description,
        author: formData.author,
        date: formData.date,
        category: formData.category
      });

      const response = await createSentenceOfDay(submitData);
      console.log('✅ Response:', response);
      
      if (response && response.status !== false) {
        setSuccess(response.message || 'Sentence of the day created successfully! 🎉');
        
        const newWord = {
          id: response.data?.id || Date.now(),
          title: response.data?.title || formData.title,
          description: response.data?.description || formData.description,
          image: response.data?.image || imagePreview || null,
          author: response.data?.author || formData.author || null,
          date: response.data?.date || formData.date,
          category: formData.category
        };
        
        setWords([newWord, ...words]);
        
        setTimeout(() => {
          setShowModal(false);
          setLoading(false);
          setSuccess(null);
          setImagePreview('');
          setFormData({
            title: '',
            description: '',
            author: '',
            date: '',
            category: 'inspirational',
            image: null
          });
          setFormErrors({
            title: '',
            description: '',
            author: '',
            date: '',
            category: '',
            image: ''
          });
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 1500);
      } else {
        throw new Error(response?.message || 'Failed to create sentence of the day');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to create sentence of the day. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📖 Sentence of the Day</h1>
          <p className="text-sm text-gray-500 mt-1">Manage inspirational sentences and quotes</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm hover:shadow"
        >
          <PlusIcon className="w-5 h-5" />
          Add Sentence
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Sentences</p>
          <p className="text-2xl font-bold text-gray-900">{words.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-purple-600">
            {new Set(words.map(word => word.category)).size}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">With Authors</p>
          <p className="text-2xl font-bold text-blue-600">
            {words.filter(word => word.author).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">With Images</p>
          <p className="text-2xl font-bold text-green-600">
            {words.filter(word => word.image).length}
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-600">{success}</p>
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <ExclamationCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Words Grid */}
      {words.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Sentences Added</h3>
          <p className="text-gray-500 mb-4">Start adding inspirational sentences and quotes</p>
          <button
            onClick={handleAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add Your First Sentence
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {words.map((word) => (
            <div 
              key={word.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {word.image ? (
                  <img 
                    src={word.image} 
                    alt={word.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(word.category)} flex items-center gap-1`}>
                    {getCategoryEmoji(word.category)} {word.category}
                  </span>
                  <span className="bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {word.date}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{word.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{word.description}</p>
                    {word.author && (
                      <p className="text-xs text-gray-500 mt-2">✍️ {word.author}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-xs border-t border-gray-100 pt-3">
                  <span className="text-gray-500">📅 {word.date}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-medium ${getCategoryColor(word.category)}`}>
                    {getCategoryEmoji(word.category)} {word.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">✨ Add Sentence of the Day</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                  setSuccess(null);
                  setLoading(false);
                  setFormErrors({
                    title: '',
                    description: '',
                    author: '',
                    date: '',
                    category: '',
                    image: ''
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                disabled={loading}
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    clearFieldError('title');
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                    formErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter title"
                  required
                  disabled={loading}
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {formErrors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    clearFieldError('description');
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter description or meaning"
                  required
                  disabled={loading}
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => {
                    setFormData({ ...formData, author: e.target.value });
                    clearFieldError('author');
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                    formErrors.author ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter author name"
                  required
                  disabled={loading}
                />
                {formErrors.author && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {formErrors.author}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    clearFieldError('date');
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                    formErrors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                  disabled={loading}
                />
                {formErrors.date && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {formErrors.date}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Image <span className="text-red-500">*</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-purple-500 transition cursor-pointer ${
                    formErrors.image ? 'border-red-500' : 'border-gray-300'
                  }`}
                  onClick={() => !loading && fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    disabled={loading}
                  />
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg object-contain"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview('');
                          setFormData({ ...formData, image: null });
                          setFormErrors({ ...formErrors, image: '' });
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                        disabled={loading}
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                    </div>
                  )}
                </div>
                {formErrors.image && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {formErrors.image}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({ ...formData, category: e.target.value });
                    clearFieldError('category');
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${
                    formErrors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                  required
                >
                  <option value="inspirational">💫 Inspirational</option>
                  <option value="motivational">💪 Motivational</option>
                  <option value="educational">📚 Educational</option>
                  <option value="spiritual">🕊️ Spiritual</option>
                </select>
                {formErrors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationCircleIcon className="w-4 h-4" />
                    {formErrors.category}
                  </p>
                )}
              </div>

              {/* Required Fields Note */}
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <span className="text-red-500">*</span> All fields are required
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setSuccess(null);
                    setLoading(false);
                    setFormErrors({
                      title: '',
                      description: '',
                      author: '',
                      date: '',
                      category: '',
                      image: ''
                    });
                  }}
                  className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Sentence'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}