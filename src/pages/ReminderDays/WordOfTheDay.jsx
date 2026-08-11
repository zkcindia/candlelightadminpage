// src/pages/ReminderDays/WordOfTheDay.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  BookOpenIcon,
  SparklesIcon,
  PhotoIcon,
  LinkIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import { createSentenceOfDay } from '../../service/api'; // ✅ Import API

export default function WordOfTheDay() {
  const [words, setWords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [imageSource, setImageSource] = useState('url');
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',        // ✅ Changed from 'word' to 'title' (matching API)
    description: '',  // ✅ Changed from 'meaning' to 'description'
    example: '',
    image: '',
    imageFile: null,
    quote: '',
    author: '',
    date: '',
    category: 'inspirational'
  });

  // Load sample data
  useEffect(() => {
    const sampleWords = [
      {
        id: 1,
        title: 'Serendipity',
        description: 'The occurrence and development of events by chance in a happy or beneficial way.',
        example: 'A fortunate stroke of serendipity brought the two old friends together after years apart.',
        image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400',
        quote: 'Serendipity is the art of making an unsought finding.',
        author: 'Pek van Andel',
        date: '2026-08-05',
        category: 'inspirational',
        isToday: true
      },
      {
        id: 2,
        title: 'Resilience',
        description: 'The capacity to recover quickly from difficulties; toughness.',
        example: 'Her resilience in the face of adversity was truly inspiring.',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
        quote: 'Resilience is accepting your new reality, even if it\'s less good than the one you had before.',
        author: 'Elizabeth Edwards',
        date: '2026-08-06',
        category: 'motivational',
        isToday: false
      },
      {
        id: 3,
        title: 'Empathy',
        description: 'The ability to understand and share the feelings of another.',
        example: 'Her empathy allowed her to connect deeply with her students.',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
        quote: 'Empathy is about standing in someone else\'s shoes, feeling with their heart.',
        author: 'Daniel Goleman',
        date: '2026-08-07',
        category: 'inspirational',
        isToday: false
      }
    ];
    setWords(sampleWords);
  }, []);

  // Get today's word
  const todayWord = words.find(w => w.isToday);
  const pastWords = words.filter(w => !w.isToday);

  const getCategoryColor = (category) => {
    const colors = {
      inspirational: 'bg-purple-100 text-purple-800',
      motivational: 'bg-blue-100 text-blue-800',
      educational: 'bg-green-100 text-green-800',
      spiritual: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const categories = ['all', 'inspirational', 'motivational', 'educational', 'spiritual'];

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
      description: '',
      example: '',
      image: '',
      imageFile: null,
      quote: '',
      author: '',
      date: new Date().toISOString().split('T')[0],
      category: 'inspirational'
    });
    setImagePreview('');
    setImageSource('url');
    setError(null);
    setSuccess(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || item.word || '',
      description: item.description || item.meaning || '',
      example: item.example || '',
      image: item.image || '',
      imageFile: null,
      quote: item.quote || '',
      author: item.author || '',
      date: item.date || '',
      category: item.category || 'inspirational'
    });
    setImagePreview(item.image || '');
    setImageSource(item.image ? 'url' : 'upload');
    setError(null);
    setSuccess(null);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      setWords(words.filter(item => item.id !== id));
    }
  };

  // ✅ CREATE SENTENCE OF THE DAY - API CALL
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('date', formData.date || new Date().toISOString().split('T')[0]);
      submitData.append('category', formData.category);
      submitData.append('priority', 'Medium'); // ✅ Default priority
      
      if (formData.imageFile) {
        submitData.append('image', formData.imageFile);
      } else if (formData.image && imageSource === 'url') {
        // If it's a URL, we can't send it as file, so send as string
        // You might want to handle this based on your backend
        submitData.append('image_url', formData.image);
      }

      if (formData.author) {
        submitData.append('author', formData.author);
      }

      const response = await createSentenceOfDay(submitData);
      
      if (response && response.status !== false) {
        setSuccess(response.message || 'Sentence of the day created successfully! 🎉');
        
        const newWord = {
          id: response.data?.id || Date.now(),
          title: response.data?.title || formData.title,
          description: response.data?.description || formData.description,
          image: response.data?.image || imagePreview || null,
          author: response.data?.author || formData.author || null,
          date: response.data?.date || formData.date,
          category: formData.category,
          isToday: false
        };
        
        if (editingItem) {
          setWords(words.map(item => 
            item.id === editingItem.id ? { ...newWord, id: editingItem.id } : item
          ));
        } else {
          setWords([newWord, ...words]);
        }
        
        setTimeout(() => {
          setShowModal(false);
          setSuccess(null);
          setImagePreview('');
          setFormData({
            title: '',
            description: '',
            example: '',
            image: '',
            imageFile: null,
            quote: '',
            author: '',
            date: '',
            category: 'inspirational'
          });
          setEditingItem(null);
        }, 1500);
      } else {
        throw new Error(response?.message || 'Failed to create sentence of the day');
      }
    } catch (err) {
      setError(err.message || 'Failed to create sentence of the day. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetToday = (id) => {
    setWords(words.map(item => ({
      ...item,
      isToday: item.id === id
    })));
  };

  const filteredWords = pastWords.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <div>
      {/* Today's Word - Featured */}
      {todayWord && (
        <div className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative">
            {todayWord.image && (
              <div className="h-64 relative">
                <img 
                  src={todayWord.image} 
                  alt={todayWord.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-purple-900/60 to-pink-900/80" />
              </div>
            )}
            
            <div className="absolute inset-0 p-8 flex flex-col justify-center">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <BookOpenIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                      ✨ Word of the Day
                    </span>
                    <span className="text-xs bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-sm">
                      {new Date().toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full backdrop-blur-sm ${getCategoryColor(todayWord.category)}`}>
                      {todayWord.category}
                    </span>
                  </div>
                  
                  <h2 className="text-4xl font-bold text-white mb-2">{todayWord.title}</h2>
                  <p className="text-white/90 text-lg mb-2">{todayWord.description}</p>
                  {todayWord.example && (
                    <p className="text-white/80 text-sm italic">📝 "{todayWord.example}"</p>
                  )}
                  {todayWord.quote && (
                    <div className="mt-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                      <p className="text-white/90 text-sm">💭 "{todayWord.quote}"</p>
                      {todayWord.author && (
                        <p className="text-white/70 text-xs mt-1">— {todayWord.author}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(todayWord)} 
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition backdrop-blur-sm"
                  >
                    <PencilIcon className="w-4 h-4 text-white" />
                  </button>
                  <button 
                    onClick={() => handleDelete(todayWord.id)} 
                    className="bg-white/20 hover:bg-red-500/30 p-2 rounded-lg transition backdrop-blur-sm"
                  >
                    <TrashIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Words */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2 bg-white rounded-lg shadow-sm p-1 border border-gray-200">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === cat ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'
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
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={handleAdd}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <PlusIcon className="w-5 h-5" />
              Add Word
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <span className="text-green-600">✅</span>
            <p className="text-green-600">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <span className="text-red-600">❌</span>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Words Grid */}
        {filteredWords.length === 0 && !todayWord ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No words added yet</p>
            <button onClick={handleAdd} className="mt-2 text-purple-600 hover:text-purple-700">
              Add your first word
            </button>
          </div>
        ) : (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
            {filteredWords.map(word => (
              <div key={word.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                {word.image ? (
                  <div className="h-40 overflow-hidden">
                    <img src={word.image} alt={word.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <PhotoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{word.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{word.description}</p>
                      {word.example && (
                        <p className="text-xs text-gray-500 mt-2 italic">📝 "{word.example}"</p>
                      )}
                      {word.quote && (
                        <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                          <p className="text-xs text-purple-700">💭 "{word.quote}"</p>
                          {word.author && (
                            <p className="text-xs text-purple-500 mt-1">— {word.author}</p>
                          )}
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(word.category)}`}>
                          {word.category}
                        </span>
                        <span className="text-xs text-gray-400">{word.date}</span>
                        {word.author && (
                          <span className="text-xs text-gray-400">✍️ {word.author}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 ml-2">
                      <button
                        onClick={() => handleSetToday(word.id)}
                        className="px-2 py-1 text-xs bg-green-100 text-green-700 hover:bg-green-200 rounded transition whitespace-nowrap"
                      >
                        Set Today
                      </button>
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(word)} className="p-1 text-purple-600 hover:bg-purple-50 rounded">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(word.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal with Image Upload + URL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? '✏️ Edit Word' : '✨ Add Sentence of the Day'}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Example Sentence</label>
                <input
                  type="text"
                  value={formData.example}
                  onChange={e => setFormData({...formData, example: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter example sentence"
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setImageSource('url')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      imageSource === 'url' 
                        ? 'bg-purple-600 text-white' 
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
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <CloudArrowUpIcon className="w-4 h-4" />
                    Upload
                  </button>
                </div>

                {imageSource === 'url' && (
                  <div>
                    <input
                      type="url"
                      value={formData.image || ''}
                      onChange={e => {
                        setFormData({...formData, image: e.target.value, imageFile: null});
                        setImagePreview(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-500 mt-1">Paste image URL</p>
                  </div>
                )}

                {imageSource === 'upload' && (
                  <div>
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition cursor-pointer"
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspirational Quote</label>
                <textarea
                  rows="2"
                  value={formData.quote}
                  onChange={e => setFormData({...formData, quote: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter inspirational quote"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({...formData, author: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter author name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="inspirational">💫 Inspirational</option>
                    <option value="motivational">💪 Motivational</option>
                    <option value="educational">📚 Educational</option>
                    <option value="spiritual">🕊️ Spiritual</option>
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
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    editingItem ? 'Update' : 'Add'
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