
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/lib/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import HealthRecord from "./pages/HealthRecord";

// Appointment pages
import BookAppointment from "./pages/appointments/BookAppointment";
import UrgentConsultation from "./pages/appointments/UrgentConsultation";
import ScheduledConsultation from "./pages/appointments/ScheduledConsultation";
import HomeVisit from "./pages/appointments/HomeVisit";
import Payment from "./pages/appointments/Payment";
import Confirmation from "./pages/appointments/Confirmation";
import AppointmentHistory from "./pages/appointments/AppointmentHistory";
import AppointmentDetails from "./pages/appointments/AppointmentDetails";

// Chat/Consultation pages
import ChatOverviewPage from "./pages/chat/ChatOverviewPage";
import NewChatPage from "./pages/chat/NewChatPage";
import WaitingForDoctorPage from "./pages/chat/WaitingForDoctorPage";
import ChatSessionPage from "./pages/chat/ChatSessionPage";
import ChatEndedPage from "./pages/chat/ChatEndedPage";
import VisitSummaryPage from "./pages/consultations/VisitSummaryPage";

// Medication pages
import MedicationSummary from "./pages/medications/MedicationSummary";
import AddMedication from "./pages/medications/AddMedication";
import PrescriptionDetails from "./pages/medications/PrescriptionDetails";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-pulse-glow text-health-primary">Loading...</div>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/splash" element={<SplashScreen />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/health-record" element={<HealthRecord />} />
              
              {/* Appointment Routes */}
              <Route path="/appointments/book" element={<BookAppointment />} />
              <Route path="/appointments/urgent" element={<UrgentConsultation />} />
              <Route path="/appointments/scheduled" element={<ScheduledConsultation />} />
              <Route path="/appointments/home-visit" element={<HomeVisit />} />
              <Route path="/appointments/payment" element={<Payment />} />
              <Route path="/appointments/confirmation" element={<Confirmation />} />
              <Route path="/appointments" element={<AppointmentHistory />} />
              <Route path="/appointments/:id" element={<AppointmentDetails />} />

              {/* Chat Routes */}
              <Route path="/chat" element={<ChatOverviewPage />} />
              <Route path="/chat/new" element={<NewChatPage />} />
              <Route path="/chat/waiting" element={<WaitingForDoctorPage />} />
              <Route path="/chat/:chatId" element={<ChatSessionPage />} />
              <Route path="/chat/:chatId/ended" element={<ChatEndedPage />} />
              <Route path="/consultations/summary/:summaryId" element={<VisitSummaryPage />} />
              
              {/* Medication Routes */}
              <Route path="/medications" element={<MedicationSummary />} />
              <Route path="/medications/add" element={<AddMedication />} />
              <Route path="/medications/prescription/:prescriptionId" element={<PrescriptionDetails />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
