
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { commonMedications } from "@/lib/data/medications";
import { MedicationOption } from "@/lib/data/medications";

const AddMedication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [medication, setMedication] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [instructions, setInstructions] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedMedication, setSelectedMedication] = useState<MedicationOption | null>(null);

  const handleSelectMedication = (medicationId: string) => {
    const med = commonMedications.find(m => m.id === medicationId);
    if (med) {
      setSelectedMedication(med);
      setMedication(med.name);
    }
  };

  const handleSelectDosage = (selectedDosage: string) => {
    setDosage(selectedDosage);
  };

  const handleSelectFrequency = (selectedFrequency: string) => {
    setFrequency(selectedFrequency);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!medication || !dosage || !frequency || !startDate) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    // Save medication (in a real app, this would be a database call)
    toast({
      title: "Medication added",
      description: `${medication} has been added to your medications`,
    });
    
    navigate("/medications");
  };

  return (
    <PageContainer title="Add Medication" showBackButton={true}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Add Routine Medication</h1>
        <p className="text-slate-600 mt-1">
          Add a medication you're currently taking
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="medication">Medication Name</Label>
          <Select onValueChange={handleSelectMedication}>
            <SelectTrigger>
              <SelectValue placeholder="Select medication" />
            </SelectTrigger>
            <SelectContent>
              {commonMedications.map((med) => (
                <SelectItem key={med.id} value={med.id}>
                  {med.name} {med.genericName ? `(${med.genericName})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <Select onValueChange={handleSelectDosage}>
            <SelectTrigger>
              <SelectValue placeholder="Select dosage" />
            </SelectTrigger>
            <SelectContent>
              {selectedMedication?.commonDosages.map((dose) => (
                <SelectItem key={dose} value={dose}>
                  {dose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frequency">Frequency</Label>
          <Select onValueChange={handleSelectFrequency}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {selectedMedication?.commonFrequencies.map((freq) => (
                <SelectItem key={freq} value={freq}>
                  {freq}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>End Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) =>
                  (startDate && date < startDate) || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="E.g., Take with food, after meals, etc."
          />
        </div>

        <Button type="submit" className="w-full">Add Medication</Button>
      </form>
    </PageContainer>
  );
};

export default AddMedication;
