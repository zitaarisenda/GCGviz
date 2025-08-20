import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tag, Plus, Edit, Trash2, RotateCcw } from 'lucide-react';
import { ActionButton } from '@/components/panels';

interface KlasifikasiItem {
  id: number;
  nama: string;
  tipe: 'prinsip' | 'jenis' | 'kategori';
  createdAt: Date;
  isActive: boolean;
}

interface KlasifikasiTabProps {
  klasifikasiData: KlasifikasiItem[];
  editingKlasifikasi: KlasifikasiItem | null;
  klasifikasiForm: { nama: string; tipe: 'prinsip' | 'jenis' | 'kategori' };
  setKlasifikasiForm: (form: { nama: string; tipe: 'prinsip' | 'jenis' | 'kategori' }) => void;
  onAddKlasifikasi: () => void;
  onEditKlasifikasi: (item: KlasifikasiItem) => void;
  onUpdateKlasifikasi: (id: number, data: { nama: string; tipe: 'prinsip' | 'jenis' | 'kategori' }) => void;
  onDeleteKlasifikasi: (id: number) => void;
  onResetKlasifikasi: () => void;
}

const KlasifikasiTab: React.FC<KlasifikasiTabProps> = ({
  klasifikasiData,
  editingKlasifikasi,
  klasifikasiForm,
  setKlasifikasiForm,
  onAddKlasifikasi,
  onEditKlasifikasi,
  onUpdateKlasifikasi,
  onDeleteKlasifikasi,
  onResetKlasifikasi
}) => {
  const getTipeColor = (tipe: string) => {
    switch (tipe) {
      case 'prinsip':
        return 'bg-blue-100 text-blue-800';
      case 'jenis':
        return 'bg-green-100 text-green-800';
      case 'kategori':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipeLabel = (tipe: string) => {
    switch (tipe) {
      case 'prinsip':
        return 'Prinsip';
      case 'jenis':
        return 'Jenis';
      case 'kategori':
        return 'Kategori';
      default:
        return tipe;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!klasifikasiForm.nama.trim()) {
      alert('Nama klasifikasi tidak boleh kosong!');
      return;
    }

    if (editingKlasifikasi) {
      onUpdateKlasifikasi(editingKlasifikasi.id, klasifikasiForm);
    } else {
      onAddKlasifikasi();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Tag className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-indigo-900">Kelola Klasifikasi GCG</span>
        </div>
        <p className="text-indigo-700 text-sm mt-1">
          Tambah, edit, atau hapus klasifikasi untuk prinsip, jenis, dan kategori dokumen GCG
        </p>
      </div>

      {/* Klasifikasi Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-indigo-600" />
            <span>{editingKlasifikasi ? 'Edit Klasifikasi' : 'Tambah Klasifikasi Baru'}</span>
          </CardTitle>
          <CardDescription>
            {editingKlasifikasi 
              ? `Edit klasifikasi "${editingKlasifikasi.nama}"`
              : 'Buat klasifikasi baru untuk sistem GCG'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nama">Nama Klasifikasi</Label>
                <Input
                  id="nama"
                  value={klasifikasiForm.nama}
                  onChange={(e) => setKlasifikasiForm({ ...klasifikasiForm, nama: e.target.value })}
                  placeholder="Masukkan nama klasifikasi"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tipe">Tipe Klasifikasi</Label>
                <Select
                  value={klasifikasiForm.tipe}
                  onValueChange={(value: 'prinsip' | 'jenis' | 'kategori') => 
                    setKlasifikasiForm({ ...klasifikasiForm, tipe: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe klasifikasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prinsip">Prinsip</SelectItem>
                    <SelectItem value="jenis">Jenis</SelectItem>
                    <SelectItem value="kategori">Kategori</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              {editingKlasifikasi && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setKlasifikasiForm({ nama: '', tipe: 'prinsip' });
                    // Reset editing state
                  }}
                >
                  Batal
                </Button>
              )}
              <Button type="submit" variant="default">
                {editingKlasifikasi ? 'Update Klasifikasi' : 'Tambah Klasifikasi'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Klasifikasi Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-indigo-600" />
                <span>Daftar Klasifikasi</span>
              </CardTitle>
              <CardDescription>
                {klasifikasiData.length} klasifikasi tersedia dalam sistem
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={onResetKlasifikasi}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset ke Default
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Klasifikasi</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {klasifikasiData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>
                    <Badge className={getTipeColor(item.tipe)}>
                      {getTipeLabel(item.tipe)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? "default" : "secondary"}>
                      {item.isActive ? "Aktif" : "Tidak Aktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditKlasifikasi(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => onDeleteKlasifikasi(item.id)}
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

      {/* Empty State */}
      {klasifikasiData.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada klasifikasi</h3>
          <p className="text-gray-500">
            Mulai dengan menambahkan klasifikasi pertama ke sistem
          </p>
        </div>
      )}
    </div>
  );
};

export default KlasifikasiTab;
