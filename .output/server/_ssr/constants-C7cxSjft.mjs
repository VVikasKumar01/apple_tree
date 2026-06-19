import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
function inr(n) {
  const v = Number(n ?? 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}
function currentAcademicYear() {
  const d = /* @__PURE__ */ new Date();
  const y = d.getMonth() >= 5 ? d.getFullYear() : d.getFullYear() - 1;
  return `${y}-${String(y + 1).slice(-2)}`;
}
const AcademicYearContext = reactExports.createContext(void 0);
function AcademicYearProvider({ children }) {
  const [year, setYearState] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selected_academic_year");
      if (saved) return saved;
    }
    return currentAcademicYear();
  });
  const setYear = (y) => {
    setYearState(y);
    if (typeof window !== "undefined") {
      localStorage.setItem("selected_academic_year", y);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AcademicYearContext.Provider, { value: { year, setYear }, children });
}
function useAcademicYear() {
  const ctx = reactExports.useContext(AcademicYearContext);
  if (!ctx) throw new Error("useAcademicYear must be used within AcademicYearProvider");
  return ctx;
}
const CLASS_OPTIONS = ["Nursery", "LKG", "UKG"];
const GENDER_OPTIONS = ["Male", "Female"];
const ACADEMIC_YEARS = (() => {
  const out = [];
  for (let y = 2019; y <= 2030; y++) out.push(`${y}-${String(y + 1).slice(-2)}`);
  return out;
})();
export {
  AcademicYearProvider as A,
  CLASS_OPTIONS as C,
  GENDER_OPTIONS as G,
  ACADEMIC_YEARS as a,
  inr as i,
  useAcademicYear as u
};
