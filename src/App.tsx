
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import UserDashboard from "./pages/UserDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, profile } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={profile?.role === 'Admin Divisi' ? '/admin' : '/user'} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={profile?.role === 'Admin Divisi' ? '/admin' : '/user'} replace /> : <Register />} />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireRole="Admin Divisi">
            <Index />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/user" 
        element={
          <ProtectedRoute requireRole="User">
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/" 
        element={
          user && profile ? (
            <Navigate to={profile.role === 'Admin Divisi' ? '/admin' : '/user'} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
