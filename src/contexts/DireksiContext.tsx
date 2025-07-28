import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { seedDireksi } from "@/lib/seed/seedDireksi";

export interface Direksi {
  id: number;
  nama: string;
}

interface DireksiContextType {
  direksi: Direksi[];
  addDireksi: (nama: string) => void;
  editDireksi: (id: number, nama: string) => void;
  deleteDireksi: (id: number) => void;
}

const DireksiContext = createContext<DireksiContextType | undefined>(undefined);

export const DireksiProvider = ({ children }: { children: ReactNode }) => {
  const [direksi, setDireksi] = useState<Direksi[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("direksi") || "null");
    if (!data) {
      localStorage.setItem("direksi", JSON.stringify(seedDireksi));
      setDireksi(seedDireksi);
    } else {
      setDireksi(data);
    }
  }, []);

  const addDireksi = (nama: string) => {
    const newDireksi = { id: Date.now(), nama };
    const updated = [...direksi, newDireksi];
    setDireksi(updated);
    localStorage.setItem("direksi", JSON.stringify(updated));
  };

  const editDireksi = (id: number, nama: string) => {
    const updated = direksi.map((d) => (d.id === id ? { ...d, nama } : d));
    setDireksi(updated);
    localStorage.setItem("direksi", JSON.stringify(updated));
  };

  const deleteDireksi = (id: number) => {
    const updated = direksi.filter((d) => d.id !== id);
    setDireksi(updated);
    localStorage.setItem("direksi", JSON.stringify(updated));
  };

  return (
    <DireksiContext.Provider value={{ direksi, addDireksi, editDireksi, deleteDireksi }}>
      {children}
    </DireksiContext.Provider>
  );
};

export const useDireksi = () => {
  const ctx = useContext(DireksiContext);
  if (!ctx) throw new Error("useDireksi must be used within DireksiProvider");
  return ctx;
}; 