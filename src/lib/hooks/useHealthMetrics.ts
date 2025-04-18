import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { MetricData } from '@/lib/fhir/types';
import { isMetricDataRecord, parseJSON } from '../utils/typeGuards';

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
          .maybeSingle();

        if (error) {
          console.error('Error fetching health metrics:', error);
        } else if (data?.metrics) {
          const parsedMetrics = parseJSON(data.metrics, isMetricDataRecord);
          if (parsedMetrics) {
            setMetrics(parsedMetrics);
          }
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

      // Convert metrics to plain object suitable for JSON storage
      const metricsForStorage = JSON.stringify(updatedMetrics);

      let result;
      if (existingData?.id) {
        // Update existing record - stringify the metrics for proper JSON storage
        result = await supabase
          .from('health_metrics')
          .update({ 
            metrics: metricsForStorage
          })
          .eq('id', existingData.id);
      } else {
        // Insert new record - stringify the metrics for proper JSON storage
        result = await supabase
          .from('health_metrics')
          .insert({ 
            user_id: user.id, 
            metrics: metricsForStorage
          });
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
