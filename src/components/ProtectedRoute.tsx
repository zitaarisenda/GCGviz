
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: 'Admin Divisi' | 'User';
}

const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && profile.role !== requireRole) {
    return <Navigate to={profile.role === 'Admin Divisi' ? '/admin' : '/user'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
