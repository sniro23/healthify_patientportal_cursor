
/**
 * FHIR Observation Resource Type
 * Based on FHIR R4 (v4.0.1) standards
 * https://www.hl7.org/fhir/observation.html
 */

import { FhirResource, FhirCodeableConcept, FhirReference, FhirQuantity } from './base';

// Observation FHIR Resource (for lab results)
export interface FhirObservation extends FhirResource {
  resourceType: 'Observation';
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: Array<FhirCodeableConcept>;
  code: FhirCodeableConcept;
  subject: FhirReference;
  effectiveDateTime?: string;
  valueQuantity?: FhirQuantity;
  valueString?: string;
  valueBoolean?: boolean;
  interpretation?: Array<FhirCodeableConcept>;
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
