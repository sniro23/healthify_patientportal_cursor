
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";

const AddMedication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medication, setMedication] = useState({
    name: "",
    dosage: "",
    frequency: "",
    startDate: new Date().toISOString().split('T')[0], // Today's date formatted as YYYY-MM-DD
    endDate: "",
    prescribedBy: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setMedication(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to add medications",
        variant: "destructive",
      });
      return;
    }

    if (!medication.name || !medication.dosage || !medication.frequency || !medication.startDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('medications')
        .insert({
          user_id: user.id,
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          start_date: medication.startDate,
          end_date: medication.endDate || null,
          prescribed_by: medication.prescribedBy || null,
          notes: medication.notes || null
        });

      if (error) throw error;
      
      toast({
        title: "Medication added",
        description: "Your medication has been added successfully",
      });
      
      navigate("/medications");
    } catch (error: any) {
      console.error("Error adding medication:", error);
      toast({
        title: "Failed to add medication",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer title="Add Medication" showBackButton>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add Medication</h1>
        <p className="text-slate-600 mt-1">
          Add a new medication to your records
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Medication Name*</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Metformin"
            value={medication.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage*</Label>
          <Input
            id="dosage"
            name="dosage"
            placeholder="e.g., 500mg"
            value={medication.dosage}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency*</Label>
          <Select 
            onValueChange={(value) => handleSelectChange("frequency", value)}
            value={medication.frequency}
          >
            <SelectTrigger id="frequency">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Once daily">Once daily</SelectItem>
              <SelectItem value="Twice daily">Twice daily</SelectItem>
              <SelectItem value="Three times daily">Three times daily</SelectItem>
              <SelectItem value="Four times daily">Four times daily</SelectItem>
              <SelectItem value="As needed">As needed</SelectItem>
              <SelectItem value="Every other day">Every other day</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date*</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={medication.startDate}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date (if applicable)</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            value={medication.endDate}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="prescribedBy">Prescribed By</Label>
          <Input
            id="prescribedBy"
            name="prescribedBy"
            placeholder="e.g., Dr. Smith"
            value={medication.prescribedBy}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any special instructions or notes about this medication"
            value={medication.notes}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button"
            variant="outline"
            onClick={() => navigate("/medications")}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            className="bg-health-primary hover:bg-health-accent"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Medication"}
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default AddMedication;
