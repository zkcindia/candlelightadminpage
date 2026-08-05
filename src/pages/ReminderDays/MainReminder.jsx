// src/pages/ReminderDays/MainReminder.jsx
import React, { useState } from 'react';
import { CalendarIcon, SparklesIcon } from '@heroicons/react/24/outline';
import SpecialDays from './SpecialDays';
import WordOfTheDay from './WordOfTheDay';

export default function MainReminder() {
  const [activeTab, setActiveTab] = useState('special');

  const tabs = [
    { id: 'special', label: '🎉 Special Days', icon: CalendarIcon },
    { id: 'word', label: '📖 Word of the Day', icon: SparklesIcon }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">📅 Reminder Days</h1>
        <p className="text-gray-600 mt-1">Manage special days and daily word</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === 'special' ? <SpecialDays /> : <WordOfTheDay />}
      </div>
    </div>
  );
}