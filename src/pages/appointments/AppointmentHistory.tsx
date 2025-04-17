
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useAppointments } from "@/lib/hooks/useAppointments";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import LoadingSpinner from "@/components/ui/loading-spinner";

const AppointmentHistory = () => {
  const { appointments, isLoading } = useAppointments();
  const [activeTab, setActiveTab] = useState("upcoming");
  const navigate = useNavigate();
  
  const handleBookNew = () => {
    navigate("/appointments/book");
  };
  
  const formatAppointmentDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Map delivery method to the expected type in the AppointmentCard component
  const mapDeliveryMethodToType = (method: string): "audio" | "video" | "text" | "in-person" => {
    switch (method) {
      case "video": return "video";
      case "chat": return "text"; // Map chat to text as it's expected by AppointmentCard
      case "in-person": return "in-person";
      default: return "text"; // Default fallback
    }
  };
  
  if (isLoading) {
    return (
      <PageContainer title="Appointments" showBackButton>
        <LoadingSpinner />
      </PageContainer>
    );
  }
  
  const now = new Date();
  
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time_slot.split(' - ')[0]}`);
    return appointment.status === 'scheduled' && appointmentDate > now;
  });
  
  const pastAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time_slot.split(' - ')[0]}`);
    return (appointment.status === 'completed' || appointmentDate < now) && appointment.status !== 'cancelled';
  });
  
  const cancelledAppointments = appointments.filter(appointment => 
    appointment.status === 'cancelled'
  );

  return (
    <PageContainer title="Appointments" showBackButton>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
          <Button onClick={handleBookNew}>
            <PlusCircle size={16} className="mr-2" />
            Book New
          </Button>
        </div>
        <p className="text-slate-600 mt-1">View and manage your appointments</p>
      </div>
      
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="upcoming">
            Upcoming
            {upcomingAppointments.length > 0 && (
              <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-health-primary text-[10px] font-medium text-white">
                {upcomingAppointments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                id={appointment.id}
                doctorName={appointment.provider_type}
                specialty={appointment.specialty || ""}
                date={formatAppointmentDate(appointment.date)}
                time={appointment.time_slot}
                type={mapDeliveryMethodToType(appointment.delivery_method)}
                status="upcoming"
                onClick={() => navigate(`/appointments/${appointment.id}`)}
              />
            ))
          ) : (
            <div className="text-center py-10 border rounded-lg border-dashed">
              <p className="text-slate-500 mb-3">No upcoming appointments</p>
              <Button onClick={handleBookNew} size="sm">Book an Appointment</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length > 0 ? (
            pastAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                id={appointment.id}
                doctorName={appointment.provider_type}
                specialty={appointment.specialty || ""}
                date={formatAppointmentDate(appointment.date)}
                time={appointment.time_slot}
                type={mapDeliveryMethodToType(appointment.delivery_method)}
                status="completed"
                onClick={() => navigate(`/appointments/${appointment.id}`)}
              />
            ))
          ) : (
            <div className="text-center py-10 border rounded-lg border-dashed">
              <p className="text-slate-500">No past appointments</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="space-y-4">
          {cancelledAppointments.length > 0 ? (
            cancelledAppointments.map(appointment => (
              <AppointmentCard
                key={appointment.id}
                id={appointment.id}
                doctorName={appointment.provider_type}
                specialty={appointment.specialty || ""}
                date={formatAppointmentDate(appointment.date)}
                time={appointment.time_slot}
                type={mapDeliveryMethodToType(appointment.delivery_method)}
                status="cancelled"
                onClick={() => navigate(`/appointments/${appointment.id}`)}
              />
            ))
          ) : (
            <div className="text-center py-10 border rounded-lg border-dashed">
              <p className="text-slate-500">No cancelled appointments</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default AppointmentHistory;
