import React, { useState, useEffect } from 'react';
import { 
  Cog6ToothIcon,
  UserIcon,
  KeyIcon,
  BellIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../config/roles';
import api from '../api/api';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile Form Data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    role: userRole,
    bio: user?.bio || 'Platform administrator',
  });

  // Security Form Data
  const [securityData, setSecurityData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
    two_factor: false,
  });

  // Notification Settings
  const [notificationData, setNotificationData] = useState({
    email_notifications: true,
    enrollment_alerts: true,
    teacher_activity: true,
    system_updates: true,
    whatsapp_notifications: false,
  });

  // General Settings
  const [generalData, setGeneralData] = useState({
    language: 'English',
    timezone: 'Asia/Kolkata (UTC +5:30)',
    date_format: 'DD/MM/YYYY',
    currency: 'INR',
  });

  // Company Settings (Super Admin Only)
  const [companyData, setCompanyData] = useState({
    // Bank Details
    bank_name: '',
    account_number: '',
    ifsc_code: '',
    account_holder: '',
    upi_id: '',
    qr_code: null,
    
    // Payment Gateway
    payment_gateway: 'razorpay',
    gateway_key: '',
    gateway_secret: '',
    webhook_secret: '',
    
    // Commission Settings
    platform_fee: 85.71,
    agent_commission: 1.43,
    teacher_commission: 1.43,
    
    // Withdrawal Settings
    min_withdrawal: 50,
    max_withdrawal: 10000,
    withdrawal_fee: 0,
    
    // Tax Settings
    gst_percentage: 18,
    tds_percentage: 10,
  });

  // Fetch Company Settings (Super Admin Only)
  useEffect(() => {
    if (userRole === ROLES.SUPER_ADMIN) {
      fetchCompanySettings();
    }
  }, [userRole]);

  const fetchCompanySettings = async () => {
    try {
      const response = await api.get('/settings/company');
      if (response.data) {
        setCompanyData(response.data);
      }
    } catch (error) {
      console.error('Error fetching company settings:', error);
    }
  };

  // Profile Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await api.put('/user/profile', profileData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Security Handlers
  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSecuritySave = async () => {
    if (securityData.new_password !== securityData.confirm_password) {
      toast.error('Passwords do not match!');
      return;
    }
    setSaving(true);
    try {
      await api.post('/auth/change-password', {
        current_password: securityData.current_password,
        new_password: securityData.new_password,
      });
      toast.success('Password updated successfully!');
      setSecurityData({
        current_password: '',
        new_password: '',
        confirm_password: '',
        two_factor: securityData.two_factor,
      });
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  // Notification Handlers
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationData(prev => ({ ...prev, [name]: checked }));
  };

  const handleNotificationSave = async () => {
    setSaving(true);
    try {
      await api.put('/user/notifications', notificationData);
      toast.success('Notification settings updated!');
    } catch (error) {
      toast.error('Failed to update notifications');
    } finally {
      setSaving(false);
    }
  };

  // General Settings Handlers
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralData(prev => ({ ...prev, [name]: value }));
  };

  const handleGeneralSave = async () => {
    setSaving(true);
    try {
      await api.put('/user/settings', generalData);
      toast.success('General settings updated!');
    } catch (error) {
      toast.error('Failed to update general settings');
    } finally {
      setSaving(false);
    }
  };

  // Company Settings Handlers
  const handleCompanyChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setCompanyData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setCompanyData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCompanySave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(companyData).forEach(key => {
        if (companyData[key] !== null) {
          formData.append(key, companyData[key]);
        }
      });
      await api.post('/settings/company', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Company settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save company settings');
    } finally {
      setSaving(false);
    }
  };

  // Role Based Tabs
  const getTabs = () => {
    const baseTabs = [
      { id: 'profile', label: 'Profile', icon: UserIcon },
      { id: 'security', label: 'Security', icon: KeyIcon },
      { id: 'notifications', label: 'Notifications', icon: BellIcon },
    ];

    // General Tab - Agents ko nahi dikhega
    if (userRole !== ROLES.AGENT) {
      baseTabs.push({ id: 'general', label: 'General', icon: GlobeAltIcon });
    }

    // Company Tab - Sirf Super Admin ko dikhega
    if (userRole === ROLES.SUPER_ADMIN) {
      baseTabs.push({ id: 'company', label: 'Company', icon: BuildingOfficeIcon });
    }

    return baseTabs;
  };

  const tabs = getTabs();

  // Render Profile Content
  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
          <p className="text-sm text-gray-500">Update your personal information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? (
            <>
              <XMarkIcon className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <PencilIcon className="w-4 h-4" />
              Edit
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={profileData.name}
            onChange={handleProfileChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              isEditing 
                ? 'border-gray-300 bg-white' 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleProfileChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              isEditing 
                ? 'border-gray-300 bg-white' 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={profileData.phone}
            onChange={handleProfileChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              isEditing 
                ? 'border-gray-300 bg-white' 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
            }`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <input
            type="text"
            value={
              profileData.role === 'super_admin' ? 'Super Admin' :
              profileData.role === 'admin' ? 'School Admin' :
              'Agent'
            }
            disabled
            className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg cursor-not-allowed text-gray-600"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            name="bio"
            rows="3"
            value={profileData.bio}
            onChange={handleProfileChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              isEditing 
                ? 'border-gray-300 bg-white' 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed'
            }`}
          />
        </div>
      </div>

      {isEditing && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleProfileSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  // Render Security Content
  const renderSecurity = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Security Settings</h3>
        <p className="text-sm text-gray-500">Update your password and security preferences</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            name="current_password"
            value={securityData.current_password}
            onChange={handleSecurityChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter current password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            name="new_password"
            value={securityData.new_password}
            onChange={handleSecurityChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Enter new password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            name="confirm_password"
            value={securityData.confirm_password}
            onChange={handleSecurityChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Confirm new password"
          />
        </div>
      </div>

      <button
        onClick={handleSecuritySave}
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Updating...
          </>
        ) : (
          'Update Password'
        )}
      </button>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-800">Enable 2FA</p>
            <p className="text-xs text-gray-500">Add an extra layer of security</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="two_factor"
              checked={securityData.two_factor}
              onChange={handleSecurityChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  // Render Notifications Content
  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Notification Preferences</h3>
        <p className="text-sm text-gray-500">Choose what notifications you want to receive</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-800">Email Notifications</p>
            <p className="text-xs text-gray-500">Receive email updates</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="email_notifications"
              checked={notificationData.email_notifications}
              onChange={handleNotificationChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-800">New Student Enrollment</p>
            <p className="text-xs text-gray-500">When new students enroll</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="enrollment_alerts"
              checked={notificationData.enrollment_alerts}
              onChange={handleNotificationChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-800">Teacher Activity</p>
            <p className="text-xs text-gray-500">When teachers upload questions</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="teacher_activity"
              checked={notificationData.teacher_activity}
              onChange={handleNotificationChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-800">System Updates</p>
            <p className="text-xs text-gray-500">Important system announcements</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="system_updates"
              checked={notificationData.system_updates}
              onChange={handleNotificationChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-800">WhatsApp Notifications</p>
            <p className="text-xs text-gray-500">Receive updates on WhatsApp</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="whatsapp_notifications"
              checked={notificationData.whatsapp_notifications}
              onChange={handleNotificationChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <button
        onClick={handleNotificationSave}
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </>
        ) : (
          'Save Notification Settings'
        )}
      </button>
    </div>
  );

  // Render General Content
  const renderGeneral = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">General Settings</h3>
        <p className="text-sm text-gray-500">Configure general platform settings</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-800">Language</p>
            <p className="text-xs text-gray-500">Choose your preferred language</p>
          </div>
          <select
            name="language"
            value={generalData.language}
            onChange={handleGeneralChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
            <option>Odia</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-800">Timezone</p>
            <p className="text-xs text-gray-500">Select your timezone</p>
          </div>
          <select
            name="timezone"
            value={generalData.timezone}
            onChange={handleGeneralChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option>Asia/Kolkata (UTC +5:30)</option>
            <option>UTC</option>
            <option>America/New_York (UTC -5:00)</option>
            <option>Europe/London (UTC +1:00)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-800">Date Format</p>
            <p className="text-xs text-gray-500">Choose date display format</p>
          </div>
          <select
            name="date_format"
            value={generalData.date_format}
            onChange={handleGeneralChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-800">Currency</p>
            <p className="text-xs text-gray-500">Select your currency</p>
          </div>
          <select
            name="currency"
            value={generalData.currency}
            onChange={handleGeneralChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option>INR (₹)</option>
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGeneralSave}
        disabled={saving}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {saving ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </>
        ) : (
          'Save General Settings'
        )}
      </button>
    </div>
  );

  // Render Company Content (Super Admin Only)
  const renderCompany = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
            Company Account Settings
          </h3>
          <p className="text-sm text-gray-500">Manage company bank account, payment gateway, and commission settings</p>
        </div>
        <button
          onClick={handleCompanySave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            'Save All Settings'
          )}
        </button>
      </div>

      {/* Bank Account Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <BanknotesIcon className="w-5 h-5 text-blue-600" />
          Bank Account Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name *</label>
            <input
              type="text"
              name="account_holder"
              value={companyData.account_holder}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter account holder name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name *</label>
            <input
              type="text"
              name="bank_name"
              value={companyData.bank_name}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter bank name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Number *</label>
            <input
              type="text"
              name="account_number"
              value={companyData.account_number}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter account number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code *</label>
            <input
              type="text"
              name="ifsc_code"
              value={companyData.ifsc_code}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter IFSC code"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
            <input
              type="text"
              name="upi_id"
              value={companyData.upi_id}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter UPI ID (e.g., company@upi)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">QR Code</label>
            <input
              type="file"
              name="qr_code"
              accept="image/*"
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Upload QR code for UPI payments</p>
          </div>
        </div>
      </div>

      {/* Payment Gateway */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <CreditCardIcon className="w-5 h-5 text-purple-600" />
          Payment Gateway Configuration
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Gateway</label>
            <select
              name="payment_gateway"
              value={companyData.payment_gateway}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="razorpay">Razorpay</option>
              <option value="paytm">PayTM</option>
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gateway API Key</label>
            <input
              type="text"
              name="gateway_key"
              value={companyData.gateway_key}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter API key"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gateway Secret Key</label>
            <input
              type="password"
              name="gateway_secret"
              value={companyData.gateway_secret}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter secret key"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret</label>
            <input
              type="password"
              name="webhook_secret"
              value={companyData.webhook_secret}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter webhook secret"
            />
            <p className="text-xs text-gray-400 mt-1">Use for payment verification</p>
          </div>
        </div>
      </div>

      {/* Commission Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-md font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <ShieldCheckIcon className="w-5 h-5 text-green-600" />
          Commission & Split Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform Fee (%)</label>
            <input
              type="number"
              name="platform_fee"
              value={companyData.platform_fee}
              onChange={handleCompanyChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Current: ₹300 on ₹350 payment</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent Commission (%)</label>
            <input
              type="number"
              name="agent_commission"
              value={companyData.agent_commission}
              onChange={handleCompanyChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Current: ₹5 on ₹350 payment</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Commission (%)</label>
            <input
              type="number"
              name="teacher_commission"
              value={companyData.teacher_commission}
              onChange={handleCompanyChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">Current: ₹5 on ₹350 payment</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Total:</strong> {companyData.platform_fee + companyData.agent_commission + companyData.teacher_commission}%
            <br />
            For ₹350 payment: 
            Platform: ₹{(350 * companyData.platform_fee / 100).toFixed(2)} | 
            Agent: ₹{(350 * companyData.agent_commission / 100).toFixed(2)} | 
            Teacher: ₹{(350 * companyData.teacher_commission / 100).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Withdrawal Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Withdrawal Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Withdrawal (₹)</label>
            <input
              type="number"
              name="min_withdrawal"
              value={companyData.min_withdrawal}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Withdrawal (₹)</label>
            <input
              type="number"
              name="max_withdrawal"
              value={companyData.max_withdrawal}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Fee (₹)</label>
            <input
              type="number"
              name="withdrawal_fee"
              value={companyData.withdrawal_fee}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Tax Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-md font-semibold text-gray-800 mb-4">Tax Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Percentage (%)</label>
            <input
              type="number"
              name="gst_percentage"
              value={companyData.gst_percentage}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TDS Percentage (%)</label>
            <input
              type="number"
              name="tds_percentage"
              value={companyData.tds_percentage}
              onChange={handleCompanyChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Cog6ToothIcon className="w-8 h-8 text-gray-600" />
          Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and platform preferences</p>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex px-4 py-2 gap-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'security' && renderSecurity()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'general' && renderGeneral()}
          {activeTab === 'company' && renderCompany()}
        </div>
      </div>
    </div>
  );
}