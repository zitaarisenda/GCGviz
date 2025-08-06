import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSidebar } from '@/contexts/SidebarContext';
import { ConfirmDialog, FormDialog, ActionButton, IconButton } from '@/components/panels';
import { useUser } from '@/contexts/UserContext';
import { useYear } from '@/contexts/YearContext';
import { 
  UserCog, 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  Users,
  User,
  UserCheck,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface Account {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'superadmin';
  direktorat?: string;
  subdirektorat?: string;
  divisi?: string;
  createdAt: Date;
  isActive: boolean;
}

const KelolaAkun = () => {
  const { isSidebarOpen } = useSidebar();
  const { user: currentUser } = useUser();
  const { availableYears } = useYear();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Form states
  const [accountForm, setAccountForm] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user' as 'admin' | 'user' | 'superadmin',
    direktorat: '',
    subdirektorat: '',
    divisi: ''
  });

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: ''
  });

  // Password strength indicator for edit dialog
  const [editPasswordStrength, setEditPasswordStrength] = useState({
    score: 0,
    label: '',
    color: ''
  });

  // Load accounts from localStorage
  useEffect(() => {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      const users = JSON.parse(usersData);
      const accountsData = users.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        direktorat: user.direktorat,
        subdirektorat: user.subdirektorat,
        divisi: user.divisi,
        createdAt: new Date(user.createdAt || Date.now()),
        isActive: user.isActive !== false
      }));
      setAccounts(accountsData);
    }
  }, []);

  // Generate strong password
  const generateStrongPassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let password = '';
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill remaining 8 characters with random mix
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 0; i < 8; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    return password;
  };

  // Check password strength
  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let label = '';
    let color = '';

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 0:
      case 1:
        label = 'Sangat Lemah';
        color = 'text-red-500';
        break;
      case 2:
        label = 'Lemah';
        color = 'text-orange-500';
        break;
      case 3:
        label = 'Sedang';
        color = 'text-yellow-500';
        break;
      case 4:
        label = 'Kuat';
        color = 'text-blue-500';
        break;
      case 5:
        label = 'Sangat Kuat';
        color = 'text-green-500';
        break;
    }

    return { score, label, color };
  };

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load accounts from localStorage
  useEffect(() => {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      const users = JSON.parse(usersData);
      const accountsData = users.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        direktorat: user.direktorat || '',
        subdirektorat: user.subdirektorat || '',
        divisi: user.divisi || '',
        createdAt: new Date(user.createdAt || Date.now()),
        isActive: true
      }));
      setAccounts(accountsData);
    }
  }, []);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!accountForm.email || !accountForm.password || !accountForm.name) {
      alert('Semua field wajib diisi!');
      return;
    }

    // Check if email already exists
    const existingUser = accounts.find(acc => acc.email === accountForm.email);
    if (existingUser) {
      alert('Email sudah digunakan!');
      return;
    }

    // Create new account
    const newAccount: Account = {
      id: Date.now(),
      email: accountForm.email,
      name: accountForm.name,
      role: accountForm.role,
      direktorat: accountForm.direktorat,
      subdirektorat: accountForm.subdirektorat,
      divisi: accountForm.divisi,
      createdAt: new Date(),
      isActive: true
    };

    // Save to localStorage
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    users.push({
      ...newAccount,
      password: accountForm.password // In real app, this should be hashed
    });
    localStorage.setItem('users', JSON.stringify(users));

    // Update state
    setAccounts(prev => [...prev, newAccount]);
    
    // Reset form and close dialog
    setAccountForm({
      email: '',
      password: '',
      name: '',
      role: 'user' as 'admin' | 'user' | 'superadmin',
      direktorat: '',
      subdirektorat: '',
      divisi: ''
    });
    setIsAddDialogOpen(false);
    
    alert('Akun berhasil ditambahkan!');
  };

  const handleEditAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAccount) return;

    // Validate form
    if (!accountForm.email || !accountForm.name) {
      alert('Email dan nama wajib diisi!');
      return;
    }

    // Check if email already exists (excluding current account)
    const existingUser = accounts.find(acc => 
      acc.email === accountForm.email && acc.id !== editingAccount.id
    );
    if (existingUser) {
      alert('Email sudah digunakan!');
      return;
    }

    // Update account
    const updatedAccount: Account = {
      ...editingAccount,
      email: accountForm.email,
      name: accountForm.name,
      role: accountForm.role,
      direktorat: accountForm.direktorat,
      subdirektorat: accountForm.subdirektorat,
      divisi: accountForm.divisi
    };

    // Update localStorage
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const userIndex = users.findIndex((u: any) => u.id === editingAccount.id);
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        email: accountForm.email,
        name: accountForm.name,
        role: accountForm.role,
        direktorat: accountForm.direktorat,
        subdirektorat: accountForm.subdirektorat,
        divisi: accountForm.divisi,
        // Only update password if provided
        ...(accountForm.password && { password: accountForm.password })
      };
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Update state
    setAccounts(prev => prev.map(acc => 
      acc.id === editingAccount.id ? updatedAccount : acc
    ));
    
    // Reset form and close dialog
    setAccountForm({
      email: '',
      password: '',
      name: '',
      role: 'user' as 'admin' | 'user' | 'superadmin',
      direktorat: '',
      subdirektorat: '',
      divisi: ''
    });
    setEditingAccount(null);
    setIsEditDialogOpen(false);
    setEditPasswordStrength({ score: 0, label: '', color: '' });
    
    alert('Akun berhasil diupdate!');
  };

  const handleDeleteAccount = () => {
    if (!accountToDelete) return;

    // Don't allow deleting superadmin
    if (accountToDelete.role === 'superadmin') {
      alert('Tidak dapat menghapus akun Super Admin!');
      return;
    }

    // Don't allow deleting own account
    if (accountToDelete.id === currentUser?.id) {
      alert('Tidak dapat menghapus akun sendiri!');
      return;
    }

    // Remove from localStorage
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const filteredUsers = users.filter((u: any) => u.id !== accountToDelete.id);
    localStorage.setItem('users', JSON.stringify(filteredUsers));

    // Update state
    setAccounts(prev => prev.filter(acc => acc.id !== accountToDelete.id));
    
    setAccountToDelete(null);
    setIsDeleteDialogOpen(false);
    
    alert('Akun berhasil dihapus!');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      alert('Semua field wajib diisi!');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Password minimal 6 karakter!');
      return;
    }

    // Update password in localStorage
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const userIndex = users.findIndex((u: any) => u.id === currentUser?.id);
    if (userIndex !== -1) {
      // In real app, verify current password first
      users[userIndex].password = passwordForm.newPassword; // Should be hashed
      localStorage.setItem('users', JSON.stringify(users));
    }

    // Reset form and close dialog
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setIsPasswordDialogOpen(false);
    
    alert('Password berhasil diubah!');
  };

  const openEditDialog = (account: Account) => {
    setEditingAccount(account);
    setAccountForm({
      email: account.email,
      password: '',
      name: account.name,
      role: account.role,
      direktorat: account.direktorat || '',
      subdirektorat: account.subdirektorat || '',
      divisi: account.divisi || ''
    });
    setEditPasswordStrength({ score: 0, label: '', color: '' });
    setIsEditDialogOpen(true);
  };

  // Auto-generate password when add dialog opens
  useEffect(() => {
    if (isAddDialogOpen) {
      const newPassword = generateStrongPassword();
      setAccountForm(prev => ({ ...prev, password: newPassword }));
      setPasswordStrength(checkPasswordStrength(newPassword));
    }
  }, [isAddDialogOpen]);

  const openDeleteDialog = (account: Account) => {
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Admin</Badge>;
      case 'user':
        return <Badge className="bg-green-100 text-green-800 border-green-200">User</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  // Helper untuk tahun terkini - menggunakan availableYears dari context
  const getLatestYear = (dataKey: string): number | null => {
    // Use the most recent year from availableYears
    if (availableYears.length === 0) return null;
    return Math.max(...availableYears);
  };
  const getDirektoratByYear = (year: number): string[] => {
    const data = localStorage.getItem('direktorat');
    if (!data) return [];
    const list = JSON.parse(data) as any[];
    return Array.from(new Set(list.filter((d: any) => d.tahun === year).map((d: any) => String(d.nama)))).sort();
  };
  const getDivisiByYear = (year: number): string[] => {
    const data = localStorage.getItem('divisi');
    if (!data) return [];
    const list = JSON.parse(data) as any[];
    return Array.from(new Set(list.filter((d: any) => d.tahun === year).map((d: any) => String(d.nama)))).sort();
  };
  const latestDirektoratYear = getLatestYear('direktorat');
  const latestDivisiYear = getLatestYear('divisi');
  const direktoratOptions = latestDirektoratYear ? getDirektoratByYear(latestDirektoratYear) : [];
  const divisiOptions = latestDivisiYear ? getDivisiByYear(latestDivisiYear) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      
      <div className={`
        transition-all duration-300 ease-in-out pt-16
        ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                <h1 className="text-3xl font-bold text-gray-900">Kelola Akun</h1>
                <p className="text-gray-600 mt-2">
                  Manajemen akun admin dan user
                </p>
                    </div>
              <div className="flex space-x-2">
                <FormDialog
                  isOpen={isAddDialogOpen}
                  onClose={() => setIsAddDialogOpen(false)}
                  onSubmit={handleAddAccount}
                  title="Tambah Akun Baru"
                  description="Buat akun baru untuk admin atau user"
                  variant="add"
                  submitText="Tambah Akun"
                >
                          <div>
                        <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                          value={accountForm.email}
                          onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                              placeholder="Masukkan email"
                          required
                            />
                          </div>
                          <div>
                        <Label htmlFor="name">Nama Lengkap *</Label>
                            <Input
                          id="name"
                          value={accountForm.name}
                          onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                          placeholder="Masukkan nama lengkap"
                          required
                            />
                          </div>
                          <div>
                        <Label htmlFor="password">Password *</Label>
                        <div className="relative">
                            <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={accountForm.password}
                            onChange={(e) => {
                              const newPassword = e.target.value;
                              setAccountForm({ ...accountForm, password: newPassword });
                              setPasswordStrength(checkPasswordStrength(newPassword));
                            }}
                            placeholder="Password akan dibuat otomatis"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <div className={`text-sm font-medium ${passwordStrength.color}`}>
                              {passwordStrength.label}
                            </div>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`w-2 h-2 rounded-full ${
                                    level <= passwordStrength.score
                                      ? passwordStrength.color.replace('text-', 'bg-')
                                      : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newPassword = generateStrongPassword();
                              setAccountForm({ ...accountForm, password: newPassword });
                              setPasswordStrength(checkPasswordStrength(newPassword));
                            }}
                            className="text-xs"
                          >
                            Generate Password
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="role">Role *</Label>
                        <select
                          id="role"
                          value={accountForm.role}
                          onChange={(e) => setAccountForm({ ...accountForm, role: e.target.value as 'admin' | 'user' | 'superadmin' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="direktorat">Direktorat</Label>
                        <select
                          id="direktorat"
                          value={accountForm.direktorat}
                          onChange={(e) => setAccountForm({ ...accountForm, direktorat: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={direktoratOptions.length === 0}
                        >
                          <option value="">{direktoratOptions.length > 0 ? 'Pilih direktorat' : 'Belum ada data direktorat tahun terkini'}</option>
                          {direktoratOptions.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="subdirektorat">Subdirektorat</Label>
                        <Input
                          id="subdirektorat"
                          value={accountForm.subdirektorat}
                          onChange={(e) => setAccountForm({ ...accountForm, subdirektorat: e.target.value })}
                          placeholder="Masukkan subdirektorat"
                        />
                      </div>
                      <div>
                        <Label htmlFor="divisi">Divisi</Label>
                        <Input
                          id="divisi"
                          value={accountForm.divisi}
                          onChange={(e) => setAccountForm({ ...accountForm, divisi: e.target.value })}
                          placeholder="Masukkan divisi"
                          list="divisi-suggestions"
                        />
                        <datalist id="divisi-suggestions">
                          {divisiOptions.map((d) => (
                            <option key={d} value={d} />
                          ))}
                        </datalist>
                          </div>
                          <div className="flex justify-end space-x-2">
                        <ActionButton
                          onClick={() => setIsAddDialogOpen(false)}
                          variant="outline"
                        >
                          Batal
                        </ActionButton>
                        <ActionButton
                          type="submit"
                          variant="default"
                        >
                          Tambah Akun
                        </ActionButton>
                          </div>
                        </FormDialog>

                <FormDialog
                  isOpen={isPasswordDialogOpen}
                  onClose={() => setIsPasswordDialogOpen(false)}
                  onSubmit={handleChangePassword}
                  title="Edit Password Super Admin"
                  description="Ubah password untuk akun Super Admin"
                  variant="custom"
                  submitText="Ubah Password"
                >
                      <div>
                        <Label htmlFor="currentPassword">Password Saat Ini *</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          placeholder="Masukkan password saat ini"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">Password Baru *</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            placeholder="Masukkan password baru"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                          <div>
                        <Label htmlFor="confirmPassword">Konfirmasi Password Baru *</Label>
                            <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="Konfirmasi password baru"
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                        <ActionButton
                          onClick={() => setIsPasswordDialogOpen(false)}
                          variant="outline"
                        >
                          Batal
                        </ActionButton>
                        <ActionButton
                          type="submit"
                          variant="default"
                        >
                          Ubah Password
                        </ActionButton>
                          </div>
                        </FormDialog>
                  </div>
            </div>
          </div>

          {/* Accounts List */}
          <div id="accounts-list">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Daftar Akun</span>
                </CardTitle>
                <CardDescription>
                  {accounts.length} akun ditemukan
                </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                                              <TableRow>
                        <TableHead>Email</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Direktorat</TableHead>
                      <TableHead>Subdirektorat</TableHead>
                      <TableHead>Divisi</TableHead>
                      <TableHead>Tanggal Dibuat</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {accounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell className="font-medium">{account.email}</TableCell>
                        <TableCell>{account.name}</TableCell>
                        <TableCell>{getRoleBadge(account.role)}</TableCell>
                        <TableCell>{account.direktorat || '-'}</TableCell>
                        <TableCell>{account.subdirektorat || '-'}</TableCell>
                        <TableCell>{account.divisi || '-'}</TableCell>
                        <TableCell>{account.createdAt.toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                              onClick={() => openEditDialog(account)}
                              disabled={account.role === 'superadmin'}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                              onClick={() => openDeleteDialog(account)}
                              disabled={account.role === 'superadmin' || account.id === currentUser?.id}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>

      {/* Edit Account Dialog */}
      <FormDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleEditAccount}
        title="Edit Akun"
        description="Edit informasi akun"
        variant="edit"
        submitText="Update Akun"
      >
            <div>
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                value={accountForm.email}
                onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                placeholder="Masukkan email"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-name">Nama Lengkap *</Label>
              <Input
                id="edit-name"
                value={accountForm.name}
                onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-password">Password</Label>
              <div className="relative">
                <Input
                  id="edit-password"
                  type={showPassword ? "text" : "password"}
                  value={accountForm.password}
                  onChange={(e) => {
                    const newPassword = e.target.value;
                    setAccountForm({ ...accountForm, password: newPassword });
                    setEditPasswordStrength(checkPasswordStrength(newPassword));
                  }}
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <div className={`text-sm font-medium ${editPasswordStrength.color}`}>
                    {editPasswordStrength.label}
                  </div>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= editPasswordStrength.score
                            ? editPasswordStrength.color.replace('text-', 'bg-')
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPassword = generateStrongPassword();
                    setAccountForm({ ...accountForm, password: newPassword });
                    setEditPasswordStrength(checkPasswordStrength(newPassword));
                  }}
                  className="text-xs"
                >
                  Generate Password
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-role">Role *</Label>
              <select
                id="edit-role"
                value={accountForm.role}
                onChange={(e) => setAccountForm({ ...accountForm, role: e.target.value as 'admin' | 'user' | 'superadmin' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <Label htmlFor="edit-direktorat">Direktorat</Label>
              <select
                id="edit-direktorat"
                value={accountForm.direktorat}
                onChange={(e) => setAccountForm({ ...accountForm, direktorat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={direktoratOptions.length === 0}
              >
                <option value="">{direktoratOptions.length > 0 ? 'Pilih direktorat' : 'Belum ada data direktorat tahun terkini'}</option>
                {direktoratOptions.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="edit-subdirektorat">Subdirektorat</Label>
              <Input
                id="edit-subdirektorat"
                value={accountForm.subdirektorat}
                onChange={(e) => setAccountForm({ ...accountForm, subdirektorat: e.target.value })}
                placeholder="Masukkan subdirektorat"
              />
            </div>
            <div>
              <Label htmlFor="edit-divisi">Divisi</Label>
              <Input
                id="edit-divisi"
                value={accountForm.divisi}
                onChange={(e) => setAccountForm({ ...accountForm, divisi: e.target.value })}
                placeholder="Masukkan divisi"
                list="divisi-suggestions"
              />
              <datalist id="divisi-suggestions">
                {divisiOptions.map((d) => (
                  <option key={d} value={d} />
                ))}
              </datalist>
            </div>
            <div className="flex justify-end space-x-2">
              <ActionButton
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditPasswordStrength({ score: 0, label: '', color: '' });
                }}
                variant="outline"
              >
                Batal
              </ActionButton>
              <ActionButton
                type="submit"
                variant="default"
              >
                Update Akun
              </ActionButton>
            </div>
          </FormDialog>

      {/* Delete Account Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Hapus Akun"
        description={`Apakah Anda yakin ingin menghapus akun "${accountToDelete?.email}"? Tindakan ini tidak dapat dibatalkan.`}
        variant="danger"
        confirmText="Hapus"
      />
    </div>
  );
};

export default KelolaAkun; 