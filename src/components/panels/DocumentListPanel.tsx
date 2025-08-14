import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Filter, Calendar } from 'lucide-react';

interface DocumentListPanelProps {
  title?: string;
  subtitle?: string;
  documentCount?: number;
  year?: number;
  showFilters?: boolean;
  onFilterChange?: () => void;
  children: React.ReactNode;
  className?: string;
}

const DocumentListPanel: React.FC<DocumentListPanelProps> = ({
  title = "Daftar Dokumen",
  subtitle,
  documentCount = 0,
  year,
  showFilters = true,
  onFilterChange,
  children,
  className = ""
}) => {
  return (
    <Card className={`shadow-md border-0 bg-white/80 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {subtitle || `${documentCount} dokumen ditemukan${year ? ` untuk tahun ${year}` : ''}`}
              </CardDescription>
            </div>
          </div>
          {showFilters && onFilterChange && (
            <button
              onClick={onFilterChange}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default DocumentListPanel; 