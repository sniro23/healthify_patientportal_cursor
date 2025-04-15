
import React from "react";

interface SubscriptionNoticeProps {
  isSubscriber: boolean;
}

const SubscriptionNotice: React.FC<SubscriptionNoticeProps> = ({ isSubscriber }) => {
  if (isSubscriber) {
    return (
      <div className="bg-green-50 text-green-800 border border-green-200 p-4 rounded-lg">
        <h3 className="font-medium">Subscriber Benefit</h3>
        <p className="text-sm mt-1">
          As a subscriber, you can book appointments without immediate payment. Billing will be processed at the end of your billing cycle.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-blue-50 text-blue-800 border border-blue-200 p-4 rounded-lg">
      <h3 className="font-medium">Non-Subscriber Notice</h3>
      <p className="text-sm mt-1">
        You'll need to make a payment after selecting your appointment details to confirm your booking.
      </p>
    </div>
  );
};

export default SubscriptionNotice;
