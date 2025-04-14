
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import SubscriptionBadge from "@/components/dashboard/SubscriptionBadge";
import { Calendar, PlusCircle, Activity, Pill, FileText, MessageCircle } from "lucide-react";
import AppointmentCard from "@/components/dashboard/AppointmentCard";
import QuickAccessCard from "@/components/dashboard/QuickAccessCard";
import { Button } from "@/components/ui/button";

// Mock data, would be fetched from backend in production
const mockUserData = {
  name: "John",
  subscriptionTier: "Category B"
};

const mockAppointment = {
  id: "123",
  doctorName: "Emily Chen",
  specialty: "General Physician",
  date: "Apr 16, 2025",
  time: "10:30 AM",
  type: "video" as const,
  status: "upcoming" as const
};

const Dashboard = () => {
  const [userData, setUserData] = useState(mockUserData);
  const [upcomingAppointment, setUpcomingAppointment] = useState(mockAppointment);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleNewAppointment = () => {
    navigate("/appointments/book");
  };

  return (
    <PageContainer title="Healthify" className="space-y-6">
      {/* Welcome section with subscription */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Hello, {userData.name}!</h1>
          <p className="text-sm text-slate-600">Welcome to Healthify Patient Portal</p>
        </div>
        <SubscriptionBadge tier={userData.subscriptionTier} />
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
        
        {loading ? (
          <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
        ) : upcomingAppointment ? (
          <AppointmentCard {...upcomingAppointment} />
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
            to="/records"
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
