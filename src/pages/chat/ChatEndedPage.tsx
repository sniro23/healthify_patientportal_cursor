
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star, Download, Calendar } from "lucide-react";

const ChatEndedPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  
  // Mock data - would be fetched from API in production
  const chatData = {
    doctorName: "Dr. Silva",
    specialty: "General Physician",
    endedAt: new Date().toISOString(),
  };
  
  const handleRating = (value: number) => {
    setRating(value);
  };
  
  const handleNewChat = () => {
    navigate("/chat/new");
  };
  
  const handleBookFollowUp = () => {
    navigate("/appointments/book");
  };
  
  const handleViewSummary = () => {
    navigate(`/consultations/summary/${chatId}`);
  };
  
  return (
    <PageContainer 
      title="Consultation Ended" 
      showBackButton={true}
    >
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-4">
          <MessageSquare className="h-10 w-10 text-muted-foreground" />
        </div>
        
        <h1 className="text-xl font-semibold mb-2">Chat session has ended</h1>
        <p className="text-muted-foreground mb-6">
          Your consultation with {chatData.doctorName} ({chatData.specialty}) has concluded
        </p>
        
        <div className="mb-8">
          <p className="text-sm font-medium mb-2">Rate your experience</p>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer ${
                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full flex justify-center"
            onClick={handleViewSummary}
          >
            <Download className="mr-2 h-5 w-5" />
            View Visit Summary
          </Button>
          
          <Button 
            className="w-full flex justify-center"
            onClick={handleBookFollowUp}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Book Follow-up
          </Button>
          
          <Button 
            variant="outline"
            className="w-full flex justify-center"
            onClick={handleNewChat}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Start New Chat
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default ChatEndedPage;
