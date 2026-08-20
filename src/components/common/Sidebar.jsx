// src/components/common/Sidebar.jsx
import React, { useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  UserPlusIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon,
  XMarkIcon,
  Bars3Icon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  BookOpenIcon,
  PresentationChartBarIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';

export default function Sidebar() {
  const { logout, userRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const toggleSubMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const getMenuItems = () => {
    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    ];

    const adminItems = [
      { path: '/students', label: 'Students', icon: UserGroupIcon },
      { path: '/teachers', label: 'Teachers', icon: AcademicCapIcon },
      { path: '/agents', label: 'Associate', icon: UserPlusIcon },
      { path: '/transactions', label: 'Transactions', icon: DocumentTextIcon },
    ];

    const agentItems = [
      { path: '/students', label: 'My Students', icon: UserGroupIcon },
      { path: '/earnings', label: 'Earnings', icon: CurrencyDollarIcon },
      { path: '/analytics', label: 'Analytics', icon: ChartBarIcon },
    ];

// In Sidebar.jsx - Update the subMenuItems
const subMenuItems = {
  'management': {
    label: 'Management',
    icon: Cog6ToothIcon,
    items: [
      { path: '/boards', label: 'Boards', icon: AcademicCapIcon },
      { path: '/classes', label: 'Classes', icon: PresentationChartBarIcon },
      { path: '/subjects', label: 'Subjects', icon: BookOpenIcon },
      { path: '/reminder-days', label: 'Reminder Days', icon: CalendarDaysIcon },
      { path: '/approvals', label: 'Approvals', icon: CheckBadgeIcon },
      { path: '/settings', label: 'Settings', icon: Cog6ToothIcon },
    ]
  }
};

    let baseItems = [...commonItems];

    // ✅ Admin & Super Admin = Full Access with Management
    if (userRole === 'admin' || userRole === 'super_admin') {
      baseItems = [...baseItems, ...adminItems];
      baseItems.push(subMenuItems.management);
    } 
    // ❌ Agent = No Management Menu
    else if (userRole === 'agent') {
      baseItems = [...baseItems, ...agentItems];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

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

  const isSubMenu = (item) => {
    return item.items && Array.isArray(item.items);
  };

  const isSubItemActive = (item) => {
    if (!isSubMenu(item)) return false;
    return item.items.some(subItem => subItem.path === location.pathname);
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>
      )}

      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={closeSidebar} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-blue-800 to-blue-900 text-white z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isMobile ? 'w-72' : 'w-64'}
          shadow-2xl
        `}
      >
        {isMobile && (
          <button
            onClick={closeSidebar}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-blue-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-white">
              {userRole === 'super_admin' ? 'SA' : userRole === 'admin' ? 'A' : 'AG'}
            </div>
            <span className="ml-3 text-lg font-semibold text-white">
              {userRole === 'super_admin' ? 'Super Admin' : 
               userRole === 'admin' ? 'School Admin' : 
               'Agent Panel'}
            </span>
          </div>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-2 bg-blue-700/30 mx-3 mt-3 rounded-lg text-center">
          <span className="text-xs text-blue-200 uppercase tracking-wider">
            {userRole === 'super_admin' ? '🔑 Super Admin' : 
             userRole === 'admin' ? '🏫 School Admin' : 
             '🤝 Agent'}
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 overflow-y-auto h-[calc(100vh-12rem)]">
          {menuItems.map((item) => {
            if (isSubMenu(item)) {
              const isExpanded = expandedMenus[item.label] || isSubItemActive(item);
              return (
                <div key={item.label} className="mb-1">
                  <button
                    onClick={() => toggleSubMenu(item.label)}
                    className={`
                      flex items-center justify-between w-full px-3 py-3 rounded-lg
                      transition-all duration-200
                      ${isExpanded ? 'bg-blue-700 text-white shadow-lg shadow-blue-900/30' : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'}
                    `}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5" />
                      <span className="ml-3 text-sm">{item.label}</span>
                    </div>
                    <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-600/50 pl-4">
                      {item.items.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={closeSidebar}
                          className={({ isActive }) =>
                            `flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
                              isActive 
                                ? 'bg-blue-700/50 text-white' 
                                : 'text-blue-200 hover:bg-blue-700/30 hover:text-white hover:translate-x-1'
                            }`
                          }
                        >
                          {subItem.icon && <subItem.icon className="w-4 h-4" />}
                          <span className="ml-3 text-xs">{subItem.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
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
              );
            }
          })}
        </nav>

        {/* Logout */}
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