
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, Mail, Lock, ArrowRight, Building2, User, CheckCircle, AlertCircle, Users, Award, Globe } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }

    if (!username.trim()) {
      newErrors.username = 'Username wajib diisi';
    } else if (username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }

    if (!email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!password) {
      newErrors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      try {
        // Simple registration logic
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const existingUser = users.find((u: any) => u.username === username);
        
        if (existingUser) {
          setErrors({ username: 'Username sudah digunakan!' });
          setIsLoading(false);
          return;
        }

        const newUser = {
          id: Date.now(),
          username,
          password,
          name,
          email,
          role: 'user' as const,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        
        // Show success and redirect
        alert('Registrasi berhasil! Silakan login.');
        navigate('/login');
      } catch (error) {
        setErrors({ general: 'Terjadi kesalahan saat registrasi' });
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-gray-100">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/aset/POSIND_2023_(with_wordmark).svg.png" 
                alt="POS Indonesia" 
                className="h-10 w-auto"
              />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">GCG Document Hub</h1>
                <p className="text-sm text-gray-600">Sistem Manajemen Dokumen GCG</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                to="/register" 
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Daftar
              </Link>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left Side - Landing Content */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-red-600 via-red-700 to-gray-800 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          </div>
          
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="max-w-2xl">
              <div className="mb-8">
                <h2 className="text-5xl font-bold mb-6 leading-tight">
                  Bergabung dengan Tim
                  <span className="block text-red-200">Good Corporate Governance</span>
                </h2>
                <p className="text-xl text-red-100 mb-8 leading-relaxed">
                  Dapatkan akses ke sistem manajemen dokumen GCG yang terintegrasi dan aman. 
                  Dukung implementasi Good Corporate Governance yang transparan dan akuntabel bersama POS Indonesia.
                </p>
              </div>
              
              {/* Key Benefits */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Akses Terbatas & Aman</h3>
                      <p className="text-red-100 text-sm leading-relaxed">
                        Akses sesuai dengan role dan tanggung jawab Anda dengan sistem keamanan tingkat tinggi.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Compliance GCG</h3>
                      <p className="text-red-100 text-sm leading-relaxed">
                        Dukung implementasi Good Corporate Governance yang sesuai dengan standar dan regulasi.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Kolaborasi Tim</h3>
                      <p className="text-red-100 text-sm leading-relaxed">
                        Bekerja sama dengan tim dalam mengelola dan mengakses dokumen GCG secara efisien.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Keamanan Terjamin</h3>
                      <p className="text-red-100 text-sm leading-relaxed">
                        Data dan dokumen Anda terlindungi dengan sistem keamanan yang kuat dan terpercaya.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="mt-12 grid grid-cols-3 gap-8 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-200 mb-1">500+</div>
                  <div className="text-sm text-red-100">User Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-200 mb-1">10K+</div>
                  <div className="text-sm text-red-100">Dokumen GCG</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-200 mb-1">99.9%</div>
                  <div className="text-sm text-red-100">Uptime</div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <img 
                src="/aset/POSIND_2023_(with_wordmark).svg.png" 
                alt="POS Indonesia" 
                className="h-12 w-auto mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">GCG Document Hub</h2>
              <p className="text-gray-600">Sistem Manajemen Dokumen GCG</p>
            </div>

            {/* Register Form */}
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Daftar Akun User</h2>
                  <p className="text-gray-600">Buat akun baru untuk mengakses sistem GCG</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nama Lengkap
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`pl-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 ${
                          errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                        required
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Masukkan email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`pl-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 ${
                          errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Masukkan username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`pl-10 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 ${
                          errors.username ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                        required
                      />
                    </div>
                    {errors.username && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.username}</span>
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`pl-10 pr-12 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 ${
                          errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.password}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Konfirmasi Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Konfirmasi password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`pl-10 pr-12 h-12 border-gray-200 focus:border-red-500 focus:ring-red-500 ${
                          errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        }`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.confirmPassword}</span>
                      </p>
                    )}
                  </div>

                  {errors.general && (
                    <div className="text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.general}</span>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Mendaftarkan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Daftar Akun</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Info Box */}
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-red-900 mb-1">Registrasi User Only</h4>
                      <p className="text-sm text-red-800">
                        Registrasi ini hanya untuk User. Akun Admin dan Super Admin dibuat oleh Super Admin melalui menu Kelola Akun.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
                      Masuk ke sistem
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>© 2024 POS Indonesia. All rights reserved.</p>
              <p className="mt-1">Sistem Manajemen Dokumen GCG</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
