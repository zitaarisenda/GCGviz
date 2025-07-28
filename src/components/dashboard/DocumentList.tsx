import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import { useFileUpload } from '@/contexts/FileUploadContext';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Calendar,
  Building2,
  User,
  FileDown,
  ExternalLink,
  Trash2,
  Edit,
  CheckCircle,
  Circle
} from 'lucide-react';
import { Label } from '@/components/ui/label';

interface DocumentListProps {
  year?: number;
  showFilters?: boolean;
  maxItems?: number;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  year, 
  showFilters = true, 
  maxItems 
}) => {
  const { documents, getDocumentsByYear, deleteDocument } = useDocumentMetadata();
  const { selectedYear } = useFileUpload();
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrinciple, setSelectedPrinciple] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDireksi, setSelectedDireksi] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // View document state
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Get documents for the specified year or selected year
  const targetYear = year || selectedYear || new Date().getFullYear();
  const yearDocuments = useMemo(() => {
    return getDocumentsByYear(targetYear);
  }, [getDocumentsByYear, targetYear]);

  // Filter documents
  const filteredDocuments = useMemo(() => {
    let filtered = yearDocuments;

    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedPrinciple !== 'all') {
      filtered = filtered.filter(doc => doc.gcgPrinciple === selectedPrinciple);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(doc => doc.documentType === selectedType);
    }

    if (selectedDireksi !== 'all') {
      filtered = filtered.filter(doc => doc.direksi === selectedDireksi);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(doc => doc.status === selectedStatus);
    }

    return maxItems ? filtered.slice(0, maxItems) : filtered;
  }, [yearDocuments, searchTerm, selectedPrinciple, selectedType, selectedDireksi, selectedStatus, maxItems]);

  // Get unique values for filters
  const principles = useMemo(() => [...new Set(yearDocuments.map(doc => doc.gcgPrinciple))], [yearDocuments]);
  const types = useMemo(() => [...new Set(yearDocuments.map(doc => doc.documentType))], [yearDocuments]);
  const direksis = useMemo(() => [...new Set(yearDocuments.map(doc => doc.direksi))], [yearDocuments]);
  const statuses = useMemo(() => [...new Set(yearDocuments.map(doc => doc.status))], [yearDocuments]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'draft': { variant: 'outline', className: 'text-yellow-600 border-yellow-300' },
      'review': { variant: 'outline', className: 'text-blue-600 border-blue-300' },
      'approved': { variant: 'default', className: 'bg-green-100 text-green-700 border-green-200' },
      'rejected': { variant: 'destructive', className: 'bg-red-100 text-red-700 border-red-200' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge variant={config.variant as any} className={`text-xs ${config.className}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getConfidentialityBadge = (level: string) => {
    const levelConfig = {
      'public': { variant: 'outline', className: 'text-green-600 border-green-300' },
      'confidential': { variant: 'outline', className: 'text-red-600 border-red-300' }
    };
    
    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.public;
    
    return (
      <Badge variant={config.variant as any} className={`text-xs ${config.className}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  const handleDeleteDocument = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
      deleteDocument(id);
    }
  };

  if (!targetYear) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Pilih Tahun Buku
          </h3>
          <p className="text-gray-600">
            Silakan pilih tahun buku untuk melihat dokumen
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Daftar Dokumen</h2>
            <p className="text-sm text-gray-600">
              {filteredDocuments.length} dokumen ditemukan untuk tahun {targetYear}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-900">Filter & Pencarian</span>
          </div>
          
          {/* Search */}
          <div className="mb-4">
            <Input
              placeholder="Cari berdasarkan judul, deskripsi, nomor dokumen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
                <SelectTrigger>
                  <SelectValue placeholder="Prinsip GCG" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Prinsip</SelectItem>
                  {principles.map(principle => (
                    <SelectItem key={principle} value={principle}>{principle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Jenis Dokumen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedDireksi} onValueChange={setSelectedDireksi}>
                <SelectTrigger>
                  <SelectValue placeholder="Direksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Direksi</SelectItem>
                  {direksis.map(direksi => (
                    <SelectItem key={direksi} value={direksi}>{direksi}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocuments.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                      {doc.title}
                    </h3>
                    {doc.documentNumber && (
                      <p className="text-sm text-gray-600 mt-1">
                        No. {doc.documentNumber}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Description */}
                {doc.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {doc.description}
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2 ml-4">
                <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedDocument(doc)}
                      className="hover:bg-blue-50 hover:border-blue-200"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                  </DialogTrigger>
                  
                  <Button variant="outline" size="sm" className="hover:bg-green-50 hover:border-green-200">
                    <Download className="w-4 h-4 mr-1" />
                    Unduh
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="hover:bg-red-50 hover:border-red-200"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Hapus
                  </Button>
                </Dialog>
              </div>
            </div>
            
            {/* Metadata Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              {/* GCG Classification */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">Klasifikasi GCG</span>
                </div>
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
                    {doc.gcgPrinciple}
                  </Badge>
                  <div className="text-sm text-gray-600">{doc.documentType}</div>
                  {doc.documentCategory && (
                    <div className="text-xs text-gray-500">{doc.documentCategory}</div>
                  )}
                </div>
              </div>
              
              {/* Organization */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">Organisasi</span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-900">{doc.direksi}</div>
                  <div className="text-xs text-gray-600">{doc.division}</div>
                </div>
              </div>
              
              {/* Status & Upload Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">Status</span>
                </div>
                <div className="space-y-1">
                  {getStatusBadge(doc.status)}
                  {getConfidentialityBadge(doc.confidentiality)}
                </div>
              </div>
              
              {/* Upload Info & Checklist */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs font-medium text-gray-700">Info Upload</span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-900">{doc.uploadedBy}</div>
                  <div className="text-xs text-gray-600">{formatDate(doc.uploadDate)}</div>
                  
                  {/* Checklist GCG Badge */}
                  {doc.checklistId ? (
                    <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Checklist GCG
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
                      <Circle className="w-3 h-3 mr-1" />
                      Tanpa Checklist
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada dokumen ditemukan
            </h3>
            <p className="text-gray-600">
              Coba ubah kriteria pencarian atau filter Anda
            </p>
          </div>
        )}

        {/* Document Detail Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Detail Dokumen</span>
              </DialogTitle>
            </DialogHeader>
            {selectedDocument && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Informasi Dasar
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Judul Dokumen</Label>
                      <p className="text-sm text-gray-900">{selectedDocument.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Nomor Dokumen</Label>
                      <p className="text-sm text-gray-900">{selectedDocument.documentNumber || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Tanggal Dokumen</Label>
                      <p className="text-sm text-gray-900">{formatDate(selectedDocument.documentDate)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Deskripsi</Label>
                      <p className="text-sm text-gray-900">{selectedDocument.description || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* GCG Classification */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Klasifikasi GCG
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Prinsip GCG</Label>
                      <p className="text-sm text-gray-900">{selectedDocument.gcgPrinciple}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Jenis Dokumen</Label>
                      <p className="text-sm text-gray-900">{selectedDocument.documentType}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Kategori</Label>
                      <p className="text-sm text-gray-900">{selectedDocument.documentCategory || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Organisasi
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Direksi</Label>
                      <p className="text-sm text-gray-900">{selectedDocument.direksi}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Divisi</Label>
                      <p className="text-sm text-gray-900">{selectedDocument.division}</p>
                    </div>
                  </div>
                </div>

                {/* File Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Informasi File
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Nama File</Label>
                      <p className="text-sm text-gray-900">{selectedDocument.fileName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Ukuran File</Label>
                      <p className="text-sm text-gray-900">{formatFileSize(selectedDocument.fileSize)}</p>
                    </div>
                  </div>
                </div>

                {/* Document Management */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Pengelolaan Dokumen
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedDocument.status)}</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Kerahasiaan</Label>
                      <div className="mt-1">{getConfidentialityBadge(selectedDocument.confidentiality)}</div>
                    </div>
                  </div>
                </div>

                {/* Upload Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Informasi Upload
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Diupload oleh</Label>
                      <p className="text-sm text-gray-900">{selectedDocument.uploadedBy}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Tanggal Upload</Label>
                      <p className="text-sm text-gray-900">{formatDate(selectedDocument.uploadDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-4 border-t">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buka File
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Unduh
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DocumentList; 