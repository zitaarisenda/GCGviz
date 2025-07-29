import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSidebar } from '@/contexts/SidebarContext';
import { Users, Briefcase, Plus, Edit, Trash2, Calendar } from 'lucide-react';

interface Direksi {
  id: number;
  nama: string;
  tahun: number;
  createdAt: Date;
  isActive: boolean;
}

interface Divisi {
  id: number;
  nama: string;
  tahun: number;
  kategori?: string;
  createdAt: Date;
  isActive: boolean;
}

const getAvailableYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = 2014; y <= currentYear + 1; y++) {
    years.push(y);
  }
  return years.reverse(); // agar tahun terbaru di depan
};

const DEFAULT_DIVISI = [
  // Anak Usaha
  { nama: 'Pos Financial', kategori: 'Anak Usaha' },
  { nama: 'Pos Logistik', kategori: 'Anak Usaha' },
  { nama: 'Pos Properti', kategori: 'Anak Usaha' },
  { nama: 'Anak Perusahaan', kategori: 'Anak Usaha' },
  { nama: 'Dapen Pos', kategori: 'Anak Usaha' },
  { nama: 'Dapensi Trio Usaha', kategori: 'Anak Usaha' },
  { nama: 'Dapensi Dwikarya', kategori: 'Anak Usaha' },
  { nama: 'Yayasan Bhakti Pendidikan Pos Indonesia', kategori: 'Anak Usaha' },
  // Divisi Operasional
  { nama: 'Courier', kategori: 'Divisi Operasional' },
  { nama: 'Digital Service', kategori: 'Divisi Operasional' },
  { nama: 'Customer Experience', kategori: 'Divisi Operasional' },
  // Divisi Pendukung
  { nama: 'Legal', kategori: 'Divisi Pendukung' },
  { nama: 'HR', kategori: 'Divisi Pendukung' },
  { nama: 'Finance', kategori: 'Divisi Pendukung' },
  { nama: 'Audit', kategori: 'Divisi Pendukung' },
  { nama: 'Risk Management', kategori: 'Divisi Pendukung' },
];

