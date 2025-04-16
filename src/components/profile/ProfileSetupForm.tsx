
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const steps = [
  "Personal Information",
  "Lifestyle Details",
  "Vitals and Measurements",
  "Medical History",
  "Routine Medications"
];

const ProfileSetupForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    maritalStatus: "",
    children: "0"
  });
  const [lifestyle, setLifestyle] = useState({
    activityLevel: "",
    smokingStatus: "",
    alcoholConsumption: ""
  });
  const [vitals, setVitals] = useState({
    height: "",
    weight: "",
    bloodGroup: ""
  });
  const [medicalHistory, setMedicalHistory] = useState({
    conditions: "",
    allergies: "",
    surgeries: ""
  });
  const [medications, setMedications] = useState({
    drugName: "",
    dosage: "",
    frequency: "",
    duration: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLifestyleChange = (name: string, value: string) => {
    setLifestyle(prev => ({ ...prev, [name]: value }));
  };

  const handleVitalsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: value }));
  };

  const handleVitalsSelectChange = (name: string, value: string) => {
    setVitals(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicalHistoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMedicalHistory(prev => ({ ...prev, [name]: value }));
  };

  const handleMedicationsChange = (name: string, value: string) => {
    setMedications(prev => ({ ...prev, [name]: value }));
  };

  const calculateBMI = () => {
    const height = parseFloat(vitals.height);
    const weight = parseFloat(vitals.weight);
    
    if (height && weight && height > 0) {
      // Height in cm, convert to m
      const heightInM = height / 100;
      return (weight / (heightInM * heightInM)).toFixed(1);
    }
    
    return "N/A";
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate a successful profile setup
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Store all profile data
      const profileData = {
        personalInfo,
        lifestyle,
        vitals: {
          ...vitals,
          bmi: calculateBMI()
        },
        medicalHistory,
        medications
      };
      
      // Save to localStorage for demo purposes
      localStorage.setItem("profileData", JSON.stringify(profileData));
      localStorage.setItem("hasCompletedProfile", "true");
      
      toast({
        title: "Profile setup complete",
        description: "Your medical profile has been saved",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Profile setup failed",
        description: "There was a problem saving your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={personalInfo.dateOfBirth}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={personalInfo.gender} 
                onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St, City, Country"
                value={personalInfo.address}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select 
                value={personalInfo.maritalStatus} 
                onValueChange={(value) => setPersonalInfo(prev => ({ ...prev, maritalStatus: value }))}
              >
                <SelectTrigger id="maritalStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="children">Number of Children</Label>
              <Input
                id="children"
                name="children"
                type="number"
                min="0"
                value={personalInfo.children}
                onChange={handlePersonalInfoChange}
                required
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Physical Activity Level</Label>
              <Select 
                value={lifestyle.activityLevel} 
                onValueChange={(value) => handleLifestyleChange("activityLevel", value)}
              >
                <SelectTrigger id="activityLevel">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="smokingStatus">Smoking Status</Label>
              <Select 
                value={lifestyle.smokingStatus} 
                onValueChange={(value) => handleLifestyleChange("smokingStatus", value)}
              >
                <SelectTrigger id="smokingStatus">
                  <SelectValue placeholder="Select smoking status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="former">Former Smoker</SelectItem>
                  <SelectItem value="current">Current Smoker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
              <Select 
                value={lifestyle.alcoholConsumption} 
                onValueChange={(value) => handleLifestyleChange("alcoholConsumption", value)}
              >
                <SelectTrigger id="alcoholConsumption">
                  <SelectValue placeholder="Select consumption level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                  <SelectItem value="regularly">Regularly</SelectItem>
                  <SelectItem value="frequently">Frequently</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                placeholder="170"
                value={vitals.height}
                onChange={handleVitalsChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                placeholder="70"
                value={vitals.weight}
                onChange={handleVitalsChange}
                required
              />
            </div>
            
            {vitals.height && vitals.weight && (
              <div className="p-3 bg-health-highlight rounded-lg text-center">
                <p className="text-sm font-medium text-slate-700">
                  BMI: {calculateBMI()}
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Select 
                value={vitals.bloodGroup} 
                onValueChange={(value) => handleVitalsSelectChange("bloodGroup", value)}
              >
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
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="conditions">Known Conditions</Label>
              <Input
                id="conditions"
                name="conditions"
                placeholder="e.g., Hypertension, Diabetes"
                value={medicalHistory.conditions}
                onChange={handleMedicalHistoryChange}
              />
              <p className="text-xs text-slate-500 mt-1">
                Separate multiple conditions with commas
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                name="allergies"
                placeholder="e.g., Penicillin, Peanuts"
                value={medicalHistory.allergies}
                onChange={handleMedicalHistoryChange}
              />
              <p className="text-xs text-slate-500 mt-1">
                Separate multiple allergies with commas
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="surgeries">Past Surgeries</Label>
              <Input
                id="surgeries"
                name="surgeries"
                placeholder="e.g., Appendectomy (2015)"
                value={medicalHistory.surgeries}
                onChange={handleMedicalHistoryChange}
              />
              <p className="text-xs text-slate-500 mt-1">
                Include year in parentheses if known
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="drugName">Medication Name</Label>
              <Input
                id="drugName"
                placeholder="e.g., Metformin"
                value={medications.drugName}
                onChange={(e) => handleMedicationsChange("drugName", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                placeholder="e.g., 500mg"
                value={medications.dosage}
                onChange={(e) => handleMedicationsChange("dosage", e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select 
                value={medications.frequency} 
                onValueChange={(value) => handleMedicationsChange("frequency", value)}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Once daily</SelectItem>
                  <SelectItem value="twice">Twice daily</SelectItem>
                  <SelectItem value="tid">TID (Three times a day)</SelectItem>
                  <SelectItem value="qid">QID (Four times a day)</SelectItem>
                  <SelectItem value="prn">PRN (As needed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 30"
                value={medications.duration}
                onChange={(e) => handleMedicationsChange("duration", e.target.value)}
              />
            </div>
            
            <p className="text-xs text-slate-500 italic mt-4">
              Note: Add only routine medications you are currently taking. You can add more medications later from your health record.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`flex-1 h-1 rounded ${
              index < currentStep
                ? "bg-health-primary"
                : index === currentStep
                ? "bg-health-secondary"
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      
      <h2 className="text-xl font-semibold">
        Step {currentStep + 1}: {steps[currentStep]}
      </h2>
      
      <form onSubmit={currentStep === steps.length - 1 ? handleSubmit : undefined}>
        {renderStep()}
        
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-health-primary hover:bg-health-accent"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-health-primary hover:bg-health-accent"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Complete Setup"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileSetupForm;
