import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import { useYear } from '@/contexts/YearContext';
import { TrendingUp, Calendar, BarChart3 } from 'lucide-react';

interface MonthlyTrendsProps {
  className?: string;
}

const MonthlyTrends: React.FC<MonthlyTrendsProps> = ({ className }) => {
  const { selectedYear } = useYear();
  const { documents, getDocumentsByYear } = useDocumentMetadata();

  const chartData = useMemo(() => {
    if (!selectedYear) return null;

    const yearDocuments = getDocumentsByYear(selectedYear);
    
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const monthDocs = yearDocuments.filter(doc => {
        const uploadDate = new Date(doc.uploadDate);
        return uploadDate.getMonth() === i;
      });
      
      return {
        month: new Date(selectedYear, i).toLocaleDateString('id-ID', { month: 'short' }),
        monthIndex: i,
        documents: monthDocs.length,
        size: monthDocs.reduce((sum, doc) => sum + (doc.fileSize || 0), 0),
        averageSize: monthDocs.length > 0 ? monthDocs.reduce((sum, doc) => sum + (doc.fileSize || 0), 0) / monthDocs.length : 0
      };
    });

    return monthlyData;
  }, [selectedYear, documents, getDocumentsByYear]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!chartData) return null;

  const maxDocuments = Math.max(...chartData.map(d => d.documents));
  const maxSize = Math.max(...chartData.map(d => d.size));
  const totalDocuments = chartData.reduce((sum, d) => sum + d.documents, 0);
  const totalSize = chartData.reduce((sum, d) => sum + d.size, 0);

  // Calculate trend
  const firstHalf = chartData.slice(0, 6).reduce((sum, d) => sum + d.documents, 0);
  const secondHalf = chartData.slice(6, 12).reduce((sum, d) => sum + d.documents, 0);
  const trend = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;

  return (
    <Card className={`border-0 shadow-xl bg-white/80 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <span>Tren Upload Bulanan</span>
        </CardTitle>
        <CardDescription>
          Distribusi upload dokumen sepanjang tahun {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalDocuments}</div>
              <div className="text-xs text-blue-600">Total Dokumen</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatFileSize(totalSize)}</div>
              <div className="text-xs text-green-600">Total Ukuran</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(totalDocuments / 12)}
              </div>
              <div className="text-xs text-purple-600">Rata-rata/Bulan</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
              <div className={`text-2xl font-bold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">Trend</div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="relative">
            <svg width="100%" height="200" viewBox="0 0 800 200" className="w-full">
              {/* Grid Lines */}
              {Array.from({ length: 6 }, (_, i) => (
                <line
                  key={`grid-y-${i}`}
                  x1="50"
                  y1={40 + (i * 30)}
                  x2="750"
                  y2={40 + (i * 30)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  opacity="0.5"
                />
              ))}

              {/* X-axis labels */}
              {chartData.map((data, index) => (
                <text
                  key={`label-${index}`}
                  x={50 + (index * 60)}
                  y="190"
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {data.month}
                </text>
              ))}

              {/* Line Chart */}
              <path
                d={chartData.map((data, index) => {
                  const x = 50 + (index * 60);
                  const y = 160 - (data.documents / maxDocuments) * 120;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="3"
                className="animate-draw"
              />

              {/* Data Points */}
              {chartData.map((data, index) => {
                const x = 50 + (index * 60);
                const y = 160 - (data.documents / maxDocuments) * 120;
                return (
                  <circle
                    key={`point-${index}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="rgb(59, 130, 246)"
                    className="animate-bounce"
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                );
              })}

              {/* Area under line */}
              <path
                d={`M 50 160 ${chartData.map((data, index) => {
                  const x = 50 + (index * 60);
                  const y = 160 - (data.documents / maxDocuments) * 120;
                  return `L ${x} ${y}`;
                }).join(' ')} L ${50 + (chartData.length - 1) * 60} 160 Z`}
                fill="rgba(59, 130, 246, 0.1)"
              />
            </svg>
          </div>

          {/* Monthly Breakdown */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-gray-900">Breakdown Bulanan</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {chartData.map((data, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{data.documents}</div>
                    <div className="text-xs text-gray-600">{data.month}</div>
                    <div className="text-xs text-blue-600">{formatFileSize(data.size)}</div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${(data.documents / maxDocuments) * 100}%`,
                          animationDelay: `${index * 100}ms`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Peak Performance */}
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Peak Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Bulan Terbaik</div>
                <div className="text-xl font-bold text-blue-600">
                  {chartData.reduce((max, current) => 
                    current.documents > max.documents ? current : max
                  ).month}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.max(...chartData.map(d => d.documents))} dokumen
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Bulan Terendah</div>
                <div className="text-xl font-bold text-red-600">
                  {chartData.reduce((min, current) => 
                    current.documents < min.documents ? current : min
                  ).month}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.min(...chartData.map(d => d.documents))} dokumen
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrends; 