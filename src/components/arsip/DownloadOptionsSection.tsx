import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Archive, CheckCircle, Building2, Users } from 'lucide-react';

interface DownloadOptionsSectionProps {
  downloadType: 'all' | 'aspect' | 'direktorat' | 'subdirektorat';
  selectedAspect: string;
  selectedDirektorat: string;
  selectedSubDirektorat: string;
  aspects: string[];
  direktoratOptions: string[];
  divisiOptions: string[];
  onDownloadTypeChange: (type: 'all' | 'aspect' | 'direktorat' | 'subdirektorat') => void;
  onAspectChange: (aspect: string) => void;
  onDirektoratChange: (direktorat: string) => void;
  onSubDirektoratChange: (subdirektorat: string) => void;
  onDownload: () => void;
  isDownloading: boolean;
  downloadProgress: number;
}

const DownloadOptionsSection: React.FC<DownloadOptionsSectionProps> = ({
  downloadType,
  selectedAspect,
  selectedDirektorat,
  selectedSubDirektorat,
  aspects,
  direktoratOptions,
  divisiOptions,
  onDownloadTypeChange,
  onAspectChange,
  onDirektoratChange,
  onSubDirektoratChange,
  onDownload,
  isDownloading,
  downloadProgress
}) => {
  const getDownloadTypeIcon = (type: string) => {
    switch (type) {
      case 'all':
        return <Archive className="w-5 h-5" />;
      case 'aspect':
        return <CheckCircle className="w-5 h-5" />;
      case 'direktorat':
        return <Building2 className="w-5 h-5" />;
      case 'subdirektorat':
        return <Users className="w-5 h-5" />;
      default:
        return <Archive className="w-5 h-5" />;
    }
  };

  const getDownloadTypeLabel = (type: string) => {
    switch (type) {
      case 'all':
        return 'Semua Dokumen';
      case 'aspect':
        return 'Berdasarkan Aspek';
      case 'direktorat':
        return 'Berdasarkan Direktorat';
      case 'subdirektorat':
        return 'Berdasarkan Subdirektorat';
      default:
        return 'Semua Dokumen';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-blue-900">
          <Download className="w-6 h-6 text-blue-600" />
          <span>Opsi Download Dokumen</span>
        </CardTitle>
        <CardDescription className="text-blue-700">
          Pilih jenis download dan filter yang diinginkan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Download Type Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(['all', 'aspect', 'direktorat', 'subdirektorat'] as const).map((type) => (
            <Button
              key={type}
              variant={downloadType === type ? "default" : "outline"}
              onClick={() => onDownloadTypeChange(type)}
              className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                downloadType === type 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'border-blue-200 text-blue-600 hover:bg-blue-50'
              }`}
            >
              {getDownloadTypeIcon(type)}
              <span className="text-sm font-medium">{getDownloadTypeLabel(type)}</span>
            </Button>
          ))}
        </div>

        {/* Filter Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Aspect Filter */}
          {downloadType === 'aspect' && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Pilih Aspek
              </label>
              <Select value={selectedAspect} onValueChange={onAspectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih aspek dokumen GCG" />
                </SelectTrigger>
                <SelectContent>
                  {aspects.map((aspect) => (
                    <SelectItem key={aspect} value={aspect}>
                      {aspect}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Direktorat Filter */}
          {downloadType === 'direktorat' && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Pilih Direktorat
              </label>
              <Select value={selectedDirektorat} onValueChange={onDirektoratChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih direktorat" />
                </SelectTrigger>
                <SelectContent>
                  {direktoratOptions.map((direktorat) => (
                    <SelectItem key={direktorat} value={direktorat}>
                      {direktorat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Subdirektorat Filter */}
          {downloadType === 'subdirektorat' && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Pilih Subdirektorat
              </label>
              <Select value={selectedSubDirektorat} onValueChange={onSubDirektoratChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih subdirektorat" />
                </SelectTrigger>
                <SelectContent>
                  {divisiOptions.map((divisi) => (
                    <SelectItem key={divisi} value={divisi}>
                      {divisi}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Download Button */}
        <div className="flex justify-center">
          <Button
            onClick={onDownload}
            disabled={isDownloading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            {isDownloading ? 'Mengunduh...' : 'Download Dokumen'}
          </Button>
        </div>

        {/* Download Progress */}
        {isDownloading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress Download</span>
              <span>{downloadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DownloadOptionsSection;
