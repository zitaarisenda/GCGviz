import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  CheckCircle, 
  FileText, 
  Calendar, 
  Edit,
  TrendingUp,
  Users,
  AlertCircle
} from 'lucide-react';

interface ChecklistItem {
  id: number;
  aspek: string;
  deskripsi: string;
  tahun?: number;
  status?: 'uploaded' | 'not_uploaded';
  file?: string;
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

interface OverviewTabProps {
  selectedYear: number;
  aspects: string[];
  groupedChecklist: { [key: string]: ChecklistItem[] };
  assignments: ChecklistAssignment[];
  onScrollToTab: (tabId: string) => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  selectedYear,
  aspects,
  groupedChecklist,
  assignments,
  onScrollToTab
}) => {
  const getProgressPercentage = (items: ChecklistItem[]) => {
    const uploaded = items.filter(item => item.status === 'uploaded').length;
    return Math.round((uploaded / items.length) * 100);
  };

  const getAspectIcon = (aspekName: string) => {
    const aspectIcons = {
      'ASPEK I. Komitmen': { icon: Target, color: 'text-red-500' },
      'ASPEK II. Implementasi': { icon: CheckCircle, color: 'text-green-500' },
      'ASPEK III. Pengawasan': { icon: FileText, color: 'text-blue-500' },
      'ASPEK IV. Pelaporan': { icon: Calendar, color: 'text-purple-500' },
      'ASPEK V. Evaluasi': { icon: TrendingUp, color: 'text-orange-500' }
    };
    
    return aspectIcons[aspekName] || { icon: Target, color: 'text-gray-500' };
  };

  return (
    <div className="space-y-6">
      {/* Assignment Overview */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-blue-900">Assignment Dokumen GCG - Tahun {selectedYear}</span>
        </div>
        <p className="text-blue-700 text-sm mt-1">
          Atur assignment dokumen GCG untuk setiap subdirektorat pada tahun {selectedYear}
        </p>
      </div>
      
      {/* Assignment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Assignment</p>
                <p className="text-2xl font-bold">{assignments.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Completed</p>
                <p className="text-2xl font-bold">{assignments.filter(a => a.status === 'completed').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">In Progress</p>
                <p className="text-2xl font-bold">{assignments.filter(a => a.status === 'in_progress').length}</p>
              </div>
              <FileText className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Assigned</p>
                <p className="text-2xl font-bold">{assignments.filter(a => a.status === 'assigned').length}</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignment by Aspect */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aspects.map((aspek) => {
          const items = groupedChecklist[aspek] || [];
          const aspectAssignments = assignments.filter(a => a.aspek === aspek);
          const completedAssignments = aspectAssignments.filter(a => a.status === 'completed').length;
          const progress = aspectAssignments.length > 0 ? (completedAssignments / aspectAssignments.length) * 100 : 0;
          
          return (
            <Card key={aspek} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>{aspek}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onScrollToTab('dokumen-tab')}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  {aspectAssignments.length} assignment dari {items.length} checklist
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress Assignment</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{completedAssignments} sudah upload</span>
                    <span>{aspectAssignments.length - completedAssignments} belum upload</span>
                  </div>
                  
                  {/* Subdirektorat List */}
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Subdirektorat yang Ditugaskan:</p>
                    <div className="space-y-1">
                      {aspectAssignments.slice(0, 3).map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between text-xs bg-gray-50 p-2 rounded">
                          <span className="truncate">{assignment.subdirektorat}</span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            assignment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            assignment.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </div>
                      ))}
                      {aspectAssignments.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{aspectAssignments.length - 3} subdirektorat lainnya
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {aspects.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada aspek dokumen GCG</h3>
          <p className="text-gray-500">
            Tidak ada aspek dokumen GCG yang tersedia untuk tahun {selectedYear}
          </p>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
