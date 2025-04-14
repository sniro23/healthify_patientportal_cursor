
// Common laboratory tests with reference ranges
export interface LabTestDefinition {
  id: string;
  name: string;
  shortName?: string;
  category: string;
  unit: string;
  referenceRange: {
    low?: number;
    high?: number;
    text?: string;
  };
  loincCode?: string; // LOINC code for interoperability
}

export const commonLabTests: LabTestDefinition[] = [
  {
    id: "lab1",
    name: "Hemoglobin",
    shortName: "Hgb",
    category: "Hematology",
    unit: "g/dL",
    referenceRange: {
      low: 12.0,
      high: 15.5,
      text: "12.0-15.5 g/dL (female), 13.5-17.5 g/dL (male)"
    },
    loincCode: "718-7"
  },
  {
    id: "lab2",
    name: "White Blood Cell Count",
    shortName: "WBC",
    category: "Hematology",
    unit: "x10^9/L",
    referenceRange: {
      low: 4.5,
      high: 11.0,
    },
    loincCode: "6690-2"
  },
  {
    id: "lab3",
    name: "Platelets",
    shortName: "PLT",
    category: "Hematology",
    unit: "x10^9/L",
    referenceRange: {
      low: 150,
      high: 450,
    },
    loincCode: "777-3"
  },
  {
    id: "lab4",
    name: "Fasting Blood Glucose",
    shortName: "FBS",
    category: "Chemistry",
    unit: "mg/dL",
    referenceRange: {
      low: 70,
      high: 100,
    },
    loincCode: "1558-6"
  },
  {
    id: "lab5",
    name: "Hemoglobin A1c",
    shortName: "HbA1c",
    category: "Chemistry",
    unit: "%",
    referenceRange: {
      high: 5.7,
      text: "< 5.7% (normal), 5.7-6.4% (prediabetes), ≥ 6.5% (diabetes)"
    },
    loincCode: "4548-4"
  },
  {
    id: "lab6",
    name: "Total Cholesterol",
    category: "Lipid Panel",
    unit: "mg/dL",
    referenceRange: {
      high: 200,
      text: "< 200 mg/dL (desirable)"
    },
    loincCode: "2093-3"
  },
  {
    id: "lab7",
    name: "HDL Cholesterol",
    shortName: "HDL",
    category: "Lipid Panel",
    unit: "mg/dL",
    referenceRange: {
      low: 40,
      text: "> 40 mg/dL (desirable)"
    },
    loincCode: "2085-9"
  },
  {
    id: "lab8",
    name: "LDL Cholesterol",
    shortName: "LDL",
    category: "Lipid Panel",
    unit: "mg/dL",
    referenceRange: {
      high: 100,
      text: "< 100 mg/dL (optimal)"
    },
    loincCode: "13457-7"
  },
  {
    id: "lab9",
    name: "Triglycerides",
    category: "Lipid Panel",
    unit: "mg/dL",
    referenceRange: {
      high: 150,
      text: "< 150 mg/dL (normal)"
    },
    loincCode: "2571-8"
  },
  {
    id: "lab10",
    name: "Alanine Aminotransferase",
    shortName: "ALT",
    category: "Liver Function",
    unit: "U/L",
    referenceRange: {
      low: 7,
      high: 55,
      text: "7-55 U/L (male), 7-45 U/L (female)"
    },
    loincCode: "1742-6"
  },
  {
    id: "lab11",
    name: "Aspartate Aminotransferase",
    shortName: "AST",
    category: "Liver Function",
    unit: "U/L",
    referenceRange: {
      low: 8,
      high: 48,
      text: "8-48 U/L (male), 8-43 U/L (female)"
    },
    loincCode: "1920-8"
  },
  {
    id: "lab12",
    name: "Creatinine",
    category: "Kidney Function",
    unit: "mg/dL",
    referenceRange: {
      low: 0.6,
      high: 1.2,
      text: "0.6-1.2 mg/dL (male), 0.5-1.1 mg/dL (female)"
    },
    loincCode: "2160-0"
  },
  {
    id: "lab13",
    name: "Blood Urea Nitrogen",
    shortName: "BUN",
    category: "Kidney Function",
    unit: "mg/dL",
    referenceRange: {
      low: 7,
      high: 20,
    },
    loincCode: "3094-0"
  },
  {
    id: "lab14",
    name: "Estimated Glomerular Filtration Rate",
    shortName: "eGFR",
    category: "Kidney Function",
    unit: "mL/min/1.73m²",
    referenceRange: {
      low: 60,
      text: ">60 mL/min/1.73m² (normal)"
    },
    loincCode: "33914-3"
  },
  {
    id: "lab15",
    name: "Thyroid Stimulating Hormone",
    shortName: "TSH",
    category: "Endocrine",
    unit: "mIU/L",
    referenceRange: {
      low: 0.4,
      high: 4.0,
    },
    loincCode: "3016-3"
  }
];

export function searchLabTests(query: string): LabTestDefinition[] {
  if (!query || query.length < 2) return [];
  
  const lowerCaseQuery = query.toLowerCase();
  
  return commonLabTests.filter(
    test => 
      test.name.toLowerCase().includes(lowerCaseQuery) || 
      (test.shortName && test.shortName.toLowerCase().includes(lowerCaseQuery)) ||
      (test.loincCode && test.loincCode.toLowerCase().includes(lowerCaseQuery))
  );
}

export function getLabTestById(id: string): LabTestDefinition | undefined {
  return commonLabTests.find(test => test.id === id);
}
