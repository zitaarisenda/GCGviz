import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { 
  LayoutDashboard, 
  Shield,
  UserCog,
  ListTodo,
  LogOut,
  BarChart3,
  PanelLeft,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useUser();

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard',
      badge: null
    },
    { 
      name: 'List GCG', 
      icon: PanelLeft, 
      path: '/list-gcg',
      badge: null
    },
    { 
      name: 'Manajemen Dokumen', 
      icon: FileText, 
      path: '/documents',
      badge: null
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
        name: 'Kelola Akun',
        icon: UserCog,
        path: '/admin/kelola-akun',
        badge: 'Super Admin'
      },
      {
        name: 'Checklist GCG',
        icon: ListTodo,
        path: '/admin/checklist-gcg',
        badge: 'Super Admin'
      }
    );
  }

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0 z-50">
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
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
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
                  {item.badge && (
                    <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 