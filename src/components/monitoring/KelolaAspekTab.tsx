import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Target, Edit, Trash2 } from 'lucide-react';
import { ActionButton } from '@/components/panels';

interface ChecklistItem {
  id: number;
  aspek: string;
  deskripsi: string;
  tahun?: number;
  status?: 'uploaded' | 'not_uploaded';
  file?: string;
}

interface KelolaAspekTabProps {
  selectedYear: number;
  aspects: string[];
  groupedChecklist: { [key: string]: ChecklistItem[] };
  onEditAspek: (aspek: string) => void;
  onDeleteAspek: (aspek: string) => void;
  onAddAspek: () => void;
}

const KelolaAspekTab: React.FC<KelolaAspekTabProps> = ({
  selectedYear,
  aspects,
  groupedChecklist,
  onEditAspek,
  onDeleteAspek,
  onAddAspek
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-900">Kelola Aspek GCG - Tahun {selectedYear}</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          Tambah, edit, atau hapus aspek dokumen GCG untuk tahun {selectedYear}
        </p>
      </div>

      {/* Aspek Table */}
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
            <ActionButton
              onClick={onAddAspek}
              variant="default"
              icon={<Target className="w-4 h-4" />}
            >
              Tambah Aspek
            </ActionButton>
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
                        onClick={() => onEditAspek(aspek)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => onDeleteAspek(aspek)}
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
      {aspects.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada aspek dokumen GCG</h3>
          <p className="text-gray-500">
            Mulai dengan menambahkan aspek pertama untuk tahun {selectedYear}
          </p>
        </div>
      )}
    </div>
  );
};

export default KelolaAspekTab;
