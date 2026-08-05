// src/pages/ReminderDays/SpecialDays.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  FireIcon,
  HeartIcon,
  StarIcon,
  CalendarIcon,
  PhotoIcon,
  LinkIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';

export default function SpecialDays() {
  const [specialDays, setSpecialDays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'upload'
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    image: '',
    imageFile: null,
    wishes: '',
    category: 'festival',
    priority: 'medium'
  });

  // Load sample data
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        title: '🇮🇳 Independence Day',
        date: '2026-08-15',
        image: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=400',
        wishes: 'Freedom is our birthright! Jai Hind! 🇮🇳',
        category: 'festival',
        priority: 'high'
      },
      {
        id: 2,
        title: '🎂 Rahul\'s Birthday',
        date: '2026-08-25',
        image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400',
        wishes: 'Happy Birthday Rahul! May your day be filled with joy! 🎂',
        category: 'birthday',
        priority: 'high'
      },
      {
        id: 3,
        title: '🪔 Diwali Festival',
        date: '2026-11-12',
        image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=400',
        wishes: 'May the light of Diwali fill your life with joy! 🪔',
        category: 'festival',
        priority: 'medium'
      }
    ];
    setSpecialDays(sampleData);
  }, []);

  // Helper functions
  const getDaysRemaining = (date) => {
    const days = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    if (days === 0) return '🎉 Today!';
    if (days === 1) return '✨ Tomorrow!';
    if (days < 0) return '📅 Past Event';
    return `${days} days`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      festival: 'bg-red-100 text-red-800',
      birthday: 'bg-pink-100 text-pink-800',
      event: 'bg-purple-100 text-purple-800',
      holiday: 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      festival: <FireIcon className="w-3 h-3" />,
      birthday: <HeartIcon className="w-3 h-3" />,
      event: <StarIcon className="w-3 h-3" />,
      holiday: <CalendarIcon className="w-3 h-3" />
    };
    return icons[category] || <CalendarIcon className="w-3 h-3" />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700'
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({...formData, image: reader.result, imageFile: file});
      };
      reader.readAsDataURL(file);
    }
  };

  // CRUD operations
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      date: '',
      image: '',
      imageFile: null,
      wishes: '',
      category: 'festival',
      priority: 'medium'
    });
    setImagePreview('');
    setImageSource('url');
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ...item,
      imageFile: null
    });
    setImagePreview(item.image || '');
    setImageSource(item.image ? 'url' : 'upload');
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      setSpecialDays(specialDays.filter(item => item.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    let imageData = formData.image;
    
    // Agar image upload hai toh use karo
    if (imageSource === 'upload' && formData.imageFile) {
      imageData = imagePreview;
    }
    
    const saveData = {
      ...formData,
      image: imageData
    };
    
    if (editingItem) {
      setSpecialDays(specialDays.map(item => 
        item.id === editingItem.id ? { ...saveData, id: item.id } : item
      ));
    } else {
      setSpecialDays([...specialDays, { ...saveData, id: Date.now() }]);
    }
    setShowModal(false);
    setEditingItem(null);
    setImagePreview('');
  };

  const filteredDays = specialDays.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const categories = ['all', 'festival', 'birthday', 'event', 'holiday'];

  return (
    <div>
      {/* Filters & View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2 bg-white rounded-lg shadow-sm p-1 border border-gray-200">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === cat ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <PlusIcon className="w-5 h-5" />
            Add
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredDays.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No special days added yet</p>
          <button onClick={handleAdd} className="mt-2 text-blue-600 hover:text-blue-700">
            Add your first special day
          </button>
        </div>
      ) : (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
          {filteredDays.map(day => (
            <div key={day.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="relative h-48 overflow-hidden">
                {day.image ? (
                  <img src={day.image} alt={day.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(day.category)}`}>
                    {getCategoryIcon(day.category)} {day.category}
                  </span>
                  <span className="text-white text-xs bg-black/30 px-2 py-1 rounded-full">
                    {getDaysRemaining(day.date)}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{day.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{day.wishes}</p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button onClick={() => handleEdit(day)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(day.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex justify-between text-xs border-t border-gray-100 pt-3">
                  <span className="text-gray-500">📅 {day.date}</span>
                  <span className={`px-2 py-0.5 rounded-full ${getPriorityColor(day.priority)}`}>
                    {day.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal with Image Upload + URL Option */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? '✏️ Edit Special Day' : '✨ Add Special Day'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                
                {/* Toggle between URL and Upload */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageSource('url')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      imageSource === 'url' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSource('upload')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      imageSource === 'upload' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <CloudArrowUpIcon className="w-4 h-4" />
                    Upload
                  </button>
                </div>

                {/* URL Input */}
                {imageSource === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={formData.image || ''}
                      onChange={e => {
                        setFormData({...formData, image: e.target.value, imageFile: null});
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste image URL</p>
                  </div>
                )}

                {/* File Upload */}
                {imageSource === 'upload' && (
                  <div>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
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
                              setFormData({...formData, image: '', imageFile: null});
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Click to upload image</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Preview for URL */}
                {imageSource === 'url' && imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-32 rounded-lg object-contain border border-gray-200"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wishes/Message</label>
                <textarea
                  rows="3"
                  value={formData.wishes}
                  onChange={e => setFormData({...formData, wishes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Write special wishes..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="festival">🎊 Festival</option>
                    <option value="birthday">🎂 Birthday</option>
                    <option value="event">📅 Event</option>
                    <option value="holiday">🌴 Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}