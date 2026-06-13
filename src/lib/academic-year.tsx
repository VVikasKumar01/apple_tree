import { createContext, useContext, useState, type ReactNode } from "react";
import { currentAcademicYear } from "@/lib/types";

interface AcademicYearCtx {
  year: string;
  setYear: (y: string) => void;
}

const AcademicYearContext = createContext<AcademicYearCtx | undefined>(undefined);

export function AcademicYearProvider({ children }: { children: ReactNode }) {
  const [year, setYearState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selected_academic_year");
      if (saved) return saved;
    }
    return currentAcademicYear();
  });

  const setYear = (y: string) => {
    setYearState(y);
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_academic_year", y);
    }
  };

  return (
    <AcademicYearContext.Provider value={{ year, setYear }}>
      {children}
    </AcademicYearContext.Provider>
  );
}

export function useAcademicYear() {
  const ctx = useContext(AcademicYearContext);
  if (!ctx) throw new Error("useAcademicYear must be used within AcademicYearProvider");
  return ctx;
}
