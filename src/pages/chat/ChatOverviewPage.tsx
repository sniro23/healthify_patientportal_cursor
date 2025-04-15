
import React, { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Chat = {
  id: string;
  doctorName: string;
  lastMessage: string;
  timestamp: string;
  status: "active" | "closed";
};

const ChatOverviewPage = () => {
  const navigate = useNavigate();
  const [showClosedChats, setShowClosedChats] = useState(false);

  // Mock data - would be fetched from API in production
  const activeChats: Chat[] = [
    {
      id: "1",
      doctorName: "Dr. Silva",
      lastMessage: "Take 1 tablet twice daily after meals",
      timestamp: "10:30 AM",
      status: "active"
    },
    {
      id: "2",
      doctorName: "Dr. Ravi",
      lastMessage: "Schedule follow-up in 2 weeks",
      timestamp: "Yesterday",
      status: "active"
    }
  ];

  const closedChats: Chat[] = [
    {
      id: "3",
      doctorName: "Dr. Lin",
      lastMessage: "Your test results look normal",
      timestamp: "Mar 10",
      status: "closed"
    }
  ];

  const handleStartNewChat = () => {
    navigate("/chat/new");
  };

  const handleChatClick = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <PageContainer 
      title="Consult a Doctor" 
      showBackButton={true} 
      showBottomNav={true}
    >
      <div className="space-y-6">
        {/* Active Chats Section */}
        <section>
          <h2 className="text-lg font-medium mb-3 flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            Ongoing Chats
          </h2>
          
          <div className="space-y-2">
            {activeChats.length === 0 ? (
              <div className="bg-white rounded-lg p-4 text-center text-muted-foreground">
                No active consultations
              </div>
            ) : (
              activeChats.map(chat => (
                <div 
                  key={chat.id}
                  className="bg-white rounded-lg p-4 cursor-pointer shadow-sm hover:shadow transition-shadow"
                  onClick={() => handleChatClick(chat.id)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{chat.doctorName}</span>
                    <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {chat.lastMessage}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
        
        {/* Closed Chats Section */}
        <section>
          <div 
            className="flex justify-between items-center mb-3 cursor-pointer"
            onClick={() => setShowClosedChats(!showClosedChats)}
          >
            <h2 className="text-lg font-medium flex items-center">
              <span className="mr-2">🔒</span>
              Closed Chats ({closedChats.length})
            </h2>
            {showClosedChats ? 
              <ChevronDown className="h-5 w-5" /> : 
              <ChevronRight className="h-5 w-5" />
            }
          </div>
          
          {showClosedChats && (
            <div className="space-y-2">
              {closedChats.map(chat => (
                <div 
                  key={chat.id}
                  className="bg-white rounded-lg p-4 cursor-pointer shadow-sm hover:shadow transition-shadow"
                  onClick={() => handleChatClick(chat.id)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{chat.doctorName}</span>
                    <span className="text-xs text-muted-foreground">Closed on {chat.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage}
                    </p>
                    <Button variant="outline" size="sm" className="text-xs ml-2">
                      View Summary
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Start New Chat Button */}
        <Button 
          className="w-full py-6" 
          onClick={handleStartNewChat}
        >
          <Plus className="mr-2 h-5 w-5" />
          Start New Chat
        </Button>
      </div>
    </PageContainer>
  );
};

export default ChatOverviewPage;
