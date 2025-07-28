import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import YearSelector from '@/components/dashboard/YearSelector';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DocumentList from '@/components/dashboard/DocumentList';

const Dashboard = () => {

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      
      {/* Main Content */}
      <div className="ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Selamat datang di GCG Document Hub</p>
          </div>

          {/* Year Selector */}
          <YearSelector />

          {/* Dashboard Stats */}
          <DashboardStats />

          {/* Document List */}
          <DocumentList showFilters={true} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 