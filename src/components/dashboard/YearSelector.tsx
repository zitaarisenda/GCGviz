import React, { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plus } from 'lucide-react';
import { useFileUpload } from '@/contexts/FileUploadContext';
import FileUploadDialog from './FileUploadDialog';

interface YearSelectorProps {
  initialYear?: number;
}

const YearSelector: React.FC<YearSelectorProps> = ({ initialYear }) => {
  const { selectedYear, setSelectedYear, getFilesByYear } = useFileUpload();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Set initial year if provided
  useEffect(() => {
    if (initialYear && initialYear !== selectedYear) {
      setSelectedYear(initialYear);
    }
  }, [initialYear, selectedYear, setSelectedYear]);

  // Generate years from 2014 to current year
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearsArray = [];
    for (let year = currentYear; year >= 2014; year--) {
      yearsArray.push(year);
    }
    return yearsArray;
  }, []);

  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
  };



  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };



  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tahun Buku</h2>
            <p className="text-sm text-gray-600">
              Pilih tahun buku untuk mengakses data dan upload dokumen
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedYear && (
            <Button
              onClick={() => setIsUploadDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Dokumen Baru
            </Button>
          )}
            <span className="text-sm text-gray-600">
            Tahun yang dipilih: <span className="font-semibold text-blue-600">{selectedYear || 'Belum dipilih'}</span>
            </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              size="sm"
              onClick={() => handleYearSelect(year)}
              className={`transition-all duration-200 ${
                selectedYear === year 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {year}
            </Button>
          ))}
        </div>
        
        {selectedYear && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tahun Buku {selectedYear}:</strong> Dokumen assessment yang dibuat/dikumpulkan di tahun {selectedYear}
            </p>
          </div>
        )}


      </div>

      {/* File Upload Dialog */}
      <FileUploadDialog
        isOpen={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </div>
  );
};

export default YearSelector; 