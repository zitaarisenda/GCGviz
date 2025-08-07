import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { 
  LayoutDashboard, 
  LogOut,
  User,
  Building2,
  Users,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MenuItem {
  name: string;
  icon: any;
  path: string;
}

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  const menuItems: MenuItem[] = [
    { 
      name: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/admin/dashboard'
    }
  ];

  const handleLogout = () => {
    logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const handleMainMenuClick = (item: MenuItem) => {
    // Navigate directly to the page
    navigate(item.path);
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
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

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src="" alt={user?.name || 'Admin'} />
              <AvatarFallback className="bg-blue-600 text-white text-sm">
                {user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.subDirektorat || 'Sub Direktorat'}
              </p>
            </div>
          </div>
          
          {/* User Details */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Building2 className="w-3 h-3" />
              <span className="truncate">{user?.direktorat || 'Direktorat'}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Users className="w-3 h-3" />
              <span className="truncate">{user?.subDirektorat || 'Sub Direktorat'}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <Briefcase className="w-3 h-3" />
              <span className="truncate">{user?.divisi || 'Divisi'}</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 pb-20">
          <div className="px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
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
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;

