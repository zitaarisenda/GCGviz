import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AnalysisCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  percentage: number;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
  percentage
}) => {

  return (
    <Card className="rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: color + '20' }}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: color }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">{title}</span>
            </div>
            
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{value}</h3>
            </div>
            
            <div className="pt-2">
              <div className="border-t border-gray-200 w-16 mb-2"></div>
              <span className="text-sm text-gray-500">{subtitle}</span>
            </div>
          </div>
          
          {/* Progress Circle */}
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="transition-all duration-500 ease-in-out"
                stroke={color}
                strokeWidth="3"
                strokeDasharray={`${percentage}, 100`}
                fill="none"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">{percentage}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisCard; 