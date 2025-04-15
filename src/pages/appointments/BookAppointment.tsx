
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

// Import our components
import SelectionForm from "@/components/appointments/SelectionForm";
import HomeVisitCard from "@/components/appointments/HomeVisitCard";
import SubscriptionNotice from "@/components/appointments/SubscriptionNotice";

interface FormValues {
  providerType: ProviderType | "";
  consultationType: ConsultationType | "";
  deliveryMethod: DeliveryMethod | "";
}

const BookAppointment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Subscription logic (mock)
  const isSubscriber = localStorage.getItem("isSubscriber") === "true";

  // Handle the form submission
  const handleFormSubmit = (data: FormValues) => {
    if (!data.providerType || !data.consultationType || !data.deliveryMethod) {
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
      switch (data.consultationType) {
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
          providerType: data.providerType,
          consultationType: data.consultationType,
          deliveryMethod: data.deliveryMethod,
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
              onFormSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
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
