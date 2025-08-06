// Utility functions untuk mengakses data struktur perusahaan berdasarkan tahun

export interface StrukturPerusahaanData {
  id: number;
  nama: string;
  tahun: number;
  createdAt: Date;
  isActive: boolean;
  kategori?: string;
}

/**
 * Mendapatkan data direktorat berdasarkan tahun
 * @param year - Tahun yang ingin diambil datanya
 * @returns Array of direktorat data
 */
export const getDirektoratByYear = (year: number): string[] => {
  try {
    const data = localStorage.getItem('direktorat');
    if (!data) return [];
    
    const list = JSON.parse(data) as StrukturPerusahaanData[];
    return Array.from(
      new Set(
        list
          .filter((d) => d.tahun === year && d.isActive)
          .map((d) => String(d.nama))
      )
    ).sort();
  } catch (error) {
    console.error('Error getting direktorat data:', error);
    return [];
  }
};

/**
 * Mendapatkan data subdirektorat berdasarkan tahun
 * @param year - Tahun yang ingin diambil datanya
 * @returns Array of subdirektorat data
 */
export const getSubDirektoratByYear = (year: number): string[] => {
  try {
    const data = localStorage.getItem('subdirektorat');
    if (!data) return [];
    
    const list = JSON.parse(data) as StrukturPerusahaanData[];
    return Array.from(
      new Set(
        list
          .filter((d) => d.tahun === year && d.isActive)
          .map((d) => String(d.nama))
      )
    ).sort();
  } catch (error) {
    console.error('Error getting subdirektorat data:', error);
    return [];
  }
};

/**
 * Mendapatkan data divisi berdasarkan tahun
 * @param year - Tahun yang ingin diambil datanya
 * @returns Array of divisi data
 */
export const getDivisiByYear = (year: number): string[] => {
  try {
    const data = localStorage.getItem('divisi');
    if (!data) return [];
    
    const list = JSON.parse(data) as StrukturPerusahaanData[];
    return Array.from(
      new Set(
        list
          .filter((d) => d.tahun === year && d.isActive)
          .map((d) => String(d.nama))
      )
    ).sort();
  } catch (error) {
    console.error('Error getting divisi data:', error);
    return [];
  }
};

/**
 * Mendapatkan semua data struktur perusahaan berdasarkan tahun
 * @param year - Tahun yang ingin diambil datanya
 * @returns Object containing direktorat, subdirektorat, and divisi data
 */
export const getStrukturPerusahaanByYear = (year: number) => {
  return {
    direktorat: getDirektoratByYear(year),
    subdirektorat: getSubDirektoratByYear(year),
    divisi: getDivisiByYear(year)
  };
};

/**
 * Mendapatkan tahun terbaru dari data yang tersedia
 * @returns Tahun terbaru atau null jika tidak ada data
 */
export const getLatestYear = (): number | null => {
  try {
    const direktoratData = localStorage.getItem('direktorat');
    const subdirektoratData = localStorage.getItem('subdirektorat');
    const divisiData = localStorage.getItem('divisi');
    
    const allYears: number[] = [];
    
    if (direktoratData) {
      const list = JSON.parse(direktoratData) as StrukturPerusahaanData[];
      list.forEach(item => allYears.push(item.tahun));
    }
    
    if (subdirektoratData) {
      const list = JSON.parse(subdirektoratData) as StrukturPerusahaanData[];
      list.forEach(item => allYears.push(item.tahun));
    }
    
    if (divisiData) {
      const list = JSON.parse(divisiData) as StrukturPerusahaanData[];
      list.forEach(item => allYears.push(item.tahun));
    }
    
    if (allYears.length === 0) return null;
    
    return Math.max(...allYears);
  } catch (error) {
    console.error('Error getting latest year:', error);
    return null;
  }
};

/**
 * Mendapatkan semua tahun yang tersedia dalam data struktur perusahaan
 * @returns Array of years
 */
export const getAvailableYears = (): number[] => {
  try {
    const direktoratData = localStorage.getItem('direktorat');
    const subdirektoratData = localStorage.getItem('subdirektorat');
    const divisiData = localStorage.getItem('divisi');
    
    const allYears: number[] = [];
    
    if (direktoratData) {
      const list = JSON.parse(direktoratData) as StrukturPerusahaanData[];
      list.forEach(item => allYears.push(item.tahun));
    }
    
    if (subdirektoratData) {
      const list = JSON.parse(subdirektoratData) as StrukturPerusahaanData[];
      list.forEach(item => allYears.push(item.tahun));
    }
    
    if (divisiData) {
      const list = JSON.parse(divisiData) as StrukturPerusahaanData[];
      list.forEach(item => allYears.push(item.tahun));
    }
    
    return Array.from(new Set(allYears)).sort((a, b) => b - a); // Sort descending
  } catch (error) {
    console.error('Error getting available years:', error);
    return [];
  }
};

/**
 * Hook untuk mendapatkan data struktur perusahaan berdasarkan tahun
 * @param year - Tahun yang ingin diambil datanya
 * @returns Object containing direktorat, subdirektorat, and divisi data
 */
export const useStrukturPerusahaan = (year: number) => {
  return {
    direktorat: getDirektoratByYear(year),
    subdirektorat: getSubDirektoratByYear(year),
    divisi: getDivisiByYear(year),
    latestYear: getLatestYear(),
    availableYears: getAvailableYears()
  };
};

/**
 * Memicu update di semua komponen yang menggunakan data struktur perusahaan
 * Fungsi ini akan dipanggil setiap kali ada perubahan data di menu Struktur Perusahaan
 */
export const triggerStrukturPerusahaanUpdate = () => {
  // Dispatch custom event untuk update dalam tab yang sama
  window.dispatchEvent(new CustomEvent('strukturPerusahaanUpdate', {
    detail: { type: 'strukturPerusahaanUpdate' }
  }));
  
  // Trigger storage event untuk update cross-tab (opsional)
  window.dispatchEvent(new StorageEvent('storage', {
    key: 'strukturPerusahaanUpdate',
    newValue: Date.now().toString(),
    oldValue: null,
    storageArea: localStorage
  }));
};
