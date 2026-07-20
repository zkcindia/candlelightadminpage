import React from 'react';
import { 
  BellIcon, 
  UserCircleIcon,
  MagnifyingGlassIcon,
  Bars3Icon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

export default function Header({ toggleSidebar }) {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header className={`
      bg-white shadow-sm px-4 md:px-6 py-3 md:py-4 
      flex items-center justify-between 
      transition-all duration-300
      ${isMobile ? 'ml-0' : 'ml-64'}
      border-b border-gray-100
    `}>
      {/* Left Side - Hamburger (Mobile) + Search */}
      <div className="flex items-center flex-1 gap-3">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>
        )}
        
        <div className="relative flex-1 max-w-md hidden sm:block">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm bg-gray-50 hover:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right Side - Notifications & User */}
      <div className="flex items-center gap-3 md:gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
          <BellIcon className="w-6 h-6 text-gray-600" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 border-l border-gray-200 pl-3 md:pl-4">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}