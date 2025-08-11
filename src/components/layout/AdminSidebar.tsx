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
  Briefcase,
  Mail
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
        fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 z-40 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-72 shadow-2xl overflow-y-auto
        transform-gpu
        lg:translate-x-0
        pt-16
        pb-20
      `}>
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16 border-4 border-blue-500/20 shadow-lg">
              <AvatarImage src="" alt={user?.name || 'Admin'} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl font-bold">
                {user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white truncate mb-1">
                {user?.name || 'Admin User'}
              </h3>
              <p className="text-sm text-blue-300 font-medium truncate">
                {user?.email || 'admin@example.com'}
              </p>
            </div>
          </div>
          
          {/* User Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
              <Building2 className="w-4 h-4 text-blue-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Direktorat</p>
                <p className="text-sm text-white font-medium truncate">
                  {user?.direktorat || 'Direktorat Umum'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
              <Users className="w-4 h-4 text-green-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Sub Direktorat</p>
                <p className="text-sm text-white font-medium truncate">
                  {user?.subdirektorat || user?.subDirektorat || 'Sub Direktorat Keuangan'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
              <Briefcase className="w-4 h-4 text-purple-400" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Divisi</p>
                <p className="text-sm text-white font-medium truncate">
                  {user?.divisi || 'Divisi Umum'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 pb-6">
          <div className="px-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">
              Menu Utama
            </h4>
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <div key={item.name}>
                    <Link
                      to={item.path}
                      onClick={() => handleMainMenuClick(item)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        active 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800 z-10">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 rounded-xl"
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

