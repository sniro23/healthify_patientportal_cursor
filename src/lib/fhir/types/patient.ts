
/**
 * FHIR Patient Resource Type
 * Based on FHIR R4 (v4.0.1) standards
 * https://www.hl7.org/fhir/patient.html
 */

import { FhirResource, FhirCodeableConcept } from './base';

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
  maritalStatus?: FhirCodeableConcept;
  contact?: Array<any>; // Simplified for brevity
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
