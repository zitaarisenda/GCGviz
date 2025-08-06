import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';

interface DocumentFilterPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPrinciple: string;
  onPrincipleChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedDirektorat: string;
  onDirektoratChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  filterChecklistStatus: string;
  onChecklistStatusChange: (value: string) => void;
  filterChecklistAspect: string;
  onChecklistAspectChange: (value: string) => void;
  principles: string[];
  types: string[];
  direktorats: string[];
  aspects: string[];
  className?: string;
}

const DocumentFilterPanel: React.FC<DocumentFilterPanelProps> = ({
  searchTerm,
  onSearchChange,
  selectedPrinciple,
  onPrincipleChange,
  selectedType,
  onTypeChange,
  selectedDirektorat,
  onDirektoratChange,
  selectedStatus,
  onStatusChange,
  filterChecklistStatus,
  onChecklistStatusChange,
  filterChecklistAspect,
  onChecklistAspectChange,
  principles,
  types,
  direktorats,
  aspects,
  className = ""
}) => {
  return (
    <Card className={`mb-6 shadow-md border-0 bg-gray-50/80 backdrop-blur-sm ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <CardTitle className="text-base font-medium text-gray-900">Filter & Pencarian</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Search */}
        <div className="mb-4">
          <Input
            placeholder="Cari berdasarkan judul, deskripsi, nomor dokumen..."
            className="w-full"
            value={searchTerm}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Filter Prinsip GCG */}
          <div>
            <Select value={selectedPrinciple} onValueChange={onPrincipleChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Prinsip GCG" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prinsip</SelectItem>
                {principles.filter(Boolean).map(principle => (
                  <SelectItem key={principle} value={principle}>{principle}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Filter Jenis Dokumen */}
          <div>
            <Select value={selectedType} onValueChange={onTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Jenis Dokumen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                {types.filter(Boolean).map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Filter Direktorat */}
          <div>
            <Select value={selectedDirektorat} onValueChange={onDirektoratChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Direktorat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Direktorat</SelectItem>
                {direktorats.filter(Boolean).map(direktorat => (
                  <SelectItem key={direktorat} value={direktorat}>{direktorat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Filter Status */}
          <div>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Filter Checklist GCG */}
          <div>
            <Select value={filterChecklistStatus} onValueChange={onChecklistStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Checklist GCG" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="with">Sudah Dipilih</SelectItem>
                <SelectItem value="without">Belum Dipilih</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Filter Aspek Checklist */}
          <div>
            <Select value={filterChecklistAspect} onValueChange={onChecklistAspectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aspek Checklist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Aspek</SelectItem>
                {aspects.filter(Boolean).map(aspek => (
                  <SelectItem key={aspek} value={aspek}>{aspek}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentFilterPanel; 