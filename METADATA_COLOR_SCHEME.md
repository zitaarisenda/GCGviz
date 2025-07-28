# SKEMA WARNA METADATA GCG DOCUMENT HUB

## **OVERVIEW**
Dokumen ini berisi skema warna yang digunakan untuk metadata di aplikasi GCG Document Hub. Setiap jenis metadata memiliki warna yang berbeda untuk memudahkan identifikasi dan pengalaman pengguna yang lebih baik.

## **SKEMA WARNA METADATA**

### **1. INFORMASI DASAR DOKUMEN**
| Metadata | Warna Label | Warna Border/Focus | Badge | Keterangan |
|----------|-------------|-------------------|-------|------------|
| Judul Dokumen | `text-gray-700` | `border-gray-200 focus:border-gray-500` | `JUD` | Informasi utama dokumen |
| Nomor Dokumen | `text-gray-700` | `border-gray-200 focus:border-gray-500` | `NO` | Nomor referensi dokumen |
| Deskripsi/Catatan | `text-gray-700` | `border-gray-200 focus:border-gray-500` | `DES` | Penjelasan dokumen |

### **2. KLASIFIKASI GCG**
| Metadata | Warna Label | Warna Border/Focus | Badge | Keterangan |
|----------|-------------|-------------------|-------|------------|
| Prinsip GCG | `text-purple-700` | `border-purple-200 focus:border-purple-500` | `GCG` | Prinsip GCG (Transparansi, Akuntabilitas, dll) |
| Jenis Dokumen | `text-blue-700` | `border-blue-200 focus:border-blue-500` | `TIPE` | Jenis dokumen (Kebijakan, Laporan, dll) |
| Kategori Dokumen | `text-green-700` | `border-green-200 focus:border-green-500` | `KAT` | Kategori berdasarkan aspek GCG |

### **3. INFORMASI ORGANISASI**
| Metadata | Warna Label | Warna Border/Focus | Badge | Keterangan |
|----------|-------------|-------------------|-------|------------|
| Direksi | `text-indigo-700` | `border-indigo-200 focus:border-indigo-500` | `DIR` | Direksi yang bertanggung jawab |
| Divisi | `text-orange-700` | `border-orange-200 focus:border-orange-500` | `DIV` | Divisi dalam organisasi |
| Input Manual Divisi | `text-orange-600` | `border-orange-200 focus:border-orange-500` | - | Input manual untuk divisi |

### **4. PENGELOLAAN DOKUMEN**
| Metadata | Warna Label | Warna Border/Focus | Badge | Keterangan |
|----------|-------------|-------------------|-------|------------|
| Status Dokumen | `text-teal-700` | `border-teal-200 focus:border-teal-500` | `STS` | Status dokumen (Draft, Final, dll) |
| Tingkat Kerahasiaan | `text-pink-700` | `border-pink-200 focus:border-pink-500` | `RAH` | Level kerahasiaan (Public, Confidential) |

## **IMPLEMENTASI DI KODE**

### **Contoh Penggunaan di FileUploadDialog.tsx**

