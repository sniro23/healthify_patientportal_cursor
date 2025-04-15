import { Appointment, TimeSlot, AppointmentStatus } from "@/lib/models/appointment";
import { supabase } from "@/lib/supabase";

export class AppointmentService {
  static async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        ...appointment,
        status: 'Pending' as AppointmentStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw new Error(`Failed to create appointment: ${error.message}`);
    return data;
  }

  static async getAppointments(patientId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patientId', patientId)
      .order('scheduledDate', { ascending: true });

    if (error) throw new Error(`Failed to fetch appointments: ${error.message}`);
    return data;
  }

  static async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ 
        status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update appointment status: ${error.message}`);
    return data;
  }

  static async getAvailableTimeSlots(date: string, specialty?: string): Promise<TimeSlot[]> {
    const { data: existingAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('scheduledDate, scheduledTime')
      .eq('scheduledDate', date)
      .eq('status', 'Confirmed');

    if (appointmentsError) throw new Error(`Failed to fetch existing appointments: ${appointmentsError.message}`);

    const { data: doctorSchedules, error: scheduleError } = await supabase
      .from('doctor_schedules')
      .select('*')
      .eq('date', date)
      .eq('specialty', specialty);

    if (scheduleError) throw new Error(`Failed to fetch doctor schedules: ${scheduleError.message}`);

    // Generate time slots based on doctor schedules and existing appointments
    const timeSlots: TimeSlot[] = [];
    const startHour = 8; // 8:00 AM
    const endHour = 20; // 8:00 PM
    const intervalMinutes = 30;

    for (const schedule of doctorSchedules) {
      let currentTime = new Date(date);
      currentTime.setHours(startHour, 0, 0, 0);

      while (currentTime.getHours() < endHour) {
        const startTime = new Date(currentTime);
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
        const endTime = new Date(currentTime);

        // Check if this slot is already booked
        const isBooked = existingAppointments.some(
          (appointment) => appointment.scheduledTime === startTime.toISOString()
        );

        timeSlots.push({
          id: `slot-${startTime.toISOString()}-${schedule.doctorId}`,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          isAvailable: !isBooked,
          doctorId: schedule.doctorId,
          specialty: schedule.specialty
        });
      }
    }

    return timeSlots;
  }

  static async cancelAppointment(appointmentId: string): Promise<Appointment> {
    return this.updateAppointmentStatus(appointmentId, 'Cancelled');
  }

  static async rescheduleAppointment(
    appointmentId: string, 
    newDate: string, 
    newTime: string
  ): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ 
        scheduledDate: newDate,
        scheduledTime: newTime,
        status: 'Rescheduled' as AppointmentStatus,
        updatedAt: new Date().toISOString()
      })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw new Error(`Failed to reschedule appointment: ${error.message}`);
    return data;
  }
} 