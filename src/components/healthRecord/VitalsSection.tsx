import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useVitalsInfo } from "@/lib/hooks/useHealthRecord";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface VitalsSectionProps {
  isEditing: boolean;
}

const VitalsSection: React.FC<VitalsSectionProps> = ({ isEditing }) => {
  const { vitals, updateVitalsInfo, isLoading } = useVitalsInfo();
  const [localIsEditing, setLocalIsEditing] = useState(isEditing);
  
  useEffect(() => {
    setLocalIsEditing(isEditing);
  }, [isEditing]);
  
  const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: "Underweight", color: "bg-blue-100 text-blue-800" };
    if (bmi < 25) return { category: "Normal", color: "bg-green-100 text-green-800" };
    if (bmi < 30) return { category: "Overweight", color: "bg-yellow-100 text-yellow-800" };
    return { category: "Obese", color: "bg-red-100 text-red-800" };
  };
  
  const handleSave = async (updatedInfo: Partial<typeof vitals>) => {
    const success = await updateVitalsInfo(updatedInfo);
    if (success) {
      setLocalIsEditing(false);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  const bmiInfo = getBMICategory(vitals.bmi);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Vitals & Biometrics</h3>
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
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-slate-500">Height</p>
          <p className="font-medium">{vitals.height} cm</p>
        </div>
        
        <div>
          <p className="text-sm text-slate-500">Weight</p>
          <p className="font-medium">{vitals.weight} kg</p>
        </div>
        
        <div>
          <p className="text-sm text-slate-500">BMI</p>
          <div className="flex items-center gap-2">
            <p className="font-medium">{vitals.bmi}</p>
            <Badge className={bmiInfo.color}>
              {bmiInfo.category}
            </Badge>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-slate-500">Blood Group</p>
          <p className="font-medium">{vitals.blood_group}</p>
        </div>
      </div>
      
      <Dialog open={localIsEditing} onOpenChange={setLocalIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vitals & Biometrics</DialogTitle>
          </DialogHeader>
          
          <form 
            className="space-y-4 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSave({
                height: parseFloat(formData.get("height") as string),
                weight: parseFloat(formData.get("weight") as string),
                blood_group: formData.get("bloodGroup") as string
              });
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height" 
                  name="height"
                  type="number" 
                  defaultValue={vitals.height} 
                  step="0.1"
                />
              </div>
              
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight" 
                  name="weight"
                  type="number" 
                  defaultValue={vitals.weight} 
                  step="0.1"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select name="bloodGroup" defaultValue={vitals.blood_group}>
                <SelectTrigger id="bloodGroup">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setLocalIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VitalsSection;
