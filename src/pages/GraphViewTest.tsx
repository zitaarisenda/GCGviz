import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { useSidebar } from '@/contexts/SidebarContext';

const GraphViewTest = () => {
  const { isSidebarOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Topbar />
        <div className="p-6">
          <h1 className="text-2xl font-bold">Graph View Test</h1>
          <p>If you can see this, the basic structure works.</p>
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <p>Testing localStorage data:</p>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2">
              {JSON.stringify(Object.keys(localStorage), null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphViewTest;