// src/pages/classmanagment/Subjects.jsx
import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { getBoards, getClasses, getSubjects, addSubject, editSubject, deleteSubject } from '../../service/api';

export default function Subjects() {
  // 📌 State - All dynamic from API
  const [boards, setBoards] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // 📌 Selection State
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  
  // 📌 Modal States
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectImage, setNewSubjectImage] = useState(null);
  const [newSubjectImagePreview, setNewSubjectImagePreview] = useState(null);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editingSubjectName, setEditingSubjectName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 📌 Fetch boards on mount
  useEffect(() => {
    fetchBoards();
  }, []);

  // 📌 Fetch classes when board is selected
  useEffect(() => {
    if (selectedBoardId) {
      fetchClasses(selectedBoardId);
    } else {
      setClasses([]);
      setSelectedClassId('');
    }
  }, [selectedBoardId]);

  // 📌 Fetch subjects when class is selected
  useEffect(() => {
    if (selectedClassId) {
      fetchSubjects(selectedClassId);
    } else {
      setSubjects([]);
    }
  }, [selectedClassId]);

  // ============================================
  // 📌 API CALLS - All dynamic
  // ============================================

  const fetchBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBoards();
      if (response?.status) {
        setBoards(response.data || []);
      } else {
        setError(response?.message || 'Failed to fetch boards');
      }
    } catch (err) {
      setError(err?.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async (boardId) => {
    setLoadingClasses(true);
    setError(null);
    try {
      const response = await getClasses(boardId);
      if (response?.status) {
        setClasses(response.data || []);
      } else {
        setError(response?.message || 'Failed to fetch classes');
        setClasses([]);
      }
    } catch (err) {
      setError(err?.message || 'Network error occurred');
      setClasses([]);
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchSubjects = async (classId) => {
    setLoadingSubjects(true);
    setError(null);
    try {
      const response = await getSubjects(classId);
      if (response?.status) {
        setSubjects(response.data || []);
      } else {
        setError(response?.message || 'Failed to fetch subjects');
        setSubjects([]);
      }
    } catch (err) {
      setError(err?.message || 'Network error occurred');
      setSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
  };

  // 📌 Add Subject with FormData
  const handleAddSubject = async () => {
    const trimmedName = newSubjectName.trim();
    if (!trimmedName) {
      setError('Subject name is required');
      return;
    }

    if (!selectedClassId) {
      setError('Please select a class first');
      return;
    }

    if (!newSubjectImage) {
      setError('Subject image is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('name', trimmedName);
      formData.append('class_id', parseInt(selectedClassId));
      formData.append('image', newSubjectImage);

      const response = await addSubject(formData);
      
      if (response?.status) {
        setSubjects(prev => [...prev, response.data]);
        setNewSubjectName('');
        setNewSubjectImage(null);
        setNewSubjectImagePreview(null);
        setShowAddSubjectModal(false);
        setSuccess('Subject added successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.message || 'Failed to add subject');
      }
    } catch (err) {
      console.error('❌ Add Subject Error:', err);
      setError(err?.message || 'Failed to add subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📌 Edit Subject
  const handleEditSubject = async (id) => {
    const trimmedName = editingSubjectName.trim();
    if (!trimmedName) {
      setError('Subject name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await editSubject(id, { name: trimmedName });
      
      if (response?.status) {
        setSubjects(prev => 
          prev.map(sub => 
            sub.id === id ? { ...sub, name: trimmedName } : sub
          )
        );
        setEditingSubjectId(null);
        setEditingSubjectName('');
        setSuccess('Subject updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.message || 'Failed to update subject');
      }
    } catch (err) {
      console.error('❌ Edit Subject Error:', err);
      setError(err?.message || 'Failed to update subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📌 Delete Subject
  const handleDeleteSubject = async (id, subjectName) => {
    if (!window.confirm(`Are you sure you want to delete "${subjectName}"?`)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await deleteSubject(id);
      if (response?.status) {
        setSubjects(prev => prev.filter(sub => sub.id !== id));
        setSuccess('Subject deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.message || 'Failed to delete subject');
      }
    } catch (err) {
      setError(err?.message || 'Failed to delete subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // 📌 UI Handlers
  // ============================================

  const startEditing = (subject) => {
    setEditingSubjectId(subject.id);
    setEditingSubjectName(subject.name);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingSubjectId(null);
    setEditingSubjectName('');
    setError(null);
  };

  const handleBoardChange = (e) => {
    const value = e.target.value;
    setSelectedBoardId(value);
    setSelectedClassId('');
    setSubjects([]);
    setError(null);
    setSuccess(null);
  };

  const handleClassChange = (e) => {
    const value = e.target.value;
    setSelectedClassId(value);
    setError(null);
    setSuccess(null);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
        e.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        e.target.value = '';
        return;
      }

      setNewSubjectImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSubjectImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const openViewModal = (subject) => {
    setSelectedSubject(subject);
    setShowViewModal(true);
  };

  // Get selected board and class names
  const selectedBoard = boards.find(b => b.id === parseInt(selectedBoardId));
  const selectedClass = classes.find(c => c.id === parseInt(selectedClassId));

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ============================================
  // 📌 Render
  // ============================================

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📖 Subject Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage subjects for each class</p>
        </div>
        <button
          onClick={() => {
            if (!selectedClassId) {
              setError('Please select a class first');
              return;
            }
            setShowAddSubjectModal(true);
            setNewSubjectName('');
            setNewSubjectImage(null);
            setNewSubjectImagePreview(null);
            setError(null);
          }}
          disabled={isSubmitting || !selectedClassId}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-lg ${
            selectedClassId && !isSubmitting
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <PlusIcon className="w-5 h-5" />
          Add New Subject
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckIcon className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selection Area */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select Board */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Board
            </label>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm text-gray-500">Loading boards...</span>
              </div>
            ) : (
              <select
                value={selectedBoardId}
                onChange={handleBoardChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Board --</option>
                {boards.map(b => (
                  <option key={b.id} value={b.id}>{b.board_name || b.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Select Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Class
            </label>
            <select
              value={selectedClassId}
              onChange={handleClassChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedBoardId || loadingClasses}
            >
              <option value="">-- Select Class --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {loadingClasses && (
              <p className="text-xs text-gray-400 mt-1">Loading classes...</p>
            )}
          </div>
        </div>

        {/* Selected Info */}
        {selectedBoard && selectedClass && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <span>Managing subjects for:</span>
              <span className="font-semibold text-indigo-700">{selectedBoard.board_name || selectedBoard.name}</span>
              <span>→</span>
              <span className="font-semibold text-indigo-700">{selectedClass.name}</span>
              <span className="ml-2 text-xs text-gray-500">
                ({subjects.length} subjects)
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Subjects List */}
      {selectedBoard && selectedClass ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-indigo-500" />
              Subjects
            </h3>
            <span className="text-sm text-gray-500">
              {loadingSubjects ? 'Loading...' : `${subjects.length} subjects`}
            </span>
          </div>

          {loadingSubjects ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : subjects.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <BookOpenIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm">No subjects added to this class</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add New Subject" to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
              {subjects.map((subject) => (
                <div 
                  key={subject.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group border border-gray-100"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Subject Image */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                      {subject.image ? (
                        <img 
                          src={subject.image} 
                          alt={subject.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '';
                            e.target.className = 'hidden';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg">
                          {subject.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      {editingSubjectId === subject.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingSubjectName}
                            onChange={(e) => setEditingSubjectName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleEditSubject(subject.id);
                              }
                            }}
                            className="text-sm font-medium text-gray-700 border-b-2 border-indigo-500 focus:outline-none bg-transparent w-full"
                            autoFocus
                            disabled={isSubmitting}
                            placeholder="Enter subject name"
                          />
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleEditSubject(subject.id)}
                              disabled={isSubmitting || !editingSubjectName.trim()}
                              className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={isSubmitting}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm font-medium text-gray-700 truncate block">
                            {subject.name}
                          </span>
                          <p className="text-xs text-gray-400">ID: #{subject.id}</p>
                        </>
                      )}
                    </div>
                  </div>
                  {editingSubjectId !== subject.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                      <button
                        onClick={() => openViewModal(subject)}
                        disabled={isSubmitting}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="View details"
                      >
                        <EyeIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => startEditing(subject)}
                        disabled={isSubmitting}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit subject"
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.id, subject.name)}
                        disabled={isSubmitting}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete subject"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AcademicCapIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">Select Board & Class</h3>
          <p className="text-sm text-gray-400 mt-1">
            Choose a board and class from above to manage subjects
          </p>
        </div>
      )}

      {/* ➕ Add Subject Modal */}
      {showAddSubjectModal && selectedBoard && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 my-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Add New Subject</h2>
            <p className="text-sm text-gray-500 mb-4">
              Adding subject to <strong>{selectedBoard.board_name || selectedBoard.name} → {selectedClass.name}</strong>
            </p>
            
            {/* Subject Name */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => {
                setNewSubjectName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g., Mathematics, Physics, Biology"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              onKeyPress={(e) => handleKeyPress(e, handleAddSubject)}
              autoFocus
              disabled={isSubmitting}
            />

            {/* Subject Image */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Image <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  disabled={isSubmitting}
                  required
                />
              </div>
              {newSubjectImagePreview && (
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  <img src={newSubjectImagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Supported formats: JPEG, PNG, GIF, WEBP (Max 5MB)
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddSubjectModal(false);
                  setNewSubjectName('');
                  setNewSubjectImage(null);
                  setNewSubjectImagePreview(null);
                  setError(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                disabled={isSubmitting || !newSubjectName.trim() || !newSubjectImage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  'Add Subject'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👁️ View Subject Details Modal */}
      {showViewModal && selectedSubject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Subject Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Subject Image */}
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-200 shadow-md">
                {selectedSubject.image ? (
                  <img 
                    src={selectedSubject.image} 
                    alt={selectedSubject.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.className = 'hidden';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white text-4xl font-bold">
                    {selectedSubject.name?.charAt(0)?.toUpperCase() || 'S'}
                  </div>
                )}
              </div>
            </div>

            {/* Subject Info */}
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Subject Name</span>
                <span className="text-sm font-medium text-gray-800">{selectedSubject.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">ID</span>
                <span className="text-sm font-medium text-gray-800">#{selectedSubject.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Class</span>
                <span className="text-sm font-medium text-gray-800">{selectedSubject.class?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Board</span>
                <span className="text-sm font-medium text-gray-800">{selectedSubject.board?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Created At</span>
                <span className="text-sm font-medium text-gray-800">{formatDate(selectedSubject.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Updated At</span>
                <span className="text-sm font-medium text-gray-800">{formatDate(selectedSubject.updated_at)}</span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}