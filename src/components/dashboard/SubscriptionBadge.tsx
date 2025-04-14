
import { cn } from "@/lib/utils";

interface SubscriptionBadgeProps {
  tier: string;
  className?: string;
}

const SubscriptionBadge = ({ tier, className }: SubscriptionBadgeProps) => {
  let badgeClass = "";
  
  switch (tier.toLowerCase()) {
    case "category a":
    case "a":
      badgeClass = "bg-purple-100 text-purple-800";
      break;
    case "category b":
    case "b":
      badgeClass = "bg-blue-100 text-blue-800";
      break;
    case "category c":
    case "c":
      badgeClass = "bg-green-100 text-green-800";
      break;
    case "category d":
    case "d":
      badgeClass = "bg-yellow-100 text-yellow-800";
      break;
    default:
      badgeClass = "bg-gray-100 text-gray-800";
      break;
  }
  
  return (
    <span className={cn("text-xs py-1 px-2 rounded-full", badgeClass, className)}>
      {tier.toUpperCase()}
    </span>
  );
};

export default SubscriptionBadge;
