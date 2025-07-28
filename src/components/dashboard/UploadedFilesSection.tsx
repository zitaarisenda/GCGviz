import React from 'react';
import { FileText, CheckCircle, Upload, Plus } from 'lucide-react';
import { useFileUpload } from '@/contexts/FileUploadContext';
import { Button } from '@/components/ui/button';

const UploadedFilesSection: React.FC = () => {
  const { selectedYear, uploadedFiles, getFilesByYear } = useFileUpload();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const yearFiles = selectedYear ? getFilesByYear(selectedYear) : [];

  if (!selectedYear) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-green-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Dokumen Terupload</h2>
            <p className="text-sm text-gray-600">
              Daftar dokumen yang sudah diupload untuk tahun {selectedYear}
            </p>
          </div>
        </div>

      </div>

      {yearFiles.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Belum ada dokumen yang diupload
          </h3>
          <p className="text-gray-600 mb-4">
            Upload dokumen pertama Anda untuk tahun {selectedYear}
          </p>

        </div>
      ) : (
        <div className="space-y-3">
          {yearFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.fileName}</p>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(file.fileSize)} • {file.aspect}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {file.uploadDate.toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadedFilesSection; 