```tsx
// Informasi Dasar
<div className="flex items-center space-x-2">
  <Label htmlFor="title" className="text-gray-700 font-medium">
    Judul Dokumen <span className="text-red-500">*</span>
  </Label>
  <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200 text-gray-700">
    JUD
  </Badge>
</div>
<Input className="border-gray-200 focus:border-gray-500 focus:ring-gray-500" />

// Klasifikasi GCG
<div className="flex items-center space-x-2">
  <Label htmlFor="gcgPrinciple" className="text-purple-700 font-medium">
    Prinsip GCG <span className="text-red-500">*</span>
  </Label>
  <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
    GCG
  </Badge>
</div>
<SelectTrigger className="border-purple-200 focus:border-purple-500 focus:ring-purple-500" />

<div className="flex items-center space-x-2">
  <Label htmlFor="documentType" className="text-blue-700 font-medium">
    Jenis Dokumen <span className="text-red-500">*</span>
  </Label>
  <Badge variant="outline" className="text-xs bg-blue-50 border-blue-200 text-blue-700">
    TIPE
  </Badge>
</div>
<SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />

<div className="flex items-center space-x-2">
  <Label htmlFor="documentCategory" className="text-green-700 font-medium">
    Kategori Dokumen
  </Label>
  <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700">
    KAT
  </Badge>
</div>
<SelectTrigger className="border-green-200 focus:border-green-500 focus:ring-green-500" />

// Informasi Organisasi
<div className="flex items-center space-x-2">
  <Label htmlFor="direksi" className="text-indigo-700 font-medium">
    Direksi <span className="text-red-500">*</span>
  </Label>
  <Badge variant="outline" className="text-xs bg-indigo-50 border-indigo-200 text-indigo-700">
    DIR
  </Badge>
</div>
<SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500" />

<div className="flex items-center space-x-2">
  <Label htmlFor="division" className="text-indigo-700 font-medium">
    Divisi <span className="text-red-500">*</span>
  </Label>
  <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700">
    DIV
  </Badge>
</div>
<SelectTrigger className="border-orange-200 focus:border-orange-500 focus:ring-orange-500" />

// Pengelolaan Dokumen
<div className="flex items-center space-x-2">
  <Label htmlFor="status" className="text-teal-700 font-medium">
    Status Dokumen
  </Label>
  <Badge variant="outline" className="text-xs bg-teal-50 border-teal-200 text-teal-700">
    STS
  </Badge>
</div>
<SelectTrigger className="border-teal-200 focus:border-teal-500 focus:ring-teal-500" />

<div className="flex items-center space-x-2">
  <Label htmlFor="confidentiality" className="text-pink-700 font-medium">
    Tingkat Kerahasiaan
  </Label>
  <Badge variant="outline" className="text-xs bg-pink-50 border-pink-200 text-pink-700">
    RAH
  </Badge>
</div>
<SelectTrigger className="border-pink-200 focus:border-pink-500 focus:ring-pink-500" />
```

## **KONVENSI PENAMAAN**

### **Label Classes**
- Semua label menggunakan `font-medium` untuk ketebalan yang konsisten
- Format: `text-{color}-700 font-medium`
- Tanda wajib menggunakan `text-red-500`

### **Input/Select Classes**
- Border normal: `border-{color}-200`
- Focus state: `focus:border-{color}-500 focus:ring-{color}-500`
- Format lengkap: `border-{color}-200 focus:border-{color}-500 focus:ring-{color}-500`

## **PALET WARNA YANG DIGUNAKAN**

| Warna | Hex Code | Tailwind Class | Penggunaan |
|-------|----------|----------------|------------|
| Abu-abu | #374151 | `gray-700` | Informasi dasar |
| Ungu | #7C3AED | `purple-700` | Prinsip GCG |
| Biru | #1D4ED8 | `blue-700` | Jenis dokumen |
| Hijau | #15803D | `green-700` | Kategori dokumen |
| Indigo | #4338CA | `indigo-700` | Direksi |
| Oranye | #C2410C | `orange-700` | Divisi |
| Teal | #0F766E | `teal-700` | Status dokumen |
| Pink | #BE185D | `pink-700` | Tingkat kerahasiaan |
| Merah | #EF4444 | `red-500` | Tanda wajib (*) |

## **PANDUAN PENGGUNAAN**

### **Untuk Developer Baru**
1. Selalu gunakan skema warna yang sudah ditentukan
2. Jangan mengubah warna tanpa konsultasi
3. Gunakan format class yang konsisten
4. Pastikan kontras warna cukup untuk aksesibilitas

### **Untuk Menambah Metadata Baru**
1. Pilih warna yang belum digunakan
2. Update dokumentasi ini
3. Implementasikan di komponen yang sesuai
4. Test kontras dan aksesibilitas

## **AKSESIBILITAS**
- Semua warna memenuhi standar kontras WCAG 2.1 AA
- Warna merah untuk tanda wajib mudah dikenali
- Focus states jelas dan konsisten

## **VERSI**
- **Versi**: 1.0
- **Tanggal**: 2024
- **Terakhir Update**: Dialog Upload Dokumen
- **Status**: Aktif dan digunakan di production

---

**Catatan**: Dokumen ini harus selalu diupdate ketika ada perubahan skema warna metadata di aplikasi. 