
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, 
  FileText, 
  Filter, 
  Eye, 
  Calendar,
  Building2,
  Shield,
  Users,
  TrendingUp,
  Archive,
  Download,
  ExternalLink,
  LogOut
} from 'lucide-react';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedDocType, setSelectedDocType] = useState('all');
  const [selectedPrinciple, setSelectedPrinciple] = useState('all');
  const [viewDocument, setViewDocument] = useState(null);

  // Sample data - in real app this would come from backend
  const documents = [
    {
      id: 1,
      title: "Kebijakan Manajemen Risiko",
      type: "Kebijakan",
      principle: "Transparansi",
      division: "Manajemen Risiko",
      date: "2023-06-15",
      year: "2023",
      docNumber: "MR/POL/2023/001",
      description: "Kebijakan terbaru mengenai manajemen risiko perusahaan",
      fileUrl: "#",
      uploadedBy: "Siti Nurlaela",
      uploadDate: "2023-06-20"
    },
    {
      id: 2,
      title: "Laporan Keuangan Tahunan 2022",
      type: "Laporan Keuangan",
      principle: "Akuntabilitas",
      division: "Keuangan",
      date: "2022-12-31",
      year: "2022",
      docNumber: "FIN/AR/2022/001",
      description: "Laporan keuangan tahunan lengkap untuk tahun fiscal 2022",
      fileUrl: "#",
      uploadedBy: "Indira Sari",
      uploadDate: "2023-03-15"
    },
    {
      id: 3,
      title: "SOP Pelayanan Pelanggan",
      type: "SOP",
      principle: "Responsibilitas",
      division: "SDM",
      date: "2024-01-10",
      year: "2024",
      docNumber: "SDM/SOP/2024/001",
      description: "Standar operasional prosedur untuk pelayanan pelanggan",
      fileUrl: "#",
      uploadedBy: "Andi Pratama",
      uploadDate: "2024-01-15"
    }
  ];

  const divisions = ["Audit Internal", "Manajemen Risiko", "Sekretaris Perusahaan", "Keuangan", "SDM", "Hukum"];
  const years = ["2024", "2023", "2022", "2021", "2020"];
  const docTypes = ["Laporan Audit", "Kebijakan", "Risalah Rapat", "Laporan Keuangan", "SOP", "Peraturan"];
  const gcgPrinciples = ["Akuntabilitas", "Transparansi", "Responsibilitas", "Independensi", "Kewajaran"];

  const filteredDocuments = documents.filter(doc => {
    return (
      (searchTerm === '' || 
       doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedDivision === 'all' || doc.division === selectedDivision) &&
      (selectedYear === 'all' || doc.year === selectedYear) &&
      (selectedDocType === 'all' || doc.type === selectedDocType) &&
      (selectedPrinciple === 'all' || doc.principle === selectedPrinciple)
    );
  });

  const stats = {
    totalDocuments: documents.length,
    thisYear: documents.filter(doc => doc.year === "2024").length,
    divisions: [...new Set(documents.map(doc => doc.division))].length,
    myDivision: documents.filter(doc => doc.division === user?.division).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">GCG Docs Pos - User</h1>
                  <p className="text-sm text-gray-600">Portal Dokumen Regulasi</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Selamat datang, {user?.username}</span>
                <Badge variant="secondary">{user?.division}</Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Dokumen</p>
                  <p className="text-3xl font-bold">{stats.totalDocuments}</p>
                </div>
                <FileText className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Dokumen 2024</p>
                  <p className="text-3xl font-bold">{stats.thisYear}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Divisi Aktif</p>
                  <p className="text-3xl font-bold">{stats.divisions}</p>
                </div>
                <Building2 className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Divisi Saya</p>
                  <p className="text-3xl font-bold">{stats.myDivision}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-green-600" />
              <span>Pencarian & Filter Dokumen</span>
            </CardTitle>
            <CardDescription>
              Cari dan filter dokumen yang tersedia dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari berdasarkan judul, deskripsi, atau nomor dokumen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <Button variant="outline" className="px-6 h-12">
                <Search className="w-4 h-4 mr-2" />
                Cari
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Divisi</Label>
                <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Divisi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Divisi</SelectItem>
                    {divisions.map(division => (
                      <SelectItem key={division} value={division}>{division}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Tahun</Label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tahun</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Jenis Dokumen</Label>
                <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    {docTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Prinsip GCG</Label>
                <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Prinsip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Prinsip</SelectItem>
                    {gcgPrinciples.map(principle => (
                      <SelectItem key={principle} value={principle}>{principle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document List */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Archive className="w-5 h-5 text-green-600" />
                  <span>Daftar Dokumen</span>
                </CardTitle>
                <CardDescription>
                  Menampilkan {filteredDocuments.length} dari {documents.length} dokumen
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-green-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{doc.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                                {doc.type}
                              </Badge>
                              <Badge variant="outline" className="border-blue-200 text-blue-700">
                                {doc.principle}
                              </Badge>
                              <Badge variant="outline" className="border-purple-200 text-purple-700">
                                {doc.division}
                              </Badge>
                              <Badge variant="outline" className="border-orange-200 text-orange-700">
                                {doc.year}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(doc.date).toLocaleDateString('id-ID')}</span>
                              </span>
                              {doc.docNumber && (
                                <span className="flex items-center space-x-1">
                                  <FileText className="w-4 h-4" />
                                  <span>{doc.docNumber}</span>
                                </span>
                              )}
                              <span className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>oleh {doc.uploadedBy}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setViewDocument(doc)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <FileText className="w-5 h-5 text-green-600" />
                                <span>Detail Dokumen</span>
                              </DialogTitle>
                            </DialogHeader>
                            {viewDocument && (
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-lg font-semibold mb-2">{viewDocument.title}</h3>
                                  <p className="text-gray-600">{viewDocument.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Jenis Dokumen</Label>
                                    <p className="text-sm text-gray-900">{viewDocument.type}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Prinsip GCG</Label>
                                    <p className="text-sm text-gray-900">{viewDocument.principle}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Divisi</Label>
                                    <p className="text-sm text-gray-900">{viewDocument.division}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Tahun</Label>
                                    <p className="text-sm text-gray-900">{viewDocument.year}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Tanggal Dokumen</Label>
                                    <p className="text-sm text-gray-900">{new Date(viewDocument.date).toLocaleDateString('id-ID')}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Nomor Dokumen</Label>
                                    <p className="text-sm text-gray-900">{viewDocument.docNumber || '-'}</p>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2 pt-4">
                                  <Button className="bg-green-600 hover:bg-green-700">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Buka File
                                  </Button>
                                  <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Unduh
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <Download className="w-4 h-4 mr-2" />
                          Unduh
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada dokumen ditemukan</h3>
                  <p className="text-gray-500">Coba ubah kriteria pencarian atau filter Anda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
