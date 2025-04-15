
/**
 * FHIR Appointment Resource Type
 * Based on FHIR R4 (v4.0.1) standards
 * https://www.hl7.org/fhir/appointment.html
 */

import { FhirResource, FhirReference, FhirCodeableConcept } from './base';

// Participant status type
type ParticipantStatus = 'accepted' | 'declined' | 'tentative' | 'needs-action';

// Appointment FHIR Resource
export interface FhirAppointment extends FhirResource {
  resourceType: 'Appointment';
  status: 'proposed' | 'pending' | 'booked' | 'arrived' | 'fulfilled' | 'cancelled' | 'noshow' | 'entered-in-error';
  appointmentType?: FhirCodeableConcept;
  reasonCode?: FhirCodeableConcept[];
  start?: string;
  end?: string;
  minutesDuration?: number;
  slot?: FhirReference[];
  created?: string;
  comment?: string;
  participant: Array<{
    actor?: FhirReference;
    status: ParticipantStatus;
    type?: FhirCodeableConcept[];
  }>;
  patientInstruction?: string;
}

// Convert app data to FHIR Appointment
export function toFhirAppointment(
  appointmentData: any,
  patientId: string,
  practitionerId?: string
): FhirAppointment {
  const participants = [
    {
      actor: {
        reference: `Patient/${patientId}`,
        type: 'Patient'
      },
      status: 'accepted' as ParticipantStatus
    }
  ];

  // Add practitioner if available
  if (practitionerId) {
    participants.push({
      actor: {
        reference: `Practitioner/${practitionerId}`,
        type: 'Practitioner'
      },
      status: (appointmentData.practitionerStatus || 'needs-action') as ParticipantStatus
    });
  }

  return {
    resourceType: 'Appointment',
    id: appointmentData.id || undefined,
    status: appointmentData.status || 'proposed',
    appointmentType: appointmentData.appointmentType ? {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/appointment-type',
          code: appointmentData.appointmentType.toLowerCase(),
          display: appointmentData.appointmentType
        }
      ],
      text: appointmentData.appointmentType
    } : undefined,
    start: appointmentData.startTime,
    end: appointmentData.endTime,
    minutesDuration: appointmentData.duration,
    created: appointmentData.createdAt || new Date().toISOString(),
    comment: appointmentData.notes,
    participant: participants,
    patientInstruction: appointmentData.patientInstructions
  };
}
