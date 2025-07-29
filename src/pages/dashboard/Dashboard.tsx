import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import YearSelector from '@/components/dashboard/YearSelector';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DocumentList from '@/components/dashboard/DocumentList';
import { useSidebar } from '@/contexts/SidebarContext';

const Dashboard = () => {
  const { isSidebarOpen } = useSidebar();
  const [searchParams] = useSearchParams();
  
  // Get URL parameters
  const highlightDocumentId = searchParams.get('highlight');
  const filterYear = searchParams.get('year');
  const filterType = searchParams.get('filter');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      
      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-in-out pt-16
        ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Selamat datang di GCG Document Hub</p>
          </div>

          {/* Year Selector */}
          <YearSelector initialYear={filterYear ? parseInt(filterYear) : undefined} />

          {/* Dashboard Stats */}
          <DashboardStats />

          {/* Document List */}
          <DocumentList 
            showFilters={true} 
            highlightDocumentId={highlightDocumentId}
            filterYear={filterYear ? parseInt(filterYear) : undefined}
            filterType={filterType}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 