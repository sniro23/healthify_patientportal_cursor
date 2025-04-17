
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';

// Define TypeScript interfaces for our health record data
export interface PersonalInfo {
  id?: string;
  user_id?: string;
  full_name: string;
  age: number;
  gender: string;
  address: string;
  marital_status: string;
  children: number;
}

export interface VitalsInfo {
  id?: string;
  user_id?: string;
  height: number;
  weight: number;
  bmi: number;
  blood_group: string;
}

export interface LifestyleInfo {
  id?: string;
  user_id?: string;
  activity_level: string;
  smoking_status: string;
  alcohol_consumption: string;
}

export interface MetricReading {
  id: string;
  date: string;
  value: number;
}

export interface MetricData {
  name: string;
  unit: string;
  normal_range?: { min: number; max: number };
  readings: MetricReading[];
}

export interface HealthMetrics {
  id?: string;
  user_id?: string;
  metrics: Record<string, MetricData>;
}

export interface LabReport {
  id: string;
  name: string;
  date: string;
  status: "normal" | "abnormal" | "pending";
  fileUrl?: string;
  testResults?: LabTestResult[];
}

export interface LabTestResult {
  id: string;
  testId: string;
  testName: string;
  value: string;
  unit: string;
  referenceRange?: string;
  isAbnormal: boolean;
  loincCode?: string;
}

