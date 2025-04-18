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
            activity_level: data.activity_level as "Sedentary" | "Light" | "Moderate" | "Active",
            smoking_status: data.smoking_status as "Never" | "Former" | "Current",
            alcohol_consumption: data.alcohol_consumption as "None" | "Occasionally" | "Regularly" | "Frequently"
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
        description: "Please log in to update your lifestyle information",
        variant: "destructive"
      });
      return false;
    }

    try {
      // First, check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, create it with just the id
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (createProfileError) {
          throw createProfileError;
        }
      }

      const lifestyleForDb = {
        user_id: user.id,
        activity_level: updatedInfo.activity_level || lifestyle.activity_level || 'Moderate',
        smoking_status: updatedInfo.smoking_status || lifestyle.smoking_status || 'Never',
        alcohol_consumption: updatedInfo.alcohol_consumption || lifestyle.alcohol_consumption || 'None',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
        result = await supabase
          .from('health_lifestyle')
          .update(lifestyleForDb)
          .eq('id', existingData.id);
      } else {
        result = await supabase
          .from('health_lifestyle')
          .insert(lifestyleForDb);
      }

      if (result.error) {
        throw result.error;
      }

      setLifestyle(prev => ({
        ...prev,
        ...updatedInfo
      }));
      
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
