import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ListTodo, Edit, Trash2, Filter } from 'lucide-react';
import { ActionButton } from '@/components/panels';

interface ChecklistItem {
  id: number;
  aspek: string;
  deskripsi: string;
  tahun?: number;
  status?: 'uploaded' | 'not_uploaded';
  file?: string;
}

interface KelolaDokumenTabProps {
  selectedYear: number;
  aspects: string[];
  filteredChecklist: ChecklistItem[];
  groupedChecklist: { [key: string]: ChecklistItem[] };
  selectedAspek: string;
  onAspekChange: (aspek: string) => void;
  onEditDokumen: (item: ChecklistItem) => void;
  onDeleteDokumen: (item: ChecklistItem) => void;
  onAddDokumen: () => void;
}

const KelolaDokumenTab: React.FC<KelolaDokumenTabProps> = ({
  selectedYear,
  aspects,
  filteredChecklist,
  groupedChecklist,
  selectedAspek,
  onAspekChange,
  onEditDokumen,
  onDeleteDokumen,
  onAddDokumen
}) => {
  const getAspectIcon = (aspekName: string) => {
    const aspectIcons = {
      'ASPEK I. Komitmen': { icon: '🎯', color: 'text-red-500' },
      'ASPEK II. Implementasi': { icon: '✅', color: 'text-green-500' },
      'ASPEK III. Pengawasan': { icon: '📋', color: 'text-blue-500' },
      'ASPEK IV. Pelaporan': { icon: '📊', color: 'text-purple-500' },
      'ASPEK V. Evaluasi': { icon: '📈', color: 'text-orange-500' }
    };
    
    return aspectIcons[aspekName] || { icon: '🎯', color: 'text-gray-500' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <ListTodo className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-900">Kelola Dokumen Item - Tahun {selectedYear}</span>
        </div>
        <p className="text-purple-700 text-sm mt-1">
          Tambah, edit, atau hapus item dokumen GCG untuk tahun {selectedYear}
        </p>
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <ListTodo className="w-5 h-5 text-purple-600" />
                <span>Daftar Dokumen GCG</span>
              </CardTitle>
              <CardDescription>
                {filteredChecklist.length} item dokumen GCG ditemukan untuk tahun {selectedYear}
              </CardDescription>
            </div>
            <ActionButton
              onClick={onAddDokumen}
              variant="default"
              icon={<ListTodo className="w-4 h-4" />}
            >
              Tambah Dokumen GCG
            </ActionButton>
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
                    onClick={() => onAspekChange('all')}
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
                    return (
                      <Button
                        key={aspek}
                        variant={selectedAspek === aspek ? "default" : "outline"}
                        onClick={() => onAspekChange(aspek)}
                        size="sm"
                        className={`text-xs flex items-center space-x-2 ${
                          selectedAspek === aspek 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-sm">{aspectInfo.icon}</span>
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
                            {item.status === 'uploaded' ? 'Sudah Upload' : 'Belum Upload'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onEditDokumen(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => onDeleteDokumen(item)}
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
                            {item.status === 'uploaded' ? 'Sudah Upload' : 'Belum Upload'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => onEditDokumen(item)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => onDeleteDokumen(item)}
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

      {/* Empty State */}
      {filteredChecklist.length === 0 && (
        <div className="text-center py-12">
          <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada dokumen GCG</h3>
          <p className="text-gray-500">
            Mulai dengan menambahkan dokumen GCG pertama untuk tahun {selectedYear}
          </p>
        </div>
      )}
    </div>
  );
};

export default KelolaDokumenTab;
