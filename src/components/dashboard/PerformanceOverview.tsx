import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import { useChecklist } from '@/contexts/ChecklistContext';
import { useYear } from '@/contexts/YearContext';
import { 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Activity,
  Sparkles,
  Rocket,
  Trophy,
  Zap,
  ArrowUp,
  ArrowDown,
  Target,
  Award
} from 'lucide-react';

interface PerformanceOverviewProps {
  animateStats?: boolean;
}

const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ animateStats = false }) => {
  const { selectedYear } = useYear();
  const { documents, getDocumentsByYear } = useDocumentMetadata();
  const { checklist } = useChecklist();

  const stats = useMemo(() => {
    if (!selectedYear) return null;

    const yearDocuments = getDocumentsByYear(selectedYear);
    const yearChecklist = checklist.filter(item => item.tahun === selectedYear);

    const totalDocuments = yearDocuments.length;
    const totalSize = yearDocuments.reduce((sum, doc) => sum + (doc.fileSize || 0), 0);
    const totalChecklist = yearChecklist.length;
    const uploadedChecklist = yearChecklist.filter(item => 
      yearDocuments.some(doc => doc.checklistId === item.id)
    ).length;
    const completionRate = totalChecklist > 0 ? (uploadedChecklist / totalChecklist) * 100 : 0;

    // Calculate growth from previous year
    const prevYearDocuments = getDocumentsByYear(selectedYear - 1);
    const prevYearChecklist = checklist.filter(item => item.tahun === selectedYear - 1);
    const prevYearUploaded = prevYearChecklist.filter(item => 
      prevYearDocuments.some(doc => doc.checklistId === item.id)
    ).length;
    const prevYearCompletion = prevYearChecklist.length > 0 ? (prevYearUploaded / prevYearChecklist.length) * 100 : 0;
    const growthRate = prevYearCompletion > 0 ? ((completionRate - prevYearCompletion) / prevYearCompletion) * 100 : 0;

    // Top performing aspect
    const aspectStats = ['Transparansi', 'Akuntabilitas', 'Responsibilitas', 'Independensi', 'Kesetaraan'].map(principle => {
      const aspectDocs = yearDocuments.filter(doc => doc.gcgPrinciple === principle);
      const aspectChecklist = yearChecklist.filter(item => 
        item.aspek.includes(principle) || item.deskripsi.includes(principle)
      );
      const aspectUploaded = aspectChecklist.filter(item => 
        aspectDocs.some(doc => doc.checklistId === item.id)
      ).length;
      
      return {
        principle,
        progress: aspectChecklist.length > 0 ? (aspectUploaded / aspectChecklist.length) * 100 : 0,
        documents: aspectDocs.length
      };
    });

    const topAspect = aspectStats.reduce((max, current) => 
      current.progress > max.progress ? current : max
    );

    return {
      totalDocuments,
      totalSize,
      totalChecklist,
      uploadedChecklist,
      completionRate,
      growthRate,
      topAspect,
      averageFileSize: totalDocuments > 0 ? totalSize / totalDocuments : 0
    };
  }, [selectedYear, documents, checklist, getDocumentsByYear]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Documents Card */}
      <Card className={`border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transform transition-all duration-500 ${animateStats ? 'scale-105' : 'scale-100'}`}>
        <CardContent className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-8 h-8 text-blue-200" />
              <Badge className="bg-blue-400/20 text-blue-100 border-blue-300/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Total
              </Badge>
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Dokumen</p>
            <p className="text-4xl font-bold mb-2">{stats.totalDocuments}</p>
            <p className="text-blue-100 text-sm">{formatFileSize(stats.totalSize)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate Card */}
      <Card className={`border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white transform transition-all duration-500 delay-100 ${animateStats ? 'scale-105' : 'scale-100'}`}>
        <CardContent className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-8 h-8 text-green-200" />
              <Badge className="bg-green-400/20 text-green-100 border-green-300/30">
                <Rocket className="w-3 h-3 mr-1" />
                Progress
              </Badge>
            </div>
            <p className="text-green-100 text-sm font-medium mb-1">Completion Rate</p>
            <p className="text-4xl font-bold mb-2">{stats.completionRate.toFixed(1)}%</p>
            <div className="flex items-center space-x-2">
              <p className="text-green-100 text-sm">{stats.uploadedChecklist} dari {stats.totalChecklist} checklist</p>
              {stats.growthRate !== 0 && (
                <div className={`flex items-center text-xs ${stats.growthRate > 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {stats.growthRate > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                  {Math.abs(stats.growthRate).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performer Card */}
      <Card className={`border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white transform transition-all duration-500 delay-200 ${animateStats ? 'scale-105' : 'scale-100'}`}>
        <CardContent className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-purple-200" />
              <Badge className="bg-purple-400/20 text-purple-100 border-purple-300/30">
                <Award className="w-3 h-3 mr-1" />
                Top Performer
              </Badge>
            </div>
            <p className="text-purple-100 text-sm font-medium mb-1">Aspek Terbaik</p>
            <p className="text-4xl font-bold mb-2">{stats.topAspect.progress.toFixed(1)}%</p>
            <p className="text-purple-100 text-sm">{stats.topAspect.principle}</p>
            <p className="text-purple-200 text-xs">{stats.topAspect.documents} dokumen</p>
          </div>
        </CardContent>
      </Card>

      {/* Efficiency Card */}
      <Card className={`border-0 shadow-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white transform transition-all duration-500 delay-300 ${animateStats ? 'scale-105' : 'scale-100'}`}>
        <CardContent className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-orange-200" />
              <Badge className="bg-orange-400/20 text-orange-100 border-orange-300/30">
                <Zap className="w-3 h-3 mr-1" />
                Efficiency
              </Badge>
            </div>
            <p className="text-orange-100 text-sm font-medium mb-1">Rata-rata File</p>
            <p className="text-4xl font-bold mb-2">{formatFileSize(stats.averageFileSize)}</p>
            <p className="text-orange-100 text-sm">per dokumen</p>
            <div className="mt-2">
              <Progress 
                value={Math.min((stats.averageFileSize / (1024 * 1024)) * 100, 100)} 
                className="h-2 bg-orange-400/30"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceOverview; 