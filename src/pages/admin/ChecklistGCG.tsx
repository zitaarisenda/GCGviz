import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useChecklist } from '@/contexts/ChecklistContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Plus, Edit, Trash2, ListTodo, Calendar, FileText, CheckCircle, Target, Filter } from 'lucide-react';

interface ChecklistItem {
  id: number;
  aspek: string;
  deskripsi: string;
  tahun?: number;
  status?: 'uploaded' | 'not_uploaded';
  file?: string;
}

const ChecklistGCG = () => {
  const { 
    checklist, 
    getChecklistByYear, 
    addChecklist, 
    editChecklist, 
    deleteChecklist,
    addAspek,
    editAspek,
    deleteAspek,
    initializeYearData
  } = useChecklist();
  const { isSidebarOpen } = useSidebar();
  
  // State untuk tahun
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // State untuk aspek
  const [isAspekDialogOpen, setIsAspekDialogOpen] = useState(false);
  const [editingAspek, setEditingAspek] = useState<{ id: number; nama: string } | null>(null);
  const [aspekForm, setAspekForm] = useState({ nama: '' });
  
  // State untuk checklist item
  const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<ChecklistItem | null>(null);
  const [checklistForm, setChecklistForm] = useState({ aspek: '', deskripsi: '' });
  
  // State untuk filter aspek
  const [selectedAspek, setSelectedAspek] = useState('all');
  
  // Generate tahun dari 2014 sampai sekarang
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = currentYear; year >= 2014; year--) {
      yearsArray.push(year);
    }
    return yearsArray;
  }, []);

  // Initialize year data when year changes
  useEffect(() => {
    initializeYearData(selectedYear);
  }, [selectedYear, initializeYearData]);

  // Filter checklist berdasarkan tahun
  const filteredChecklist = useMemo(() => {
    const yearData = getChecklistByYear(selectedYear);
    return yearData.map(item => ({
      ...item,
      status: 'not_uploaded' as 'uploaded' | 'not_uploaded'
    }));
  }, [getChecklistByYear, selectedYear]);

  // Group checklist berdasarkan aspek
  const groupedChecklist = useMemo(() => {
    const grouped: { [key: string]: ChecklistItem[] } = {};
    filteredChecklist.forEach(item => {
      if (!grouped[item.aspek]) {
        grouped[item.aspek] = [];
      }
      grouped[item.aspek].push(item);
    });
    return grouped;
  }, [filteredChecklist]);

  // Get unique aspects for selected year
  const aspects = useMemo(() => {
    return [...new Set(filteredChecklist.map(item => item.aspek))];
  }, [filteredChecklist]);

  const handleAspekSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aspekForm.nama.trim()) {
      alert('Nama aspek tidak boleh kosong!');
      return;
    }

    // Check if aspek already exists for the selected year (excluding current editing aspek)
    const existingAspek = aspects.find(aspek => 
      aspek.toLowerCase() === aspekForm.nama.toLowerCase() && 
      (!editingAspek || aspek !== editingAspek.nama)
    );
    
    if (existingAspek) {
      alert('Aspek sudah ada untuk tahun ini!');
      return;
    }

    if (editingAspek) {
      // Update existing aspek
      editAspek(editingAspek.nama, aspekForm.nama, selectedYear);
      alert('Aspek berhasil diupdate!');
    } else {
      // Add new aspek
      addAspek(aspekForm.nama, selectedYear);
      alert('Aspek berhasil ditambahkan!');
    }

    setAspekForm({ nama: '' });
    setEditingAspek(null);
    setIsAspekDialogOpen(false);
  };

  const handleChecklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checklistForm.aspek || !checklistForm.deskripsi.trim()) {
      alert('Aspek dan deskripsi wajib diisi!');
      return;
    }

    if (editingChecklist) {
      // Update existing checklist
      editChecklist(editingChecklist.id, checklistForm.aspek, checklistForm.deskripsi, selectedYear);
      alert('Checklist berhasil diupdate!');
    } else {
      // Add new checklist
      addChecklist(checklistForm.aspek, checklistForm.deskripsi, selectedYear);
      alert('Checklist berhasil ditambahkan!');
    }

    setChecklistForm({ aspek: '', deskripsi: '' });
    setEditingChecklist(null);
    setIsChecklistDialogOpen(false);
  };



  const getProgressPercentage = (items: ChecklistItem[]) => {
    const uploaded = items.filter(item => item.status === 'uploaded').length;
    return Math.round((uploaded / items.length) * 100);
  };

  const getAspectIcon = (aspekName: string) => {
    const aspectIcons = {
      'ASPEK I. Komitmen': { icon: Target, color: 'text-red-500' },
      'ASPEK II. Implementasi': { icon: CheckCircle, color: 'text-green-500' },
      'ASPEK III. Pengawasan': { icon: FileText, color: 'text-blue-500' },
      'ASPEK IV. Pelaporan': { icon: ListTodo, color: 'text-purple-500' },
      'ASPEK V. Evaluasi': { icon: Calendar, color: 'text-orange-500' }
    };
    
    return aspectIcons[aspekName] || { icon: Target, color: 'text-gray-500' };
  };

  const handleEditAspek = (aspek: string) => {
    setEditingAspek({ id: Date.now(), nama: aspek });
    setAspekForm({ nama: aspek });
    setIsAspekDialogOpen(true);
  };

  const handleDeleteAspek = (aspek: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus aspek "${aspek}"? Semua checklist dalam aspek ini juga akan dihapus.`)) {
      deleteAspek(aspek, selectedYear);
      alert('Aspek berhasil dihapus!');
    }
  };

  const handleEditChecklist = (item: ChecklistItem) => {
    setEditingChecklist(item);
    setChecklistForm({ aspek: item.aspek, deskripsi: item.deskripsi });
    setIsChecklistDialogOpen(true);
  };

  const handleDeleteChecklist = (item: ChecklistItem) => {
    if (confirm(`Apakah Anda yakin ingin menghapus checklist ini?`)) {
      deleteChecklist(item.id, selectedYear);
      alert('Checklist berhasil dihapus!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />
      
      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-in-out pt-16
        ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Checklist GCG</h1>
            <p className="text-gray-600 mt-2">Manajemen checklist Good Corporate Governance per tahun</p>
          </div>

          {/* Year Selection */}
          <div id="year-selection">
            <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-white to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-blue-900">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Tahun Buku</span>
                </CardTitle>
                <CardDescription>Pilih tahun buku untuk mengelola checklist GCG</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
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

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="aspek" className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Kelola Aspek</span>
              </TabsTrigger>
              <TabsTrigger value="checklist" className="flex items-center space-x-2">
                <ListTodo className="w-4 h-4" />
                <span>Kelola Checklist</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" id="overview-tab">
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Tahun {selectedYear}</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  Menampilkan overview checklist GCG untuk tahun {selectedYear}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aspects.map((aspek) => {
                  const items = groupedChecklist[aspek] || [];
                  const progress = getProgressPercentage(items);
                  
                  return (
                    <Card key={aspek} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg">{aspek}</CardTitle>
                        <CardDescription>
                          {items.length} item checklist
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className="font-medium">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{items.filter(item => item.status === 'uploaded').length} uploaded</span>
                            <span>{items.filter(item => item.status === 'not_uploaded').length} pending</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Aspek Tab */}
            <TabsContent value="aspek" id="aspek-tab">
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900">Kelola Aspek GCG - Tahun {selectedYear}</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Tambah, edit, atau hapus aspek checklist GCG untuk tahun {selectedYear}
                </p>
              </div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Target className="w-5 h-5 text-green-600" />
                        <span>Daftar Aspek</span>
                      </CardTitle>
                      <CardDescription>
                        {aspects.length} aspek ditemukan untuk tahun {selectedYear}
                      </CardDescription>
                    </div>
                    <Dialog open={isAspekDialogOpen} onOpenChange={setIsAspekDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setEditingAspek(null);
                            setAspekForm({ nama: '' });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Aspek
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingAspek ? 'Edit Aspek' : 'Tambah Aspek Baru'} - Tahun {selectedYear}
                          </DialogTitle>
                          <DialogDescription>
                            {editingAspek ? `Edit aspek checklist GCG untuk tahun ${selectedYear}` : `Tambahkan aspek baru untuk checklist GCG tahun ${selectedYear}`}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAspekSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="aspek">Nama Aspek</Label>
                            <Input
                              id="aspek"
                              value={aspekForm.nama}
                              onChange={(e) => setAspekForm({ nama: e.target.value })}
                              placeholder="Contoh: ASPEK I. Komitmen"
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsAspekDialogOpen(false)}>
                              Batal
                            </Button>
                            <Button type="submit">
                              {editingAspek ? 'Update' : 'Simpan'}
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
                        <TableHead>Nama Aspek</TableHead>
                        <TableHead>Jumlah Item</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aspects.map((aspek, index) => (
                        <TableRow key={aspek}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{aspek}</TableCell>
                          <TableCell>{groupedChecklist[aspek]?.length || 0}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditAspek(aspek)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleDeleteAspek(aspek)}
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

            {/* Checklist Tab */}
            <TabsContent value="checklist" id="checklist-tab">
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ListTodo className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-900">Kelola Checklist Item - Tahun {selectedYear}</span>
                </div>
                <p className="text-purple-700 text-sm mt-1">
                  Tambah, edit, atau hapus item checklist GCG untuk tahun {selectedYear}
                </p>
              </div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <ListTodo className="w-5 h-5 text-purple-600" />
                        <span>Daftar Checklist</span>
                      </CardTitle>
                      <CardDescription>
                        {filteredChecklist.length} item checklist ditemukan untuk tahun {selectedYear}
                      </CardDescription>
                    </div>
                    <Dialog open={isChecklistDialogOpen} onOpenChange={setIsChecklistDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            setEditingChecklist(null);
                            setChecklistForm({ aspek: '', deskripsi: '' });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Checklist
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {editingChecklist ? 'Edit Checklist' : 'Tambah Checklist Baru'} - Tahun {selectedYear}
                          </DialogTitle>
                          <DialogDescription>
                            {editingChecklist ? `Edit item checklist GCG untuk tahun ${selectedYear}` : `Tambahkan item baru untuk checklist GCG tahun ${selectedYear}`}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleChecklistSubmit} className="space-y-4">
                          <div>
                            <Label htmlFor="aspek">Aspek</Label>
                            <Select value={checklistForm.aspek} onValueChange={(value) => setChecklistForm({ ...checklistForm, aspek: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih aspek" />
                              </SelectTrigger>
                              <SelectContent>
                                {aspects.map(aspek => (
                                  <SelectItem key={aspek} value={aspek}>
                                    {aspek}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="deskripsi">Deskripsi Checklist</Label>
                            <Textarea
                              id="deskripsi"
                              value={checklistForm.deskripsi}
                              onChange={(e) => setChecklistForm({ ...checklistForm, deskripsi: e.target.value })}
                              placeholder="Masukkan deskripsi checklist"
                              rows={4}
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsChecklistDialogOpen(false)}>
                              Batal
                            </Button>
                            <Button type="submit">
                              {editingChecklist ? 'Update' : 'Simpan'}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Filter Row */}
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Aspek Filter */}
                      <div className="flex-1 min-w-0">
                        <label className="text-sm font-semibold text-gray-700 mb-2 block flex items-center">
                          <Filter className="w-4 h-4 mr-2 text-orange-600" />
                          Filter Aspek - Tahun {selectedYear}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant={selectedAspek === 'all' ? "default" : "outline"}
                            onClick={() => setSelectedAspek('all')}
                            size="sm"
                            className={selectedAspek === 'all' 
                              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                              : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                            }
                          >
                            Semua Aspek
                          </Button>
                          {aspects.map(aspek => {
                            const aspectInfo = getAspectIcon(aspek);
                            const IconComponent = aspectInfo.icon;
                            return (
                              <Button
                                key={aspek}
                                variant={selectedAspek === aspek ? "default" : "outline"}
                                onClick={() => setSelectedAspek(aspek)}
                                size="sm"
                                className={`text-xs flex items-center space-x-2 ${
                                  selectedAspek === aspek 
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <IconComponent className={`w-3 h-3 ${selectedAspek === aspek ? 'text-white' : aspectInfo.color}`} />
                                <span>{aspek.replace('ASPEK ', '').replace('. ', ' - ')}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Table Content */}
                    <div className="mt-4">
                      {selectedAspek === 'all' ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>No</TableHead>
                              <TableHead>Aspek</TableHead>
                              <TableHead>Deskripsi</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredChecklist.map((item, index) => (
                              <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="max-w-xs truncate">{item.aspek}</TableCell>
                                <TableCell className="max-w-md truncate">{item.deskripsi}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    item.status === 'uploaded' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {item.status === 'uploaded' ? 'Uploaded' : 'Pending'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleEditChecklist(item)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => handleDeleteChecklist(item)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>No</TableHead>
                              <TableHead>Deskripsi</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {groupedChecklist[selectedAspek]?.map((item, index) => (
                              <TableRow key={item.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="max-w-md truncate">{item.deskripsi}</TableCell>
                                <TableCell>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    item.status === 'uploaded' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {item.status === 'uploaded' ? 'Uploaded' : 'Pending'}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleEditChecklist(item)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => handleDeleteChecklist(item)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ChecklistGCG; 