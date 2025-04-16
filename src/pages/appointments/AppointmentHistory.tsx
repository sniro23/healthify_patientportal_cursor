
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, FileCheck, CheckCircle, XCircle, Clock } from "lucide-react";

// Mock appointment data
const mockAppointments = [
  {
    id: "apt1",
    providerType: "Doctor",
    providerName: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    appointmentType: "Scheduled",
    deliveryMethod: "Video",
    date: "2025-05-02T10:00:00.000Z",
    duration: 30,
    status: "Upcoming",
    reference: "APPT-345678"
  },
  {
    id: "apt2",
    providerType: "Therapist",
    providerName: "Dr. Michael Chen",
    specialty: "Psychiatry",
    appointmentType: "Scheduled",
    deliveryMethod: "Video",
    date: "2025-05-10T14:30:00.000Z",
    duration: 45,
    status: "Upcoming",
    reference: "APPT-345679"
  },
  {
    id: "apt3",
    providerType: "Doctor",
    providerName: "Dr. Lisa Patel",
    specialty: "Dermatology",
    appointmentType: "Scheduled",
    deliveryMethod: "Text",
    date: "2025-04-10T11:00:00.000Z",
    duration: 20,
    status: "Completed",
    reference: "APPT-345680"
  },
  {
    id: "apt4",
    providerType: "Physiotherapist",
    providerName: "Amanda Wilson",
    specialty: "Orthopedics",
    appointmentType: "Home Visit",
    deliveryMethod: null,
    date: "2025-04-05T09:00:00.000Z",
    duration: 60,
    status: "Completed",
    reference: "APPT-345681"
  },
  {
    id: "apt5",
    providerType: "Doctor",
    providerName: "Dr. John Smith",
    specialty: "Cardiology",
    appointmentType: "Urgent",
    deliveryMethod: "Audio",
    date: "2025-04-01T16:15:00.000Z",
    duration: 15,
    status: "Completed",
    reference: "APPT-345682"
  },
  {
    id: "apt6",
    providerType: "Doctor",
    providerName: "Dr. Emily Rodriguez",
    specialty: "Gastroenterology",
    appointmentType: "Scheduled",
    deliveryMethod: "Video",
    date: "2025-03-28T13:00:00.000Z",
    duration: 30,
    status: "Cancelled",
    reference: "APPT-345683"
  }
];

const AppointmentHistory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [appointments, setAppointments] = useState<typeof mockAppointments>([]);
  
  // Load appointments based on active tab
  useEffect(() => {
    // In a real app, this would fetch from an API with filters
    if (activeTab === "upcoming") {
      setAppointments(mockAppointments.filter(apt => apt.status === "Upcoming"));
    } else if (activeTab === "completed") {
      setAppointments(mockAppointments.filter(apt => apt.status === "Completed"));
    } else {
      setAppointments(mockAppointments.filter(apt => apt.status === "Cancelled"));
    }
  }, [activeTab]);
  
  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "MMMM d, yyyy"),
      time: format(date, "h:mm a")
    };
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Upcoming":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>;
      case "Completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "Cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Navigate to appointment details
  const viewAppointmentDetails = (id: string) => {
    navigate(`/appointments/${id}`);
  };
  
  // Navigate to book appointment
  const bookAppointment = () => {
    navigate("/appointments/book");
  };

  return (
    <PageContainer 
      title="My Appointments"
      showBackButton={true}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Appointment History</h2>
        <Button onClick={bookAppointment} size="sm">
          <Plus className="mr-1 h-4 w-4" />
          Book New
        </Button>
      </div>
      
      <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-0">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map(appointment => {
                const { date, time } = formatDateTime(appointment.date);
                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{appointment.providerName}</h3>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{date}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{time} ({appointment.duration} mins)</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <FileCheck className="h-3 w-3 mr-1" />
                          <span>
                            {appointment.appointmentType}
                            {appointment.deliveryMethod && ` • ${appointment.deliveryMethod}`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 flex justify-between">
                        <span className="text-xs text-gray-500">Ref: {appointment.reference}</span>
                        <Button 
                          variant="link" 
                          className="h-auto p-0 text-health-primary"
                          onClick={() => viewAppointmentDetails(appointment.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-700">No Upcoming Appointments</h3>
              <p className="text-sm text-gray-500 mb-4">You don't have any scheduled appointments.</p>
              <Button onClick={bookAppointment} size="sm">Book an Appointment</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map(appointment => {
                const { date, time } = formatDateTime(appointment.date);
                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{appointment.providerName}</h3>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          </div>
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                            <span className="text-xs font-medium">Completed</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{date} • {time}</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <FileCheck className="h-3 w-3 mr-1" />
                          <span>
                            {appointment.appointmentType}
                            {appointment.deliveryMethod && ` • ${appointment.deliveryMethod}`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 flex justify-between">
                        <span className="text-xs text-gray-500">Ref: {appointment.reference}</span>
                        <div className="flex space-x-4">
                          <Button 
                            variant="link" 
                            className="h-auto p-0 text-health-primary"
                            onClick={() => navigate(`/consultations/summary/${appointment.id}`)}
                          >
                            View Summary
                          </Button>
                          <Button 
                            variant="link" 
                            className="h-auto p-0 text-health-primary"
                            onClick={() => viewAppointmentDetails(appointment.id)}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <CheckCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-700">No Completed Appointments</h3>
              <p className="text-sm text-gray-500">Your completed appointments will appear here.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="cancelled" className="mt-0">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map(appointment => {
                const { date, time } = formatDateTime(appointment.date);
                return (
                  <Card key={appointment.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{appointment.providerName}</h3>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          </div>
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-600 mr-1" />
                            <span className="text-xs font-medium">Cancelled</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{date} • {time}</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                          <FileCheck className="h-3 w-3 mr-1" />
                          <span>
                            {appointment.appointmentType}
                            {appointment.deliveryMethod && ` • ${appointment.deliveryMethod}`}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <XCircle className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-700">No Cancelled Appointments</h3>
              <p className="text-sm text-gray-500">Your cancelled appointments will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default AppointmentHistory;
