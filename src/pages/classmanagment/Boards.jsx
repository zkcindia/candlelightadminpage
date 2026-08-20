// src/pages/classmanagment/Boards.jsx
import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { getBoards, addBoard, editBoard, deleteBoard } from '../../service/api';

export default function Boards() {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [editingBoard, setEditingBoard] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 📌 Fetch all boards on component mount
  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBoards();
      if (response.status) {
        setBoards(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch boards');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Add Board
  const handleAddBoard = async () => {
    if (!newBoardName.trim()) {
      setError('Board name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await addBoard(newBoardName.trim());
      if (response.status) {
        setBoards([...boards, response.data]);
        setNewBoardName('');
        setShowAddModal(false);
      } else {
        setError(response.message || 'Failed to add board');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred');
      console.error('Add error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📌 Edit Board
  const handleEditBoard = async (id, newName) => {
    if (!newName.trim()) {
      setError('Board name is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await editBoard(id, newName.trim());
      if (response.status) {
        setBoards(boards.map(board => 
          board.id === id ? { ...board, board_name: newName.trim() } : board
        ));
        setEditingBoard(null);
        setNewBoardName('');
      } else {
        setError(response.message || 'Failed to update board');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred');
      console.error('Edit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📌 Delete Board
  const handleDeleteBoard = async (id, boardName) => {
    if (!window.confirm(`Are you sure you want to delete "${boardName}"? This will also delete all classes and subjects under this board.`)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await deleteBoard(id);
      if (response.status) {
        setBoards(boards.filter(board => board.id !== id));
      } else {
        setError(response.message || 'Failed to delete board');
      }
    } catch (err) {
      setError(err.message || 'Network error occurred');
      console.error('Delete error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📌 Start editing a board
  const startEditing = (board) => {
    setEditingBoard(board.id);
    setNewBoardName(board.board_name);
  };

  // 📌 Cancel editing
  const cancelEditing = () => {
    setEditingBoard(null);
    setNewBoardName('');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏛️ Board Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all educational boards</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Board
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-xs text-red-500 hover:text-red-700 mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border-l-4 border-blue-500">
        <p className="text-sm text-gray-500">Total Boards</p>
        <p className="text-2xl font-bold text-gray-800">
          {loading ? '...' : boards.length}
        </p>
      </div>

      {/* Boards Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div 
              key={board.id} 
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {board.board_name?.charAt(0) || 'B'}
                  </div>
                  <div>
                    {editingBoard === board.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newBoardName}
                          onChange={(e) => setNewBoardName(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleEditBoard(board.id, newBoardName)}
                          className="text-lg font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditBoard(board.id, newBoardName)}
                            disabled={isSubmitting}
                            className="p-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-800">{board.board_name}</h3>
                        <p className="text-xs text-gray-400">ID: #{board.id}</p>
                      </>
                    )}
                  </div>
                </div>
                {editingBoard !== board.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEditing(board)}
                      disabled={isSubmitting}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBoard(board.id, board.board_name)}
                      disabled={isSubmitting}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ➕ Add Board Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Board</h2>
            
            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <input
              type="text"
              value={newBoardName}
              onChange={(e) => {
                setNewBoardName(e.target.value);
                setError(null);
              }}
              placeholder="e.g., CBSE Board, ICSE Board"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleAddBoard()}
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