
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <PageContainer 
      title="Page Not Found" 
      showBottomNav={false} 
      showBackButton={true}
    >
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
        <p className="text-lg text-slate-600 mb-8">Oops! The page you're looking for doesn't exist.</p>
        
        <Button 
          onClick={() => navigate("/")} 
          className="bg-health-primary hover:bg-health-accent"
        >
          Return to Dashboard
        </Button>
      </div>
    </PageContainer>
  );
};

export default NotFound;
