import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSidebar } from '@/contexts/SidebarContext';
import { useYear } from '@/contexts/YearContext';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import { 
  FileText, 
  Upload, 
  Download,
  Folder,
  FolderOpen,
  File,
  Archive,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  Calendar,
  BarChart3,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreVertical,
  Info,
  Users,
  Building2
} from 'lucide-react';

interface DocumentFolder {
  id: string;
  name: string;
  year: number;
  principle: string;
  type: string;
  category: string;
  fileCount: number;
  totalSize: number;
  lastModified: Date;
  files: DocumentFile[];
  direksi?: string;
  divisi?: string;
}

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  fileType: string;
  uploadDate: Date;
  uploadedBy: string;
  direksi?: string;
  divisi?: string;
  principle?: string;
  documentType?: string;
  category?: string;
}

const DocumentManagement = () => {
  const { isSidebarOpen } = useSidebar();
  const { selectedYear } = useYear();
  const { getYearStats } = useDocumentMetadata();
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<DocumentFolder | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isFolderDetailOpen, setIsFolderDetailOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'files'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterPrinciple, setFilterPrinciple] = useState<string>('all');

  // Generate folders from existing documents
  useEffect(() => {
    if (selectedYear) {
      // Get documents from localStorage for now
      const documentsData = localStorage.getItem('documentMetadata');
      const documents = documentsData ? JSON.parse(documentsData) : [];
      const yearDocuments = documents.filter((doc: any) => doc.tahunBuku === selectedYear);
      
      const folderMap = new Map<string, DocumentFolder>();

      yearDocuments.forEach((doc: any) => {
        const folderKey = `${doc.prinsipGCG}-${doc.jenisDokumen}-${doc.kategori}`;
        
        if (!folderMap.has(folderKey)) {
          folderMap.set(folderKey, {
            id: folderKey,
            name: `${doc.prinsipGCG} - ${doc.jenisDokumen}`,
            year: selectedYear,
            principle: doc.prinsipGCG,
            type: doc.jenisDokumen,
            category: doc.kategori,
            fileCount: 0,
            totalSize: 0,
            lastModified: new Date(),
            files: [],
            direksi: doc.direksi,
            divisi: doc.divisi
          });
        }

        const folder = folderMap.get(folderKey)!;
        folder.files.push({
          id: doc.id,
          name: doc.judulDokumen,
          size: doc.fileSize || 0,
          fileType: doc.fileType || 'unknown',
          uploadDate: new Date(doc.uploadDate),
          uploadedBy: doc.uploadedBy || 'Unknown',
          direksi: doc.direksi,
          divisi: doc.divisi,
          principle: doc.prinsipGCG,
          documentType: doc.jenisDokumen,
          category: doc.kategori
        });
        folder.fileCount++;
        folder.totalSize += doc.fileSize || 0;
        
        const uploadDate = new Date(doc.uploadDate);
        if (uploadDate > folder.lastModified) {
          folder.lastModified = uploadDate;
        }
      });

      setFolders(Array.from(folderMap.values()));
    }
  }, [selectedYear]);

  // Filter and sort folders
  const filteredAndSortedFolders = folders
    .filter(folder => {
      const matchesSearch = folder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           folder.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrinciple = filterPrinciple === 'all' || folder.principle === filterPrinciple;
      return matchesSearch && matchesPrinciple;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.totalSize - b.totalSize;
          break;
        case 'date':
          comparison = a.lastModified.getTime() - b.lastModified.getTime();
          break;
        case 'files':
          comparison = a.fileCount - b.fileCount;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPrincipleColor = (principle: string) => {
    const colors = {
      'Transparansi': 'bg-blue-100 text-blue-800 border-blue-200',
      'Akuntabilitas': 'bg-green-100 text-green-800 border-green-200',
      'Responsibilitas': 'bg-purple-100 text-purple-800 border-purple-200',
      'Independensi': 'bg-orange-100 text-orange-800 border-orange-200',
      'Kesetaraan': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[principle as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/zip') {
      setUploadedFile(file);
    } else {
      alert('Please select a valid ZIP file');
    }
  };

  const handleUploadZIP = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setUploadProgress(0);
    
    try {
      // Simulate ZIP processing with progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Here you would implement actual ZIP extraction and document processing
      alert('ZIP file uploaded and processed successfully!');
      setIsUploadDialogOpen(false);
      setUploadedFile(null);
      setUploadProgress(0);
    } catch (error) {
      alert('Error processing ZIP file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadZIP = async () => {
    setIsProcessing(true);
    setDownloadProgress(0);
    
    try {
      // Simulate ZIP creation with progress
      for (let i = 0; i <= 100; i += 15) {
        setDownloadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      // Here you would implement actual ZIP creation and download
      const link = document.createElement('a');
      link.href = 'data:application/zip;base64,UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==';
      link.download = `GCG_Documents_${selectedYear}.zip`;
      link.click();
      
      alert('ZIP file downloaded successfully!');
    } catch (error) {
      alert('Error creating ZIP file');
    } finally {
      setIsProcessing(false);
      setDownloadProgress(0);
    }
  };

  const handleResetData = async () => {
    setIsProcessing(true);
    try {
      // Simulate data reset
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would implement actual data reset
      setFolders([]);
      alert('All data has been reset successfully!');
      setIsResetDialogOpen(false);
    } catch (error) {
      alert('Error resetting data');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFolderClick = (folder: DocumentFolder) => {
    setSelectedFolder(folder);
    setIsFolderDetailOpen(true);
  };

  const yearStats = selectedYear ? getYearStats(selectedYear) : {
    totalDocuments: 0,
    totalSize: 0,
    byPrinciple: {},
    byType: {},
    byDireksi: {}
  };

  const principles = ['Transparansi', 'Akuntabilitas', 'Responsibilitas', 'Independensi', 'Kesetaraan'];

  if (!selectedYear) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />
        
        <div className={`
          transition-all duration-300 ease-in-out pt-16
          ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
        `}>
          <div className="p-6">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pilih Tahun Buku
              </h3>
              <p className="text-gray-600">
                Silakan pilih tahun buku di dashboard untuk melihat management dokumen
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-3xl font-bold text-gray-900">Management Dokumen</h1>
                <p className="text-gray-600 mt-2">
                  Kelola folder dokumen GCG untuk tahun {selectedYear}
                </p>
              </div>
              <div className="flex space-x-2">
                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload ZIP
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Upload File ZIP</DialogTitle>
                      <DialogDescription>
                        Upload file ZIP yang berisi dokumen GCG. File akan otomatis diekstrak dan dikelompokkan.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="zip-file">Pilih File ZIP</Label>
                        <Input
                          id="zip-file"
                          type="file"
                          accept=".zip"
                          onChange={handleFileUpload}
                          className="mt-1"
                        />
                      </div>
                      {uploadedFile && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Archive className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-blue-800">{uploadedFile.name}</p>
                              <p className="text-xs text-blue-600">{formatFileSize(uploadedFile.size)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {isProcessing && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Processing ZIP file...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} className="w-full" />
                        </div>
                      )}
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                          Batal
                        </Button>
                        <Button 
                          onClick={handleUploadZIP}
                          disabled={!uploadedFile || isProcessing}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isProcessing ? 'Processing...' : 'Upload'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={handleDownloadZIP}
                  disabled={isProcessing}
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download ZIP
                </Button>

                <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Data
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset Semua Data</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini akan menghapus semua dokumen dan folder yang ada. 
                        Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleResetData}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {isProcessing ? 'Processing...' : 'Reset Data'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div id="document-folders" className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Folder</p>
                      <p className="text-3xl font-bold">{folders.length}</p>
                    </div>
                    <Folder className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Total File</p>
                      <p className="text-3xl font-bold">{yearStats.totalDocuments}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Total Ukuran</p>
                      <p className="text-3xl font-bold">{formatFileSize(yearStats.totalSize)}</p>
                    </div>
                    <HardDrive className="w-8 h-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Prinsip GCG</p>
                      <p className="text-3xl font-bold">{Object.keys(yearStats.byPrinciple).length}</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Cari folder atau kategori..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterPrinciple}
                      onChange={(e) => setFilterPrinciple(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Semua Prinsip</option>
                      {principles.map(principle => (
                        <option key={principle} value={principle}>{principle}</option>
                      ))}
                    </select>
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [sort, order] = e.target.value.split('-');
                        setSortBy(sort as any);
                        setSortOrder(order as any);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="name-asc">Nama (A-Z)</option>
                      <option value="name-desc">Nama (Z-A)</option>
                      <option value="size-asc">Ukuran (Kecil-Besar)</option>
                      <option value="size-desc">Ukuran (Besar-Kecil)</option>
                      <option value="date-asc">Tanggal (Lama-Baru)</option>
                      <option value="date-desc">Tanggal (Baru-Lama)</option>
                      <option value="files-asc">File (Sedikit-Banyak)</option>
                      <option value="files-desc">File (Banyak-Sedikit)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document Folders */}
          <div id="document-folders" className="mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="w-5 h-5 text-blue-600" />
                      <span>Folder Dokumen - Tahun {selectedYear}</span>
                    </CardTitle>
                    <CardDescription>
                      {filteredAndSortedFolders.length} folder ditemukan
                      {searchTerm && ` untuk pencarian "${searchTerm}"`}
                    </CardDescription>
                  </div>
                  {isProcessing && (
                    <div className="flex items-center space-x-2">
                      <div className="flex justify-between text-sm">
                        <span>Downloading ZIP...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <Progress value={downloadProgress} className="w-32" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {filteredAndSortedFolders.length === 0 ? (
                  <div className="text-center py-12">
                    <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? 'Tidak ada folder yang ditemukan' : 'Belum ada folder dokumen'}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Upload dokumen atau file ZIP untuk membuat folder'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedFolders.map((folder) => (
                      <Card 
                        key={folder.id} 
                        className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
                        onClick={() => handleFolderClick(folder)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Folder className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg truncate">{folder.name}</CardTitle>
                                <p className="text-sm text-gray-500 truncate">{folder.category}</p>
                              </div>
                            </div>
                            <Badge variant="secondary">{folder.fileCount} files</Badge>
                          </div>
                          <div className="mt-2">
                            <Badge className={`text-xs ${getPrincipleColor(folder.principle)}`}>
                              {folder.principle}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Ukuran:</span>
                              <span className="font-medium">{formatFileSize(folder.totalSize)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Update terakhir:</span>
                              <span className="font-medium">
                                {folder.lastModified.toLocaleDateString('id-ID')}
                              </span>
                            </div>
                            {folder.direksi && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Direksi:</span>
                                <span className="font-medium truncate">{folder.direksi}</span>
                              </div>
                            )}
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Eye className="w-4 h-4 mr-1" />
                                Lihat
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Folder Detail Dialog */}
      <Dialog open={isFolderDetailOpen} onOpenChange={setIsFolderDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-blue-600" />
              <span>Detail Folder: {selectedFolder?.name}</span>
            </DialogTitle>
            <DialogDescription>
              Informasi detail dan file-file dalam folder ini
            </DialogDescription>
          </DialogHeader>
          {selectedFolder && (
            <div className="space-y-6">
              {/* Folder Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Folder</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Prinsip GCG</p>
                      <p className="font-medium">{selectedFolder.principle}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jenis Dokumen</p>
                      <p className="font-medium">{selectedFolder.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Kategori</p>
                      <p className="font-medium">{selectedFolder.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jumlah File</p>
                      <p className="font-medium">{selectedFolder.fileCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Ukuran</p>
                      <p className="font-medium">{formatFileSize(selectedFolder.totalSize)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Update Terakhir</p>
                      <p className="font-medium">{selectedFolder.lastModified.toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Files Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daftar File</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama File</TableHead>
                        <TableHead>Ukuran</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Uploader</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedFolder.files.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">{file.name}</TableCell>
                          <TableCell>{formatFileSize(file.size)}</TableCell>
                                                     <TableCell>
                             <Badge variant="outline">{file.fileType}</Badge>
                           </TableCell>
                          <TableCell>{file.uploadDate.toLocaleDateString('id-ID')}</TableCell>
                          <TableCell>{file.uploadedBy}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagement; 