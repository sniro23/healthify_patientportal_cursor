
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, ArrowRight, Calendar, Clock, FileCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
  providerType: string;
  specialty?: string;
  appointmentType: string;
  deliveryMethod?: string;
  date: string;
  time: string;
  serviceArea?: string;
  address?: string;
  addressNotes?: string;
  isSubscriber?: boolean;
  paymentCompleted?: boolean;
}

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get state passed from the previous page
  const { 
    providerType,
    specialty,
    appointmentType,
    deliveryMethod,
    date,
    time,
    serviceArea,
    address,
    addressNotes,
    isSubscriber = false,
    paymentCompleted = false
  } = (location.state as LocationState) || {};
  
  // Mock appointment reference number
  const appointmentRef = `APPT-${Date.now().toString().slice(-6)}`;
  
  // Show confirmation toast on page load
  useEffect(() => {
    toast({
      title: "Appointment Confirmed",
      description: `Your ${appointmentType.toLowerCase()} appointment has been booked successfully.`,
    });
  }, [toast, appointmentType]);
  
  // Navigate to the appointments list
  const viewAppointments = () => {
    navigate("/appointments");
  };
  
  // Go to dashboard
  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <PageContainer 
      title="Appointment Confirmed"
      showBackButton={false}
      showBottomNav={true}
    >
      <div className="space-y-6">
        <div className="text-center py-4">
          <div className="bg-green-100 text-green-700 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center mb-4">
            <CalendarCheck className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-600">
            Your appointment has been successfully booked.
          </p>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-lg flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-health-primary" />
                  Appointment Details
                </h3>
                <div className="ml-7 space-y-2 mt-2">
                  <div>
                    <span className="text-gray-600 text-sm">Reference Number:</span>
                    <p className="font-medium">{appointmentRef}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Provider Type:</span>
                    <p className="font-medium">{providerType}</p>
                  </div>
                  {specialty && (
                    <div>
                      <span className="text-gray-600 text-sm">Specialty:</span>
                      <p className="font-medium">{specialty}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600 text-sm">Appointment Type:</span>
                    <p className="font-medium">{appointmentType}</p>
                  </div>
                  {deliveryMethod && (
                    <div>
                      <span className="text-gray-600 text-sm">Delivery Method:</span>
                      <p className="font-medium">{deliveryMethod}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-health-primary" />
                  Date and Time
                </h3>
                <div className="ml-7 space-y-2 mt-2">
                  <div>
                    <span className="text-gray-600 text-sm">Date:</span>
                    <p className="font-medium">{date}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Time:</span>
                    <p className="font-medium">{time}</p>
                  </div>
                </div>
              </div>
              
              {appointmentType === "Home Visit" && serviceArea && address && (
                <div>
                  <h3 className="font-medium text-lg flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-health-primary" />
                    Location Details
                  </h3>
                  <div className="ml-7 space-y-2 mt-2">
                    <div>
                      <span className="text-gray-600 text-sm">Service Area:</span>
                      <p className="font-medium">{serviceArea}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Address:</span>
                      <p className="font-medium">{address}</p>
                    </div>
                    {addressNotes && (
                      <div>
                        <span className="text-gray-600 text-sm">Notes:</span>
                        <p className="font-medium">{addressNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Status:</span>
                  {isSubscriber ? (
                    <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">
                      Subscriber (Billed Monthly)
                    </span>
                  ) : paymentCompleted ? (
                    <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full">
                      Paid
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 text-xs py-1 px-2 rounded-full">
                      Pending Payment
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col space-y-3">
          <Button onClick={viewAppointments}>
            View My Appointments
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={goToDashboard}>
            Return to Dashboard
          </Button>
        </div>
        
        <div className="bg-blue-50 text-blue-800 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-medium">Next Steps</h3>
          <p className="text-sm mt-1">
            You will receive a confirmation email and SMS shortly. For any changes to your appointment, please contact our support team at least 4 hours before the scheduled time.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default Confirmation;
