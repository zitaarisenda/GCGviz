import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UploadedFile {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  year: number;
  checklistId?: number;
  checklistDescription?: string;
  aspect?: string;
  status: 'uploaded' | 'pending';
}

interface FileUploadContextType {
  uploadedFiles: UploadedFile[];
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
  uploadFile: (file: File, checklistId?: number, checklistDescription?: string, aspect?: string) => void;
  deleteFile: (fileId: string) => void;
  getFilesByYear: (year: number) => UploadedFile[];
  getYearStats: (year: number) => {
    totalFiles: number;
    totalSize: number;
    uploadedCount: number;
    pendingCount: number;
  };
}

const FileUploadContext = createContext<FileUploadContextType | undefined>(undefined);

export const FileUploadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('uploadedFiles');
    const savedYear = localStorage.getItem('selectedYear');
    
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles).map((file: any) => ({
        ...file,
        uploadDate: new Date(file.uploadDate)
      }));
      setUploadedFiles(parsedFiles);
    }
    
    if (savedYear) {
      setSelectedYear(parseInt(savedYear));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  useEffect(() => {
    if (selectedYear) {
      localStorage.setItem('selectedYear', selectedYear.toString());
    } else {
      localStorage.removeItem('selectedYear');
    }
  }, [selectedYear]);

  const uploadFile = (file: File, checklistId?: number, checklistDescription?: string, aspect?: string) => {
    if (!selectedYear) return;

    const newFile: UploadedFile = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      fileSize: file.size,
      uploadDate: new Date(),
      year: selectedYear,
      checklistId,
      checklistDescription,
      aspect,
      status: 'uploaded'
    };

    setUploadedFiles(prev => [...prev, newFile]);
  };

  const deleteFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFilesByYear = (year: number) => {
    return uploadedFiles.filter(file => file.year === year);
  };

  const getYearStats = (year: number) => {
    const yearFiles = getFilesByYear(year);
    const totalSize = yearFiles.reduce((sum, file) => sum + file.fileSize, 0);
    const uploadedCount = yearFiles.filter(file => file.status === 'uploaded').length;
    const pendingCount = yearFiles.filter(file => file.status === 'pending').length;

    return {
      totalFiles: yearFiles.length,
      totalSize,
      uploadedCount,
      pendingCount
    };
  };

  return (
    <FileUploadContext.Provider value={{
      uploadedFiles,
      selectedYear,
      setSelectedYear,
      uploadFile,
      deleteFile,
      getFilesByYear,
      getYearStats
    }}>
      {children}
    </FileUploadContext.Provider>
  );
};

export const useFileUpload = () => {
  const context = useContext(FileUploadContext);
  if (context === undefined) {
    throw new Error('useFileUpload must be used within a FileUploadProvider');
  }
  return context;
}; 