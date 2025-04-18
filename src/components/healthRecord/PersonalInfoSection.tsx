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
import { usePersonalInfo } from "@/lib/hooks/useHealthRecord";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface PersonalInfoSectionProps {
  isEditing: boolean;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ isEditing }) => {
  const { personalInfo, updatePersonalInfo, isLoading } = usePersonalInfo();
  const [localIsEditing, setLocalIsEditing] = useState(isEditing);
  
  useEffect(() => {
    setLocalIsEditing(isEditing);
  }, [isEditing]);
  
  const handleSave = async (updatedInfo: Partial<typeof personalInfo>) => {
    const success = await updatePersonalInfo(updatedInfo);
    if (success) {
      setLocalIsEditing(false);
    }
  };
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Personal Information</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2"
          onClick={() => setLocalIsEditing(true)}
          disabled={localIsEditing}
        >
          <Pencil className="w-3 h-3 mr-1" />
          Edit
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-slate-500">Full Name</p>
          <p className="font-medium">{personalInfo.full_name}</p>
        </div>
        
        <div>
          <p className="text-sm text-slate-500">Age</p>
          <p className="font-medium">{personalInfo.age} years</p>
        </div>
        
        <div>
          <p className="text-sm text-slate-500">Gender</p>
          <p className="font-medium">{personalInfo.gender}</p>
        </div>
        
        <div>
          <p className="text-sm text-slate-500">Marital Status</p>
          <p className="font-medium">{personalInfo.marital_status}</p>
        </div>
        
        <div>
          <p className="text-sm text-slate-500">Children</p>
          <p className="font-medium">{personalInfo.children}</p>
        </div>
        
        <div className="md:col-span-3">
          <p className="text-sm text-slate-500">Address</p>
          <p className="font-medium">{personalInfo.address}</p>
        </div>
      </div>
      
      <Dialog open={localIsEditing} onOpenChange={setLocalIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Personal Information</DialogTitle>
          </DialogHeader>
          
          <form 
            className="space-y-4 py-4"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSave({
                full_name: formData.get("fullName") as string,
                age: parseInt(formData.get("age") as string),
                gender: formData.get("gender") as string,
                address: formData.get("address") as string,
                marital_status: formData.get("maritalStatus") as string,
                children: parseInt(formData.get("children") as string)
              });
            }}
          >
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                name="fullName"
                defaultValue={personalInfo.full_name} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  name="age"
                  type="number" 
                  defaultValue={personalInfo.age} 
                />
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue={personalInfo.gender}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select name="maritalStatus" defaultValue={personalInfo.marital_status}>
                  <SelectTrigger id="maritalStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="children">Children</Label>
                <Input 
                  id="children" 
                  name="children"
                  type="number" 
                  defaultValue={personalInfo.children} 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                name="address"
                defaultValue={personalInfo.address} 
              />
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

export default PersonalInfoSection;
