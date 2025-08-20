import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Edit, Trash2, Plus } from 'lucide-react';
import { ActionButton } from '@/components/panels';

interface Direktorat {
  id: number;
  nama: string;
  tahun: number;
  createdAt: Date;
  isActive: boolean;
}

interface DirektoratTabProps {
  selectedYear: number;
  direktorat: Direktorat[];
  onAddDirektorat: () => void;
  onEditDirektorat: (direktorat: Direktorat) => void;
  onDeleteDirektorat: (direktorat: Direktorat) => void;
}

const DirektoratTab: React.FC<DirektoratTabProps> = ({
  selectedYear,
  direktorat,
  onAddDirektorat,
  onEditDirektorat,
  onDeleteDirektorat
}) => {
  const filteredDirektorat = direktorat.filter(d => d.tahun === selectedYear);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">Kelola Direktorat - Tahun {selectedYear}</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          Tambah, edit, atau hapus direktorat untuk tahun {selectedYear}
        </p>
      </div>

      {/* Direktorat Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span>Daftar Direktorat</span>
              </CardTitle>
              <CardDescription>
                {filteredDirektorat.length} direktorat ditemukan untuk tahun {selectedYear}
              </CardDescription>
            </div>
            <ActionButton
              onClick={onAddDirektorat}
              variant="default"
              icon={<Plus className="w-4 h-4" />}
            >
              Tambah Direktorat
            </ActionButton>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Direktorat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDirektorat.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.nama}</TableCell>
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
                        onClick={() => onEditDirektorat(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => onDeleteDirektorat(item)}
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
      {filteredDirektorat.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada direktorat</h3>
          <p className="text-gray-500">
            Mulai dengan menambahkan direktorat pertama untuk tahun {selectedYear}
          </p>
        </div>
      )}
    </div>
  );
};

export default DirektoratTab;
