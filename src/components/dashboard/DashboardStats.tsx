import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { KeenSliderPlugin } from 'keen-slider';

// Keen-slider autoplay plugin
const autoplay = (run = true, interval = 2500): KeenSliderPlugin => (slider) => {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;
  function clearNextTimeout() {
    clearTimeout(timeout);
  }
  function nextTimeout() {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      if (run && slider) slider.next();
    }, interval);
  }
  slider.on('created', () => {
    slider.container.addEventListener('mouseover', () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener('mouseout', () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });
  slider.on('dragStarted', clearNextTimeout);
  slider.on('animationEnded', nextTimeout);
  slider.on('updated', nextTimeout);
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const DashboardStats = () => {
  const navigate = useNavigate();
  const { selectedYear, getYearStats, getFilesByYear } = useFileUpload();
  const { checklist } = useChecklist();
  const [showAllAspects, setShowAllAspects] = useState(false);
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 16 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2, spacing: 24 } },
      '(min-width: 1024px)': { slides: { perView: 3, spacing: 24 } },
      '(min-width: 1280px)': { slides: { perView: 4, spacing: 24 } },
    },
    drag: true,
    created(slider) {
      slider.moveToIdx(0, true);
    }
  }, [autoplay()]);

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
    if (aspekName.includes('ASPEK I')) return BarChart3;
    if (aspekName.includes('ASPEK II')) return CheckCircle;
    if (aspekName.includes('ASPEK III')) return TrendingUp;
    if (aspekName.includes('ASPEK IV')) return FileText;
    if (aspekName.includes('ASPEK V')) return Upload;
    // Aspek baru/default
    return Plus;
  };

  // Mapping warna unik untuk tiap aspek
  const ASPECT_COLORS: Record<string, string> = {
    'ASPEK I. Komitmen': '#2563eb', // biru
    'ASPEK II. RUPS': '#059669',    // hijau
    'ASPEK III. Dewan Komisaris': '#f59e42', // oranye
    'ASPEK IV. Direksi': '#eab308', // kuning
    'ASPEK V. Pengungkapan': '#d946ef', // ungu
    // fallback
    'default': '#ef4444', // merah
  };

  const getAspectColor = (aspekName: string, progress: number) => {
    if (ASPECT_COLORS[aspekName]) return ASPECT_COLORS[aspekName];
    if (progress >= 80) return '#059669'; // hijau
    if (progress >= 50) return '#eab308'; // kuning
    return '#ef4444'; // merah
  };

  // Function to navigate to List GCG with filters
  const handleAspectClick = (aspectName: string) => {
    if (!selectedYear) return;
    
    // Navigate to List GCG with year and aspect parameters
    navigate(`/list-gcg?year=${selectedYear}&aspect=${encodeURIComponent(aspectName)}`);
  };

  // Create analysis data for first 4 aspects
  const analysisData = firstFourAspects.map((aspect) => ({
    title: aspect.aspek,
    value: `${aspect.totalItems} item`,
    subtitle: `${aspect.uploadedCount} sudah terupload`,
    icon: getAspectIcon(aspect.aspek),
    color: getAspectColor(aspect.aspek, aspect.progress),
    percentage: aspect.progress
  }));

  // Create analysis data for all aspects
  const allAnalysisData = allAspects.map((aspect) => ({
    title: aspect.aspek,
    value: `${aspect.totalItems} item`,
    subtitle: `${aspect.uploadedCount} sudah terupload`,
    icon: getAspectIcon(aspect.aspek),
    color: getAspectColor(aspect.aspek, aspect.progress),
    percentage: aspect.progress
  }));

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

      {/* Analysis Cards Grid / Swiper */}
      <div className="relative">
        {showAllAspects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allAnalysisData.map((data, index) => (
              <AnalysisCard 
                key={index} 
                {...data} 
                onClick={() => handleAspectClick(data.title)}
              />
            ))}
          </div>
        ) : (
          <div ref={sliderRef} className="keen-slider">
            {allAnalysisData.map((data, index) => (
              <div key={index} className="keen-slider__slide px-2">
                <AnalysisCard 
                  {...data} 
                  highlightBorder={data.color}
                  onClick={() => handleAspectClick(data.title)}
                />
              </div>
            ))}
          </div>
        )}
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
                  <span>Lihat Semua Aspek</span>
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