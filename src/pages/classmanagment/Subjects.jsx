// src/pages/Subjects.jsx
import React, { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  BookOpenIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

export default function Subjects() {
  // Full data structure (will come from API)
  const [boards, setBoards] = useState([
    { 
      id: 1, 
      name: 'CBSE Board',
      classes: [
        { 
          id: 1, 
          name: 'Class 6',
          subjects: [
            { id: 1, name: 'Mathematics' },
            { id: 2, name: 'Physics' },
            { id: 3, name: 'Chemistry' },
            { id: 4, name: 'English' },
          ]
        },
        { 
          id: 2, 
          name: 'Class 7',
          subjects: [
            { id: 5, name: 'Mathematics' },
            { id: 6, name: 'Physics' },
            { id: 7, name: 'Chemistry' },
            { id: 8, name: 'English' },
          ]
        }
      ]
    },
    { 
      id: 2, 
      name: 'ICSE Board',
      classes: [
        { 
          id: 3, 
          name: 'Class 6',
          subjects: [
            { id: 9, name: 'Mathematics' },
            { id: 10, name: 'Physics' },
            { id: 11, name: 'Chemistry' },
            { id: 12, name: 'English' },
          ]
        }
      ]
    }
  ]);

  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingSubject, setEditingSubject] = useState(null);

  // Get selections
  const selectedBoard = boards.find(b => b.id === parseInt(selectedBoardId));
  const selectedClass = selectedBoard 
    ? selectedBoard.classes.find(c => c.id === parseInt(selectedClassId))
    : null;
  const subjects = selectedClass ? selectedClass.subjects : [];

  // 📌 SUBJECT CRUD
  const handleAddSubject = () => {
    if (newSubjectName.trim() && selectedClass && selectedBoard) {
      const newSubject = {
        id: Date.now(),
        name: newSubjectName.trim()
      };
      setBoards(boards.map(b => 
        b.id === selectedBoard.id 
          ? { ...b, classes: b.classes.map(c => 
              c.id === selectedClass.id 
                ? { ...c, subjects: [...c.subjects, newSubject] }
                : c
            )}
          : b
      ));
      setNewSubjectName('');
      setShowAddSubjectModal(false);
    }
  };

  const handleDeleteSubject = (subjectId) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      if (selectedBoard && selectedClass) {
        setBoards(boards.map(b => 
          b.id === selectedBoard.id 
            ? { ...b, classes: b.classes.map(c => 
                c.id === selectedClass.id 
                  ? { ...c, subjects: c.subjects.filter(s => s.id !== subjectId) }
                  : c
              )}
            : b
        ));
      }
    }
  };

  const handleEditSubject = (subjectId, newName) => {
    if (newName.trim() && selectedBoard && selectedClass) {
      setBoards(boards.map(b => 
        b.id === selectedBoard.id 
          ? { ...b, classes: b.classes.map(c => 
              c.id === selectedClass.id 
                ? { ...c, subjects: c.subjects.map(s => 
                    s.id === subjectId ? { ...s, name: newName.trim() } : s
                  )}
                : c
            )}
          : b
      ));
      setEditingSubject(null);
    }
  };

  // Get available classes for selected board
  const availableClasses = selectedBoard ? selectedBoard.classes : [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📖 Subject Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage subjects for each class</p>
        </div>
        <button
          onClick={() => setShowAddSubjectModal(true)}
          disabled={!selectedClassId}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-lg ${
            selectedClassId 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <PlusIcon className="w-5 h-5" />
          Add New Subject
        </button>
      </div>

      {/* Selection Area */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select Board */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Board
            </label>
            <select
              value={selectedBoardId}
              onChange={(e) => {
                setSelectedBoardId(e.target.value);
                setSelectedClassId('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Board --</option>
              {boards.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Select Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedBoardId}
            >
              <option value="">-- Select Class --</option>
              {availableClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Info */}
        {selectedBoard && selectedClass && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <span>Managing subjects for:</span>
              <span className="font-semibold text-indigo-700">{selectedBoard.name}</span>
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
            <span className="text-sm text-gray-500">{subjects.length} subjects</span>
          </div>

          {subjects.length === 0 ? (
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
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {subject.name.charAt(0).toUpperCase()}
                    </div>
                    {editingSubject === subject.id ? (
                      <input
                        type="text"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        onBlur={() => handleEditSubject(subject.id, newSubjectName)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEditSubject(subject.id, newSubjectName)}
                        className="text-sm font-medium text-gray-700 border-b-2 border-indigo-500 focus:outline-none bg-transparent w-24"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-700">{subject.name}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingSubject(subject.id);
                        setNewSubjectName(subject.name);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </button>
                  </div>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Add New Subject</h2>
            <p className="text-sm text-gray-500 mb-4">
              Adding subject to <strong>{selectedBoard.name} → {selectedClass.name}</strong>
            </p>
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="e.g., Mathematics, Physics, Biology"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddSubjectModal(false);
                  setNewSubjectName('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}