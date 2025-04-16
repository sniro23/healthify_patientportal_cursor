
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const supportFormSchema = z.object({
  category: z.string().min(1, "Please select a category"),
  subject: z.string().min(3, "Subject should be at least 3 characters"),
  description: z.string().min(10, "Description should be at least 10 characters")
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const HelpSupport = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("faq");

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      category: "",
      subject: "",
      description: ""
    }
  });

  const faqs: FAQ[] = [
    {
      id: "faq-1",
      question: "How do I book an appointment?",
      answer: "You can book an appointment by navigating to the Appointments section from the bottom navigation bar. From there, select the type of appointment you need and follow the on-screen instructions."
    },
    {
      id: "faq-2",
      question: "How do I update my personal information?",
      answer: "You can update your personal information in the Profile section. Go to App Settings tab and you'll find options to update your name, date of birth, gender, and other personal details."
    },
    {
      id: "faq-3",
      question: "How do I view my medical records?",
      answer: "Your medical records can be accessed from the Health Records section in the bottom navigation bar. There you can view your medical history, lab results, and other health information."
    },
    {
      id: "faq-4",
      question: "How do I change my subscription plan?",
      answer: "To change your subscription plan, go to the Profile section, then select the Payment tab. There you'll find options to view and modify your current subscription plan."
    },
    {
      id: "faq-5",
      question: "How do I add a new medication to my list?",
      answer: "You can add a new medication by going to the Medications section in the bottom navigation bar and selecting 'Add Medication'. Fill out the required information and save it to your list."
    }
  ];

  const filteredFAQs = searchQuery ? 
    faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ) : faqs;

  const onSubmit = (data: SupportFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Support ticket submitted:", data);
      setIsSubmitting(false);
      
      form.reset();
      
      toast({
        title: "Support ticket submitted",
        description: "We'll get back to you as soon as possible.",
      });
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Help & Support</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faq" className="space-y-4">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search for questions or topics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p>No results found for "{searchQuery}"</p>
              <p className="mt-2 text-sm">Try using different keywords or browse our FAQs above</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="billing">Billing Question</SelectItem>
                            <SelectItem value="appointment">Appointment Help</SelectItem>
                            <SelectItem value="account">Account Management</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Brief description of your issue" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide details about your issue or question..." 
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Include as much detail as possible to help us assist you better.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Ticket"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpSupport;
