
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface LifestyleInfo {
  activityLevel: string;
  smokingStatus: string;
  alcoholConsumption: string;
}

const LifestyleSection = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [lifestyle, setLifestyle] = useState<LifestyleInfo>({
    activityLevel: "Moderate",
    smokingStatus: "Never",
    alcoholConsumption: "Occasionally"
  });
  
  const handleSave = (updatedInfo: Partial<LifestyleInfo>) => {
    setLifestyle({
      ...lifestyle,
      ...updatedInfo
    });
    
    setIsEditing(false);
    
    toast({
      title: "Lifestyle information updated",
      description: "Your lifestyle information has been saved"
    });
  };
  
  const getActivityLevelBadge = (level: string) => {
    switch (level) {
      case "Sedentary":
        return "bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs";
      case "Light":
        return "bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs";
      case "Moderate":
        return "bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs";
      case "Active":
        return "bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs";
      default:
        return "bg-slate-50 text-slate-700 px-2 py-0.5 rounded text-xs";
    }
  };
  
  const getSmokingBadge = (status: string) => {
    switch (status) {
      case "Current":
        return "bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs";
      case "Former":
        return "bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs";
      case "Never":
        return "bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs";
      default:
        return "bg-slate-50 text-slate-700 px-2 py-0.5 rounded text-xs";
    }
  };
  
  const getAlcoholBadge = (status: string) => {
    switch (status) {
      case "Frequently":
        return "bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs";
      case "Regularly":
        return "bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded text-xs";
      case "Occasionally":
        return "bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs";
      case "None":
        return "bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs";
      default:
        return "bg-slate-50 text-slate-700 px-2 py-0.5 rounded text-xs";
    }
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Lifestyle Indicators</h3>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-slate-500">Physical Activity Level</p>
          <p className="font-medium flex items-center mt-1">
            <span className={getActivityLevelBadge(lifestyle.activityLevel)}>
              {lifestyle.activityLevel}
            </span>
          </p>
        </div>
        
        <div>
          <p className="text-sm text-slate-500">Smoking Status</p>
          <p className="font-medium flex items-center mt-1">
            <span className={getSmokingBadge(lifestyle.smokingStatus)}>
              {lifestyle.smokingStatus}
            </span>
          </p>
        </div>
        
        <div>
          <p className="text-sm text-slate-500">Alcohol Consumption</p>
          <p className="font-medium flex items-center mt-1">
            <span className={getAlcoholBadge(lifestyle.alcoholConsumption)}>
              {lifestyle.alcoholConsumption}
            </span>
          </p>
        </div>
      </div>
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lifestyle Information</DialogTitle>
          </DialogHeader>
          
          <form 
            className="space-y-4 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSave({
                activityLevel: formData.get("activityLevel") as string,
                smokingStatus: formData.get("smokingStatus") as string,
                alcoholConsumption: formData.get("alcoholConsumption") as string
              });
            }}
          >
            <div>
              <Label htmlFor="activityLevel">Physical Activity Level</Label>
              <Select name="activityLevel" defaultValue={lifestyle.activityLevel}>
                <SelectTrigger id="activityLevel">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedentary">Sedentary</SelectItem>
                  <SelectItem value="Light">Light</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="smokingStatus">Smoking Status</Label>
              <Select name="smokingStatus" defaultValue={lifestyle.smokingStatus}>
                <SelectTrigger id="smokingStatus">
                  <SelectValue placeholder="Select smoking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Former">Former</SelectItem>
                  <SelectItem value="Current">Current</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
              <Select name="alcoholConsumption" defaultValue={lifestyle.alcoholConsumption}>
                <SelectTrigger id="alcoholConsumption">
                  <SelectValue placeholder="Select alcohol consumption" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Occasionally">Occasionally</SelectItem>
                  <SelectItem value="Regularly">Regularly</SelectItem>
                  <SelectItem value="Frequently">Frequently</SelectItem>
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

export default LifestyleSection;
