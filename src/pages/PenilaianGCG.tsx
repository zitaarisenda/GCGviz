import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/contexts/SidebarContext';
import GCGDashboard from '@/components/dashboard/GCGDashboard';
import CSVPoweredDashboard from '@/components/dashboard/CSVPoweredDashboard'; // Now reads XLSX
import { 
  FileText, 
  Upload, 
  Edit3, 
  Plus, 
  Minus, 
  Save, 
  Calendar,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  LineChart,
  HelpCircle
} from 'lucide-react';

interface PenilaianRow {
  id: string;
  no?: string; // Only for DETAILED mode
  aspek: string;
  deskripsi: string;
  jumlah_parameter?: number; // Only for DETAILED mode
  bobot: number;
  skor: number;
  capaian: number;
  penjelasan: string;
}

const PenilaianGCG = () => {
  const { isSidebarOpen } = useSidebar();
  
  // State untuk workflow
  const [currentStep, setCurrentStep] = useState<'method' | 'table' | 'upload'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'manual' | 'otomatis' | null>(null);
  
  // State untuk tahun dan auditor
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [customYear, setCustomYear] = useState('');
  const [showAddYear, setShowAddYear] = useState(false);
  const [customYears, setCustomYears] = useState<number[]>([]);
  const [auditor, setAuditor] = useState('Self Assessment');
  
  // State untuk data table
  const [tableData, setTableData] = useState<PenilaianRow[]>([]);
  const [editingCell, setEditingCell] = useState<{rowId: string, field: keyof PenilaianRow} | null>(null);
  
  // Track which fields are being edited to handle 0 display properly
  const [editingFields, setEditingFields] = useState<Record<string, string>>({});
  
  // State untuk file upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [processingResult, setProcessingResult] = useState<any | null>(null);
  
  // State untuk save functionality
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  
  // State for data format mode
  const [isDetailedMode, setIsDetailedMode] = useState(false);
  
  // State for aspect summary table (DETAILED mode only)
  const [aspectSummaryData, setAspectSummaryData] = useState<PenilaianRow[]>([]);
  
  // Predetermined GCG aspect summary rows (for DETAILED mode)
  const getAspectSummaryRows = (): PenilaianRow[] => [
    {
      id: 'aspect-1',
      aspek: 'I',
      deskripsi: '',
      bobot: 0,
      skor: 0,
      capaian: 0,
      penjelasan: 'Sangat Kurang'
    },
    {
      id: 'aspect-2', 
      aspek: 'II',
      deskripsi: '',
      bobot: 0,
      skor: 0,
      capaian: 0,
      penjelasan: 'Sangat Kurang'
    },
    {
      id: 'aspect-3',
      aspek: 'III', 
      deskripsi: '',
      bobot: 0,
      skor: 0,
      capaian: 0,
      penjelasan: 'Sangat Kurang'
    },
    {
      id: 'aspect-4',
      aspek: 'IV',
      deskripsi: '',
      bobot: 0,
      skor: 0,
      capaian: 0,
      penjelasan: 'Sangat Kurang'
    },
    {
      id: 'aspect-5',
      aspek: 'V',
      deskripsi: '', 
      bobot: 0,
      skor: 0,
      capaian: 0,
      penjelasan: 'Sangat Kurang'
    },
    {
      id: 'aspect-6',
      aspek: 'VI',
      deskripsi: '',
      bobot: 0,
      skor: 0,
      capaian: 0,
      penjelasan: 'Sangat Kurang'
    }
  ];

  // Handle mode toggle
  const handleModeToggle = (detailed: boolean) => {
    setIsDetailedMode(detailed);
    
    if (detailed) {
      // Switch to DETAILED mode - load aspect summary
      setAspectSummaryData(getAspectSummaryRows());
      // Clear main table data and ensure DETAILED fields
      setTableData([]);
      console.log('📊 DETAILED mode activated - aspect summary loaded');
    } else {
      // Switch to BRIEF mode - clear aspect summary
      setAspectSummaryData([]);
      // Clear main table data and remove DETAILED fields
      setTableData([]);
      console.log('📋 BRIEF mode activated - simplified view');
    }
  };

  // Generate tahun dari 2014 sampai sekarang + 2 tahun ke depan + custom years
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const baseYears = [];
    for (let year = currentYear + 2; year >= 2014; year--) {
      baseYears.push(year);
    }
    
    // Combine base years with custom years and sort
    const allYears = [...baseYears, ...customYears];
    return [...new Set(allYears)].sort((a, b) => b - a);
  }, [customYears]);

  // Auto-calculate capaian dan penjelasan with negative bobot handling
  const calculateCapaian = (skor: number, bobot: number): number => {
    // Handle special cases
    if (bobot === 0) {
      // If bobot is 0, assume perfect score (best classification)
      return 100;
    }
    
    if (bobot < 0) {
      // Negative bobot = assessment of bad things (harassment, violations)
      // Special range: -100% < capaian < 0%
      // Logic: skor = 0 → capaian = 0% (Sangat Baik)
      //        skor = |bobot| → capaian = -100% (Sangat Kurang)
      if (skor === 0) {
        return 0; // No bad events = 0% = Sangat Baik for negative bobot
      }
      // Formula: -(|skor| / |bobot|) * 100
      const absBobot = Math.abs(bobot);
      const absSkor = Math.abs(skor);
      const ratio = Math.min(absSkor, absBobot) / absBobot; // Cap at 100%
      return -Math.round(ratio * 100); // Negative percentage
    }
    
    // Normal positive bobot calculation
    return Math.round((skor / bobot) * 100);
  };

  const getPenjelasan = (capaian: number, bobot: number = 1): string => {
    // Handle 0% capaian - depends on bobot sign
    if (capaian === 0) {
      if (bobot < 0) {
        // For negative bobot, 0% = Sangat Baik (no bad events)
        return 'Sangat Baik';
      } else {
        // For positive bobot, 0% = Sangat Kurang (no achievement)
        return 'Sangat Kurang';
      }
    }
    
    // Handle negative capaian (from negative bobot)
    if (capaian < 0 && capaian >= -100) {
      if (capaian >= -10) return 'Sangat Baik';    // -1% to -10%
      if (capaian >= -20) return 'Baik';           // -11% to -20%
      if (capaian >= -30) return 'Cukup Baik';     // -21% to -30%
      if (capaian >= -40) return 'Kurang Baik';    // -31% to -40%
      return 'Sangat Kurang';                      // -41% to -100%
    }
    
    // Handle positive capaian (normal logic for positive bobot)
    if (capaian >= 90) return 'Sangat Baik';
    if (capaian >= 80) return 'Baik';
    if (capaian >= 70) return 'Cukup Baik';
    if (capaian >= 60) return 'Kurang Baik';
    return 'Sangat Kurang';
  };

  // Add new row to table
  const addNewRow = () => {
    const newRow: PenilaianRow = {
      id: Date.now().toString(),
      no: isDetailedMode ? '' : undefined,
      aspek: '',
      deskripsi: '',
      jumlah_parameter: isDetailedMode ? 0 : undefined,
      bobot: 0,
      skor: 0,
      capaian: 0,
      penjelasan: 'Sangat Kurang'
    };
    setTableData([...tableData, newRow]);
  };

  // Delete row from table
  const deleteRow = (rowId: string) => {
    setTableData(tableData.filter(row => row.id !== rowId));
  };

  // Update aspect summary cell
  const updateAspectSummaryCell = (rowId: string, field: keyof PenilaianRow, value: any) => {
    console.log(`🔄 UpdateAspectSummaryCell: ${field} = ${value}`);
    
    setAspectSummaryData(aspectSummaryData.map(row => {
      if (row.id === rowId) {
        const updatedRow = { ...row, [field]: value };
        
        // Auto-calculate capaian dan penjelasan jika skor atau bobot berubah
        if (field === 'skor' || field === 'bobot') {
          updatedRow.capaian = calculateCapaian(updatedRow.skor, updatedRow.bobot);
          updatedRow.penjelasan = getPenjelasan(updatedRow.capaian, updatedRow.bobot);
        }
        
        return updatedRow;
      }
      return row;
    }));
  };

  // Update cell value
  const updateCell = (rowId: string, field: keyof PenilaianRow, value: any) => {
    console.log(`🔄 UpdateCell: ${field} = ${value} (type: ${typeof value})`);
    
    setTableData(tableData.map(row => {
      if (row.id === rowId) {
        const updatedRow = { ...row, [field]: value };
        
        // Auto-calculate capaian dan penjelasan jika skor atau bobot berubah
        if (field === 'skor' || field === 'bobot') {
          updatedRow.capaian = calculateCapaian(updatedRow.skor, updatedRow.bobot);
          updatedRow.penjelasan = getPenjelasan(updatedRow.capaian, updatedRow.bobot);
          console.log(`📊 Auto-calculated: skor=${updatedRow.skor}, bobot=${updatedRow.bobot}, capaian=${updatedRow.capaian}%, penjelasan=${updatedRow.penjelasan}`);
        }
        
        return updatedRow;
      }
      return row;
    }));
  };

  // Handle add custom year
  const handleAddYear = () => {
    const year = parseInt(customYear);
    if (year && year >= 2000 && year <= 2050 && !years.includes(year)) {
      setCustomYears([...customYears, year]);
      setSelectedYear(year);
      setCustomYear('');
      setShowAddYear(false);
    }
  };

  // Handle file upload for otomatis method
  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    setProcessingError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // Call POS Data Cleaner backend (assuming you have an API endpoint)
      // For now, we'll use the Python script directly via subprocess
      // In production, you should set up a proper REST API
      
      // Temporary: Save file to temp location and process
      const tempFileName = `temp_${Date.now()}_${file.name}`;
      const outputFileName = `output_${Date.now()}.xlsx`;
      
      // Note: This is a temporary solution. In production, implement proper file upload API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const result = await response.json();
      
      // Store processing result for display
      setProcessingResult(result);
      
      // Convert result to PenilaianRow format with proper number parsing
      const extractedData = result.extractedData || {};
      const sampleData = extractedData.sample_indicators || [];
      const processedData: PenilaianRow[] = sampleData.map((row: any, index: number) => {
        // Ensure proper number parsing for all numeric fields
        const jumlah_parameter = typeof row.jumlah_parameter === 'string' ? parseInt(row.jumlah_parameter) || 0 : (row.jumlah_parameter || 0);
        const bobot = typeof row.bobot === 'string' ? parseFloat(row.bobot) || 100 : (row.bobot || 100);
        const skor = typeof row.skor === 'string' ? parseFloat(row.skor) || 0 : (row.skor || 0);
        const capaian = typeof row.capaian === 'string' ? parseFloat(row.capaian) || 0 : (row.capaian || 0);
        
        console.log(`Processing row ${index + 1}:`, {
          no: row.no,
          section: row.section,
          description: row.description,
          jumlah_parameter,
          bobot, 
          skor,
          capaian,
          penjelasan: row.penjelasan
        });
        
        return {
          id: row.no?.toString() || (index + 1).toString(),
          aspek: row.section || '',
          deskripsi: row.description || '', // This matches the backend field name
          jumlah_parameter,
          bobot,
          skor,
          capaian,
          penjelasan: getPenjelasan(capaian, bobot) // Always recalculate with frontend logic
        };
      });
      
      setTableData(processedData);
      
      // Auto-update selected year if extracted from file
      if (extractedData.year && !isNaN(parseInt(extractedData.year))) {
        const extractedYear = parseInt(extractedData.year);
        setSelectedYear(extractedYear);
        console.log(`Auto-updated year to: ${extractedYear}`);
      }
      
      setCurrentStep('table');
      
    } catch (error) {
      console.error('Processing error:', error);
      setProcessingError('Gagal memproses file. Silakan periksa format file atau coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load data when year changes
  const handleYearChange = async (year: number) => {
    try {
      console.log(`🔧 DEBUG: Year changed to ${year}, loading data...`);
      
      setSelectedYear(year);
      
      // Try to load existing data for this year
      const response = await fetch(`/api/load/${year}`);
      const result = await response.json();
      
      if (result.success && result.data.length > 0) {
        // Found existing data for this year
        console.log(`✅ Loaded ${result.data.length} rows for year ${year}`);
        setTableData(result.data);
        setAuditor(result.auditor);
        setSaveMessage(`📂 Data tahun ${year} berhasil dimuat (${result.data.length} baris)`);
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        // No data for this year - clear the table
        console.log(`📝 No data found for year ${year}, clearing table`);
        setTableData([]);
        setSaveMessage(`📋 Tahun ${year} dipilih - tabel dikosongkan untuk input baru`);
        setTimeout(() => setSaveMessage(null), 3000);
      }
      
    } catch (error) {
      console.error('❌ Error loading year data:', error);
      // If there's an error, just clear the table
      setTableData([]);
    }
  };

  // Save handler for local JSON storage
  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage(null);
      
      console.log('🔧 DEBUG: Starting save process...');
      console.log(`📊 Saving ${tableData.length} rows for year ${selectedYear}`);
      
      const saveData = {
        data: tableData,
        year: selectedYear,
        auditor: auditor,
        method: selectedMethod || 'manual'
      };
      
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log(`✅ Save successful! Assessment ID: ${result.assessment_id}`);
        setSaveMessage(`📊 Data berhasil disimpan! 
        💾 Assessment ID: ${result.assessment_id}
        📁 Excel otomatis dibuat di: data/output/web-output/output.xlsx`);
        
        // Auto-hide success message after 5 seconds (longer for more info)
        setTimeout(() => setSaveMessage(null), 5000);
      } else {
        throw new Error(result.error || 'Save failed');
      }
      
    } catch (error) {
      console.error('❌ Save error:', error);
      setSaveMessage(`Gagal menyimpan data: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Method Selection Step
  const renderMethodSelection = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Penilaian GCG
            </h1>
            <p className="text-gray-600 mt-1">
              Pilih metode input data penilaian Good Corporate Governance
            </p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 text-left">Input</h2>
        
        <div className="flex items-center space-x-4">
          {/* Input Manual - Small Button */}
          <Button 
            onClick={() => {
              setSelectedMethod('manual');
              setCurrentStep('table');
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Input Manual
          </Button>

          {/* Input Otomatis - Small Button */}
          <Button 
            onClick={() => {
              setSelectedMethod('otomatis');
              setCurrentStep('upload');
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Input Otomatis
          </Button>

        </div>
      </div>

      {/* Dashboard Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 text-left">Dashboard Visualisasi</h2>
        
        <CSVPoweredDashboard selectedYear={selectedYear} tableData={tableData} auditor={auditor} />
      </div>
    </div>
  );

  // File Upload Step
  const renderFileUpload = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep('method')}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload File Dokumen</h2>
          <p className="text-gray-600">Upload file GCG untuk diproses otomatis</p>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-purple-400 transition-colors">
        <CardContent className="p-8">
          <div className="text-center">
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drag & Drop atau Klik untuk Upload</h3>
            <p className="text-gray-600 mb-4">
              Support: Excel (.xlsx, .xls), PDF, Gambar (.png, .jpg)
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Maksimal ukuran file: 50MB
            </p>
            
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".xlsx,.xls,.pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
            />
            <Label htmlFor="file-upload">
              <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Pilih File
                </span>
              </Button>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {isProcessing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div>
                <h4 className="font-semibold text-blue-900">Memproses File...</h4>
                <p className="text-blue-700 text-sm">
                  Menggunakan POS Data Cleaner untuk mengekstrak data GCG
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {processingError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900">Gagal Memproses File</h4>
                <p className="text-red-700 text-sm mt-1">{processingError}</p>
                <div className="mt-3 space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentStep('method')}
                    className="border-red-300 text-red-700 hover:bg-red-100"
                  >
                    Coba Input Manual
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setProcessingError(null);
                      setUploadedFile(null);
                    }}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Upload File Lain
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );


  // Table Step (main editing interface)
  const renderTable = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep('method')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedMethod === 'manual' ? 'Input Manual' : 'Review & Edit'} Data GCG
            </h2>
            <p className="text-gray-600">
              {selectedMethod === 'manual' 
                ? 'Tambahkan data penilaian GCG secara manual'
                : 'Review hasil otomatis dan edit jika diperlukan'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Year and Auditor Selection */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-blue-900">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Tahun Buku & Info Penilaian</span>
          </CardTitle>
          <CardDescription>
            Pilih tahun buku dan tentukan auditor untuk data penilaian GCG ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Year Selection Row */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Tahun Buku</Label>
                <Select value={selectedYear.toString()} onValueChange={(value) => handleYearChange(parseInt(value))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih tahun buku" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            
              {showAddYear ? (
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="2026"
                    value={customYear}
                    onChange={(e) => setCustomYear(e.target.value)}
                    className="w-20"
                  />
                  <Button size="sm" onClick={handleAddYear}>
                    <CheckCircle className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => {
                      setShowAddYear(false);
                      setCustomYear('');
                    }}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddYear(true)}
                  className="border-dashed border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Tambah Tahun Buku
                </Button>
              )}
            </div>

            {/* Auditor Selection Row */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Auditor/Penilai</Label>
              <Input
                type="text"
                placeholder="Contoh: Self Assessment, BPKP, Internal Audit, PWC, etc."
                value={auditor}
                onChange={(e) => setAuditor(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan nama auditor atau jenis penilaian (self assessment, pihak eksternal, dll)
              </p>
            </div>

            {/* Data Format Mode Toggle */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">Format Data</Label>
                  <p className="text-xs text-gray-500">
                    Pilih format input: BRIEF (per aspek) atau DETAILED (per indikator dengan No dan Jumlah Parameter)
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm ${!isDetailedMode ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    BRIEF
                  </span>
                  <Switch
                    checked={isDetailedMode}
                    onCheckedChange={handleModeToggle}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <span className={`text-sm ${isDetailedMode ? 'text-purple-900 font-medium' : 'text-gray-500'}`}>
                    DETAILED
                  </span>
                </div>
              </div>
              
              {isDetailedMode && (
                <div className="mt-2 p-2 bg-purple-50 rounded-lg">
                  <p className="text-xs text-purple-800">
                    📊 Mode DETAILED aktif - Tabel aspek summary + tabel indikator dengan kolom No dan Jumlah Parameter
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Tahun Buku: {selectedYear}</strong> | <strong>Auditor: {auditor}</strong> | <strong>Format: {isDetailedMode ? 'DETAILED' : 'BRIEF'}</strong>
              <br />
              <span className="text-xs">
                Semua data akan disimpan dengan informasi ini
                {isDetailedMode && ' | Mode DETAILED: Tabel aspek + indikator'}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Processing Success Info */}
      {processingResult && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900">File Berhasil Diproses!</h4>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-green-700 font-medium">File:</p>
                    <p className="text-green-600">{processingResult.originalFilename}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Format:</p>
                    <p className="text-green-600">{processingResult.extractedData?.format_type || 'DETAILED'}</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Indikator:</p>
                    <p className="text-green-600">{processingResult.extractedData?.indicators} indikator</p>
                  </div>
                  <div>
                    <p className="text-green-700 font-medium">Status:</p>
                    <p className="text-green-600">{processingResult.extractedData?.processing_status === 'success' ? 'Berhasil' : 'Selesai'}</p>
                  </div>
                </div>
                {processingResult.extractedData?.year && (
                  <div className="mt-2">
                    <p className="text-green-700 text-sm">
                      <strong>Tahun:</strong> {processingResult.extractedData.year} | 
                      <strong> Penilai:</strong> {processingResult.extractedData?.penilai || 'Tidak terdeteksi'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aspect Summary Table (DETAILED mode only) */}
      {isDetailedMode && (
        <Card className="border-0 shadow-lg bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span>Summary Aspek GCG - Tahun Buku {selectedYear}</span>
            </CardTitle>
            <CardDescription>
              6 aspek GCG utama untuk penilaian summary (tanpa kolom No dan Jumlah Parameter)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <TableHead className="text-purple-900 font-semibold">Aspek</TableHead>
                    <TableHead className="text-purple-900 font-semibold">Deskripsi</TableHead>
                    <TableHead className="text-purple-900 font-semibold">Bobot</TableHead>
                    <TableHead className="text-purple-900 font-semibold">Skor</TableHead>
                    <TableHead className="text-purple-900 font-semibold">Capaian (%)</TableHead>
                    <TableHead className="text-purple-900 font-semibold">Penjelasan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aspectSummaryData.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50">
                      {/* Aspek (Read-only) */}
                      <TableCell>
                        <div className="px-3 py-2 bg-purple-100 rounded text-center font-medium text-purple-900">
                          {row.aspek}
                        </div>
                      </TableCell>
                      
                      {/* Deskripsi */}
                      <TableCell className="min-w-64">
                        <Input
                          value={row.deskripsi}
                          onChange={(e) => updateAspectSummaryCell(row.id, 'deskripsi', e.target.value)}
                          className="border-0 bg-transparent focus:bg-white focus:border focus:border-purple-300"
                          placeholder="Deskripsi aspek..."
                        />
                      </TableCell>
                      
                      {/* Bobot */}
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={row.bobot.toString()}
                          onChange={(e) => {
                            const numValue = parseFloat(e.target.value);
                            updateAspectSummaryCell(row.id, 'bobot', isNaN(numValue) ? 0 : numValue);
                          }}
                          className="border-0 bg-transparent focus:bg-white focus:border focus:border-purple-300 w-20"
                          placeholder="0.00"
                        />
                      </TableCell>
                      
                      {/* Skor */}
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={row.skor.toString()}
                          onChange={(e) => {
                            const numValue = parseFloat(e.target.value);
                            updateAspectSummaryCell(row.id, 'skor', isNaN(numValue) ? 0 : numValue);
                          }}
                          className="border-0 bg-transparent focus:bg-white focus:border focus:border-purple-300 w-20"
                          placeholder="0.00"
                        />
                      </TableCell>
                      
                      {/* Capaian (Auto-calculated) */}
                      <TableCell>
                        <div className="text-center font-medium">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            row.capaian >= 85 ? 'bg-green-100 text-green-800' :
                            row.capaian >= 75 ? 'bg-blue-100 text-blue-800' :
                            row.capaian >= 65 ? 'bg-yellow-100 text-yellow-800' :
                            row.capaian >= 50 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {row.capaian}%
                          </span>
                        </div>
                      </TableCell>
                      
                      {/* Penjelasan (Auto-calculated) */}
                      <TableCell>
                        <div className="text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row.penjelasan === 'Sangat Baik' ? 'bg-green-100 text-green-800' :
                            row.penjelasan === 'Baik' ? 'bg-blue-100 text-blue-800' :
                            row.penjelasan === 'Cukup Baik' ? 'bg-yellow-100 text-yellow-800' :
                            row.penjelasan === 'Kurang Baik' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {row.penjelasan}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Data Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>
                  {isDetailedMode 
                    ? `Data Indikator Detail - Tahun Buku ${selectedYear}` 
                    : `Data Penilaian GCG - Tahun Buku ${selectedYear}`
                  }
                </span>
              </CardTitle>
              <CardDescription>
                {tableData.length} baris data {isDetailedMode ? 'indikator detail' : 'penilaian'}
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button 
                onClick={addNewRow}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Baris
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={tableData.length === 0 || isSaving}
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Menyimpan...' : 'Simpan Data'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {/* Save Message */}
        {saveMessage && (
          <div className="mx-6 mb-4">
            <div className={`p-3 rounded-lg text-sm ${
              saveMessage.includes('berhasil') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {saveMessage}
            </div>
          </div>
        )}
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  {isDetailedMode && (
                    <TableHead className="text-indigo-900 font-semibold">No</TableHead>
                  )}
                  <TableHead className="text-indigo-900 font-semibold">Aspek</TableHead>
                  <TableHead className="text-indigo-900 font-semibold">Deskripsi</TableHead>
                  {isDetailedMode && (
                    <TableHead className="text-indigo-900 font-semibold">
                      <div className="flex items-center space-x-1">
                        <span>Jumlah Parameter</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="w-4 h-4 text-indigo-600 hover:text-indigo-800 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-sm">Kalau jumlah parameter gak ada, kosongin aja</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableHead>
                  )}
                  <TableHead className="text-indigo-900 font-semibold">Bobot</TableHead>
                  <TableHead className="text-indigo-900 font-semibold">Skor</TableHead>
                  <TableHead className="text-indigo-900 font-semibold">Capaian (%)</TableHead>
                  <TableHead className="text-indigo-900 font-semibold">Penjelasan</TableHead>
                  <TableHead className="text-indigo-900 font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50">
                    {/* No (DETAILED mode only) */}
                    {isDetailedMode && (
                      <TableCell>
                        <Input
                          value={row.no || ''}
                          onChange={(e) => updateCell(row.id, 'no', e.target.value)}
                          className="border-0 bg-transparent focus:bg-white focus:border focus:border-blue-300 w-20"
                          placeholder="1, 2, 3..."
                        />
                      </TableCell>
                    )}
                    
                    {/* Aspek */}
                    <TableCell>
                      <Input
                        value={row.aspek}
                        onChange={(e) => updateCell(row.id, 'aspek', e.target.value)}
                        className="border-0 bg-transparent focus:bg-white focus:border focus:border-blue-300"
                        placeholder="I, II, III..."
                      />
                    </TableCell>
                    
                    {/* Deskripsi */}
                    <TableCell className="min-w-64">
                      <Input
                        value={row.deskripsi}
                        onChange={(e) => updateCell(row.id, 'deskripsi', e.target.value)}
                        className="border-0 bg-transparent focus:bg-white focus:border focus:border-blue-300"
                        placeholder="Deskripsi penilaian..."
                      />
                    </TableCell>
                    
                    {/* Jumlah Parameter (DETAILED mode only) */}
                    {isDetailedMode && (
                      <TableCell>
                        <Input
                          type="number"
                          value={(() => {
                            const fieldKey = `${row.id}-jumlah_parameter`;
                            if (editingFields[fieldKey] !== undefined) {
                              return editingFields[fieldKey]; // Show what user is typing
                            }
                            return (row.jumlah_parameter || 0).toString(); // Always show the value, including 0
                          })()}
                          onChange={(e) => {
                            const value = e.target.value;
                            const fieldKey = `${row.id}-jumlah_parameter`;
                            
                            // Track what user is typing
                            setEditingFields(prev => ({
                              ...prev,
                              [fieldKey]: value
                            }));
                            
                            if (value === '' || value === null) {
                              updateCell(row.id, 'jumlah_parameter', 0);
                            } else {
                              const numValue = parseInt(value);
                              updateCell(row.id, 'jumlah_parameter', isNaN(numValue) ? 0 : numValue);
                            }
                          }}
                          onBlur={(e) => {
                            const fieldKey = `${row.id}-jumlah_parameter`;
                            // Clear editing state
                            setEditingFields(prev => {
                              const newState = { ...prev };
                              delete newState[fieldKey];
                              return newState;
                            });
                            
                            // Auto-set to 0 when user leaves empty field
                            if (e.target.value === '' || e.target.value === null) {
                              updateCell(row.id, 'jumlah_parameter', 0);
                            }
                          }}
                          onFocus={() => {
                            const fieldKey = `${row.id}-jumlah_parameter`;
                            // When focusing, show current value (even if 0)
                            setEditingFields(prev => ({
                              ...prev,
                              [fieldKey]: (row.jumlah_parameter || 0).toString()
                            }));
                          }}
                          className="border-0 bg-transparent focus:bg-white focus:border focus:border-blue-300 w-20"
                          placeholder="0"
                        />
                      </TableCell>
                    )}
                    
                    {/* Bobot */}
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={(() => {
                          const fieldKey = `${row.id}-bobot`;
                          if (editingFields[fieldKey] !== undefined) {
                            return editingFields[fieldKey]; // Show what user is typing
                          }
                          return row.bobot.toString(); // Always show the value, including 0
                        })()}
                        onChange={(e) => {
                          const value = e.target.value;
                          const fieldKey = `${row.id}-bobot`;
                          
                          // Track what user is typing
                          setEditingFields(prev => ({
                            ...prev,
                            [fieldKey]: value
                          }));
                          
                          if (value === '' || value === null) {
                            updateCell(row.id, 'bobot', 0);
                          } else {
                            const numValue = parseFloat(value);
                            updateCell(row.id, 'bobot', isNaN(numValue) ? 0 : numValue);
                          }
                        }}
                        onBlur={(e) => {
                          const fieldKey = `${row.id}-bobot`;
                          // Clear editing state
                          setEditingFields(prev => {
                            const newState = { ...prev };
                            delete newState[fieldKey];
                            return newState;
                          });
                          
                          // Auto-set to 0 when user leaves empty field
                          if (e.target.value === '' || e.target.value === null) {
                            updateCell(row.id, 'bobot', 0);
                          }
                        }}
                        onFocus={() => {
                          const fieldKey = `${row.id}-bobot`;
                          // When focusing, show current value (even if 0)
                          setEditingFields(prev => ({
                            ...prev,
                            [fieldKey]: row.bobot.toString()
                          }));
                        }}
                        className="border-0 bg-transparent focus:bg-white focus:border focus:border-blue-300 w-20"
                        placeholder="0.00"
                      />
                      {row.bobot < 0 && (
                        <div className="text-xs text-orange-600 mt-1">Bobot negatif</div>
                      )}
                    </TableCell>
                    
                    {/* Skor */}
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        value={(() => {
                          const fieldKey = `${row.id}-skor`;
                          if (editingFields[fieldKey] !== undefined) {
                            return editingFields[fieldKey]; // Show what user is typing
                          }
                          return row.skor.toString(); // Always show the value, including 0
                        })()}
                        onChange={(e) => {
                          const value = e.target.value;
                          const fieldKey = `${row.id}-skor`;
                          
                          // Track what user is typing
                          setEditingFields(prev => ({
                            ...prev,
                            [fieldKey]: value
                          }));
                          
                          if (value === '' || value === null) {
                            updateCell(row.id, 'skor', 0);
                          } else {
                            const numValue = parseFloat(value);
                            updateCell(row.id, 'skor', isNaN(numValue) ? 0 : numValue);
                          }
                        }}
                        onBlur={(e) => {
                          const fieldKey = `${row.id}-skor`;
                          // Clear editing state
                          setEditingFields(prev => {
                            const newState = { ...prev };
                            delete newState[fieldKey];
                            return newState;
                          });
                          
                          // Auto-set to 0 when user leaves empty field
                          if (e.target.value === '' || e.target.value === null) {
                            updateCell(row.id, 'skor', 0);
                          }
                        }}
                        onFocus={() => {
                          const fieldKey = `${row.id}-skor`;
                          // When focusing, show current value (even if 0)
                          setEditingFields(prev => ({
                            ...prev,
                            [fieldKey]: row.skor.toString()
                          }));
                        }}
                        className="border-0 bg-transparent focus:bg-white focus:border focus:border-blue-300 w-20"
                        placeholder="0.00"
                      />
                    </TableCell>
                    
                    {/* Capaian (Auto-calculated) */}
                    <TableCell>
                      <div className="text-center font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          // Special case: 0% depends on bobot sign
                          row.capaian === 0 ? (
                            row.bobot < 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          ) :
                          // Handle negative capaian (for negative bobot)
                          row.capaian < 0 && row.capaian >= -100 ? (
                            row.capaian >= -10 ? 'bg-green-100 text-green-800' :  // -1% to -10% = Sangat Baik
                            row.capaian >= -20 ? 'bg-blue-100 text-blue-800' :    // -11% to -20% = Baik
                            row.capaian >= -30 ? 'bg-yellow-100 text-yellow-800' : // -21% to -30% = Cukup Baik
                            row.capaian >= -40 ? 'bg-orange-100 text-orange-800' : // -31% to -40% = Kurang Baik
                            'bg-red-100 text-red-800'                              // -41% to -100% = Sangat Kurang
                          ) : (
                            // Handle positive capaian (normal logic)
                            row.capaian >= 85 ? 'bg-green-100 text-green-800' :
                            row.capaian >= 75 ? 'bg-blue-100 text-blue-800' :
                            row.capaian >= 65 ? 'bg-yellow-100 text-yellow-800' :
                            row.capaian >= 50 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          )
                        }`}>
                          {row.capaian}%
                        </span>
                      </div>
                    </TableCell>
                    
                    {/* Penjelasan (Auto-calculated) */}
                    <TableCell>
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.penjelasan === 'Sangat Baik' ? 'bg-green-100 text-green-800' :
                          row.penjelasan === 'Baik' ? 'bg-blue-100 text-blue-800' :
                          row.penjelasan === 'Cukup Baik' ? 'bg-yellow-100 text-yellow-800' :
                          row.penjelasan === 'Kurang Baik' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {row.penjelasan}
                        </span>
                      </div>
                    </TableCell>
                    
                    {/* Action */}
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRow(row.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Add Row Button at Bottom of Table */}
            {tableData.length > 0 && (
              <div className="mt-4 text-center">
                <Button 
                  onClick={addNewRow}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Baris
                </Button>
              </div>
            )}
            
            {/* Mode Info */}
            {isDetailedMode && tableData.length > 0 && (
              <div className="mt-4 text-center">
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-800">
                    📊 Mode DETAILED - Data indikator dengan kolom No dan Jumlah Parameter aktif
                  </p>
                </div>
              </div>
            )}
            
            {tableData.length === 0 && (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Belum ada data {isDetailedMode ? 'indikator detail' : 'penilaian'}
                </h3>
                <p className="text-gray-500 mb-4">
                  Klik "Tambah Baris" untuk mulai menambahkan data {isDetailedMode ? 'indikator detail' : 'penilaian GCG'}
                  {isDetailedMode && ' (kolom No dan Jumlah Parameter tersedia)'}
                </p>
                <Button 
                  onClick={addNewRow}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Baris Pertama
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Sidebar />
      <Topbar />
      
      <div className={`
        transition-all duration-300 ease-in-out pt-16
        ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}
      `}>
        <div className="p-6">
          {currentStep === 'method' && renderMethodSelection()}
          {currentStep === 'upload' && renderFileUpload()}
          {currentStep === 'table' && renderTable()}
        </div>
      </div>
    </div>
  );
};

export default PenilaianGCG;