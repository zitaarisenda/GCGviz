import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import { useChecklist } from '@/contexts/ChecklistContext';
import { useYear } from '@/contexts/YearContext';
import { Users, TrendingUp, Award, Target, Activity } from 'lucide-react';

interface SubDirektoratPerformanceProps {
  className?: string;
}

const SubDirektoratPerformance: React.FC<SubDirektoratPerformanceProps> = ({ className }) => {
  const { selectedYear } = useYear();
  const { documents, getDocumentsByYear } = useDocumentMetadata();
  const { checklist } = useChecklist();

  const performanceData = useMemo(() => {
    if (!selectedYear) return null;

    const yearDocuments = getDocumentsByYear(selectedYear);
    const yearChecklist = checklist.filter(item => item.tahun === selectedYear);

    // Get unique sub-direktorat from documents
    const subdirektoratSet = new Set<string>();
    yearDocuments.forEach(doc => {
      if (doc.subdirektorat) subdirektoratSet.add(doc.subdirektorat);
    });

    const subdirektoratStats = Array.from(subdirektoratSet).map(subdir => {
      const subdirDocs = yearDocuments.filter(doc => doc.subdirektorat === subdir);
      const subdirChecklist = yearChecklist.filter(item => 
        subdirDocs.some(doc => doc.checklistId === item.id)
      );
      const subdirUploaded = subdirChecklist.length;
      const subdirTotal = yearChecklist.filter(item => 
        item.subdirektorat === subdir
      ).length;
      
      return {
        name: subdir,
        documents: subdirDocs.length,
        uploaded: subdirUploaded,
        total: subdirTotal,
        progress: subdirTotal > 0 ? (subdirUploaded / subdirTotal) * 100 : 0,
        size: subdirDocs.reduce((sum, doc) => sum + (doc.fileSize || 0), 0)
      };
    }).sort((a, b) => b.progress - a.progress);

    return subdirektoratStats;
  }, [selectedYear, documents, checklist, getDocumentsByYear]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getPerformanceColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100';
    if (progress >= 60) return 'text-yellow-600 bg-yellow-100';
    if (progress >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceIcon = (progress: number) => {
    if (progress >= 80) return <Award className="w-4 h-4" />;
    if (progress >= 60) return <TrendingUp className="w-4 h-4" />;
    if (progress >= 40) return <Target className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  if (!performanceData) return null;

  const topPerformers = performanceData.slice(0, 5);
  const averageProgress = performanceData.reduce((sum, item) => sum + item.progress, 0) / performanceData.length;

  return (
    <Card className={`border-0 shadow-xl bg-white/80 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-600" />
          <span>Sub-Direktorat Performance</span>
        </CardTitle>
        <CardDescription>
          Ranking performa upload dokumen per sub-direktorat tahun {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Top Performers */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span>Top 5 Performers</span>
            </h4>
            <div className="space-y-4">
              {topPerformers.map((item, index) => (
                <div key={index} className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' :
                  index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200' :
                  index === 2 ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200' :
                  'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-500' :
                        index === 2 ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 truncate max-w-48">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.documents} dokumen • {formatFileSize(item.size)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{item.progress.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">{item.uploaded}/{item.total} tasks</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress 
                      value={item.progress} 
                      className="h-2 transition-all duration-1000 ease-out"
                      style={{ animationDelay: `${index * 200}ms` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{performanceData.length}</div>
              <div className="text-sm text-blue-600">Total Sub-Direktorat</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{averageProgress.toFixed(1)}%</div>
              <div className="text-sm text-green-600">Rata-rata Progress</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {performanceData.filter(item => item.progress >= 80).length}
              </div>
              <div className="text-sm text-purple-600">Excellent (80%+)</div>
            </div>
          </div>

          {/* Performance Distribution */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h4>
            <div className="space-y-3">
              {[
                { label: 'Excellent (80%+)', range: [80, 100], color: 'bg-green-500' },
                { label: 'Good (60-79%)', range: [60, 79], color: 'bg-yellow-500' },
                { label: 'Fair (40-59%)', range: [40, 59], color: 'bg-orange-500' },
                { label: 'Poor (<40%)', range: [0, 39], color: 'bg-red-500' }
              ].map((category, index) => {
                const count = performanceData.filter(item => 
                  item.progress >= category.range[0] && item.progress <= category.range[1]
                ).length;
                const percentage = (count / performanceData.length) * 100;
                
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{category.label}</span>
                        <span className="text-sm text-gray-600">{count} sub-direktorat</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                        style={{ 
                          '--progress-color': category.color === 'bg-green-500' ? '#10b981' :
                                            category.color === 'bg-yellow-500' ? '#f59e0b' :
                                            category.color === 'bg-orange-500' ? '#f97316' : '#ef4444'
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {performanceData.slice(0, 4).map((item, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-lg font-bold ${getPerformanceColor(item.progress)}`}>
                  {item.progress.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-600 truncate">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubDirektoratPerformance; 