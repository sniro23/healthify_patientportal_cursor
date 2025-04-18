import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";

// Pages that don't require auth
import Diagnostic from "./pages/Diagnostic";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Index from "./pages/Index";
import SplashScreen from "./pages/SplashScreen";
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

// Create a bare-bones version of the app with minimal dependencies
const App = () => {
  // Create query client instance directly in the component
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          <Routes>
            {/* Pages that don't need auth */}
            <Route path="/diagnostic" element={
              <ErrorBoundary>
                <Diagnostic />
              </ErrorBoundary>
            } />
            
            {/* Authentication pages */}
            <Route path="/login" element={
              <ErrorBoundary>
                <AuthProvider>
                  <Login />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/register" element={
              <ErrorBoundary>
                <AuthProvider>
                  <Register />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/splash" element={
              <ErrorBoundary>
                <AuthProvider>
                  <SplashScreen />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/forgot-password" element={
              <ErrorBoundary>
                <AuthProvider>
                  <ForgotPassword />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/profile-setup" element={
              <ErrorBoundary>
                <AuthProvider>
                  <ProfileSetup />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            {/* Main authenticated pages */}
            <Route path="/dashboard" element={
              <ErrorBoundary>
                <AuthProvider>
                  <Dashboard />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/profile" element={
              <ErrorBoundary>
                <AuthProvider>
                  <Profile />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/health-record" element={
              <ErrorBoundary>
                <AuthProvider>
                  <HealthRecord />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            {/* Appointment routes */}
            <Route path="/appointments/book" element={
              <ErrorBoundary>
                <AuthProvider>
                  <BookAppointment />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/appointments/urgent" element={
              <ErrorBoundary>
                <AuthProvider>
                  <UrgentConsultation />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/appointments/urgent-consultation" element={
              <ErrorBoundary>
                <AuthProvider>
                  <UrgentConsultation />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/appointments/scheduled" element={
              <ErrorBoundary>
                <AuthProvider>
                  <ScheduledConsultation />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/appointments/scheduled-consultation" element={
              <ErrorBoundary>
                <AuthProvider>
                  <ScheduledConsultation />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/appointments/home-visit" element={
              <ErrorBoundary>
                <AuthProvider>
                  <HomeVisit />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/appointments/payment" element={
              <ErrorBoundary>
                <AuthProvider>
                  <Payment />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/appointments/confirmation" element={
              <ErrorBoundary>
                <AuthProvider>
                  <Confirmation />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/appointments/history" element={
              <ErrorBoundary>
                <AuthProvider>
                  <AppointmentHistory />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/appointments/details/:id" element={
              <ErrorBoundary>
                <AuthProvider>
                  <AppointmentDetails />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            {/* Chat routes */}
            <Route path="/chat" element={
              <ErrorBoundary>
                <AuthProvider>
                  <ChatOverviewPage />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/chat/new" element={
              <ErrorBoundary>
                <AuthProvider>
                  <NewChatPage />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/chat/waiting" element={
              <ErrorBoundary>
                <AuthProvider>
                  <WaitingForDoctorPage />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/chat/session/:id" element={
              <ErrorBoundary>
                <AuthProvider>
                  <ChatSessionPage />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/chat/ended/:id" element={
              <ErrorBoundary>
                <AuthProvider>
                  <ChatEndedPage />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/consultations/summary/:id" element={
              <ErrorBoundary>
                <AuthProvider>
                  <VisitSummaryPage />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            {/* Medication routes */}
            <Route path="/medications" element={
              <ErrorBoundary>
                <AuthProvider>
                  <MedicationSummary />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/medications/add" element={
              <ErrorBoundary>
                <AuthProvider>
                  <AddMedication />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            <Route path="/medications/prescription/:id" element={
              <ErrorBoundary>
                <AuthProvider>
                  <PrescriptionDetails />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            {/* Root route */}
            <Route path="/" element={
              <ErrorBoundary>
                <AuthProvider>
                  <Index />
                </AuthProvider>
              </ErrorBoundary>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={
              <ErrorBoundary>
                <NotFound />
              </ErrorBoundary>
            } />
          </Routes>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
