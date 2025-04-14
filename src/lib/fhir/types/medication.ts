
/**
 * FHIR Medication Resource Types
 * Based on FHIR R4 (v4.0.1) standards
 * https://www.hl7.org/fhir/medication.html
 * https://www.hl7.org/fhir/medicationstatement.html
 */

import { FhirResource, FhirCodeableConcept, FhirReference, FhirPeriod } from './base';

// Medication FHIR Resource
export interface FhirMedication extends FhirResource {
  resourceType: 'Medication';
  code?: FhirCodeableConcept;
  status?: 'active' | 'inactive' | 'entered-in-error';
  form?: FhirCodeableConcept;
}

// MedicationStatement FHIR Resource
export interface FhirMedicationStatement extends FhirResource {
  resourceType: 'MedicationStatement';
  status: 'active' | 'completed' | 'entered-in-error' | 'intended' | 'stopped' | 'on-hold' | 'unknown' | 'not-taken';
  medicationCodeableConcept?: FhirCodeableConcept;
  medicationReference?: FhirReference;
  subject: FhirReference;
  effectivePeriod?: FhirPeriod;
  dateAsserted?: string;
  dosage?: Array<{
    text?: string;
    timing?: {
      code?: FhirCodeableConcept;
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

// Convert our app data to FHIR format
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
