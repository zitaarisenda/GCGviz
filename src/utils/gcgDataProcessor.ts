// Data processor to convert POS Data Cleaner output to GCGChart format

interface PenilaianRow {
  id: string;
  no?: string;
  aspek: string;
  deskripsi: string;
  jumlah_parameter?: number;
  bobot: number;
  skor: number;
  capaian: number;
  penjelasan: string;
}

interface ProcessedGCGData {
  year: number;
  totalScore: number;
  sections: SectionData[];
  hasLevel2Data: boolean;
  penilai?: string;
  penjelasan?: string;
}

interface SectionData {
  name: string;
  romanNumeral: string;
  capaian: number;
  height: number;
  color: string;
  bobot?: number;
  skor?: number;
  jumlah_parameter?: number;
  penjelasan?: string;
}

// Function to convert from dashboard data API to GCGChart format
export const processGCGDataFromAPI = (apiData: any): ProcessedGCGData[] => {
  if (!apiData?.years_data) return [];
  
  const processedData: ProcessedGCGData[] = [];
  
  Object.entries(apiData.years_data).forEach(([yearStr, yearData]: [string, any]) => {
    const year = parseInt(yearStr);
    
    if (!yearData?.data || !Array.isArray(yearData.data)) return;
    
    // Find total score from the data
    const totalRowData = yearData.data.find((row: any) => row.type === 'total');
    const totalScore = totalRowData?.skor || 0;
    
    // Find penilai and general info
    const penilai = yearData.auditor || 'Unknown';
    const penjelasan = yearData.penjelasan || '';
    
    // Process sections (aspects I-VI)
    const aspectRows = yearData.data.filter((row: any) => row.type === 'subtotal');
    const sections: SectionData[] = [];
    
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    const aspekColors = [
      '#cab89aff', // I
      '#fcbe62ff', // II  
      '#B4EBE6',   // III
      '#ACE1AF',   // IV
      '#88AB8E',   // V
      '#c5d8d2ff', // VI
    ];
    
    romanNumerals.forEach((roman, index) => {
      const aspectRow = aspectRows.find((row: any) => row.section === roman);
      
      if (aspectRow) {
        const capaian = aspectRow.capaian || 0;
        
        sections.push({
          name: `Aspek ${roman}`,
          romanNumeral: roman,
          capaian: capaian,
          height: Math.max(capaian, 0.1), // Ensure minimum height for visibility
          color: aspekColors[index],
          bobot: aspectRow.bobot || 0,
          skor: aspectRow.skor || 0,
          jumlah_parameter: aspectRow.jumlah_parameter || 0,
          penjelasan: aspectRow.penjelasan || ''
        });
      }
    });
    
    processedData.push({
      year,
      totalScore,
      sections,
      hasLevel2Data: true, // Assume we have detailed data
      penilai,
      penjelasan
    });
  });
  
  return processedData.sort((a, b) => a.year - b.year);
};

// Function to convert from table data to GCGChart format
export const processGCGDataFromTable = (
  tableData: PenilaianRow[], 
  selectedYear: number, 
  auditor: string,
  jenisAsesmen: string
): ProcessedGCGData[] => {
  if (!tableData || tableData.length === 0) return [];
  
  // Group data by aspek (I-VI)
  const aspectGroups: Record<string, PenilaianRow[]> = {};
  tableData.forEach(row => {
    if (row.aspek && ['I', 'II', 'III', 'IV', 'V', 'VI'].includes(row.aspek)) {
      if (!aspectGroups[row.aspek]) {
        aspectGroups[row.aspek] = [];
      }
      aspectGroups[row.aspek].push(row);
    }
  });
  
  const sections: SectionData[] = [];
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const aspekColors = [
    '#cab89aff', // I
    '#fcbe62ff', // II  
    '#B4EBE6',   // III
    '#ACE1AF',   // IV
    '#88AB8E',   // V
    '#c5d8d2ff', // VI
  ];
  
  let totalScore = 0;
  
  romanNumerals.forEach((roman, index) => {
    const aspectRows = aspectGroups[roman] || [];
    
    if (aspectRows.length > 0) {
      // Calculate totals for this aspect
      const totalBobot = aspectRows.reduce((sum, row) => sum + (row.bobot || 0), 0);
      const totalSkor = aspectRows.reduce((sum, row) => sum + (row.skor || 0), 0);
      const capaian = totalBobot > 0 ? (totalSkor / totalBobot) * 100 : 0;
      
      // Get penjelasan - use the most common or first one
      const penjelasan = aspectRows[0]?.penjelasan || '';
      
      sections.push({
        name: `Aspek ${roman}`,
        romanNumeral: roman,
        capaian: capaian,
        height: Math.max(capaian, 0.1), // Ensure minimum height for visibility
        color: aspekColors[index],
        bobot: totalBobot,
        skor: totalSkor,
        jumlah_parameter: aspectRows.reduce((sum, row) => sum + (row.jumlah_parameter || 0), 0),
        penjelasan: penjelasan
      });
      
      totalScore += totalSkor;
    } else {
      // Create empty section for missing aspects
      sections.push({
        name: `Aspek ${roman}`,
        romanNumeral: roman,
        capaian: 0,
        height: 0.1,
        color: aspekColors[index],
        bobot: 0,
        skor: 0,
        jumlah_parameter: 0,
        penjelasan: '-'
      });
    }
  });
  
  return [{
    year: selectedYear,
    totalScore,
    sections,
    hasLevel2Data: true,
    penilai: auditor,
    penjelasan: jenisAsesmen
  }];
};