import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { seedChecklistGCG } from "@/lib/seed/seedChecklistGCG";

export interface ChecklistGCG {
  id: number;
  aspek: string;
  deskripsi: string;
}

interface ChecklistContextType {
  checklist: ChecklistGCG[];
  addChecklist: (aspek: string, deskripsi: string) => void;
  editChecklist: (id: number, aspek: string, deskripsi: string) => void;
  deleteChecklist: (id: number) => void;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export const ChecklistProvider = ({ children }: { children: ReactNode }) => {
  const [checklist, setChecklist] = useState<ChecklistGCG[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checklistGCG") || "null");
    if (!data) {
      localStorage.setItem("checklistGCG", JSON.stringify(seedChecklistGCG));
      setChecklist(seedChecklistGCG);
    } else {
      setChecklist(data);
    }
  }, []);

  const addChecklist = (aspek: string, deskripsi: string) => {
    const newChecklist = { id: Date.now(), aspek, deskripsi };
    const updated = [...checklist, newChecklist];
    setChecklist(updated);
    localStorage.setItem("checklistGCG", JSON.stringify(updated));
  };

  const editChecklist = (id: number, aspek: string, deskripsi: string) => {
    const updated = checklist.map((c) => (c.id === id ? { ...c, aspek, deskripsi } : c));
    setChecklist(updated);
    localStorage.setItem("checklistGCG", JSON.stringify(updated));
  };

  const deleteChecklist = (id: number) => {
    const updated = checklist.filter((c) => c.id !== id);
    setChecklist(updated);
    localStorage.setItem("checklistGCG", JSON.stringify(updated));
  };

  return (
    <ChecklistContext.Provider value={{ checklist, addChecklist, editChecklist, deleteChecklist }}>
      {children}
    </ChecklistContext.Provider>
  );
};

export const useChecklist = () => {
  const ctx = useContext(ChecklistContext);
  if (!ctx) throw new Error("useChecklist must be used within ChecklistProvider");
  return ctx;
}; 