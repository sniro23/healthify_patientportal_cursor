
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickAccessCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  to: string;
  color?: string;
}

const QuickAccessCard = ({
  title,
  description,
  icon: Icon,
  to,
  color = "bg-health-highlight text-health-primary"
}: QuickAccessCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="flex items-center p-4 rounded-xl border border-slate-100 shadow-sm bg-white cursor-pointer transition-all hover:shadow-md"
      onClick={() => navigate(to)}
    >
      <div className={`rounded-full p-3 ${color} mr-4`}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-medium text-slate-900">{title}</h3>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </div>
    </div>
  );
};

export default QuickAccessCard;
