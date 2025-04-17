
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface Appointment {
  id: string;
  user_id: string;
  provider_type: string;
  specialty?: string;
  consultation_type: string;
  delivery_method: string;
  date: string;
  time_slot: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface NewAppointment {
  provider_type: string;
  specialty?: string;
  consultation_type: string;
  delivery_method: string;
  date: string;
  time_slot: string;
  notes?: string;
}

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
          .eq('user_id', user.id)
          .order('date', { ascending: true });

        if (error) {
          console.error('Error fetching appointments:', error);
          toast({
            title: "Error",
            description: "Could not fetch appointments",
            variant: "destructive"
          });
        } else {
          setAppointments(data || []);
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
      const newAppointment = {
        ...appointmentData,
        user_id: user.id,
        status: 'scheduled' as const
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

      // Add the new appointment to the local state
      setAppointments([...appointments, data]);
      
      toast({
        title: "Appointment booked",
        description: "Your appointment has been scheduled successfully"
      });
      
      return data;
    } catch (error) {
      console.error('Unexpected error:', error);
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
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
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

      // Update the appointment in the local state
      setAppointments(
        appointments.map(appointment => 
          appointment.id === id ? data : appointment
        )
      );
      
      toast({
        title: "Appointment updated",
        description: "Your appointment has been updated successfully"
      });
      
      return data;
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
        .update({ status: 'cancelled' })
        .eq('id', id)
        .eq('user_id', user.id)
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

      // Update the appointment in the local state
      setAppointments(
        appointments.map(appointment => 
          appointment.id === id ? data : appointment
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
      // First check if we already have it in state
      const existingAppointment = appointments.find(a => a.id === id);
      if (existingAppointment) {
        return existingAppointment;
      }

      // If not, fetch from API
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching appointment:', error);
        return null;
      }

      return data;
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
    const upcoming = appointments
      .filter(appointment => 
        appointment.status === 'scheduled' && 
        new Date(`${appointment.date}T${appointment.time_slot.split(' - ')[0]}`) > now
      )
      .sort((a, b) => 
        new Date(`${a.date}T${a.time_slot.split(' - ')[0]}`).getTime() - 
        new Date(`${b.date}T${b.time_slot.split(' - ')[0]}`).getTime()
      );

    return upcoming.length > 0 ? upcoming[0] : null;
  };

  return {
    appointments,
    isLoading,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    getAppointmentById,
    getUpcomingAppointment
  };
};
