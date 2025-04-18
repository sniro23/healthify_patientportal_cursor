
/**
 * FHIR Resource Types
 * Based on FHIR R4 (v4.0.1) standards
 * https://www.hl7.org/fhir/resourcelist.html
 */

// Common FHIR elements
export interface FhirResource {
  resourceType: string;
  id?: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    source?: string;
    profile?: string[];
  };
}

// Patient FHIR Resource
export interface FhirPatient extends FhirResource {
  resourceType: 'Patient';
  active?: boolean;
  name?: Array<{
    use?: 'official' | 'usual' | 'nickname' | 'anonymous' | 'old' | 'maiden';
    text?: string;
    family?: string;
    given?: string[];
    prefix?: string[];
    suffix?: string[];
  }>;
  telecom?: Array<{
    system?: 'phone' | 'email' | 'fax' | 'pager' | 'url' | 'sms' | 'other';
    value?: string;
    use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  }>;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: string;
  address?: Array<{
    use?: 'home' | 'work' | 'temp' | 'old' | 'billing';
    type?: 'postal' | 'physical' | 'both';
    text?: string;
    line?: string[];
    city?: string;
    district?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }>;
  maritalStatus?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  contact?: Array<any>; // Simplified for brevity
}

// Condition FHIR Resource
export interface FhirCondition extends FhirResource {
  resourceType: 'Condition';
  clinicalStatus?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
  verificationStatus?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  };
  code?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  subject: {
    reference: string;
    type?: string;
  };
  onsetDateTime?: string;
  recordedDate?: string;
}

// Medication FHIR Resource
export interface FhirMedication extends FhirResource {
  resourceType: 'Medication';
  code?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  status?: 'active' | 'inactive' | 'entered-in-error';
  form?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
}

// MedicationStatement FHIR Resource
export interface FhirMedicationStatement extends FhirResource {
  resourceType: 'MedicationStatement';
  status: 'active' | 'completed' | 'entered-in-error' | 'intended' | 'stopped' | 'on-hold' | 'unknown' | 'not-taken';
  medicationCodeableConcept?: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  medicationReference?: {
    reference: string;
    type?: string;
  };
  subject: {
    reference: string;
    type?: string;
  };
  effectivePeriod?: {
    start?: string;
    end?: string;
  };
  dateAsserted?: string;
  dosage?: Array<{
    text?: string;
    timing?: {
      code?: {
        coding?: Array<{
          system?: string;
          code?: string;
          display?: string;
        }>;
        text?: string;
      };
    };
    doseAndRate?: Array<{
      doseQuantity?: {
        value?: number;
        unit?: string;
        system?: string;
        code?: string;
      };
    }>;
  }>;
}

// Observation FHIR Resource (for lab results)
export interface FhirObservation extends FhirResource {
  resourceType: 'Observation';
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: Array<{
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
  }>;
  code: {
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  };
  subject: {
    reference: string;
    type?: string;
  };
  effectiveDateTime?: string;
  valueQuantity?: {
    value?: number;
    unit?: string;
    system?: string;
    code?: string;
  };
  valueString?: string;
  valueBoolean?: boolean;
  interpretation?: Array<{
    coding?: Array<{
      system?: string;
      code?: string;
      display?: string;
    }>;
    text?: string;
  }>;
  referenceRange?: Array<{
    low?: {
      value?: number;
      unit?: string;
    };
    high?: {
      value?: number;
      unit?: string;
    };
    text?: string;
  }>;
}

// New types for Lab Reports and Health Metrics
export interface LabTestResult {
  testId: string;
  testName: string;
  value: string | number;
  unit: string;
  date?: string;
  isAbnormal?: boolean;
  referenceRange?: {
    low?: number;
    high?: number;
    text?: string;
  };
}

export interface LabReport {
  id: string;
  name: string;
  date: string;
  status: 'normal' | 'abnormal' | 'pending';
  fileUrl?: string;
  testResults?: LabTestResult[];
}

export interface MetricReading {
  id: string;
  date: string;
  value: number;
}

export interface MetricData {
  name: string;
  unit: string;
  normal_range?: {
    min: number;
    max: number;
  };
  readings: MetricReading[];
}

