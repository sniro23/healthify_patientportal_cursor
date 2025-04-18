import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { SimplifiedCombobox } from "@/components/ui/simplified-combobox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const serviceTypes = [
  { value: "general", label: "General Medicine" },
  { value: "mental", label: "Mental Health" },
  { value: "physio", label: "Physiotherapy" },
  { value: "nutrition", label: "Nutrition" },
  { value: "dermatology", label: "Dermatology" },
  { value: "pediatrics", label: "Pediatrics" }
];

const NewChatPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [serviceType, setServiceType] = useState("");
  const [query, setQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceType) {
      toast({
        title: "Service type required",
        description: "Please select a service type",
        variant: "destructive"
      });
      return;
    }
    
    if (!query.trim()) {
      toast({
        title: "Query required",
        description: "Please enter your symptoms or query",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate submission
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/chat/waiting");
    }, 1500);
  };
  
  return (
    <PageContainer title="New Consultation" showBackButton={true}>
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Type</label>
            <SimplifiedCombobox
              options={serviceTypes}
              value={serviceType}
              onSelect={setServiceType}
              placeholder="Select service type"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Symptoms or Query</label>
            <Textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Please describe your symptoms or health concern..."
              className="min-h-[150px]"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Query"
            )}
          </Button>
        </form>
      </div>
    </PageContainer>
  );
};

export default NewChatPage;
