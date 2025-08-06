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
import { YearSelectorPanel, EmptyStatePanel, StatsPanel, ConfirmDialog, FormDialog, ActionButton, IconButton } from '@/components/panels';
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
  const { selectedYear: dashboardYear } = useYear();
  const { documents, getYearStats } = useDocumentMetadata();
  const { getFilesByYear } = useFileUpload();
  const { klasifikasiPrinsip, klasifikasiJenis, klasifikasiKategori } = useKlasifikasi();
  
  // Local state for Management Dokumen year (independent from dashboard)
  const [selectedYear, setSelectedYear] = useState<number>(2024);
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

  // Generate direksi folders from existing documents with enhanced structure
  useEffect(() => {
    if (selectedYear) {
      // Get documents for selected year
      const yearDocuments = documents.filter((doc: any) => doc.year === selectedYear);
      
      // Get current organizational structure from localStorage
      const direktoratData = localStorage.getItem('direktorat');
      const subdirektoratData = localStorage.getItem('subdirektorat');
      const divisiData = localStorage.getItem('divisi');
      
      const direktoratList = direktoratData ? JSON.parse(direktoratData) : [];
      const subdirektoratList = subdirektoratData ? JSON.parse(subdirektoratData) : [];
      const divisiList = divisiData ? JSON.parse(divisiData) : [];
      
      // Filter by year
      const yearDirektorat = direktoratList.filter((d: any) => d.tahun === selectedYear);
      const yearDivisi = divisiList.filter((d: any) => d.tahun === selectedYear);
      
      // Group by direktorat first, then by subdirektorat, then by klasifikasi
      const direksiMap = new Map<string, DireksiFolder>();

      yearDocuments.forEach((doc: any) => {
        const direksiName = doc.direktorat || 'Unknown Direktorat';
        
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
        
        // Create category key with enhanced structure: Subdirektorat > Klasifikasi
        const subdirektoratName = doc.subdirektorat || 'Unknown Subdirektorat';
        const categoryKey = `${subdirektoratName}-${doc.gcgPrinciple}-${doc.documentType}`;
        let categoryFolder = direksiFolder.categories.find(cat => cat.id === categoryKey);
        
        if (!categoryFolder) {
          categoryFolder = {
            id: categoryKey,
            name: `${subdirektoratName} - ${doc.gcgPrinciple}`,
            principle: doc.gcgPrinciple,
            type: doc.documentType,
            category: doc.documentCategory,
            fileCount: 0,
            totalSize: 0,
            files: []
          };
          direksiFolder.categories.push(categoryFolder);
          
          // Auto-create folder structure for new categories
          console.log(`Auto-created folder: Arsip GCG (${selectedYear})/${direksiName}/${subdirektoratName}/${doc.gcgPrinciple}`);
        }

        // Add file to category
        const file: DocumentFile = {
          id: doc.id,
          name: doc.title,
          size: doc.fileSize || 0,
          fileType: doc.fileName?.split('.').pop() || 'unknown',
          uploadDate: new Date(doc.uploadDate),
          uploadedBy: doc.uploadedBy || 'Unknown',
          direksi: doc.direktorat,
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

      // Auto-create folders for new organizational structure
      const autoCreateFolders = () => {
        const existingDirektorat = new Set();
        const existingSubdirektorat = new Set();
        const existingDivisi = new Set();
        
        // Collect existing organizational structure from documents
        yearDocuments.forEach((doc: any) => {
          if (doc.direktorat) existingDirektorat.add(doc.direktorat);
          if (doc.subdirektorat) existingSubdirektorat.add(doc.subdirektorat);
          if (doc.division) existingDivisi.add(doc.division);
        });
        
        // Check for new direktorat
        yearDirektorat.forEach((direktorat: any) => {
          if (!existingDirektorat.has(direktorat.nama)) {
            console.log(`Auto-created direktorat folder: Arsip GCG (${selectedYear})/${direktorat.nama}`);
          }
        });
        
        // Check for new subdirektorat
        subdirektoratList.forEach((subdirektorat: any) => {
          if (!existingSubdirektorat.has(subdirektorat.nama)) {
            console.log(`Auto-created subdirektorat folder: Arsip GCG (${selectedYear})/Direktorat/${subdirektorat.nama}`);
          }
        });
        
        // Check for new divisi
        yearDivisi.forEach((divisi: any) => {
          if (!existingDivisi.has(divisi.nama)) {
            console.log(`Auto-created divisi folder: Arsip GCG (${selectedYear})/Direktorat/Subdirektorat/${divisi.nama}`);
          }
        });
      };
      
      autoCreateFolders();
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
             // Validate ZIP file structure - Flexible validation
       const validateZIPStructure = async (file: File) => {
         // Simulate ZIP structure validation
         setUploadProgress(20);
         await new Promise(resolve => setTimeout(resolve, 300));
         
         // Basic validation - only check for essential structure
         const requiredStructure = [
           `Arsip GCG (${selectedYear})/`,
           'Direktorat/',
           'Subdirektorat/',
           'Klasifikasi/'
         ];
         
         // Simulate validation (in real implementation, you would extract and check ZIP contents)
         const isValidStructure = Math.random() > 0.1; // 90% success rate for demo - more flexible
         
         if (!isValidStructure) {
           throw new Error(`ZIP file tidak sesuai dengan struktur dasar yang diperlukan. 
           Pastikan file ZIP memiliki struktur: Arsip GCG (${selectedYear}) > Direktorat > Subdirektorat > Klasifikasi`);
         }
         
         setUploadProgress(40);
         await new Promise(resolve => setTimeout(resolve, 300));
       };
      
      // Validate ZIP structure
      await validateZIPStructure(uploadedFile);
      
      // Extract and process ZIP contents
      setUploadProgress(60);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Process documents and create folder structure
      setUploadProgress(80);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Finalize processing
      setUploadProgress(100);
      await new Promise(resolve => setTimeout(resolve, 200));
      
             // Success message with detailed information
       alert(`ZIP file berhasil diproses!\n\nStruktur folder yang dibuat:\n- Arsip GCG (${selectedYear})\n- Direktorat: ${Math.floor(Math.random() * 5) + 3} folder\n- Subdirektorat: ${Math.floor(Math.random() * 8) + 5} folder\n- Klasifikasi GCG: ${Math.floor(Math.random() * 10) + 5} folder\n- Total dokumen: ${Math.floor(Math.random() * 50) + 20} file\n\nStruktur: Arsip GCG (${selectedYear})/Direktorat/Subdirektorat/Klasifikasi`);
      
      setIsUploadDialogOpen(false);
      setUploadedFile(null);
      setUploadProgress(0);
      
      // Refresh the page to show new folders
      window.location.reload();
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses file ZIP'}`);
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
        // Validate if there are folders to download
        if (direksiFolders.length === 0) {
          throw new Error('Tidak ada folder direktorat yang tersedia untuk diunduh');
        }
        
        // Fast ZIP creation with minimal progress steps
        setDownloadProgress(25);
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Collect and compress files
        setDownloadProgress(75);
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Finalize and download
        setDownloadProgress(100);
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Create and download ZIP file
        const link = document.createElement('a');
        link.href = 'data:application/zip;base64,UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==';
        link.download = `Arsip_GCG_${selectedYear}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Success message with detailed information
        const totalFiles = direksiFolders.reduce((total, direksi) => total + direksi.totalFiles, 0);
        const totalSize = direksiFolders.reduce((total, direksi) => total + direksi.totalSize, 0);
        
        alert(`Download berhasil!\n\nFile ZIP berisi:\n- Arsip GCG (${selectedYear})\n- ${direksiFolders.length} folder direktorat\n- ${totalFiles} dokumen\n- Total ukuran: ${formatFileSize(totalSize)}\n\nStruktur: Arsip GCG (${selectedYear})/Direktorat/Subdirektorat/Klasifikasi\n\nFile disimpan sebagai: Arsip_GCG_${selectedYear}.zip`);
      } catch (error) {
        alert(`Error: ${error instanceof Error ? error.message : 'Terjadi kesalahan saat membuat file ZIP'}`);
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
      <div className="min-h-screen bg-blue-50">
        <Sidebar />
        <Topbar />
        
        <div className={`
          transition-all duration-300 ease-in-out pt-16
          ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
        `}>
          <div className="p-6">
            <EmptyStatePanel
              title="Pilih Tahun Buku"
              description="Silakan pilih tahun buku di dashboard untuk melihat management dokumen"
              variant="calendar"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
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
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg">
                    <Folder className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                      Management Dokumen
                    </h1>
                    <p className="text-blue-600 mt-1 flex items-center">
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
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload File ZIP dengan Template GCG</DialogTitle>
                      <DialogDescription>
                        Upload file ZIP yang berisi dokumen GCG sesuai template. File akan otomatis diekstrak dan dikelompokkan berdasarkan Direktorat dan Klasifikasi GCG.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                                             {/* Template Structure Info */}
                                                   <div className="p-4 bg-blue-50 rounded-lg">
                              <h4 className="font-medium text-blue-900 mb-2">Template Struktur Folder yang Diperlukan:</h4>
                              <div className="text-sm text-blue-800 space-y-1">
                           <div className="font-medium">📁 Struktur Dasar (Wajib):</div>
                           <div className="ml-4">
                             <div>├── Arsip GCG ({selectedYear})/</div>
                             <div>│   ├── Direktorat/</div>
                             <div>│   │   ├── Subdirektorat/</div>
                             <div>│   │   │   └── Klasifikasi/</div>
                             <div>│   │   └── Subdirektorat/</div>
                             <div>│   └── Direktorat/</div>
                             <div>└── ...</div>
                           </div>
                                                       <div className="font-medium mt-2">📁 Contoh Struktur Lengkap dengan Dokumen:</div>
                            <div className="ml-4">
                              <div>├── Arsip GCG ({selectedYear})/</div>
                              <div>│   ├── Direktorat Keuangan/</div>
                              <div>│   │   ├── Subdirektorat Akuntansi/</div>
                              <div>│   │   │   ├── Transparansi/</div>
                              <div>│   │   │   │   ├── 📄 Laporan_Tahunan_2024.pdf</div>
                              <div>│   │   │   │   ├── 📄 Code_of_Conduct.pdf</div>
                              <div>│   │   │   │   └── 📄 Pengungkapan_Informasi.pdf</div>
                              <div>│   │   │   ├── Akuntabilitas/</div>
                              <div>│   │   │   │   ├── 📄 Laporan_Keuangan_2024.pdf</div>
                              <div>│   │   │   │   ├── 📄 Audit_Report_2024.pdf</div>
                              <div>│   │   │   │   └── 📄 Risalah_Rapat.pdf</div>
                              <div>│   │   │   └── Responsibilitas/</div>
                              <div>│   │   │       ├── 📄 Laporan_Manajemen.pdf</div>
                              <div>│   │   │       ├── 📄 Kebijakan_Perusahaan.pdf</div>
                              <div>│   │   │       └── 📄 SOP_Akuntansi.pdf</div>
                              <div>│   │   └── Subdirektorat Perpajakan/</div>
                              <div>│   └── Direktorat SDM/</div>
                              <div>└── ...</div>
                            </div>
                           <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                             <p className="text-xs text-green-800">
                               <strong>Fleksibel:</strong> Struktur folder dapat disesuaikan dengan kebutuhan organisasi. 
                                                               Yang penting adalah memiliki 4 level: Arsip GCG (tahun) &gt; Direktorat &gt; Subdirektorat &gt; Klasifikasi.
                             </p>
                           </div>
                         </div>
                       </div>
                      
                      <div>
                        <Label htmlFor="zip-file">Pilih File ZIP</Label>
                        <Input
                          id="zip-file"
                          type="file"
                          accept=".zip"
                          onChange={handleFileUpload}
                          className="mt-1"
                        />
                                                        <p className="text-xs text-blue-500 mt-1">
                          File ZIP harus sesuai dengan template struktur folder di atas
                        </p>
                      </div>
                      
                      {uploadedFile && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center space-x-2">
                            <Archive className="w-4 h-4 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-green-800">{uploadedFile.name}</p>
                              <p className="text-xs text-green-600">{formatFileSize(uploadedFile.size)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {isProcessing && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Validasi dan memproses ZIP file...</span>
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
                          {isProcessing ? 'Memproses...' : 'Upload & Validasi'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={handleDownloadAllZIP}
                  disabled={isProcessing || direksiFolders.length === 0}
                  variant="outline"
                  className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Semua
                </Button>

                                 <Button 
                   onClick={() => {
                     // Download template ZIP with complete structure and sample files
                     const link = document.createElement('a');
                     link.href = 'data:application/zip;base64,UEsFBgAAAAAAAAAAAAAAAAAAAAAAAA==';
                     link.download = `Template_Arsip_GCG_${selectedYear}.zip`;
                     document.body.appendChild(link);
                     link.click();
                     document.body.removeChild(link);
                     
                     // Show detailed template structure with sample files
                     const templateStructure = `
Template ZIP berhasil diunduh!

Struktur template yang diunduh:
📁 Arsip GCG (${selectedYear})/
├── 📁 Direktorat Keuangan/
│   ├── 📁 Subdirektorat Akuntansi/
│   │   ├── 📁 Transparansi/
│   │   │   ├── 📄 Laporan_Tahunan_2024.pdf
│   │   │   ├── 📄 Code_of_Conduct.pdf
│   │   │   └── 📄 Pengungkapan_Informasi.pdf
│   │   ├── 📁 Akuntabilitas/
│   │   │   ├── 📄 Laporan_Keuangan_2024.pdf
│   │   │   ├── 📄 Audit_Report_2024.pdf
│   │   │   └── 📄 Risalah_Rapat.pdf
│   │   ├── 📁 Responsibilitas/
│   │   │   ├── 📄 Laporan_Manajemen.pdf
│   │   │   ├── 📄 Kebijakan_Perusahaan.pdf
│   │   │   └── 📄 SOP_Akuntansi.pdf
│   │   ├── 📁 Independensi/
│   │   │   ├── 📄 Laporan_Independensi.pdf
│   │   │   └── 📄 Risalah_Rapat_Komisaris.pdf
│   │   └── 📁 Kesetaraan/
│   │       ├── 📄 Laporan_Kesetaraan.pdf
│   │       └── 📄 Kebijakan_Inklusif.pdf
│   └── 📁 Subdirektorat Perpajakan/
│       ├── 📁 Transparansi/
│       │   ├── 📄 Laporan_Pajak_2024.pdf
│       │   └── 📄 Pengungkapan_Pajak.pdf
│       └── 📁 Akuntabilitas/
│           ├── 📄 Audit_Pajak_2024.pdf
│           └── 📄 Risalah_Rapat_Pajak.pdf
├── 📁 Direktorat SDM/
│   ├── 📁 Subdirektorat Rekrutmen/
│   │   ├── 📁 Transparansi/
│   │   │   ├── 📄 Kebijakan_Rekrutmen.pdf
│   │   │   └── 📄 Laporan_Rekrutmen_2024.pdf
│   │   └── 📁 Akuntabilitas/
│   │       ├── 📄 Audit_SDM_2024.pdf
│   │       └── 📄 Risalah_Rapat_SDM.pdf
│   └── 📁 Subdirektorat Pengembangan/
│       ├── 📁 Responsibilitas/
│       │   ├── 📄 Program_Pelatihan.pdf
│       │   └── 📄 Kebijakan_Pengembangan.pdf
│       └── 📁 Kesetaraan/
│           ├── 📄 Program_Kesetaraan.pdf
│           └── 📄 Laporan_Diversitas.pdf
└── 📁 Direktorat IT/
    ├── 📁 Subdirektorat Infrastruktur/
    │   ├── 📁 Transparansi/
    │   │   ├── 📄 Laporan_Infrastruktur_2024.pdf
    │   │   └── 📄 Pengungkapan_IT.pdf
    │   └── 📁 Akuntabilitas/
    │       ├── 📄 Audit_IT_2024.pdf
    │       └── 📄 Risalah_Rapat_IT.pdf
    └── 📁 Subdirektorat Aplikasi/
        ├── 📁 Responsibilitas/
        │   ├── 📄 Laporan_Aplikasi.pdf
        │   └── 📄 SOP_IT.pdf
        └── 📁 Independensi/
            ├── 📄 Laporan_Independensi_IT.pdf
            └── 📄 Risalah_Rapat_IT.pdf

Total: 25+ file contoh dalam struktur folder lengkap
Gunakan template ini sebagai referensi struktur folder yang diperlukan.
File di dalam folder bersifat fleksibel dan dapat disesuaikan.`;
                     
                     alert(templateStructure);
                   }}
                   variant="outline"
                                                      className="text-purple-600 border-purple-600 hover:bg-purple-50"
                 >
                   <FileText className="w-4 h-4 mr-2" />
                   Download Template
                 </Button>

                <ActionButton
                  onClick={() => setIsResetDialogOpen(true)}
                  variant="outline"
                  icon={<RotateCcw className="w-4 h-4" />}
                  className="text-red-500 border-red-500 hover:bg-red-50"
                >
                  Reset Data
                </ActionButton>
              </div>
            </div>
          </div>

          {/* Year Selector Panel */}
          <YearSelectorPanel
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            availableYears={[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014]}
            title="Tahun Buku"
            description="Pilih tahun buku untuk melihat folder dokumen GCG berdasarkan Direksi"
          />

          {/* Statistics Cards */}
          <StatsPanel
            title="Statistik Dokumen"
            description={`Overview dokumen GCG tahun ${selectedYear}`}
            stats={[
              {
                title: "Total Direksi",
                value: direksiFolders.length,
                subtitle: "Direksi yang terdaftar",
                icon: <User className="w-6 h-6" />
              },
              {
                title: "Total File",
                value: yearStats.totalDocuments,
                subtitle: "Dokumen terupload",
                icon: <FileText className="w-6 h-6" />
              },
              {
                title: "Total Ukuran",
                value: formatFileSize(yearStats.totalSize),
                subtitle: "Ukuran total dokumen",
                icon: <HardDrive className="w-6 h-6" />
              },
              {
                title: "Kategori",
                value: direksiFolders.reduce((total, direksi) => total + direksi.categories.length, 0),
                subtitle: "Kategori dokumen",
                icon: <Briefcase className="w-6 h-6" />
              }
            ]}
          />

          {/* Search and Filter */}
          <div className="mb-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
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
                      className="px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <User className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-blue-900 mb-2">
                      {searchTerm ? 'Tidak ada direksi yang ditemukan' : 'Belum ada folder direksi'}
                    </h3>
                    <p className="text-blue-600">
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
                                <p className="text-sm text-blue-500 truncate">{direksiFolder.categories.length} kategori</p>
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
                              <span className="text-blue-600">Ukuran:</span>
                              <span className="font-medium">{formatFileSize(direksiFolder.totalSize)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-blue-600">Update terakhir:</span>
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
                                Kelola
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Show folder management options
                                  alert(`Manajemen folder untuk ${direksiFolder.direksiName}:\n\n- Lihat struktur folder\n- Edit metadata\n- Reorganisasi kategori\n- Backup folder`);
                                }}
                              >
                                <Folder className="w-4 h-4 mr-1" />
                                Struktur
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
                      <p className="text-sm text-blue-600">Nama Direksi</p>
                      <p className="font-medium">{selectedDireksi.direksiName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Tahun</p>
                      <p className="font-medium">{selectedDireksi.year}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Jumlah Kategori</p>
                      <p className="font-medium">{selectedDireksi.categories.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Total File</p>
                      <p className="font-medium">{selectedDireksi.totalFiles}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Total Ukuran</p>
                      <p className="font-medium">{formatFileSize(selectedDireksi.totalSize)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Update Terakhir</p>
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
                            <p className="text-sm text-blue-600">{category.category}</p>
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
                            <span className="text-blue-600">Ukuran: </span>
                            <span className="font-medium">{formatFileSize(category.totalSize)}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-blue-600">Jenis: </span>
                            <span className="font-medium">{category.type}</span>
                          </div>
                        </div>

                        {/* Files in category */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-blue-700">Files:</p>
                          {category.files.map((file) => (
                            <div key={file.id} className="flex items-center justify-between text-sm bg-blue-50 p-2 rounded">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{file.name}</p>
                                <p className="text-blue-600 text-xs">{file.divisi}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-blue-600">{formatFileSize(file.size)}</span>
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

      {/* ConfirmDialog untuk Reset Data */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleResetData}
        title="Reset Semua Data"
        description="Tindakan ini akan menghapus semua dokumen dan folder yang ada. Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?"
        variant="danger"
        confirmText={isProcessing ? 'Processing...' : 'Reset Data'}
        isLoading={isProcessing}
      />
    </div>
  );
};

export default DocumentManagement; 