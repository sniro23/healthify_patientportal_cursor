import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import SubscriptionBadge from "@/components/dashboard/SubscriptionBadge";
import { Calendar, PlusCircle, Activity, Pill, FileText, MessageCircle } from "lucide-react";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import QuickAccessCard from "@/components/dashboard/QuickAccessCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAppointments } from "@/lib/hooks/useAppointments";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user } = useAuth();
  const { getUpcomingAppointment, isLoading: appointmentsLoading } = useAppointments();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching profile for user:", user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        
        console.log("Profile data:", data);
        setUserProfile(data);
      } catch (err) {
        console.error("Unexpected error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
    
    // Simulate loading data for other components
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  // Get the next upcoming appointment
  const upcomingAppointment = getUpcomingAppointment();
  
  const handleNewAppointment = () => {
    navigate("/appointments/book");
  };

  // Get user's display name
  const getUserDisplayName = () => {
    // First try to use the profile name
    if (userProfile?.first_name) {
      if (userProfile.last_name) {
        return `${userProfile.first_name} ${userProfile.last_name}`;
      }
      return userProfile.first_name;
    }
    
    // Fallback to email prefix
    return user?.email?.split('@')[0] || "there";
  };

  if (loading || appointmentsLoading) {
    return (
      <PageContainer title="Healthify" className="space-y-6">
        <LoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Healthify" className="space-y-6">
      {/* Welcome section with subscription */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Hello, {getUserDisplayName()}!</h1>
          <p className="text-sm text-slate-600">Welcome to Healthify Patient Portal</p>
        </div>
        <SubscriptionBadge tier="Category B" />
      </div>
      
      {/* Next appointment */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium">Upcoming Appointment</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-health-primary"
            onClick={handleNewAppointment}
          >
            <PlusCircle size={16} className="mr-1" />
            Book New
          </Button>
        </div>
        
        {upcomingAppointment ? (
          <AppointmentCard 
            id={upcomingAppointment.id}
            doctorName={upcomingAppointment.provider_type}
            specialty={upcomingAppointment.specialty || ""}
            date={new Date(upcomingAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            time={upcomingAppointment.time_slot}
            type={upcomingAppointment.delivery_method === "video" ? "video" : 
                 upcomingAppointment.delivery_method === "chat" ? "text" : "in-person"}
            status="upcoming"
          />
        ) : (
          <div className="p-4 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50">
            <p className="text-slate-600 mb-2">No upcoming appointments</p>
            <Button 
              size="sm" 
              onClick={handleNewAppointment}
              className="bg-health-primary hover:bg-health-accent"
            >
              Book Appointment
            </Button>
          </div>
        )}
      </section>
      
      {/* Quick access cards */}
      <section>
        <h2 className="font-medium mb-3">Quick Access</h2>
        <div className="grid grid-cols-2 gap-4">
          <QuickAccessCard
            title="Appointment History"
            icon={Calendar}
            to="/appointments/history"
            color="bg-blue-50 text-blue-600"
          />
          <QuickAccessCard
            title="My Medications"
            icon={Pill}
            to="/medications"
            color="bg-green-50 text-green-600"
          />
        </div>
      </section>
      
      {/* Health features */}
      <section>
        <h2 className="font-medium mb-3">Health Features</h2>
        <div className="grid grid-cols-2 gap-4">
          <QuickAccessCard
            title="Health Records"
            description="View your medical data"
            icon={FileText}
            to="/health-record"
          />
          <QuickAccessCard
            title="Consult a Doctor"
            description="Start a chat consultation"
            icon={MessageCircle}
            to="/chat"
          />
          <QuickAccessCard
            title="Health Trends"
            description="Track your progress"
            icon={Activity}
            to="/records/trends"
            color="bg-purple-50 text-purple-600"
          />
        </div>
      </section>
    </PageContainer>
  );
};

export default Dashboard;
