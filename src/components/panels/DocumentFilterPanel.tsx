import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  RotateCcw,
  TrendingUp,
  CheckCircle,
  Clock,
  Building2,
  FileText,
  User,
  X,
  Users
} from 'lucide-react';

interface DocumentFilterPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedPrinciple: string;
  onPrincipleChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedDirektorat: string;
  onDirektoratChange: (value: string) => void;
  selectedSubDirektorat: string;
  onSubDirektoratChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  filterChecklistStatus: 'all' | 'with' | 'without';
  onChecklistStatusChange: (value: 'all' | 'with' | 'without') => void;
  filterChecklistAspect: string;
  onChecklistAspectChange: (value: string) => void;
  principles: string[];
  types: string[];
  direktorats: string[];
  subDirektorats: string[];
  aspects: string[];
  onResetFilters: () => void;
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
  selectedSubDirektorat,
  onSubDirektoratChange,
  selectedStatus,
  onStatusChange,
  filterChecklistStatus,
  onChecklistStatusChange,
  filterChecklistAspect,
  onChecklistAspectChange,
  principles,
  types,
  direktorats,
  subDirektorats,
  aspects,
  onResetFilters
}) => {
  // Check if any filter is active
  const isAnyFilterActive = 
    searchTerm !== '' ||
    selectedPrinciple !== 'all' ||
    selectedType !== 'all' ||
    selectedDirektorat !== 'all' ||
    selectedSubDirektorat !== 'all' ||
    selectedStatus !== 'all' ||
    filterChecklistStatus !== 'all' ||
    filterChecklistAspect !== 'all';

  return (
    <div className="space-y-4">
      {/* Compact Search Bar */}
      <div>
        <label className="text-xs font-semibold text-gray-700 mb-2 block flex items-center">
          <Search className="w-3 h-3 mr-1 text-blue-600" />
          Pencarian Dokumen
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Cari berdasarkan judul, deskripsi, nomor dokumen..."
            className="pl-9 pr-9 h-9 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 px-2 text-gray-400 hover:text-gray-600 hover:bg-transparent h-9"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Compact Filter Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {/* Prinsip GCG Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700 flex items-center">
            <Filter className="w-3 h-3 mr-1 text-orange-600" />
            Prinsip GCG
          </label>
          <Select value={selectedPrinciple} onValueChange={onPrincipleChange}>
            <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-xs">
              <SelectValue placeholder="Pilih Prinsip" />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              <SelectItem value="all" className="font-medium text-gray-900 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Semua Prinsip</span>
                </div>
              </SelectItem>
              {principles.filter(Boolean).map(principle => (
                <SelectItem key={principle} value={principle} className="text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span>{principle}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Jenis Dokumen Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700 flex items-center">
            <FileText className="w-3 h-3 mr-1 text-green-600" />
            Jenis Dokumen
          </label>
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-xs">
              <SelectValue placeholder="Pilih Jenis" />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              <SelectItem value="all" className="font-medium text-gray-900 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Semua Jenis</span>
                </div>
              </SelectItem>
              {types.filter(Boolean).map(type => (
                <SelectItem key={type} value={type} className="text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>{type}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Direktorat Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700 flex items-center">
            <Building2 className="w-3 h-3 mr-1 text-purple-600" />
            Direktorat
          </label>
          <Select value={selectedDirektorat} onValueChange={onDirektoratChange}>
            <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-xs">
              <SelectValue placeholder="Pilih Direktorat" />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              <SelectItem value="all" className="font-medium text-gray-900 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Semua Direktorat</span>
                </div>
              </SelectItem>
              {direktorats.filter(Boolean).map(direktorat => (
                <SelectItem key={direktorat} value={direktorat} className="text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>{direktorat}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sub Direktorat Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700 flex items-center">
            <Users className="w-3 h-3 mr-1 text-pink-600" />
            Sub Direktorat
          </label>
          <Select value={selectedSubDirektorat} onValueChange={onSubDirektoratChange}>
            <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all duration-200 text-xs">
              <SelectValue placeholder="Pilih Sub Direktorat" />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              <SelectItem value="all" className="font-medium text-gray-900 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Semua Sub Direktorat</span>
                </div>
              </SelectItem>
              {subDirektorats.filter(Boolean).map(subDirektorat => (
                <SelectItem key={subDirektorat} value={subDirektorat} className="text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                    <span>{subDirektorat}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1 text-indigo-600" />
            Status
          </label>
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-xs">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-medium text-gray-900 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Semua Status</span>
                </div>
              </SelectItem>
              <SelectItem value="draft" className="text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <Clock className="w-2.5 h-2.5 text-yellow-600" />
                  <span>Draft</span>
                </div>
              </SelectItem>
              <SelectItem value="review" className="text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <FileText className="w-2.5 h-2.5 text-blue-600" />
                  <span>Review</span>
                </div>
              </SelectItem>
              <SelectItem value="approved" className="text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <CheckCircle className="w-2.5 h-2.5 text-green-600" />
                  <span>Disetujui</span>
                </div>
              </SelectItem>
              <SelectItem value="rejected" className="text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                  <Clock className="w-2.5 h-2.5 text-red-600" />
                  <span>Ditolak</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Checklist Status Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700 flex items-center">
            <User className="w-3 h-3 mr-1 text-teal-600" />
            Checklist GCG
          </label>
          <Select value={filterChecklistStatus} onValueChange={onChecklistStatusChange}>
            <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-xs">
              <SelectValue placeholder="Pilih Status Checklist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="font-medium text-gray-900 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Semua</span>
                </div>
              </SelectItem>
              <SelectItem value="with" className="text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <CheckCircle className="w-2.5 h-2.5 text-green-600" />
                  <span>Sudah Dipilih</span>
                </div>
              </SelectItem>
              <SelectItem value="without" className="text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <Clock className="w-2.5 h-2.5 text-yellow-600" />
                  <span>Belum Dipilih</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Aspek Checklist Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-gray-700 flex items-center">
            <FileText className="w-3 h-3 mr-1 text-cyan-600" />
            Aspek Checklist
          </label>
          <Select value={filterChecklistAspect} onValueChange={onChecklistAspectChange}>
            <SelectTrigger className="h-8 border-2 border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-200 text-xs">
              <SelectValue placeholder="Pilih Aspek" />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              <SelectItem value="all" className="font-medium text-gray-900 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Semua Aspek</span>
                </div>
              </SelectItem>
              {aspects.filter(Boolean).map(aspek => (
                <SelectItem key={aspek} value={aspek} className="text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></div>
                    <span>{aspek}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Compact Reset Button */}
      {isAnyFilterActive && (
        <div className="flex justify-center pt-2">
          <Button 
            variant="outline" 
            onClick={onResetFilters}
            className="border-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 px-4 py-2 h-8 text-xs"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset Semua Filter
          </Button>
        </div>
      )}

      {/* Compact Active Filters Summary */}
      {isAnyFilterActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-medium text-blue-800">Filter Aktif:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {searchTerm && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Pencarian: "{searchTerm}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {selectedPrinciple !== 'all' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Prinsip: {selectedPrinciple}
                <button
                  onClick={() => onPrincipleChange('all')}
                  className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {selectedType !== 'all' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Jenis: {selectedType}
                <button
                  onClick={() => onTypeChange('all')}
                  className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {selectedDirektorat !== 'all' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Direktorat: {selectedDirektorat}
                <button
                  onClick={() => onDirektoratChange('all')}
                  className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {selectedSubDirektorat !== 'all' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                Sub Direktorat: {selectedSubDirektorat}
                <button
                  onClick={() => onSubDirektoratChange('all')}
                  className="ml-1 hover:bg-pink-200 rounded-full p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Status: {selectedStatus}
                <button
                  onClick={() => onStatusChange('all')}
                  className="ml-1 hover:bg-indigo-200 rounded-full p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {filterChecklistStatus !== 'all' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                Checklist: {filterChecklistStatus === 'with' ? 'Sudah Dipilih' : 'Belum Dipilih'}
                <button
                  onClick={() => onChecklistStatusChange('all')}
                  className="ml-1 hover:bg-teal-200 rounded-full p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {filterChecklistAspect !== 'all' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                Aspek: {filterChecklistAspect}
                <button
                  onClick={() => onChecklistAspectChange('all')}
                  className="ml-1 hover:bg-cyan-200 rounded-full p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentFilterPanel; 