
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from '@/contexts/UserContext';
import { DireksiProvider } from '@/contexts/DireksiContext';
import { ChecklistProvider } from '@/contexts/ChecklistContext';
import { FileUploadProvider } from '@/contexts/FileUploadContext';
import { DocumentMetadataProvider } from '@/contexts/DocumentMetadataContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/pages/auth/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/dashboard/Dashboard';
import ListGCG from '@/pages/ListGCG';
import DocumentManagement from '@/pages/DocumentManagement';
import KelolaAkun from '@/pages/admin/KelolaAkun';
import ChecklistGCG from '@/pages/admin/ChecklistGCG';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Super Admin Route Component
const SuperAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useUser();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" replace /> : <Register />} 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/list-gcg" 
        element={
          <ProtectedRoute>
            <ListGCG />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/documents" 
        element={
          <ProtectedRoute>
            <DocumentManagement />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/penilaian-gcg" 
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Penilaian GCG</h1>
                <p className="text-gray-600">Halaman penilaian GCG akan dikembangkan selanjutnya</p>
              </div>
            </div>
          </ProtectedRoute>
        } 
      />
      
      {/* Super Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <SuperAdminRoute>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Panel</h1>
                <p className="text-gray-600">Pilih menu di sidebar untuk mengakses fitur admin</p>
              </div>
            </div>
          </SuperAdminRoute>
        } 
      />
      
      <Route 
        path="/admin/kelola-akun" 
        element={
          <SuperAdminRoute>
            <KelolaAkun />
          </SuperAdminRoute>
        } 
      />
      
      <Route 
        path="/admin/checklist-gcg" 
        element={
          <SuperAdminRoute>
            <ChecklistGCG />
          </SuperAdminRoute>
        } 
      />
      
      {/* Default Route */}
      <Route 
        path="/" 
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      {/* Catch all route */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
              <p className="text-gray-600">Halaman yang Anda cari tidak ditemukan</p>
            </div>
          </div>
        } 
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
    <UserProvider>
      <DireksiProvider>
        <ChecklistProvider>
          <FileUploadProvider>
              <DocumentMetadataProvider>
            <Router>
              <AppRoutes />
            </Router>
              </DocumentMetadataProvider>
          </FileUploadProvider>
        </ChecklistProvider>
      </DireksiProvider>
    </UserProvider>
    </AuthProvider>
  );
};

export default App;
