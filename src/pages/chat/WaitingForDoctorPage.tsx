
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Loader2 } from "lucide-react";

const WaitingForDoctorPage = () => {
  const navigate = useNavigate();
  const [dots, setDots] = useState(".");
  
  // Animation for the waiting dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);
    
    // Simulate doctor allocation after 5 seconds
    const timeout = setTimeout(() => {
      // Navigate to a chat with the doctor (using a mock chat ID)
      navigate("/chat/1");
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);
  
  return (
    <PageContainer 
      title="Finding a Doctor" 
      showBackButton={false}
      showBottomNav={false}
    >
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <div className="mb-6">
          <Loader2 className="h-16 w-16 animate-spin text-health-primary" />
        </div>
        <h2 className="text-xl font-medium mb-2">
          Your request has been sent to available doctors
        </h2>
        <p className="text-muted-foreground mb-4">
          We're connecting you with the right healthcare professional{dots}
        </p>
        <p className="text-sm text-muted-foreground">
          This usually takes 1-3 minutes
        </p>
      </div>
    </PageContainer>
  );
};

export default WaitingForDoctorPage;
