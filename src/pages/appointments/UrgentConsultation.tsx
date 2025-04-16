
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  ProviderType,
  ConsultationType,
  DeliveryMethod
} from "@/lib/models/appointment";

// Status types for the provider search
type SearchStatus = "searching" | "found" | "not-found";

interface LocationState {
  providerType: ProviderType;
  consultationType: ConsultationType;
  deliveryMethod: DeliveryMethod;
  isSubscriber: boolean;
}

const UrgentConsultation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get state passed from the previous page
  const { 
    providerType = "Doctor", 
    deliveryMethod = "Video",
    isSubscriber = false 
  } = (location.state as LocationState) || {};
  
  // Search status state
  const [searchStatus, setSearchStatus] = useState<SearchStatus>("searching");
  const [countdown, setCountdown] = useState(15); // 15 seconds countdown
  const [providerFound, setProviderFound] = useState<{name: string, specialty: string} | null>(null);
  
  // Simulate provider search
  useEffect(() => {
    // Reset state if coming back to this page
    setSearchStatus("searching");
    setCountdown(15);
    setProviderFound(null);
    
    // Simulate searching for providers
    const timeoutId = setTimeout(() => {
      // 70% chance of finding a provider (for demo purposes)
      const found = Math.random() < 0.7;
      
      if (found) {
        setSearchStatus("found");
        setProviderFound({
          name: "Dr. Sarah Johnson",
          specialty: "General Medicine"
        });
      } else {
        setSearchStatus("not-found");
      }
    }, 5000); // 5 seconds to simulate search
    
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearTimeout(timeoutId);
      clearInterval(countdownInterval);
    };
  }, []);
  
  // Handle accepting the found provider
  const handleAcceptProvider = () => {
    if (!providerFound) return;
    
    toast({
      title: "Consultation Confirmed",
      description: `Your consultation with ${providerFound.name} is being prepared.`,
    });
    
    // If not a subscriber, go to payment first
    if (!isSubscriber) {
      navigate("/appointments/payment", {
        state: {
          providerName: providerFound.name,
          appointmentType: "Urgent",
          deliveryMethod,
          price: 2500 // Mock price
        }
      });
    } else {
      // Subscriber can proceed directly to consultation
      navigate("/consultations/chat", {
        state: {
          providerName: providerFound.name,
          isUrgent: true
        }
      });
    }
  };
  
  // Handle declining and trying again
  const handleDecline = () => {
    setSearchStatus("searching");
    setCountdown(15);
    setProviderFound(null);
    
    // Simulate searching again with a shorter timeout
    setTimeout(() => {
      const found = Math.random() < 0.5;
      
      if (found) {
        setSearchStatus("found");
        setProviderFound({
          name: "Dr. Michael Chen",
          specialty: "General Medicine"
        });
      } else {
        setSearchStatus("not-found");
      }
    }, 3000);
  };
  
  // Handle switching to scheduled appointment
  const handleSwitchToScheduled = () => {
    navigate("/appointments/scheduled", {
      state: {
        providerType,
        consultationType: "Scheduled",
        deliveryMethod,
        isSubscriber
      }
    });
  };

  return (
    <PageContainer 
      title="Urgent Consultation"
      showBackButton={true}
    >
      <Card className="mb-6">
        <CardContent className="pt-6">
          {searchStatus === "searching" && (
            <div className="text-center py-8">
              <Loader2 className="h-16 w-16 animate-spin text-health-primary mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Searching for Available Providers</h2>
              <p className="text-gray-600 mb-4">
                We're looking for {providerType.toLowerCase()}s available for immediate {deliveryMethod.toLowerCase()} consultation.
              </p>
              <div className="text-sm text-gray-500">
                Time remaining: {countdown} seconds
              </div>
            </div>
          )}
          
          {searchStatus === "found" && providerFound && (
            <div className="text-center py-8">
              <div className="bg-green-100 p-2 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Provider Found!</h2>
              <p className="text-gray-600 mb-4">
                {providerFound.name} ({providerFound.specialty}) is available for an immediate consultation.
              </p>
              <div className="flex space-x-4 justify-center mt-6">
                <Button variant="outline" onClick={handleDecline}>
                  <X className="mr-2 h-4 w-4" />
                  Decline
                </Button>
                <Button onClick={handleAcceptProvider}>
                  <Check className="mr-2 h-4 w-4" />
                  Accept Provider
                </Button>
              </div>
            </div>
          )}
          
          {searchStatus === "not-found" && (
            <div className="text-center py-8">
              <div className="bg-amber-100 p-2 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No Providers Available</h2>
              <p className="text-gray-600 mb-4">
                We couldn't find any {providerType.toLowerCase()}s available for immediate consultation.
              </p>
              <div className="flex flex-col space-y-3 mt-6">
                <Button onClick={handleSwitchToScheduled}>
                  Schedule For Later
                </Button>
                <Button variant="outline" onClick={() => navigate(-1)}>
                  Change Options
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 text-blue-800 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-medium">About Urgent Consultations</h3>
        <p className="text-sm mt-1">
          Urgent consultations connect you with available providers in real-time. If none are available, you can schedule for a later time or change your preferences.
        </p>
      </div>
    </PageContainer>
  );
};

export default UrgentConsultation;
