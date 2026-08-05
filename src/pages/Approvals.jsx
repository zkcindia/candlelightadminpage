// pages/Approvals.jsx
import React, { useState } from 'react';
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
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function Approvals() {
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      subject: 'Mathematics',
      experience: '8 years',
      qualification: 'Ph.D. in Mathematics',
      school: 'Springfield High School',
      location: 'New York, USA',
      appliedDate: '2026-08-01',
      status: 'pending',
      profileImage: null,
      documents: ['resume.pdf', 'certificate.pdf'],
      message: 'I have 8 years of teaching experience and specialize in advanced mathematics.'
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 987-6543',
      subject: 'Physics',
      experience: '12 years',
      qualification: 'Ph.D. in Physics',
      school: 'Oakridge Academy',
      location: 'Los Angeles, USA',
      appliedDate: '2026-08-02',
      status: 'pending',
      profileImage: null,
      documents: ['resume.pdf', 'teaching_license.pdf'],
      message: 'Passionate about teaching physics with hands-on experiment approach.'
    },
    {
      id: 3,
      name: 'Ms. Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      phone: '+1 (555) 456-7890',
      subject: 'English Literature',
      experience: '5 years',
      qualification: 'M.A. in English Literature',
      school: 'Riverside School',
      location: 'Chicago, USA',
      appliedDate: '2026-08-03',
      status: 'pending',
      profileImage: null,
      documents: ['resume.pdf', 'publications.pdf'],
      message: 'Specialized in American and British literature with a focus on creative writing.'
    },
    {
      id: 4,
      name: 'Dr. Amanda Lee',
      email: 'amanda.lee@example.com',
      phone: '+1 (555) 789-0123',
      subject: 'Chemistry',
      experience: '10 years',
      qualification: 'Ph.D. in Chemistry',
      school: 'Central High School',
      location: 'Houston, USA',
      appliedDate: '2026-08-04',
      status: 'pending',
      profileImage: null,
      documents: ['resume.pdf', 'research_papers.pdf'],
      message: 'Expert in organic chemistry with multiple research publications.'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: 'Teacher Account Approval - Congratulations!',
    message: ''
  });
  const [notification, setNotification] = useState(null);

  const handleApprove = (id) => {
    const teacher = pendingRequests.find(req => req.id === id);
    if (teacher) {
      setSelectedRequest(teacher);
      setEmailData({
        to: teacher.email,
        subject: 'Teacher Account Approval - Congratulations!',
        message: `Dear ${teacher.name},\n\nWe are pleased to inform you that your teacher account has been successfully approved. You can now log in to our platform and start teaching.\n\nYour login credentials:\nEmail: ${teacher.email}\nPassword: [Temporary Password]\n\nPlease log in and change your password immediately.\n\nBest regards,\nAdmin Team`
      });
      setShowEmailModal(true);
    }
  };

  const handleReject = (id) => {
    const teacher = pendingRequests.find(req => req.id === id);
    if (teacher) {
      setSelectedRequest(teacher);
      setEmailData({
        to: teacher.email,
        subject: 'Teacher Account Application Update',
        message: `Dear ${teacher.name},\n\nThank you for your interest in joining our platform. After careful review of your application, we regret to inform you that we are unable to approve your teacher account at this time.\n\nPlease feel free to reapply in the future with additional qualifications or experience.\n\nBest regards,\nAdmin Team`
      });
      setShowEmailModal(true);
    }
  };

  const handleSendEmail = () => {
    // In real application, this would send an email
    console.log('Sending email:', emailData);
    
    // Remove the request from pending list
    setPendingRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
    
    // Show success notification
    setNotification({
      type: 'success',
      message: `Email sent successfully to ${selectedRequest.name}`
    });
    
    // Close modal
    setShowEmailModal(false);
    setSelectedRequest(null);
    
    // Clear notification after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg animate-slideIn">
          <div className="flex items-center">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p className="text-green-800 font-medium">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="ml-4 text-green-500 hover:text-green-700"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Teacher Approvals</h1>
            <p className="text-gray-600 mt-1">Review and manage teacher registration requests</p>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <ClockIcon className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              {pendingRequests.length} Pending Requests
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests.length + 2}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <UserCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">2</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected</p>
              <p className="text-2xl font-bold text-red-600">1</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
              {pendingRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {request.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{request.name}</p>
                        <p className="text-xs text-gray-500">{request.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {request.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.experience}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{request.appliedDate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Teacher Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedRequest.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedRequest.name}</h3>
                  <p className="text-gray-600">{selectedRequest.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <AcademicCapIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Qualification</span>
                  </div>
                  <p className="text-gray-900">{selectedRequest.qualification}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <BriefcaseIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Experience</span>
                  </div>
                  <p className="text-gray-900">{selectedRequest.experience}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <PhoneIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  <p className="text-gray-900">{selectedRequest.phone}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-gray-900">{selectedRequest.location}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <CalendarIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Applied Date</span>
                  </div>
                  <p className="text-gray-900">{selectedRequest.appliedDate}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <InformationCircleIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Documents</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.documents.map((doc, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <EnvelopeIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Message</span>
                  </div>
                  <p className="text-gray-900">{selectedRequest.message}</p>
                </div>
              </div>

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
                    handleApprove(selectedRequest.id);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleReject(selectedRequest.id);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Send Email Notification</h2>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XCircleIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <CheckBadgeIcon className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Email Preview</p>
                    <p className="text-xs text-blue-600">This email will be sent to {selectedRequest.email}</p>
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message:</label>
                  <textarea
                    rows="8"
                    value={emailData.message}
                    onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendEmail}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}