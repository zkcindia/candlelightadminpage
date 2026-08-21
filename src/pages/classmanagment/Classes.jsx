// src/pages/classmanagment/Classes.jsx
import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { getBoards, getClasses, addClass, editClass, deleteClass } from '../../service/api';

export default function Classes() {
  // 📌 State - All dynamic from API
  const [boards, setBoards] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // 📌 Selection State
  const [selectedBoardId, setSelectedBoardId] = useState('');
  
  // 📌 Modal States
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [newClassName, setNewClassName] = useState('');
  const [newClassImage, setNewClassImage] = useState(null);
  const [newClassImagePreview, setNewClassImagePreview] = useState(null);
  const [editingClassId, setEditingClassId] = useState(null);
  const [editingClassName, setEditingClassName] = useState('');
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
    }
  }, [selectedBoardId]);

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

  // 📌 Add Class with FormData
  const handleAddClass = async () => {
    const trimmedName = newClassName.trim();
    if (!trimmedName) {
      setError('Class name is required');
      return;
    }

    if (!selectedBoardId) {
      setError('Please select a board first');
      return;
    }

    if (!newClassImage) {
      setError('Class image is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('name', trimmedName);
      formData.append('board_id', parseInt(selectedBoardId));
      formData.append('image', newClassImage);

      const response = await addClass(formData);
      
      if (response?.status) {
        setClasses(prev => [...prev, response.data]);
        setNewClassName('');
        setNewClassImage(null);
        setNewClassImagePreview(null);
        setShowAddClassModal(false);
        setSuccess('Class added successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.message || 'Failed to add class');
      }
    } catch (err) {
      console.error('❌ Add Class Error:', err);
      setError(err?.message || 'Failed to add class');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ FIXED: Edit Class - Only sends name (as per your API)
  const handleEditClass = async (id) => {
    const trimmedName = editingClassName.trim();
    if (!trimmedName) {
      setError('Class name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // ✅ API expects: { name: "new name" }
      const response = await editClass(id, { name: trimmedName });
      
      if (response?.status) {
        // ✅ Update the class in the list with new name
        setClasses(prev => 
          prev.map(cls => 
            cls.id === id ? { ...cls, name: trimmedName } : cls
          )
        );
        setEditingClassId(null);
        setEditingClassName('');
        setSuccess('Class updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.message || 'Failed to update class');
      }
    } catch (err) {
      console.error('❌ Edit Class Error:', err);
      setError(err?.message || 'Failed to update class');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (id, className) => {
    if (!window.confirm(`Are you sure you want to delete "${className}"? All subjects under this class will also be deleted.`)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await deleteClass(id);
      if (response?.status) {
        setClasses(prev => prev.filter(cls => cls.id !== id));
        setSuccess('Class deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.message || 'Failed to delete class');
      }
    } catch (err) {
      setError(err?.message || 'Failed to delete class');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // 📌 UI Handlers
  // ============================================

  // ✅ FIXED: Start editing - set the current name
  const startEditing = (cls) => {
    setEditingClassId(cls.id);
    setEditingClassName(cls.name);  // ✅ Set current name
    setError(null);
  };

  const cancelEditing = () => {
    setEditingClassId(null);
    setEditingClassName('');
    setError(null);
  };

  const handleBoardChange = (e) => {
    const value = e.target.value;
    setSelectedBoardId(value);
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

      setNewClassImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewClassImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const openViewModal = (cls) => {
    setSelectedClass(cls);
    setShowViewModal(true);
  };

  // Get selected board name
  const selectedBoard = boards.find(b => b.id === parseInt(selectedBoardId));

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
          <h1 className="text-2xl font-bold text-gray-800">📚 Class Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage classes for each board</p>
        </div>
        <button
          onClick={() => {
            if (!selectedBoardId) {
              setError('Please select a board first');
              return;
            }
            setShowAddClassModal(true);
            setNewClassName('');
            setNewClassImage(null);
            setNewClassImagePreview(null);
            setError(null);
          }}
          disabled={isSubmitting || !selectedBoardId}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-lg ${
            selectedBoardId && !isSubmitting
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <PlusIcon className="w-5 h-5" />
          Add New Class
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

      {/* Select Board */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a Board --</option>
            {boards.map(b => (
              <option key={b.id} value={b.id}>{b.board_name || b.name}</option>
            ))}
          </select>
        )}
        
        {selectedBoard && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Managing classes for: <strong>{selectedBoard.board_name || selectedBoard.name}</strong>
              <span className="ml-2 text-xs text-gray-500">
                ({classes.length} classes)
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Classes List */}
      {selectedBoardId ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-blue-500" />
              Classes
            </h3>
            <span className="text-sm text-gray-500">
              {loadingClasses ? 'Loading...' : `${classes.length} classes`}
            </span>
          </div>

          {loadingClasses ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : classes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <AcademicCapIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm">No classes added to this board</p>
              <p className="text-xs text-gray-400 mt-1">Click "Add New Class" to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {classes.map((classItem) => (
                <div 
                  key={classItem.id} 
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Class Image */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                      {classItem.image ? (
                        <img 
                          src={classItem.image} 
                          alt={classItem.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '';
                            e.target.className = 'hidden';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 text-white font-bold text-lg">
                          {classItem.name?.charAt(0) || 'C'}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* ✅ EDIT MODE - Inline editing */}
                      {editingClassId === classItem.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingClassName}
                            onChange={(e) => setEditingClassName(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleEditClass(classItem.id);
                              }
                            }}
                            className="text-sm font-medium text-gray-700 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full"
                            autoFocus
                            disabled={isSubmitting}
                            placeholder="Enter class name"
                          />
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleEditClass(classItem.id)}
                              disabled={isSubmitting || !editingClassName.trim()}
                              className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Save"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              disabled={isSubmitting}
                              className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        // ✅ VIEW MODE - Show class name
                        <>
                          <span className="text-sm font-medium text-gray-700">
                            {classItem.name}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>ID: #{classItem.id}</span>
                            <span>•</span>
                            <span>Board: {classItem.board?.name || 'N/A'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* ✅ Action Buttons - Only show when not editing */}
                  {editingClassId !== classItem.id && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                      <button
                        onClick={() => openViewModal(classItem)}
                        disabled={isSubmitting}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="View details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startEditing(classItem)}
                        disabled={isSubmitting}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Edit class"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classItem.id, classItem.name)}
                        disabled={isSubmitting}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete class"
                      >
                        <TrashIcon className="w-4 h-4" />
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
          <BookOpenIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">Select a Board</h3>
          <p className="text-sm text-gray-400 mt-1">
            Choose a board from above to manage its classes
          </p>
        </div>
      )}

      {/* ➕ Add Class Modal */}
      {showAddClassModal && selectedBoard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 my-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Add New Class</h2>
            <p className="text-sm text-gray-500 mb-4">
              Adding class to <strong>{selectedBoard.board_name || selectedBoard.name}</strong>
            </p>
            
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => {
                setNewClassName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g., STD 6, STD 7"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              onKeyPress={(e) => handleKeyPress(e, handleAddClass)}
              autoFocus
              disabled={isSubmitting}
            />

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Image <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={isSubmitting}
                  required
                />
              </div>
              {newClassImagePreview && (
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  <img src={newClassImagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Supported formats: JPEG, PNG, GIF, WEBP (Max 5MB)
            </p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddClassModal(false);
                  setNewClassName('');
                  setNewClassImage(null);
                  setNewClassImagePreview(null);
                  setError(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClass}
                disabled={isSubmitting || !newClassName.trim() || !newClassImage}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  'Add Class'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👁️ View Class Details Modal */}
      {showViewModal && selectedClass && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Class Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-200 shadow-md">
                {selectedClass.image ? (
                  <img 
                    src={selectedClass.image} 
                    alt={selectedClass.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.className = 'hidden';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 text-white text-4xl font-bold">
                    {selectedClass.name?.charAt(0) || 'C'}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Class Name</span>
                <span className="text-sm font-medium text-gray-800">{selectedClass.name}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">ID</span>
                <span className="text-sm font-medium text-gray-800">#{selectedClass.id}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Board</span>
                <span className="text-sm font-medium text-gray-800">{selectedClass.board?.name || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Created At</span>
                <span className="text-sm font-medium text-gray-800">{formatDate(selectedClass.created_at)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Updated At</span>
                <span className="text-sm font-medium text-gray-800">{formatDate(selectedClass.updated_at)}</span>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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