
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  instructions?: string;
  prescribedBy?: string;
  prescriptionId?: string;
  userId: string;
  createdAt: Date;
  isRoutine: boolean; // true = self-reported, false = prescribed
}
