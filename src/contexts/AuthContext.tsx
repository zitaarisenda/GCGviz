
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  division?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, division: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash function for demo purposes (in production, use proper backend hashing)
const simpleHash = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize default admin account
  useEffect(() => {
    const initializeAdmin = () => {
      const users = JSON.parse(localStorage.getItem('gcg_users') || '[]');
      const adminExists = users.find((u: any) => u.username === 'admin123');
      
      if (!adminExists) {
        const adminUser = {
          id: 'admin-1',
          username: 'admin123',
          password: simpleHash('admin123'),
          role: 'admin',
          division: 'IT'
        };
        users.push(adminUser);
        localStorage.setItem('gcg_users', JSON.stringify(users));
      }
    };

    initializeAdmin();

    // Check if user is already logged in
    const savedUser = localStorage.getItem('gcg_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const users = JSON.parse(localStorage.getItem('gcg_users') || '[]');
      const foundUser = users.find((u: any) => 
        u.username === username && u.password === simpleHash(password)
      );

      if (foundUser) {
        const userData = {
          id: foundUser.id,
          username: foundUser.username,
          role: foundUser.role,
          division: foundUser.division
        };
        
        setUser(userData);
        localStorage.setItem('gcg_current_user', JSON.stringify(userData));
        
        toast({
          title: "Login berhasil",
          description: `Selamat datang, ${foundUser.username}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Login gagal",
          description: "Username atau password salah",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat login",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, password: string, division: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const users = JSON.parse(localStorage.getItem('gcg_users') || '[]');
      const userExists = users.find((u: any) => u.username === username);

      if (userExists) {
        toast({
          title: "Registrasi gagal",
          description: "Username sudah terdaftar",
          variant: "destructive"
        });
        return false;
      }

      const newUser = {
        id: `user-${Date.now()}`,
        username,
        password: simpleHash(password),
        role: 'user',
        division
      };

      users.push(newUser);
      localStorage.setItem('gcg_users', JSON.stringify(users));

      toast({
        title: "Registrasi berhasil",
        description: "Akun berhasil dibuat, silakan login",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat registrasi",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gcg_current_user');
    toast({
      title: "Logout berhasil",
      description: "Anda telah keluar dari sistem",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
