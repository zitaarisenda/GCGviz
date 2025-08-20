import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Edit, Trash2, Plus } from 'lucide-react';
import { ActionButton } from '@/components/panels';

interface Subdirektorat {
  id: number;
  nama: string;
  tahun: number;
  createdAt: Date;
  isActive: boolean;
}

interface SubdirektoratTabProps {
  selectedYear: number;
  subdirektorat: Subdirektorat[];
  onAddSubdirektorat: () => void;
  onEditSubdirektorat: (subdirektorat: Subdirektorat) => void;
  onDeleteSubdirektorat: (subdirektorat: Subdirektorat) => void;
}

const SubdirektoratTab: React.FC<SubdirektoratTabProps> = ({
  selectedYear,
  subdirektorat,
  onAddSubdirektorat,
  onEditSubdirektorat,
  onDeleteSubdirektorat
}) => {
  const filteredSubdirektorat = subdirektorat.filter(s => s.tahun === selectedYear);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-900">Kelola Subdirektorat - Tahun {selectedYear}</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Tambah, edit, atau hapus subdirektorat untuk tahun {selectedYear}
        </p>
      </div>

      {/* Subdirektorat Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-600" />
                <span>Daftar Subdirektorat</span>
              </CardTitle>
              <CardDescription>
                {filteredSubdirektorat.length} subdirektorat ditemukan untuk tahun {selectedYear}
              </CardDescription>
            </div>
            <ActionButton
              onClick={onAddSubdirektorat}
              variant="default"
              icon={<Plus className="w-4 h-4" />}
            >
              Tambah Subdirektorat
            </ActionButton>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama Subdirektorat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubdirektorat.map((item, index) => (
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
                        onClick={() => onEditSubdirektorat(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => onDeleteSubdirektorat(item)}
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
      {filteredSubdirektorat.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada subdirektorat</h3>
          <p className="text-gray-500">
            Mulai dengan menambahkan subdirektorat pertama untuk tahun {selectedYear}
          </p>
        </div>
      )}
    </div>
  );
};

export default SubdirektoratTab;
