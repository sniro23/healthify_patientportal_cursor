
import { BellIcon, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  showNotification?: boolean;
}

const AppHeader = ({ 
  title, 
  showBackButton = false,
  showNotification = true
}: AppHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBack = () => {
    if (location.key === "default") {
      // We're at the first page in history, go to home
      navigate("/");
    } else {
      // Go back in history
      navigate(-1);
    }
  };
  
  return (
    <header className="sticky top-0 bg-health-primary text-white border-b border-health-primary/20 py-4 px-4 flex items-center justify-between z-40">
      <div className="flex items-center">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="mr-2 text-white hover:bg-health-primary/90"
          >
            <ArrowLeft size={20} />
          </Button>
        )}
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      
      {showNotification && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/notifications")}
          className="text-white hover:bg-health-primary/90"
        >
          <BellIcon size={20} />
        </Button>
      )}
    </header>
  );
};

export default AppHeader;
