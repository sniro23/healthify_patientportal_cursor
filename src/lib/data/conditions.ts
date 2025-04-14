
// Common medical conditions with ICD-10 codes
export interface ConditionOption {
  id: string;
  name: string;
  code: string; // ICD-10 code
  category?: string;
}

export const commonConditions: ConditionOption[] = [
  {
    id: "cond1",
    name: "Hypertension",
    code: "I10",
    category: "Cardiovascular"
  },
  {
    id: "cond2",
    name: "Type 2 Diabetes Mellitus",
    code: "E11.9",
    category: "Endocrine"
  },
  {
    id: "cond3",
    name: "Asthma, unspecified",
    code: "J45.909",
    category: "Respiratory"
  },
  {
    id: "cond4",
    name: "Major depressive disorder",
    code: "F32.9",
    category: "Mental Health"
  },
  {
    id: "cond5",
    name: "Hyperlipidemia",
    code: "E78.5",
    category: "Metabolic"
  },
  {
    id: "cond6",
    name: "Gastroesophageal reflux disease",
    code: "K21.9",
    category: "Gastrointestinal"
  },
  {
    id: "cond7",
    name: "Osteoarthritis",
    code: "M19.90",
    category: "Musculoskeletal"
  },
  {
    id: "cond8",
    name: "Hypothyroidism",
    code: "E03.9",
    category: "Endocrine"
  },
  {
    id: "cond9",
    name: "Chronic obstructive pulmonary disease",
    code: "J44.9",
    category: "Respiratory"
  },
  {
    id: "cond10",
    name: "Migraine",
    code: "G43.909",
    category: "Neurological"
  },
  {
    id: "cond11",
    name: "Allergic rhinitis",
    code: "J30.9",
    category: "Immunological"
  },
  {
    id: "cond12",
    name: "Atrial fibrillation",
    code: "I48.91",
    category: "Cardiovascular"
  },
];

export function searchConditions(query: string): ConditionOption[] {
  if (!query || query.length < 2) return [];
  
  const lowerCaseQuery = query.toLowerCase();
  
  return commonConditions.filter(
    condition => 
      condition.name.toLowerCase().includes(lowerCaseQuery) || 
      condition.code.toLowerCase().includes(lowerCaseQuery)
  );
}

export function getConditionById(id: string): ConditionOption | undefined {
  return commonConditions.find(condition => condition.id === id);
}
