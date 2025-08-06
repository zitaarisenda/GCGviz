import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useYear } from './YearContext';
import { 
  getDirektoratByYear, 
  getSubDirektoratByYear, 
  getDivisiByYear, 
  getLatestYear, 
  getAvailableYears,
  StrukturPerusahaanData 
} from '@/lib/strukturPerusahaan';

interface StrukturPerusahaanContextType {
  // Data berdasarkan tahun yang dipilih
  direktorat: string[];
  subdirektorat: string[];
  divisi: string[];
  
  // Utility data
  latestYear: number | null;
  availableYears: number[];
  
  // Refresh function
  refreshData: () => void;
  
  // Loading state
  isLoading: boolean;
}

const StrukturPerusahaanContext = createContext<StrukturPerusahaanContextType | undefined>(undefined);

interface StrukturPerusahaanProviderProps {
  children: ReactNode;
}

export const StrukturPerusahaanProvider: React.FC<StrukturPerusahaanProviderProps> = ({ children }) => {
  const { selectedYear } = useYear();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Get data based on selected year and refresh trigger
  const direktorat = getDirektoratByYear(selectedYear);
  const subdirektorat = getSubDirektoratByYear(selectedYear);
  const divisi = getDivisiByYear(selectedYear);
  const latestYear = getLatestYear();
  const availableYears = getAvailableYears();

  // Force re-render when refreshTrigger changes
  useEffect(() => {
    // This effect will run when refreshTrigger changes, forcing a re-render
  }, [refreshTrigger]);

  // Refresh function
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Listen for localStorage changes (cross-tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'direktorat' || e.key === 'subdirektorat' || e.key === 'divisi') {
        refreshData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Listen for custom events (same-tab updates)
  useEffect(() => {
    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail?.type === 'strukturPerusahaanUpdate') {
        refreshData();
      }
    };

    window.addEventListener('strukturPerusahaanUpdate', handleCustomEvent as EventListener);
    return () => window.removeEventListener('strukturPerusahaanUpdate', handleCustomEvent as EventListener);
  }, []);

  // Force refresh when selectedYear changes
  useEffect(() => {
    refreshData();
  }, [selectedYear]);

  const value: StrukturPerusahaanContextType = {
    direktorat,
    subdirektorat,
    divisi,
    latestYear,
    availableYears,
    refreshData,
    isLoading
  };

  return (
    <StrukturPerusahaanContext.Provider value={value}>
      {children}
    </StrukturPerusahaanContext.Provider>
  );
};

export const useStrukturPerusahaan = (): StrukturPerusahaanContextType => {
  const context = useContext(StrukturPerusahaanContext);
  if (context === undefined) {
    throw new Error('useStrukturPerusahaan must be used within a StrukturPerusahaanProvider');
  }
  return context;
};
