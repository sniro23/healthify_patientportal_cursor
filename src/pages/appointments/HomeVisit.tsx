import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { SimplifiedCombobox, ComboboxOption } from "@/components/ui/simplified-combobox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CalendarIcon, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ProviderType,
  DeliveryMethod,
  generateTimeSlots,
  TimeSlot
} from "@/lib/models/appointment";

interface LocationState {
  providerType: ProviderType;
  deliveryMethod: DeliveryMethod;
  isSubscriber: boolean;
}

// Mock list of service areas
const serviceAreas = [
  { value: "colombo", label: "Colombo", description: "All districts in Colombo" },
  { value: "gampaha", label: "Gampaha", description: "Central areas" },
  { value: "kandy", label: "Kandy", description: "City limits only" },
  { value: "galle", label: "Galle", description: "Main city area" },
  { value: "matara", label: "Matara", description: "Limited areas" },
];

const HomeVisit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get state passed from the previous page
  const { 
    providerType = "Doctor",
    isSubscriber = false 
  } = (location.state as LocationState) || {};
  
  // Form state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [serviceArea, setServiceArea] = useState("");
  const [address, setAddress] = useState("");
  const [addressNotes, setAddressNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    
    if (date) {
      // Generate fewer time slots for home visits with 1-hour duration
      const slots = generateTimeSlots(date, 60).filter((_, index) => index % 3 === 0);
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
    if (!selectedDate || !selectedTimeSlot || !serviceArea || !address) {
      toast({
        variant: "destructive",
        title: "Incomplete Information",
        description: "Please complete all required fields."
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      
      // Higher price for home visits
      const price = 3500;
      
      // For non-subscribers, go to payment first
      if (!isSubscriber) {
        navigate("/appointments/payment", {
          state: {
            providerType,
            appointmentType: "Home Visit",
            date: format(selectedDate, 'PPP'),
            time: formatTimeSlot(selectedTimeSlot),
            serviceArea,
            address,
            addressNotes,
            price
          }
        });
      } else {
        // For subscribers, go directly to confirmation
        navigate("/appointments/confirmation", {
          state: {
            providerType,
            appointmentType: "Home Visit",
            date: format(selectedDate, 'PPP'),
            time: formatTimeSlot(selectedTimeSlot),
            serviceArea,
            address,
            addressNotes,
            isSubscriber
          }
        });
      }
    }, 1000);
  };

  return (
    <PageContainer 
      title="Home Visit Request"
      showBackButton={true}
    >
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Service Area
              </label>
              <SimplifiedCombobox
                options={serviceAreas}
                value={serviceArea}
                onSelect={setServiceArea}
                placeholder="Select your area"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                Home visits are only available in selected service areas
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Address</label>
              <Input
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Additional Address Notes</label>
              <Textarea
                placeholder="Landmarks, directions, gate number, etc."
                value={addressNotes}
                onChange={(e) => setAddressNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Preferred Date
              </label>
              <div className="border rounded-md p-2 bg-white">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < addDays(new Date(), 1) || date > addDays(new Date(), 14)}
                  className="pointer-events-auto"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Home visits require at least 24 hours advance booking
              </p>
            </div>
            
            {selectedDate && timeSlots.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-1 block flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Preferred Time Slot
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
              disabled={isLoading || !selectedDate || !selectedTimeSlot || !serviceArea || !address}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : "Submit Request"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-amber-50 text-amber-800 border border-amber-200 p-4 rounded-lg">
        <h3 className="font-medium">Home Visit Information</h3>
        <p className="text-sm mt-1">
          Home visit requests are subject to provider availability in your area. Our team will confirm your booking within 4 hours of submission.
        </p>
        {!isSubscriber && (
          <p className="text-sm mt-2 font-medium">
            Payment will be required to confirm your home visit request.
          </p>
        )}
      </div>
    </PageContainer>
  );
};

export default HomeVisit;
