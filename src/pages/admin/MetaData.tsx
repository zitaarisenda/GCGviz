import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSidebar } from '@/contexts/SidebarContext';
import { useChecklist } from '@/contexts/ChecklistContext';
import { Plus, Calendar, Trash2 } from 'lucide-react';

const MetaData = () => {
  const { isSidebarOpen } = useSidebar();
  const { initializeYearData } = useChecklist();
  
  // State untuk tahun
  const [isYearDialogOpen, setIsYearDialogOpen] = useState(false);
  const [newYear, setNewYear] = useState('');
  
  // Generate tahun dari 2014 sampai sekarang
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = currentYear; year >= 2014; year--) {
      yearsArray.push(year);
    }
    return yearsArray;
  }, []);

  const handleAddYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (newYear && !years.includes(parseInt(newYear))) {
      const year = parseInt(newYear);
      initializeYearData(year);
      alert(`Tahun ${year} berhasil ditambahkan dengan data default!`);
      setNewYear('');
      setIsYearDialogOpen(false);
    } else if (years.includes(parseInt(newYear))) {
      alert('Tahun sudah ada dalam sistem!');
    }
  };

  const handleDeleteYear = (year: number) => {
    // TODO: Implement delete year
    console.log('Delete year:', year);
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

          {/* Tahun Panel */}
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
        </div>
      </div>
    </div>
  );
};

export default MetaData; 