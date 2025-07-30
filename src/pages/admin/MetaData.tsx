import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSidebar } from '@/contexts/SidebarContext';
import { useChecklist } from '@/contexts/ChecklistContext';
import { useYear } from '@/contexts/YearContext';
import { useKlasifikasi } from '@/contexts/KlasifikasiContext';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import { Plus, Calendar, Trash2, Edit, Target, FileText, Tag } from 'lucide-react';

// Import interface from context
interface KlasifikasiItem {
  id: number;
  nama: string;
  tipe: 'prinsip' | 'jenis' | 'kategori';
  createdAt: Date;
  isActive: boolean;
}

const MetaData = () => {
  const { isSidebarOpen } = useSidebar();
  const { initializeYearData } = useChecklist();
  const { availableYears, addYear, removeYear } = useYear();
  const { klasifikasiData, addKlasifikasi, updateKlasifikasi, deleteKlasifikasi } = useKlasifikasi();
  const { refreshDocuments } = useDocumentMetadata();
  
  // State untuk tahun
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const [newYear, setNewYear] = useState('');
  
  // State untuk klasifikasi
  const [isKlasifikasiDialogOpen, setIsKlasifikasiDialogOpen] = useState(false);
  const [editingKlasifikasi, setEditingKlasifikasi] = useState<KlasifikasiItem | null>(null);
  const [klasifikasiForm, setKlasifikasiForm] = useState({ nama: '', tipe: 'prinsip' as 'prinsip' | 'jenis' | 'kategori' });
  
  // Use years from global context
  const years = availableYears || [];

  const handleAddYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (newYear && !years.includes(parseInt(newYear))) {
      const year = parseInt(newYear);
      initializeYearData(year);
      addYear(year);
      alert(`Tahun ${year} berhasil ditambahkan dengan data default!`);
      setNewYear('');
      setIsYearDialogOpen(false);
    } else if (years.includes(parseInt(newYear))) {
      alert('Tahun sudah ada dalam sistem!');
    }
  };

  const resetKlasifikasiToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua klasifikasi ke data default? Data yang sudah ditambahkan manual akan hilang.')) {
      localStorage.removeItem('klasifikasiGCG');
      window.location.reload();
      alert('Klasifikasi berhasil dikembalikan ke data default!');
    }
  };

  const handleDeleteYear = (year: number) => {
    if (confirm(`Apakah Anda yakin ingin menghapus tahun ${year}?`)) {
      removeYear(year);
      alert(`Tahun ${year} berhasil dihapus!`);
    }
  };

  const handleKlasifikasiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!klasifikasiForm.nama.trim()) {
      alert('Nama klasifikasi tidak boleh kosong!');
      return;
    }

    const existingKlasifikasi = klasifikasiData.find(item => 
      item.nama.toLowerCase() === klasifikasiForm.nama.toLowerCase() && 
      item.tipe === klasifikasiForm.tipe &&
      (!editingKlasifikasi || item.id !== editingKlasifikasi.id)
    );
    
    if (existingKlasifikasi) {
      alert(`${klasifikasiForm.tipe === 'prinsip' ? 'Prinsip' : klasifikasiForm.tipe === 'jenis' ? 'Jenis' : 'Kategori'} sudah ada!`);
      return;
    }

    if (editingKlasifikasi) {
      updateKlasifikasi(editingKlasifikasi.id, {
        nama: klasifikasiForm.nama,
        tipe: klasifikasiForm.tipe
      });
      
      // Update documents that use this klasifikasi
      updateDocumentsWithKlasifikasi(editingKlasifikasi.nama, klasifikasiForm.nama, editingKlasifikasi.tipe);
      
      alert(`${klasifikasiForm.tipe === 'prinsip' ? 'Prinsip' : klasifikasiForm.tipe === 'jenis' ? 'Jenis' : 'Kategori'} berhasil diupdate!`);
    } else {
      addKlasifikasi({
        nama: klasifikasiForm.nama,
        tipe: klasifikasiForm.tipe,
        isActive: true
      });
      alert(`${klasifikasiForm.tipe === 'prinsip' ? 'Prinsip' : klasifikasiForm.tipe === 'jenis' ? 'Jenis' : 'Kategori'} berhasil ditambahkan!`);
    }

    setKlasifikasiForm({ nama: '', tipe: 'prinsip' });
    setEditingKlasifikasi(null);
    setIsKlasifikasiDialogOpen(false);
  };

  const handleEditKlasifikasi = (item: KlasifikasiItem) => {
    setEditingKlasifikasi(item);
    setKlasifikasiForm({ nama: item.nama, tipe: item.tipe });
    setIsKlasifikasiDialogOpen(true);
  };

  const handleDeleteKlasifikasi = (item: KlasifikasiItem) => {
    if (confirm(`Apakah Anda yakin ingin menghapus ${item.tipe === 'prinsip' ? 'prinsip' : item.tipe === 'jenis' ? 'jenis' : 'kategori'} "${item.nama}"?`)) {
      deleteKlasifikasi(item.id);
      alert(`${item.tipe === 'prinsip' ? 'Prinsip' : item.tipe === 'jenis' ? 'Jenis' : 'Kategori'} berhasil dihapus!`);
    }
  };

  const getKlasifikasiByType = (tipe: 'prinsip' | 'jenis' | 'kategori') => {
    return (klasifikasiData || []).filter(item => item.tipe === tipe && item.isActive);
  };

  // Function to update documents when klasifikasi is edited
  const updateDocumentsWithKlasifikasi = (oldName: string, newName: string, tipe: string) => {
    const documents = JSON.parse(localStorage.getItem('documentMetadata') || '[]');
    const updatedDocuments = documents.map((doc: any) => {
      if (tipe === 'prinsip' && doc.gcgPrinciple === oldName) {
        return { ...doc, gcgPrinciple: newName };
      }
      if (tipe === 'jenis' && doc.documentType === oldName) {
        return { ...doc, documentType: newName };
      }
      if (tipe === 'kategori' && doc.documentCategory === oldName) {
        return { ...doc, documentCategory: newName };
      }
      return doc;
    });
    localStorage.setItem('documentMetadata', JSON.stringify(updatedDocuments));
    refreshDocuments(); // Refresh the context to reflect changes
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
                <h1 className="text-3xl font-bold text-gray-900">Meta Data</h1>
                <p className="text-gray-600 mt-2">
                  Kelola metadata sistem
                </p>
              </div>
            </div>
          </div>

          {/* Tabs untuk Tahun dan Klasifikasi */}
          <Tabs defaultValue="tahun" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tahun" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Kelola Tahun</span>
              </TabsTrigger>
              <TabsTrigger value="klasifikasi" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span>Klasifikasi GCG</span>
              </TabsTrigger>
            </TabsList>

            {/* Tahun Tab */}
            <TabsContent value="tahun">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Kelola Tahun</span>
                  </CardTitle>
                  <CardDescription>
                    Tambah atau hapus tahun untuk sistem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600">
                      {years.length} tahun tersedia
                    </div>
                    <Dialog open={isYearDialogOpen} onOpenChange={setIsYearDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Tahun
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Tambah Tahun Baru</DialogTitle>
                          <DialogDescription>
                            Tambahkan tahun baru untuk sistem
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddYear} className="space-y-4">
                          <div>
                            <Label htmlFor="year">Tahun *</Label>
                            <Input
                              id="year"
                              type="number"
                              value={newYear}
                              onChange={(e) => setNewYear(e.target.value)}
                              placeholder="Masukkan tahun (contoh: 2025)"
                              min="2014"
                              max="2100"
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsYearDialogOpen(false)}>
                              Batal
                            </Button>
                            <Button type="submit">
                              Tambah Tahun
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tahun</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {years.map((year) => (
                        <TableRow key={year}>
                          <TableCell className="font-medium">{year}</TableCell>
                          <TableCell>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Aktif
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteYear(year)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Klasifikasi Tab */}
            <TabsContent value="klasifikasi">
              <div className="space-y-6">
                {/* Header dengan tombol reset */}
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Klasifikasi GCG</h3>
                    <p className="text-sm text-gray-600">Kelola prinsip, jenis, dan kategori dokumen</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={resetKlasifikasiToDefault}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Reset Semua ke Default
                  </Button>
                </div>

                {/* Prinsip GCG */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Target className="w-5 h-5 text-red-600" />
                          <span>Prinsip GCG</span>
                        </CardTitle>
                        <CardDescription>
                          Kelola prinsip Good Corporate Governance
                        </CardDescription>
                      </div>
                      <Dialog open={isKlasifikasiDialogOpen} onOpenChange={setIsKlasifikasiDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                              setEditingKlasifikasi(null);
                              setKlasifikasiForm({ nama: '', tipe: 'prinsip' });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Prinsip
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {editingKlasifikasi ? 'Edit Prinsip' : 'Tambah Prinsip Baru'}
                            </DialogTitle>
                            <DialogDescription>
                              {editingKlasifikasi ? 'Edit prinsip GCG' : 'Tambahkan prinsip baru untuk GCG'}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleKlasifikasiSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="nama">Nama Prinsip</Label>
                              <Input
                                id="nama"
                                value={klasifikasiForm.nama}
                                onChange={(e) => setKlasifikasiForm({ ...klasifikasiForm, nama: e.target.value })}
                                placeholder="Contoh: Transparansi"
                                required
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button type="button" variant="outline" onClick={() => setIsKlasifikasiDialogOpen(false)}>
                                Batal
                              </Button>
                              <Button type="submit">
                                {editingKlasifikasi ? 'Update' : 'Simpan'}
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
                          <TableHead>Nama Prinsip</TableHead>
                          <TableHead>Tanggal Dibuat</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getKlasifikasiByType('prinsip').map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{item.nama}</TableCell>
                            <TableCell>{new Date(item.createdAt).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditKlasifikasi(item)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleDeleteKlasifikasi(item)}
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

                {/* Jenis Dokumen */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span>Jenis Dokumen</span>
                        </CardTitle>
                        <CardDescription>
                          Kelola jenis-jenis dokumen
                        </CardDescription>
                      </div>
                      <Dialog open={isKlasifikasiDialogOpen} onOpenChange={setIsKlasifikasiDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              setEditingKlasifikasi(null);
                              setKlasifikasiForm({ nama: '', tipe: 'jenis' });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Jenis
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {editingKlasifikasi ? 'Edit Jenis' : 'Tambah Jenis Baru'}
                            </DialogTitle>
                            <DialogDescription>
                              {editingKlasifikasi ? 'Edit jenis dokumen' : 'Tambahkan jenis dokumen baru'}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleKlasifikasiSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="nama">Nama Jenis</Label>
                              <Input
                                id="nama"
                                value={klasifikasiForm.nama}
                                onChange={(e) => setKlasifikasiForm({ ...klasifikasiForm, nama: e.target.value })}
                                placeholder="Contoh: Kebijakan"
                                required
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button type="button" variant="outline" onClick={() => setIsKlasifikasiDialogOpen(false)}>
                                Batal
                              </Button>
                              <Button type="submit">
                                {editingKlasifikasi ? 'Update' : 'Simpan'}
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
                          <TableHead>Nama Jenis</TableHead>
                          <TableHead>Tanggal Dibuat</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getKlasifikasiByType('jenis').map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{item.nama}</TableCell>
                            <TableCell>{new Date(item.createdAt).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditKlasifikasi(item)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleDeleteKlasifikasi(item)}
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

                {/* Kategori Dokumen */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Tag className="w-5 h-5 text-green-600" />
                          <span>Kategori Dokumen</span>
                        </CardTitle>
                        <CardDescription>
                          Kelola kategori-kategori dokumen
                        </CardDescription>
                      </div>
                      <Dialog open={isKlasifikasiDialogOpen} onOpenChange={setIsKlasifikasiDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setEditingKlasifikasi(null);
                              setKlasifikasiForm({ nama: '', tipe: 'kategori' });
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Kategori
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {editingKlasifikasi ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                            </DialogTitle>
                            <DialogDescription>
                              {editingKlasifikasi ? 'Edit kategori dokumen' : 'Tambahkan kategori dokumen baru'}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleKlasifikasiSubmit} className="space-y-4">
                            <div>
                              <Label htmlFor="nama">Nama Kategori</Label>
                              <Input
                                id="nama"
                                value={klasifikasiForm.nama}
                                onChange={(e) => setKlasifikasiForm({ ...klasifikasiForm, nama: e.target.value })}
                                placeholder="Contoh: Kategori Umum"
                                required
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button type="button" variant="outline" onClick={() => setIsKlasifikasiDialogOpen(false)}>
                                Batal
                              </Button>
                              <Button type="submit">
                                {editingKlasifikasi ? 'Update' : 'Simpan'}
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
                          <TableHead>Nama Kategori</TableHead>
                          <TableHead>Tanggal Dibuat</TableHead>
                          <TableHead>Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getKlasifikasiByType('kategori').map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="font-medium">{item.nama}</TableCell>
                            <TableCell>{new Date(item.createdAt).toLocaleDateString('id-ID')}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditKlasifikasi(item)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => handleDeleteKlasifikasi(item)}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MetaData; 