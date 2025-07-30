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
import { useFileUpload } from '@/contexts/FileUploadContext';
import { useKlasifikasi } from '@/contexts/KlasifikasiContext';
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
  Building2,
  User,
  Briefcase
} from 'lucide-react';

interface DireksiFolder {
  id: string;
  direksiName: string;
  year: number;
  totalFiles: number;
  totalSize: number;
  lastModified: Date;
  categories: CategoryFolder[];
}

interface CategoryFolder {
  id: string;
  name: string;
  principle: string;
  type: string;
  category: string;
  fileCount: number;
  totalSize: number;
  files: DocumentFile[];
}

interface DocumentFile {
  id: string;
  name: string;
  size: number;
  fileType: string;
  uploadDate: Date;
  uploadedBy: string;
  direksi: string;
  divisi: string;
  principle: string;
  documentType: string;
  category: string;
}

const DocumentManagement = () => {
  const { isSidebarOpen } = useSidebar();
  const { selectedYear } = useYear();
  const { documents, getYearStats } = useDocumentMetadata();
  const { getFilesByYear } = useFileUpload();
  const { klasifikasiPrinsip, klasifikasiJenis, klasifikasiKategori } = useKlasifikasi();
  const [direksiFolders, setDireksiFolders] = useState<DireksiFolder[]>([]);
  const [selectedDireksi, setSelectedDireksi] = useState<DireksiFolder | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isDireksiDetailOpen, setIsDireksiDetailOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'date' | 'files'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterPrinciple, setFilterPrinciple] = useState<string>('all');

  // Generate direksi folders from existing documents
  useEffect(() => {
    if (selectedYear) {
      // Get documents for selected year
      const yearDocuments = documents.filter((doc: any) => doc.year === selectedYear);
      
      // Group by direksi first, then by metadata
      const direksiMap = new Map<string, DireksiFolder>();

      yearDocuments.forEach((doc: any) => {
        const direksiName = doc.direksi || 'Unknown Direksi';
        
        if (!direksiMap.has(direksiName)) {
          direksiMap.set(direksiName, {
            id: direksiName,
            direksiName,
            year: selectedYear,
            totalFiles: 0,
            totalSize: 0,
            lastModified: new Date(),
            categories: []
          });
        }

        const direksiFolder = direksiMap.get(direksiName)!;
        
        // Create category key
        const categoryKey = `${doc.gcgPrinciple}-${doc.documentType}-${doc.documentCategory}`;
        let categoryFolder = direksiFolder.categories.find(cat => cat.id === categoryKey);
        
        if (!categoryFolder) {
          categoryFolder = {
            id: categoryKey,
            name: `${doc.gcgPrinciple} - ${doc.documentType}`,
            principle: doc.gcgPrinciple,
            type: doc.documentType,
            category: doc.documentCategory,
            fileCount: 0,
            totalSize: 0,
            files: []
          };
          direksiFolder.categories.push(categoryFolder);
        }

        // Add file to category
        const file: DocumentFile = {
          id: doc.id,
          name: doc.title,
          size: doc.fileSize || 0,
          fileType: doc.fileName?.split('.').pop() || 'unknown',
          uploadDate: new Date(doc.uploadDate),
          uploadedBy: doc.uploadedBy || 'Unknown',
          direksi: doc.direksi,
          divisi: doc.division,
          principle: doc.gcgPrinciple,
          documentType: doc.documentType,
          category: doc.documentCategory
        };

        categoryFolder.files.push(file);
        categoryFolder.fileCount++;
        categoryFolder.totalSize += file.size;
        
        // Update direksi folder stats
        direksiFolder.totalFiles++;
        direksiFolder.totalSize += file.size;
        
        const uploadDate = new Date(doc.uploadDate);
        if (uploadDate > direksiFolder.lastModified) {
          direksiFolder.lastModified = uploadDate;
        }
      });

      setDireksiFolders(Array.from(direksiMap.values()));
    }
  }, [selectedYear, documents]);

  // Filter and sort direksi folders
  const filteredAndSortedDireksiFolders = direksiFolders
    .filter(direksi => {
      const matchesSearch = direksi.direksiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           direksi.categories.some(cat => 
                             cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             cat.category.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesPrinciple = filterPrinciple === 'all' || 
                              direksi.categories.some(cat => cat.principle === filterPrinciple);
      return matchesSearch && matchesPrinciple;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.direksiName.localeCompare(b.direksiName);
          break;
        case 'size':
          comparison = a.totalSize - b.totalSize;
          break;
        case 'date':
          comparison = a.lastModified.getTime() - b.lastModified.getTime();
          break;
        case 'files':
          comparison = a.totalFiles - b.totalFiles;
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

  const handleDownloadDireksiZIP = async (direksiFolder: DireksiFolder) => {
    setIsProcessing(true);
    setDownloadProgress(0);
    
    try {
      // Simulate ZIP creation with progress
      for (let i = 0; i <= 100; i += 15) {
        setDownloadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      // Here you would implement actual ZIP creation with folder structure
      const link = document.createElement('a');
      link.href = 'data:application/zip;base64,UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==';
      link.download = `${direksiFolder.direksiName}_GCG_Documents_${selectedYear}.zip`;
      link.click();
      
      alert(`ZIP file for ${direksiFolder.direksiName} downloaded successfully!`);
    } catch (error) {
      alert('Error creating ZIP file');
    } finally {
      setIsProcessing(false);
      setDownloadProgress(0);
    }
  };

  const handleDownloadAllZIP = async () => {
    setIsProcessing(true);
    setDownloadProgress(0);
    
    try {
      // Simulate ZIP creation with progress
      for (let i = 0; i <= 100; i += 10) {
        setDownloadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Here you would implement actual ZIP creation for all direksi
      const link = document.createElement('a');
      link.href = 'data:application/zip;base64,UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==';
      link.download = `All_GCG_Documents_${selectedYear}.zip`;
      link.click();
      
      alert('All ZIP files downloaded successfully!');
    } catch (error) {
      alert('Error creating ZIP files');
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
      setDireksiFolders([]);
      alert('All data has been reset successfully!');
      setIsResetDialogOpen(false);
    } catch (error) {
      alert('Error resetting data');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDireksiClick = (direksiFolder: DireksiFolder) => {
    setSelectedDireksi(direksiFolder);
    setIsDireksiDetailOpen(true);
  };

  const yearStats = selectedYear ? getYearStats(selectedYear) : {
    totalDocuments: 0,
    totalSize: 0,
    byPrinciple: {},
    byType: {},
    byDireksi: {}
  };

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
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <Folder className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Management Dokumen
                    </h1>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <User className="w-4 h-4 mr-2 text-blue-500" />
                      Kelola dokumen GCG berdasarkan Direksi dengan struktur folder terorganisir
                    </p>
                  </div>
                </div>
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
                        Upload file ZIP yang berisi dokumen GCG. File akan otomatis diekstrak dan dikelompokkan berdasarkan Direksi.
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
                  onClick={handleDownloadAllZIP}
                  disabled={isProcessing || direksiFolders.length === 0}
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download All
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

          {/* Year Selector Panel */}
          <div className="mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-blue-900">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Tahun Buku</span>
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Pilih tahun buku untuk melihat folder dokumen GCG berdasarkan Direksi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014].map(year => (
                    <Button
                      key={year}
                      variant={selectedYear === year ? "default" : "outline"}
                      size="sm"
                      onClick={() => window.location.href = `/dashboard?year=${year}`}
                      className={`transition-all duration-200 ${
                        selectedYear === year 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
                
                {selectedYear && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Tahun Buku {selectedYear}:</strong> Dokumen GCG dikelompokkan berdasarkan Direksi dengan struktur folder terorganisir
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Statistics Cards */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total Direksi</p>
                      <p className="text-3xl font-bold">{direksiFolders.length}</p>
                    </div>
                    <User className="w-8 h-8 text-blue-200" />
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
                      <p className="text-orange-100 text-sm">Kategori</p>
                      <p className="text-3xl font-bold">
                        {direksiFolders.reduce((total, direksi) => total + direksi.categories.length, 0)}
                      </p>
                    </div>
                    <Briefcase className="w-8 h-8 text-orange-200" />
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
                        placeholder="Cari direksi atau kategori..."
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
                      {klasifikasiPrinsip.map(principle => (
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

          {/* Direksi Folders */}
          <div className="mb-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Folder Direksi - Tahun {selectedYear}</span>
                    </CardTitle>
                    <CardDescription>
                      {filteredAndSortedDireksiFolders.length} direksi ditemukan
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
                {filteredAndSortedDireksiFolders.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchTerm ? 'Tidak ada direksi yang ditemukan' : 'Belum ada folder direksi'}
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Upload dokumen atau file ZIP untuk membuat folder direksi'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedDireksiFolders.map((direksiFolder) => (
                      <Card 
                        key={direksiFolder.id} 
                        className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
                        onClick={() => handleDireksiClick(direksiFolder)}
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg truncate">{direksiFolder.direksiName}</CardTitle>
                                <p className="text-sm text-gray-500 truncate">{direksiFolder.categories.length} kategori</p>
                              </div>
                            </div>
                            <Badge variant="secondary">{direksiFolder.totalFiles} files</Badge>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {direksiFolder.categories.slice(0, 3).map((category) => (
                              <Badge key={category.id} className={`text-xs ${getPrincipleColor(category.principle)}`}>
                                {category.principle}
                              </Badge>
                            ))}
                            {direksiFolder.categories.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{direksiFolder.categories.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Ukuran:</span>
                              <span className="font-medium">{formatFileSize(direksiFolder.totalSize)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Update terakhir:</span>
                              <span className="font-medium">
                                {direksiFolder.lastModified.toLocaleDateString('id-ID')}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDireksiClick(direksiFolder);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Lihat
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadDireksiZIP(direksiFolder);
                                }}
                              >
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

      {/* Direksi Detail Dialog */}
      <Dialog open={isDireksiDetailOpen} onOpenChange={setIsDireksiDetailOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Detail Direksi: {selectedDireksi?.direksiName}</span>
            </DialogTitle>
            <DialogDescription>
              Informasi detail dan kategori dokumen dalam folder direksi ini
            </DialogDescription>
          </DialogHeader>
          {selectedDireksi && (
            <div className="space-y-6">
              {/* Direksi Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informasi Direksi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Nama Direksi</p>
                      <p className="font-medium">{selectedDireksi.direksiName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tahun</p>
                      <p className="font-medium">{selectedDireksi.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jumlah Kategori</p>
                      <p className="font-medium">{selectedDireksi.categories.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total File</p>
                      <p className="font-medium">{selectedDireksi.totalFiles}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Ukuran</p>
                      <p className="font-medium">{formatFileSize(selectedDireksi.totalSize)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Update Terakhir</p>
                      <p className="font-medium">{selectedDireksi.lastModified.toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Kategori Dokumen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedDireksi.categories.map((category) => (
                      <div key={category.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.category}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`text-xs ${getPrincipleColor(category.principle)}`}>
                              {category.principle}
                            </Badge>
                            <Badge variant="secondary">{category.fileCount} files</Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="text-sm">
                            <span className="text-gray-600">Ukuran: </span>
                            <span className="font-medium">{formatFileSize(category.totalSize)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-600">Jenis: </span>
                            <span className="font-medium">{category.type}</span>
                          </div>
                        </div>

                        {/* Files in category */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Files:</p>
                          {category.files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-gray-600 text-xs">{file.divisi}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-600">{formatFileSize(file.size)}</span>
                                <Badge variant="outline" className="text-xs">{file.fileType}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Download Button */}
              <div className="flex justify-center">
                <Button 
                  onClick={() => handleDownloadDireksiZIP(selectedDireksi)}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download ZIP - {selectedDireksi.direksiName}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagement; 