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
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Briefcase,
  User,
  MapPin
} from 'lucide-react';

interface Direksi {
  id: number;
  nama: string;
  createdAt: Date;
  isActive: boolean;
}

interface Divisi {
  id: number;
  nama: string;
  createdAt: Date;
  isActive: boolean;
}

const StrukturPerusahaan = () => {
  const { isSidebarOpen } = useSidebar();
  const [direksi, setDireksi] = useState<Direksi[]>([]);
  const [divisi, setDivisi] = useState<Divisi[]>([]);
  
  // Direksi states
  const [isDireksiDialogOpen, setIsDireksiDialogOpen] = useState(false);
  const [editingDireksi, setEditingDireksi] = useState<Direksi | null>(null);
  const [direksiToDelete, setDireksiToDelete] = useState<Direksi | null>(null);
  const [direksiForm, setDireksiForm] = useState({
    nama: ''
  });

  // Divisi states
  const [isDivisiDialogOpen, setIsDivisiDialogOpen] = useState(false);
  const [editingDivisi, setEditingDivisi] = useState<Divisi | null>(null);
  const [divisiToDelete, setDivisiToDelete] = useState<Divisi | null>(null);
  const [divisiForm, setDivisiForm] = useState({
    nama: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const direksiData = localStorage.getItem('direksi');
    const divisiData = localStorage.getItem('divisi');
    
    if (direksiData) {
      const direksiList = JSON.parse(direksiData);
      setDireksi(direksiList.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt || Date.now())
      })));
    }
    
    if (divisiData) {
      const divisiList = JSON.parse(divisiData);
      setDivisi(divisiList.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt || Date.now())
      })));
    }
  }, []);

  // Direksi handlers
  const handleDireksiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!direksiForm.nama) {
      alert('Nama direksi wajib diisi!');
      return;
    }

    if (editingDireksi) {
      // Update existing direksi
      const updatedDireksi: Direksi = {
        ...editingDireksi,
        nama: direksiForm.nama
      };

      const updatedDireksiList = direksi.map(d => 
        d.id === editingDireksi.id ? updatedDireksi : d
      );
      
      setDireksi(updatedDireksiList);
      localStorage.setItem('direksi', JSON.stringify(updatedDireksiList));
      
      setEditingDireksi(null);
      alert('Direksi berhasil diupdate!');
    } else {
      // Add new direksi
      const newDireksi: Direksi = {
        id: Date.now(),
        nama: direksiForm.nama,
        createdAt: new Date(),
        isActive: true
      };

      const updatedDireksiList = [...direksi, newDireksi];
      setDireksi(updatedDireksiList);
      localStorage.setItem('direksi', JSON.stringify(updatedDireksiList));
      
      alert('Direksi berhasil ditambahkan!');
    }

    // Reset form
    setDireksiForm({ nama: '' });
    setIsDireksiDialogOpen(false);
  };

  const handleDeleteDireksi = () => {
    if (!direksiToDelete) return;

    const updatedDireksiList = direksi.filter(d => d.id !== direksiToDelete.id);
    setDireksi(updatedDireksiList);
    localStorage.setItem('direksi', JSON.stringify(updatedDireksiList));
    
    setDireksiToDelete(null);
    alert('Direksi berhasil dihapus!');
  };

  const openEditDireksi = (direksi: Direksi) => {
    setEditingDireksi(direksi);
    setDireksiForm({
      nama: direksi.nama
    });
    setIsDireksiDialogOpen(true);
  };

  const openAddDireksi = () => {
    setEditingDireksi(null);
    setDireksiForm({ nama: '' });
    setIsDireksiDialogOpen(true);
  };

  // Divisi handlers
  const handleDivisiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!divisiForm.nama) {
      alert('Nama divisi wajib diisi!');
      return;
    }

    if (editingDivisi) {
      // Update existing divisi
      const updatedDivisi: Divisi = {
        ...editingDivisi,
        nama: divisiForm.nama
      };

      const updatedDivisiList = divisi.map(d => 
        d.id === editingDivisi.id ? updatedDivisi : d
      );
      
      setDivisi(updatedDivisiList);
      localStorage.setItem('divisi', JSON.stringify(updatedDivisiList));
      
      setEditingDivisi(null);
      alert('Divisi berhasil diupdate!');
    } else {
      // Add new divisi
      const newDivisi: Divisi = {
        id: Date.now(),
        nama: divisiForm.nama,
        createdAt: new Date(),
        isActive: true
      };

      const updatedDivisiList = [...divisi, newDivisi];
      setDivisi(updatedDivisiList);
      localStorage.setItem('divisi', JSON.stringify(updatedDivisiList));
      
      alert('Divisi berhasil ditambahkan!');
    }

    // Reset form
    setDivisiForm({ nama: '' });
    setIsDivisiDialogOpen(false);
  };

  const handleDeleteDivisi = () => {
    if (!divisiToDelete) return;

    const updatedDivisiList = divisi.filter(d => d.id !== divisiToDelete.id);
    setDivisi(updatedDivisiList);
    localStorage.setItem('divisi', JSON.stringify(updatedDivisiList));
    
    setDivisiToDelete(null);
    alert('Divisi berhasil dihapus!');
  };

  const openEditDivisi = (divisi: Divisi) => {
    setEditingDivisi(divisi);
    setDivisiForm({
      nama: divisi.nama
    });
    setIsDivisiDialogOpen(true);
  };

  const openAddDivisi = () => {
    setEditingDivisi(null);
    setDivisiForm({ nama: '' });
    setIsDivisiDialogOpen(true);
  };

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
                <h1 className="text-3xl font-bold text-gray-900">Struktur Perusahaan</h1>
                <p className="text-gray-600 mt-2">
                  Kelola data direksi dan divisi perusahaan
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="direksi" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="direksi" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Direksi</span>
              </TabsTrigger>
              <TabsTrigger value="divisi" className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Divisi</span>
              </TabsTrigger>
            </TabsList>

            {/* Direksi Tab */}
            <TabsContent value="direksi" id="direksi-list">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span>Daftar Direksi</span>
                      </CardTitle>
                      <CardDescription>
                        {direksi.length} direksi ditemukan
                      </CardDescription>
                    </div>
                    <Button onClick={openAddDireksi} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Direksi
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                                     <Table>
                     <TableHeader>
                       <TableRow>
                         <TableHead>No</TableHead>
                         <TableHead>Nama Direksi</TableHead>
                         <TableHead>Tanggal Dibuat</TableHead>
                         <TableHead>Aksi</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {direksi.map((item, index) => (
                         <TableRow key={item.id}>
                           <TableCell>{index + 1}</TableCell>
                           <TableCell className="font-medium">{item.nama}</TableCell>
                           <TableCell>{item.createdAt.toLocaleDateString('id-ID')}</TableCell>
                           <TableCell>
                             <div className="flex space-x-2">
                               <Button 
                                 variant="outline" 
                                 size="sm"
                                 onClick={() => openEditDireksi(item)}
                               >
                                 <Edit className="w-4 h-4" />
                               </Button>
                               <Button 
                                 variant="outline" 
                                 size="sm"
                                 onClick={() => setDireksiToDelete(item)}
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

            {/* Divisi Tab */}
            <TabsContent value="divisi" id="divisi-list">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Briefcase className="w-5 h-5 text-green-600" />
                        <span>Daftar Divisi</span>
                      </CardTitle>
                      <CardDescription>
                        {divisi.length} divisi ditemukan
                      </CardDescription>
                    </div>
                    <Button onClick={openAddDivisi} className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Divisi
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                                     <Table>
                     <TableHeader>
                       <TableRow>
                         <TableHead>No</TableHead>
                         <TableHead>Nama Divisi</TableHead>
                         <TableHead>Tanggal Dibuat</TableHead>
                         <TableHead>Aksi</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {divisi.map((item, index) => (
                         <TableRow key={item.id}>
                           <TableCell>{index + 1}</TableCell>
                           <TableCell className="font-medium">{item.nama}</TableCell>
                           <TableCell>{item.createdAt.toLocaleDateString('id-ID')}</TableCell>
                           <TableCell>
                             <div className="flex space-x-2">
                               <Button 
                                 variant="outline" 
                                 size="sm"
                                 onClick={() => openEditDivisi(item)}
                               >
                                 <Edit className="w-4 h-4" />
                               </Button>
                               <Button 
                                 variant="outline" 
                                 size="sm"
                                 onClick={() => setDivisiToDelete(item)}
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

      {/* Direksi Dialog */}
      <Dialog open={isDireksiDialogOpen} onOpenChange={setIsDireksiDialogOpen}>
        <DialogContent className="max-w-md">
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
               <Label htmlFor="nama">Nama Direksi *</Label>
               <Input
                 id="nama"
                 value={direksiForm.nama}
                 onChange={(e) => setDireksiForm({ ...direksiForm, nama: e.target.value })}
                 placeholder="Masukkan nama direksi"
                 required
               />
             </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDireksiDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingDireksi ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Divisi Dialog */}
      <Dialog open={isDivisiDialogOpen} onOpenChange={setIsDivisiDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingDivisi ? 'Edit Divisi' : 'Tambah Divisi Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingDivisi ? 'Edit data divisi' : 'Tambahkan divisi baru ke struktur perusahaan'}
            </DialogDescription>
          </DialogHeader>
                     <form onSubmit={handleDivisiSubmit} className="space-y-4">
             <div>
               <Label htmlFor="nama">Nama Divisi *</Label>
               <Input
                 id="nama"
                 value={divisiForm.nama}
                 onChange={(e) => setDivisiForm({ ...divisiForm, nama: e.target.value })}
                 placeholder="Masukkan nama divisi"
                 required
               />
             </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDivisiDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                {editingDivisi ? 'Update' : 'Simpan'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Direksi Dialog */}
      <AlertDialog open={!!direksiToDelete} onOpenChange={() => setDireksiToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Direksi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus direksi "{direksiToDelete?.nama}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDireksi}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Divisi Dialog */}
      <AlertDialog open={!!divisiToDelete} onOpenChange={() => setDivisiToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Divisi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus divisi "{divisiToDelete?.nama}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDivisi}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StrukturPerusahaan; 