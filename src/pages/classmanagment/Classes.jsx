// src/pages/Classes.jsx
import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  AcademicCapIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

export default function Classes() {
  // Boards data (will come from API)
  const [boards, setBoards] = useState([
    { 
      id: 1, 
      name: 'CBSE Board',
      classes: [
        { id: 1, name: 'Class 6' },
        { id: 2, name: 'Class 7' },
        { id: 3, name: 'Class 8' },
        { id: 4, name: 'Class 9' },
        { id: 5, name: 'Class 10' },
      ]
    },
    { 
      id: 2, 
      name: 'ICSE Board',
      classes: [
        { id: 6, name: 'Class 6' },
        { id: 7, name: 'Class 7' },
        { id: 8, name: 'Class 8' },
      ]
    },
    { 
      id: 3, 
      name: 'UP Board',
      classes: [
        { id: 9, name: 'Class 6' },
        { id: 10, name: 'Class 7' },
        { id: 11, name: 'Class 8' },
      ]
    }
  ]);

  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [editingClass, setEditingClass] = useState(null);

  // Get selected board
  const selectedBoard = boards.find(b => b.id === parseInt(selectedBoardId));
  const classes = selectedBoard ? selectedBoard.classes : [];

  // 📌 CLASS CRUD
  const handleAddClass = () => {
    if (newClassName.trim() && selectedBoard) {
      const newClass = {
        id: Date.now(),
        name: newClassName.trim()
      };
      setBoards(boards.map(b => 
        b.id === selectedBoard.id 
          ? { ...b, classes: [...b.classes, newClass] }
          : b
      ));
      setNewClassName('');
      setShowAddClassModal(false);
    }
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('Are you sure you want to delete this class? All subjects under this class will also be deleted.')) {
      if (selectedBoard) {
        setBoards(boards.map(b => 
          b.id === selectedBoard.id 
            ? { ...b, classes: b.classes.filter(c => c.id !== classId) }
            : b
        ));
      }
    }
  };

  const handleEditClass = (classId, newName) => {
    if (newName.trim() && selectedBoard) {
      setBoards(boards.map(b => 
        b.id === selectedBoard.id 
          ? { ...b, classes: b.classes.map(c => 
              c.id === classId ? { ...c, name: newName.trim() } : c
            )}
          : b
      ));
      setEditingClass(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📚 Class Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage classes for each board</p>
        </div>
        <button
          onClick={() => setShowAddClassModal(true)}
          disabled={!selectedBoardId}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-lg ${
            selectedBoardId 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <PlusIcon className="w-5 h-5" />
          Add New Class
        </button>
      </div>

      {/* Select Board */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Board
        </label>
        <select
          value={selectedBoardId}
          onChange={(e) => setSelectedBoardId(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select a Board --</option>
          {boards.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        
        {selectedBoard && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              Managing classes for: <strong>{selectedBoard.name}</strong>
              <span className="ml-2 text-xs text-gray-500">
                ({classes.length} classes)
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Classes List */}
      {selectedBoard ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-blue-500" />
              Classes
            </h3>
            <span className="text-sm text-gray-500">{classes.length} classes</span>
          </div>

          {classes.length === 0 ? (
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                      {classItem.name.split(' ')[1] || 'C'}
                    </div>
                    <div>
                      {editingClass === classItem.id ? (
                        <input
                          type="text"
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          onBlur={() => handleEditClass(classItem.id, newClassName)}
                          onKeyPress={(e) => e.key === 'Enter' && handleEditClass(classItem.id, newClassName)}
                          className="text-sm font-medium text-gray-700 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-700">{classItem.name}</span>
                      )}
                      <p className="text-xs text-gray-400">Class ID: #{classItem.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingClass(classItem.id);
                        setNewClassName(classItem.name);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(classItem.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Add New Class</h2>
            <p className="text-sm text-gray-500 mb-4">
              Adding class to <strong>{selectedBoard.name}</strong>
            </p>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="e.g., Class 6, Class 7"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleAddClass()}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddClassModal(false);
                  setNewClassName('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddClass}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}