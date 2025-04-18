
// This page now redirects to dashboard or onboarding flows
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuthState = async () => {
      // Check if user has seen splash screen
      const hasSeenSplash = localStorage.getItem("hasSeenSplash");
      
      if (!hasSeenSplash) {
        localStorage.setItem("hasSeenSplash", "true");
        navigate("/splash");
        return;
      }

      // Check if user is authenticated
      const { data } = await supabase.auth.getSession();
      const isAuthenticated = !!data.session;
      
      if (isAuthenticated) {
        localStorage.setItem("isAuthenticated", "true");
        
        // Check if profile setup is complete
        const { data: profileData } = await supabase
          .from('profiles')
          .select('has_completed_profile')
          .eq('id', data.session!.user.id)
          .single();
        
        const hasCompletedProfile = profileData?.has_completed_profile || false;
        localStorage.setItem("hasCompletedProfile", hasCompletedProfile.toString());
        
        if (hasCompletedProfile) {
          navigate("/dashboard");
        } else {
          navigate("/profile-setup");
        }
      } else {
        localStorage.removeItem("isAuthenticated");
        navigate("/login");
      }
    };
    
    checkAuthState();
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <LoadingSpinner />
    </div>
  );
};

export default Index;
