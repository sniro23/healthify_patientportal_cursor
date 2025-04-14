
import { Home, FileText, MessageCircle, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-2 px-4 flex items-center justify-around z-50">
      <Link 
        to="/" 
        className={`flex flex-col items-center ${isActive("/") ? "text-health-primary" : "text-slate-500"}`}
      >
        <Home size={20} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link 
        to="/records" 
        className={`flex flex-col items-center ${isActive("/records") ? "text-health-primary" : "text-slate-500"}`}
      >
        <FileText size={20} />
        <span className="text-xs mt-1">Records</span>
      </Link>
      
      <Link 
        to="/chat" 
        className={`flex flex-col items-center ${isActive("/chat") ? "text-health-primary" : "text-slate-500"}`}
      >
        <MessageCircle size={20} />
        <span className="text-xs mt-1">Chat</span>
      </Link>
      
      <Link 
        to="/profile" 
        className={`flex flex-col items-center ${isActive("/profile") ? "text-health-primary" : "text-slate-500"}`}
      >
        <User size={20} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
