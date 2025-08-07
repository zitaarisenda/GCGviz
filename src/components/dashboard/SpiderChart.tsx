import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDocumentMetadata } from '@/contexts/DocumentMetadataContext';
import { useChecklist } from '@/contexts/ChecklistContext';
import { useYear } from '@/contexts/YearContext';
import { Target, Eye, Shield, Heart, Users, Building2 } from 'lucide-react';

interface SpiderChartProps {
  className?: string;
}

interface ChecklistAssignment {
  id: number;
  checklistId: number;
  subdirektorat: string;
  aspek: string;
  deskripsi: string;
  tahun: number;
  assignedBy: string;
  assignedAt: Date;
  status: 'assigned' | 'in_progress' | 'completed';
  notes?: string;
}

// Data subdirektorat yang dioptimasi
const SUBDIREKTORAT_OPTIONS = [
  { value: "Sub Direktorat Government and Corporate Business", label: "Government & Corporate Business" },
  { value: "Sub Direktorat Consumer Business", label: "Consumer Business" },
  { value: "Sub Direktorat Enterprise Business", label: "Enterprise Business" },
  { value: "Sub Direktorat Retail Business", label: "Retail Business" },
  { value: "Sub Direktorat Wholesale and International Business", label: "Wholesale & International Business" },
  { value: "Sub Direktorat Courier and Logistic Operation", label: "Courier & Logistic Operation" },
  { value: "Sub Direktorat International Post Services", label: "International Post Services" },
  { value: "Sub Direktorat Digital Services", label: "Digital Services" },
  { value: "Sub Direktorat Frontino Management and Financial Transaction Services", label: "Frontino Management & Financial Transaction" },
  { value: "Sub Direktorat Financial Operation and Business Partner", label: "Financial Operation & Business Partner" },
  { value: "Sub Direktorat Financial Policy and Asset Management", label: "Financial Policy & Asset Management" },
  { value: "Sub Direktorat Risk Management", label: "Risk Management" },
  { value: "Sub Direktorat Human Capital Policy and Strategy", label: "Human Capital Policy & Strategy" },
  { value: "Sub Direktorat Human Capital Service and Business Partner", label: "Human Capital Service & Business Partner" },
  { value: "Sub Direktorat Strategic Planning and Business Development", label: "Strategic Planning & Business Development" },
  { value: "Sub Direktorat Portfolio Management", label: "Portfolio Management" }
];

