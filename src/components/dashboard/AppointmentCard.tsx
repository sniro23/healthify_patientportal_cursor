
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AppointmentCardProps {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: "video" | "audio" | "text" | "in-person";
  status: "upcoming" | "completed" | "cancelled";
}

const AppointmentCard = ({
  id,
  doctorName,
  specialty,
  date,
  time,
  type,
  status
}: AppointmentCardProps) => {
  const navigate = useNavigate();
  
  const getStatusColor = () => {
    switch (status) {
      case "upcoming":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case "video":
        return "Video Consultation";
      case "audio":
        return "Audio Call";
      case "text":
        return "Text Chat";
      case "in-person":
        return "In-Person Visit";
      default:
        return "Consultation";
    }
  };
  
  const handleViewDetails = () => {
    navigate(`/appointments/${id}`);
  };

  return (
    <div className={`p-4 rounded-lg border ${getStatusColor()} mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium">Dr. {doctorName}</h3>
          <p className="text-sm text-slate-600">{specialty}</p>
          
          <div className="flex items-center mt-2 text-sm">
            <Calendar size={14} className="mr-1" />
            <span>{date} · {time} · {getTypeLabel()}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium capitalize mb-2">{status}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewDetails}
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
