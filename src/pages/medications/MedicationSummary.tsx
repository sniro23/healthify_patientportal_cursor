
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar, Clock, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Medication } from "@/lib/models/medication";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const MedicationSummary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [activeMedications, setActiveMedications] = useState<Medication[]>([]);
  const [pastMedications, setPastMedications] = useState<Medication[]>([]);
  const [activeTab, setActiveTab] = useState("current");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMedications();
    }
  }, [user]);

  const fetchMedications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Convert to our medication model
        const medicationsData = data.map(med => ({
          id: med.id,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          startDate: new Date(med.start_date),
          endDate: med.end_date ? new Date(med.end_date) : undefined,
          isActive: !med.end_date || new Date(med.end_date) > new Date(),
          instructions: med.notes,
          prescribedBy: med.prescribed_by,
          userId: med.user_id,
          createdAt: new Date(med.created_at),
          isRoutine: !med.prescribed_by // If no prescriber, consider it self-reported/routine
        }));

        setMedications(medicationsData);
        setActiveMedications(medicationsData.filter(med => med.isActive));
        setPastMedications(medicationsData.filter(med => !med.isActive));
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addMedication = () => {
    navigate("/medications/add");
  };

  const filteredActiveMedications = activeMedications.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPastMedications = pastMedications.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMedicationList = (medicationList: Medication[]) => {
    if (isLoading) {
      return Array(3).fill(0).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg mb-3">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ));
    }

    if (medicationList.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-slate-500">No medications found</p>
        </div>
      );
    }

    return medicationList.map((med) => (
      <div key={med.id} className="p-4 bg-white border rounded-lg mb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg">{med.name}</h3>
            <p className="text-slate-600 text-sm">{med.dosage}</p>
          </div>
          {med.isActive && (
            <span className="bg-green-50 text-green-700 text-xs py-1 px-2 rounded-full">
              Active
            </span>
          )}
          {!med.isActive && (
            <span className="bg-slate-100 text-slate-700 text-xs py-1 px-2 rounded-full">
              Past
            </span>
          )}
        </div>
        
        <div className="mt-3 flex items-center text-xs text-slate-500">
          <Clock size={14} className="mr-1" />
          <span>{med.frequency}</span>
        </div>
        
        <div className="mt-2 flex items-center text-xs text-slate-500">
          <Calendar size={14} className="mr-1" />
          <span>
            Started: {format(med.startDate, "MMM d, yyyy")}
            {med.endDate && ` • Ended: ${format(med.endDate, "MMM d, yyyy")}`}
          </span>
        </div>
        
        {med.instructions && (
          <div className="mt-3 bg-amber-50 p-2 rounded text-xs flex items-start">
            <AlertTriangle size={14} className="mr-1 text-amber-500 mt-0.5" />
            <span>{med.instructions}</span>
          </div>
        )}
      </div>
    ));
  };

  return (
    <PageContainer title="Medications" showBackButton>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Medications</h1>
        <p className="text-slate-600 mt-1">
          Track and manage your medications
        </p>
      </div>

      <div className="mb-4 flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Search medications..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          className="ml-2 bg-health-primary hover:bg-health-accent"
          onClick={addMedication}
        >
          <Plus size={18} className="mr-1" />
          Add
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="current" className="flex-1">Current ({filteredActiveMedications.length})</TabsTrigger>
          <TabsTrigger value="past" className="flex-1">Past ({filteredPastMedications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-2">
          {renderMedicationList(filteredActiveMedications)}
        </TabsContent>

        <TabsContent value="past" className="space-y-2">
          {renderMedicationList(filteredPastMedications)}
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default MedicationSummary;
