import React, { useState, useEffect } from 'react';
import AnalysisCard from '@/components/cards/AnalysisCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFileUpload } from '@/contexts/FileUploadContext';
import { useChecklist } from '@/contexts/ChecklistContext';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Upload,
  TrendingUp,
  AlertCircle,
  ListTodo,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DashboardStats = () => {
  const { selectedYear, getYearStats, getFilesByYear } = useFileUpload();
  const { checklist } = useChecklist();
  const [showAllAspects, setShowAllAspects] = useState(false);

  // Calculate statistics based on selected year
  const getStats = () => {
    if (!selectedYear) {
      return {
        totalChecklist: 0,
        uploadedFiles: 0,
        pendingFiles: 0,
        totalSize: 0,
        progress: 0
      };
    }

    const yearStats = getYearStats(selectedYear);
    const totalChecklist = checklist.length;
    const progress = totalChecklist > 0 ? Math.round((yearStats.uploadedCount / totalChecklist) * 100) : 0;

    return {
      totalChecklist,
      uploadedFiles: yearStats.uploadedCount,
      pendingFiles: totalChecklist - yearStats.uploadedCount,
      totalSize: yearStats.totalSize,
      progress
    };
  };

  // Get statistics per aspect
  const getAspectStats = () => {
    if (!selectedYear) return [];

    const yearFiles = getFilesByYear(selectedYear);
    const aspects = [...new Set(checklist.map(item => item.aspek))];
    
    return aspects.map(aspek => {
      const aspectItems = checklist.filter(item => item.aspek === aspek);
      const uploadedFiles = yearFiles.filter(file => file.aspect === aspek);
      const totalItems = aspectItems.length;
      const uploadedCount = uploadedFiles.length;
      const pendingCount = totalItems - uploadedCount;
      const progress = totalItems > 0 ? Math.round((uploadedCount / totalItems) * 100) : 0;

      return {
        aspek,
        totalItems,
        uploadedCount,
        pendingCount,
        progress,
        files: uploadedFiles
      };
    });
  };

  const stats = getStats();
  const aspectStats = getAspectStats();



  // Get first 4 aspects for display
  const getFirstFourAspects = () => {
    return aspectStats.slice(0, 4);
  };

  const firstFourAspects = getFirstFourAspects();
  const allAspects = aspectStats;

  // Helper functions
  const getAspectIcon = (aspekName: string) => {
    // ASPEK I. Komitmen
    if (aspekName.includes('ASPEK I') || aspekName.includes('Komitmen')) return BarChart3;
    
    // ASPEK II. RUPS
    if (aspekName.includes('ASPEK II') || aspekName.includes('RUPS')) return CheckCircle;
    
    // ASPEK III. Dewan Komisaris
    if (aspekName.includes('ASPEK III') || aspekName.includes('Dewan Komisaris')) return TrendingUp;
    
    // ASPEK IV. Direksi
    if (aspekName.includes('ASPEK IV') || aspekName.includes('Direksi')) return FileText;
    
    // ASPEK V. Pengungkapan
    if (aspekName.includes('ASPEK V') || aspekName.includes('Pengungkapan')) return Upload;
    
    // ASPEK Tambahan
    if (aspekName.includes('Tambahan')) return Plus;
    
    return Plus; // Default icon untuk aspek baru
  };

  const getAspectColor = (progress: number) => {
    if (progress >= 80) return "green" as const;
    if (progress >= 50) return "yellow" as const;
    return "red" as const;
  };

  // Create analysis data for first 4 aspects
  const analysisData = firstFourAspects.map((aspect, index) => {
    return {
      title: aspect.aspek,
      value: `${aspect.totalItems} item`,
      subtitle: `${aspect.uploadedCount} sudah terupload`,
      icon: getAspectIcon(aspect.aspek),
      color: getAspectColor(aspect.progress),
      percentage: aspect.progress
    };
  });

  // Create analysis data for all aspects
  const allAnalysisData = allAspects.map((aspect, index) => {
    return {
      title: aspect.aspek,
      value: `${aspect.totalItems} item`,
      subtitle: `${aspect.uploadedCount} sudah terupload`,
      icon: getAspectIcon(aspect.aspek),
      color: getAspectColor(aspect.progress),
      percentage: aspect.progress
    };
  });

  if (!selectedYear) {
    return (
      <div className="mb-8">
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Pilih Tahun Buku
          </h3>
          <p className="text-gray-600">
            Silakan pilih tahun buku di atas untuk melihat statistik dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Year Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Statistik Tahun Buku {selectedYear}
        </h2>
        <p className="text-gray-600">
          Overview dokumen dan checklist assessment tahun {selectedYear}
        </p>
      </div>

      {/* Analysis Cards Grid */}
      <div className="relative">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(showAllAspects ? allAnalysisData : analysisData).map((data, index) => (
            <AnalysisCard key={index} {...data} />
          ))}
        </div>

        {/* View All Button */}
        {aspectStats.length > 4 && (
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={() => setShowAllAspects(!showAllAspects)}
            >
              {showAllAspects ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Sembunyikan Semua Aspek</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Lihat Semua Aspek ({aspectStats.length})</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>




    </div>
  );
};

export default DashboardStats; 