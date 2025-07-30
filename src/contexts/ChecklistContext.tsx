import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
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
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const ChecklistProvider = ({ children }: { children: ReactNode }) => {
  const [checklist, setChecklist] = useState<ChecklistGCG[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checklistGCG") || "null");
    if (!data) {
      // Initialize with default data for current year
      const currentYear = new Date().getFullYear();
      const defaultData = seedChecklistGCG.map(item => ({ ...item, tahun: currentYear }));
      localStorage.setItem("checklistGCG", JSON.stringify(defaultData));
      setChecklist(defaultData);
    } else {
      setChecklist(data);
    }
  }, []);

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
      initializeYearData
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