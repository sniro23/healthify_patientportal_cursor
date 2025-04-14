
/**
 * FHIR Base Resource Types
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

// Common FHIR Coding element
export interface FhirCoding {
  system?: string;
  code?: string;
  display?: string;
}

// Common FHIR CodeableConcept element
export interface FhirCodeableConcept {
  coding?: Array<FhirCoding>;
  text?: string;
}

// Common FHIR Reference element
export interface FhirReference {
  reference: string;
  type?: string;
}

// Common FHIR Quantity element
export interface FhirQuantity {
  value?: number;
  unit?: string;
  system?: string;
  code?: string;
}

// Common FHIR Period element
export interface FhirPeriod {
  start?: string;
  end?: string;
}
