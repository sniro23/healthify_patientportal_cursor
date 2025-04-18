
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { VitalsInfo } from '@/lib/fhir/types';

export const useVitalsInfo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vitals, setVitals] = useState<VitalsInfo>({
    height: 0,
    weight: 0,
    bmi: 0,
    blood_group: '',
    blood_pressure: {
      systolic: 0,
      diastolic: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchVitals = async () => {
      try {
        const { data, error } = await supabase
          .from('health_vitals')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching vitals:', error);
        } else if (data) {
          setVitals({
            id: data.id,
            height: data.height,
            weight: data.weight,
            bmi: data.bmi,
            blood_group: data.blood_group
          });
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVitals();
  }, [user]);

  const updateVitalsInfo = async (updatedInfo: Partial<VitalsInfo>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to update your vitals",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Calculate BMI if height and weight are available
      let bmi = vitals.bmi;
      const height = updatedInfo.height !== undefined ? updatedInfo.height : vitals.height;
      const weight = updatedInfo.weight !== undefined ? updatedInfo.weight : vitals.weight;
      
      if (height > 0 && weight > 0) {
        const heightInMeters = height / 100; // Convert cm to meters
        bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
      }

      const vitalsForDb = {
        user_id: user.id,
        height,
        weight,
        bmi,
        blood_group: updatedInfo.blood_group || vitals.blood_group
      };
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('health_vitals')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingData?.id) {
        result = await supabase
          .from('health_vitals')
          .update(vitalsForDb)
          .eq('id', existingData.id);
      } else {
        result = await supabase
          .from('health_vitals')
          .insert(vitalsForDb);
      }

      if (result.error) {
        throw result.error;
      }

      // Update local state with calculated BMI
      setVitals({
        ...vitals,
        ...updatedInfo,
        bmi
      });
      
      toast({
        title: "Vitals updated",
        description: "Your health vitals have been updated"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving vitals:', error);
      
      toast({
        title: "Update failed",
        description: "Could not save vital information",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return { vitals, setVitals, updateVitalsInfo, isLoading };
};
