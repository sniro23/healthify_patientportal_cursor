
import { Home, FileText, MessageCircle, User, Pill } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { toast } = useToast();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showSessionAlert, setShowSessionAlert] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  
  // Session timeout in milliseconds (20 minutes)
  const SESSION_TIMEOUT = 20 * 60 * 1000;
  // Warning before session expiry (2 minutes before)
  const WARNING_BEFORE = 2 * 60 * 1000;

  useEffect(() => {
    // Track user activity
    const handleActivity = () => {
      setLastActivity(Date.now());
      if (sessionExpired) {
        setSessionExpired(false);
      }
    };

    // Add event listeners for activity tracking
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keypress", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("touchstart", handleActivity);
    window.addEventListener("scroll", handleActivity);

    // Check session status every minute
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - lastActivity;
      
      // If almost timeout, show warning
      if (timeElapsed > SESSION_TIMEOUT - WARNING_BEFORE && !showSessionAlert && !sessionExpired) {
        setShowSessionAlert(true);
      }
      
      // If timeout reached, end session
      if (timeElapsed > SESSION_TIMEOUT && !sessionExpired) {
        handleSessionExpiry();
      }
    }, 60000);
    
    return () => {
      // Clean up event listeners and interval
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keypress", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearInterval(intervalId);
    };
  }, [lastActivity, showSessionAlert, sessionExpired]);

  const isActive = (path: string) => {
    if (path === "/dashboard" && currentPath === "/dashboard") return true;
    if (path === "/health-record" && currentPath === "/health-record") return true;
    if (path === "/chat" && (currentPath === "/chat" || currentPath.startsWith("/chat/"))) return true;
    if (path === "/medications" && (currentPath === "/medications" || currentPath.startsWith("/medications/"))) return true;
    if (path === "/profile" && currentPath === "/profile") return true;
    return false;
  };
  
  const handleSessionExtend = () => {
    setLastActivity(Date.now());
    setShowSessionAlert(false);
    toast({
      title: "Session Extended",
      description: "Your session has been extended.",
    });
  };

  const handleSessionExpiry = () => {
    setSessionExpired(true);
    setShowSessionAlert(false);
    
    // For a real app, this would log the user out
    // For now, we'll just simulate it
    toast({
      title: "Session Expired",
      description: "You have been logged out due to inactivity.",
      variant: "destructive",
    });
    
    // In a real app, you would redirect to login
    // For this demo, we'll just simulate it with a delay
    setTimeout(() => {
      // This would be navigate("/login") in a real app
      console.log("User would be redirected to login page");
    }, 3000);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-health-primary text-white border-t border-health-primary/20 py-2 px-4 flex items-center justify-around z-50">
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center ${isActive("/dashboard") ? "text-white" : "text-white/70"}`}
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/health-record" 
          className={`flex flex-col items-center ${isActive("/health-record") ? "text-white" : "text-white/70"}`}
        >
          <FileText size={20} />
          <span className="text-xs mt-1">Records</span>
        </Link>
        
        <Link 
          to="/medications" 
          className={`flex flex-col items-center ${isActive("/medications") ? "text-white" : "text-white/70"}`}
        >
          <Pill size={20} />
          <span className="text-xs mt-1">Meds</span>
        </Link>
        
        <Link 
          to="/chat" 
          className={`flex flex-col items-center ${isActive("/chat") ? "text-white" : "text-white/70"}`}
        >
          <MessageCircle size={20} />
          <span className="text-xs mt-1">Chat</span>
        </Link>
        
        <Link 
          to="/profile" 
          className={`flex flex-col items-center ${isActive("/profile") ? "text-white" : "text-white/70"}`}
        >
          <User size={20} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>

      {/* Session Timeout Warning */}
      <AlertDialog open={showSessionAlert} onOpenChange={setShowSessionAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Session About to Expire</AlertDialogTitle>
            <AlertDialogDescription>
              Your session will expire in about 2 minutes due to inactivity. 
              Would you like to continue using the application?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleSessionExpiry}>Log Out</AlertDialogCancel>
            <AlertDialogAction onClick={handleSessionExtend}>Continue Session</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BottomNavigation;
