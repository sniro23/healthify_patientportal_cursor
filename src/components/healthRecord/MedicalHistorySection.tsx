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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { commonConditions, searchConditions, ConditionOption } from "@/lib/data/conditions";
import { toFhirCondition } from "@/lib/fhir/types";

interface Condition {
  id: string;
  name: string;
  code?: string;
}

interface Surgery {
  id: string;
  name: string;
  year: number;
}

interface Allergy {
  id: string;
  name: string;
  reaction: string;
  notes?: string;
}

interface MedicalHistoryInfo {
  conditions: Condition[];
  surgeries: Surgery[];
  allergies: Allergy[];
}

interface MedicalHistorySectionProps {
  isEditing: boolean;
}

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ isEditing }) => {
  const { toast } = useToast();
  const [localIsEditing, setLocalIsEditing] = useState(isEditing);
  const [editMode, setEditMode] = useState<"conditions" | "surgeries" | "allergies" | null>(null);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistoryInfo>({
    conditions: [
      { id: "c1", name: "Hypertension", code: "I10" },
      { id: "c2", name: "Asthma", code: "J45.909" }
    ],
    surgeries: [
      { id: "s1", name: "Appendectomy", year: 2015 }
    ],
    allergies: [
      { id: "a1", name: "Penicillin", reaction: "Rash", notes: "Mild skin reaction" }
    ]
  });
  
  const [newCondition, setNewCondition] = useState<Partial<Condition>>({ name: "" });
  const [newSurgery, setNewSurgery] = useState<Partial<Surgery>>({ name: "", year: new Date().getFullYear() });
  const [newAllergy, setNewAllergy] = useState<Partial<Allergy>>({ name: "", reaction: "" });
  
  const [conditionSearchQuery, setConditionSearchQuery] = useState("");
  const [conditionSearchResults, setConditionSearchResults] = useState<ConditionOption[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<ConditionOption | null>(null);
  
  useEffect(() => {
    setLocalIsEditing(isEditing);
    if (conditionSearchQuery.length >= 2) {
      const results = searchConditions(conditionSearchQuery);
      setConditionSearchResults(results);
    } else {
      setConditionSearchResults([]);
    }
  }, [isEditing, conditionSearchQuery]);

  const handleConditionSelect = (condition: ConditionOption) => {
    setSelectedCondition(condition);
    setNewCondition({
      name: condition.name,
      code: condition.code
    });
    setConditionSearchQuery("");
  };
  
  const handleAddCondition = () => {
    if (!newCondition.name) return;
    
    const updatedConditions = [
      ...medicalHistory.conditions,
      {
        id: `c${Date.now()}`,
        name: newCondition.name,
        code: newCondition.code
      }
    ];
    
    setMedicalHistory({
      ...medicalHistory,
      conditions: updatedConditions
    });
    
    // Convert to FHIR format (demonstration)
    const fhirCondition = toFhirCondition(
      {
        id: `c${Date.now()}`,
        name: newCondition.name,
        code: newCondition.code
      },
      "patient-1" // Mock patient ID
    );
    
    // Log FHIR data (in a real app this would be saved to the database)
    console.log("FHIR Condition:", fhirCondition);
    
    setNewCondition({ name: "" });
    setSelectedCondition(null);
    
    toast({
      title: "Condition added",
      description: `${newCondition.name} has been added to your medical conditions`
    });
  };
  
  const handleAddSurgery = () => {
    if (!newSurgery.name || !newSurgery.year) return;
    
    const updatedSurgeries = [
      ...medicalHistory.surgeries,
      {
        id: `s${Date.now()}`,
        name: newSurgery.name,
        year: newSurgery.year
      }
    ];
    
    setMedicalHistory({
      ...medicalHistory,
      surgeries: updatedSurgeries
    });
    
    setNewSurgery({ name: "", year: new Date().getFullYear() });
    
    toast({
      title: "Surgery added",
      description: `${newSurgery.name} has been added to your surgical history`
    });
  };
  
  const handleAddAllergy = () => {
    if (!newAllergy.name || !newAllergy.reaction) return;
    
    const updatedAllergies = [
      ...medicalHistory.allergies,
      {
        id: `a${Date.now()}`,
        name: newAllergy.name,
        reaction: newAllergy.reaction,
        notes: newAllergy.notes
      }
    ];
    
    setMedicalHistory({
      ...medicalHistory,
      allergies: updatedAllergies
    });
    
    setNewAllergy({ name: "", reaction: "" });
    
    toast({
      title: "Allergy added",
      description: `${newAllergy.name} has been added to your allergies`
    });
  };
  
  const handleRemoveCondition = (id: string) => {
    setMedicalHistory({
      ...medicalHistory,
      conditions: medicalHistory.conditions.filter(c => c.id !== id)
    });
    
    toast({
      title: "Condition removed",
      description: "The condition has been removed from your medical history"
    });
  };
  
  const handleRemoveSurgery = (id: string) => {
    setMedicalHistory({
      ...medicalHistory,
      surgeries: medicalHistory.surgeries.filter(s => s.id !== id)
    });
    
    toast({
      title: "Surgery removed",
      description: "The surgery has been removed from your medical history"
    });
  };
  
  const handleRemoveAllergy = (id: string) => {
    setMedicalHistory({
      ...medicalHistory,
      allergies: medicalHistory.allergies.filter(a => a.id !== id)
    });
    
    toast({
      title: "Allergy removed",
      description: "The allergy has been removed from your medical history"
    });
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Medical History</h3>
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
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-slate-500 mb-2">Known Conditions</p>
          <div className="flex flex-wrap gap-2">
            {medicalHistory.conditions.length > 0 ? (
              medicalHistory.conditions.map(condition => (
                <Badge key={condition.id} variant="outline" className="py-1 px-2">
                  {condition.name} {condition.code && <span className="text-xs opacity-60 ml-1">({condition.code})</span>}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">No known conditions</p>
            )}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-slate-500 mb-2">Past Surgeries</p>
          <div className="flex flex-wrap gap-2">
            {medicalHistory.surgeries.length > 0 ? (
              medicalHistory.surgeries.map(surgery => (
                <Badge key={surgery.id} variant="outline" className="py-1 px-2">
                  {surgery.name} <span className="text-xs opacity-60 ml-1">({surgery.year})</span>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">No past surgeries</p>
            )}
          </div>
        </div>
        
        <div>
          <p className="text-sm text-slate-500 mb-2">Allergies</p>
          <div className="flex flex-wrap gap-2">
            {medicalHistory.allergies.length > 0 ? (
              medicalHistory.allergies.map(allergy => (
                <Badge key={allergy.id} variant="outline" className="py-1 px-2 bg-red-50 border-red-200">
                  {allergy.name} <span className="text-xs opacity-60 ml-1">({allergy.reaction})</span>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic">No known allergies</p>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={localIsEditing} onOpenChange={setLocalIsEditing}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Medical History</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex space-x-2 border-b">
              <Button 
                type="button" 
                variant={editMode === "conditions" ? "default" : "ghost"}
                size="sm"
                onClick={() => setEditMode("conditions")}
              >
                Conditions
              </Button>
              <Button 
                type="button" 
                variant={editMode === "surgeries" ? "default" : "ghost"}
                size="sm"
                onClick={() => setEditMode("surgeries")}
              >
                Surgeries
              </Button>
              <Button 
                type="button" 
                variant={editMode === "allergies" ? "default" : "ghost"}
                size="sm"
                onClick={() => setEditMode("allergies")}
              >
                Allergies
              </Button>
            </div>
            
            {editMode === "conditions" && (
              <div className="space-y-4 mt-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {medicalHistory.conditions.map(condition => (
                    <Badge key={condition.id} variant="outline" className="py-1 px-3">
                      {condition.name} {condition.code && <span className="text-xs opacity-60 ml-1">({condition.code})</span>}
                      <button 
                        className="ml-2 hover:text-red-500"
                        onClick={() => handleRemoveCondition(condition.id)}
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conditionSearch">Search Condition</Label>
                  <div className="relative">
                    <Input 
                      id="conditionSearch" 
                      value={conditionSearchQuery}
                      onChange={(e) => setConditionSearchQuery(e.target.value)}
                      placeholder="Start typing to search conditions"
                      className="pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  
                  {conditionSearchResults.length > 0 && conditionSearchQuery.length >= 2 && (
                    <div className="absolute z-10 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                      {conditionSearchResults.map((condition) => (
                        <div 
                          key={condition.id} 
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleConditionSelect(condition)}
                        >
                          <div className="font-medium">{condition.name}</div>
                          {condition.code && (
                            <div className="text-xs text-gray-500">ICD-10: {condition.code}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-1">
                    {selectedCondition ? (
                      <span>Selected: {selectedCondition.name} (ICD-10: {selectedCondition.code})</span>
                    ) : (
                      <span>Type at least 2 characters to search common conditions</span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conditionName">Condition Name</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="conditionName" 
                      value={newCondition.name}
                      onChange={e => setNewCondition({ ...newCondition, name: e.target.value })}
                      placeholder="Enter condition name"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="conditionCode">Condition Code (optional)</Label>
                  <Input 
                    id="conditionCode" 
                    value={newCondition.code || ""}
                    onChange={e => setNewCondition({ ...newCondition, code: e.target.value })}
                    placeholder="ICD-10 or SNOMED code"
                  />
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleAddCondition}
                  disabled={!newCondition.name}
                >
                  <Plus size={16} className="mr-1" /> Add Condition
                </Button>
              </div>
            )}
            
            {editMode === "surgeries" && (
              <div className="space-y-4 mt-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {medicalHistory.surgeries.map(surgery => (
                    <Badge key={surgery.id} variant="outline" className="py-1 px-3">
                      {surgery.name} ({surgery.year})
                      <button 
                        className="ml-2 hover:text-red-500"
                        onClick={() => handleRemoveSurgery(surgery.id)}
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="surgeryName">Surgery Name</Label>
                  <Input 
                    id="surgeryName" 
                    value={newSurgery.name}
                    onChange={e => setNewSurgery({ ...newSurgery, name: e.target.value })}
                    placeholder="Enter surgery name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="surgeryYear">Year</Label>
                  <Input 
                    id="surgeryYear" 
                    type="number"
                    value={newSurgery.year}
                    onChange={e => setNewSurgery({ ...newSurgery, year: parseInt(e.target.value) })}
                    min={1900}
                    max={new Date().getFullYear()}
                  />
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleAddSurgery}
                  disabled={!newSurgery.name || !newSurgery.year}
                >
                  <Plus size={16} className="mr-1" /> Add Surgery
                </Button>
              </div>
            )}
            
            {editMode === "allergies" && (
              <div className="space-y-4 mt-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {medicalHistory.allergies.map(allergy => (
                    <Badge key={allergy.id} variant="outline" className="py-1 px-3 bg-red-50 border-red-200">
                      {allergy.name} ({allergy.reaction})
                      <button 
                        className="ml-2 hover:text-red-700"
                        onClick={() => handleRemoveAllergy(allergy.id)}
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergyName">Allergen</Label>
                  <Input 
                    id="allergyName" 
                    value={newAllergy.name}
                    onChange={e => setNewAllergy({ ...newAllergy, name: e.target.value })}
                    placeholder="Enter allergen name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergyReaction">Reaction</Label>
                  <Input 
                    id="allergyReaction" 
                    value={newAllergy.reaction}
                    onChange={e => setNewAllergy({ ...newAllergy, reaction: e.target.value })}
                    placeholder="Enter allergic reaction"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergyNotes">Notes (optional)</Label>
                  <Textarea 
                    id="allergyNotes" 
                    value={newAllergy.notes || ""}
                    onChange={e => setNewAllergy({ ...newAllergy, notes: e.target.value })}
                    placeholder="Additional notes about this allergy"
                  />
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleAddAllergy}
                  disabled={!newAllergy.name || !newAllergy.reaction}
                >
                  <Plus size={16} className="mr-1" /> Add Allergy
                </Button>
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => {
                setLocalIsEditing(false);
                setEditMode(null);
              }}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalHistorySection;
