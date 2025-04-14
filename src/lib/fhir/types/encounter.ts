
/**
 * FHIR Encounter Resource Type
 * Based on FHIR R4 (v4.0.1) standards
 * https://www.hl7.org/fhir/encounter.html
 */

import { FhirResource, FhirReference, FhirCodeableConcept, FhirPeriod } from './base';

// Encounter FHIR Resource
export interface FhirEncounter extends FhirResource {
  resourceType: 'Encounter';
  status: 'planned' | 'arrived' | 'triaged' | 'in-progress' | 'onleave' | 'finished' | 'cancelled';
  class: {
    system: string;
    code: string;
    display: string;
  };
  type?: FhirCodeableConcept[];
  subject: FhirReference;
  participant?: Array<{
    type?: FhirCodeableConcept[];
    period?: FhirPeriod;
    individual?: FhirReference;
  }>;
  period?: FhirPeriod;
  reasonCode?: FhirCodeableConcept[];
  diagnosis?: Array<{
    condition: FhirReference;
    use?: FhirCodeableConcept;
    rank?: number;
  }>;
}

// Convert app data to FHIR Encounter
export function toFhirEncounter(
  encounterData: any,
  patientId: string,
  practitionerId?: string
): FhirEncounter {
  const participants = [];
  
  // Add practitioner if available
  if (practitionerId) {
    participants.push({
      individual: {
        reference: `Practitioner/${practitionerId}`,
        type: 'Practitioner'
      }
    });
  }

  return {
    resourceType: 'Encounter',
    id: encounterData.id || undefined,
    status: encounterData.status || 'planned',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: encounterData.encounterClass || 'AMB',
      display: encounterData.encounterClassDisplay || 'Ambulatory'
    },
    subject: {
      reference: `Patient/${patientId}`,
      type: 'Patient'
    },
    participant: participants.length > 0 ? participants : undefined,
    period: {
      start: encounterData.startTime,
      end: encounterData.endTime
    },
    reasonCode: encounterData.reason ? [
      {
        text: encounterData.reason
      }
    ] : undefined
  };
}
