import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useChecklist } from '@/contexts/ChecklistContext';
import FileUploadDialog from '@/components/dashboard/FileUploadDialog';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Upload, 
  Filter,
  Eye,
  Download,
  Calendar
} from 'lucide-react';

const ListGCG = () => {
  const { checklist } = useChecklist();
  const [selectedAspek, setSelectedAspek] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedChecklistItem, setSelectedChecklistItem] = useState<{
    id: number;
    aspek: string;
    deskripsi: string;
  } | null>(null);

  // Generate tahun dari 2014 sampai sekarang
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = currentYear; year >= 2014; year--) {
      yearsArray.push(year);
    }
    return yearsArray;
  }, []);

  // Get unique aspects
  const aspects = useMemo(() => {
    return [...new Set(checklist.map(item => item.aspek))];
  }, [checklist]);

  // Filter checklist berdasarkan aspek dan status
  const filteredChecklist = useMemo(() => {
    let filtered = checklist.map(item => ({
      ...item,
      status: 'not_uploaded' as 'uploaded' | 'not_uploaded' // Untuk sementara semua not uploaded
    }));

    if (selectedAspek !== 'all') {
      filtered = filtered.filter(item => item.aspek === selectedAspek);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    return filtered;
  }, [checklist, selectedAspek, selectedStatus]);

  // Hitung progress overall untuk tahun yang dipilih
  const overallProgress = useMemo(() => {
    const total = checklist.length;
    const uploaded = 0; // Untuk sementara, semua item dianggap belum uploaded
    return Math.round((uploaded / total) * 100);
  }, [checklist]);

  // Hitung progress per aspek
  const getAspekProgress = (aspek: string) => {
    const aspekItems = checklist.filter(item => item.aspek === aspek);
    const total = aspekItems.length;
    const uploaded = 0; // Untuk sementara, semua item dianggap belum uploaded
    return Math.round((uploaded / total) * 100);
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    if (status === 'uploaded') {
      return <Badge className="bg-green-100 text-green-800">Uploaded</Badge>;
    }
    return <Badge variant="secondary">Pending</Badge>;
  };

  // Handle upload button click
  const handleUploadClick = (item: { id: number; aspek: string; deskripsi: string }) => {
    setSelectedChecklistItem(item);
    setIsUploadDialogOpen(true);
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
            <h1 className="text-3xl font-bold text-gray-900">List GCG</h1>
            <p className="text-gray-600 mt-2">Daftar checklist Good Corporate Governance</p>
          </div>

          {/* Year Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Pilih Tahun</span>
              </CardTitle>
              <CardDescription>
                Pilih tahun untuk melihat checklist GCG
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {years.map(year => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    onClick={() => setSelectedYear(year)}
                    className="min-w-[80px]"
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Progress Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Progress Keseluruhan - Tahun {selectedYear}</span>
              </CardTitle>
              <CardDescription>
                Progress upload dokumen GCG secara keseluruhan untuk tahun {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Progress Upload</span>
                    <span className="text-sm font-bold text-blue-600">{overallProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{checklist.length}</div>
                    <div className="text-sm text-gray-600">Total Checklist</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Sudah Selesai</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{checklist.length}</div>
                    <div className="text-sm text-gray-600">Belum Selesai</div>
                  </div>
                </div>

                {/* Progress Details */}
                <div className="flex justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                    0 uploaded
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-yellow-600" />
                    {checklist.length} pending
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress per Aspek */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Progress per Aspek - Tahun {selectedYear}</CardTitle>
              <CardDescription>
                Progress upload dokumen berdasarkan aspek GCG untuk tahun {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aspects.map((aspek) => {
                  const progress = getAspekProgress(aspek);
                  const aspekItems = checklist.filter(item => item.aspek === aspek);
                  const uploadedCount = 0; // Untuk sementara, semua item dianggap belum uploaded
                  const pendingCount = aspekItems.length;
                  
                  return (
                    <div key={aspek} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{aspek}</h4>
                        <Badge variant={progress === 100 ? "default" : progress > 50 ? "secondary" : "destructive"}>
                          {progress}%
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progress === 100 ? 'bg-green-500' : 
                            progress > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                          {uploadedCount}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-yellow-600" />
                          {pendingCount}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Total: {aspekItems.length} item
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Aspek Filter - Tab */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Aspek</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedAspek === 'all' ? "default" : "outline"}
                      onClick={() => setSelectedAspek('all')}
                      size="sm"
                    >
                      Semua Aspek
                    </Button>
                    {aspects.map(aspek => (
                      <Button
                        key={aspek}
                        variant={selectedAspek === aspek ? "default" : "outline"}
                        onClick={() => setSelectedAspek(aspek)}
                        size="sm"
                        className="text-xs"
                      >
                        {aspek.replace('ASPEK ', '').replace('. ', ' - ')}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Status Filter - Tab */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">Status</label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedStatus === 'all' ? "default" : "outline"}
                      onClick={() => setSelectedStatus('all')}
                      size="sm"
                    >
                      Semua Status
                    </Button>
                    <Button
                      variant={selectedStatus === 'uploaded' ? "default" : "outline"}
                      onClick={() => setSelectedStatus('uploaded')}
                      size="sm"
                      className={selectedStatus === 'uploaded' ? "bg-green-600 hover:bg-green-700" : "border-green-600 text-green-600 hover:bg-green-50"}
                    >
                      Uploaded
                    </Button>
                    <Button
                      variant={selectedStatus === 'not_uploaded' ? "default" : "outline"}
                      onClick={() => setSelectedStatus('not_uploaded')}
                      size="sm"
                      className={selectedStatus === 'not_uploaded' ? "bg-red-600 hover:bg-red-700" : "border-red-600 text-red-600 hover:bg-red-50"}
                    >
                      Pending
                    </Button>
                  </div>
                </div>

                {/* Reset Filter */}
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedAspek('all');
                      setSelectedStatus('all');
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daftar Checklist GCG - Tahun {selectedYear}</CardTitle>
                  <CardDescription>
                    {filteredChecklist.length} item ditemukan
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Batch
                  </Button>
                </div>
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
                    <TableHead>File</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredChecklist.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.aspek}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={item.deskripsi}>
                          {item.deskripsi}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell>
                        {item.status === 'uploaded' ? (
                          <span className="text-green-600 text-sm">✓ Terupload</span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleUploadClick(item)}
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredChecklist.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Tidak ada item yang ditemukan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* File Upload Dialog */}
      <FileUploadDialog
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        checklistId={selectedChecklistItem?.id}
        checklistDescription={selectedChecklistItem?.deskripsi}
        aspect={selectedChecklistItem?.aspek}
      />
    </div>
  );
};

export default ListGCG; 