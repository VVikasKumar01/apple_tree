export const CLASS_OPTIONS = ["Nursery", "LKG", "UKG"] as const;
export type ClassOption = (typeof CLASS_OPTIONS)[number];

export const GENDER_OPTIONS = ["Male", "Female"] as const;

export const ACADEMIC_YEARS = (() => {
  const out: string[] = [];
  for (let y = 2019; y <= 2030; y++) out.push(`${y}-${String(y + 1).slice(-2)}`);
  return out;
})();
