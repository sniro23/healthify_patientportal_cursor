
import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import PersonalInfoSection from "@/components/healthRecord/PersonalInfoSection";
import VitalsSection from "@/components/healthRecord/VitalsSection";
import LifestyleSection from "@/components/healthRecord/LifestyleSection";
import MedicalHistorySection from "@/components/healthRecord/MedicalHistorySection";
import MedicationsSection from "@/components/healthRecord/MedicationsSection";
import MetricsSection from "@/components/healthRecord/MetricsSection";
import LabReportsSection from "@/components/healthRecord/LabReportsSection";
import { Button } from "@/components/ui/button";
import { Edit, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const HealthRecord = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("personal");
  
  const handleDownloadSummary = () => {
    toast({
      title: "Downloading health summary",
      description: "Your health record summary is being downloaded",
    });
  };
  
  const handleEditProfile = () => {
    toast({
      title: "Edit mode enabled",
      description: "You can now edit your health record information",
    });
  };
  
  return (
    <PageContainer title="Health Record" showBackButton={true}>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Health Record</h1>
          <p className="text-slate-600 mt-1">
            View and manage your complete health profile
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleEditProfile}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-health-accent hover:text-health-accent/90" 
            onClick={handleDownloadSummary}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Summary
          </Button>
        </div>
      </div>
      
      {/* Desktop Full View */}
      <div className="hidden md:block bg-white rounded-lg border border-slate-200 p-6 mb-6">
        <PersonalInfoSection />
        <div className="border-t my-4" />
        <VitalsSection />
        <div className="border-t my-4" />
        <LifestyleSection />
        <div className="border-t my-4" />
        <MedicalHistorySection />
        <div className="border-t my-4" />
        <MedicationsSection />
        <div className="border-t my-4" />
        <MetricsSection />
        <div className="border-t my-4" />
        <LabReportsSection />
      </div>
      
      {/* Mobile Tabbed View */}
      <div className="md:hidden">
        <Tabs 
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full overflow-x-auto mb-6 flex flex-nowrap justify-start">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="lab">Lab Reports</TabsTrigger>
          </TabsList>
          
          <div className="bg-white rounded-lg border border-slate-200 p-4">
            <TabsContent value="personal">
              <PersonalInfoSection />
            </TabsContent>
            
            <TabsContent value="vitals">
              <VitalsSection />
            </TabsContent>
            
            <TabsContent value="lifestyle">
              <LifestyleSection />
            </TabsContent>
            
            <TabsContent value="medical">
              <MedicalHistorySection />
            </TabsContent>
            
            <TabsContent value="medications">
              <MedicationsSection />
            </TabsContent>
            
            <TabsContent value="metrics">
              <MetricsSection />
            </TabsContent>
            
            <TabsContent value="lab">
              <LabReportsSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default HealthRecord;
