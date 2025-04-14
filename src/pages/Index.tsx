
// This page now redirects to dashboard or onboarding flows
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has seen splash screen
    const hasSeenSplash = localStorage.getItem("hasSeenSplash");
    
    if (!hasSeenSplash) {
      localStorage.setItem("hasSeenSplash", "true");
      navigate("/splash");
    } else {
      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
      
      if (isAuthenticated) {
        // Check if profile setup is complete
        const hasCompletedProfile = localStorage.getItem("hasCompletedProfile") === "true";
        
        if (hasCompletedProfile) {
          navigate("/dashboard");
        } else {
          navigate("/profile-setup");
        }
      } else {
        navigate("/login");
      }
    }
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-pulse-glow text-health-primary">Loading...</div>
    </div>
  );
};

export default Index;
