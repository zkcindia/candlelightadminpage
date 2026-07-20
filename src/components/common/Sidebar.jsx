import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  UserPlusIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  XMarkIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/students', label: 'Students', icon: UserGroupIcon },
    { path: '/teachers', label: 'Teachers', icon: AcademicCapIcon },
    { path: '/agents', label: 'Agents', icon: UserPlusIcon },
    { path: '/analytics', label: 'Analytics', icon: ChartBarIcon },
    { path: '/settings', label: 'Settings', icon: Cog6ToothIcon },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isMobile) setIsOpen(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    if (isMobile) setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Mobile */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}

      {/* Overlay - Mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-linear-to-r from-blue-800 to-blue-900 text-white z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'w-72' : 'w-64'}
          shadow-2xl
        `}
      >
        {/* Close Button - Mobile */}
        {isMobile && (
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-blue-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-white">
              A
            </div>
            <span className="ml-3 text-lg font-semibold text-white">
             CandleLight Admin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 overflow-y-auto h-[calc(100vh-8rem)]">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center px-3 py-3 rounded-lg mb-1 transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-700 text-white shadow-lg shadow-blue-900/30' 
                    : 'text-blue-100 hover:bg-blue-700/50 hover:text-white hover:translate-x-1'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="ml-3 text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700 bg-blue-800/50 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 rounded-lg text-blue-100 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 group"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="ml-3 text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}