
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  HelpCircle, 
  MessageCircle, 
  Send, 
  ChevronRight 
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface FAQ {
  question: string;
  answer: string;
}

const HelpSupport = () => {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [liveChatEnabled, setLiveChatEnabled] = useState(false);
  
  const faqs: FAQ[] = [
    {
      question: "How do I reschedule an appointment?",
      answer: "To reschedule an appointment, navigate to the Appointments section, select the appointment you wish to change, and tap on the 'Reschedule' button. You'll be prompted to select a new date and time."
    },
    {
      question: "How can I view my medical records?",
      answer: "Your medical records are available in the Health Records section. You can view test results, prescriptions, and visit summaries. For older records, you may need to request them specifically from your healthcare provider."
    },
    {
      question: "How do I update my insurance information?",
      answer: "To update your insurance details, go to Profile > Payment Settings > Insurance Information. You can add new insurance policies, update existing ones, or set a primary insurance provider."
    },
    {
      question: "Can I share my health records with a new doctor?",
      answer: "Yes, you can share your health records with other healthcare providers. In the Health Records section, select the records you want to share, tap the 'Share' button, and choose how you'd like to send them (email, direct share, or download PDF)."
    }
  ];
  
  const handleSubmitSupport = () => {
    if (!subject.trim() || !supportMessage.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both a subject and message",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Support ticket submitted:", { subject, message: supportMessage });
      setIsSending(false);
      setSupportMessage("");
      setSubject("");
      
      toast({
        title: "Support ticket created",
        description: "We'll respond to your inquiry as soon as possible",
      });
    }, 800);
  };
  
  const handleToggleLiveChat = () => {
    setLiveChatEnabled(!liveChatEnabled);
    
    toast({
      title: liveChatEnabled ? "Live chat disabled" : "Live chat enabled",
      description: liveChatEnabled 
        ? "Live chat support is now turned off" 
        : "Live chat support is now available",
    });
  };
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Help & Support</h2>
      
      {/* FAQ Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <HelpCircle className="w-4 h-4 mr-2" /> 
          Frequently Asked Questions
        </h3>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-slate-600">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <Button variant="link" className="mt-2 p-0 text-health-accent">
          View all FAQs <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      
      {/* Support Ticket */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <MessageCircle className="w-4 h-4 mr-2" /> 
          Submit a Support Ticket
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
            <Input 
              id="subject"
              placeholder="Briefly describe your issue"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <Textarea 
              id="message"
              placeholder="Please provide details about your issue or question"
              rows={4}
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleSubmitSupport} 
          className="mt-4"
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Submit Ticket"}
          {!isSending && <Send className="w-4 h-4 ml-2" />}
        </Button>
      </div>
      
      {/* Live Chat Option */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">Live Chat Support</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enable to get instant support from our team
            </p>
          </div>
          <Switch
            checked={liveChatEnabled}
            onCheckedChange={handleToggleLiveChat}
          />
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
