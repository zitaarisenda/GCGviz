import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import { useChecklist } from '@/contexts/ChecklistContext';
import { useYear } from '@/contexts/YearContext';
import { Target, Eye, Shield, Heart, Users } from 'lucide-react';

interface SpiderChartProps {
  className?: string;
}

const SpiderChart: React.FC<SpiderChartProps> = ({ className }) => {
  const { selectedYear } = useYear();
  const { documents, getDocumentsByYear } = useDocumentMetadata();
  const { checklist } = useChecklist();

  const chartData = useMemo(() => {
    if (!selectedYear) return null;

    const yearDocuments = getDocumentsByYear(selectedYear);
    const yearChecklist = checklist.filter(item => item.tahun === selectedYear);

    const aspects = [
      { name: 'Transparansi', icon: <Eye className="w-4 h-4" />, color: 'text-blue-600' },
      { name: 'Akuntabilitas', icon: <Shield className="w-4 h-4" />, color: 'text-green-600' },
      { name: 'Responsibilitas', icon: <Heart className="w-4 h-4" />, color: 'text-purple-600' },
      { name: 'Independensi', icon: <Target className="w-4 h-4" />, color: 'text-orange-600' },
      { name: 'Kesetaraan', icon: <Users className="w-4 h-4" />, color: 'text-pink-600' }
    ];

    const data = aspects.map(aspect => {
      const aspectDocs = yearDocuments.filter(doc => doc.gcgPrinciple === aspect.name);
      const aspectChecklist = yearChecklist.filter(item => 
        item.aspek.includes(aspect.name) || item.deskripsi.includes(aspect.name)
      );
      const aspectUploaded = aspectChecklist.filter(item => 
        aspectDocs.some(doc => doc.checklistId === item.id)
      ).length;
      
      const progress = aspectChecklist.length > 0 ? (aspectUploaded / aspectChecklist.length) * 100 : 0;
      
      return {
        ...aspect,
        progress,
        documents: aspectDocs.length,
        checklist: aspectChecklist.length,
        uploaded: aspectUploaded
      };
    });

    return data;
  }, [selectedYear, documents, checklist, getDocumentsByYear]);

  if (!chartData) return null;

  const maxValue = Math.max(...chartData.map(d => d.progress));
  const radius = 120;
  const centerX = 150;
  const centerY = 150;

  const getPoint = (angle: number, value: number) => {
    const normalizedValue = value / 100;
    const x = centerX + Math.cos(angle) * radius * normalizedValue;
    const y = centerY + Math.sin(angle) * radius * normalizedValue;
    return { x, y };
  };

  const generatePolygonPoints = () => {
    const points = chartData.map((_, index) => {
      const angle = (index * 2 * Math.PI) / chartData.length - Math.PI / 2;
      const point = getPoint(angle, _.progress);
      return `${point.x},${point.y}`;
    });
    return points.join(' ');
  };

  const generateGridLines = () => {
    const lines = [];
    for (let i = 1; i <= 5; i++) {
      const scale = i / 5;
      const points = chartData.map((_, index) => {
        const angle = (index * 2 * Math.PI) / chartData.length - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius * scale;
        const y = centerY + Math.sin(angle) * radius * scale;
        return `${x},${y}`;
      });
      lines.push(points.join(' '));
    }
    return lines;
  };

  const generateAxisLines = () => {
    return chartData.map((_, index) => {
      const angle = (index * 2 * Math.PI) / chartData.length - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return { x, y, angle };
    });
  };

  return (
    <Card className={`border-0 shadow-xl bg-white/80 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-6 h-6 text-blue-600" />
          <span>Performance Radar - Aspek GCG</span>
        </CardTitle>
        <CardDescription>
          Visualisasi performa berdasarkan 5 aspek Good Corporate Governance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="300" height="300" viewBox="0 0 300 300" className="transform -rotate-90">
              {/* Grid Lines */}
              {generateGridLines().map((points, index) => (
                <polygon
                  key={`grid-${index}`}
                  points={points}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  opacity="0.5"
                />
              ))}

              {/* Axis Lines */}
              {generateAxisLines().map((axis, index) => (
                <line
                  key={`axis-${index}`}
                  x1={centerX}
                  y1={centerY}
                  x2={axis.x}
                  y2={axis.y}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
              ))}

              {/* Data Polygon */}
              <polygon
                points={generatePolygonPoints()}
                fill="rgba(59, 130, 246, 0.2)"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
                className="animate-pulse"
              />

              {/* Data Points */}
              {chartData.map((data, index) => {
                const angle = (index * 2 * Math.PI) / chartData.length - Math.PI / 2;
                const point = getPoint(angle, data.progress);
                return (
                  <circle
                    key={`point-${index}`}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="rgb(59, 130, 246)"
                    className="animate-bounce"
                    style={{ animationDelay: `${index * 100}ms` }}
                  />
                );
              })}

              {/* Center Point */}
              <circle
                cx={centerX}
                cy={centerY}
                r="3"
                fill="rgb(59, 130, 246)"
              />
            </svg>

            {/* Labels */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round(chartData.reduce((sum, d) => sum + d.progress, 0) / chartData.length)}%
                </div>
                <div className="text-sm text-gray-600">Rata-rata</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {chartData.map((data, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
              <div className={`${data.color}`}>
                {data.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{data.name}</p>
                <p className="text-xs text-gray-600">{data.progress.toFixed(1)}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Summary */}
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {chartData.reduce((sum, d) => sum + d.documents, 0)}
              </div>
              <div className="text-xs text-gray-600">Total Dokumen</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {chartData.reduce((sum, d) => sum + d.uploaded, 0)}
              </div>
              <div className="text-xs text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {chartData.reduce((sum, d) => sum + d.checklist, 0)}
              </div>
              <div className="text-xs text-gray-600">Total Tasks</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">
                {Math.round(chartData.reduce((sum, d) => sum + d.progress, 0) / chartData.length)}%
              </div>
              <div className="text-xs text-gray-600">Avg Progress</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpiderChart; 