import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { PersonalInfo } from '@/lib/fhir/types';

export const usePersonalInfo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    full_name: '',
    age: 0,
    gender: '',
    marital_status: '',
    children: 0,
    address: ''
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
          .maybeSingle();

        if (error) {
          console.error('Error fetching personal info:', error);
        } else if (data) {
          setPersonalInfo({
            id: data.id,
            full_name: data.full_name,
            age: data.age,
            gender: data.gender,
            marital_status: data.marital_status,
            children: data.children,
            address: data.address
          });
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
        description: "Please log in to update your information",
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

      const personalInfoForDb = {
        user_id: user.id,
        full_name: updatedInfo.full_name || personalInfo.full_name,
        age: updatedInfo.age || personalInfo.age,
        gender: updatedInfo.gender || personalInfo.gender,
        marital_status: updatedInfo.marital_status || personalInfo.marital_status,
        children: updatedInfo.children ?? personalInfo.children,
        address: updatedInfo.address || personalInfo.address
      };

      // Check if record exists
      const { data: existingData, error: checkError } = await supabase
        .from('health_personal_info')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingData?.id) {
        result = await supabase
          .from('health_personal_info')
          .update(personalInfoForDb)
          .eq('id', existingData.id);
      } else {
        result = await supabase
          .from('health_personal_info')
          .insert(personalInfoForDb);
      }

      if (result.error) {
        throw result.error;
      }

      // Update local state
      setPersonalInfo({
        ...personalInfo,
        ...updatedInfo
      });
      
      toast({
        title: "Profile updated",
        description: "Your personal information has been updated"
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
