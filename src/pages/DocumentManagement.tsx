import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import DocumentList from '@/components/dashboard/DocumentList';
import FileUploadDialog from '@/components/dashboard/FileUploadDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import { useFileUpload } from '@/contexts/FileUploadContext';
import { 
  FileText, 
  Upload, 
  BarChart3, 
  Calendar,
  Building2,
  Users,
  Download,
  Plus,
  RotateCcw
} from 'lucide-react';
import { resetDocumentMetadata } from '@/lib/utils';

const DocumentManagement = () => {
  const { selectedYear } = useFileUpload();
  const { getYearStats } = useDocumentMetadata();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const yearStats = selectedYear ? getYearStats(selectedYear) : {
    totalDocuments: 0,
    totalSize: 0,
    byPrinciple: {},
    byType: {},
    byDireksi: {}
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!selectedYear) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Topbar />
        
        <div className="ml-64 pt-16">
          <div className="p-6">
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Pilih Tahun Buku
              </h3>
              <p className="text-gray-600">
                Silakan pilih tahun buku di dashboard untuk melihat manajemen dokumen
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
      
      <div className="ml-64 pt-16">
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Dokumen</h1>
                <p className="text-gray-600 mt-2">
                  Kelola dan monitor dokumen GCG untuk tahun {selectedYear}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline"
                  onClick={resetDocumentMetadata}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Data
                </Button>
                <Button 
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Dokumen Baru
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Dokumen</p>
                    <p className="text-3xl font-bold">{yearStats.totalDocuments}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Ukuran</p>
                    <p className="text-3xl font-bold">{formatFileSize(yearStats.totalSize)}</p>
                  </div>
                  <Download className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Prinsip GCG</p>
                    <p className="text-3xl font-bold">{Object.keys(yearStats.byPrinciple).length}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Direksi Aktif</p>
                    <p className="text-3xl font-bold">{Object.keys(yearStats.byDireksi).length}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* By Principle */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <span>Dokumen per Prinsip GCG</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(yearStats.byPrinciple).map(([principle, count]) => (
                    <div key={principle} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{principle}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                  {Object.keys(yearStats.byPrinciple).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Belum ada dokumen
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* By Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span>Dokumen per Jenis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(yearStats.byType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{type}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                  {Object.keys(yearStats.byType).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Belum ada dokumen
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* By Direksi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span>Dokumen per Direksi</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(yearStats.byDireksi).map(([direksi, count]) => (
                    <div key={direksi} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 truncate max-w-[150px]" title={direksi}>
                        {direksi}
                      </span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                  {Object.keys(yearStats.byDireksi).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Belum ada dokumen
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document List */}
          <DocumentList showFilters={true} />
        </div>
      </div>

      {/* File Upload Dialog */}
      <FileUploadDialog
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </div>
  );
};

export default DocumentManagement; 