import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Building2, Edit, Trash2, Plus } from 'lucide-react';
import { ActionButton } from '@/components/panels';

interface Divisi {
  id: number;
  nama: string;
  tahun: number;
  kategori?: string;
  createdAt: Date;
  isActive: boolean;
}

interface DivisiTabProps {
  selectedYear: number;
  divisi: Divisi[];
  onAddDivisi: () => void;
  onEditDivisi: (divisi: Divisi) => void;
  onDeleteDivisi: (divisi: Divisi) => void;
}

const DivisiTab: React.FC<DivisiTabProps> = ({
  selectedYear,
  divisi,
  onAddDivisi,
  onEditDivisi,
  onDeleteDivisi
}) => {
  const filteredDivisi = divisi.filter(d => d.tahun === selectedYear);

  const getKategoriColor = (kategori: string) => {
    switch (kategori) {
      case 'Anak Perusahaan':
        return 'bg-blue-100 text-blue-800';
      case 'Divisi Operasional':
        return 'bg-green-100 text-green-800';
      case 'Divisi Pendukung':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-900">Kelola Divisi - Tahun {selectedYear}</span>
        </div>
        <p className="text-purple-700 text-sm mt-1">
          Tambah, edit, atau hapus divisi untuk tahun {selectedYear}
        </p>
      </div>

      {/* Divisi Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                <span>Daftar Divisi</span>
              </CardTitle>
              <CardDescription>
                {filteredDivisi.length} divisi ditemukan untuk tahun {selectedYear}
              </CardDescription>
            </div>
            <ActionButton
              onClick={onAddDivisi}
              variant="default"
              icon={<Plus className="w-4 h-4" />}
            >
              Tambah Divisi
            </ActionButton>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Divisi</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDivisi.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>
                    {item.kategori && (
                      <Badge className={getKategoriColor(item.kategori)}>
                        {item.kategori}
                      </Badge>
                    )}
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
                        onClick={() => onEditDivisi(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => onDeleteDivisi(item)}
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
      {filteredDivisi.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada divisi</h3>
          <p className="text-gray-500">
            Mulai dengan menambahkan divisi pertama untuk tahun {selectedYear}
          </p>
        </div>
      )}
    </div>
  );
};

export default DivisiTab;
