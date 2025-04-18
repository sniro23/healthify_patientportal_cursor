import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { 
  ProviderType,
  ConsultationType,
  DeliveryMethod,
  MedicalSpecialty,
  AppointmentStatus
} from '@/lib/models/appointment';

// Database interface (snake_case)
interface DbAppointment {
  id: string;
  patient_id: string;
  provider_type: string;
  specialty: string | null;
  consultation_type: string;
  delivery_method: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Application interface (camelCase)
export interface Appointment {
  id: string;
  patientId: string;
  providerType: ProviderType;
  specialty?: MedicalSpecialty;
  consultationType: ConsultationType;
  deliveryMethod: DeliveryMethod;
  scheduledDate: string;
  scheduledTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewAppointment {
  providerType: ProviderType;
  specialty?: MedicalSpecialty;
  consultationType: ConsultationType;
  deliveryMethod: DeliveryMethod;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
}

// Helper functions to transform between database and application formats
const toDbFormat = (appointment: NewAppointment | Partial<Appointment>): Partial<DbAppointment> => {
  return {
    provider_type: appointment.providerType,
    specialty: appointment.specialty || null,
    consultation_type: appointment.consultationType,
    delivery_method: appointment.deliveryMethod,
    scheduled_date: appointment.scheduledDate,
    scheduled_time: appointment.scheduledTime,
    notes: appointment.notes || null
  };
};

const toAppFormat = (dbAppointment: DbAppointment): Appointment => {
  return {
    id: dbAppointment.id,
    patientId: dbAppointment.patient_id,
    providerType: dbAppointment.provider_type as ProviderType,
    specialty: dbAppointment.specialty as MedicalSpecialty,
    consultationType: dbAppointment.consultation_type as ConsultationType,
    deliveryMethod: dbAppointment.delivery_method as DeliveryMethod,
    scheduledDate: dbAppointment.scheduled_date,
    scheduledTime: dbAppointment.scheduled_time,
    status: dbAppointment.status as AppointmentStatus,
    notes: dbAppointment.notes || undefined,
    createdAt: dbAppointment.created_at,
    updatedAt: dbAppointment.updated_at
  };
};

export const useAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('patient_id', user.id)
          .order('scheduled_date', { ascending: true });

        if (error) {
          console.error('Error fetching appointments:', error);
          toast({
            title: "Error",
            description: "Could not fetch appointments",
            variant: "destructive"
          });
          setAppointments([]);
        } else {
          setAppointments(data.map(toAppFormat));
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, toast]);

  const createAppointment = async (appointmentData: NewAppointment) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book an appointment",
        variant: "destructive"
      });
      return null;
    }

    try {
      // First, check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, create it with just the id
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (createProfileError) {
          throw createProfileError;
        }
      }

      const newAppointment = {
        patient_id: user.id,
        provider_type: appointmentData.providerType,
        specialty: appointmentData.specialty || null,
        consultation_type: appointmentData.consultationType,
        delivery_method: appointmentData.deliveryMethod,
        scheduled_date: appointmentData.scheduledDate,
        scheduled_time: appointmentData.scheduledTime,
        status: 'Confirmed',
        notes: appointmentData.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert(newAppointment)
        .select()
        .single();

      if (error) {
        console.error('Error creating appointment:', error);
        toast({
          title: "Booking failed",
          description: "Could not book your appointment",
          variant: "destructive"
        });
        return null;
      }

      const createdAppointment = toAppFormat(data as DbAppointment);
      setAppointments(prevAppointments => [...prevAppointments, createdAppointment]);
      
      toast({
        title: "Appointment booked",
        description: "Your appointment has been scheduled successfully"
      });
      
      return createdAppointment;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Booking failed",
        description: "An unexpected error occurred while booking your appointment",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    if (!user) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(toDbFormat(updates))
        .eq('id', id)
        .eq('patient_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating appointment:', error);
        toast({
          title: "Update failed",
          description: "Could not update your appointment",
          variant: "destructive"
        });
        return null;
      }

      const updatedAppointment = toAppFormat(data as DbAppointment);
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? updatedAppointment : appointment
        )
      );
      
      toast({
        title: "Appointment updated",
        description: "Your appointment has been updated successfully"
      });
      
      return updatedAppointment;
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  };

  const cancelAppointment = async (id: string) => {
    if (!user) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'Cancelled' })
        .eq('id', id)
        .eq('patient_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error cancelling appointment:', error);
        toast({
          title: "Cancellation failed",
          description: "Could not cancel your appointment",
          variant: "destructive"
        });
        return false;
      }

      const cancelledAppointment = toAppFormat(data as DbAppointment);
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? cancelledAppointment : appointment
        )
      );
      
      toast({
        title: "Appointment cancelled",
        description: "Your appointment has been cancelled successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      return false;
    }
  };

  const getAppointmentById = async (id: string) => {
    if (!user) {
      return null;
    }

    try {
      const existingAppointment = appointments.find(a => a.id === id);
      if (existingAppointment) {
        return existingAppointment;
      }

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .eq('patient_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching appointment:', error);
        return null;
      }

      return toAppFormat(data as DbAppointment);
    } catch (error) {
      console.error('Unexpected error:', error);
      return null;
    }
  };

  const getUpcomingAppointment = () => {
    if (!appointments.length) {
      return null;
    }

    const now = new Date();
    return appointments
      .filter(appointment => 
        appointment.status === 'Confirmed' && 
        new Date(`${appointment.scheduledDate}T${appointment.scheduledTime.split(' - ')[0]}`) > now
      )
      .sort((a, b) => 
        new Date(`${a.scheduledDate}T${a.scheduledTime.split(' - ')[0]}`).getTime() - 
        new Date(`${b.scheduledDate}T${b.scheduledTime.split(' - ')[0]}`).getTime()
      )[0];
  };

  return { 
    appointments, 
    createAppointment, 
    updateAppointment, 
    cancelAppointment, 
    getAppointmentById,
    getUpcomingAppointment,
    isLoading 
  };
};
