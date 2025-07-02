
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  LogOut,
  Upload,
  Plus
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

const AdminDashboard = () => {
  const { user, profile, logout } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedDocType, setSelectedDocType] = useState('all');
  const [selectedPrinciple, setSelectedPrinciple] = useState('all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  // Form states untuk upload dokumen
  const [formData, setFormData] = useState({
    judul_dokumen: '',
    jenis_dokumen: '',
    prinsip_gcg: '',
    tahun_dokumen: new Date().getFullYear(),
    deskripsi: '',
    file: null as File | null
  });

  const docTypes = ["Laporan Audit", "Kebijakan", "Risalah Rapat", "Laporan Keuangan", "SOP", "Peraturan"];
  const gcgPrinciples = ["Akuntabilitas", "Transparansi", "Responsibilitas", "Independensi", "Kewajaran"];
  const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i);

  const fetchDocuments = async () => {
    if (!profile) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dokumen')
        .select('*')
        .eq('divisi_terkait', profile.divisi)
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
  }, [profile]);

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file || !user || !profile) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      // Upload file ke storage
      const fileName = `${Date.now()}_${formData.file.name}`;
      const { data: fileData, error: fileError } = await supabase.storage
        .from('dokumen-gcg')
        .upload(fileName, formData.file);

      if (fileError) {
        throw fileError;
      }

      // Dapatkan URL publik
      const { data: { publicUrl } } = supabase.storage
        .from('dokumen-gcg')
        .getPublicUrl(fileName);

      // Simpan metadata ke database
      const { error: dbError } = await supabase
        .from('dokumen')
        .insert({
          judul_dokumen: formData.judul_dokumen,
          jenis_dokumen: formData.jenis_dokumen,
          prinsip_gcg: formData.prinsip_gcg,
          divisi_terkait: profile.divisi,
          tahun_dokumen: formData.tahun_dokumen,
          deskripsi: formData.deskripsi,
          file_url: publicUrl,
          uploader_id: user.id
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Berhasil",
        description: "Dokumen berhasil diunggah",
      });

      // Reset form dan tutup dialog
      setFormData({
        judul_dokumen: '',
        jenis_dokumen: '',
        prinsip_gcg: '',
        tahun_dokumen: new Date().getFullYear(),
        deskripsi: '',
        file: null
      });
      setIsUploadDialogOpen(false);
      
      // Refresh dokumen
      fetchDocuments();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Gagal mengunggah dokumen",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    return (
      (searchTerm === '' || 
       doc.judul_dokumen.toLowerCase().includes(searchTerm.toLowerCase()) ||
       doc.deskripsi?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedYear === 'all' || doc.tahun_dokumen.toString() === selectedYear) &&
      (selectedDocType === 'all' || doc.jenis_dokumen === selectedDocType) &&
      (selectedPrinciple === 'all' || doc.prinsip_gcg === selectedPrinciple)
    );
  });

  const stats = {
    totalDocuments: documents.length,
    thisYear: documents.filter(doc => doc.tahun_dokumen === new Date().getFullYear()).length,
    myDivision: profile?.divisi || '',
    latestUploads: documents.slice(0, 5).length
  };

  if (loading && documents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">GCG Docs Pos - Admin Divisi</h1>
                  <p className="text-sm text-gray-600">Portal Dokumen Regulasi</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Selamat datang, {profile?.username}</span>
                <Badge variant="secondary">{profile?.divisi}</Badge>
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
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Dokumen</p>
                  <p className="text-3xl font-bold">{stats.totalDocuments}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Dokumen Tahun Ini</p>
                  <p className="text-3xl font-bold">{stats.thisYear}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Divisi</p>
                  <p className="text-lg font-bold">{stats.myDivision}</p>
                </div>
                <Building2 className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Upload Terbaru</p>
                  <p className="text-3xl font-bold">{stats.latestUploads}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Document Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <span>Unggah Dokumen Baru</span>
                </CardTitle>
                <CardDescription>
                  Unggah dokumen baru untuk divisi {profile?.divisi}
                </CardDescription>
              </div>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Unggah Dokumen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Unggah Dokumen Baru</DialogTitle>
                    <DialogDescription>
                      Isi informasi dokumen yang akan diunggah
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleFileUpload} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="judul">Judul Dokumen</Label>
                        <Input
                          id="judul"
                          value={formData.judul_dokumen}
                          onChange={(e) => setFormData({...formData, judul_dokumen: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="jenis">Jenis Dokumen</Label>
                        <Select 
                          value={formData.jenis_dokumen} 
                          onValueChange={(value) => setFormData({...formData, jenis_dokumen: value})}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih jenis dokumen" />
                          </SelectTrigger>
                          <SelectContent>
                            {docTypes.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="prinsip">Prinsip GCG</Label>
                        <Select 
                          value={formData.prinsip_gcg} 
                          onValueChange={(value) => setFormData({...formData, prinsip_gcg: value})}
                          required
                        >
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
                        <Label htmlFor="tahun">Tahun Dokumen</Label>
                        <Select 
                          value={formData.tahun_dokumen.toString()} 
                          onValueChange={(value) => setFormData({...formData, tahun_dokumen: parseInt(value)})}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map(year => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="divisi">Divisi Terkait</Label>
                      <Input
                        id="divisi"
                        value={profile?.divisi || ''}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deskripsi">Deskripsi</Label>
                      <Textarea
                        id="deskripsi"
                        value={formData.deskripsi}
                        onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="file">File Dokumen</Label>
                      <Input
                        id="file"
                        type="file"
                        onChange={(e) => setFormData({...formData, file: e.target.files?.[0] || null})}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <Button type="submit" disabled={loading}>
                        {loading ? 'Mengunggah...' : 'Unggah Dokumen'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                        Batal
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
        </Card>

        {/* Search and Filter Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-blue-600" />
              <span>Pencarian & Filter Dokumen</span>
            </CardTitle>
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tahun</Label>
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
                <Label>Jenis Dokumen</Label>
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
                <Label>Prinsip GCG</Label>
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
                  <Archive className="w-5 h-5 text-blue-600" />
                  <span>Daftar Dokumen Divisi {profile?.divisi}</span>
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
                <Card key={doc.id} className="border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.judul_dokumen}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{doc.deskripsi}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                {doc.jenis_dokumen}
                              </Badge>
                              <Badge variant="outline" className="border-green-200 text-green-700">
                                {doc.prinsip_gcg}
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
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => window.open(doc.file_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buka
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
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
                  <p className="text-gray-500">Coba ubah kriteria pencarian atau mulai unggah dokumen pertama</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
