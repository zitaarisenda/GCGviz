import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminSidebar from '@/components/layout/AdminSidebar';
import Topbar from '@/components/layout/Topbar';
import { useSidebar } from '@/contexts/SidebarContext';
import { useYear } from '@/contexts/YearContext';
import { useUser } from '@/contexts/UserContext';
import { useChecklist } from '@/contexts/ChecklistContext';
import { useFileUpload } from '@/contexts/FileUploadContext';
import { PageHeaderPanel } from '@/components/panels';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Calendar, 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  Clock,
  Eye
} from 'lucide-react';
import FileUploadDialog from '@/components/dashboard/FileUploadDialog';
import YearStatisticsPanel from '@/components/dashboard/YearStatisticsPanel';

interface ChecklistAssignment {
  id: number;
  checklistId: number;
  subdirektorat: string;
  aspek: string;
  deskripsi: string;
  tahun: number;
  assignedBy: string;
  assignedAt: Date;
  status: 'assigned' | 'in_progress' | 'completed';
  notes?: string;
}

const AdminDashboard = () => {
  const { isSidebarOpen } = useSidebar();
  const { selectedYear, setSelectedYear, availableYears } = useYear();
  const { user } = useUser();
  const { checklist } = useChecklist();
  const { getFilesByYear } = useFileUpload();
  const [searchParams] = useSearchParams();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedChecklist, setSelectedChecklist] = useState<any>(null);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Get URL parameters
  const filterYear = searchParams.get('year');

  // Set initial year if provided
  useEffect(() => {
    if (filterYear && parseInt(filterYear) !== selectedYear) {
      setSelectedYear(parseInt(filterYear));
    }
  }, [filterYear, selectedYear, setSelectedYear]);

  // Get user's organizational info
  const userDirektorat = (user as any)?.direktorat || '';
  const userSubDirektorat = (user as any)?.subdirektorat || (user as any)?.subDirektorat || '';
  const userDivisi = (user as any)?.divisi || '';

  // Get assigned checklists for this user's subdirektorat
  const getAssignedChecklists = () => {
    try {
      const assignments = localStorage.getItem('checklistAssignments');
      if (!assignments) return [];
      
      const assignmentsList = JSON.parse(assignments) as ChecklistAssignment[];
      
      const filtered = assignmentsList.filter(
        assignment => 
          assignment.subdirektorat === userSubDirektorat && 
          assignment.tahun === selectedYear
      );
      
      return filtered;
    } catch (error) {
      console.error('Error getting assigned checklists:', error);
      return [];
    }
  };

  // Get user's documents
  const getUserDocuments = () => {
    try {
      const documents = localStorage.getItem('documents');
      if (!documents) return [];
      
      const documentsList = JSON.parse(documents);
      
      const filtered = documentsList.filter(
        (doc: any) => 
          doc.subdirektorat === userSubDirektorat && 
          doc.tahun === selectedYear
      );
      
      return filtered;
    } catch (error) {
      console.error('Error getting user documents:', error);
      return [];
    }
  };

  // Get user documents with memoization and force update
  const userDocuments = useMemo(() => {
    return getUserDocuments();
  }, [selectedYear, userSubDirektorat, forceUpdate]);

  // Listen for data updates
  useEffect(() => {
    const handleDataUpdate = () => {
      // Force re-render when data changes
      setForceUpdate(prev => prev + 1);
    };

    window.addEventListener('assignmentsUpdated', handleDataUpdate);
    window.addEventListener('documentsUpdated', handleDataUpdate);
    window.addEventListener('fileUploaded', handleDataUpdate);

    return () => {
      window.removeEventListener('assignmentsUpdated', handleDataUpdate);
      window.removeEventListener('documentsUpdated', handleDataUpdate);
      window.removeEventListener('fileUploaded', handleDataUpdate);
    };
  }, []);

  // Force update when user data changes
  useEffect(() => {
    if (user && userSubDirektorat) {
      setForceUpdate(prev => prev + 1);
    }
  }, [user, userSubDirektorat]);

  // Calculate progress statistics
  const progressStats = useMemo(() => {
    const assignedChecklists = getAssignedChecklists();
    
    // Group by aspect
    const aspectStats: { [key: string]: { total: number; completed: number; documents: any[] } } = {};
    
    assignedChecklists.forEach(assignment => {
      if (!aspectStats[assignment.aspek]) {
        aspectStats[assignment.aspek] = { total: 0, completed: 0, documents: [] };
      }
      aspectStats[assignment.aspek].total++;
      
      // Check if document exists for this checklist
      const hasDocument = userDocuments.some(doc => 
        doc.checklistId === assignment.checklistId
      );
      if (hasDocument) {
        aspectStats[assignment.aspek].completed++;
      }
    });

    // Calculate overall progress
    const totalAssigned = assignedChecklists.length;
    const totalCompleted = userDocuments.length;
    const overallProgress = totalAssigned > 0 ? (totalCompleted / totalAssigned) * 100 : 0;

    return {
      overallProgress,
      totalAssigned,
      totalCompleted,
      aspectStats
    };
  }, [userDocuments, forceUpdate]);

  const assignedChecklists = useMemo(() => {
    return getAssignedChecklists();
  }, [selectedYear, userSubDirektorat, forceUpdate]);

  // Helper: status upload per checklist (berdasarkan semua dokumen tahun ini)
  const isChecklistUploaded = React.useCallback((checklistId: number) => {
    const yearFiles = getFilesByYear(selectedYear);
    return yearFiles.some(file => file.checklistId === checklistId);
  }, [getFilesByYear, selectedYear]);

  const getUploadedDocumentByYear = React.useCallback((checklistId: number) => {
    const yearFiles = getFilesByYear(selectedYear);
    return yearFiles.find(file => file.checklistId === checklistId);
  }, [getFilesByYear, selectedYear]);

  // Get overall progress for admin (based on assigned checklists)
  const getOverallProgress = useMemo(() => {
    if (!selectedYear) return null;

    const totalItems = assignedChecklists.length;
    const uploadedCount = userDocuments.length;
    const progress = totalItems > 0 ? Math.round((uploadedCount / totalItems) * 100) : 0;

    return {
      aspek: 'KESELURUHAN',
      totalItems,
      uploadedCount,
      progress
    };
  }, [selectedYear, assignedChecklists, userDocuments, forceUpdate]);

  // Get aspect statistics for admin (showing all aspects like super admin)
  const getAspectStats = useMemo(() => {
    if (!selectedYear) return [];

    // Get all aspects from checklist data (like super admin)
    const yearChecklist = checklist.filter(item => item.tahun === selectedYear);
    const allAspects = [...new Set(yearChecklist.map(item => item.aspek))];
    
    // Group assigned checklists by aspect
    const aspectGroups: { [key: string]: any[] } = {};
    assignedChecklists.forEach(assignment => {
      if (!aspectGroups[assignment.aspek]) {
        aspectGroups[assignment.aspek] = [];
      }
      aspectGroups[assignment.aspek].push(assignment);
    });

    // Return all aspects with their progress (including unassigned aspects)
    return allAspects.map(aspek => {
      const assignments = aspectGroups[aspek] || [];
      const totalItems = assignments.length;
      const uploadedCount = assignments.filter(assignment => 
        userDocuments.some(doc => doc.checklistId === assignment.checklistId)
      ).length;
      const progress = totalItems > 0 ? Math.round((uploadedCount / totalItems) * 100) : 0;

      return {
        aspek,
        totalItems,
        uploadedCount,
        progress,
        isAssigned: assignments.length > 0
      };
    }).sort((a, b) => {
      // Sort by assigned first, then by progress
      if (a.isAssigned && !b.isAssigned) return -1;
      if (!a.isAssigned && b.isAssigned) return 1;
      return b.progress - a.progress;
    });
  }, [selectedYear, assignedChecklists, checklist, userDocuments, forceUpdate]);

  // Get assigned checklists for table display
  const getAssignedChecklistsForTable = useMemo(() => {
    if (!selectedYear) return [];

    return assignedChecklists.map(assignment => {
      const checklistItem = checklist.find(c => c.id === assignment.checklistId);
      const hasDocument = userDocuments.some(doc => 
        doc.checklistId === assignment.checklistId
      );
      const uploadedDocument = userDocuments.find(doc => 
        doc.checklistId === assignment.checklistId
      );

      return {
        ...assignment,
        checklistItem,
        status: hasDocument ? 'uploaded' : 'not_uploaded' as 'uploaded' | 'not_uploaded',
        uploadedDocument
      };
    });
  }, [selectedYear, assignedChecklists, checklist, userDocuments, userSubDirektorat, forceUpdate]);

  // Get aspect colors
  const getAspectColor = (aspect: string, progress: number = 0) => {
    const colors: { [key: string]: string } = {
      'Aspek 1 - Komitmen': 'bg-red-500',
      'Aspek 2 - Implementasi': 'bg-blue-500',
      'Aspek 3 - Monitoring': 'bg-green-500',
      'Aspek 4 - Evaluasi': 'bg-yellow-500',
      'Aspek 5 - Pelaporan': 'bg-purple-500'
    };
    return colors[aspect] || 'bg-gray-500';
  };

  // Get aspect icons
  const getAspectIcon = (aspect: string) => {
    const icons: { [key: string]: any } = {
      'Aspek 1 - Komitmen': CheckCircle,
      'Aspek 2 - Implementasi': Clock,
      'Aspek 3 - Monitoring': CheckCircle,
      'Aspek 4 - Evaluasi': CheckCircle,
      'Aspek 5 - Pelaporan': FileText
    };
    return icons[aspect] || CheckCircle;
  };

  const handleUploadDocument = (checklist: any) => {
    setSelectedChecklist(checklist);
    setIsUploadDialogOpen(true);
  };

  const handleDownloadDocument = (document: any) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['Document content'], { type: 'application/pdf' }));
    link.download = document.namaFile;
    link.click();
  };

  const handleViewDocument = (checklistId: number) => {
    const uploadedDocument = userDocuments.find(doc => doc.checklistId === checklistId);
    if (uploadedDocument) {
      // For admin, just show a message or could navigate to document view
      console.log('View document:', uploadedDocument);
    }
  };

  return (
    <>
      <AdminSidebar />
      <Topbar />
      
      {/* Main Content */}
      <div className={`
        transition-all duration-300 ease-in-out pt-16
        ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <PageHeaderPanel
            title="Dashboard Admin"
            subtitle={`Selamat datang, ${user?.name} - ${userSubDirektorat}`}
          />

          {/* Year Selector Panel */}
          <Card className="mb-6 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Tahun Buku</span>
              </CardTitle>
              <CardDescription>
                Pilih tahun buku untuk mengakses data dan tugas upload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {availableYears.map((year) => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedYear(year)}
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
                    <strong>Tahun Buku {selectedYear}:</strong> 
                    {selectedYear === Math.max(...availableYears) 
                      ? ' Tahun aktif - dapat upload dokumen' 
                      : ' Tahun sebelumnya - hanya dapat melihat dan mengunduh dokumen'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Show content only when year is selected */}
          {selectedYear ? (
            <>
              {/* Statistik Tahun Buku */}
              {selectedYear && (
                <YearStatisticsPanel 
                  selectedYear={selectedYear}
                  aspectStats={getAspectStats}
                  overallProgress={getOverallProgress}
                  getAspectIcon={getAspectIcon}
                  getAspectColor={getAspectColor}
                  onAspectClick={() => {}} // Admin tidak perlu click untuk filter
                  isSidebarOpen={isSidebarOpen}
                  title="Statistik Tahun Buku"
                  description={`Overview dokumen dan checklist assessment tahun ${selectedYear} untuk ${userSubDirektorat}`}
                  maxCardsInSlider={4}
                  showViewAllButton={true}
                  showOverallProgress={true}
                />
              )}

              {/* Panel: Daftar Checklist GCG (integrated with upload functionality) */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-indigo-50 mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="flex items-center space-x-2 text-indigo-900">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        <span>Daftar Checklist GCG - Tahun {selectedYear}</span>
                      </CardTitle>
                      <CardDescription className="text-indigo-700 mt-2">
                        Checklist yang ditugaskan untuk {userSubDirektorat} pada tahun {selectedYear}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {getAssignedChecklistsForTable.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada checklist yang ditugaskan</h3>
                      <p className="text-gray-600">Super Admin belum menugaskan checklist untuk {userSubDirektorat}</p>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-indigo-100">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
                            <TableHead className="text-indigo-900 font-semibold">No</TableHead>
                            <TableHead className="text-indigo-900 font-semibold">Aspek</TableHead>
                            <TableHead className="text-indigo-900 font-semibold">Deskripsi Checklist</TableHead>
                            <TableHead className="text-indigo-900 font-semibold">Status</TableHead>
                            <TableHead className="text-indigo-900 font-semibold">File</TableHead>
                            <TableHead className="text-indigo-900 font-semibold">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getAssignedChecklistsForTable.map((item, index) => {
                            const IconComponent = getAspectIcon(item.aspek);
                            
                            return (
                              <TableRow key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-200">
                                <TableCell className="font-medium text-gray-700">{index + 1}</TableCell>
                                <TableCell className="max-w-xs">
                                  <div className="flex items-center space-x-2">
                                    <div className="p-1.5 rounded-md bg-gray-100">
                                      <IconComponent className="w-3 h-3 text-gray-600" />
                                    </div>
                                    <span className="text-xs text-gray-600 truncate">{item.aspek}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="max-w-md">
                                  <div className="text-sm font-semibold text-gray-900 leading-relaxed" title={item.deskripsi}>
                                    {item.deskripsi}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {item.status === 'uploaded' ? (
                                    <span className="flex items-center text-green-600 text-sm font-medium">
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Sudah Upload
                                    </span>
                                  ) : (
                                    <span className="flex items-center text-gray-400 text-sm">
                                      <Clock className="w-4 h-4 mr-1" />
                                      Belum Upload
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {item.uploadedDocument ? (
                                    <div className="space-y-1">
                                      <div className="flex items-center space-x-2">
                                        <FileText className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-900 truncate" title={item.uploadedDocument.namaFile || item.uploadedDocument.fileName}>
                                          {item.uploadedDocument.namaFile || item.uploadedDocument.fileName}
                                        </span>
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        Tanggal Upload: {new Date(item.uploadedDocument.uploadDate).toLocaleDateString('id-ID')}
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-400 italic">Belum ada file</div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleViewDocument(item.checklistId)}
                                      disabled={!item.uploadedDocument}
                                      className={`${item.uploadedDocument ? 'border-blue-200 text-blue-600 hover:bg-blue-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                                      title={item.uploadedDocument ? 'Lihat dokumen' : 'Dokumen belum diupload'}
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => item.uploadedDocument && handleDownloadDocument(item.uploadedDocument)}
                                      disabled={!item.uploadedDocument}
                                      className={`${item.uploadedDocument ? 'border-green-200 text-green-600 hover:bg-green-50' : 'border-gray-200 text-gray-400 cursor-not-allowed'}`}
                                      title={item.uploadedDocument ? 'Download dokumen' : 'Dokumen belum diupload'}
                                    >
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      variant="default" 
                                      size="sm"
                                      onClick={() => handleUploadDocument(item)}
                                      disabled={item.status === 'uploaded'}
                                      className={`${item.status === 'uploaded' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                      title={item.status === 'uploaded' ? 'Dokumen sudah diupload' : 'Upload dokumen'}
                                    >
                                      <Upload className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Panel: Daftar Dokumen (displayed directly below without tabs) */}
              <Card className="border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span>Daftar Dokumen - {userSubDirektorat}</span>
                  </CardTitle>
                  <CardDescription>
                    Dokumen yang telah diupload oleh {userSubDirektorat}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userDocuments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Belum ada dokumen
                      </h3>
                      <p className="text-gray-600">
                        Belum ada dokumen yang diupload oleh {userSubDirektorat}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userDocuments.map((document: any, index: number) => (
                        <Card key={index} className="border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge variant="default">Dokumen</Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {document.aspek}
                                  </Badge>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {document.namaFile}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Upload pada: {new Date(document.uploadDate).toLocaleDateString('id-ID')}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadDocument(document)}
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Unduh
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
            </>
          ) : (
            /* Empty State when no year selected */
            <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Pilih Tahun Buku
                  </h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    Silakan pilih tahun buku di atas untuk melihat tugas upload dan progress Anda
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Upload Dialog */}
      {selectedChecklist && (
        <FileUploadDialog
          isOpen={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          prefillData={{
            checklistId: selectedChecklist.checklistId,
            aspek: selectedChecklist.aspek,
            deskripsi: selectedChecklist.checklistItem?.deskripsi || selectedChecklist.deskripsi,
            direktorat: userDirektorat,
            subdirektorat: userSubDirektorat, // Changed to lowercase to match interface
            divisi: userDivisi,
            tahun: selectedYear
          }}
        />
      )}
    </>
  );
};

export default AdminDashboard;
