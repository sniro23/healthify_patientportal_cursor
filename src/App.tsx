
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

const queryClient = new QueryClient();

// Auth guard component to protect routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const hasCompletedProfile = localStorage.getItem("hasCompletedProfile") === "true";
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!hasCompletedProfile) {
    return <Navigate to="/profile-setup" />;
  }
  
  return children;
};

// Check if first-time user
const CheckFirstTime = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const hasSeenSplash = localStorage.getItem("hasSeenSplash") === "true";

  if (!hasSeenSplash) {
    return <Navigate to="/splash" />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <Navigate to="/dashboard" />;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initialization
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CheckFirstTime />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/dashboard" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path="/profile" element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            } />
            <Route path="/health-record" element={
              <RequireAuth>
                <HealthRecord />
              </RequireAuth>
            } />
            
            {/* Appointment Routes */}
            <Route path="/appointments/book" element={
              <RequireAuth>
                <BookAppointment />
              </RequireAuth>
            } />
            <Route path="/appointments/urgent" element={
              <RequireAuth>
                <UrgentConsultation />
              </RequireAuth>
            } />
            <Route path="/appointments/scheduled" element={
              <RequireAuth>
                <ScheduledConsultation />
              </RequireAuth>
            } />
            <Route path="/appointments/home-visit" element={
              <RequireAuth>
                <HomeVisit />
              </RequireAuth>
            } />
            <Route path="/appointments/payment" element={
              <RequireAuth>
                <Payment />
              </RequireAuth>
            } />
            <Route path="/appointments/confirmation" element={
              <RequireAuth>
                <Confirmation />
              </RequireAuth>
            } />
            <Route path="/appointments" element={
              <RequireAuth>
                <AppointmentHistory />
              </RequireAuth>
            } />
            <Route path="/appointments/:id" element={
              <RequireAuth>
                <AppointmentDetails />
              </RequireAuth>
            } />

            {/* Chat Routes */}
            <Route path="/chat" element={
              <RequireAuth>
                <ChatOverviewPage />
              </RequireAuth>
            } />
            <Route path="/chat/new" element={
              <RequireAuth>
                <NewChatPage />
              </RequireAuth>
            } />
            <Route path="/chat/waiting" element={
              <RequireAuth>
                <WaitingForDoctorPage />
              </RequireAuth>
            } />
            <Route path="/chat/:chatId" element={
              <RequireAuth>
                <ChatSessionPage />
              </RequireAuth>
            } />
            <Route path="/chat/:chatId/ended" element={
              <RequireAuth>
                <ChatEndedPage />
              </RequireAuth>
            } />
            <Route path="/consultations/summary/:summaryId" element={
              <RequireAuth>
                <VisitSummaryPage />
              </RequireAuth>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
