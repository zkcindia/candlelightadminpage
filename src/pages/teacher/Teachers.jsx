import React from 'react';
import { 
  AcademicCapIcon, 
  UserPlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import TopTeachers from './TopTeachers';
import TeacherTable from './TeacherTable';

export default function Teachers() {
  // Mock Data - API se replace hoga
  const teachersData = [
    { 
      id: 1, 
      name: 'Dr. Rahul Sharma', 
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      address: '123, MG Road, Mumbai, Maharashtra - 400001',
      district: 'Mumbai',
      joinDate: '2024-01-15',
      subject: 'Mathematics',
      uploads: 120,
      earnings: 45000,
      students: 45,
      referrals: 12,
      status: 'Active',
      rating: 4.9
    },
    { 
      id: 2, 
      name: 'Prof. Priya Patel', 
      email: 'priya@example.com',
      phone: '+91 98765 43211',
      address: '45, Lake View, Pune, Maharashtra - 411001',
      district: 'Pune',
      joinDate: '2024-02-01',
      subject: 'Physics',
      uploads: 98,
      earnings: 38000,
      students: 38,
      referrals: 8,
      status: 'Active',
      rating: 4.8
    },
    { 
      id: 3, 
      name: 'Mr. Amit Kumar', 
      email: 'amit@example.com',
      phone: '+91 98765 43212',
      address: '78, Sector 12, Navi Mumbai, Maharashtra - 400706',
      district: 'Navi Mumbai',
      joinDate: '2024-02-15',
      subject: 'Chemistry',
      uploads: 85,
      earnings: 32000,
      students: 32,
      referrals: 5,
      status: 'Active',
      rating: 4.7
    },
    { 
      id: 4, 
      name: 'Ms. Sneha Reddy', 
      email: 'sneha@example.com',
      phone: '+91 98765 43213',
      address: '9, Green Valley, Hyderabad, Telangana - 500001',
      district: 'Hyderabad',
      joinDate: '2024-03-01',
      subject: 'Biology',
      uploads: 72,
      earnings: 28000,
      students: 28,
      referrals: 3,
      status: 'Inactive',
      rating: 4.5
    },
    { 
      id: 5, 
      name: 'Dr. Vikram Singh', 
      email: 'vikram@example.com',
      phone: '+91 98765 43214',
      address: '56, Fort Road, Delhi - 110001',
      district: 'Delhi',
      joinDate: '2024-03-15',
      subject: 'History',
      uploads: 65,
      earnings: 25000,
      students: 25,
      referrals: 6,
      status: 'Active',
      rating: 4.6
    },
    { 
      id: 6, 
      name: 'Dr. Ananya Gupta', 
      email: 'ananya@example.com',
      phone: '+91 98765 43215',
      address: '12, Park Street, Kolkata, West Bengal - 700001',
      district: 'Kolkata',
      joinDate: '2024-04-01',
      subject: 'English',
      uploads: 82,
      earnings: 30000,
      students: 30,
      referrals: 4,
      status: 'Active',
      rating: 4.8
    },
    { 
      id: 7, 
      name: 'Dr. Arjun Reddy', 
      email: 'arjun@example.com',
      phone: '+91 98765 43216',
      address: '34, Silicon Valley, Bangalore, Karnataka - 560001',
      district: 'Bangalore',
      joinDate: '2024-04-15',
      subject: 'Computer Science',
      uploads: 70,
      earnings: 26000,
      students: 22,
      referrals: 7,
      status: 'Pending',
      rating: 4.4
    },
    { 
      id: 8, 
      name: 'Dr. Kavya Nair', 
      email: 'kavya@example.com',
      phone: '+91 98765 43217',
      address: '67, Beach Road, Kochi, Kerala - 682001',
      district: 'Kochi',
      joinDate: '2024-05-01',
      subject: 'Economics',
      uploads: 45,
      earnings: 18000,
      students: 18,
      referrals: 2,
      status: 'Active',
      rating: 4.3
    },
    { 
      id: 9, 
      name: 'Dr. Rohan Desai', 
      email: 'rohan@example.com',
      phone: '+91 98765 43218',
      address: '89, Hill Road, Surat, Gujarat - 395001',
      district: 'Surat',
      joinDate: '2024-05-15',
      subject: 'Geography',
      uploads: 55,
      earnings: 21000,
      students: 20,
      referrals: 3,
      status: 'Active',
      rating: 4.5
    },
    { 
      id: 10, 
      name: 'Dr. Ishita Malhotra', 
      email: 'ishita@example.com',
      phone: '+91 98765 43219',
      address: '23, Mall Road, Shimla, Himachal Pradesh - 171001',
      district: 'Shimla',
      joinDate: '2024-06-01',
      subject: 'Psychology',
      uploads: 90,
      earnings: 35000,
      students: 35,
      referrals: 9,
      status: 'Active',
      rating: 4.9
    },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <AcademicCapIcon className="w-8 h-8 text-blue-600" />
            Teachers
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage all teachers and their performance</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md">
            <ArrowPathIcon className="w-5 h-5" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md">
            <UserPlusIcon className="w-5 h-5" />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Top Teachers Component */}
      <TopTeachers teachers={teachersData} />

      {/* Teacher Table Component */}
      <TeacherTable teachers={teachersData} />
    </div>
  );
}