import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  FileText, 
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

interface Document {
  id: string;
  created_at: string;
  judul_dokumen: string;
  jenis_dokumen: string;
  prinsip_gcg: string;
  divisi_terkait: string;
  tahun_dokumen: number;
  deskripsi: string;
  file_url: string;
  uploader_id: string;
}

const UserDashboard = () => {
  const { user, profile, logout } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedDocType, setSelectedDocType] = useState('all');
  const [selectedPrinciple, setSelectedPrinciple] = useState('all');
  const [viewDocument, setViewDocument] = useState<Document | null>(null);

  const divisions = [
    "Audit Internal", 
    "Manajemen Risiko", 
    "Sekretaris Perusahaan", 
    "Keuangan", 
    "SDM", 
    "Hukum", 
    "IT"
  ];
  const docTypes = ["Laporan Audit", "Kebijakan", "Risalah Rapat", "Laporan Keuangan", "SOP", "Peraturan"];
  const gcgPrinciples = ["Akuntabilitas", "Transparansi", "Responsibilitas", "Independensi", "Kewajaran"];
  const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dokumen')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error",
          description: "Gagal memuat dokumen",
          variant: "destructive"
        });
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter(doc => {
    return (
      (searchTerm === '' || 
       doc.judul_dokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doc.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedDivision === 'all' || doc.divisi_terkait === selectedDivision) &&
      (selectedYear === 'all' || doc.tahun_dokumen.toString() === selectedYear) &&
      (selectedDocType === 'all' || doc.jenis_dokumen === selectedDocType) &&
      (selectedPrinciple === 'all' || doc.prinsip_gcg === selectedPrinciple)
    );
  });

  const stats = {
    totalDocuments: documents.length,
    thisYear: documents.filter(doc => doc.tahun_dokumen === new Date().getFullYear()).length,
    divisions: [...new Set(documents.map(doc => doc.divisi_terkait))].length,
    latestDocuments: documents.slice(0, 5).length
  };

  if (loading && documents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

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
                  <h1 className="text-xl font-bold text-gray-900">GCG Docs Pos - User Portal</h1>
                  <p className="text-sm text-gray-600">Portal Dokumen Regulasi</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Selamat datang, {profile?.username}</span>
                <Badge variant="secondary">User</Badge>
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
                  <p className="text-blue-100 text-sm">Dokumen {new Date().getFullYear()}</p>
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
                  <p className="text-orange-100 text-sm">Dokumen Terbaru</p>
                  <p className="text-3xl font-bold">{stats.latestDocuments}</p>
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
                  placeholder="Cari berdasarkan judul atau deskripsi..."
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
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
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
                  <span>Daftar Semua Dokumen</span>
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.judul_dokumen}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{doc.deskripsi}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                                {doc.jenis_dokumen}
                              </Badge>
                              <Badge variant="outline" className="border-blue-200 text-blue-700">
                                {doc.prinsip_gcg}
                              </Badge>
                              <Badge variant="outline" className="border-purple-200 text-purple-700">
                                {doc.divisi_terkait}
                              </Badge>
                              <Badge variant="outline" className="border-orange-200 text-orange-700">
                                {doc.tahun_dokumen}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <span className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(doc.created_at).toLocaleDateString('id-ID')}</span>
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
                                  <h3 className="text-lg font-semibold mb-2">{viewDocument.judul_dokumen}</h3>
                                  <p className="text-gray-600">{viewDocument.deskripsi}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Jenis Dokumen</Label>
                                    <p className="text-sm text-gray-900">{viewDocument.jenis_dokumen}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Prinsip GCG</Label>
                                    <p className="text-sm text-gray-900">{viewDocument.prinsip_gcg}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Divisi</Label>
                                    <p className="text-sm text-gray-900">{viewDocument.divisi_terkait}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Tahun</Label>
                                    <p className="text-sm text-gray-900">{viewDocument.tahun_dokumen}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Tanggal Upload</Label>
                                    <p className="text-sm text-gray-900">{new Date(viewDocument.created_at).toLocaleDateString('id-ID')}</p>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2 pt-4">
                                  <Button 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => window.open(viewDocument.file_url, '_blank')}
                                  >
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Buka File
                                  </Button>
                                  <Button 
                                    variant="outline"
                                    onClick={() => {
                                      const link = document.createElement('a');
                                      link.href = viewDocument.file_url;
                                      link.download = viewDocument.judul_dokumen;
                                      link.click();
                                    }}
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Unduh
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = doc.file_url;
                            link.download = doc.judul_dokumen;
                            link.click();
                          }}
                        >
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
