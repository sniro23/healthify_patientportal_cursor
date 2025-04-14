
import { Button } from "@/components/ui/button";
import { Pencil, Plus, X } from "lucide-react";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

const MedicationsSection = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "med1",
      name: "Metformin",
      dosage: "500mg",
      frequency: "BID (Twice daily)",
      startDate: "2024-06-01",
    },
    {
      id: "med2",
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "OD (Once daily)",
      startDate: "2024-07-15",
    }
  ]);
  
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: "",
    dosage: "",
    frequency: "",
    startDate: new Date().toISOString().split('T')[0]
  });
  
  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const updatedMedications = [
      ...medications,
      {
        id: `med${Date.now()}`,
        name: newMedication.name,
        dosage: newMedication.dosage,
        frequency: newMedication.frequency,
        startDate: newMedication.startDate || new Date().toISOString().split('T')[0],
        endDate: newMedication.endDate
      }
    ];
    
    setMedications(updatedMedications);
    
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      startDate: new Date().toISOString().split('T')[0]
    });
    
    toast({
      title: "Medication added",
      description: `${newMedication.name} has been added to your medications`
    });
  };
  
  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    
    toast({
      title: "Medication removed",
      description: "The medication has been removed from your list"
    });
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Medications</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>
      
      {medications.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell>{formatDate(med.startDate)}</TableCell>
                  <TableCell>{formatDate(med.endDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">No current medications</p>
      )}
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Medications</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4 mb-6">
              <h4 className="text-sm font-medium">Current Medications</h4>
              
              {medications.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {medications.map((med) => (
                        <TableRow key={med.id}>
                          <TableCell className="font-medium">{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={() => handleRemoveMedication(med.id)}
                            >
                              <X size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">No current medications</p>
              )}
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3">Add New Medication</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medicationName">Medication Name</Label>
                  <Input 
                    id="medicationName" 
                    value={newMedication.name}
                    onChange={e => setNewMedication({ ...newMedication, name: e.target.value })}
                    placeholder="Enter medication name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicationDosage">Dosage</Label>
                  <Input 
                    id="medicationDosage" 
                    value={newMedication.dosage}
                    onChange={e => setNewMedication({ ...newMedication, dosage: e.target.value })}
                    placeholder="e.g. 500mg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="medicationFrequency">Frequency</Label>
                  <Input 
                    id="medicationFrequency" 
                    value={newMedication.frequency}
                    onChange={e => setNewMedication({ ...newMedication, frequency: e.target.value })}
                    placeholder="e.g. Once daily"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicationStartDate">Start Date</Label>
                  <Input 
                    id="medicationStartDate" 
                    type="date"
                    value={newMedication.startDate}
                    onChange={e => setNewMedication({ ...newMedication, startDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="medicationEndDate">End Date (Optional)</Label>
                <Input 
                  id="medicationEndDate" 
                  type="date"
                  value={newMedication.endDate || ""}
                  onChange={e => setNewMedication({ ...newMedication, endDate: e.target.value })}
                />
              </div>
              
              <Button 
                type="button" 
                onClick={handleAddMedication}
                className="mt-4"
                disabled={!newMedication.name || !newMedication.dosage || !newMedication.frequency}
              >
                <Plus size={16} className="mr-1" /> Add Medication
              </Button>
            </div>
            
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationsSection;
