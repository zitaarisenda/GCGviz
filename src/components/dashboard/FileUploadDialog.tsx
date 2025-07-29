import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from '@/contexts/UserContext';
import { useDireksi } from '@/contexts/DireksiContext';
import { useFileUpload } from '@/contexts/FileUploadContext';
import { useChecklist } from '@/contexts/ChecklistContext';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import { useYear } from '@/contexts/YearContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  FileText, 
  Calendar, 
  Building2, 
  Users, 
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Download
} from 'lucide-react';

interface FileUploadDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  checklistId?: number;
  checklistDescription?: string;
  aspect?: string;
  trigger?: React.ReactNode;
}

interface UploadFormData {
  // Basic Information
  title: string;
  documentNumber: string;
  documentDate: string;
  description: string;
  
  // GCG Classification
  gcgPrinciple: string;
  documentType: string;
  documentCategory: string;
  
  // Organizational Information
  direksi: string;
  division: string;
  divisionSuggestion: string;
  
  // File Information
  file: File | null;
  fileName: string;
  fileSize: number;
  
  // Additional Metadata
  status: string;
  confidentiality: string;
  
  // Checklist Information
  selectedChecklistId: number | null;
  
  // Year (auto-filled)
  year: number;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  isOpen,
  onOpenChange,
  checklistId,
  checklistDescription,
  aspect,
  trigger
}) => {
  const { user } = useUser();
  const { direksi } = useDireksi();
  const { uploadFile } = useFileUpload();
  const { selectedYear } = useYear();
  const { checklist } = useChecklist();
  const { documents, addDocument } = useDocumentMetadata();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    documentNumber: '',
    documentDate: '',
    description: '',
    gcgPrinciple: '',
    documentType: '',
    documentCategory: '',
    direksi: '',
    division: '',
    divisionSuggestion: '',
    file: null,
    fileName: '',
    fileSize: 0,
    status: 'draft',
    confidentiality: 'public',
    selectedChecklistId: null,
    year: selectedYear || new Date().getFullYear()
  });

  // UI state
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customDivision, setCustomDivision] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedAspectFilter, setSelectedAspectFilter] = useState<string>('');

  // Auto-fill form when checklist data is provided
  useEffect(() => {
    if (checklistId && checklistDescription && aspect) {
      setFormData(prev => ({
        ...prev,
        title: checklistDescription,
        description: checklistDescription,
        gcgPrinciple: getPrincipleFromAspect(aspect),
        documentCategory: getCategoryFromAspect(aspect),
        selectedChecklistId: checklistId,
        year: selectedYear || new Date().getFullYear()
      }));
    }
  }, [checklistId, checklistDescription, aspect, selectedYear]);

  // Update year when selectedYear changes
  useEffect(() => {
    if (selectedYear) {
      setFormData(prev => ({ ...prev, year: selectedYear }));
    }
  }, [selectedYear]);

  // Get available checklist items (not used in current year) with sorting
  const getAvailableChecklistItems = useCallback(() => {
    if (!selectedYear) return [];
    
    const usedChecklistIds = documents
      .filter(doc => doc.year === selectedYear && doc.checklistId)
      .map(doc => doc.checklistId);
    
    const availableItems = checklist.filter(item => !usedChecklistIds.includes(item.id));
    
    // Sort by aspect (Komitmen, RUPS, etc.)
    return availableItems.sort((a, b) => {
      const aspectA = a.aspek.toLowerCase();
      const aspectB = b.aspek.toLowerCase();
      return aspectA.localeCompare(aspectB);
    });
  }, [documents, checklist, selectedYear]);

  // Auto-fill direksi and division for non-superadmin users
  useEffect(() => {
    if (user && user.role !== 'superadmin') {
      // TODO: Get user's direksi and division from user profile
      // For now, we'll leave it empty
    }
  }, [user]);

  // Constants for dropdowns
  const gcgPrinciples = [
    'Transparansi',
    'Akuntabilitas', 
    'Responsibilitas',
    'Independensi',
    'Kesetaraan'
  ];

  const documentTypes = [
    'Kebijakan',
    'Laporan',
    'Risalah',
    'Dokumentasi',
    'Sosialisasi',
    'Peraturan',
    'SOP',
    'Pedoman',
    'Manual',
    'Piagam',
    'Surat Keputusan',
    'Surat Edaran',
    'Nota Dinas',
    'Lainnya'
  ];

  const documentCategories = [
    'Laporan Keuangan',
    'Laporan Manajemen',
    'Laporan Audit',
    'Laporan Triwulan',
    'Laporan Tahunan',
    'Risalah Rapat Direksi',
    'Risalah Rapat Komisaris',
    'Risalah Rapat Komite',
    'Code of Conduct',
    'Board Manual',
    'Pedoman Tata Kelola',
    'Kebijakan Manajemen Risiko',
    'Kebijakan Pengendalian Intern',
    'LHKPN',
    'WBS',
    'CV Dewan',
    'Surat Pernyataan',
    'Pakta Integritas',
    'Lainnya'
  ];

  const confidentialityLevels = [
    { value: 'public', label: 'Publik' },
    { value: 'confidential', label: 'Rahasia' }
  ];

  const documentStatuses = [
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'Dalam Review' },
    { value: 'approved', label: 'Disetujui' },
    { value: 'final', label: 'Final' },
    { value: 'archived', label: 'Diarsipkan' }
  ];

  // Division suggestions based on direksi
  const getDivisionSuggestions = (direksiName: string) => {
    const suggestions: { [key: string]: string[] } = {
      'Direktorat Bisnis Kurir dan Logistik': [
        'Divisi Operasional Kurir',
        'Divisi Logistik',
        'Divisi Customer Service',
        'Divisi Pengembangan Bisnis Kurir'
      ],
      'Direktorat Business Development and Portofolio Management': [
        'Divisi Pengembangan Bisnis',
        'Divisi Portofolio',
        'Divisi Strategic Planning',
        'Divisi Investment Management'
      ],
      'Direktorat Human Capital Management': [
        'Divisi Rekrutmen',
        'Divisi Training & Development',
        'Divisi Compensation & Benefits',
        'Divisi Industrial Relations'
      ],
      'Direktorat Bisnis Jasa Keuangan': [
        'Divisi Perbankan',
        'Divisi Asuransi',
        'Divisi Investasi',
        'Divisi Treasury'
      ],
      'Non Direktorat': [
        'Divisi Sekretaris Perusahaan',
        'Divisi Hukum',
        'Divisi Internal Audit',
        'Divisi Manajemen Risiko',
        'Divisi Teknologi Informasi',
        'Divisi Keuangan',
        'Divisi Akuntansi'
      ]
    };
    return suggestions[direksiName] || [];
  };

  // Get unique aspects for sorting
  const getUniqueAspects = useCallback(() => {
    const aspects = getAvailableChecklistItems().map(item => item.aspek);
    return [...new Set(aspects)].sort();
  }, [getAvailableChecklistItems]);

  // Helper functions
  const getPrincipleFromAspect = (aspect: string): string => {
    if (aspect.includes('Komitmen')) return 'Transparansi';
    if (aspect.includes('RUPS')) return 'Akuntabilitas';
    if (aspect.includes('Dewan Komisaris')) return 'Independensi';
    if (aspect.includes('Direksi')) return 'Responsibilitas';
    if (aspect.includes('Pengungkapan')) return 'Kesetaraan';
    return 'Transparansi';
  };

  const getCategoryFromAspect = (aspect: string): string => {
    if (aspect.includes('Komitmen')) return 'Code of Conduct';
    if (aspect.includes('RUPS')) return 'Risalah Rapat';
    if (aspect.includes('Dewan Komisaris')) return 'Risalah Rapat Komisaris';
    if (aspect.includes('Direksi')) return 'Laporan Manajemen';
    if (aspect.includes('Pengungkapan')) return 'Laporan Tahunan';
    return 'Lainnya';
  };

  const validateAndSetFile = (file: File) => {
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File terlalu besar",
        description: "Ukuran file maksimal 10MB",
        variant: "destructive"
      });
      return false;
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Format file tidak didukung",
        description: "Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX",
        variant: "destructive"
      });
      return false;
    }

    setSelectedFile(file);
    setFormData(prev => ({
      ...prev,
      file,
      fileName: file.name,
      fileSize: file.size
    }));
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast({
        title: "File belum dipilih",
        description: "Silakan pilih file yang akan diupload",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title) {
      toast({
        title: "Data tidak lengkap",
        description: "Judul dokumen wajib diisi",
        variant: "destructive"
      });
      return;
    }

    if (!formData.gcgPrinciple) {
      toast({
        title: "Data tidak lengkap",
        description: "Prinsip GCG wajib diisi",
        variant: "destructive"
      });
      return;
    }

    if (!formData.documentType) {
      toast({
        title: "Data tidak lengkap",
        description: "Jenis dokumen wajib diisi",
        variant: "destructive"
      });
      return;
    }

    if (user?.role === 'superadmin' && (!formData.direksi || !formData.division)) {
      toast({
        title: "Data tidak lengkap",
        description: "Direksi dan divisi wajib diisi untuk Super Admin",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Get selected checklist item (if any)
      const selectedChecklist = formData.selectedChecklistId 
        ? checklist.find(item => item.id === formData.selectedChecklistId)
        : null;
      
      // Upload file using context
      uploadFile(
        selectedFile,
        selectedYear,
        formData.selectedChecklistId || 0,
        selectedChecklist?.deskripsi || '',
        selectedChecklist?.aspek || ''
      );

      // Save metadata using context
      addDocument({
        ...formData,
        documentDate: new Date().toISOString().split('T')[0], // Auto-fill current date
        uploadedBy: user?.username || 'Unknown',
        checklistId: formData.selectedChecklistId || undefined,
        checklistDescription: selectedChecklist?.deskripsi || '',
        aspect: selectedChecklist?.aspek || ''
      });

      toast({
        title: "Upload berhasil",
        description: "Dokumen berhasil diupload dan metadata tersimpan",
      });

      // Reset form
      setFormData({
        title: '',
        documentNumber: '',
        documentDate: '',
        description: '',
        gcgPrinciple: '',
        documentType: '',
        documentCategory: '',
        direksi: '',
        division: '',
        divisionSuggestion: '',
        file: null,
        fileName: '',
        fileSize: 0,
        status: 'draft',
        confidentiality: 'public',
        selectedChecklistId: null,
        year: selectedYear || new Date().getFullYear()
      });
      setSelectedFile(null);
      onOpenChange(false);

    } catch (error) {
      toast({
        title: "Upload gagal",
        description: "Terjadi kesalahan saat upload dokumen",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>Upload Dokumen GCG</span>
          </DialogTitle>
          <DialogDescription>
            Lengkapi metadata dokumen untuk memastikan pengelolaan yang baik
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section - Moved to top */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Upload File
            </h3>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setSelectedFile(null);
                      setFormData(prev => ({ ...prev, file: null, fileName: '', fileSize: 0 }));
                    }}
                  >
                    Ganti File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Drag and drop file di sini, atau klik untuk memilih
                    </p>
                    <p className="text-sm text-gray-600">
                      Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Maksimal 10MB)
                    </p>
                  </div>
                  <Input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    className="hidden"
                    id="file-upload"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Pilih File
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Year Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Tahun Buku</span>
            </div>
            <p className="text-blue-700">
              Dokumen akan dikategorikan untuk tahun buku: <strong>{formData.year}</strong>
            </p>
          </div>



          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Informasi Dasar Dokumen
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Judul Dokumen <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Masukkan judul dokumen"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Nomor Dokumen</Label>
                <Input
                  id="documentNumber"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
                  placeholder="Contoh: AI/RPT/2024/001"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi/Catatan</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Deskripsi singkat tentang dokumen ini"
                rows={3}
              />
            </div>
          </div>

          {/* GCG Classification */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Klasifikasi GCG
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gcgPrinciple">
                  Prinsip GCG <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.gcgPrinciple} onValueChange={(value) => setFormData(prev => ({ ...prev, gcgPrinciple: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih prinsip GCG" />
                  </SelectTrigger>
                  <SelectContent>
                    {gcgPrinciples.map(principle => (
                      <SelectItem key={principle} value={principle}>{principle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentType">
                  Jenis Dokumen <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.documentType} onValueChange={(value) => setFormData(prev => ({ ...prev, documentType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis dokumen" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentCategory">Kategori Dokumen</Label>
                <Select value={formData.documentCategory} onValueChange={(value) => setFormData(prev => ({ ...prev, documentCategory: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Organizational Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Informasi Organisasi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="direksi">
                  Direksi <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.direksi} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      direksi: value,
                      division: '' // Reset division when direksi changes
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih direksi" />
                  </SelectTrigger>
                  <SelectContent>
                    {direksi.map(d => (
                      <SelectItem key={d.id} value={d.nama}>{d.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="division">
                  Divisi <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-2">
                  <Select 
                    value={formData.division} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, division: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih divisi" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.direksi && getDivisionSuggestions(formData.direksi).map(division => (
                        <SelectItem key={division} value={division}>{division}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {formData.direksi && (
                    <div className="space-y-2">
                      <Label htmlFor="customDivision">Atau ketik divisi manual</Label>
                      <Input
                        id="customDivision"
                        value={customDivision}
                        onChange={(e) => {
                          setCustomDivision(e.target.value);
                          setFormData(prev => ({ ...prev, division: e.target.value }));
                        }}
                        placeholder="Ketik nama divisi jika tidak ada di daftar"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Document Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Pengelolaan Dokumen
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status Dokumen</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentStatuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confidentiality">Tingkat Kerahasiaan</Label>
                <Select value={formData.confidentiality} onValueChange={(value) => setFormData(prev => ({ ...prev, confidentiality: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tingkat kerahasiaan" />
                  </SelectTrigger>
                  <SelectContent>
                    {confidentialityLevels.map(level => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Checklist Selection - Moved to bottom */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Pilih Checklist GCG (Opsional)
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Pilih satu checklist GCG yang sesuai dengan dokumen yang akan diupload. 
                Checklist yang sudah digunakan di tahun {selectedYear} tidak akan muncul di daftar.
              </p>
              
              {/* Aspect Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Filter berdasarkan Aspek:</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={!selectedAspectFilter ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setSelectedAspectFilter('')}
                  >
                    Semua
                  </Badge>
                  {getUniqueAspects().map((aspect) => (
                    <Badge
                      key={aspect}
                      variant={selectedAspectFilter === aspect ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => setSelectedAspectFilter(aspect)}
                    >
                      {aspect.replace(/^Aspek\s+/i, '')}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-lg p-4 space-y-2">
                {getAvailableChecklistItems()
                  .filter(item => !selectedAspectFilter || item.aspek === selectedAspectFilter)
                  .map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                      <Checkbox
                        id={`checklist-${item.id}`}
                        checked={formData.selectedChecklistId === item.id}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData(prev => ({
                              ...prev,
                              selectedChecklistId: item.id,
                              title: prev.title || item.deskripsi,
                              description: prev.description || item.deskripsi,
                              gcgPrinciple: getPrincipleFromAspect(item.aspek),
                              documentCategory: getCategoryFromAspect(item.aspek)
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              selectedChecklistId: null
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={`checklist-${item.id}`} className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-gray-900 flex-1">
                            {item.deskripsi}
                          </div>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {item.aspek.replace(/^Aspek\s+/i, '')}
                          </Badge>
                        </div>
                      </Label>
                    </div>
                  ))}
                {getAvailableChecklistItems().filter(item => !selectedAspectFilter || item.aspek === selectedAspectFilter).length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    {selectedAspectFilter 
                      ? `Tidak ada checklist tersedia untuk ${selectedAspectFilter.replace(/^Aspek\s+/i, '')}`
                      : `Semua checklist GCG untuk tahun ${selectedYear} sudah digunakan`
                    }
                  </p>
                )}
              </div>
              
              {/* Selected Checklist Info */}
              {formData.selectedChecklistId && (() => {
                const selectedItem = getAvailableChecklistItems().find(item => item.id === formData.selectedChecklistId);
                return selectedItem ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        Checklist Terpilih
                      </span>
                    </div>
                    <div className="text-sm text-green-700">
                      <div className="font-medium">{selectedItem.aspek}</div>
                      <div>{selectedItem.deskripsi}</div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || !selectedFile}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Dokumen
                </>
              )}
            </Button>
          </div>
        </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog; 