// TeacherTable.jsx
import React, { useState, useEffect } from 'react';
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
  UserIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { getAdminTeachers, updateTeacher, deleteTeacher } from '../../service/api';

export default function TeacherTable() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  // Fetch teachers data
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminTeachers();
      console.log('API Response:', response);
      
      let teachersData = [];
      if (response && response.status === true && response.data) {
        teachersData = response.data;
      } else if (Array.isArray(response)) {
        teachersData = response;
      } else if (response && response.results) {
        teachersData = response.results;
      }
      
      const transformedData = teachersData.map(teacher => ({
        id: teacher.id,
        name: teacher.name || 'Unknown Teacher',
        email: teacher.email || 'No email provided',
        phone: teacher.mobile || teacher.phone || 'N/A',
        subject: teacher.specialization || 'General',
        district: teacher.address || 'N/A',
        status: teacher.verification_status || 'Pending',
        uploads: 0,
        students: 0,
        referrals: 0,
        earnings: 0,
        joinDate: teacher.created_at || new Date().toISOString(),
        address: teacher.address || 'No address provided',
        gender: teacher.gender || 'Not specified',
        qualification: teacher.qualification || 'Not specified',
        yearsOfExperience: teacher.years_of_experience || 0,
        schoolName: teacher.school_name || 'N/A',
        board: teacher.board?.name || 'N/A',
        class: teacher.class?.name || 'N/A',
        currentOrganization: teacher.current_organization || 'N/A',
        image: teacher.image || null,
        _original: teacher
      }));
      
      setTeachers(transformedData);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError(err.message || 'Failed to load teachers');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Handle Edit
  const handleEditClick = (teacher) => {
    setEditingTeacher({ ...teacher });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = {
        name: editingTeacher.name,
        email: editingTeacher.email,
        mobile: editingTeacher.phone,
        address: editingTeacher.address,
        specialization: editingTeacher.subject,
        qualification: editingTeacher.qualification,
        years_of_experience: editingTeacher.yearsOfExperience,
        school_name: editingTeacher.schoolName,
        current_organization: editingTeacher.currentOrganization,
        gender: editingTeacher.gender,
        verification_status: editingTeacher.status
      };
      
      const response = await updateTeacher(editingTeacher.id, formData);
      console.log('Update response:', response);
      
      if (response.status === true) {
        alert('Teacher updated successfully!');
        setShowEditModal(false);
        setEditingTeacher(null);
        fetchTeachers(); // Refresh the list
      } else {
        alert('Failed to update teacher');
      }
    } catch (error) {
      console.error('Error updating teacher:', error);
      alert(error.message || 'Failed to update teacher');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!teacherToDelete) return;
    
    try {
      const response = await deleteTeacher(teacherToDelete.id);
      console.log('Delete response:', response);
      
      if (response.status === true) {
        alert('Teacher deleted successfully!');
        setShowDeleteConfirm(false);
        setTeacherToDelete(null);
        fetchTeachers(); // Refresh the list
      } else {
        alert('Failed to delete teacher');
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
      alert(error.message || 'Failed to delete teacher');
    }
  };

  // Get unique specializations
  const specializations = ['all', ...new Set(teachers.map(t => t.subject).filter(Boolean))];
  const statuses = ['all', 'Approved', 'Pending', 'Rejected', 'Blocked'];

  // Filter and sort teachers
  const filteredTeachers = teachers
    .filter(teacher => {
      const searchTerm = search.toLowerCase();
      const matchesSearch = 
        teacher.name.toLowerCase().includes(searchTerm) ||
        teacher.email.toLowerCase().includes(searchTerm) ||
        teacher.phone.toLowerCase().includes(searchTerm) ||
        teacher.subject.toLowerCase().includes(searchTerm) ||
        teacher.address.toLowerCase().includes(searchTerm);
      
      const matchesStatus = filterStatus === 'all' || 
        teacher.status.toLowerCase() === filterStatus.toLowerCase();
      
      const matchesSpecialization = filterSpecialization === 'all' || 
        teacher.subject === filterSpecialization;
      
      return matchesSearch && matchesStatus && matchesSpecialization;
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
      'Approved': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Blocked': 'bg-red-100 text-red-800',
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
    };
    return styles[status] || styles.Pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Approved': <CheckCircleIcon className="w-4 h-4 text-green-600" />,
      'Pending': <ClockIcon className="w-4 h-4 text-yellow-600" />,
      'Rejected': <XCircleIcon className="w-4 h-4 text-red-600" />,
      'Blocked': <XCircleIcon className="w-4 h-4 text-red-600" />,
    };
    return icons[status] || <ClockIcon className="w-4 h-4 text-yellow-600" />;
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teachers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-700">Error Loading Teachers</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500">Total Teachers</p>
          <p className="text-2xl font-bold text-gray-800">{teachers.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
          <p className="text-sm text-green-600">Approved</p>
          <p className="text-2xl font-bold text-green-700">
            {teachers.filter(t => t.status === 'Approved').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-200">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-700">
            {teachers.filter(t => t.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-200">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-bold text-red-700">
            {teachers.filter(t => t.status === 'Rejected').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex-1 min-w-[200px] relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
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
          value={filterSpecialization}
          onChange={(e) => setFilterSpecialization(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-sm"
        >
          {specializations.map(spec => (
            <option key={spec} value={spec}>
              {spec === 'all' ? 'All Subjects' : spec}
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    Teacher 
                    {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('subject')}>
                  <div className="flex items-center gap-1">
                    Subject 
                    {sortBy === 'subject' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-1">
                    Status 
                    {sortBy === 'status' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('joinDate')}>
                  <div className="flex items-center gap-1">
                    Joined 
                    {sortBy === 'joinDate' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher, index) => (
                  <motion.tr
                    key={teacher.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {teacher.image ? (
                          <img 
                            src={teacher.image} 
                            alt={teacher.name}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm">
                            {teacher.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                          <div className="text-xs text-gray-500">
                            {teacher.schoolName !== 'N/A' && teacher.schoolName}
                            {teacher.class !== 'N/A' && ` • ${teacher.class}`}
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
                        <AcademicCapIcon className="w-3 h-3 text-gray-400" />
                        {teacher.subject}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {getStatusIcon(teacher.status)}
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(teacher.status)}`}>
                          {teacher.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(teacher.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {teacher.qualification}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => { setSelectedTeacher(teacher); setShowModal(true); }} 
                        className="text-blue-600 hover:text-blue-800 mr-2 p-1 hover:bg-blue-50 rounded"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4 inline" />
                      </button>
                      <button 
                        onClick={() => handleEditClick(teacher)}
                        className="text-blue-600 hover:text-blue-800 mr-2 p-1 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <PencilIcon className="w-4 h-4 inline" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(teacher)}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <TrashIcon className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <AcademicCapIcon className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm">No teachers found</p>
                      <p className="text-gray-400 text-xs mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex justify-between">
          <span>Showing {filteredTeachers.length} of {teachers.length} teachers</span>
          <span className="text-xs text-gray-400">Total: {teachers.length}</span>
        </div>
      </div>

      {/* Teacher Details Modal */}
      {showModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Teacher Details</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                {selectedTeacher.image ? (
                  <img 
                    src={selectedTeacher.image} 
                    alt={selectedTeacher.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 text-2xl font-bold">
                    {selectedTeacher.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedTeacher.name}</h4>
                  <p className="text-gray-500">{selectedTeacher.subject} • {selectedTeacher.schoolName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedTeacher.status)}`}>
                      {selectedTeacher.status}
                    </span>
                    <span className="text-xs text-gray-400">{selectedTeacher.class}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <PhoneIcon className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium">{selectedTeacher.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="text-sm font-medium">{selectedTeacher.gender || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="text-sm font-medium">{new Date(selectedTeacher.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <AcademicCapIcon className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Qualification</p>
                    <p className="text-sm font-medium">{selectedTeacher.qualification}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm font-medium">{selectedTeacher.yearsOfExperience} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPinIcon className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium">{selectedTeacher.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg col-span-1 md:col-span-2">
                  <UserGroupIcon className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Current Organization</p>
                    <p className="text-sm font-medium">{selectedTeacher.currentOrganization}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => { setShowModal(false); handleEditClick(selectedTeacher); }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit Teacher
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingTeacher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Edit Teacher</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={editingTeacher.name}
                    onChange={(e) => setEditingTeacher({...editingTeacher, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={editingTeacher.email}
                    onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingTeacher.phone}
                    onChange={(e) => setEditingTeacher({...editingTeacher, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={editingTeacher.subject}
                    onChange={(e) => setEditingTeacher({...editingTeacher, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={editingTeacher.qualification}
                    onChange={(e) => setEditingTeacher({...editingTeacher, qualification: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={editingTeacher.yearsOfExperience}
                    onChange={(e) => setEditingTeacher({...editingTeacher, yearsOfExperience: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                  <input
                    type="text"
                    value={editingTeacher.schoolName}
                    onChange={(e) => setEditingTeacher({...editingTeacher, schoolName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Organization</label>
                  <input
                    type="text"
                    value={editingTeacher.currentOrganization}
                    onChange={(e) => setEditingTeacher({...editingTeacher, currentOrganization: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={editingTeacher.gender || ''}
                    onChange={(e) => setEditingTeacher({...editingTeacher, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingTeacher.status}
                    onChange={(e) => setEditingTeacher({...editingTeacher, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={editingTeacher.address}
                    onChange={(e) => setEditingTeacher({...editingTeacher, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Teacher'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && teacherToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
                <TrashIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-800 text-center">Delete Teacher</h3>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Are you sure you want to delete <strong>{teacherToDelete.name}</strong>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}