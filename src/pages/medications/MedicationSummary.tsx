
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Pill, FileText, History, Download, Plus, Check, Clock } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Medication } from "@/lib/models/medication";

// Mock data for medications
const MOCK_ROUTINE_MEDICATIONS: Medication[] = [
  {
    id: "med1",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    startDate: new Date(2024, 3, 1),
    isActive: true,
    userId: "user1",
    createdAt: new Date(2024, 3, 1),
    isRoutine: true,
  },
  {
    id: "med2",
    name: "Vitamin D3",
    dosage: "1000 IU",
    frequency: "Once daily",
    startDate: new Date(2024, 2, 15),
    isActive: true,
    userId: "user1",
    createdAt: new Date(2024, 2, 15),
    isRoutine: true,
  },
];

const MOCK_PRESCRIBED_MEDICATIONS: Medication[] = [
  {
    id: "med3",
    name: "Paracetamol",
    dosage: "500mg",
    frequency: "Three times daily",
    startDate: new Date(2025, 2, 15),
    endDate: new Date(2025, 2, 20),
    isActive: true,
    instructions: "Take after meals",
    prescribedBy: "Dr. Silva",
    prescriptionId: "presc1",
    userId: "user1",
    createdAt: new Date(2025, 2, 15),
    isRoutine: false,
  },
  {
    id: "med4",
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    startDate: new Date(2025, 2, 10),
    endDate: new Date(2025, 2, 17),
    isActive: false,
    instructions: "Take with food",
    prescribedBy: "Dr. Ravi",
    prescriptionId: "presc2",
    userId: "user1",
    createdAt: new Date(2025, 2, 10),
    isRoutine: false,
  },
];

// Combine both and use for history tab
const MOCK_MEDICATION_HISTORY: Medication[] = [
  ...MOCK_ROUTINE_MEDICATIONS,
  ...MOCK_PRESCRIBED_MEDICATIONS,
].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

const MedicationSummary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("routine");

  const handleAddMedication = () => {
    navigate("/medications/add");
  };

  const handleViewPrescription = (prescriptionId: string) => {
    navigate(`/medications/prescription/${prescriptionId}`);
  };

  const handleDownload = (medicationId: string) => {
    toast({
      title: "Downloading prescription",
      description: "Your prescription PDF is being prepared...",
    });
  };

  const renderMedicationCard = (medication: Medication) => {
    const isExpired = medication.endDate ? new Date() > medication.endDate : false;
    const statusColor = isExpired ? "text-gray-500" : medication.isActive ? "text-green-600" : "text-amber-500";
    const statusIcon = isExpired ? <Clock size={16} /> : medication.isActive ? <Check size={16} /> : <Clock size={16} />;

    return (
      <Card key={medication.id} className="mb-3 p-4 hover:bg-slate-50">
        <div className="flex justify-between">
          <div>
            <div className="font-medium flex items-center">
              {medication.name}{" "}
              <Badge variant="outline" className="ml-2">
                {medication.dosage}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">{medication.frequency}</div>
            <div className="text-xs text-slate-500 mt-1">
              Since {format(medication.startDate, "dd MMM yyyy")}
              {medication.endDate && ` until ${format(medication.endDate, "dd MMM yyyy")}`}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`flex items-center ${statusColor} text-xs mb-1`}>
              {statusIcon}
              <span className="ml-1">{isExpired ? "Completed" : medication.isActive ? "Active" : "On hold"}</span>
            </span>
            
            {medication.prescriptionId && (
              <div className="mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-health-primary"
                  onClick={() => handleViewPrescription(medication.prescriptionId!)}
                >
                  <FileText size={16} className="mr-1" />
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-health-primary"
                  onClick={() => handleDownload(medication.id)}
                >
                  <Download size={16} className="mr-1" />
                  PDF
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {medication.prescribedBy && (
          <div className="text-xs text-slate-500 mt-2">
            Prescribed by {medication.prescribedBy} on {format(medication.createdAt, "dd MMM yyyy")}
          </div>
        )}
        
        {medication.instructions && (
          <div className="text-sm mt-2 text-slate-700 bg-slate-50 p-2 rounded">
            <span className="font-medium">Instructions:</span> {medication.instructions}
          </div>
        )}
      </Card>
    );
  };

  return (
    <PageContainer title="Medications" showBackButton={true}>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Medications</h1>
          <p className="text-slate-600 mt-1">
            Manage your medications and prescriptions
          </p>
        </div>
        <Button onClick={handleAddMedication}>
          <Plus size={16} className="mr-1" />
          Add Medication
        </Button>
      </div>

      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="routine" className="flex items-center">
            <Pill size={16} className="mr-2" />
            Routine
          </TabsTrigger>
          <TabsTrigger value="prescribed" className="flex items-center">
            <FileText size={16} className="mr-2" />
            Prescribed
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center">
            <History size={16} className="mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routine">
          {MOCK_ROUTINE_MEDICATIONS.length > 0 ? (
            MOCK_ROUTINE_MEDICATIONS.map(med => renderMedicationCard(med))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <Pill size={40} className="mx-auto mb-3 text-slate-400" />
              <p>No routine medications added yet</p>
              <Button variant="outline" className="mt-4" onClick={handleAddMedication}>
                <Plus size={16} className="mr-1" />
                Add Medication
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="prescribed">
          {MOCK_PRESCRIBED_MEDICATIONS.length > 0 ? (
            MOCK_PRESCRIBED_MEDICATIONS.map(med => renderMedicationCard(med))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <FileText size={40} className="mx-auto mb-3 text-slate-400" />
              <p>No prescribed medications found</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {MOCK_MEDICATION_HISTORY.length > 0 ? (
            MOCK_MEDICATION_HISTORY.map(med => renderMedicationCard(med))
          ) : (
            <div className="text-center py-8 text-slate-500">
              <History size={40} className="mx-auto mb-3 text-slate-400" />
              <p>No medication history found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default MedicationSummary;
