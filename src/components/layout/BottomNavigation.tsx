
import { Home, FileText, MessageCircle, User, Pill } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/dashboard" && currentPath === "/dashboard") return true;
    if (path === "/health-record" && currentPath === "/health-record") return true;
    if (path === "/chat" && (currentPath === "/chat" || currentPath.startsWith("/chat/"))) return true;
    if (path === "/medications" && (currentPath === "/medications" || currentPath.startsWith("/medications/"))) return true;
    if (path === "/profile" && currentPath === "/profile") return true;
    return false;
  };

  return (
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
  );
};

export default BottomNavigation;
