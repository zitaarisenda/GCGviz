import { DocumentMetadata } from '@/contexts/DocumentMetadataContext';

export const seedDocumentMetadata: Omit<DocumentMetadata, 'id' | 'uploadDate'>[] = [
  // Dokumen dengan checklist yang sudah digunakan (2024) - ASPEK I
  {
    title: 'Pedoman Tata Kelola Perusahaan yang Baik/CoCG',
    documentNumber: 'AI/COCG/2024/001',
    documentDate: '2024-01-15',
    description: 'Pedoman implementasi tata kelola perusahaan yang baik untuk seluruh karyawan',
    gcgPrinciple: 'Transparansi',
    documentType: 'Kebijakan',
    documentCategory: 'Code of Conduct',
    direksi: 'Direktorat Human Capital Management',
    division: 'Divisi Training & Development',
    fileName: 'Pedoman_CoCG_2024.pdf',
    fileSize: 2048576, // 2MB
    status: 'published',
    confidentiality: 'public',
    year: 2024,
    uploadedBy: 'superadmin',
    checklistId: 1,
    checklistDescription: 'Pedoman Tata Kelola Perusahaan yang Baik/CoCG',
    aspect: 'ASPEK I. Komitmen'
  },
  {
    title: 'Kode Etik Perusahaan',
    documentNumber: 'AI/KEP/2024/001',
    documentDate: '2024-01-20',
    description: 'Kode etik yang mengatur perilaku dan standar moral karyawan',
    gcgPrinciple: 'Transparansi',
    documentType: 'Kebijakan',
    documentCategory: 'Code of Conduct',
    direksi: 'Direktorat Human Capital Management',
    division: 'Divisi Compliance',
    fileName: 'Kode_Etik_Perusahaan_2024.pdf',
    fileSize: 1536000, // 1.5MB
    status: 'published',
    confidentiality: 'public',
    year: 2024,
    uploadedBy: 'superadmin',
    checklistId: 2,
    checklistDescription: 'Kode Etik Perusahaan',
    aspect: 'ASPEK I. Komitmen'
  },

  // Dokumen dengan checklist yang sudah digunakan (2024) - ASPEK II
  {
    title: 'Laporan Keuangan Tahunan 2024',
    documentNumber: 'AI/LKT/2024/001',
    documentDate: '2024-03-31',
    description: 'Laporan keuangan audited untuk tahun buku 2024',
    gcgPrinciple: 'Akuntabilitas',
    documentType: 'Laporan',
    documentCategory: 'Laporan Keuangan',
    direksi: 'Direktorat Bisnis Jasa Keuangan',
    division: 'Divisi Keuangan',
    fileName: 'Laporan_Keuangan_2024.pdf',
    fileSize: 5120000, // 5MB
    status: 'published',
    confidentiality: 'public',
    year: 2024,
    uploadedBy: 'superadmin',
    checklistId: 15,
    checklistDescription: 'Laporan Keuangan Tahunan',
    aspect: 'ASPEK II. RUPS'
  },
  {
    title: 'Risalah RUPS Tahunan 2024',
    documentNumber: 'AI/RUPS/2024/001',
    documentDate: '2024-06-15',
    description: 'Risalah rapat umum pemegang saham tahunan 2024',
    gcgPrinciple: 'Akuntabilitas',
    documentType: 'Risalah',
    documentCategory: 'Risalah RUPS',
    direksi: 'Non Direktorat',
    division: 'Divisi Sekretaris Perusahaan',
    fileName: 'Risalah_RUPS_2024.pdf',
    fileSize: 2560000, // 2.5MB
    status: 'published',
    confidentiality: 'public',
    year: 2024,
    uploadedBy: 'superadmin',
    checklistId: 16,
    checklistDescription: 'Risalah RUPS Tahunan',
    aspect: 'ASPEK II. RUPS'
  },

  // Dokumen dengan checklist yang sudah digunakan (2024) - ASPEK III
  {
    title: 'Risalah Rapat Direksi Bulanan Januari 2024',
    documentNumber: 'AI/RRD/2024/001',
    documentDate: '2024-01-25',
    description: 'Risalah rapat direksi bulanan untuk bulan Januari 2024',
    gcgPrinciple: 'Responsibilitas',
    documentType: 'Risalah',
    documentCategory: 'Risalah Rapat Direksi',
    direksi: 'Direktorat Bisnis Kurir dan Logistik',
    division: 'Divisi Operasional Kurir',
    fileName: 'Risalah_Direksi_Jan_2024.pdf',
    fileSize: 1536000, // 1.5MB
    status: 'published',
    confidentiality: 'confidential',
    year: 2024,
    uploadedBy: 'superadmin',
    checklistId: 45,
    checklistDescription: 'Risalah Rapat Direksi',
    aspect: 'ASPEK III. Dewan Komisaris'
  },
  {
    title: 'CV Dewan Komisaris',
    documentNumber: 'AI/CVDK/2024/001',
    documentDate: '2024-02-01',
    description: 'Curriculum Vitae anggota dewan komisaris',
    gcgPrinciple: 'Responsibilitas',
    documentType: 'Dokumentasi',
    documentCategory: 'CV Dewan Komisaris',
    direksi: 'Non Direktorat',
    division: 'Divisi Sekretaris Perusahaan',
    fileName: 'CV_Dewan_Komisaris_2024.pdf',
    fileSize: 1024000, // 1MB
    status: 'published',
    confidentiality: 'public',
    year: 2024,
    uploadedBy: 'superadmin',
    checklistId: 46,
    checklistDescription: 'CV Dewan Komisaris',
    aspect: 'ASPEK III. Dewan Komisaris'
  },

  // Dokumen dengan checklist yang sudah digunakan (2024) - ASPEK IV
  {
    title: 'Kebijakan Benturan Kepentingan',
    documentNumber: 'AI/KBK/2024/001',
    documentDate: '2024-02-10',
    description: 'Kebijakan pengelolaan benturan kepentingan dalam perusahaan',
    gcgPrinciple: 'Independensi',
    documentType: 'Kebijakan',
    documentCategory: 'Kebijakan Manajemen',
    direksi: 'Non Direktorat',
    division: 'Divisi Hukum',
    fileName: 'Kebijakan_Benturan_Kepentingan.pdf',
    fileSize: 1024000, // 1MB
    status: 'published',
    confidentiality: 'public',
    year: 2024,
    uploadedBy: 'superadmin',
    checklistId: 78,
    checklistDescription: 'Kebijakan Benturan Kepentingan',
    aspect: 'ASPEK IV. Direksi'
  },
  {
    title: 'CV Direksi',
    documentNumber: 'AI/CVD/2024/001',
    documentDate: '2024-02-15',
    description: 'Curriculum Vitae anggota direksi',
    gcgPrinciple: 'Independensi',
    documentType: 'Dokumentasi',
    documentCategory: 'CV Direksi',
    direksi: 'Non Direktorat',
    division: 'Divisi Sekretaris Perusahaan',
    fileName: 'CV_Direksi_2024.pdf',
    fileSize: 2048000, // 2MB
    status: 'published',
    confidentiality: 'public',
    year: 2024,
    uploadedBy: 'superadmin',
    checklistId: 79,
    checklistDescription: 'CV Direksi',
    aspect: 'ASPEK IV. Direksi'
  },

  // Dokumen dengan checklist yang sudah digunakan (2024) - ASPEK V
  {
    title: 'Laporan Pengungkapan Informasi Publik',
    documentNumber: 'AI/LPIP/2024/001',
    documentDate: '2024-04-15',
    description: 'Laporan pengungkapan informasi publik tahun 2024',
    gcgPrinciple: 'Kesetaraan',
    documentType: 'Laporan',
    documentCategory: 'Laporan Pengungkapan',
    direksi: 'Non Direktorat',
    division: 'Divisi Sekretaris Perusahaan',
    fileName: 'Laporan_Pengungkapan_2024.pdf',
    fileSize: 3072000, // 3MB
    status: 'published',
    confidentiality: 'public',
    year: 2024,
    uploadedBy: 'superadmin',
    checklistId: 120,
    checklistDescription: 'Laporan Pengungkapan Informasi Publik',
    aspect: 'ASPEK V. Pengungkapan'
  },

  // Dokumen tanpa checklist (opsional)
  {
    title: 'Dokumen Internal Meeting Notes',
    documentNumber: 'AI/IMN/2024/001',
    documentDate: '2024-05-20',
    description: 'Catatan rapat internal departemen',
    gcgPrinciple: 'Transparansi',
    documentType: 'Dokumentasi',
    documentCategory: 'Catatan Rapat',
    direksi: 'Direktorat Business Development and Portofolio Management',
    division: 'Divisi Strategic Planning',
    fileName: 'Meeting_Notes_Internal.pdf',
    fileSize: 512000, // 0.5MB
    status: 'draft',
    confidentiality: 'confidential',
    year: 2024,
    uploadedBy: 'superadmin'
    // Tidak ada checklistId - dokumen opsional
  },

  // Dokumen tahun 2023 untuk perbandingan
  {
    title: 'Pedoman CoCG 2023',
    documentNumber: 'AI/COCG/2023/001',
    documentDate: '2023-01-10',
    description: 'Pedoman tata kelola perusahaan tahun 2023',
    gcgPrinciple: 'Transparansi',
    documentType: 'Kebijakan',
    documentCategory: 'Code of Conduct',
    direksi: 'Direktorat Human Capital Management',
    division: 'Divisi Training & Development',
    fileName: 'Pedoman_CoCG_2023.pdf',
    fileSize: 2048576, // 2MB
    status: 'published',
    confidentiality: 'public',
    year: 2023,
    uploadedBy: 'superadmin',
    checklistId: 1,
    checklistDescription: 'Pedoman Tata Kelola Perusahaan yang Baik/CoCG',
    aspect: 'ASPEK I. Komitmen'
  },
  {
    title: 'Laporan Keuangan 2023',
    documentNumber: 'AI/LKT/2023/001',
    documentDate: '2023-03-31',
    description: 'Laporan keuangan audited tahun 2023',
    gcgPrinciple: 'Akuntabilitas',
    documentType: 'Laporan',
    documentCategory: 'Laporan Keuangan',
    direksi: 'Direktorat Bisnis Jasa Keuangan',
    division: 'Divisi Keuangan',
    fileName: 'Laporan_Keuangan_2023.pdf',
    fileSize: 5120000, // 5MB
    status: 'published',
    confidentiality: 'public',
    year: 2023,
    uploadedBy: 'superadmin',
    checklistId: 15,
    checklistDescription: 'Laporan Keuangan Tahunan',
    aspect: 'ASPEK II. RUPS'
  }
];

export const initializeDocumentMetadata = () => {
  const existingData = localStorage.getItem('documentMetadata');
  if (!existingData) {
    // Add IDs and upload dates to seed data
    const documentsWithIds = seedDocumentMetadata.map((doc, index) => ({
      ...doc,
      id: `seed-${Date.now()}-${index}`,
      uploadDate: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString() // Spread upload dates
    }));
    
    localStorage.setItem('documentMetadata', JSON.stringify(documentsWithIds));
    return documentsWithIds;
  }
  return JSON.parse(existingData);
}; 