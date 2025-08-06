import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  BarChart3,
  TrendingUp,
  Eye
} from 'lucide-react';

interface StatItem {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  progress?: number;
  trend?: 'up' | 'down' | 'neutral';
}

interface StatsPanelProps {
  title?: string;
  description?: string;
  stats: StatItem[];
  layout?: 'grid' | 'list';
  showProgress?: boolean;
  className?: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  title,
  description,
  stats,
  layout = 'grid',
  showProgress = false,
  className = ""
}) => {
  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return null;
    }
  };

  const getDefaultIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('dokumen') || lowerTitle.includes('file')) return <FileText className="w-6 h-6" />;
    if (lowerTitle.includes('upload')) return <Upload className="w-6 h-6" />;
    if (lowerTitle.includes('selesai') || lowerTitle.includes('complete')) return <CheckCircle className="w-6 h-6" />;
    if (lowerTitle.includes('pending') || lowerTitle.includes('menunggu')) return <Clock className="w-6 h-6" />;
    if (lowerTitle.includes('statistik') || lowerTitle.includes('stats')) return <BarChart3 className="w-6 h-6" />;
    return <Eye className="w-6 h-6" />;
  };

  if (layout === 'list') {
    return (
      <div className={`mb-6 ${className}`}>
        {title && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        )}
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600">
                      {stat.icon || getDefaultIcon(stat.title)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                      {stat.subtitle && <p className="text-xs text-gray-500">{stat.subtitle}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                    {getTrendIcon(stat.trend)}
                  </div>
                </div>
                {showProgress && stat.progress !== undefined && (
                  <div className="mt-3">
                    <Progress value={stat.progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{stat.progress}%</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-600">
                  {stat.icon || getDefaultIcon(stat.title)}
                </div>
                {getTrendIcon(stat.trend)}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                {stat.subtitle && <p className="text-xs text-gray-500">{stat.subtitle}</p>}
              </div>
              {showProgress && stat.progress !== undefined && (
                <div className="mt-3">
                  <Progress value={stat.progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">{stat.progress}%</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatsPanel; 