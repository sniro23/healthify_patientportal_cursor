
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

interface PersonalInfo {
  fullName: string;
  age: number;
  gender: string;
  address: string;
  maritalStatus: string;
  children: number;
}

const PersonalInfoSection = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "John Doe",
    age: 32,
    gender: "Male",
    address: "123 Medical Lane, Colombo, Sri Lanka",
    maritalStatus: "Married",
    children: 2
  });
  
  const handleSave = (updatedInfo: Partial<PersonalInfo>) => {
    setPersonalInfo({
      ...personalInfo,
      ...updatedInfo
    });
    
    setIsEditing(false);
    
    toast({
      title: "Personal information updated",
      description: "Your personal details have been saved"
    });
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-slate-900">Personal Information</h3>
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
          <p className="text-sm text-slate-500">Full Name</p>
          <p className="font-medium">{personalInfo.fullName}</p>
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
          <p className="font-medium">{personalInfo.maritalStatus}</p>
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
      
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
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
                fullName: formData.get("fullName") as string,
                age: parseInt(formData.get("age") as string),
                gender: formData.get("gender") as string,
                address: formData.get("address") as string,
                maritalStatus: formData.get("maritalStatus") as string,
                children: parseInt(formData.get("children") as string)
              });
            }}
          >
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                name="fullName"
                defaultValue={personalInfo.fullName} 
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
                <Select name="maritalStatus" defaultValue={personalInfo.maritalStatus}>
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

export default PersonalInfoSection;
