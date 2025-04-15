
import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import ChatMessage, { MessageType } from "@/components/chat/ChatMessage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip } from "lucide-react";
import { format } from "date-fns";

const ChatSessionPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock data - would come from API in production
  const [doctorInfo] = useState({
    id: "doctor-1",
    name: "Dr. Silva",
    specialty: "General Physician",
    status: "Live" as "Live" | "Ended"
  });
  
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: "1",
      senderId: "doctor-1",
      content: "Hello, how can I help you today?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isDoctor: true
    }
  ]);
  
  const currentUserId = "user-1"; // In production, this would come from authentication
  
  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: MessageType = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate doctor typing
    setIsTyping(true);
    
    // Simulate doctor response after delay
    setTimeout(() => {
      setIsTyping(false);
      
      // Choose a response based on the user message
      let responseText = "I understand. Let me think about this.";
      const lowerCaseMessage = newMessage.toLowerCase();
      
      if (lowerCaseMessage.includes("fever")) {
        responseText = "How long have you had the fever? Any other symptoms like cough or cold?";
      } else if (lowerCaseMessage.includes("headache")) {
        responseText = "Is the headache continuous or intermittent? Have you taken any medication for it?";
      } else if (lowerCaseMessage.includes("thank")) {
        responseText = "You're welcome! Please don't hesitate if you have any other questions.";
      }
      
      const doctorMessage: MessageType = {
        id: `msg-${Date.now()}`,
        senderId: doctorInfo.id,
        content: responseText,
        timestamp: new Date(),
        isDoctor: true
      };
      
      setMessages(prev => [...prev, doctorMessage]);
    }, 2000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <PageContainer 
      title={`${doctorInfo.name} (${doctorInfo.specialty})`}
      showBackButton={true}
      showBottomNav={false}
      className="p-0 flex flex-col h-screen"
    >
      {/* Status Bar */}
      <div className="bg-white border-b px-4 py-2 flex justify-between items-center">
        <div className="text-sm">
          Session started at {format(new Date(), "h:mm a")}
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
          <span className="text-sm font-medium">{doctorInfo.status}</span>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50">
        {messages.map(message => (
          <ChatMessage 
            key={message.id}
            message={message}
            isCurrentUser={message.senderId === currentUserId}
          />
        ))}
        
        {isTyping && (
          <div className="flex items-center ml-2 mb-4">
            <div className="bg-white text-gray-500 rounded-lg p-3">
              Doctor is typing<span className="typing-animation">...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input */}
      <div className="bg-white border-t p-3 flex items-end">
        <Button variant="outline" size="icon" className="mr-2 h-10 w-10 flex-shrink-0">
          <Paperclip className="h-5 w-5" />
        </Button>
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[40px] resize-none"
          rows={1}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={!newMessage.trim()}
          className="ml-2 h-10 flex-shrink-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </PageContainer>
  );
};

export default ChatSessionPage;
