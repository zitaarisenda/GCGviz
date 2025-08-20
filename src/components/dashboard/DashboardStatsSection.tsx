import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Building2,
  FolderOpen
} from 'lucide-react';

interface DashboardStatsSectionProps {
  stats: {
    totalDocuments: number;
    completedDocuments: number;
    pendingDocuments: number;
    overdueDocuments: number;
    totalUsers: number;
    totalDirektorat: number;
    totalAspects: number;
    currentYear: number;
  };
  showAdminStats?: boolean;
}

const DashboardStatsSection: React.FC<DashboardStatsSectionProps> = ({
  stats,
  showAdminStats = false
}) => {
  const getCompletionPercentage = () => {
    if (stats.totalDocuments === 0) return 0;
    return Math.round((stats.completedDocuments / stats.totalDocuments) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Dokumen */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-blue-900">
            <span className="text-sm font-medium">Total Dokumen</span>
            <FileText className="w-5 h-5 text-blue-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900 mb-2">
            {stats.totalDocuments.toLocaleString()}
          </div>
          <div className="text-sm text-blue-700">
            Tahun {stats.currentYear}
          </div>
        </CardContent>
      </Card>

      {/* Dokumen Selesai */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-green-900">
            <span className="text-sm font-medium">Dokumen Selesai</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900 mb-2">
            {stats.completedDocuments.toLocaleString()}
          </div>
          <div className="text-sm text-green-700">
            {getCompletionPercentage()}% dari total
          </div>
        </CardContent>
      </Card>

      {/* Dokumen Pending */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-yellow-900">
            <span className="text-sm font-medium">Dokumen Pending</span>
            <Clock className="w-5 h-5 text-yellow-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-900 mb-2">
            {stats.pendingDocuments.toLocaleString()}
          </div>
          <div className="text-sm text-yellow-700">
            Menunggu upload
          </div>
        </CardContent>
      </Card>

      {/* Dokumen Overdue */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-red-900">
            <span className="text-sm font-medium">Dokumen Overdue</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-900 mb-2">
            {stats.overdueDocuments.toLocaleString()}
          </div>
          <div className="text-sm text-red-700">
            Melewati deadline
          </div>
        </CardContent>
      </Card>

      {/* Admin Stats - Additional Cards */}
      {showAdminStats && (
        <>
          {/* Total Users */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-purple-900">
                <span className="text-sm font-medium">Total Users</span>
                <Users className="w-5 h-5 text-purple-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 mb-2">
                {stats.totalUsers.toLocaleString()}
              </div>
              <div className="text-sm text-purple-700">
                Admin & User aktif
              </div>
            </CardContent>
          </Card>

          {/* Total Direktorat */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-indigo-900">
                <span className="text-sm font-medium">Total Direktorat</span>
                <Building2 className="w-5 h-5 text-indigo-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-900 mb-2">
                {stats.totalDirektorat.toLocaleString()}
              </div>
              <div className="text-sm text-indigo-700">
                Unit organisasi
              </div>
            </CardContent>
          </Card>

          {/* Total Aspek */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-emerald-900">
                <span className="text-sm font-medium">Total Aspek</span>
                <FolderOpen className="w-5 h-5 text-emerald-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 mb-2">
                {stats.totalAspects.toLocaleString()}
              </div>
              <div className="text-sm text-emerald-700">
                Aspek GCG
              </div>
            </CardContent>
          </Card>

          {/* Progress Trend */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-orange-900">
                <span className="text-sm font-medium">Progress Trend</span>
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 mb-2">
                {getCompletionPercentage()}%
              </div>
              <div className="text-sm text-orange-700">
                Rata-rata penyelesaian
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default DashboardStatsSection;
