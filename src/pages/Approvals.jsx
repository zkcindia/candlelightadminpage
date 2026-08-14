// src/pages/Approvals.jsx
import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  EnvelopeIcon,
  UserCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  InformationCircleIcon,
  // RefreshIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { getAdminTeachers, approveTeacher, rejectTeacher } from '../service/api';

export default function Approvals() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [emailType, setEmailType] = useState('approve'); // 'approve' or 'reject'
  
  const [emailData, setEmailData] = useState({
    to: '',
    subject: 'Teacher Account Approval - Congratulations!',
    message: ''
  });

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  // Fetch teachers on mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAdminTeachers();
      
      let teacherData = [];
      if (response.status && response.data) {
        teacherData = Array.isArray(response.data) ? response.data : [response.data];
      } else if (Array.isArray(response)) {
        teacherData = response;
      } else {
        teacherData = [];
      }
      
      // Transform API data
      const formattedData = teacherData.map((item) => ({
        id: item.id || item.user_id || item.teacher_id || Date.now(),
        name: item.name || item.teacher_name || item.username || 'Unknown',
        email: item.email || 'No email',
        phone: item.phone || item.mobile || 'N/A',
        subject: item.subject || item.specialization || 'Not specified',
        experience: item.years_of_experience ? `${item.years_of_experience} years` : 'N/A',
        qualification: item.qualification || 'Not specified',
        school: item.school || item.current_organization || 'N/A',
        location: item.address || item.location || 'N/A',
        appliedDate: item.created_at || item.applied_date,
        status: item.verification_status?.toLowerCase() || item.teacher_verification_status?.toLowerCase() || 'pending',
        profileImage: item.profile_image || null,
        documents: item.documents || ['resume.pdf'],
        message: item.message || 'No additional message',
        gender: item.gender || 'N/A',
      }));
      
      setTeachers(formattedData);
      
      // Calculate stats
      const pending = formattedData.filter(t => t.status === 'pending' || t.status === 'Pending').length;
      const approved = formattedData.filter(t => t.status === 'approved' || t.status === 'Approved').length;
      const rejected = formattedData.filter(t => t.status === 'rejected' || t.status === 'Rejected').length;
      
      setStats({
        total: formattedData.length,
        pending,
        approved,
        rejected
      });
      
    } catch (err) {
      console.error('Error fetching teachers:', err);
      setError(err.message || 'Failed to load teachers');
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTeachers();
  };

  const handleApprove = (teacher) => {
    setSelectedTeacher(teacher);
    setEmailType('approve');
    setEmailData({
      to: teacher.email,
      subject: 'Teacher Account Approval - Congratulations! 🎉',
      message: `Dear ${teacher.name},\n\nWe are pleased to inform you that your teacher account has been successfully approved. You can now log in to our platform and start teaching.\n\nYour login credentials:\nEmail: ${teacher.email}\n\nBest regards,\nAdmin Team`
    });
    setShowEmailModal(true);
  };

  const handleReject = (teacher) => {
    setSelectedTeacher(teacher);
    setEmailType('reject');
    setEmailData({
      to: teacher.email,
      subject: 'Teacher Account Application Update',
      message: `Dear ${teacher.name},\n\nThank you for your interest in joining our platform. After careful review of your application, we regret to inform you that we are unable to approve your teacher account at this time.\n\nPlease feel free to reapply in the future with additional qualifications or experience.\n\nBest regards,\nAdmin Team`
    });
    setShowEmailModal(true);
  };

  const handleSendEmail = async () => {
    try {
      setActionLoading(true);
      
      // Update teacher status via API
      if (emailType === 'approve') {
        await approveTeacher(selectedTeacher.id);
      } else {
        await rejectTeacher(selectedTeacher.id);
      }
      
      // Update local state
      const updatedTeachers = teachers.map(teacher => 
        teacher.id === selectedTeacher.id 
          ? { ...teacher, status: emailType === 'approve' ? 'approved' : 'rejected' }
          : teacher
      );
      setTeachers(updatedTeachers);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pending: prev.pending - 1,
        approved: emailType === 'approve' ? prev.approved + 1 : prev.approved,
        rejected: emailType === 'reject' ? prev.rejected + 1 : prev.rejected
      }));
      
      setNotification({
        type: 'success',
        message: `${selectedTeacher.name} ${emailType === 'approve' ? 'approved' : 'rejected'} successfully! ✅`
      });
      
      setShowEmailModal(false);
      setSelectedTeacher(null);
      
      setTimeout(() => setNotification(null), 5000);
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.message || `Failed to ${emailType} teacher`
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'pending';
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    return styles[s] || styles.pending;
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'approved') return <CheckCircleIcon className="w-4 h-4" />;
    if (s === 'rejected') return <XCircleIcon className="w-4 h-4" />;
    return <ClockIcon className="w-4 h-4" />;
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teachers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-l-4 border-green-500' 
            : 'bg-red-50 border-l-4 border-red-500'
        } p-4 rounded-lg shadow-lg animate-slideIn max-w-md`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
            ) : (
              <XCircleIcon className="w-6 h-6 text-red-500 mr-3" />
            )}
            <div>
              <p className={`${
                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
              } font-medium`}>
                {notification.message}
              </p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className={`ml-4 ${
                notification.type === 'success' ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'
              }`}
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👨‍🏫 Teacher Approvals</h1>
            <p className="text-gray-600 mt-1">Review and manage teacher registration requests</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
              <ClockIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">
                {stats.pending} Pending
              </span>
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              {/* <RefreshIcon className="w-5 h-5 text-gray-600" /> */}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Teachers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {teachers.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircleIcon className="w-16 h-16 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear! 🎉</h3>
            <p className="text-gray-500">No teacher requests to review</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          teacher.status === 'pending' 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                            : teacher.status === 'approved'
                            ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                            : 'bg-gradient-to-r from-red-400 to-rose-400'
                        }`}>
                          {getInitials(teacher.name)}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{teacher.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[150px]">{teacher.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {teacher.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{teacher.experience}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(teacher.appliedDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(teacher.status)}`}>
                        {getStatusIcon(teacher.status)}
                        {teacher.status.charAt(0).toUpperCase() + teacher.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(teacher)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1"
                        >
                          <EyeIcon className="w-4 h-4" />
                          View
                        </button>
                        {teacher.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(teacher)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(teacher)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                            >
                              <XCircleIcon className="w-4 h-4" />
                              Reject
                            </button>
                          </>
                        )}
                        {teacher.status !== 'pending' && (
                          <span className="text-xs text-gray-400 italic">
                            {teacher.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">👤 Teacher Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                  selectedTeacher.status === 'pending' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                    : selectedTeacher.status === 'approved'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400'
                    : 'bg-gradient-to-r from-red-400 to-rose-400'
                }`}>
                  {getInitials(selectedTeacher.name)}
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedTeacher.name}</h3>
                  <p className="text-gray-600">{selectedTeacher.email}</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusBadge(selectedTeacher.status)}`}>
                    {getStatusIcon(selectedTeacher.status)}
                    {selectedTeacher.status.charAt(0).toUpperCase() + selectedTeacher.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <AcademicCapIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Qualification</span>
                  </div>
                  <p className="text-gray-900">{selectedTeacher.qualification}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <BriefcaseIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Experience</span>
                  </div>
                  <p className="text-gray-900">{selectedTeacher.experience}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  <p className="text-gray-900">{selectedTeacher.phone}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-gray-900">{selectedTeacher.location}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Applied Date</span>
                  </div>
                  <p className="text-gray-900">{formatDate(selectedTeacher.appliedDate)}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <InformationCircleIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Documents</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.documents?.map((doc, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedTeacher.message && (
                  <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <EnvelopeIcon className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">Message</span>
                    </div>
                    <p className="text-gray-900">{selectedTeacher.message}</p>
                  </div>
                )}
              </div>

              {selectedTeacher.status === 'pending' && (
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleApprove(selectedTeacher);
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handleReject(selectedTeacher);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <XCircleIcon className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">📧 Send Email Notification</h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={actionLoading}
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className={`rounded-lg p-4 mb-6 ${
                emailType === 'approve'
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {emailType === 'approve' ? (
                    <CheckBadgeIcon className="w-6 h-6 text-green-600 mr-3" />
                  ) : (
                    <XCircleIcon className="w-6 h-6 text-red-600 mr-3" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${
                      emailType === 'approve' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {emailType === 'approve' ? 'Approval Email' : 'Rejection Email'}
                    </p>
                    <p className="text-xs text-gray-600">
                      This email will be sent to {selectedTeacher.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To:</label>
                  <input
                    type="email"
                    value={emailData.to}
                    onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={actionLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={actionLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                  <textarea
                    rows="8"
                    value={emailData.message}
                    onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    disabled={actionLoading}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 ${
                    emailType === 'approve'
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="w-5 h-5" />
                      {emailType === 'approve' ? 'Send & Approve' : 'Send & Reject'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}