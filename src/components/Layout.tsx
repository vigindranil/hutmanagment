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
  ClipboardList,
  ChevronDown,
  ChevronRight,
  LogOut
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
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

  // Check if any submenu path is active
  useEffect(() => {
    const currentPath = location.pathname;
    navigation.forEach((item) => {
      if (item.subMenu) {
        const hasActiveSubmenu = item.subMenu.some(sub => currentPath === sub.href);
        if (hasActiveSubmenu && !expandedMenus.includes(item.name)) {
          setExpandedMenus(prev => [...prev, item.name]);
        }
      }
    });
  }, [location.pathname]);

  function handleLogout() {
    // TODO: Replace with your logout logic
    // For example, clear auth tokens, redirect, etc.
    Cookies.remove('token');
    console.log("Logout button triggered")
    navigate('/login');
  }

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const navigation = [
    { name: 'Dashboard', user_type_id: 100, href: '/dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-purple-600' },
    { name: 'Shop Owner Dashboard', user_type_id: 1, href: '/user-dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-purple-600' },
    { name: 'Haat Manager Dashboard', user_type_id: 10, href: '/dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-purple-600' },
    { name: 'Checker Dashboard', user_type_id: 50, href: '/dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-purple-600' },
    { name: 'Hearing Officer Dasboard', user_type_id: 60, href: '/dashboard', icon: LayoutDashboard, color: 'from-blue-500 to-purple-600' },
    { name: 'Approval Officer Dasboard', user_type_id: 70, href: '/dashboard', icon: FileText, color: 'from-purple-500 to-indigo-600' },
    {
      name: 'Reports',
      user_type_id: 70,
      icon: FileText,
      color: 'from-blue-500 to-purple-600 hover:from-green-600 hover:to-indigo-700',
      subMenu: [
        { name: 'First Payment Completed', href: '/firstpayment'},
        { name: 'Final Payment Completed', href: '/finalpayment'},
        { name: 'Completed Hearing', href: '/completedhearing'},
        { name: 'License Generated', href: '/licensegenerated'},
      ],
    },
    { name: 'Survey', user_type_id: 100, href: '/survey', icon: ClipboardList, color: 'from-teal-500 to-cyan-600' },
    // { name: 'Vendors', href: '/vendors', icon: Users, color: 'from-green-500 to-teal-600' },
    // { name: 'Tax Management', href: '/tax-management', icon: Calculator, color: 'from-orange-500 to-red-600' },
    { name: 'Payments', user_type_id: 100, href: '/payments', icon: CreditCard, color: 'from-emerald-500 to-cyan-600' },
    // { name: 'Defaulters', href: '/defaulters', icon: AlertTriangle, color: 'from-red-500 to-pink-600' },


    // { name: 'Settings', href: '/settings', icon: Settings, color: 'from-gray-500 to-slate-600' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const hasActiveSubmenu = (subMenu: any[]) => {
    return subMenu.some(sub => location.pathname === sub.href);
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
                const active = item.href ? isActivePath(item.href) : false;
                const hasSubmenuActive = item.subMenu ? hasActiveSubmenu(item.subMenu) : false;
                const isExpanded = expandedMenus.includes(item.name);

                return (
                  item?.user_type_id == userDetails?.UserTypeID && (
                    <li key={item.name}>
                      {/* Main menu item */}
                      {item.subMenu ? (
                        // Item with submenu
                        <div>
                          <button
                            onClick={() => toggleSubmenu(item.name)}
                            className={`group w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 ${hasSubmenuActive
                              ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-blue-500/25`
                              : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-gray-900'
                              }`}
                          >
                            <div className="flex items-center">
                              <Icon className={`w-5 h-5 mr-3 transition-all duration-200 ${hasSubmenuActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                                }`} />
                              {item.name}
                            </div>
                            {isExpanded ? (
                              <ChevronDown className={`w-4 h-4 transition-all duration-200 ${hasSubmenuActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                                }`} />
                            ) : (
                              <ChevronRight className={`w-4 h-4 transition-all duration-200 ${hasSubmenuActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                                }`} />
                            )}
                          </button>

                          {/* Enhanced Submenu with Professional Hover Effects */}
                          {isExpanded && (
                            <ul className="mt-2 ml-6 space-y-1">
                              {item.subMenu.map((subItem) => {
                                const subActive = isActivePath(subItem.href);
                                return (
                                  <li key={subItem.name}>
                                    <Link
                                      to={subItem.href}
                                      className={`group block px-4 py-3 text-sm rounded-lg transition-all duration-300 transform hover:translate-x-1 ${subActive
                                        ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/25'
                                        : 'text-gray-600 hover:bg-gradient-to-r hover:from-teal-50 hover:via-blue-50 hover:to-indigo-50 hover:text-teal-700 hover:shadow-md hover:border-l-4 hover:border-teal-400'
                                        }`}
                                      onClick={() => setSidebarOpen(false)}
                                    >
                                      <span className="flex items-center">
                                        <span className={`w-2 h-2 rounded-full mr-3 transition-all duration-200 ${subActive
                                          ? 'bg-white shadow-sm'
                                          : 'bg-gray-300 group-hover:bg-teal-400 group-hover:scale-125'
                                          }`}></span>
                                        <span className="relative">
                                          {subItem.name}
                                          {!subActive && (
                                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
                                          )}
                                        </span>
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      ) : (
                        // Regular menu item
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
                      )}
                    </li>
                  )
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 ">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-lg border-b border-white/20 flex-shrink-0 relative z-50">

          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            {/* Enhanced Dropdown section */}
            <div className="flex items-center space-x-4 ml-auto relative z-[100]" ref={dropdownRef}>
              <div className="relative">
                <button
                  className="flex items-center space-x-3 focus:outline-none hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl px-3 py-2 transition-all duration-200 hover:shadow-md"
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{propUserFullName || userDetails?.UserFullName}</p>
                    <p className="text-xs text-gray-500">{propUserType || userDetails?.UserType}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                    <span className="text-sm font-bold text-white">{(propUserFullName || userDetails?.UserFullName)?.[0]}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 text-gray-500 ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Enhanced Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 max-w-xs bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl ring-1 ring-black/5 border border-white/20 z-[101]"
                    style={{
                      minWidth: '12rem',
                      top: '100%',
                      position: 'absolute', // Ensure it's explicitly positioned
                    }}
                  >
                    <div className="p-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg mb-2">
                        <p className="text-sm font-medium text-gray-900">{propUserFullName || userDetails?.UserFullName}</p>
                        <p className="text-xs text-gray-500">{propUserType || userDetails?.UserType}</p>
                      </div>
                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="group w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 rounded-lg transition-all duration-200 transform hover:scale-105"
                        style={{ zIndex: 102 }} // Explicit z-index for the button
                      >
                        <LogOut className="w-4 h-4 mr-3 transition-all duration-200 text-gray-400 group-hover:text-red-500" />
                        <span className="relative">
                          Logout
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                        </span>
                      </button>
                    </div>
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