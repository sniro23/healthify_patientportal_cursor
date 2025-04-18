import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import type { Json } from '@supabase/supabase-js'
import type { LabTestResult, MetricData } from '../types'

// --- Type‐guard for LabTestResult[] ---
function isLabTestResultArray(data: unknown): data is LabTestResult[] {
  return (
    Array.isArray(data) &&
    data.every(item =>
      typeof item === 'object' &&
      item !== null &&
      'testId' in item &&
      'value' in item
    )
  )
}

// --- Type‐guard for MetricData Record<string,MetricData> ---
function isMetricDataRecord(data: unknown): data is Record<string, MetricData> {
  return (
    typeof data === 'object' &&
    data !== null &&
    !Array.isArray(data) &&
    Object.values(data).every(
      v =>
        typeof v === 'object' &&
        v !== null &&
        'timestamp' in v &&
        'value' in v
    )
  )
}

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
  const [isEditing, setIsEditing] = useState(false);
  
  const handleDownloadSummary = () => {
    toast({
      title: "Downloading health summary",
      description: "Your health record summary is being downloaded",
    });
  };
  
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    toast({
      title: isEditing ? "Edit mode disabled" : "Edit mode enabled",
      description: isEditing ? "You can no longer edit your health record information" : "You can now edit your health record information",
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
            {isEditing ? "Stop Editing" : "Edit Profile"}
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
        <PersonalInfoSection isEditing={isEditing} />
        <div className="border-t my-4" />
        <VitalsSection isEditing={isEditing} />
        <div className="border-t my-4" />
        <LifestyleSection isEditing={isEditing} />
        <div className="border-t my-4" />
        <MedicalHistorySection isEditing={isEditing} />
        <div className="border-t my-4" />
        <MedicationsSection isEditing={isEditing} />
        <div className="border-t my-4" />
        <MetricsSection isEditing={isEditing} />
        <div className="border-t my-4" />
        <LabReportsSection isEditing={isEditing} />
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
              <PersonalInfoSection isEditing={isEditing} />
            </TabsContent>
            
            <TabsContent value="vitals">
              <VitalsSection isEditing={isEditing} />
            </TabsContent>
            
            <TabsContent value="lifestyle">
              <LifestyleSection isEditing={isEditing} />
            </TabsContent>
            
            <TabsContent value="medical">
              <MedicalHistorySection isEditing={isEditing} />
            </TabsContent>
            
            <TabsContent value="medications">
              <MedicationsSection isEditing={isEditing} />
            </TabsContent>
            
            <TabsContent value="metrics">
              <MetricsSection isEditing={isEditing} />
            </TabsContent>
            
            <TabsContent value="lab">
              <LabReportsSection isEditing={isEditing} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
};

export default HealthRecord;
