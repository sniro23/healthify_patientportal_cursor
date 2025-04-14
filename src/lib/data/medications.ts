
// Common medications with dosage information
export interface MedicationOption {
  id: string;
  name: string;
  genericName?: string;
  commonDosages: string[];
  commonFrequencies: string[];
  category?: string;
}

export const commonMedications: MedicationOption[] = [
  {
    id: "med1",
    name: "Metformin",
    genericName: "Metformin Hydrochloride",
    commonDosages: ["500mg", "850mg", "1000mg"],
    commonFrequencies: ["Once daily", "Twice daily", "Three times daily"],
    category: "Diabetes"
  },
  {
    id: "med2",
    name: "Lisinopril",
    genericName: "Lisinopril",
    commonDosages: ["2.5mg", "5mg", "10mg", "20mg", "40mg"],
    commonFrequencies: ["Once daily"],
    category: "Hypertension"
  },
  {
    id: "med3",
    name: "Atorvastatin",
    genericName: "Atorvastatin Calcium",
    commonDosages: ["10mg", "20mg", "40mg", "80mg"],
    commonFrequencies: ["Once daily"],
    category: "Cholesterol"
  },
  {
    id: "med4",
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    commonDosages: ["250mg", "500mg", "875mg"],
    commonFrequencies: ["Every 8 hours", "Every 12 hours"],
    category: "Antibiotic"
  },
  {
    id: "med5",
    name: "Levothyroxine",
    genericName: "Levothyroxine Sodium",
    commonDosages: ["25mcg", "50mcg", "75mcg", "100mcg", "125mcg", "150mcg"],
    commonFrequencies: ["Once daily"],
    category: "Thyroid"
  },
  {
    id: "med6",
    name: "Omeprazole",
    genericName: "Omeprazole",
    commonDosages: ["10mg", "20mg", "40mg"],
    commonFrequencies: ["Once daily", "Twice daily"],
    category: "Gastrointestinal"
  },
  {
    id: "med7",
    name: "Albuterol",
    genericName: "Albuterol Sulfate",
    commonDosages: ["90mcg/puff"],
    commonFrequencies: ["As needed", "Every 4-6 hours as needed"],
    category: "Respiratory"
  },
  {
    id: "med8",
    name: "Amlodipine",
    genericName: "Amlodipine Besylate",
    commonDosages: ["2.5mg", "5mg", "10mg"],
    commonFrequencies: ["Once daily"],
    category: "Hypertension"
  },
  {
    id: "med9",
    name: "Paracetamol",
    genericName: "Acetaminophen",
    commonDosages: ["325mg", "500mg", "650mg"],
    commonFrequencies: ["Every 4-6 hours as needed", "Every 6 hours as needed"],
    category: "Pain Relief"
  },
  {
    id: "med10",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    commonDosages: ["200mg", "400mg", "600mg", "800mg"],
    commonFrequencies: ["Every 4-6 hours as needed", "Every 6-8 hours as needed", "Three times daily"],
    category: "Pain Relief/Anti-inflammatory"
  },
];

export function searchMedications(query: string): MedicationOption[] {
  if (!query || query.length < 2) return [];
  
  const lowerCaseQuery = query.toLowerCase();
  
  return commonMedications.filter(
    med => 
      med.name.toLowerCase().includes(lowerCaseQuery) || 
      (med.genericName && med.genericName.toLowerCase().includes(lowerCaseQuery))
  );
}

export function getMedicationById(id: string): MedicationOption | undefined {
  return commonMedications.find(med => med.id === id);
}
