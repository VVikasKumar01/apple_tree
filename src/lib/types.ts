// Shared types and small helpers
export type FeeStatus = "Paid" | "Unpaid";

export interface Student {
  id: string;
  admission_number: string;
  student_name: string;
  student_aadhaar: string | null;
  gender: string | null;
  date_of_birth: string | null;
  blood_group: string | null;
  nationality: string | null;
  religion: string | null;
  caste: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  class_grade: string | null;
  section: string | null;
  academic_year: string | null;
  father_name: string | null;
  father_aadhaar: string | null;
  father_mobile: string | null;
  father_occupation: string | null;
  mother_name: string | null;
  mother_aadhaar: string | null;
  mother_mobile: string | null;
  mother_occupation: string | null;
  primary_mobile: string | null;
  emergency_contact: string | null;
  email: string | null;
  permanent_address: string | null;
  correspondence_address: string | null;
  photo_url: string | null;
  created_at: string;
}

export function inr(n: number | null | undefined) {
  const v = Number(n ?? 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

export function currentAcademicYear() {
  const d = new Date();
  const y = d.getMonth() >= 5 ? d.getFullYear() : d.getFullYear() - 1;
  return `${y}-${String(y + 1).slice(-2)}`;
}
