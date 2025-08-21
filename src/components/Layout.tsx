import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  // Users,
  // Calculator,
  CreditCard,
  // AlertTriangle,
  FileText,
  // Settings,
  Menu,
  X,
  Building2,
  ClipboardList
} from 'lucide-react';
import Cookies from 'js-cookie';
import { decodeJwtToken } from '../utils/decodeToken';

interface LayoutProps {
  children: React.ReactNode;
  UserFullName?: string;
  UserType?: string;
}

interface UserDetails {
  UserFullName: string;
  UserType: string;
  UserTypeID: number;
  // Add other properties if needed
}

const Layout: React.FC<LayoutProps> = ({ children, UserFullName: propUserFullName, UserType: propUserType }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  

  // Dropdown logic moved here
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    const data = decodeJwtToken();
    setUserDetails(data);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };

  }, [dropdownOpen]);

  function handleLogout() {
    // TODO: Replace with your logout logic
    // For example, clear auth tokens, redirect, etc.
    Cookies.remove('token');
    navigate('/login');
  }

  const navigation = [
    { name: 'Dashboard', user_type_id: 100, href: '/dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-purple-600' },
    { name: 'User Dashboard', user_type_id: 1, href: '/user-dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-purple-600' },
    { name: 'Checker Dashboard', user_type_id: 50, href: '/dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-purple-600' },
    { name: 'Hearing Officer Dasboard', user_type_id: 60, href: '/dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-purple-600' },
    { name: 'Survey', user_type_id: 100, href: '/survey', icon: ClipboardList, color: 'from-teal-500 to-cyan-600' },
    // { name: 'Vendors', href: '/vendors', icon: Users, color: 'from-green-500 to-teal-600' },
    // { name: 'Tax Management', href: '/tax-management', icon: Calculator, color: 'from-orange-500 to-red-600' },
    { name: 'Payments', user_type_id: 100, href: '/payments', icon: CreditCard, color: 'from-emerald-500 to-cyan-600' },
    // { name: 'Defaulters', href: '/defaulters', icon: AlertTriangle, color: 'from-red-500 to-pink-600' },
    { name: 'Reports', user_type_id: 100, href: '/reports', icon: FileText, color: 'from-purple-500 to-indigo-600' },
    // { name: 'Settings', href: '/settings', icon: Settings, color: 'from-gray-500 to-slate-600' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gradient-to-r from-blue-200 to-purple-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Zila Parishad
                </h1>
                <p className="text-xs text-gray-500 font-medium">Jalpaiguri</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 mt-6 px-4 pb-4 overflow-y-auto">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(item.href);
                return (
                  item?.user_type_id == userDetails?.UserTypeID && <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${active
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-blue-500/25`
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900'
                        }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={`w-5 h-5 mr-3 transition-all duration-200 ${active ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                        }`} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 flex-shrink-0">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Dropdown section */}
            <div className="flex items-center space-x-4 ml-auto relative" ref={dropdownRef}>
              <div className="relative">
                <button
                  className="flex items-center space-x-3 focus:outline-none"
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{propUserFullName || userDetails?.UserFullName}</p>
                    <p className="text-xs text-gray-500">{propUserType || userDetails?.UserType}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">{(propUserFullName || userDetails?.UserFullName)?.[0]}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black/5 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-lg transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;