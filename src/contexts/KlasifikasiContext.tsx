import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface KlasifikasiItem {
  id: number;
  nama: string;
  tipe: 'prinsip' | 'jenis' | 'kategori';
  createdAt: Date;
  isActive: boolean;
}

interface KlasifikasiContextType {
  klasifikasiData: KlasifikasiItem[];
  klasifikasiPrinsip: string[];
  klasifikasiJenis: string[];
  klasifikasiKategori: string[];
  refreshKlasifikasi: () => void;
  addKlasifikasi: (item: Omit<KlasifikasiItem, 'id' | 'createdAt'>) => void;
  updateKlasifikasi: (id: number, updates: Partial<KlasifikasiItem>) => void;
  deleteKlasifikasi: (id: number) => void;
}

const KlasifikasiContext = createContext<KlasifikasiContextType | undefined>(undefined);

export const useKlasifikasi = () => {
  const context = useContext(KlasifikasiContext);
  if (context === undefined) {
    throw new Error('useKlasifikasi must be used within a KlasifikasiProvider');
  }
  return context;
};

interface KlasifikasiProviderProps {
  children: React.ReactNode;
}

export const KlasifikasiProvider: React.FC<KlasifikasiProviderProps> = ({ children }) => {
  const [klasifikasiData, setKlasifikasiData] = useState<KlasifikasiItem[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const data = localStorage.getItem('klasifikasiGCG');
    if (data) {
      setKlasifikasiData(JSON.parse(data));
    } else {
      // Initialize with default data if no data exists
      const defaultKlasifikasi = [
        // Prinsip GCG
        { id: 1, nama: 'Transparansi', tipe: 'prinsip', createdAt: new Date(), isActive: true },
        { id: 2, nama: 'Akuntabilitas', tipe: 'prinsip', createdAt: new Date(), isActive: true },
        { id: 3, nama: 'Responsibilitas', tipe: 'prinsip', createdAt: new Date(), isActive: true },
        { id: 4, nama: 'Independensi', tipe: 'prinsip', createdAt: new Date(), isActive: true },
        { id: 5, nama: 'Kesetaraan', tipe: 'prinsip', createdAt: new Date(), isActive: true },
        // Jenis Dokumen
        { id: 6, nama: 'Kebijakan', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 7, nama: 'Laporan', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 8, nama: 'Risalah', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 9, nama: 'Dokumentasi', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 10, nama: 'Sosialisasi', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 11, nama: 'Peraturan', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 12, nama: 'SOP', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 13, nama: 'Pedoman', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 14, nama: 'Manual', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 15, nama: 'Piagam', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 16, nama: 'Surat Keputusan', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 17, nama: 'Surat Edaran', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 18, nama: 'Nota Dinas', tipe: 'jenis', createdAt: new Date(), isActive: true },
        { id: 19, nama: 'Lainnya', tipe: 'jenis', createdAt: new Date(), isActive: true },
        // Kategori Dokumen
        { id: 20, nama: 'Laporan Keuangan', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 21, nama: 'Laporan Manajemen', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 22, nama: 'Laporan Audit', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 23, nama: 'Laporan Triwulan', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 24, nama: 'Laporan Tahunan', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 25, nama: 'Risalah Rapat Direksi', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 26, nama: 'Risalah Rapat Komisaris', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 27, nama: 'Risalah Rapat Komite', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 28, nama: 'Code of Conduct', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 29, nama: 'Board Manual', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 30, nama: 'Pedoman Tata Kelola', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 31, nama: 'Kebijakan Manajemen Risiko', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 32, nama: 'Kebijakan Pengendalian Intern', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 33, nama: 'LHKPN', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 34, nama: 'WBS', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 35, nama: 'CV Dewan', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 36, nama: 'Surat Pernyataan', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 37, nama: 'Pakta Integritas', tipe: 'kategori', createdAt: new Date(), isActive: true },
        { id: 38, nama: 'Lainnya', tipe: 'kategori', createdAt: new Date(), isActive: true },
      ];
      setKlasifikasiData(defaultKlasifikasi);
      localStorage.setItem('klasifikasiGCG', JSON.stringify(defaultKlasifikasi));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (klasifikasiData.length > 0) {
      localStorage.setItem('klasifikasiGCG', JSON.stringify(klasifikasiData));
    }
  }, [klasifikasiData]);

  // Memoized filtered data
  const klasifikasiPrinsip = useMemo(() => {
    return klasifikasiData
      .filter(item => item.tipe === 'prinsip' && item.isActive)
      .map(item => item.nama);
  }, [klasifikasiData]);

  const klasifikasiJenis = useMemo(() => {
    return klasifikasiData
      .filter(item => item.tipe === 'jenis' && item.isActive)
      .map(item => item.nama);
  }, [klasifikasiData]);

  const klasifikasiKategori = useMemo(() => {
    return klasifikasiData
      .filter(item => item.tipe === 'kategori' && item.isActive)
      .map(item => item.nama);
  }, [klasifikasiData]);

  const refreshKlasifikasi = () => {
    const data = localStorage.getItem('klasifikasiGCG');
    if (data) {
      setKlasifikasiData(JSON.parse(data));
    }
  };

  const addKlasifikasi = (item: Omit<KlasifikasiItem, 'id' | 'createdAt'>) => {
    const newItem: KlasifikasiItem = {
      ...item,
      id: Date.now(),
      createdAt: new Date(),
    };
    setKlasifikasiData(prev => [...prev, newItem]);
  };

  const updateKlasifikasi = (id: number, updates: Partial<KlasifikasiItem>) => {
    setKlasifikasiData(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteKlasifikasi = (id: number) => {
    setKlasifikasiData(prev => prev.filter(item => item.id !== id));
  };

  const value = {
    klasifikasiData,
    klasifikasiPrinsip,
    klasifikasiJenis,
    klasifikasiKategori,
    refreshKlasifikasi,
    addKlasifikasi,
    updateKlasifikasi,
    deleteKlasifikasi,
  };

  return (
    <KlasifikasiContext.Provider value={value}>
      {children}
    </KlasifikasiContext.Provider>
  );
}; 