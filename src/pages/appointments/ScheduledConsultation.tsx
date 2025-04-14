
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Loader2, CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ProviderType,
  ConsultationType,
  DeliveryMethod,
  MedicalSpecialty,
  specialties,
  generateTimeSlots,
  TimeSlot
} from "@/lib/models/appointment";

interface LocationState {
  providerType: ProviderType;
  consultationType: ConsultationType;
  deliveryMethod: DeliveryMethod;
  isSubscriber: boolean;
}

const ScheduledConsultation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get state passed from the previous page
  const { 
    providerType = "Doctor", 
    deliveryMethod = "Video",
    isSubscriber = false 
  } = (location.state as LocationState) || {};
  
  // Form state
  const [specialty, setSpecialty] = useState<MedicalSpecialty | "">("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Convert specialties to combobox options
  const specialtyOptions: ComboboxOption[] = specialties.map(spec => ({
    value: spec.value,
    label: spec.label,
    description: spec.description
  }));

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    
    if (date) {
      // Generate time slots for the selected date
      const slots = generateTimeSlots(date);
      setTimeSlots(slots);
    } else {
      setTimeSlots([]);
    }
  };
  
  // Format time for display
  const formatTimeSlot = (slot: TimeSlot) => {
    const startTime = new Date(slot.startTime);
    const endTime = new Date(slot.endTime);
    return `${format(startTime, 'h:mm a')} - ${format(endTime, 'h:mm a')}`;
  };
  
  // Handle confirmation
  const handleConfirmBooking = () => {
    if (!specialty || !selectedDate || !selectedTimeSlot) {
      toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please select a specialty, date, and time slot."
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      
      // For non-subscribers, go to payment first
      if (!isSubscriber) {
        navigate("/appointments/payment", {
          state: {
            providerType,
            specialty,
            appointmentType: "Scheduled",
            deliveryMethod,
            date: format(selectedDate, 'PPP'),
            time: formatTimeSlot(selectedTimeSlot),
            price: 1500 // Mock price
          }
        });
      } else {
        // For subscribers, go directly to confirmation
        navigate("/appointments/confirmation", {
          state: {
            providerType,
            specialty,
            appointmentType: "Scheduled",
            deliveryMethod,
            date: format(selectedDate, 'PPP'),
            time: formatTimeSlot(selectedTimeSlot),
            isSubscriber
          }
        });
      }
    }, 1000);
  };

  return (
    <PageContainer 
      title="Schedule Appointment"
      showBackButton={true}
    >
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Specialty</label>
              <Combobox
                options={specialtyOptions}
                value={specialty}
                onSelect={(value) => setSpecialty(value as MedicalSpecialty)}
                placeholder="Select specialty"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Select Date
              </label>
              <div className="border rounded-md p-2 bg-white">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                  className="pointer-events-auto"
                />
              </div>
            </div>
            
            {selectedDate && timeSlots.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Select Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                      onClick={() => setSelectedTimeSlot(slot)}
                      disabled={!slot.isAvailable}
                      className={`justify-start ${!slot.isAvailable ? 'opacity-50' : ''}`}
                    >
                      {formatTimeSlot(slot)}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <Button 
              className="w-full mt-6" 
              onClick={handleConfirmBooking}
              disabled={isLoading || !specialty || !selectedDate || !selectedTimeSlot}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : "Confirm Booking"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isSubscriber ? (
        <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-lg">
          <h3 className="font-medium">Subscriber Benefit</h3>
          <p className="text-sm mt-1">
            Your booking will be confirmed immediately without payment. Charges will be included in your monthly billing.
          </p>
        </div>
      ) : (
        <div className="bg-blue-50 text-blue-800 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-medium">Payment Required</h3>
          <p className="text-sm mt-1">
            After confirming your selection, you'll be directed to the payment screen to complete your booking.
          </p>
        </div>
      )}
    </PageContainer>
  );
};

export default ScheduledConsultation;
