// This page now redirects to dashboard or onboarding flows
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Function to manually create a profile if it doesn't exist
  const createProfile = async () => {
    if (!userId) {
      setError("No user ID available. Please try logging in again.");
      return;
    }
    
    setIsCreatingProfile(true);
    
    try {
      console.log("Attempting to create profile for user:", userId);
      
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          has_completed_profile: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (createError) {
        console.error("Error creating profile:", createError);
        setError(`Failed to create profile: ${createError.message}`);
        return;
      }
      
      console.log("Profile created successfully");
      localStorage.setItem("hasCompletedProfile", "false");
      navigate("/profile-setup");
    } catch (err) {
      console.error("Unexpected error creating profile:", err);
      setError("An unexpected error occurred while creating your profile");
    } finally {
      setIsCreatingProfile(false);
    }
  };
  
  const goToLogin = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };
  
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        console.log("Index: Checking auth state...");
        
        // Check if user has seen splash screen
        const hasSeenSplash = localStorage.getItem("hasSeenSplash");
        
        if (!hasSeenSplash) {
          console.log("Index: User hasn't seen splash screen, redirecting...");
          localStorage.setItem("hasSeenSplash", "true");
          navigate("/splash");
          return;
        }

        // Check if user is authenticated
        console.log("Index: Checking Supabase session...");
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Index: Session error:", sessionError);
          setError("Failed to check authentication status");
          return;
        }
        
        const isAuthenticated = !!data.session;
        console.log("Index: User authenticated:", isAuthenticated);
        
        if (isAuthenticated) {
          localStorage.setItem("isAuthenticated", "true");
          setUserId(data.session!.user.id);
          
          // Check if profile setup is complete
          console.log("Index: Checking profile completion...");
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('has_completed_profile')
            .eq('id', data.session!.user.id)
            .single();
          
          if (profileError) {
            console.error("Index: Profile error:", profileError);
            if (profileError.code === 'PGRST116') {
              // No profile found - show UI to create one
              setError("Your profile doesn't exist. This might happen if you're logging in for the first time.");
            } else {
              setError("Failed to load profile data");
            }
            return;
          }
          
          const hasCompletedProfile = profileData?.has_completed_profile || false;
          console.log("Index: Profile completed:", hasCompletedProfile);
          localStorage.setItem("hasCompletedProfile", hasCompletedProfile.toString());
          
          if (hasCompletedProfile) {
            console.log("Index: Redirecting to dashboard...");
            navigate("/dashboard");
          } else {
            console.log("Index: Redirecting to profile setup...");
            navigate("/profile-setup");
          }
        } else {
          console.log("Index: User not authenticated, redirecting to login...");
          localStorage.removeItem("isAuthenticated");
          navigate("/login");
        }
      } catch (err) {
        console.error("Index: Unhandled error:", err);
        setError("An unexpected error occurred");
      }
    };
    
    checkAuthState();
  }, [navigate]);
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 max-w-md w-full">
          <h1 className="text-xl font-semibold text-red-600 mb-2">Error</h1>
          <p className="text-slate-700 mb-6">{error}</p>
          
          {error.includes("profile") && userId && (
            <Button 
              onClick={createProfile} 
              disabled={isCreatingProfile}
              className="w-full mb-4 bg-health-primary hover:bg-health-accent"
            >
              {isCreatingProfile ? "Creating profile..." : "Create Profile"}
            </Button>
          )}
          
          <Button 
            onClick={goToLogin} 
            variant="outline" 
            className="w-full"
          >
            Back to Login
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <LoadingSpinner />
    </div>
  );
};

export default Index;
