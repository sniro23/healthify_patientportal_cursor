
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { LifestyleInfo } from '@/lib/fhir/types';

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

    const fetchLifestyle = async () => {
      try {
        const { data, error } = await supabase
          .from('health_lifestyle')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching lifestyle info:', error);
        } else if (data) {
          setLifestyle({
            id: data.id,
            activity_level: data.activity_level || "Moderate",
            smoking_status: data.smoking_status || "Never",
            alcohol_consumption: data.alcohol_consumption || "Occasionally"
          });
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLifestyle();
  }, [user]);

  const updateLifestyleInfo = async (updatedInfo: Partial<LifestyleInfo>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to update your information",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Transform from our interface to match database structure
      const lifestyleForDb = {
        user_id: user.id,
        activity_level: updatedInfo.activity_level || lifestyle.activity_level,
        smoking_status: updatedInfo.smoking_status || lifestyle.smoking_status,
        alcohol_consumption: updatedInfo.alcohol_consumption || lifestyle.alcohol_consumption
      };
      
      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('health_lifestyle')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingData?.id) {
        // Update existing record
        result = await supabase
          .from('health_lifestyle')
          .update(lifestyleForDb)
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('health_lifestyle')
          .insert(lifestyleForDb);
      }

      if (result.error) {
        throw result.error;
      }

      // Update local state
      setLifestyle({
        ...lifestyle,
        ...updatedInfo
      });
      
      toast({
        title: "Lifestyle updated",
        description: "Your lifestyle information has been updated"
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
