import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Clock,
  List,
  Filter,
  CheckSquare,
  Folders,
  Plus,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface MenuItem {
  path: string;
  icon: React.FC<{ className?: string }>;
  label: string;
  description?: string;
}

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const menuItems: MenuItem[] = [
    { 
      path: '/dashboard', 
      icon: Clock, 
      label: 'Dashboard',
      description: 'Overview of your work hours'
    },
    { 
      path: '/work-hours/add', 
      icon: Plus, 
      label: 'Add Work Hours',
      description: 'Record new work hours'
    },
    { 
      path: '/work-hours/list', 
      icon: List, 
      label: 'Work Hours List',
      description: 'View all recorded hours'
    },
    { 
      path: '/work-hours/filter', 
      icon: Filter, 
      label: 'Filter Hours',
      description: 'Search and filter entries'
    },
    { 
      path: '/work-hours/complete', 
      icon: CheckSquare, 
      label: 'Mark Complete',
      description: 'Update completion status'
    },
    { 
      path: '/headings', 
      icon: Folders, 
      label: 'Headings',
      description: 'Manage work categories'
    },
  ];

  const renderMenuItem = (item: MenuItem, mobile: boolean = false) => (
    <Link
      key={item.path}
      to={item.path}
      className={`group flex items-center rounded-md px-2 py-2 ${mobile ? 'text-base' : 'text-sm'} font-medium ${
        location.pathname === item.path
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
      onClick={() => mobile && setIsOpen(false)}
    >
      <item.icon
        className={`${mobile ? 'mr-4 h-6 w-6' : 'mr-3 h-5 w-5'} flex-shrink-0 ${
          location.pathname === item.path
            ? 'text-indigo-600'
            : 'text-gray-400 group-hover:text-gray-500'
        }`}
        aria-hidden="true"
      />
      {item.label}
    </Link>
  );

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            {/* Logo */}
            <div className="flex flex-shrink-0 items-center px-4">
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
            
            {/* Navigation Items */}
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {menuItems.map(item => renderMenuItem(item))}
            </nav>
          </div>
          
          {/* Logout Button */}
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <button
              onClick={logout}
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut
                className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between bg-white px-4 shadow-sm md:hidden">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-indigo-600" />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
          {isOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4">
            <div className="px-4">
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="mt-5 h-0 flex-1 overflow-y-auto">
              <nav className="space-y-1 px-2">
                {menuItems.map(item => renderMenuItem(item, true))}
              </nav>
            </div>
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={logout}
                className="group flex w-full items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <LogOut className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;