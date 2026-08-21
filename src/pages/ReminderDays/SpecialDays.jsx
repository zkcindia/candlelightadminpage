// src/pages/ReminderDays/SpecialDays.jsx
import React, { useState, useRef } from 'react';
import { 
  PlusIcon, 
  XMarkIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { createSpecialDay } from '../../service/api';

export default function SpecialDays() {
  // State Management
  const [specialDays, setSpecialDays] = useState([
    {
      id: 1,
      title: 'Independence Day',
      description: 'Happy Independence Day',
      date: '2026-08-15',
      category: 'National',
      priority: 'High',
      image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400'
    },
    {
      id: 2,
      title: 'Diwali Festival',
      description: 'Festival of Lights',
      date: '2026-11-12',
      category: 'Festival',
      priority: 'Medium',
      image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400'
    }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'National',
    priority: 'Medium',
    image: null
  });

  // Helper Functions
  const getCategoryColor = (category) => {
    const colors = {
      National: 'bg-red-100 text-red-800',
      Festival: 'bg-orange-100 text-orange-800',
      Birthday: 'bg-pink-100 text-pink-800',
      Event: 'bg-purple-100 text-purple-800',
      Holiday: 'bg-green-100 text-green-800',
      Personal: 'bg-blue-100 text-blue-800',
      Work: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'bg-red-100 text-red-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      Low: 'bg-green-100 text-green-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityEmoji = (priority) => {
    const emojis = {
      High: '🔴',
      Medium: '🟡',
      Low: '🟢'
    };
    return emojis[priority] || '⚪';
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      National: '🇮🇳',
      Festival: '🎊',
      Birthday: '🎂',
      Event: '📅',
      Holiday: '🌴',
      Personal: '❤️',
      Work: '💼'
    };
    return emojis[category] || '📌';
  };

  const getDaysRemaining = (date) => {
    if (!date) return '📅 No date';
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '🎉 Today!';
    if (diffDays === 1) return '✨ Tomorrow!';
    if (diffDays < 0) return '📅 Past Event';
    return `${diffDays} days left`;
  };

  // Form Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({...formData, image: file});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      category: 'National',
      priority: 'Medium',
      image: null
    });
    setImagePreview('');
    setSuccess(null);
    setError(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('date', formData.date);
      submitData.append('category', formData.category);
      submitData.append('priority', formData.priority);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const response = await createSpecialDay(submitData);
      
      if (response.status) {
        setSuccess(response.message || 'Special day created successfully! 🎉');
        
        // Add new day to list
        const newDay = {
          id: response.data?.id || Date.now(),
          title: response.data?.title || formData.title,
          description: response.data?.description || formData.description,
          date: response.data?.date || formData.date,
          category: formData.category,
          priority: formData.priority,
          image: response.data?.image || imagePreview || null
        };
        
        setSpecialDays([newDay, ...specialDays]);
        
        // Close modal after success
        setTimeout(() => {
          setShowModal(false);
          setSuccess(null);
          setImagePreview('');
          setFormData({
            title: '',
            description: '',
            date: '',
            category: 'National',
            priority: 'Medium',
            image: null
          });
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to create special day. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">✨ Special Days</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your important dates and celebrations</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition shadow-sm hover:shadow"
        >
          <PlusIcon className="w-5 h-5" />
          Add Special Day
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Days</p>
          <p className="text-2xl font-bold text-gray-900">{specialDays.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Upcoming</p>
          <p className="text-2xl font-bold text-green-600">
            {specialDays.filter(day => new Date(day.date) >= new Date()).length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">High Priority</p>
          <p className="text-2xl font-bold text-red-600">
            {specialDays.filter(day => day.priority === 'High').length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-purple-600">
            {new Set(specialDays.map(day => day.category)).size}
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

      {/* Cards Grid */}
      {specialDays.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Special Days Added</h3>
          <p className="text-gray-500 mb-4">Start adding your important dates and celebrations</p>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add Your First Special Day
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialDays.map((day) => (
            <div 
              key={day.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {day.image ? (
                  <img 
                    src={day.image} 
                    alt={day.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(day.category)} flex items-center gap-1`}>
                    {getCategoryEmoji(day.category)} {day.category}
                  </span>
                  <span className="bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
                    {getDaysRemaining(day.date)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{day.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{day.description}</p>
                  </div>
                </div>

                <div className="mt-3 flex justify-between items-center text-xs border-t border-gray-100 pt-3">
                  <span className="text-gray-500">📅 {day.date}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-medium ${getPriorityColor(day.priority)}`}>
                    {getPriorityEmoji(day.priority)} {day.priority}
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
              <h2 className="text-xl font-bold text-gray-900">✨ Add Special Day</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError(null);
                  setSuccess(null);
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
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter title"
                  required
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter description or wishes"
                  disabled={loading}
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                  disabled={loading}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Image
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer"
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
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    disabled={loading}
                  >
                    <option value="National">🇮🇳 National</option>
                    <option value="Festival">🎊 Festival</option>
                    <option value="Birthday">🎂 Birthday</option>
                    <option value="Event">📅 Event</option>
                    <option value="Holiday">🌴 Holiday</option>
                    <option value="Personal">❤️ Personal</option>
                    <option value="Work">💼 Work</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    disabled={loading}
                  >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="px-6 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Special Day'
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