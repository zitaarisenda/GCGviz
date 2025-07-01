
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Upload, 
  FileText, 
  Filter, 
  Eye, 
  Calendar,
  Building2,
  Shield,
  Users,
  TrendingUp,
  Archive,
  Plus,
  Download,
  ExternalLink
} from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedDocType, setSelectedDocType] = useState('all');
  const [selectedPrinciple, setSelectedPrinciple] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewDocument, setViewDocument] = useState(null);

  // Sample data - in real app this would come from backend
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "Laporan Audit Internal Q4 2023",
      type: "Laporan Audit",
      principle: "Akuntabilitas",
      division: "Audit Internal",
      date: "2023-12-31",
      year: "2023",
      docNumber: "AI/RPT/2023/004",
      description: "Laporan komprehensif audit internal untuk kuartal keempat tahun 2023",
      fileUrl: "#",
      uploadedBy: "Ahmad Rizki",
      uploadDate: "2024-01-05"
    },
    {
      id: 2,
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
      id: 3,
      title: "Risalah Rapat Direksi Januari 2024",
      type: "Risalah Rapat",
      principle: "Responsibilitas",
      division: "Sekretaris Perusahaan",
      date: "2024-01-15",
      year: "2024",
      docNumber: "SEKPER/RR/2024/001",
      description: "Dokumentasi rapat direksi bulan Januari 2024",
      fileUrl: "#",
      uploadedBy: "Budi Santoso",
      uploadDate: "2024-01-20"
    },
    {
      id: 4,
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
    }
  ]);

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

  const handleUploadDocument = () => {
    toast({
      title: "Dokumen berhasil diunggah",
      description: "Dokumen telah disimpan dan dapat diakses melalui sistem.",
    });
    setIsUploadOpen(false);
  };

  const stats = {
    totalDocuments: documents.length,
    thisYear: documents.filter(doc => doc.year === "2024").length,
    divisions: [...new Set(documents.map(doc => doc.division))].length,
    pending: 2
  };

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
                  <h1 className="text-xl font-bold text-gray-900">GCG Docs Pos</h1>
                  <p className="text-sm text-gray-600">Manajemen Dokumen Regulasi</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Unggah Dokumen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Upload className="w-5 h-5 text-blue-600" />
                      <span>Unggah Dokumen Baru</span>
                    </DialogTitle>
                    <DialogDescription>
                      Lengkapi informasi metadata untuk dokumen yang akan diunggah
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Judul Dokumen *</Label>
                        <Input id="title" placeholder="Masukkan judul dokumen" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="docNumber">Nomor Dokumen</Label>
                        <Input id="docNumber" placeholder="Nomor dokumen (opsional)" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Jenis Dokumen *</Label>
                        <Select>
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
                        <Label htmlFor="principle">Prinsip GCG *</Label>
                        <Select>
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="division">Divisi Terkait *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih divisi" />
                          </SelectTrigger>
                          <SelectContent>
                            {divisions.map(division => (
                              <SelectItem key={division} value={division}>{division}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Tanggal Dokumen *</Label>
                        <Input id="date" type="date" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Deskripsi/Catatan</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Deskripsi singkat tentang dokumen ini"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">Upload File *</Label>
                      <Input id="file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" />
                      <p className="text-xs text-gray-500">Format yang didukung: PDF, DOC, DOCX, XLS, XLSX (Maksimal 10MB)</p>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                      Batal
                    </Button>
                    <Button onClick={handleUploadDocument} className="bg-blue-600 hover:bg-blue-700">
                      Simpan Dokumen
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Selamat datang, Admin</span>
              </div>
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
                  <p className="text-green-100 text-sm">Dokumen 2024</p>
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
                  <p className="text-orange-100 text-sm">Menunggu Review</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
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
              <Search className="w-5 h-5 text-blue-600" />
              <span>Pencarian & Filter Dokumen</span>
            </CardTitle>
            <CardDescription>
              Gunakan pencarian dan filter untuk menemukan dokumen yang Anda butuhkan
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
                  <Archive className="w-5 h-5 text-blue-600" />
                  <span>Daftar Dokumen</span>
                </CardTitle>
                <CardDescription>
                  Menampilkan {filteredDocuments.length} dari {documents.length} dokumen
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter Lanjutan
                </Button>
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
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{doc.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{doc.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                {doc.type}
                              </Badge>
                              <Badge variant="outline" className="border-green-200 text-green-700">
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
                                <FileText className="w-5 h-5 text-blue-600" />
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
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Diunggah oleh</Label>
                                    <p className="text-sm text-gray-900">{viewDocument.uploadedBy}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">Tanggal Upload</Label>
                                    <p className="text-sm text-gray-900">{new Date(viewDocument.uploadDate).toLocaleDateString('id-ID')}</p>
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2 pt-4">
                                  <Button className="bg-blue-600 hover:bg-blue-700">
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
                        
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buka
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

export default Index;
