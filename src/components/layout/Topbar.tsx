import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Bell, 
  Mail, 
  HelpCircle,
  User,
  Menu,
  X
} from 'lucide-react';

const Topbar = () => {
  const { user } = useUser();
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  // Function to refresh page and scroll to top
  const handleLogoClick = () => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Refresh page after a short delay to allow scroll animation
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50 shadow-sm">
      {/* Left side - Logo, Title, and Hamburger */}
      <div className="flex items-center space-x-4">
        {/* Hamburger Menu */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Menu className="w-5 h-5 text-gray-600" />
          )}
        </Button>

        {/* Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity duration-200"
          onClick={handleLogoClick}
        >
          <img 
            src="/logo.png" 
            alt="POSIND Logo" 
            className="h-8 w-auto"
          />
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-gray-900">
              GCG Document Hub
            </h1>
            <p className="text-xs text-gray-500">
              Good Corporate Governance Management System
            </p>
          </div>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-8 hidden lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Cari dokumen, checklist, atau informasi..."
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </Button>

        {/* Messages */}
        <Button variant="ghost" size="sm">
          <Mail className="w-5 h-5 text-gray-600" />
        </Button>

        {/* Help */}
        <Button variant="ghost" size="sm">
          <HelpCircle className="w-5 h-5 text-gray-600" />
        </Button>

        {/* User Avatar */}
        <div className="flex items-center space-x-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" alt={user?.name || 'User'} />
            <AvatarFallback className="bg-blue-600 text-white text-sm">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'user'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar; 