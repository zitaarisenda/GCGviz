import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useChecklist } from '@/contexts/ChecklistContext';
import { X, FileText, CheckCircle, Clock } from 'lucide-react';

interface ListGCGPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ListGCGPanel: React.FC<ListGCGPanelProps> = ({ isOpen, onClose }) => {
  const { checklist } = useChecklist();

  // Group checklist berdasarkan aspek
  const groupedChecklist = React.useMemo(() => {
    const grouped: { [key: string]: any[] } = {};
    checklist.forEach(item => {
      if (!grouped[item.aspek]) {
        grouped[item.aspek] = [];
      }
      grouped[item.aspek].push(item);
    });
    return grouped;
  }, [checklist]);

  // Get unique aspects
  const aspects = React.useMemo(() => {
    return [...new Set(checklist.map(item => item.aspek))];
  }, [checklist]);

  const getProgressPercentage = (items: any[]) => {
    // Untuk sementara, semua item dianggap belum uploaded
    const uploaded = 0;
    return Math.round((uploaded / items.length) * 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">List GCG</h2>
              <p className="text-gray-600">Daftar checklist Good Corporate Governance</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aspects.map((aspek) => {
              const items = groupedChecklist[aspek] || [];
              const progress = getProgressPercentage(items);
                             const uploadedCount = 0; // Untuk sementara, semua item dianggap belum uploaded
               const pendingCount = items.length;
              
              return (
                <Card key={aspek} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{aspek}</CardTitle>
                        <CardDescription className="mt-1">
                          {items.length} item checklist
                        </CardDescription>
                      </div>
                      <Badge variant={progress === 100 ? "default" : progress > 50 ? "secondary" : "destructive"}>
                        {progress}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            progress === 100 ? 'bg-green-500' : 
                            progress > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      {/* Stats */}
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>{uploadedCount} uploaded</span>
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-600">
                          <Clock className="w-4 h-4" />
                          <span>{pendingCount} pending</span>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          Lihat Detail
                        </Button>
                        <Button size="sm" className="flex-1">
                          Upload
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Ringkasan</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{aspects.length}</div>
                <div className="text-gray-600">Total Aspek</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{checklist.length}</div>
                <div className="text-gray-600">Total Item</div>
              </div>
                             <div className="text-center">
                 <div className="text-2xl font-bold text-yellow-600">0</div>
                 <div className="text-gray-600">Uploaded</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-red-600">{checklist.length}</div>
                 <div className="text-gray-600">Pending</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListGCGPanel; 