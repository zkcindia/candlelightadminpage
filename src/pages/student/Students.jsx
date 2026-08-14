// src/components/StudentDetails.jsx
import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  UserGroupIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  ChartBarIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { getAdminStudents, deleteStudent, updateStudent } from '../../service/api';

export default function StudentDetails() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    DOB: '',
    school_name: '',
    address: '',
    gender: '',
    image: null
  });

  // Fetch students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAdminStudents();
      
      let studentData = [];
      if (response.status && response.data) {
        studentData = Array.isArray(response.data) ? response.data : [response.data];
      } else if (Array.isArray(response)) {
        studentData = response;
      }
      
      const formattedData = studentData.map((item) => ({
        id: item.id || Date.now(),
        name: item.name || 'Unknown',
        email: item.email || '',
        phone: item.mobile || 'N/A',
        mobile: item.mobile || '',
        DOB: item.DOB || '',
        school_name: item.school_name || '',
        address: item.address || '',
        gender: item.gender || '',
        class: item.class?.name || item.class_name || 'N/A',
        board: item.board?.name || 'N/A',
        image: item.image || null,
        status: item.status || 'Active',
        joinDate: item.created_at || new Date().toISOString(),
      }));
      
      setStudents(formattedData);
      
    } catch (err) {
      console.error('Error fetching students:', err);
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const classes = ['all', ...new Set(students.map(s => s.class))];

  const filteredStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) ||
                           student.email.toLowerCase().includes(search.toLowerCase()) ||
                           (student.phone && student.phone.includes(search));
      const matchesClass = filterClass === 'all' || student.class === filterClass;
      return matchesSearch && matchesClass;
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

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        setDeleting(true);
        const response = await deleteStudent(id);
        
        if (response.status) {
          setStudents(students.filter(s => s.id !== id));
          
          setNotification({
            type: 'success',
            message: `${name} deleted successfully!`
          });
        } else {
          throw new Error(response.message || 'Failed to delete student');
        }
        
        setTimeout(() => setNotification(null), 5000);
      } catch (err) {
        console.error('Delete error:', err);
        setNotification({
          type: 'error',
          message: err.message || 'Failed to delete student'
        });
        setTimeout(() => setNotification(null), 5000);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      mobile: student.mobile || '',
      DOB: student.DOB || '',
      school_name: student.school_name || '',
      address: student.address || '',
      gender: student.gender || '',
      image: null
    });
    setImagePreview(student.image || '');
    setShowEditModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({...formData, image: file});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setEditing(true);
      setError(null);
      
      // Create FormData - Only send fields that have values
      const submitData = new FormData();
      
      // Required fields - always send
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      
      // Optional fields - only send if they have values and are valid
      if (formData.mobile && formData.mobile.trim() !== '' && formData.mobile !== 'N/A') {
        submitData.append('mobile', formData.mobile);
      }
      
      // Date validation - only send if valid YYYY-MM-DD format
      if (formData.DOB && formData.DOB.trim() !== '' && formData.DOB !== 'N/A') {
        // Check if date is in YYYY-MM-DD format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (dateRegex.test(formData.DOB)) {
          submitData.append('DOB', formData.DOB);
        } else {
          // Try to convert to YYYY-MM-DD
          try {
            const date = new Date(formData.DOB);
            if (!isNaN(date.getTime())) {
              const formattedDate = date.toISOString().split('T')[0];
              submitData.append('DOB', formattedDate);
            }
          } catch (err) {
            console.warn('Invalid date format:', formData.DOB);
          }
        }
      }
      
      if (formData.school_name && formData.school_name.trim() !== '' && formData.school_name !== 'N/A') {
        submitData.append('school_name', formData.school_name);
      }
      
      if (formData.address && formData.address.trim() !== '' && formData.address !== 'N/A') {
        submitData.append('address', formData.address);
      }
      
      if (formData.gender && formData.gender.trim() !== '' && formData.gender !== 'N/A') {
        submitData.append('gender', formData.gender);
      }
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      console.log('Updating student with data:', Object.fromEntries(submitData));
      
      const response = await updateStudent(selectedStudent.id, submitData);
      
      console.log('Update response:', response);
      
      if (response.status) {
        const updatedData = response.data;
        
        // Update local state
        const updatedStudents = students.map(student => 
          student.id === selectedStudent.id 
            ? { 
                ...student, 
                name: updatedData.name || formData.name,
                email: updatedData.email || formData.email,
                mobile: updatedData.mobile || formData.mobile,
                DOB: updatedData.DOB || formData.DOB,
                school_name: updatedData.school_name || formData.school_name,
                address: updatedData.address || formData.address,
                gender: updatedData.gender || formData.gender,
                image: updatedData.image || imagePreview || student.image,
                class: updatedData.class?.name || student.class,
                board: updatedData.board?.name || student.board
              }
            : student
        );
        
        setStudents(updatedStudents);
        
        setNotification({
          type: 'success',
          message: `${formData.name} updated successfully!`
        });
        
        setShowEditModal(false);
        setImagePreview('');
        setTimeout(() => setNotification(null), 5000);
      } else {
        throw new Error(response.message || 'Failed to update student');
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update student');
      setNotification({
        type: 'error',
        message: err.message || 'Failed to update student. Please check console for details.'
      });
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setEditing(false);
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  // Table Row Animation
  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  // Modal Animation
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-l-4 border-green-500' 
            : 'bg-red-50 border-l-4 border-red-500'
        } p-4 rounded-lg shadow-lg max-w-md`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <UserGroupIcon className="w-6 h-6 text-green-500 mr-3" />
            ) : (
              <TrashIcon className="w-6 h-6 text-red-500 mr-3" />
            )}
            <p className={notification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          {classes.map(cls => (
            <option key={cls} value={cls}>
              {cls === 'all' ? 'All Classes' : cls}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    Student
                    {sortBy === 'name' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('joinDate')}>
                  <div className="flex items-center gap-1">
                    Join Date
                    {sortBy === 'joinDate' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('class')}>
                  <div className="flex items-center gap-1">
                    Class
                    {sortBy === 'class' && (sortOrder === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />)}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <motion.tr
                  key={student.id}
                  custom={index}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold shadow-sm overflow-hidden">
                        {student.image ? (
                          <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(student.name)
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-xs text-gray-500">{student.board}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900">{student.email}</div>
                    <div className="text-xs text-gray-500">{student.mobile || 'N/A'}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(student.joinDate)}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{student.class}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => handleViewDetails(student)} 
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <EyeIcon className="w-5 h-5 inline" />
                    </button>
                    <button 
                      onClick={() => handleEdit(student)} 
                      className="text-green-600 hover:text-green-800 mr-3"
                    >
                      <PencilIcon className="w-5 h-5 inline" />
                    </button>
                    <button 
                      onClick={() => handleDelete(student.id, student.name)}
                      disabled={deleting}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <TrashIcon className="w-5 h-5 inline" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No students found</p>
          </motion.div>
        )}
      </motion.div>

      {/* View Details Modal */}
      <AnimatePresence>
        {showModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Student Details</h3>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg overflow-hidden"
                  >
                    {selectedStudent.image ? (
                      <img src={selectedStudent.image} alt={selectedStudent.name} className="w-full h-full object-cover" />
                    ) : (
                      getInitials(selectedStudent.name)
                    )}
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{selectedStudent.name}</h4>
                    <p className="text-gray-500">{selectedStudent.class} • {selectedStudent.board}</p>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedStudent.status)}`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium">{selectedStudent.mobile || 'N/A'}</p></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div><p className="text-xs text-gray-500">Join Date</p><p className="text-sm font-medium">{formatDate(selectedStudent.joinDate)}</p></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg col-span-1 md:col-span-2">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div><p className="text-xs text-gray-500">Address</p><p className="text-sm font-medium">{selectedStudent.address || 'N/A'}</p></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <AcademicCapIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div><p className="text-xs text-gray-500">Board</p><p className="text-sm font-medium">{selectedStudent.board}</p></div>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowModal(false);
                      handleEdit(selectedStudent);
                    }}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit Student
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowModal(false);
                      handleDelete(selectedStudent.id, selectedStudent.name);
                    }}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete Student
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">✏️ Edit Student</h3>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={editing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={editing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                    <input
                      type="text"
                      value={formData.mobile}
                      onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={editing}
                      placeholder="Enter mobile number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">DOB</label>
                    <input
                      type="date"
                      value={formData.DOB}
                      onChange={(e) => setFormData({...formData, DOB: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={editing}
                    />
                    <p className="text-xs text-gray-400 mt-1">Format: YYYY-MM-DD</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                    <input
                      type="text"
                      value={formData.school_name}
                      onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={editing}
                      placeholder="Enter school name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={editing}
                      placeholder="Enter address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={editing}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer"
                    onClick={() => !editing && document.getElementById('editImageInput')?.click()}
                  >
                    <input
                      id="editImageInput"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      disabled={editing}
                    />
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg object-contain"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview('');
                            setFormData({...formData, image: null});
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Click to upload image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={editing}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    disabled={editing}
                  >
                    {editing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <PencilIcon className="w-4 h-4" />
                        Update Student
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}