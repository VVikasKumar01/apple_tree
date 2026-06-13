const CLASS_OPTIONS = ["Nursery", "LKG", "UKG"];
const GENDER_OPTIONS = ["Male", "Female"];
const ACADEMIC_YEARS = (() => {
  const out = [];
  for (let y = 2019; y <= 2030; y++) out.push(`${y}-${String(y + 1).slice(-2)}`);
  return out;
})();
export {
  ACADEMIC_YEARS as A,
  CLASS_OPTIONS as C,
  GENDER_OPTIONS as G
};