// Hook for personal information
export const usePersonalInfo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    full_name: "",
    age: 0,
    gender: "",
    address: "",
    marital_status: "",
    children: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchPersonalInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('health_personal_info')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching personal info:', error);
        } else if (data) {
          setPersonalInfo(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonalInfo();
  }, [user]);

  const updatePersonalInfo = async (updatedInfo: Partial<PersonalInfo>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save personal information",
        variant: "destructive"
      });
      return;
    }

    try {
      const newInfo = { ...personalInfo, ...updatedInfo, user_id: user.id };
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('health_personal_info')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the error code for "no rows returned"
        throw checkError;
      }

      let result;
      if (existingData?.id) {
        // Update existing record
        result = await supabase
          .from('health_personal_info')
          .update(newInfo)
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('health_personal_info')
          .insert(newInfo);
      }

      if (result.error) {
        throw result.error;
      }

      // Update local state
      setPersonalInfo(newInfo);
      
      toast({
        title: "Personal information updated",
        description: "Your personal details have been saved"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving personal info:', error);
      
      toast({
        title: "Update failed",
        description: "Could not save personal information",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return { personalInfo, setPersonalInfo, updatePersonalInfo, isLoading };
};

// Hook for vitals information
export const useVitalsInfo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vitals, setVitals] = useState<VitalsInfo>({
    height: 170,
    weight: 68,
    bmi: 23.5,
    blood_group: "A+"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchVitalsInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('health_vitals')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching vitals info:', error);
        } else if (data) {
          setVitals(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVitalsInfo();
  }, [user]);

  const calculateBMI = (height: number, weight: number): number => {
    const heightInMeters = height / 100;
    return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const updateVitalsInfo = async (updatedInfo: Partial<VitalsInfo>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save vitals information",
        variant: "destructive"
      });
      return;
    }

    try {
      const newHeight = updatedInfo.height || vitals.height;
      const newWeight = updatedInfo.weight || vitals.weight;
      const newBMI = calculateBMI(newHeight, newWeight);
      
      const newVitals = { 
        ...vitals, 
        ...updatedInfo, 
        bmi: newBMI, 
        user_id: user.id 
      };
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('health_vitals')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingData?.id) {
        // Update existing record
        result = await supabase
          .from('health_vitals')
          .update(newVitals)
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('health_vitals')
          .insert(newVitals);
      }

      if (result.error) {
        throw result.error;
      }

      // Update local state
      setVitals(newVitals);
      
      toast({
        title: "Vitals information updated",
        description: "Your vitals have been updated successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving vitals info:', error);
      
      toast({
        title: "Update failed",
        description: "Could not save vitals information",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return { vitals, setVitals, updateVitalsInfo, isLoading, calculateBMI };
};

// Hook for lifestyle information
export const useLifestyleInfo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [lifestyle, setLifestyle] = useState<LifestyleInfo>({
    activity_level: "Moderate",
    smoking_status: "Never",
    alcohol_consumption: "Occasionally"
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchLifestyleInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('health_lifestyle')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching lifestyle info:', error);
        } else if (data) {
          setLifestyle(data);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLifestyleInfo();
  }, [user]);

  const updateLifestyleInfo = async (updatedInfo: Partial<LifestyleInfo>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save lifestyle information",
        variant: "destructive"
      });
      return;
    }

    try {
      const newLifestyle = { ...lifestyle, ...updatedInfo, user_id: user.id };
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('health_lifestyle')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingData?.id) {
        // Update existing record
        result = await supabase
          .from('health_lifestyle')
          .update(newLifestyle)
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('health_lifestyle')
          .insert(newLifestyle);
      }

      if (result.error) {
        throw result.error;
      }

      // Update local state
      setLifestyle(newLifestyle);
      
      toast({
        title: "Lifestyle information updated",
        description: "Your lifestyle information has been saved"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving lifestyle info:', error);
      
      toast({
        title: "Update failed",
        description: "Could not save lifestyle information",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return { lifestyle, setLifestyle, updateLifestyleInfo, isLoading };
};

// Hook for health metrics
export const useHealthMetrics = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<Record<string, MetricData>>({
    bloodPressure: {
      name: "Blood Pressure",
      unit: "mmHg",
      normal_range: { min: 90, max: 120 },
      readings: []
    },
    heartRate: {
      name: "Heart Rate",
      unit: "bpm",
      normal_range: { min: 60, max: 100 },
      readings: []
    },
    glucose: {
      name: "Blood Glucose",
      unit: "mg/dL",
      normal_range: { min: 70, max: 100 },
      readings: []
    },
    weight: {
      name: "Weight",
      unit: "kg",
      readings: []
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('health_metrics')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching health metrics:', error);
        } else if (data && data.metrics) {
          setMetrics(data.metrics);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  const addMetricReading = async (
    metricKey: string,
    date: string,
    value: number
  ) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add health metrics",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Create a copy of current metrics
      const updatedMetrics = { ...metrics };
      
      // Add new reading
      const newReading = {
        id: `${metricKey}${Date.now()}`,
        date,
        value
      };
      
      // If this metric doesn't exist yet, initialize it
      if (!updatedMetrics[metricKey]) {
        toast({
          title: "Invalid metric",
          description: "The specified metric type does not exist",
          variant: "destructive"
        });
        return false;
      }
      
      // Add reading to the appropriate metric
      updatedMetrics[metricKey].readings = [
        ...(updatedMetrics[metricKey].readings || []),
        newReading
      ];
      
      // Sort readings by date
      updatedMetrics[metricKey].readings.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('health_metrics')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingData?.id) {
        // Update existing record
        result = await supabase
          .from('health_metrics')
          .update({ metrics: updatedMetrics })
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('health_metrics')
          .insert({ user_id: user.id, metrics: updatedMetrics });
      }

      if (result.error) {
        throw result.error;
      }

      // Update local state
      setMetrics(updatedMetrics);
      
      toast({
        title: "Reading added",
        description: `New ${metrics[metricKey].name} reading has been added`
      });
      
      return true;
    } catch (error) {
      console.error('Error saving metric reading:', error);
      
      toast({
        title: "Update failed",
        description: "Could not save metric reading",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return { metrics, setMetrics, addMetricReading, isLoading };
};

// Hook for lab reports
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
          setReports(data);
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
      const newReport = {
        ...report,
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
        setReports([...reports, data[0]]);
        
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

// Hook for other health-related data...
