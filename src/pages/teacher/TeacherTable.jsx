import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  AcademicCapIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  MapPinIcon,
  PhoneIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function TeacherTable({ teachers = [] }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const districts = ['all', ...new Set(teachers.map(t => t.district))];
  const statuses = ['all', 'Active', 'Inactive', 'Pending'];

  const filteredTeachers = teachers
    .filter(teacher => {
      const matchesSearch = teacher.name.toLowerCase().includes(search.toLowerCase()) ||
                           teacher.email.toLowerCase().includes(search.toLowerCase()) ||
                           teacher.phone.includes(search);
      const matchesStatus = filterStatus === 'all' || teacher.status === filterStatus;
      const matchesDistrict = filterDistrict === 'all' || teacher.district === filterDistrict;
      return matchesSearch && matchesStatus && matchesDistrict;
    })
    .sort((a, b) => {
      let compareA = a[sortBy];
      let compareB = b[sortBy];
      
      if (typeof compareA === 'string') {
        compareA = compareA.toLowerCase();
        compareB = compareB.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

  const getStatusBadge = (status) => {
    const styles = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-gray-100 text-gray-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Blocked: 'bg-red-100 text-red-800',
    };
    return styles[status] || styles.Inactive;
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(Math.round(rating)) + (rating % 1 >= 0.5 ? '⭐' : '');
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search teachers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Status' : status}
            </option>
          ))}
        </select>
        <select
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm"
        >
          {districts.map(district => (
            <option key={district} value={district}>
              {district === 'all' ? 'All Districts' : district}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">Teacher {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('district')}>
                  <div className="flex items-center gap-1">District {sortBy === 'district' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('joinDate')}>
                  <div className="flex items-center gap-1">Joined {sortBy === 'joinDate' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('uploads')}>
                  <div className="flex items-center gap-1">Uploads {sortBy === 'uploads' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('students')}>
                  <div className="flex items-center gap-1">Students {sortBy === 'students' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('referrals')}>
                  <div className="flex items-center gap-1">Refs {sortBy === 'referrals' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}</div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('earnings')}>
                  <div className="flex items-center gap-1">Earnings {sortBy === 'earnings' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}</div>
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.map((teacher, index) => (
                <motion.tr
                  key={teacher.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm">
                        {teacher.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <AcademicCapIcon className="w-3 h-3" />
                          {teacher.subject}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{teacher.email}</div>
                    <div className="text-xs text-gray-500">{teacher.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-3 h-3 text-gray-400" />
                      {teacher.district}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(teacher.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-blue-600">
                    {teacher.uploads}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <UserGroupIcon className="w-3 h-3 text-gray-400" />
                      {teacher.students}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-3 h-3 text-green-500" />
                      {teacher.referrals}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">
                    ₹{teacher.earnings.toLocaleString()}
                  </td>
                  {/* <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(teacher.status)}`}>
                        {teacher.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {getRatingStars(teacher.rating)}
                      </span>
                    </div>
                  </td> */}
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setSelectedTeacher(teacher); setShowModal(true); }} className="text-blue-600 hover:text-blue-800 mr-2">
                      <EyeIcon className="w-4 h-4 inline" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 mr-2">
                      <PencilIcon className="w-4 h-4 inline" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <TrashIcon className="w-4 h-4 inline" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTeachers.length === 0 && (
          <div className="text-center py-12">
            <AcademicCapIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No teachers found</p>
          </div>
        )}
      </div>

      {/* Teacher Details Modal */}
      {showModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Teacher Details</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 text-2xl font-bold">
                  {selectedTeacher.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedTeacher.name}</h4>
                  <p className="text-gray-500">{selectedTeacher.subject} • {selectedTeacher.district}</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedTeacher.status)}`}>
                    {selectedTeacher.status}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <DocumentTextIcon className="w-5 h-5 text-blue-600 mx-auto" />
                  <p className="text-lg font-bold text-blue-600">{selectedTeacher.uploads}</p>
                  <p className="text-[10px] text-gray-500">Uploads</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <UserGroupIcon className="w-5 h-5 text-green-600 mx-auto" />
                  <p className="text-lg font-bold text-green-600">{selectedTeacher.students}</p>
                  <p className="text-[10px] text-gray-500">Students</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <UserIcon className="w-5 h-5 text-purple-600 mx-auto" />
                  <p className="text-lg font-bold text-purple-600">{selectedTeacher.referrals}</p>
                  <p className="text-[10px] text-gray-500">Referrals</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <CurrencyRupeeIcon className="w-5 h-5 text-yellow-600 mx-auto" />
                  <p className="text-lg font-bold text-yellow-600">₹{selectedTeacher.earnings.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500">Earnings</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <PhoneIcon className="w-4 h-4 text-gray-400" />
                  <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium">{selectedTeacher.phone}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <div><p className="text-xs text-gray-500">Joined</p><p className="text-sm font-medium">{new Date(selectedTeacher.joinDate).toLocaleDateString()}</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg col-span-1 md:col-span-2">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  <div><p className="text-xs text-gray-500">Address</p><p className="text-sm font-medium">{selectedTeacher.address}</p></div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit Teacher</button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">View Analytics</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}