const StrukturPerusahaan = () => {
  const { isSidebarOpen } = useSidebar();
  const [direksi, setDireksi] = useState<Direksi[]>([]);
  const [divisi, setDivisi] = useState<Divisi[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Direksi states
  const [isDireksiDialogOpen, setIsDireksiDialogOpen] = useState(false);
  const [editingDireksi, setEditingDireksi] = useState<Direksi | null>(null);
  const [direksiToDelete, setDireksiToDelete] = useState<Direksi | null>(null);
  const [direksiForm, setDireksiForm] = useState({ nama: '' });

  // Divisi states
  const [isDivisiDialogOpen, setIsDivisiDialogOpen] = useState(false);
  const [editingDivisi, setEditingDivisi] = useState<Divisi | null>(null);
  const [divisiToDelete, setDivisiToDelete] = useState<Divisi | null>(null);
  const [divisiForm, setDivisiForm] = useState({ nama: '' });

  // Tambahkan state untuk trigger reload data per tahun
  const [reloadFlag, setReloadFlag] = useState(0);

  // Load data dari localStorage setiap kali tahun berubah atau reloadFlag berubah
  useEffect(() => {
    const direksiData = localStorage.getItem('direksi');
    const divisiData = localStorage.getItem('divisi');
    if (direksiData) {
      const direksiList = JSON.parse(direksiData);
      setDireksi(direksiList.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt || Date.now())
      })));
    } else {
      setDireksi([]);
    }
    if (divisiData) {
      const divisiList = JSON.parse(divisiData);
      setDivisi(divisiList.map((d: any) => ({
        ...d,
        createdAt: new Date(d.createdAt || Date.now())
      })));
    } else {
      setDivisi([]);
    }
  }, [selectedYear, reloadFlag]);

  // Direksi handlers
  const handleDireksiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!direksiForm.nama) {
      alert('Nama wajib diisi!');
      return;
    }
    if (editingDireksi) {
      const updatedDireksi: Direksi = {
        ...editingDireksi,
        nama: direksiForm.nama,
        tahun: selectedYear
      };
      const updatedDireksiList = direksi.map(d => d.id === editingDireksi.id ? updatedDireksi : d);
      setDireksi(updatedDireksiList);
      localStorage.setItem('direksi', JSON.stringify(updatedDireksiList));
      setEditingDireksi(null);
      alert('Direksi berhasil diupdate!');
    } else {
      const newDireksi: Direksi = {
        id: Date.now(),
        nama: direksiForm.nama,
        tahun: selectedYear,
        createdAt: new Date(),
        isActive: true
      };
      const updatedDireksiList = [...direksi, newDireksi];
      setDireksi(updatedDireksiList);
      localStorage.setItem('direksi', JSON.stringify(updatedDireksiList));
      alert('Direksi berhasil ditambahkan!');
    }
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
    setDireksiForm({ nama: direksi.nama });
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
      const updatedDivisi: Divisi = {
        ...editingDivisi,
        nama: divisiForm.nama,
        tahun: selectedYear
      };
      const updatedDivisiList = divisi.map(d => d.id === editingDivisi.id ? updatedDivisi : d);
      setDivisi(updatedDivisiList);
      localStorage.setItem('divisi', JSON.stringify(updatedDivisiList));
      setEditingDivisi(null);
      alert('Divisi berhasil diupdate!');
    } else {
      const newDivisi: Divisi = {
        id: Date.now(),
        nama: divisiForm.nama,
        tahun: selectedYear,
        createdAt: new Date(),
        isActive: true
      };
      const updatedDivisiList = [...divisi, newDivisi];
      setDivisi(updatedDivisiList);
      localStorage.setItem('divisi', JSON.stringify(updatedDivisiList));
      alert('Divisi berhasil ditambahkan!');
    }
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
    setDivisiForm({ nama: divisi.nama });
    setIsDivisiDialogOpen(true);
  };
  const openAddDivisi = () => {
    setEditingDivisi(null);
    setDivisiForm({ nama: '' });
    setIsDivisiDialogOpen(true);
  };

  // Filter data by selected year
  const filteredDireksi = direksi.filter(d => d.tahun === selectedYear);
  const filteredDivisi = divisi.filter(d => d.tahun === selectedYear);

  // Handler untuk data default direksi
  const getAllUniqueDireksiNames = () => {
    const direksiData = localStorage.getItem('direksi');
    if (!direksiData) return [];
    const direksiList = JSON.parse(direksiData);
    const namesSet = new Set<string>();
    direksiList.forEach((d: any) => {
      if (d.nama && typeof d.nama === 'string') {
        namesSet.add(d.nama.trim());
      }
    });
    return Array.from(namesSet);
  };

  const handleUseDefaultDireksi = () => {
    const direksiData = localStorage.getItem('direksi');
    const direksiList = direksiData ? JSON.parse(direksiData) : [];
    const uniqueNames = getAllUniqueDireksiNames();
    if (uniqueNames.length === 0) {
      alert('Belum ada data nama direksi yang pernah diinput. Silakan input manual terlebih dahulu.');
      return;
    }
    const newDireksi = uniqueNames.map((nama) => ({
      id: Date.now() + Math.random(),
      nama,
      tahun: selectedYear,
      createdAt: new Date(),
      isActive: true
    }));
    const updatedDireksiList = [...direksiList, ...newDireksi];
    localStorage.setItem('direksi', JSON.stringify(updatedDireksiList));
    setReloadFlag(f => f + 1);
  };

  // Handler untuk data default divisi
  const handleUseDefaultDivisi = () => {
    const divisiData = localStorage.getItem('divisi');
    const divisiList = divisiData ? JSON.parse(divisiData) : [];
    const newDivisi = DEFAULT_DIVISI.map((item) => ({
      id: Date.now() + Math.random(),
      nama: item.nama,
      tahun: selectedYear,
      kategori: item.kategori,
      createdAt: new Date(),
      isActive: true
    }));
    const updatedDivisiList = [...divisiList, ...newDivisi];
    localStorage.setItem('divisi', JSON.stringify(updatedDivisiList));
    setReloadFlag(f => f + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      <div className={`transition-all duration-300 ease-in-out pt-16 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>  
        <div className="p-6">
          {/* Panel Tahun Buku */}
          <div className="mb-8" id="year-selector">
            <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-white to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-blue-900">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Tahun Buku</span>
                </CardTitle>
                <CardDescription>Pilih tahun buku untuk mengelola struktur perusahaan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getAvailableYears().map((year) => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? 'default' : 'outline'}
                      className={selectedYear === year ? 'bg-blue-600 text-white' : ''}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                        {filteredDireksi.length} direksi ditemukan untuk tahun {selectedYear}
                      </CardDescription>
                    </div>
                    <Button onClick={openAddDireksi} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Direksi
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredDireksi.length === 0 && (
                    <div className="mb-4 flex justify-end">
                      <Button onClick={handleUseDefaultDireksi} className="bg-orange-600 hover:bg-orange-700 mr-2">
                        Gunakan Data Default Direksi
                      </Button>
                    </div>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDireksi.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.nama}</TableCell>
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
                        {filteredDivisi.length} divisi ditemukan untuk tahun {selectedYear}
                      </CardDescription>
                    </div>
                    <Button onClick={openAddDivisi} className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Divisi
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredDivisi.length === 0 && (
                    <div className="mb-4 flex justify-end">
                      <Button onClick={handleUseDefaultDivisi} className="bg-orange-600 hover:bg-orange-700">
                        Gunakan Data Default Divisi
                      </Button>
                    </div>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Divisi</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDivisi.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{item.nama}</TableCell>
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