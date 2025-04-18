import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { LabReport, LabTestResult } from '@/lib/fhir/types';
import { isLabTestResultArray, parseJSON } from '../utils/typeGuards';

export const useLabReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<LabReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchLabReports = async () => {
      try {
        const { data, error } = await supabase
          .from('health_lab_reports')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching lab reports:', error);
        } else if (data) {
          const transformedData: LabReport[] = data.map(item => {
            let status: "normal" | "abnormal" | "pending" = "pending";
            if (item.status === "normal" || item.status === "abnormal" || item.status === "pending") {
              status = item.status;
            }

            const testResults = parseJSON(item.testresults, isLabTestResultArray);

            return {
              id: item.id,
              name: item.name,
              date: item.date,
              status: status,
              fileUrl: item.fileurl || undefined,
              testResults: testResults || undefined
            };
          });
          
          setReports(transformedData);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLabReports();
  }, [user]);

  const addLabReport = async (report: Omit<LabReport, 'id'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add lab reports",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Transform from our interface to match database structure
      const newReport = {
        name: report.name,
        date: report.date, 
        status: report.status,
        fileurl: report.fileUrl || null,
        testresults: report.testResults ? JSON.stringify(report.testResults) : null,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('health_lab_reports')
        .insert(newReport)
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Transform back to our interface structure
        const transformedReport: LabReport = {
          id: data[0].id,
          name: data[0].name,
          date: data[0].date,
          status: data[0].status as "normal" | "abnormal" | "pending",
          fileUrl: data[0].fileurl || undefined,
          testResults: data[0].testresults ? 
            (typeof data[0].testresults === 'string' ? 
              JSON.parse(data[0].testresults) as LabTestResult[] : 
              data[0].testresults as unknown as LabTestResult[]
            ) : undefined
        };
        
        setReports([...reports, transformedReport]);
        
        toast({
          title: "Lab report added",
          description: `${report.name} has been added to your lab reports`
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error saving lab report:', error);
      
      toast({
        title: "Update failed",
        description: "Could not save lab report",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const deleteLabReport = async (id: string) => {
    if (!user) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('health_lab_reports')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setReports(reports.filter(report => report.id !== id));
      
      toast({
        title: "Lab report removed",
        description: "The lab report has been removed from your records"
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting lab report:', error);
      
      toast({
        title: "Delete failed",
        description: "Could not remove lab report",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return { reports, setReports, addLabReport, deleteLabReport, isLoading };
};
