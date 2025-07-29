import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useChecklist } from '@/contexts/ChecklistContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import FileUploadDialog from '@/components/dashboard/FileUploadDialog';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Upload, 
  Filter,
  Eye,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertCircle,
  RotateCcw,
  Search,
  BookOpen,
  Zap,
  Plus,
  Download
} from 'lucide-react';

const ListGCG = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checklist } = useChecklist();
  const { documents } = useDocumentMetadata();
  const { isSidebarOpen } = useSidebar();
  const [selectedAspek, setSelectedAspek] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedChecklistItem, setSelectedChecklistItem] = useState<{
    id: number;
    aspek: string;
    deskripsi: string;
  } | null>(null);

  // Auto-set filters from URL parameters
  useEffect(() => {
    const yearParam = searchParams.get('year');
    const aspectParam = searchParams.get('aspect');
    
    if (yearParam) {
      setSelectedYear(parseInt(yearParam));
    }
    
    if (aspectParam) {
      setSelectedAspek(aspectParam);
    }
  }, [searchParams]);

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

  // Check if checklist item is uploaded
  const isChecklistUploaded = (checklistId: number) => {
    return documents.some(doc => doc.checklistId === checklistId && doc.year === selectedYear);
  };

  // Get uploaded document for checklist
  const getUploadedDocument = (checklistId: number) => {
    return documents.find(doc => doc.checklistId === checklistId && doc.year === selectedYear);
  };

  // Filter checklist berdasarkan aspek dan status
  const filteredChecklist = useMemo(() => {
    let filtered = checklist.map(item => ({
      ...item,
      status: isChecklistUploaded(item.id) ? 'uploaded' : 'not_uploaded' as 'uploaded' | 'not_uploaded'
    }));

    if (selectedAspek !== 'all') {
      filtered = filtered.filter(item => item.aspek === selectedAspek);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    return filtered;
  }, [checklist, selectedAspek, selectedStatus, documents, selectedYear]);

  // Hitung progress overall untuk tahun yang dipilih
  const overallProgress = useMemo(() => {
    const total = checklist.length;
    const uploaded = checklist.filter(item => isChecklistUploaded(item.id)).length;
    return Math.round((uploaded / total) * 100);
  }, [checklist, documents, selectedYear]);

  // Hitung progress per aspek
  const getAspekProgress = (aspek: string) => {
    const aspekItems = checklist.filter(item => item.aspek === aspek);
    const total = aspekItems.length;
    const uploaded = aspekItems.filter(item => isChecklistUploaded(item.id)).length;
    return Math.round((uploaded / total) * 100);
  };

  // Navigate to dashboard with document highlight
  const handleViewDocument = (checklistId: number) => {
    const document = getUploadedDocument(checklistId);
    if (document) {
      navigate(`/dashboard?highlight=${document.id}&year=${selectedYear}`);
    }
  };

  // Handle download document
  const handleDownloadDocument = (checklistId: number) => {
    const document = getUploadedDocument(checklistId);
    if (document) {
      // Simulate download - in real app, this would trigger actual file download
      console.log(`Downloading: ${document.fileName}`);
      alert(`Downloading: ${document.fileName}`);
    }
  };

  // Get aspect icon and color - konsisten dengan dashboard
  const getAspectIcon = (aspekName: string) => {
    if (aspekName.includes('ASPEK I')) return { icon: BarChart3, color: 'text-blue-600', bgColor: 'bg-blue-50' };
    if (aspekName.includes('ASPEK II')) return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' };
    if (aspekName.includes('ASPEK III')) return { icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-50' };
    if (aspekName.includes('ASPEK IV')) return { icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-50' };
    if (aspekName.includes('ASPEK V')) return { icon: Upload, color: 'text-pink-600', bgColor: 'bg-pink-50' };
    // Aspek baru/default
    return { icon: Plus, color: 'text-gray-600', bgColor: 'bg-gray-50' };
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    if (status === 'uploaded') {
      return <Badge className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Uploaded
      </Badge>;
    }
    return <Badge variant="secondary" className="border-yellow-200 text-yellow-700 bg-yellow-50">
      <Clock className="w-3 h-3 mr-1" />
      Pending
    </Badge>;
  };

  // Handle upload button click
  const handleUploadClick = (item: { id: number; aspek: string; deskripsi: string }) => {
    setSelectedChecklistItem(item);
    setIsUploadDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
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
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      List GCG
                    </h1>
                    <p className="text-gray-600 mt-1 flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                      Daftar checklist Good Corporate Governance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Year Selection */}
          <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-white to-blue-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-blue-900">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <span>Pilih Tahun</span>
              </CardTitle>
              <CardDescription className="text-blue-700">
                Pilih tahun untuk melihat checklist GCG
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {years.map(year => (
                  <Button
                    key={year}
                    variant={selectedYear === year ? "default" : "outline"}
                    onClick={() => setSelectedYear(year)}
                    className={`min-w-[90px] transition-all duration-200 ${
                      selectedYear === year 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg' 
                        : 'border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    {year}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Overall Progress Card */}
          <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-white to-green-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-green-900">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <span>Progress Keseluruhan - Tahun {selectedYear}</span>
              </CardTitle>
              <CardDescription className="text-green-700">
                Progress upload dokumen GCG secara keseluruhan untuk tahun {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Enhanced Progress Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Progress Upload</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                      {overallProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${overallProgress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Enhanced Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                    <div className="p-3 bg-blue-500 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">{checklist.length}</div>
                    <div className="text-sm text-blue-700 font-medium">Total Checklist</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
                    <div className="p-3 bg-green-500 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {checklist.filter(item => isChecklistUploaded(item.id)).length}
                    </div>
                    <div className="text-sm text-green-700 font-medium">Sudah Selesai</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200 shadow-sm">
                    <div className="p-3 bg-yellow-500 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-yellow-600 mb-1">
                      {checklist.filter(item => !isChecklistUploaded(item.id)).length}
                    </div>
                    <div className="text-sm text-yellow-700 font-medium">Belum Selesai</div>
                  </div>
                </div>

                {/* Enhanced Progress Details */}
                <div className="flex justify-between text-sm">
                  <span className="flex items-center bg-green-100 text-green-700 px-3 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {checklist.filter(item => isChecklistUploaded(item.id)).length} uploaded
                    </span>
                  </span>
                  <span className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {checklist.filter(item => !isChecklistUploaded(item.id)).length} pending
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Progress per Aspek */}
          <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-white to-purple-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-purple-900">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <span>Progress per Aspek - Tahun {selectedYear}</span>
              </CardTitle>
              <CardDescription className="text-purple-700">
                Progress upload dokumen berdasarkan aspek GCG untuk tahun {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aspects.map((aspek) => {
                  const progress = getAspekProgress(aspek);
                  const aspekItems = checklist.filter(item => item.aspek === aspek);
                  const uploadedCount = aspekItems.filter(item => isChecklistUploaded(item.id)).length;
                  const pendingCount = aspekItems.length - uploadedCount;
                  const aspectInfo = getAspectIcon(aspek);
                  const IconComponent = aspectInfo.icon;
                  
                  return (
                    <div key={aspek} className="p-6 border-0 rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${aspectInfo.bgColor}`}>
                            <IconComponent className={`w-6 h-6 ${aspectInfo.color}`} />
                          </div>
                          <h4 className="font-semibold text-gray-900 truncate">{aspek}</h4>
                        </div>
                        <Badge 
                          variant={progress === 100 ? "default" : progress > 50 ? "secondary" : "destructive"}
                          className={`${
                            progress === 100 ? 'bg-green-100 text-green-800 border-green-200' :
                            progress > 50 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}
                        >
                          {progress}%
                        </Badge>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4 shadow-inner">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                            progress === 100 ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                            progress > 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                            'bg-gradient-to-r from-red-500 to-pink-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-md">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {uploadedCount}
                        </span>
                        <span className="flex items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md">
                          <Clock className="w-3 h-3 mr-1" />
                          {pendingCount}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        Total: {aspekItems.length} item
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Filters */}
          <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-white to-orange-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-orange-900">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Filter className="w-5 h-5 text-orange-600" />
                </div>
                <span>Filter & Pencarian</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Enhanced Aspek Filter */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center">
                    <Filter className="w-4 h-4 mr-2 text-orange-600" />
                    Filter Aspek
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={selectedAspek === 'all' ? "default" : "outline"}
                      onClick={() => setSelectedAspek('all')}
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
                      const IconComponent = aspectInfo.icon;
                      return (
                        <Button
                          key={aspek}
                          variant={selectedAspek === aspek ? "default" : "outline"}
                          onClick={() => setSelectedAspek(aspek)}
                          size="sm"
                          className={`text-xs flex items-center space-x-2 ${
                            selectedAspek === aspek 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <IconComponent className={`w-3 h-3 ${selectedAspek === aspek ? 'text-white' : aspectInfo.color}`} />
                          <span>{aspek.replace('ASPEK ', '').replace('. ', ' - ')}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Enhanced Status Filter */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-3 block flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-orange-600" />
                    Filter Status
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant={selectedStatus === 'all' ? "default" : "outline"}
                      onClick={() => setSelectedStatus('all')}
                      size="sm"
                      className={selectedStatus === 'all' 
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700' 
                        : 'border-orange-200 text-orange-600 hover:bg-orange-50'
                      }
                    >
                      Semua Status
                    </Button>
                    <Button
                      variant={selectedStatus === 'uploaded' ? "default" : "outline"}
                      onClick={() => setSelectedStatus('uploaded')}
                      size="sm"
                      className={selectedStatus === 'uploaded' 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                        : 'border-green-200 text-green-600 hover:bg-green-50'
                      }
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Uploaded
                    </Button>
                    <Button
                      variant={selectedStatus === 'not_uploaded' ? "default" : "outline"}
                      onClick={() => setSelectedStatus('not_uploaded')}
                      size="sm"
                      className={selectedStatus === 'not_uploaded' 
                        ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700' 
                        : 'border-yellow-200 text-yellow-600 hover:bg-yellow-50'
                      }
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Button>
                  </div>
                </div>

                {/* Enhanced Reset Filter */}
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedAspek('all');
                      setSelectedStatus('all');
                    }}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Checklist Table */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-indigo-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-indigo-900">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span>Daftar Checklist GCG - Tahun {selectedYear}</span>
                  </CardTitle>
                  <CardDescription className="text-indigo-700 mt-2">
                    <span className="font-semibold text-indigo-600">{filteredChecklist.length}</span> item ditemukan
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                    {filteredChecklist.map((item, index) => {
                      const aspectInfo = getAspectIcon(item.aspek);
                      const IconComponent = aspectInfo.icon;
                      const uploadedDocument = getUploadedDocument(item.id);
                      
                      return (
                        <TableRow key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors duration-200">
                          <TableCell className="font-medium text-gray-700">
                            {index + 1}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="flex items-center space-x-2">
                              <div className={`p-1.5 rounded-md ${aspectInfo.bgColor}`}>
                                <IconComponent className={`w-3 h-3 ${aspectInfo.color}`} />
                              </div>
                              <span className="text-xs text-gray-600 truncate">
                                {item.aspek}
                              </span>
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
                                Terupload
                              </span>
                            ) : (
                              <span className="flex items-center text-gray-400 text-sm">
                                <Clock className="w-4 h-4 mr-1" />
                                Belum Upload
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {uploadedDocument ? (
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-gray-900 truncate" title={uploadedDocument.fileName}>
                                    {uploadedDocument.fileName}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {(uploadedDocument.fileSize / 1024 / 1024).toFixed(2)} MB
                                </div>
                                <div className="text-xs text-gray-500">
                                  Upload: {new Date(uploadedDocument.uploadDate).toLocaleDateString('id-ID')}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-400 italic">
                                Belum ada file
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewDocument(item.id)}
                                disabled={!isChecklistUploaded(item.id)}
                                className={`${
                                  isChecklistUploaded(item.id)
                                    ? 'border-blue-200 text-blue-600 hover:bg-blue-50'
                                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                title={
                                  isChecklistUploaded(item.id)
                                    ? 'Lihat dokumen di Dashboard'
                                    : 'Dokumen belum diupload'
                                }
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownloadDocument(item.id)}
                                disabled={!isChecklistUploaded(item.id)}
                                className={`${
                                  isChecklistUploaded(item.id)
                                    ? 'border-green-200 text-green-600 hover:bg-green-50'
                                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                title={
                                  isChecklistUploaded(item.id)
                                    ? 'Download dokumen'
                                    : 'Dokumen belum diupload'
                                }
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUploadClick(item)}
                                className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                title="Upload dokumen baru"
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
                
                {filteredChecklist.length === 0 && (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50">
                    <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Tidak ada item yang ditemukan
                    </h3>
                    <p className="text-gray-500">
                      Coba ubah filter atau pilih tahun yang berbeda
                    </p>
                  </div>
                )}
              </div>
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