
import React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type MessageType = {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isDoctor?: boolean;
  attachmentUrl?: string;
};

interface ChatMessageProps {
  message: MessageType;
  isCurrentUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCurrentUser }) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-3",
          isCurrentUser
            ? "bg-health-primary text-white"
            : "bg-white text-gray-800 border"
        )}
      >
        <div className="text-xs font-medium mb-1">
          {message.isDoctor ? "Doctor" : "Me"}
        </div>
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
        {message.attachmentUrl && (
          <div className="mt-2">
            <img
              src={message.attachmentUrl}
              alt="Attachment"
              className="max-w-full rounded"
            />
          </div>
        )}
        <div
          className={cn(
            "text-xs mt-1",
            isCurrentUser ? "text-white/80" : "text-gray-500"
          )}
        >
          {format(message.timestamp, "HH:mm")}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
