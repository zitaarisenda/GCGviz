import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { seedChecklistGCG } from "@/lib/seed/seedChecklistGCG";

export interface ChecklistGCG {
  id: number;
  aspek: string;
  deskripsi: string;
  tahun?: number;
}

interface ChecklistContextType {
  checklist: ChecklistGCG[];
  getChecklistByYear: (year: number) => ChecklistGCG[];
  addChecklist: (aspek: string, deskripsi: string, year: number) => void;
  editChecklist: (id: number, aspek: string, deskripsi: string, year: number) => void;
  deleteChecklist: (id: number, year: number) => void;
  addAspek: (aspek: string, year: number) => void;
  editAspek: (oldAspek: string, newAspek: string, year: number) => void;
  deleteAspek: (aspek: string, year: number) => void;
  initializeYearData: (year: number) => void;
  ensureAllYearsHaveData: () => void;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const ChecklistProvider = ({ children }: { children: ReactNode }) => {
  const [checklist, setChecklist] = useState<ChecklistGCG[]>([]);

  // Function to ensure all years have checklist data
  const ensureAllYearsHaveData = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const allYears = [];
    for (let year = currentYear; year >= 2014; year--) {
      allYears.push(year);
    }
    
    let hasChanges = false;
    const updatedChecklist = [...checklist];
    
    allYears.forEach(year => {
      const existingData = checklist.filter(item => item.tahun === year);
      if (existingData.length === 0) {
        const yearData = seedChecklistGCG.map(item => ({ ...item, tahun: year }));
        updatedChecklist.push(...yearData);
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setChecklist(updatedChecklist);
      localStorage.setItem("checklistGCG", JSON.stringify(updatedChecklist));
    }
  }, [checklist]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checklistGCG") || "null");
    if (!data) {
      // Initialize with default data for all available years (2014 to current year)
      const currentYear = new Date().getFullYear();
      const allYears = [];
      for (let year = currentYear; year >= 2014; year--) {
        allYears.push(year);
      }
      
      const defaultData = [];
      allYears.forEach(year => {
        const yearData = seedChecklistGCG.map(item => ({ ...item, tahun: year }));
        defaultData.push(...yearData);
      });
      
      localStorage.setItem("checklistGCG", JSON.stringify(defaultData));
      setChecklist(defaultData);
    } else {
      setChecklist(data);
      // Ensure all years have data even if some are missing
      setTimeout(() => {
        ensureAllYearsHaveData();
      }, 100);
    }
  }, [ensureAllYearsHaveData]);

  const getChecklistByYear = (year: number): ChecklistGCG[] => {
    return checklist.filter(item => item.tahun === year);
  };

  const initializeYearData = (year: number) => {
    const existingData = checklist.filter(item => item.tahun === year);
    if (existingData.length === 0) {
      // Initialize with default data for the new year
      const defaultData = seedChecklistGCG.map(item => ({ ...item, tahun: year }));
      const updated = [...checklist, ...defaultData];
      setChecklist(updated);
      localStorage.setItem("checklistGCG", JSON.stringify(updated));
    }
  };

  const addChecklist = (aspek: string, deskripsi: string, year: number) => {
    const newChecklist = { id: Date.now(), aspek, deskripsi, tahun: year };
    const updated = [...checklist, newChecklist];
    setChecklist(updated);
    localStorage.setItem("checklistGCG", JSON.stringify(updated));
  };

  const editChecklist = (id: number, aspek: string, deskripsi: string, year: number) => {
    const updated = checklist.map((c) => (c.id === id ? { ...c, aspek, deskripsi, tahun: year } : c));
    setChecklist(updated);
    localStorage.setItem("checklistGCG", JSON.stringify(updated));
  };

  const deleteChecklist = (id: number, year: number) => {
    const updated = checklist.filter((c) => c.id !== id);
    setChecklist(updated);
    localStorage.setItem("checklistGCG", JSON.stringify(updated));
  };

  const addAspek = (aspek: string, year: number) => {
    const newChecklist = { 
      id: Date.now(), 
      aspek, 
      deskripsi: `Item checklist untuk ${aspek}`, 
      tahun: year 
    };
    const updated = [...checklist, newChecklist];
    setChecklist(updated);
    localStorage.setItem("checklistGCG", JSON.stringify(updated));
  };

  const editAspek = (oldAspek: string, newAspek: string, year: number) => {
    const updated = checklist.map((c) => 
      c.aspek === oldAspek && c.tahun === year 
        ? { ...c, aspek: newAspek } 
        : c
    );
    setChecklist(updated);
    localStorage.setItem("checklistGCG", JSON.stringify(updated));
  };

  const deleteAspek = (aspek: string, year: number) => {
    const updated = checklist.filter((c) => !(c.aspek === aspek && c.tahun === year));
    setChecklist(updated);
    localStorage.setItem("checklistGCG", JSON.stringify(updated));
  };

  return (
    <ChecklistContext.Provider value={{ 
      checklist, 
      getChecklistByYear,
      addChecklist, 
      editChecklist, 
      deleteChecklist,
      addAspek,
      editAspek,
      deleteAspek,
      initializeYearData,
      ensureAllYearsHaveData
    }}>
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklist = () => {
  const ctx = useContext(ChecklistContext);
  if (!ctx) throw new Error("useChecklist must be used within ChecklistProvider");
  return ctx;
}; 