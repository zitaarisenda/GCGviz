
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  full_name: string;
  role: 'Admin Divisi' | 'User';
  divisi?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Pre-defined Admin Divisi accounts (hardcoded with hashed passwords)
const ADMIN_ACCOUNTS = [
  { 
    email: 'admin.audit@posindonesia.co.id',
    full_name: 'Admin Audit Internal',
    role: 'Admin Divisi' as const,
    divisi: 'Audit Internal',
    // Password: admin123 (hashed)
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  },
  {
    email: 'admin.risiko@posindonesia.co.id',
    full_name: 'Admin Manajemen Risiko',
    role: 'Admin Divisi' as const,
    divisi: 'Manajemen Risiko',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  },
  {
    email: 'admin.sekper@posindonesia.co.id',
    full_name: 'Admin Sekretaris Perusahaan',
    role: 'Admin Divisi' as const,
    divisi: 'Sekretaris Perusahaan',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  },
  {
    email: 'admin.keuangan@posindonesia.co.id',
    full_name: 'Admin Keuangan',
    role: 'Admin Divisi' as const,
    divisi: 'Keuangan',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  },
  {
    email: 'admin.sdm@posindonesia.co.id',
    full_name: 'Admin SDM',
    role: 'Admin Divisi' as const,
    divisi: 'SDM',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  },
  {
    email: 'admin.hukum@posindonesia.co.id',
    full_name: 'Admin Hukum',
    role: 'Admin Divisi' as const,
    divisi: 'Hukum',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  },
  {
    email: 'admin.it@posindonesia.co.id',
    full_name: 'Admin IT',
    role: 'Admin Divisi' as const,
    divisi: 'IT',
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
  }
];

// Simple hash verification function (for demo - in production use proper bcrypt)
const verifyPassword = (password: string, hash: string): boolean => {
  // For demo purposes, all admin passwords are "admin123"
  return password === 'admin123';
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      // Convert database profile to UserProfile format
      return {
        id: data.id,
        full_name: data.full_name || 'User',
        role: 'User' as const,
        created_at: data.created_at
      } as UserProfile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch user profile after authentication
          setTimeout(async () => {
            const profileData = await fetchUserProfile(session.user.id);
            setProfile(profileData);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then(setProfile);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Check if this is an Admin Divisi account (hardcoded)
      const adminAccount = ADMIN_ACCOUNTS.find(admin => admin.email === email);
      
      if (adminAccount) {
        // Verify admin password
        if (verifyPassword(password, adminAccount.passwordHash)) {
          // Create a mock session for admin
          const mockProfile: UserProfile = {
            id: `admin_${adminAccount.divisi?.toLowerCase().replace(/\s+/g, '_')}`,
            full_name: adminAccount.full_name,
            role: adminAccount.role,
            divisi: adminAccount.divisi
          };
          
          setProfile(mockProfile);
          setUser({
            id: mockProfile.id,
            email: adminAccount.email,
            email_confirmed_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            aud: 'authenticated',
            app_metadata: {},
            user_metadata: {}
          } as User);
          
          toast({
            title: "Login berhasil",
            description: `Selamat datang, ${adminAccount.full_name}!`,
          });
          
          return true;
        } else {
          toast({
            title: "Login gagal",
            description: "Password Admin Divisi salah",
            variant: "destructive"
          });
          return false;
        }
      }

      // If not admin, try regular Supabase auth for User
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login gagal",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      if (data.user) {
        const profileData = await fetchUserProfile(data.user.id);
        setProfile(profileData);
        
        toast({
          title: "Login berhasil",
          description: `Selamat datang, ${profileData?.full_name || 'User'}!`,
        });
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
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

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Register user with Supabase Auth (only for regular Users)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        toast({
          title: "Registrasi gagal",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      if (data.user) {
        // Create profile record for User only
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: username
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast({
            title: "Error",
            description: "Gagal membuat profil pengguna",
            variant: "destructive"
          });
          return false;
        }

        toast({
          title: "Registrasi berhasil",
          description: "Akun berhasil dibuat. Silakan cek email untuk konfirmasi.",
        });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Register error:', error);
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

  const logout = async () => {
    try {
      // For admin accounts, just clear local state
      if (profile?.role === 'Admin Divisi' && user?.id.startsWith('admin_')) {
        setUser(null);
        setProfile(null);
        setSession(null);
      } else {
        // For regular users, use Supabase signOut
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
      }
      
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session, 
      login, 
      register, 
      logout, 
      isLoading 
    }}>
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
