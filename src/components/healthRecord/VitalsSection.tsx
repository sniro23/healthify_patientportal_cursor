
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface VitalsInfo {
  height: number;
  weight: number;
  bmi: number;
  bloodGroup: string;
}

const VitalsSection = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [vitals, setVitals] = useState<VitalsInfo>({
    height: 170,
    weight: 68,
    bmi: 23.5,
    bloodGroup: "A+"
  });
  
  const calculateBMI = (height: number, weight: number): number => {
    // BMI = weight(kg) / (height(m))²
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };
  
  const getBMICategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: "Underweight", color: "bg-blue-100 text-blue-800" };
    if (bmi < 25) return { category: "Normal", color: "bg-green-100 text-green-800" };
    if (bmi < 30) return { category: "Overweight", color: "bg-yellow-100 text-yellow-800" };
    return { category: "Obese", color: "bg-red-100 text-red-800" };
  };
  
  const handleSave = (updatedInfo: Partial<VitalsInfo>) => {
    const newHeight = updatedInfo.height || vitals.height;
    const newWeight = updatedInfo.weight || vitals.weight;
    const newBMI = calculateBMI(newHeight, newWeight);
    
    const updatedVitals = {
      ...vitals,
      ...updatedInfo,
      bmi: newBMI
    };
    
    setVitals(updatedVitals);
    setIsEditing(false);
    
    toast({
      title: "Vitals information updated",
      description: "Your vitals have been updated successfully"
    });
  };
  
  const bmiInfo = getBMICategory(vitals.bmi);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Vitals & Biometrics</h3>
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
          <p className="font-medium">{vitals.bloodGroup}</p>
        </div>
      </div>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
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
                bloodGroup: formData.get("bloodGroup") as string
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
              <Select name="bloodGroup" defaultValue={vitals.bloodGroup}>
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
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
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
