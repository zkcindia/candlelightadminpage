// src/pages/classmanagment/Boards.jsx
import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getBoards, addBoard, editBoard, deleteBoard } from '../../service/api';

export default function Boards() {
  // 📌 State - All dynamic from API
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // 📌 Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingBoardName, setEditingBoardName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 📌 Fetch boards on mount
  useEffect(() => {
    fetchBoards();
  }, []);

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

  const handleAddBoard = async () => {
    const trimmedName = newBoardName.trim();
    if (!trimmedName) {
      setError('Board name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await addBoard(trimmedName);
      if (response?.status) {
        setBoards(prev => [...prev, response.data]);
        setNewBoardName('');
        setShowAddModal(false);
        setSuccess('Board added successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.message || 'Failed to add board');
      }
    } catch (err) {
      setError(err?.message || 'Failed to add board');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditBoard = async (id) => {
    const trimmedName = editingBoardName.trim();
    if (!trimmedName) {
      setError('Board name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await editBoard(id, trimmedName);
      if (response?.status) {
        setBoards(prev => 
          prev.map(board => 
            board.id === id ? { ...board, board_name: trimmedName } : board
          )
        );
        setEditingBoardId(null);
        setEditingBoardName('');
        setSuccess('Board updated successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.message || 'Failed to update board');
      }
    } catch (err) {
      setError(err?.message || 'Failed to update board');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBoard = async (id, boardName) => {
    if (!window.confirm(`Are you sure you want to delete "${boardName}"? This action cannot be undone.`)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await deleteBoard(id);
      if (response?.status) {
        setBoards(prev => prev.filter(board => board.id !== id));
        setSuccess('Board deleted successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(response?.message || 'Failed to delete board');
      }
    } catch (err) {
      setError(err?.message || 'Failed to delete board');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // 📌 UI Handlers
  // ============================================

  const startEditing = (board) => {
    setEditingBoardId(board.id);
    setEditingBoardName(board.board_name);
    setError(null);
  };

  const cancelEditing = () => {
    setEditingBoardId(null);
    setEditingBoardName('');
    setError(null);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  // ============================================
  // 📌 Render
  // ============================================

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏛️ Board Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all educational boards</p>
        </div>
        <button
          onClick={() => {
            setShowAddModal(true);
            setNewBoardName('');
            setError(null);
          }}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Board
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

      {/* Stats - Dynamic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Boards</p>
          <p className="text-2xl font-bold text-gray-800">
            {loading ? '...' : boards.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Active Boards</p>
          <p className="text-2xl font-bold text-gray-800">
            {loading ? '...' : boards.filter(b => b.is_active !== false).length}
          </p>
        </div>
      </div>

      {/* Boards Grid - Dynamic */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      ) : boards.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <AcademicCapIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600">No Boards Found</h3>
          <p className="text-sm text-gray-400 mt-1">Click "Add New Board" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {boards.map((board) => (
            <div 
              key={board.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {board.board_name?.charAt(0)?.toUpperCase() || 'B'}
                  </div>
                  <div className="min-w-0 flex-1">
                    {editingBoardId === board.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editingBoardName}
                          onChange={(e) => setEditingBoardName(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, () => handleEditBoard(board.id))}
                          className="text-sm font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none bg-transparent w-full"
                          autoFocus
                          disabled={isSubmitting}
                          placeholder="Enter board name"
                        />
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleEditBoard(board.id)}
                            disabled={isSubmitting || !editingBoardName.trim()}
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
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {board.board_name}
                        </h3>
                        <p className="text-xs text-gray-400">ID: #{board.id}</p>
                      </>
                    )}
                  </div>
                </div>
                {editingBoardId !== board.id && (
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button
                      onClick={() => startEditing(board)}
                      disabled={isSubmitting}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Edit board"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBoard(board.id, board.board_name)}
                      disabled={isSubmitting}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete board"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              {/* Optional: Show created_at if available */}
              {board.created_at && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Created: {new Date(board.created_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ➕ Add Board Modal - Dynamic */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Board</h2>
            
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => {
                setNewBoardName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter board name (e.g., CBSE Board)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              onKeyPress={(e) => handleKeyPress(e, handleAddBoard)}
              autoFocus
              disabled={isSubmitting}
            />
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewBoardName('');
                  setError(null);
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBoard}
                disabled={isSubmitting || !newBoardName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  'Add Board'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}