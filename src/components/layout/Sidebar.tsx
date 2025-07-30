import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { 
  LayoutDashboard, 
  Shield,
  UserCog,
  ListTodo,
  LogOut,
  BarChart3,
  PanelLeft,
  FileText,
  Calendar,
  TrendingUp,
  Upload,
  ChevronDown,
  ChevronRight,
  Target,
  Users,
  Settings,
  Building2,
  Folder,
  Download,
  RotateCcw,
  Plus,
  Lock
} from 'lucide-react';

interface MenuItem {
  name: string;
  icon: any;
  path: string;
  badge?: string | null;
  badgeIcon?: any;
  subItems?: SubMenuItem[];
}

interface SubMenuItem {
  name: string;
  icon: any;
  path: string;
  anchor?: string;
  description?: string;
}

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Load expanded menus from localStorage on component mount
  useEffect(() => {
    const savedExpandedMenus = localStorage.getItem('sidebarExpandedMenus');
    if (savedExpandedMenus) {
      setExpandedMenus(JSON.parse(savedExpandedMenus));
    }
  }, []);

  // Save expanded menus to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarExpandedMenus', JSON.stringify(expandedMenus));
  }, [expandedMenus]);

  // Auto-expand menu when navigating to a page
  useEffect(() => {
    const currentPath = location.pathname;
    const menuItem = menuItems.find(item => 
      currentPath === item.path || currentPath.startsWith(item.path + '/')
    );
    
    if (menuItem && menuItem.subItems) {
      // Close other menus and open only the current menu
      setExpandedMenus([menuItem.name]);
    }
  }, [location.pathname]);

  const menuItems: MenuItem[] = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard',
      badge: null,
      subItems: [
        {
          name: 'Tahun Buku',
          icon: Calendar,
          path: '/dashboard',
          anchor: '#year-selector',
          description: 'Pilih tahun buku'
        },
        {
          name: 'Statistik Tahun',
          icon: TrendingUp,
          path: '/dashboard',
          anchor: '#dashboard-stats',
          description: 'Statistik dashboard'
        },
        {
          name: 'Daftar Dokumen',
          icon: FileText,
          path: '/dashboard',
          anchor: '#document-list',
          description: 'Daftar dokumen'
        }
      ]
    },
    { 
      name: 'List GCG', 
      icon: PanelLeft, 
      path: '/list-gcg',
      badge: null,
      subItems: [
        {
          name: 'Tahun Buku',
          icon: Calendar,
          path: '/list-gcg',
          anchor: '#year-selector',
          description: 'Pilih tahun buku'
        },
        {
          name: 'Progress Keseluruhan',
          icon: BarChart3,
          path: '/list-gcg',
          anchor: '#overall-progress',
          description: 'Progress upload'
        },
        {
          name: 'Progress per Aspek',
          icon: TrendingUp,
          path: '/list-gcg',
          anchor: '#aspect-progress',
          description: 'Progress per aspek'
        },
        {
          name: 'Daftar Checklist',
          icon: ListTodo,
          path: '/list-gcg',
          anchor: '#checklist-table',
          description: 'Daftar checklist GCG'
        }
      ]
    },
    { 
      name: 'Penilaian GCG', 
      icon: BarChart3, 
      path: '/penilaian-gcg',
      badge: null
    }
  ];

  // Tambahkan menu Super Admin hanya untuk Super Admin
  if (user?.role === 'superadmin') {
    menuItems.push(
      {
        name: 'Management Dokumen',
        icon: FileText,
        path: '/admin/document-management',
        badgeIcon: Lock
      },
      {
        name: 'Kelola Akun',
        icon: UserCog,
        path: '/admin/kelola-akun',
        badgeIcon: Lock
      },
      {
        name: 'Struktur Perusahaan',
        icon: Building2,
        path: '/admin/struktur-perusahaan',
        badgeIcon: Lock
      },
      {
        name: 'Checklist GCG',
        icon: ListTodo,
        path: '/admin/checklist-gcg',
        badgeIcon: Lock
      }
    );
  }

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => {
      const isCurrentlyExpanded = prev.includes(menuName);
      if (isCurrentlyExpanded) {
        // If currently expanded, just close this menu
        return prev.filter(name => name !== menuName);
      } else {
        // If not expanded, close other menus and open this one
        return [menuName];
      }
    });
  };

  const handleMainMenuClick = (item: MenuItem) => {
    // If menu has sub-items, toggle expansion (auto-close logic is in toggleMenu)
    if (item.subItems && item.subItems.length > 0) {
      toggleMenu(item.name);
    }
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  const handleSubItemClick = (path: string, anchor?: string) => {
    // Navigate to the page first
    navigate(path);
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
    
    // Scroll to anchor after a short delay to ensure page is loaded
    if (anchor) {
      setTimeout(() => {
        const element = document.querySelector(anchor);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  };

  const isMenuExpanded = (menuName: string) => {
    return expandedMenus.includes(menuName);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-gray-900 z-40 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 shadow-xl overflow-y-auto
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GCG</span>
            </div>
            <span className="text-white font-semibold text-lg">Document Hub</span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 pb-20">
          <div className="px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const expanded = isMenuExpanded(item.name);
              
              return (
                <div key={item.name}>
                  {/* Main Menu Item */}
                  <div className="relative">
                    <Link
                      to={item.path}
                      onClick={() => handleMainMenuClick(item)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                        active 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.badgeIcon && (
                          <item.badgeIcon className="w-4 h-4 text-blue-400" />
                        )}
                        {item.badge && (
                          <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                        {hasSubItems && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleMenu(item.name);
                            }}
                            className={`transition-transform duration-300 ease-in-out ${
                              expanded ? 'rotate-180' : 'rotate-0'
                            }`}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </Link>
                  </div>

                  {/* Sub Menu Items */}
                  {hasSubItems && (
                    <div 
                      className={`ml-4 mt-1 space-y-1 overflow-hidden transition-all duration-500 ease-out ${
                        expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                      style={{
                        transform: expanded ? 'translateY(0)' : 'translateY(-10px)',
                        transition: expanded 
                          ? 'max-height 0.5s ease-out, opacity 0.3s ease-out 0.1s, transform 0.3s ease-out 0.1s'
                          : 'max-height 0.3s ease-in, opacity 0.2s ease-in, transform 0.2s ease-in'
                      }}
                    >
                      {item.subItems!.map((subItem, index) => {
                        const SubIcon = subItem.icon;
                        return (
                          <button
                            key={subItem.name}
                            onClick={() => handleSubItemClick(subItem.path, subItem.anchor)}
                            className={`w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-300 ease-out group transform ${
                              expanded 
                                ? 'translate-x-0 opacity-100' 
                                : 'translate-x-4 opacity-0'
                            }`}
                            style={{
                              transitionDelay: expanded ? `${index * 75}ms` : '0ms',
                              transition: expanded
                                ? `all 0.3s ease-out ${index * 75}ms`
                                : 'all 0.2s ease-in'
                            }}
                          >
                            <SubIcon className="w-4 h-4" />
                            <div className="flex-1 text-left">
                              <div className="font-medium">{subItem.name}</div>
                              {subItem.description && (
                                <div className="text-xs text-gray-500 group-hover:text-gray-300">
                                  {subItem.description}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 