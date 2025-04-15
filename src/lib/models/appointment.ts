
/**
 * Appointment related models and types
 */

// Provider Types
export type ProviderType = 'Doctor' | 'Physiotherapist' | 'Mental Health Therapist' | 'Life Coach';

// Consultation Types
export type ConsultationType = 'Urgent' | 'Scheduled';

// Delivery Method
export type DeliveryMethod = 'Text' | 'Audio' | 'Video';

// Medical Specialties
export type MedicalSpecialty = 
  'General Medicine' | 
  'Cardiology' | 
  'Dermatology' | 
  'Endocrinology' | 
  'Gastroenterology' |
  'Neurology' | 
  'Obstetrics & Gynecology' | 
  'Oncology' | 
  'Ophthalmology' | 
  'Orthopedics' |
  'Pediatrics' | 
  'Psychiatry' | 
  'Pulmonology' | 
  'Rheumatology' | 
  'Urology';

// Appointment Status
export type AppointmentStatus = 
  'Pending' | 
  'Confirmed' | 
  'Cancelled' | 
  'Completed' | 
  'No-Show' | 
  'Rescheduled';

// Appointment Interface
export interface Appointment {
  id: string;
  patientId: string;
  providerType: ProviderType;
  consultationType: ConsultationType;
  deliveryMethod: DeliveryMethod;
  specialty?: MedicalSpecialty;
  status: AppointmentStatus;
  scheduledDate?: string;
  scheduledTime?: string;
  duration: number; // in minutes
  assignedDoctorId?: string;
  notes?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

// Time Slot Interface
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  doctorId?: string;
  specialty?: MedicalSpecialty;
}

// Define available specialties with their descriptions
export const specialties: Array<{value: MedicalSpecialty, label: string, description?: string}> = [
  { value: 'General Medicine', label: 'General Medicine', description: 'Primary healthcare for adults' },
  { value: 'Cardiology', label: 'Cardiology', description: 'Heart and cardiovascular system' },
  { value: 'Dermatology', label: 'Dermatology', description: 'Skin, hair, and nail conditions' },
  { value: 'Endocrinology', label: 'Endocrinology', description: 'Hormones and metabolic diseases' },
  { value: 'Gastroenterology', label: 'Gastroenterology', description: 'Digestive system disorders' },
  { value: 'Neurology', label: 'Neurology', description: 'Brain, spinal cord, and nerve disorders' },
  { value: 'Obstetrics & Gynecology', label: 'Obstetrics & Gynecology', description: "Women's reproductive health" },
  { value: 'Oncology', label: 'Oncology', description: 'Cancer diagnosis and treatment' },
  { value: 'Ophthalmology', label: 'Ophthalmology', description: 'Eye diseases and disorders' },
  { value: 'Orthopedics', label: 'Orthopedics', description: 'Bone and joint conditions' },
  { value: 'Pediatrics', label: 'Pediatrics', description: "Children's healthcare" },
  { value: 'Psychiatry', label: 'Psychiatry', description: 'Mental health disorders' },
  { value: 'Pulmonology', label: 'Pulmonology', description: 'Respiratory system diseases' },
  { value: 'Rheumatology', label: 'Rheumatology', description: 'Autoimmune and inflammatory disorders' },
  { value: 'Urology', label: 'Urology', description: 'Urinary tract and reproductive health' }
];

// Define provider types with descriptions
export const providerTypes = [
  { value: 'Doctor', label: 'Doctor', description: 'Medical doctor consultation' },
  { value: 'Physiotherapist', label: 'Physiotherapist', description: 'Physical therapy specialist' },
  { value: 'Mental Health Therapist', label: 'Mental Health Therapist', description: 'Mental health counseling and therapy' },
  { value: 'Life Coach', label: 'Life Coach', description: 'Personal development and goal achievement' }
];

// Define consultation types with descriptions
export const consultationTypes = [
  { value: 'Urgent', label: 'Urgent', description: 'Immediate consultation with available provider' },
  { value: 'Scheduled', label: 'Scheduled', description: 'Book appointment for a future date and time' }
];

// Define delivery methods with descriptions
export const deliveryMethods = [
  { value: 'Text', label: 'Text Chat', description: 'Text-based consultation' },
  { value: 'Audio', label: 'Audio Call', description: 'Voice call consultation' },
  { value: 'Video', label: 'Video Call', description: 'Video conference consultation' }
];

// Generate time slots for a given date
export function generateTimeSlots(date: Date, intervalMinutes: number = 30): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = 8; // 8:00 AM
  const endHour = 20; // 8:00 PM
  
  const startDate = new Date(date);
  startDate.setHours(startHour, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(endHour, 0, 0, 0);
  
  let currentTime = new Date(startDate);
  
  while (currentTime < endDate) {
    const startTime = new Date(currentTime);
    
    // Increment by interval
    currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    
    const endTime = new Date(currentTime);
    
    slots.push({
      id: `slot-${startTime.toISOString()}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      isAvailable: Math.random() > 0.3, // Randomly set availability for demo
      doctorId: undefined
    });
  }
  
  return slots;
}
