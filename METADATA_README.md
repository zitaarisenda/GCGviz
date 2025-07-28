# 📋 METADATA GCG DOCUMENT HUB

## **📖 DAFTAR ISI**
1. [Overview](#overview)
2. [File Dokumentasi](#file-dokumentasi)
3. [Skema Warna](#skema-warna)
4. [Cara Penggunaan](#cara-penggunaan)
5. [Contoh Implementasi](#contoh-implementasi)
6. [Best Practices](#best-practices)

## **🔍 OVERVIEW**

Metadata adalah informasi tambahan yang menjelaskan dokumen GCG. Setiap jenis metadata memiliki warna yang berbeda untuk memudahkan identifikasi dan pengalaman pengguna yang lebih baik.

## **📁 FILE DOKUMENTASI**

### **1. METADATA_COLOR_SCHEME.md**
- 📄 Dokumentasi lengkap skema warna
- 🎨 Palet warna yang digunakan
- 📋 Tabel referensi cepat
- 🔧 Contoh implementasi

### **2. src/styles/metadata-colors.css**
- 🎨 CSS utility classes
- 🔄 Hover, focus, disabled states
- ❌ Error dan success states
- 📱 Responsive design

### **3. src/lib/metadata-colors.ts**
- ⚡ TypeScript utility functions
- 🎯 Type safety
- 🔧 Helper functions
- 📦 Preset combinations

## **🎨 SKEMA WARNA**

### **Informasi Dasar Dokumen**
| Metadata | Warna | Hex Code | Tailwind Class |
|----------|-------|----------|----------------|
| Judul Dokumen | Abu-abu | #374151 | `text-gray-700` |
| Nomor Dokumen | Abu-abu | #374151 | `text-gray-700` |
| Deskripsi | Abu-abu | #374151 | `text-gray-700` |

### **Klasifikasi GCG**
| Metadata | Warna | Hex Code | Tailwind Class |
|----------|-------|----------|----------------|
| Prinsip GCG | Ungu | #7C3AED | `text-purple-700` |
| Jenis Dokumen | Biru | #1D4ED8 | `text-blue-700` |
| Kategori Dokumen | Hijau | #15803D | `text-green-700` |

### **Informasi Organisasi**
| Metadata | Warna | Hex Code | Tailwind Class |
|----------|-------|----------|----------------|
| Direksi | Indigo | #4338CA | `text-indigo-700` |
| Divisi | Oranye | #C2410C | `text-orange-700` |

### **Pengelolaan Dokumen**
| Metadata | Warna | Hex Code | Tailwind Class |
|----------|-------|----------|----------------|
| Status Dokumen | Teal | #0F766E | `text-teal-700` |
| Tingkat Kerahasiaan | Pink | #BE185D | `text-pink-700` |

## **🚀 CARA PENGGUNAAN**

### **1. Menggunakan CSS Classes Langsung**
```tsx
<Label className="text-purple-700 font-medium">
  Prinsip GCG <span className="text-red-500">*</span>
</Label>
<SelectTrigger className="border-purple-200 focus:border-purple-500 focus:ring-purple-500">
```

### **2. Menggunakan CSS Utility Classes**
```tsx
<Label className="metadata-gcg-principle-label">
  Prinsip GCG <span className="metadata-required">*</span>
</Label>
<SelectTrigger className="metadata-gcg-principle-input">
```

### **3. Menggunakan TypeScript Utility**
```tsx
import { getMetadataLabelClass, getMetadataInputClass } from '@/lib/metadata-colors';

<Label className={getMetadataLabelClass('gcg-principle')}>
  Prinsip GCG <span className="text-red-500">*</span>
</Label>
<SelectTrigger className={getMetadataInputClass('gcg-principle')}>
```

### **4. Menggunakan Preset**
```tsx
import { METADATA_PRESETS } from '@/lib/metadata-colors';

<Label className={METADATA_PRESETS.gcgPrinciple.label}>
  Prinsip GCG <span className="text-red-500">*</span>
</Label>
<SelectTrigger className={METADATA_PRESETS.gcgPrinciple.input}>
```

## **💡 CONTOH IMPLEMENTASI**

### **Form Field Lengkap**
```tsx
import { METADATA_PRESETS } from '@/lib/metadata-colors';

const GcgPrincipleField = () => {
  return (
    <div className="space-y-2">
      <Label className={METADATA_PRESETS.gcgPrinciple.label}>
        Prinsip GCG <span className="text-red-500">*</span>
      </Label>
      <Select>
        <SelectTrigger className={METADATA_PRESETS.gcgPrinciple.input}>
          <SelectValue placeholder="Pilih prinsip GCG" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="transparansi">Transparansi</SelectItem>
          <SelectItem value="akuntabilitas">Akuntabilitas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
```

### **Dynamic State Management**
```tsx
import { getMetadataInputWithStateClass } from '@/lib/metadata-colors';

const DocumentTypeField = ({ hasError, isValid }) => {
  const state = hasError ? 'error' : isValid ? 'success' : 'normal';
  
  return (
    <SelectTrigger className={getMetadataInputWithStateClass('document-type', state)}>
      <SelectValue placeholder="Pilih jenis dokumen" />
    </SelectTrigger>
  );
};
```

## **✅ BEST PRACTICES**

### **1. Konsistensi**
- ✅ Selalu gunakan skema warna yang sudah ditentukan
- ✅ Jangan mengubah warna tanpa konsultasi
- ✅ Gunakan format class yang konsisten

### **2. Aksesibilitas**
- ✅ Pastikan kontras warna cukup (WCAG 2.1 AA)
- ✅ Gunakan focus states yang jelas
- ✅ Tanda wajib menggunakan warna merah

### **3. Maintenance**
- ✅ Update dokumentasi ketika ada perubahan
- ✅ Test kontras dan aksesibilitas
- ✅ Gunakan TypeScript untuk type safety

### **4. Performance**
- ✅ Gunakan CSS classes yang sudah dioptimasi
- ✅ Hindari inline styles
- ✅ Manfaatkan Tailwind CSS purging

## **🔧 MAINTENANCE**

### **Menambah Metadata Baru**
1. Pilih warna yang belum digunakan
2. Update `METADATA_COLORS` di `metadata-colors.ts`
3. Tambahkan CSS classes di `metadata-colors.css`
4. Update dokumentasi di `METADATA_COLOR_SCHEME.md`
5. Test implementasi

### **Mengubah Warna**
1. Update semua file yang terkait
2. Test kontras dan aksesibilitas
3. Update dokumentasi
4. Informasikan tim development

## **📞 SUPPORT**

Jika ada pertanyaan atau masalah terkait metadata:
1. Cek dokumentasi di `METADATA_COLOR_SCHEME.md`
2. Lihat contoh di `metadata-colors.ts`
3. Hubungi tim development

---

**📅 Last Updated**: 2024  
**🔄 Version**: 1.0  
**👥 Maintainer**: Development Team 