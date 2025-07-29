import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import { useDireksi } from '@/contexts/DireksiContext';
import { Plus, Edit, Trash2, UserCog, Building2 } from 'lucide-react';

const KelolaAkun = () => {
  const { user } = useUser();
  const { direksi, addDireksi, editDireksi, deleteDireksi } = useDireksi();
  
  // State untuk form direksi
  const [isDireksiDialogOpen, setIsDireksiDialogOpen] = useState(false);
  const [editingDireksi, setEditingDireksi] = useState<{ id: number; nama: string } | null>(null);
  const [direksiForm, setDireksiForm] = useState({ nama: '' });

  // State untuk form Super Admin
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ username: '', password: '', name: '' });

  const handleDireksiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDireksi) {
      editDireksi(editingDireksi.id, direksiForm.nama);
    } else {
      addDireksi(direksiForm.nama);
    }
    setDireksiForm({ nama: '' });
    setEditingDireksi(null);
    setIsDireksiDialogOpen(false);
  };

  const handleEditDireksi = (direksi: { id: number; nama: string }) => {
    setEditingDireksi(direksi);
    setDireksiForm({ nama: direksi.nama });
    setIsDireksiDialogOpen(true);
  };

  const handleDeleteDireksi = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus direksi ini?')) {
      deleteDireksi(id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      
      {/* Main Content */}
      <div className="ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Kelola Akun</h1>
            <p className="text-gray-600 mt-2">Manajemen akun Super Admin dan struktur perusahaan</p>
          </div>

          <Tabs defaultValue="superadmin" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="superadmin" className="flex items-center space-x-2">
                <UserCog className="w-4 h-4" />
                <span>Super Admin</span>
              </TabsTrigger>
              <TabsTrigger value="direksi" className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>Struktur Perusahaan</span>
              </TabsTrigger>
            </TabsList>

            {/* Super Admin Tab */}
            <TabsContent value="superadmin" id="superadmin-tab">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Manajemen Akun Super Admin</CardTitle>
                      <CardDescription>
                        Kelola akun Super Admin yang dapat mengakses fitur admin panel
                      </CardDescription>
                    </div>
                    <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Tambah Super Admin</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Tambah Super Admin Baru</DialogTitle>
                          <DialogDescription>
                            Buat akun Super Admin baru untuk mengelola sistem
                          </DialogDescription>
                        </DialogHeader>
                        <form className="space-y-4">
                          <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              value={adminForm.username}
                              onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                              placeholder="Masukkan username"
                            />
                          </div>
                          <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              value={adminForm.password}
                              onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                              placeholder="Masukkan password"
                            />
                          </div>
                          <div>
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                              id="name"
                              value={adminForm.name}
                              onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                              placeholder="Masukkan nama lengkap"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsAdminDialogOpen(false)}>
                              Batal
                            </Button>
                            <Button type="submit">
                              Simpan
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Username</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{user?.username}</TableCell>
                        <TableCell>{user?.name}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {user?.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Direksi Tab */}
            <TabsContent value="direksi" id="direksi-tab">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Pengaturan Struktur Perusahaan</CardTitle>
                      <CardDescription>
                        Kelola data direksi dan struktur organisasi perusahaan
                      </CardDescription>
                    </div>
                    <Dialog open={isDireksiDialogOpen} onOpenChange={setIsDireksiDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="flex items-center space-x-2"
                          onClick={() => {
                            setEditingDireksi(null);
                            setDireksiForm({ nama: '' });
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tambah Direksi</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingDireksi ? 'Edit Direksi' : 'Tambah Direksi Baru'}
                          </DialogTitle>
                          <DialogDescription>
                            {editingDireksi ? 'Edit data direksi' : 'Tambahkan direksi baru ke struktur perusahaan'}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleDireksiSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="nama">Nama Direksi</Label>
                            <Input
                              id="nama"
                              value={direksiForm.nama}
                              onChange={(e) => setDireksiForm({ nama: e.target.value })}
                              placeholder="Masukkan nama direksi"
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsDireksiDialogOpen(false)}
                            >
                              Batal
                            </Button>
                            <Button type="submit">
                              {editingDireksi ? 'Update' : 'Simpan'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Direksi</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {direksi.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.nama}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditDireksi(item)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDeleteDireksi(item.id)}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default KelolaAkun; 