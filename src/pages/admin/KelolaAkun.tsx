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
import { ConfirmDialog, ActionButton, IconButton } from '@/components/panels';
import AddAccountDialog from '@/components/dialogs/AddAccountDialog';
import EditAccountDialog from '@/components/dialogs/EditAccountDialog';
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
  Lock
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);



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

  const handleAddAccount = async (accountData: any) => {
    setIsAddingAccount(true);
    
    try {
      // Check if email already exists
      const existingUser = accounts.find(account => account.email === accountData.email);
      if (existingUser) {
        alert('Email sudah terdaftar. Gunakan email yang berbeda.');
        return;
      }

      // Create new account
      const newAccount: Account = {
        id: Date.now(),
        email: accountData.email,
        name: accountData.name,
        role: accountData.role,
        direktorat: accountData.direktorat,
        subdirektorat: accountData.subdirektorat,
        divisi: accountData.divisi,
        createdAt: new Date(),
        isActive: true
      };

      // Add to accounts list
      const updatedAccounts = [...accounts, newAccount];
      setAccounts(updatedAccounts);

      // Save to localStorage
      const usersData = localStorage.getItem('users') || '[]';
      const users = JSON.parse(usersData);
      users.push({
        id: newAccount.id,
        email: newAccount.email,
        password: accountData.password, // In real app, this should be hashed
        name: newAccount.name,
        role: newAccount.role,
        direktorat: newAccount.direktorat,
        subdirektorat: newAccount.subdirektorat,
        divisi: newAccount.divisi,
        createdAt: newAccount.createdAt.toISOString(),
        isActive: newAccount.isActive
      });
      localStorage.setItem('users', JSON.stringify(users));

      // Close dialog
      setIsAddDialogOpen(false);
      alert('Akun berhasil ditambahkan!');
    } catch (error) {
      alert('Terjadi kesalahan saat menambahkan akun.');
    } finally {
      setIsAddingAccount(false);
    }
  };

  const handleEditAccount = async (accountData: any) => {
    setIsEditingAccount(true);
    
    try {
      // Check if email already exists (excluding current account)
      const existingUser = accounts.find(account => 
        account.email === accountData.email && account.id !== accountData.id
      );
      if (existingUser) {
        alert('Email sudah terdaftar. Gunakan email yang berbeda.');
        return;
      }

      // Update account
      const updatedAccount: Account = {
        ...editingAccount!,
        email: accountData.email,
        name: accountData.name,
        role: accountData.role,
        direktorat: accountData.direktorat,
        subdirektorat: accountData.subdirektorat,
        divisi: accountData.divisi
      };

      // Update accounts list
      const updatedAccounts = accounts.map(acc => 
        acc.id === accountData.id ? updatedAccount : acc
      );
      setAccounts(updatedAccounts);

      // Update localStorage
      const usersData = localStorage.getItem('users') || '[]';
      const users = JSON.parse(usersData);
      const userIndex = users.findIndex((u: any) => u.id === accountData.id);
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          email: accountData.email,
          name: accountData.name,
          role: accountData.role,
          direktorat: accountData.direktorat,
          subdirektorat: accountData.subdirektorat,
          divisi: accountData.divisi,
          // Only update password if provided
          ...(accountData.password && { password: accountData.password })
        };
        localStorage.setItem('users', JSON.stringify(users));
      }

      // Close dialog
      setIsEditDialogOpen(false);
      setEditingAccount(null);
      alert('Akun berhasil diupdate!');
    } catch (error) {
      alert('Terjadi kesalahan saat mengupdate akun.');
    } finally {
      setIsEditingAccount(false);
    }
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





  const openEditDialog = (account: Account) => {
    setEditingAccount(account);
    setIsEditDialogOpen(true);
  };

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
                      <Button
                        onClick={() => setIsAddDialogOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Akun
                      </Button>
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
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openDeleteDialog(account)}
                                disabled={account.role === 'superadmin' || account.id === currentUser?.id}
                                className="text-red-600 hover:text-red-700"
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

      {/* Add Account Dialog */}
      <AddAccountDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddAccount={handleAddAccount}
        isLoading={isAddingAccount}
      />

      {/* Edit Account Dialog */}
      <EditAccountDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setEditingAccount(null);
        }}
        onEditAccount={handleEditAccount}
        account={editingAccount}
        isLoading={isEditingAccount}
      />
    </div>
  );
};

export default KelolaAkun; 