const SpiderChart: React.FC<SpiderChartProps> = ({ className }) => {
  const { selectedYear } = useYear();
  const { documents, getDocumentsByYear } = useDocumentMetadata();
  const { checklist } = useChecklist();
  const [selectedSubDirektorat, setSelectedSubDirektorat] = useState<string | null>(null);
  const [currentSubDirektoratIndex, setCurrentSubDirektoratIndex] = useState(0);
  const [isAutoRotateEnabled, setIsAutoRotateEnabled] = useState(true);

  // Get actual assignment data from localStorage
  const getAssignmentData = () => {
    try {
      const assignments = localStorage.getItem('checklistAssignments');
      if (!assignments) return [];
      return JSON.parse(assignments) as ChecklistAssignment[];
    } catch (error) {
      console.error('Error getting assignment data:', error);
      return [];
    }
  };

  // Auto-rotate through sub-direktorat
  useEffect(() => {
    if (!isAutoRotateEnabled) return;

    const interval = setInterval(() => {
      setCurrentSubDirektoratIndex((prev) => {
        const nextIndex = (prev + 1) % SUBDIREKTORAT_OPTIONS.length;
        setSelectedSubDirektorat(SUBDIREKTORAT_OPTIONS[nextIndex].value);
        return nextIndex;
      });
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [isAutoRotateEnabled]);

  const chartData = useMemo(() => {
    if (!selectedYear) return null;

    const yearDocuments = getDocumentsByYear(selectedYear);
    const yearChecklist = checklist.filter(item => item.tahun === selectedYear);
    const assignments = getAssignmentData();
    const yearAssignments = assignments.filter(assignment => assignment.tahun === selectedYear);

    // 6 Aspek Utama GCG
    const aspects = [
      { name: 'ASPEK I. Komitmen', icon: <Target className="w-4 h-4" />, color: 'text-blue-600' },
      { name: 'ASPEK II. RUPS', icon: <Eye className="w-4 h-4" />, color: 'text-green-600' },
      { name: 'ASPEK III. Dewan Komisaris', icon: <Shield className="w-4 h-4" />, color: 'text-purple-600' },
      { name: 'ASPEK IV. Direksi', icon: <Heart className="w-4 h-4" />, color: 'text-orange-600' },
      { name: 'ASPEK V. Pengungkapan', icon: <Users className="w-4 h-4" />, color: 'text-pink-600' },
      { name: 'ASPEK VI. Tata Kelola', icon: <Building2 className="w-4 h-4" />, color: 'text-indigo-600' }
    ];

    const data = aspects.map(aspect => {
      // Get all assignments for this aspect
      const aspectAssignments = yearAssignments.filter(assignment => 
        assignment.aspek === aspect.name
      );

      // Filter by selected sub-direktorat if any
      let filteredAssignments = aspectAssignments;
      if (selectedSubDirektorat) {
        filteredAssignments = aspectAssignments.filter(assignment => 
          assignment.subdirektorat === selectedSubDirektorat
        );
      }

      // Get documents for these assignments
      const assignmentIds = filteredAssignments.map(a => a.checklistId);
      const aspectDocs = yearDocuments.filter(doc => 
        assignmentIds.includes(doc.checklistId)
      );

      // Calculate statistics
      const totalAssigned = filteredAssignments.length;
      const completedCount = aspectDocs.length;
      const progress = totalAssigned > 0 ? (completedCount / totalAssigned) * 100 : 0;

      // Get unique sub-direktorats assigned to this aspect
      const assignedSubDirektorats = [...new Set(filteredAssignments.map(a => a.subdirektorat))];

      return {
        ...aspect,
        progress,
        documents: aspectDocs.length,
        checklist: totalAssigned,
        uploaded: completedCount,
        assignedSubDirektorats,
        totalAssignments: aspectAssignments.length
      };
    });

    return data;
  }, [selectedYear, documents, checklist, getDocumentsByYear, selectedSubDirektorat]);

  if (!chartData) return null;

  const maxValue = Math.max(...chartData.map(d => d.progress));
  const radius = 120;
  const centerX = 150;
  const centerY = 150;
  const labelRadius = radius + 25; // Radius untuk label (sedikit lebih dekat)

  const getPoint = (angle: number, value: number) => {
    const normalizedValue = value / 100;
    const x = centerX + Math.cos(angle) * radius * normalizedValue;
    const y = centerY + Math.sin(angle) * radius * normalizedValue;
    return { x, y };
  };

  const getLabelPosition = (angle: number) => {
    const x = centerX + Math.cos(angle) * labelRadius;
    const y = centerY + Math.sin(angle) * labelRadius;
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

  const handleSubDirektoratClick = (subDirektorat: string) => {
    setSelectedSubDirektorat(subDirektorat);
    const index = SUBDIREKTORAT_OPTIONS.findIndex(s => s.value === subDirektorat);
    if (index !== -1) {
      setCurrentSubDirektoratIndex(index);
    }
    // Disable auto-rotate when user clicks manually
    setIsAutoRotateEnabled(false);
  };

  const handleAutoRotateToggle = () => {
    setIsAutoRotateEnabled(!isAutoRotateEnabled);
  };

  // Get assignment statistics for the selected sub-direktorat
  const getAssignmentStats = () => {
    if (!selectedSubDirektorat) return null;
    
    const assignments = getAssignmentData();
    const yearAssignments = assignments.filter(assignment => 
      assignment.tahun === selectedYear && 
      assignment.subdirektorat === selectedSubDirektorat
    );

    const totalAssigned = yearAssignments.length;
    const completedCount = yearAssignments.filter(assignment => {
      const yearDocuments = getDocumentsByYear(selectedYear);
      return yearDocuments.some(doc => doc.checklistId === assignment.checklistId);
    }).length;

    return {
      totalAssigned,
      completedCount,
      progress: totalAssigned > 0 ? (completedCount / totalAssigned) * 100 : 0
    };
  };

  const assignmentStats = getAssignmentStats();

  return (
    <Card className={`border-0 shadow-xl bg-white/80 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="w-6 h-6 text-blue-600" />
          <span>Performance Radar - Penyebaran Penugasan</span>
        </CardTitle>
        <CardDescription>
          Visualisasi penyebaran penugasan Super Admin ke Admin per aspek dan sub-direktorat
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Assignment Summary: Show active subdirektorat name as placeholder */}
        <div className="mb-4 flex items-center justify-center">
          <div className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-sm shadow-sm">
            {selectedSubDirektorat
              ? SUBDIREKTORAT_OPTIONS.find(s => s.value === selectedSubDirektorat)?.label || selectedSubDirektorat
              : 'Tidak ada sub-direktorat aktif'}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="flex items-center justify-center mb-6">
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



            {/* Aspect Labels at Corners */}
            {chartData.map((data, index) => {
              const angle = (index * 2 * Math.PI) / chartData.length - Math.PI / 2;
              const labelPos = getLabelPosition(angle);
              const isTop = labelPos.y < centerY;
              const isLeft = labelPos.x < centerX;
              
              return (
                <div
                  key={`label-${index}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: labelPos.x,
                    top: labelPos.y,
                    transform: `translate(-50%, ${isTop ? '-100%' : '0%'})`
                  }}
                >
                  <div className={`
                    text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white border shadow-sm
                    ${data.color}
                  `}>
                    {data.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Sub-Direktorat */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Sub-Direktorat Aktif:</h4>
            <Badge 
              variant="secondary" 
              className={`cursor-pointer transition-all duration-200 ${
                isAutoRotateEnabled 
                  ? 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
              }`}
              onClick={handleAutoRotateToggle}
            >
              {isAutoRotateEnabled ? 'Auto-Rotate' : 'Manual'}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {SUBDIREKTORAT_OPTIONS.map((subDirektorat, index) => (
              <div
                key={subDirektorat.value}
                className={`
                  p-2 rounded-lg border cursor-pointer transition-all duration-200 text-xs
                  ${selectedSubDirektorat === subDirektorat.value
                    ? 'bg-blue-100 border-blue-300 text-blue-700 shadow-md'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }
                  ${index === currentSubDirektoratIndex && isAutoRotateEnabled ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                `}
                onClick={() => handleSubDirektoratClick(subDirektorat.value)}
              >
                <div className="flex items-center space-x-1">
                  <Building2 className="w-3 h-3" />
                  <span className="truncate">{subDirektorat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpiderChart; 