export interface PersonalInfo {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  bloodType?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface VitalsInfo {
  id?: string;
  height: number;
  weight: number;
  bmi?: number;
  blood_pressure?: {
    systolic: number;
    diastolic: number;
  };
  heart_rate?: number;
  temperature?: number;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  last_updated?: string;
}

export interface LifestyleInfo {
  id?: string;
  activity_level: "Sedentary" | "Light" | "Moderate" | "Active";
  smoking_status: "Never" | "Former" | "Current";
  alcohol_consumption: "None" | "Occasionally" | "Regularly" | "Frequently";
}

// Convert our app data to FHIR format
export function toFhirPatient(patientData: any): FhirPatient {
  return {
    resourceType: 'Patient',
    id: patientData.id || undefined,
    active: true,
    name: [
      {
        use: 'official',
        family: patientData.lastName || '',
        given: patientData.firstName ? [patientData.firstName] : [],
        text: `${patientData.firstName || ''} ${patientData.lastName || ''}`.trim(),
      },
    ],
    gender: patientData.gender as 'male' | 'female' | 'other' | 'unknown',
    birthDate: patientData.dateOfBirth,
    address: patientData.address
      ? [
          {
            use: 'home',
            type: 'physical',
            line: [patientData.address],
            city: patientData.city || '',
            state: patientData.state || '',
            postalCode: patientData.postalCode || '',
            country: patientData.country || '',
          },
        ]
      : undefined,
    telecom: [
      patientData.phone && {
        system: 'phone',
        value: patientData.phone,
        use: 'mobile',
      },
      patientData.email && {
        system: 'email',
        value: patientData.email,
        use: 'home',
      },
    ].filter(Boolean) as any[],
    maritalStatus: patientData.maritalStatus
      ? {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-MaritalStatus',
              code: patientData.maritalStatus.toLowerCase(),
              display: patientData.maritalStatus,
            },
          ],
          text: patientData.maritalStatus,
        }
      : undefined,
  };
}

export function toFhirCondition(conditionData: any, patientId: string): FhirCondition {
  return {
    resourceType: 'Condition',
    id: conditionData.id || undefined,
    clinicalStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-clinical',
          code: 'active',
          display: 'Active',
        },
      ],
    },
    verificationStatus: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
          code: 'confirmed',
          display: 'Confirmed',
        },
      ],
    },
    code: {
      coding: conditionData.code
        ? [
            {
              system: 'http://hl7.org/fhir/sid/icd-10',
              code: conditionData.code,
              display: conditionData.name,
            },
          ]
        : undefined,
      text: conditionData.name,
    },
    subject: {
      reference: `Patient/${patientId}`,
      type: 'Patient',
    },
    recordedDate: new Date().toISOString(),
  };
}

export function toFhirMedicationStatement(
  medicationData: any, 
  patientId: string
): FhirMedicationStatement {
  return {
    resourceType: 'MedicationStatement',
    id: medicationData.id || undefined,
    status: medicationData.status || 'active',
    medicationCodeableConcept: {
      text: medicationData.name,
    },
    subject: {
      reference: `Patient/${patientId}`,
      type: 'Patient',
    },
    effectivePeriod: {
      start: medicationData.startDate,
      end: medicationData.endDate,
    },
    dateAsserted: new Date().toISOString(),
    dosage: [
      {
        text: `${medicationData.dosage} ${medicationData.frequency}`,
        doseAndRate: [
          {
            doseQuantity: {
              value: parseFloat(medicationData.dosage),
              unit: medicationData.dosage.replace(/[\d.]/g, '').trim(),
            },
          },
        ],
      },
    ],
  };
}

// Convert lab test result data to FHIR Observation
export function toFhirObservation(observationData: any, patientId: string): FhirObservation {
  return {
    resourceType: 'Observation',
    id: observationData.id || undefined,
    status: observationData.status || 'final',
    category: observationData.category ? [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/observation-category",
            code: "laboratory",
            display: "Laboratory"
          }
        ]
      }
    ] : undefined,
    code: observationData.code || {
      coding: [],
      text: observationData.testName || "Unknown Test"
    },
    subject: {
      reference: `Patient/${patientId}`,
      type: 'Patient'
    },
    effectiveDateTime: observationData.effectiveDateTime || new Date().toISOString(),
    valueQuantity: observationData.valueQuantity,
    valueString: observationData.valueString,
    referenceRange: observationData.referenceRange
  };
}
