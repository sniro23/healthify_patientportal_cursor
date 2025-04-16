
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface HomeVisitCardProps {
  isSubscriber: boolean;
}

const HomeVisitCard: React.FC<HomeVisitCardProps> = ({ isSubscriber }) => {
  const navigate = useNavigate();
  const [isHomeVisitLoading, setIsHomeVisitLoading] = useState(false);

  const handleHomeVisit = () => {
    setIsHomeVisitLoading(true);
    
    setTimeout(() => {
      setIsHomeVisitLoading(false);
      navigate("/appointments/home-visit", {
        state: {
          isSubscriber
        }
      });
    }, 500);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center mb-4">
          <p className="text-lg font-medium">Need a home visit?</p>
          <p className="text-sm text-muted-foreground">Get healthcare services in the comfort of your home</p>
        </div>
        <Button 
          variant="accent" 
          className="w-full" 
          onClick={handleHomeVisit}
          disabled={isHomeVisitLoading}
        >
          {isHomeVisitLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Home className="mr-2 h-5 w-5" />
              Book a Home Visit
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HomeVisitCard;
