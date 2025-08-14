import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Upload, 
  Calendar, 
  Search, 
  FolderOpen,
  Eye,
  AlertCircle,
  Plus
} from 'lucide-react';

interface EmptyStatePanelProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  variant?: 'default' | 'upload' | 'search' | 'calendar' | 'folder';
  className?: string;
}

const EmptyStatePanel: React.FC<EmptyStatePanelProps> = ({
  title,
  description,
  icon,
  action,
  variant = 'default',
  className = ""
}) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'upload':
        return <Upload className="w-16 h-16 text-blue-400" />;
      case 'search':
        return <Search className="w-16 h-16 text-gray-400" />;
      case 'calendar':
        return <Calendar className="w-16 h-16 text-blue-400" />;
      case 'folder':
        return <FolderOpen className="w-16 h-16 text-blue-400" />;
      default:
        return <FileText className="w-16 h-16 text-gray-400" />;
    }
  };

  const getDefaultActionIcon = () => {
    switch (variant) {
      case 'upload':
        return <Upload className="w-4 h-4" />;
      case 'search':
        return <Search className="w-4 h-4" />;
      case 'calendar':
        return <Calendar className="w-4 h-4" />;
      case 'folder':
        return <FolderOpen className="w-4 h-4" />;
      default:
        return <Plus className="w-4 h-4" />;
    }
  };

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Card className="border-0 shadow-lg bg-white">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            {icon || getDefaultIcon()}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md">
            {description}
          </p>
          {action && (
            <Button
              onClick={action.onClick}
              className="flex items-center gap-2"
            >
              {action.icon || getDefaultActionIcon()}
              {action.label}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyStatePanel; 