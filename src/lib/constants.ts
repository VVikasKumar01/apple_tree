export const CLASS_OPTIONS = ["Nursery", "LKG", "UKG"] as const;
export type ClassOption = (typeof CLASS_OPTIONS)[number];

export const GENDER_OPTIONS = ["Male", "Female"] as const;

export const ACADEMIC_YEARS = (() => {
  const out: string[] = [];
  for (let y = 2012; y <= 2049; y++) out.push(`${y}-${String(y + 1).slice(-2)}`);
  return out;
})();

export const DEFAULT_GRADING_SCALE = [
  { minPercent: 90, grade: "A+" },
  { minPercent: 80, grade: "A" },
  { minPercent: 70, grade: "B+" },
  { minPercent: 60, grade: "B" },
  { minPercent: 50, grade: "C" },
  { minPercent: 35, grade: "D" },
  { minPercent: 0, grade: "E" },
];

