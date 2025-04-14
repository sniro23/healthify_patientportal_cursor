
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  VideoIcon, 
  MessageSquare, 
  Phone, 
  MapPin, 
  FileText, 
  UserCheck, 
  AlertCircle, 
  XCircle, 
  Calendar as CalendarIcon  
} from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Mock appointment data for details page
const mockAppointments = [
  {
    id: "apt1",
    providerType: "Doctor",
    providerName: "Dr. Sarah Johnson",
    providerImage: "/lovable-uploads/8d86aa8b-03ca-4a01-8570-0eeebda94dd7.png",
    specialty: "General Medicine",
    appointmentType: "Scheduled",
    deliveryMethod: "Video",
    date: "2025-05-02T10:00:00.000Z",
    duration: 30,
    status: "Upcoming",
    reference: "APPT-345678",
    notes: "Follow-up consultation for recent lab results.",
    location: null,
    paymentStatus: "Paid",
    amount: 1500
  },
  {
    id: "apt2",
    providerType: "Therapist",
    providerName: "Dr. Michael Chen",
    providerImage: null,
    specialty: "Psychiatry",
    appointmentType: "Scheduled",
    deliveryMethod: "Video",
    date: "2025-05-10T14:30:00.000Z",
    duration: 45,
    status: "Upcoming",
    reference: "APPT-345679",
    notes: "Initial consultation for anxiety management.",
    location: null,
    paymentStatus: "Subscription",
    amount: 2500
  },
  {
    id: "apt3",
    providerType: "Doctor",
    providerName: "Dr. Lisa Patel",
    providerImage: null,
    specialty: "Dermatology",
    appointmentType: "Scheduled",
    deliveryMethod: "Text",
    date: "2025-04-10T11:00:00.000Z",
    duration: 20,
    status: "Completed",
    reference: "APPT-345680",
    notes: "Skin rash assessment and treatment plan.",
    location: null,
    paymentStatus: "Paid",
    amount: 1800
  },
  {
    id: "apt4",
    providerType: "Physiotherapist",
    providerName: "Amanda Wilson",
    providerImage: null,
    specialty: "Orthopedics",
    appointmentType: "Home Visit",
    deliveryMethod: null,
    date: "2025-04-05T09:00:00.000Z",
    duration: 60,
    status: "Completed",
    reference: "APPT-345681",
    notes: "Post-surgery rehabilitation session at patient's home.",
    location: "123 Main Street, Colombo 05",
    paymentStatus: "Paid",
    amount: 3500
  },
  {
    id: "apt5",
    providerType: "Doctor",
    providerName: "Dr. John Smith",
    providerImage: null,
    specialty: "Cardiology",
    appointmentType: "Urgent",
    deliveryMethod: "Audio",
    date: "2025-04-01T16:15:00.000Z",
    duration: 15,
    status: "Completed",
    reference: "APPT-345682",
    notes: "Urgent consultation for chest pain symptoms.",
    location: null,
    paymentStatus: "Paid",
    amount: 2000
  },
  {
    id: "apt6",
    providerType: "Doctor",
    providerName: "Dr. Emily Rodriguez",
    providerImage: null,
    specialty: "Gastroenterology",
    appointmentType: "Scheduled",
    deliveryMethod: "Video",
    date: "2025-03-28T13:00:00.000Z",
    duration: 30,
    status: "Cancelled",
    reference: "APPT-345683",
    notes: "Initial consultation for digestive issues - cancelled by patient.",
    location: null,
    paymentStatus: "Refunded",
    amount: 1500
  }
];

const AppointmentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [appointment, setAppointment] = useState<(typeof mockAppointments)[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  
  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "MMMM d, yyyy"),
      time: format(date, "h:mm a"),
      day: format(date, "EEEE")
    };
  };
  
  // Load appointment details
  useEffect(() => {
    // Simulate API call to get appointment details
    setLoading(true);
    
    setTimeout(() => {
      const foundAppointment = mockAppointments.find(apt => apt.id === id);
      setAppointment(foundAppointment || null);
      setLoading(false);
    }, 500);
  }, [id]);
  
  // Handle starting the consultation
  const startConsultation = () => {
    if (!appointment) return;
    
    if (appointment.deliveryMethod === "Video") {
      navigate(`/consultations/video/${appointment.id}`);
    } else if (appointment.deliveryMethod === "Audio") {
      navigate(`/consultations/audio/${appointment.id}`);
    } else {
      navigate(`/consultations/chat/${appointment.id}`);
    }
  };
  
  // Handle viewing consultation summary
  const viewSummary = () => {
    if (!appointment) return;
    navigate(`/consultations/summary/${appointment.id}`);
  };
  
  // Handle appointment cancellation
  const handleCancelAppointment = () => {
    setShowCancelDialog(false);
    
    // Simulate API call to cancel appointment
    setTimeout(() => {
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been successfully cancelled.",
      });
      
      navigate("/appointments", { replace: true });
    }, 500);
  };
  
  // Handle appointment rescheduling
  const handleRescheduleAppointment = () => {
    setShowRescheduleDialog(false);
    navigate(`/appointments/reschedule/${id}`);
  };
  
  // Get delivery method icon
  const getDeliveryMethodIcon = (method: string | null) => {
    switch (method) {
      case "Video":
        return <VideoIcon className="h-5 w-5 mr-2 text-blue-600" />;
      case "Audio":
        return <Phone className="h-5 w-5 mr-2 text-green-600" />;
      case "Text":
        return <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />;
      default:
        return null;
    }
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
  
  // Get payment status badge
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case "Subscription":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Subscription</Badge>;
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
      case "Refunded":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Refunded</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  if (loading) {
    return (
      <PageContainer title="Appointment Details" showBackButton={true}>
        <div className="p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-200 h-20 w-20 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="h-32 bg-slate-200 rounded w-full mb-4"></div>
            <div className="h-20 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      </PageContainer>
    );
  }
  
  if (!appointment) {
    return (
      <PageContainer title="Appointment Details" showBackButton={true}>
        <div className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Appointment Not Found</h2>
          <p className="text-gray-600 mb-6">The appointment you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/appointments")}>View All Appointments</Button>
        </div>
      </PageContainer>
    );
  }
  
  const { date, time, day } = formatDateTime(appointment.date);
  const isUpcoming = appointment.status === "Upcoming";
  const isWithin24Hours = isUpcoming && new Date(appointment.date).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  return (
    <PageContainer 
      title="Appointment Details"
      showBackButton={true}
    >
      <Card className="mb-6 overflow-hidden">
        <CardContent className="p-0">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                {appointment.providerImage ? (
                  <img 
                    src={appointment.providerImage} 
                    alt={appointment.providerName}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-health-primary/10 flex items-center justify-center mr-4">
                    <UserCheck className="h-6 w-6 text-health-primary" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold">{appointment.providerName}</h2>
                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                </div>
              </div>
              {getStatusBadge(appointment.status)}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-12">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center text-sm mb-1">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center text-sm mb-1">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{time}</span>
                </div>
                <div className="flex items-center text-sm">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{day}</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center text-sm mb-1">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Ref: {appointment.reference}</span>
                </div>
                <div className="flex items-center text-sm mb-1">
                  <span className="w-4 h-4 mr-2"></span>
                  <span>Duration: {appointment.duration} minutes</span>
                </div>
                <div className="flex items-center text-sm">
                  {appointment.deliveryMethod ? (
                    <>
                      {getDeliveryMethodIcon(appointment.deliveryMethod)}
                      <span>{appointment.deliveryMethod} Consultation</span>
                    </>
                  ) : appointment.appointmentType === "Home Visit" ? (
                    <>
                      <MapPin className="h-4 w-4 mr-2 text-red-500" />
                      <span>Home Visit</span>
                    </>
                  ) : (
                    <>
                      <span className="w-4 h-4 mr-2"></span>
                      <span>{appointment.appointmentType}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {appointment.notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Notes:</span> {appointment.notes}
                </p>
              </div>
            )}
            
            {appointment.location && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                  <span><span className="font-medium">Address:</span> {appointment.location}</span>
                </p>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-gray-50 flex flex-wrap justify-between items-center">
            <div className="flex items-center mb-2 sm:mb-0">
              <span className="text-sm text-gray-600 mr-2">Payment:</span>
              {getPaymentBadge(appointment.paymentStatus)}
              <span className="ml-2 text-sm">LKR {appointment.amount.toLocaleString()}</span>
            </div>
            
            <div className="flex space-x-2 w-full sm:w-auto">
              {isUpcoming && (
                <>
                  <Button 
                    size="sm" 
                    className="flex-1 sm:flex-none"
                    onClick={startConsultation}
                    disabled={new Date(appointment.date).getTime() - Date.now() > 10 * 60 * 1000}
                  >
                    {appointment.deliveryMethod === "Video" ? (
                      <>
                        <VideoIcon className="mr-1 h-4 w-4" />
                        Join Video
                      </>
                    ) : appointment.deliveryMethod === "Audio" ? (
                      <>
                        <Phone className="mr-1 h-4 w-4" />
                        Join Audio
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Start Chat
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 sm:flex-none"
                    onClick={() => setShowRescheduleDialog(true)}
                    disabled={isWithin24Hours}
                  >
                    Reschedule
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 sm:flex-none bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                    onClick={() => setShowCancelDialog(true)}
                    disabled={isWithin24Hours}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Cancel
                  </Button>
                </>
              )}
              
              {appointment.status === "Completed" && (
                <Button 
                  size="sm"
                  onClick={viewSummary}
                >
                  <FileText className="mr-1 h-4 w-4" />
                  View Summary
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isUpcoming && (
        <div className="space-y-4">
          {isWithin24Hours && (
            <div className="bg-amber-50 text-amber-800 border border-amber-200 p-4 rounded-lg">
              <h3 className="font-medium flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                24-Hour Notice Period
              </h3>
              <p className="text-sm mt-1">
                Your appointment is within 24 hours. Cancellation and rescheduling are no longer available.
              </p>
            </div>
          )}
          
          <div className="bg-blue-50 text-blue-800 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-medium">Appointment Instructions</h3>
            <p className="text-sm mt-1">
              Please be ready 5 minutes before your scheduled time. Ensure your device has a stable internet connection for a smooth consultation experience.
            </p>
          </div>
        </div>
      )}
      
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your appointment with {appointment.providerName} on {date} at {time}?
              
              {appointment.paymentStatus === "Paid" && (
                <p className="mt-2 text-amber-600 font-medium">
                  You'll receive a refund according to our cancellation policy.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Appointment</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleCancelAppointment}
            >
              Yes, Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reschedule Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to reschedule your appointment with {appointment.providerName}?
              
              <p className="mt-2">
                Your current appointment is on {date} at {time}.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRescheduleAppointment}
            >
              Reschedule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageContainer>
  );
};

export default AppointmentDetails;
