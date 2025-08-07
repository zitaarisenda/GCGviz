import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import { useYear } from '@/contexts/YearContext';
import { useChecklist } from '@/contexts/ChecklistContext';
import { TrendingUp } from 'lucide-react';

interface MonthlyTrendsProps {
  className?: string;
}

const MonthlyTrends: React.FC<MonthlyTrendsProps> = ({ className }) => {
  const { selectedYear } = useYear();
  const { documents, getDocumentsByYear } = useDocumentMetadata();
  const { getChecklistByYear } = useChecklist();

  // Total checklist tahun aktif
  const totalChecklist = useMemo(() => {
    if (!selectedYear) return 0;
    return getChecklistByYear(selectedYear).length;
  }, [selectedYear, getChecklistByYear]);

  // Data persentase progress per bulan
  const chartData = useMemo(() => {
    if (!selectedYear || totalChecklist === 0) return Array.from({ length: 12 }, (_, i) => ({ month: new Date(selectedYear, i).toLocaleDateString('id-ID', { month: 'short' }), percent: 0, documents: 0 }));
    const yearDocuments = getDocumentsByYear(selectedYear);
    return Array.from({ length: 12 }, (_, i) => {
      const monthDocs = yearDocuments.filter(doc => {
        const uploadDate = new Date(doc.uploadDate);
        return uploadDate.getMonth() === i;
      });
      const percent = (monthDocs.length / totalChecklist) * 100;
      return {
        month: new Date(selectedYear, i).toLocaleDateString('id-ID', { month: 'short' }),
        monthIndex: i,
        percent: percent > 100 ? 100 : percent,
        documents: monthDocs.length
      };
    });
  }, [selectedYear, documents, getDocumentsByYear, totalChecklist]);

  if (!chartData) return null;

  return (
    <Card className={`border-0 shadow-xl bg-white/80 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <span>Progres Pengerjaan</span>
        </CardTitle>
        <CardDescription>
          Progress pengerjaan dokumen GCG sepanjang tahun {selectedYear}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Line Chart Persentase */}
          <div className="relative">
            <svg width="100%" height="200" viewBox="0 0 800 200" className="w-full">
              {/* Grid Lines dan label Y (0% - 100%) */}
              {Array.from({ length: 11 }, (_, i) => {
                const percent = i * 10;
                const y = 160 - (percent / 100) * 120;
                return (
                  <g key={`grid-y-${i}`}>
                    <line
                      x1="50"
                      y1={y}
                      x2="750"
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    <text
                      x="40"
                      y={y + 4}
                      textAnchor="end"
                      className="text-xs fill-gray-500"
                    >
                      {percent}%
                    </text>
                  </g>
                );
              })}

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

              {/* Line Chart Persentase */}
              <path
                d={chartData.map((data, index) => {
                  const x = 50 + (index * 60);
                  const y = 160 - (data.percent / 100) * 120;
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
                const y = 160 - (data.percent / 100) * 120;
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
                  const y = 160 - (data.percent / 100) * 120;
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
                    <div className="text-lg font-bold text-gray-900">{data.percent.toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">{data.month}</div>
                    <div className="text-xs text-blue-600">{data.documents} dokumen</div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${data.percent}%`,
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
                <div className="text-sm text-gray-600">Bulan Persentase Tertinggi</div>
                <div className="text-xl font-bold text-blue-600">
                  {chartData.reduce((max, current) =>
                    current.percent > max.percent ? current : max
                  ).month}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.max(...chartData.map(d => d.percent)).toFixed(1)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Bulan Persentase Terendah</div>
                <div className="text-xl font-bold text-red-600">
                  {chartData.reduce((min, current) =>
                    current.percent < min.percent ? current : min
                  ).month}
                </div>
                <div className="text-sm text-gray-600">
                  {Math.min(...chartData.map(d => d.percent)).toFixed(1)}%
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