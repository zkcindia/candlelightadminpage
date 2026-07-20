import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
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
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <main className={`
        transition-all duration-300
        ${isMobile ? 'ml-0 pt-16' : 'ml-64 pt-16'}
        p-4 md:p-6
      `}>
        <div className=" w-full mx-auto px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}