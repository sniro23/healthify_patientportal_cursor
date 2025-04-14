
/**
 * FHIR Condition Resource Type
 * Based on FHIR R4 (v4.0.1) standards
 * https://www.hl7.org/fhir/condition.html
 */

import { FhirResource, FhirCodeableConcept, FhirReference } from './base';

// Condition FHIR Resource
export interface FhirCondition extends FhirResource {
  resourceType: 'Condition';
  clinicalStatus?: FhirCodeableConcept;
  verificationStatus?: FhirCodeableConcept;
  code?: FhirCodeableConcept;
  subject: FhirReference;
  onsetDateTime?: string;
  recordedDate?: string;
}

// Convert our app data to FHIR format
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
