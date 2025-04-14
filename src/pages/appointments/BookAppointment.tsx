
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  ProviderType, 
  ConsultationType,
  DeliveryMethod,
  providerTypes,
  consultationTypes,
  deliveryMethods
} from "@/lib/models/appointment";

const BookAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Selection states
  const [providerType, setProviderType] = useState<ProviderType | "">("");
  const [consultationType, setConsultationType] = useState<ConsultationType | "">("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | "">("");
  
  // Subscription logic (mock)
  const isSubscriber = localStorage.getItem("isSubscriber") === "true";

  // Convert provider types to combobox options
  const providerOptions: ComboboxOption[] = providerTypes.map(type => ({
    value: type.value,
    label: type.label,
    description: type.description
  }));

  // Convert consultation types to combobox options
  const consultationOptions: ComboboxOption[] = consultationTypes.map(type => ({
    value: type.value,
    label: type.label,
    description: type.description
  }));

  // Convert delivery methods to combobox options
  const deliveryOptions: ComboboxOption[] = deliveryMethods.map(method => ({
    value: method.value,
    label: method.label,
    description: method.description
  }));

  // Handle the "Next" button click
  const handleNext = () => {
    if (!providerType || !consultationType || !deliveryMethod) {
      toast({
        variant: "destructive",
        title: "Please complete your selection",
        description: "All fields are required to proceed."
      });
      return;
    }

    setIsLoading(true);
    
    // Simulating a brief loading state
    setTimeout(() => {
      setIsLoading(false);
      
      let nextPage = "";
      
      // Determine next page based on consultation type
      switch (consultationType) {
        case "Urgent":
          nextPage = "/appointments/urgent";
          break;
        case "Scheduled":
          nextPage = "/appointments/scheduled";
          break;
        case "Home Visit":
          nextPage = "/appointments/home-visit";
          break;
      }
      
      // Navigate to the appropriate page with the selection as state
      navigate(nextPage, { 
        state: { 
          providerType,
          consultationType,
          deliveryMethod,
          isSubscriber
        } 
      });
    }, 500);
  };

  return (
    <PageContainer 
      title="Book Appointment"
      showBackButton={true}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-1 block">Provider Type</label>
                <Combobox
                  options={providerOptions}
                  value={providerType}
                  onSelect={(value) => setProviderType(value as ProviderType)}
                  placeholder="Select provider type"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Consultation Type</label>
                <Combobox
                  options={consultationOptions}
                  value={consultationType}
                  onSelect={(value) => setConsultationType(value as ConsultationType)}
                  placeholder="Select consultation type"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Delivery Method</label>
                <Combobox
                  options={deliveryOptions}
                  value={deliveryMethod}
                  onSelect={(value) => setDeliveryMethod(value as DeliveryMethod)}
                  placeholder="Select delivery method"
                  className="w-full"
                />
              </div>
              
              <Button 
                className="w-full mt-6" 
                onClick={handleNext}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {isSubscriber ? (
          <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-lg">
            <h3 className="font-medium">Subscriber Benefit</h3>
            <p className="text-sm mt-1">
              As a subscriber, you can book appointments without immediate payment. Billing will be processed at the end of your billing cycle.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 text-blue-800 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-medium">Non-Subscriber Notice</h3>
            <p className="text-sm mt-1">
              You'll need to make a payment after selecting your appointment details to confirm your booking.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default BookAppointment;
