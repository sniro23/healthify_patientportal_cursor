import { Button } from "@/components/ui/button";
import { Pencil, Plus, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { commonMedications, searchMedications, MedicationOption } from "@/lib/data/medications";
import { toFhirMedicationStatement } from "@/lib/fhir/types";
import { Combobox } from "@/components/ui/combobox";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
}

interface MedicationsSectionProps {
  isEditing: boolean;
}

const MedicationsSection: React.FC<MedicationsSectionProps> = ({ isEditing }) => {
  const { toast } = useToast();
  const [localIsEditing, setLocalIsEditing] = useState(isEditing);
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

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MedicationOption[]>([]);
  const [selectedMedication, setSelectedMedication] = useState<MedicationOption | null>(null);
  
  useEffect(() => {
    setLocalIsEditing(isEditing);
  }, [isEditing]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const results = searchMedications(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleMedicationSelect = (medication: MedicationOption) => {
    setSelectedMedication(medication);
    setNewMedication({
      ...newMedication,
      name: medication.name,
    });
    setSearchQuery("");
  };
  
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
    
    setSelectedMedication(null);
    
    toast({
      title: "Medication added",
      description: `${newMedication.name} has been added to your medications`
    });

    // Convert to FHIR format (demonstration)
    const fhirMedicationStatement = toFhirMedicationStatement(
      {
        id: `med${Date.now()}`,
        name: newMedication.name,
        dosage: newMedication.dosage,
        frequency: newMedication.frequency,
        startDate: newMedication.startDate || new Date().toISOString().split('T')[0],
        endDate: newMedication.endDate
      },
      "patient-1" // Mock patient ID
    );
    
    // Log FHIR data (in a real app this would be saved to the database)
    console.log("FHIR Medication Statement:", fhirMedicationStatement);
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
          onClick={() => setLocalIsEditing(true)}
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
      
      <Dialog open={localIsEditing} onOpenChange={setLocalIsEditing}>
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
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="medicationSearch">Search Medication</Label>
                  <div className="relative">
                    <Input 
                      id="medicationSearch" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Start typing to search medications"
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  {searchResults.length > 0 && searchQuery.length >= 2 && (
                    <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                      {searchResults.map((med) => (
                        <div 
                          key={med.id} 
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleMedicationSelect(med)}
                        >
                          <div className="font-medium">{med.name}</div>
                          {med.genericName && (
                            <div className="text-xs text-gray-500">{med.genericName}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-1">
                    {selectedMedication ? (
                      <span>Selected: {selectedMedication.name} ({selectedMedication.genericName})</span>
                    ) : (
                      <span>Type at least 2 characters to search common medications</span>
                    )}
                  </div>
                </div>

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
                    {selectedMedication ? (
                      <Select
                        value={newMedication.dosage}
                        onValueChange={(value) => setNewMedication({ ...newMedication, dosage: value })}
                      >
                        <SelectTrigger id="medicationDosage">
                          <SelectValue placeholder="Select dosage" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedMedication.commonDosages.map((dosage) => (
                            <SelectItem key={dosage} value={dosage}>
                              {dosage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        id="medicationDosage" 
                        value={newMedication.dosage}
                        onChange={e => setNewMedication({ ...newMedication, dosage: e.target.value })}
                        placeholder="e.g. 500mg"
                      />
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicationFrequency">Frequency</Label>
                    {selectedMedication ? (
                      <Select
                        value={newMedication.frequency}
                        onValueChange={(value) => setNewMedication({ ...newMedication, frequency: value })}
                      >
                        <SelectTrigger id="medicationFrequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedMedication.commonFrequencies.map((frequency) => (
                            <SelectItem key={frequency} value={frequency}>
                              {frequency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input 
                        id="medicationFrequency" 
                        value={newMedication.frequency}
                        onChange={e => setNewMedication({ ...newMedication, frequency: e.target.value })}
                        placeholder="e.g. Once daily"
                      />
                    )}
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
                
                <div className="space-y-2">
                  <Label htmlFor="medicationEndDate">End Date (Optional)</Label>
                  <Input 
                    id="medicationEndDate" 
                    type="date"
                    value={newMedication.endDate || ""}
                    onChange={e => setNewMedication({ ...newMedication, endDate: e.target.value })}
                  />
                </div>
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
              <Button type="button" variant="outline" onClick={() => setLocalIsEditing(false)}>
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
