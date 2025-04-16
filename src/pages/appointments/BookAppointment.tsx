
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ProviderType, 
  ConsultationType,
  DeliveryMethod,
} from "@/lib/models/appointment";

// Import our new components
import SelectionForm from "@/components/appointments/SelectionForm";
import HomeVisitCard from "@/components/appointments/HomeVisitCard";
import SubscriptionNotice from "@/components/appointments/SubscriptionNotice";

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
            <SelectionForm
              providerType={providerType}
              setProviderType={setProviderType}
              consultationType={consultationType}
              setConsultationType={setConsultationType}
              deliveryMethod={deliveryMethod}
              setDeliveryMethod={setDeliveryMethod}
            />
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
          </CardContent>
        </Card>
        
        {/* Separate Home Visit CTA Button */}
        <HomeVisitCard isSubscriber={isSubscriber} />
        
        {/* Subscription Notice */}
        <SubscriptionNotice isSubscriber={isSubscriber} />
      </div>
    </PageContainer>
  );
};

export default BookAppointment;
