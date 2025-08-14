// Test data untuk admin dashboard
export const testChecklistAssignments = [
  {
    id: 1,
    checklistId: 1,
    subdirektorat: "Sub Direktorat Keuangan",
    aspek: "Aspek 1 - Komitmen",
    deskripsi: "Checklist komitmen keuangan",
    tahun: 2024,
    assignedBy: "Super Admin",
    assignedAt: new Date(),
    status: "assigned",
    notes: "Test assignment"
  },
  {
    id: 2,
    checklistId: 2,
    subdirektorat: "Sub Direktorat Keuangan",
    aspek: "Aspek 2 - Implementasi",
    deskripsi: "Checklist implementasi keuangan",
    tahun: 2024,
    assignedBy: "Super Admin",
    assignedAt: new Date(),
    status: "assigned",
    notes: "Test assignment"
  }
];

export const testDocuments = [
  {
    id: 1,
    checklistId: 1,
    subdirektorat: "Sub Direktorat Keuangan",
    direktorat: "Direktorat Keuangan",
    divisi: "Divisi Akuntansi",
    tahun: 2024,
    namaFile: "test-document-1.pdf",
    uploadDate: new Date(),
    fileSize: 1024,
    fileType: "application/pdf"
  }
];

export const testChecklist = [
  {
    id: 1,
    aspek: "Aspek 1 - Komitmen",
    deskripsi: "Checklist komitmen keuangan",
    tahun: 2024,
    kategori: "Keuangan",
    prioritas: "Tinggi"
  },
  {
    id: 2,
    aspek: "Aspek 2 - Implementasi",
    deskripsi: "Checklist implementasi keuangan",
    tahun: 2024,
    kategori: "Keuangan",
    prioritas: "Tinggi"
  }
];

// Function untuk setup test data
export const setupTestData = () => {
  try {
    // Setup checklist assignments
    localStorage.setItem('checklistAssignments', JSON.stringify(testChecklistAssignments));
    
    // Setup documents
    localStorage.setItem('documents', JSON.stringify(testDocuments));
    
    // Setup checklist
    localStorage.setItem('checklist', JSON.stringify(testChecklist));
    
    console.log('Test data setup completed');
    return true;
  } catch (error) {
    console.error('Error setting up test data:', error);
    return false;
  }
};

// Function untuk clear test data
export const clearTestData = () => {
  try {
    localStorage.removeItem('checklistAssignments');
    localStorage.removeItem('documents');
    localStorage.removeItem('checklist');
    
    console.log('Test data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing test data:', error);
    return false;
  }
};
