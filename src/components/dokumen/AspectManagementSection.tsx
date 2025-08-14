import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Building2
} from 'lucide-react';

interface Aspect {
  id: number;
  nama: string;
  deskripsi: string;
  kategori: string;
  prioritas: 'tinggi' | 'sedang' | 'rendah';
  status: 'aktif' | 'nonaktif';
  createdAt: Date;
  updatedAt: Date;
}

interface AspectManagementSectionProps {
  aspects: Aspect[];
  onAddAspect: () => void;
  onEditAspect: (aspect: Aspect) => void;
  onDeleteAspect: (aspect: Aspect) => void;
}

const AspectManagementSection: React.FC<AspectManagementSectionProps> = ({
  aspects,
  onAddAspect,
  onEditAspect,
  onDeleteAspect
}) => {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'tinggi':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Tinggi</Badge>;
      case 'sedang':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Sedang</Badge>;
      case 'rendah':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Rendah</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'aktif':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aktif</Badge>;
      case 'nonaktif':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Nonaktif</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getKategoriColor = (kategori: string) => {
    const colors: { [key: string]: string } = {
      'Tata Kelola': 'bg-blue-100 text-blue-800 border-blue-200',
      'Kepatuhan': 'bg-green-100 text-green-800 border-green-200',
      'Risiko': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Sistem': 'bg-purple-100 text-purple-800 border-purple-200',
      'Lainnya': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[kategori] || colors['Lainnya'];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Aspek GCG</h2>
          <p className="text-gray-600 mt-1">
            Kelola aspek-aspek Good Corporate Governance yang akan digunakan dalam sistem
          </p>
        </div>
        <Button
          onClick={onAddAspect}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Aspek
        </Button>
      </div>

      {/* Aspek Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Daftar Aspek GCG</span>
          </CardTitle>
          <CardDescription>
            {aspects.length} aspek tersedia dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Aspek</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Prioritas</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aspects.map((aspect) => (
                <TableRow key={aspect.id}>
                  <TableCell className="font-medium">{aspect.nama}</TableCell>
                  <TableCell className="max-w-xs truncate">{aspect.deskripsi}</TableCell>
                  <TableCell>
                    <Badge className={getKategoriColor(aspect.kategori)}>
                      {aspect.kategori}
                    </Badge>
                  </TableCell>
                  <TableCell>{getPriorityBadge(aspect.prioritas)}</TableCell>
                  <TableCell>{getStatusBadge(aspect.status)}</TableCell>
                  <TableCell>{aspect.createdAt.toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onEditAspect(aspect)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onDeleteAspect(aspect)}
                        className="text-red-600 hover:text-red-700"
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
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada aspek</h3>
          <p className="text-gray-500">
            Mulai dengan menambahkan aspek pertama untuk Good Corporate Governance
          </p>
          <Button
            onClick={onAddAspect}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Aspek Pertama
          </Button>
        </div>
      )}

      {/* Info Panel */}
      <Card className="border-0 shadow-lg bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                Tips Manajemen Aspek GCG
              </h4>
              <p className="text-sm text-blue-700">
                Pastikan setiap aspek memiliki deskripsi yang jelas dan kategori yang sesuai. 
                Prioritas dapat membantu dalam penjadwalan dan alokasi sumber daya.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AspectManagementSection;
