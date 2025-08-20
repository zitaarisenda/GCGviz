import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Clock, FolderOpen } from 'lucide-react';
import DocumentList from '@/components/dashboard/DocumentList';

interface DocumentArchiveSectionProps {
  selectedYear: number;
  yearDocuments: any[];
  filteredDocuments: any[];
  downloadType: 'all' | 'aspect' | 'direktorat' | 'subdirektorat';
  selectedAspect: string;
  selectedDirektorat: string;
  selectedSubDirektorat: string;
}

const DocumentArchiveSection: React.FC<DocumentArchiveSectionProps> = ({
  selectedYear,
  yearDocuments,
  filteredDocuments,
  downloadType,
  selectedAspect,
  selectedDirektorat,
  selectedSubDirektorat
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getTotalSize = (docs: any[]) => {
    return docs.reduce((total, doc) => total + (doc.fileSize || 0), 0);
  };

  const getFilterDescription = () => {
    switch (downloadType) {
      case 'aspect':
        return selectedAspect ? `Aspek: ${selectedAspect}` : 'Semua Aspek';
      case 'direktorat':
        return selectedDirektorat ? `Direktorat: ${selectedDirektorat}` : 'Semua Direktorat';
      case 'subdirektorat':
        return selectedSubDirektorat ? `Subdirektorat: ${selectedSubDirektorat}` : 'Semua Subdirektorat';
      default:
        return 'Semua Dokumen';
    }
  };

  return (
    <div className="space-y-6">
      {/* Archive Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-900">
            <FolderOpen className="w-6 h-6 text-green-600" />
            <span>Arsip Dokumen - Tahun {selectedYear}</span>
          </CardTitle>
          <CardDescription className="text-green-700">
            {getFilterDescription()} • {filteredDocuments.length} dokumen tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{filteredDocuments.length}</div>
              <div className="text-sm text-green-700">Total Dokumen</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{selectedYear}</div>
              <div className="text-sm text-green-700">Tahun Buku</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">
                {formatFileSize(getTotalSize(filteredDocuments))}
              </div>
              <div className="text-sm text-green-700">Total Ukuran</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <span>Daftar Dokumen</span>
          </CardTitle>
          <CardDescription>
            Dokumen yang tersedia untuk download berdasarkan filter yang dipilih
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentList 
            documents={filteredDocuments}
            showActions={false}
            showFilters={false}
          />
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada dokumen</h3>
          <p className="text-gray-500">
            Tidak ada dokumen yang tersedia untuk tahun {selectedYear} dengan filter yang dipilih
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentArchiveSection;
