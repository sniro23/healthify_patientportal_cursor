
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
      badgeClass = "subscription-badge-a";
      break;
    case "category b":
    case "b":
      badgeClass = "subscription-badge-b";
      break;
    case "category c":
    case "c":
      badgeClass = "subscription-badge-c";
      break;
    case "category d":
    case "d":
      badgeClass = "subscription-badge-d";
      break;
    default:
      badgeClass = "subscription-badge-free";
      break;
  }
  
  return (
    <span className={cn("subscription-badge", badgeClass, className)}>
      {tier}
    </span>
  );
};

export default SubscriptionBadge;
