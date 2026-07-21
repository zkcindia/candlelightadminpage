import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import TopScorers from './TopScorers';
import StudentDetails from './Students';

export default function Students() {
  // Mock Data - API se replace hoga
  const studentsData = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', address: '123, MG Road, Mumbai', joinDate: '2024-01-15', season: 'Summer 2024', score: 95, payment: 350, status: 'Active', class: '10th', teacher: 'Dr. Rahul Sharma' },
    { id: 2, name: 'Priya Patel', email: 'priya@example.com', phone: '+91 98765 43211', address: '45, Lake View, Pune', joinDate: '2024-02-01', season: 'Summer 2024', score: 92, payment: 350, status: 'Active', class: '9th', teacher: 'Prof. Priya Patel' },
    { id: 3, name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 98765 43212', address: '78, Sector 12, Navi Mumbai', joinDate: '2024-02-15', season: 'Summer 2024', score: 88, payment: 350, status: 'Active', class: '8th', teacher: 'Mr. Amit Kumar' },
    { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 98765 43213', address: '9, Green Valley, Hyderabad', joinDate: '2024-03-01', season: 'Spring 2024', score: 78, payment: 350, status: 'Inactive', class: '10th', teacher: 'Dr. Rahul Sharma' },
    { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43214', address: '56, Fort Road, Delhi', joinDate: '2024-03-15', season: 'Spring 2024', score: 65, payment: 350, status: 'Active', class: '7th', teacher: 'Ms. Sneha Reddy' },
    { id: 6, name: 'Ananya Gupta', email: 'ananya@example.com', phone: '+91 98765 43215', address: '12, Park Street, Kolkata', joinDate: '2024-04-01', season: 'Spring 2024', score: 82, payment: 350, status: 'Active', class: '9th', teacher: 'Prof. Priya Patel' },
    { id: 7, name: 'Arjun Reddy', email: 'arjun@example.com', phone: '+91 98765 43216', address: '34, Silicon Valley, Bangalore', joinDate: '2024-04-15', season: 'Summer 2024', score: 70, payment: 350, status: 'Pending', class: '8th', teacher: 'Mr. Amit Kumar' },
    { id: 8, name: 'Kavya Nair', email: 'kavya@example.com', phone: '+91 98765 43217', address: '67, Beach Road, Kochi', joinDate: '2024-05-01', season: 'Summer 2024', score: 45, payment: 350, status: 'Active', class: '6th', teacher: 'Ms. Sneha Reddy' },
    { id: 9, name: 'Rohan Desai', email: 'rohan@example.com', phone: '+91 98765 43218', address: '89, Hill Road, Surat', joinDate: '2024-05-15', season: 'Summer 2024', score: 55, payment: 350, status: 'Active', class: '10th', teacher: 'Dr. Rahul Sharma' },
    { id: 10, name: 'Ishita Malhotra', email: 'ishita@example.com', phone: '+91 98765 43219', address: '23, Mall Road, Shimla', joinDate: '2024-06-01', season: 'Monsoon 2024', score: 90, payment: 350, status: 'Active', class: '9th', teacher: 'Prof. Priya Patel' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <UserGroupIcon className="w-8 h-8 text-blue-600" />
            Students
          </h1>
          <p className="text-gray-500 text-sm mt-1">View all students and their performance</p>
        </div>
      </div>

      {/* Top Scorers Component */}
      <TopScorers students={studentsData} />

      {/* Student Details Component */}
      <StudentDetails students={studentsData} />
    </div>
  );
}