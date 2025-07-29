import React, { useState, useMemo } from 'react';
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
import { Plus, Edit, Trash2, ListTodo, Calendar, FileText, CheckCircle } from 'lucide-react';

interface ChecklistItem {
  id: number;
  aspek: string;
  deskripsi: string;
  tahun?: number;
  status?: 'uploaded' | 'not_uploaded';
  file?: string;
}

const ChecklistGCG = () => {
  const { checklist } = useChecklist();
  
  // State untuk tahun
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const [newYear, setNewYear] = useState('');
  
  // State untuk aspek
  const [isAspekDialogOpen, setIsAspekDialogOpen] = useState(false);
  const [editingAspek, setEditingAspek] = useState<{ id: number; nama: string } | null>(null);
  const [aspekForm, setAspekForm] = useState({ nama: '' });
  
  // State untuk checklist item
  const [isChecklistDialogOpen, setIsChecklistDialogOpen] = useState(false);
  const [editingChecklist, setEditingChecklist] = useState<ChecklistItem | null>(null);
  const [checklistForm, setChecklistForm] = useState({ aspek: '', deskripsi: '' });
  
  // Generate tahun dari 2014 sampai sekarang
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = currentYear; year >= 2014; year--) {
      yearsArray.push(year);
    }
    return yearsArray;
  }, []);

  // Filter checklist berdasarkan tahun
  const filteredChecklist = useMemo(() => {
    return checklist.map(item => ({
      ...item,
      tahun: selectedYear,
      status: 'not_uploaded' as 'uploaded' | 'not_uploaded'
    }));
  }, [checklist, selectedYear]);

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

  // Get unique aspects
  const aspects = useMemo(() => {
    return [...new Set(checklist.map(item => item.aspek))];
  }, [checklist]);

  const handleAspekSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement add/edit aspek
    setAspekForm({ nama: '' });
    setEditingAspek(null);
    setIsAspekDialogOpen(false);
  };

  const handleChecklistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement add/edit checklist
    setChecklistForm({ aspek: '', deskripsi: '' });
    setEditingChecklist(null);
    setIsChecklistDialogOpen(false);
  };

  const handleAddYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (newYear && !years.includes(parseInt(newYear))) {
      // TODO: Implement add year
      setNewYear('');
      setIsYearDialogOpen(false);
    }
  };

  const getProgressPercentage = (items: ChecklistItem[]) => {
    const uploaded = items.filter(item => item.status === 'uploaded').length;
    return Math.round((uploaded / items.length) * 100);
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
            <h1 className="text-3xl font-bold text-gray-900">Checklist GCG</h1>
            <p className="text-gray-600 mt-2">Manajemen checklist Good Corporate Governance per tahun</p>
          </div>

          {/* Year Selection */}
          <div id="year-selection">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Pilih Tahun</span>
                    </CardTitle>
                    <CardDescription>
                      Pilih tahun untuk melihat dan mengelola checklist GCG
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Pilih tahun" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Dialog open={isYearDialogOpen} onOpenChange={setIsYearDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Tambah Tahun
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Tambah Tahun Baru</DialogTitle>
                          <DialogDescription>
                            Tambahkan tahun baru untuk checklist GCG
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddYear} className="space-y-4">
                          <div>
                            <Label htmlFor="year">Tahun</Label>
                            <Input
                              id="year"
                              type="number"
                              min="2014"
                              max={new Date().getFullYear() + 1}
                              value={newYear}
                              onChange={(e) => setNewYear(e.target.value)}
                              placeholder="Masukkan tahun (2014-sekarang)"
                              required
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => setIsYearDialogOpen(false)}>
                              Batal
                            </Button>
                            <Button type="submit">
                              Tambah
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
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
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Kelola Aspek GCG</CardTitle>
                      <CardDescription>
                        Tambah, edit, atau hapus aspek checklist GCG
                      </CardDescription>
                    </div>
                    <Dialog open={isAspekDialogOpen} onOpenChange={setIsAspekDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="flex items-center space-x-2"
                          onClick={() => {
                            setEditingAspek(null);
                            setAspekForm({ nama: '' });
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tambah Aspek</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {editingAspek ? 'Edit Aspek' : 'Tambah Aspek Baru'}
                          </DialogTitle>
                          <DialogDescription>
                            {editingAspek ? 'Edit aspek checklist GCG' : 'Tambahkan aspek baru untuk checklist GCG'}
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
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
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
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Kelola Checklist Item</CardTitle>
                      <CardDescription>
                        Tambah, edit, atau hapus item checklist GCG
                      </CardDescription>
                    </div>
                    <Dialog open={isChecklistDialogOpen} onOpenChange={setIsChecklistDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="flex items-center space-x-2"
                          onClick={() => {
                            setEditingChecklist(null);
                            setChecklistForm({ aspek: '', deskripsi: '' });
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tambah Checklist</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {editingChecklist ? 'Edit Checklist' : 'Tambah Checklist Baru'}
                          </DialogTitle>
                          <DialogDescription>
                            {editingChecklist ? 'Edit item checklist GCG' : 'Tambahkan item baru untuk checklist GCG'}
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
                      {filteredChecklist.slice(0, 10).map((item, index) => (
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
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {filteredChecklist.length > 10 && (
                    <div className="mt-4 text-center">
                      <p className="text-gray-600">Menampilkan 10 dari {filteredChecklist.length} item</p>
                    </div>
                  )}
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