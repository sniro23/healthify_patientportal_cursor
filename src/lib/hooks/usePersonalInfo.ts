
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { PersonalInfo } from '@/lib/fhir/types';

export const usePersonalInfo = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchPersonalInfo = async () => {
      try {
        // First try to fetch from health_personal_info table
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
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            dateOfBirth: data.date_of_birth || '',
            gender: data.gender || '',
            phone: data.phone || '',
            email: data.email || user.email || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            postalCode: data.postal_code || '',
            bloodType: data.blood_type || '',
            emergencyContact: data.emergency_contact ? {
              name: data.emergency_contact.name || '',
              phone: data.emergency_contact.phone || '',
              relationship: data.emergency_contact.relationship || '',
            } : undefined
          });
        } else {
          // If no specific health record, try to get basic info from profiles
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
            
          if (!profileError && profileData) {
            setPersonalInfo({
              firstName: profileData.first_name || '',
              lastName: profileData.last_name || '',
              dateOfBirth: profileData.date_of_birth || '',
              gender: profileData.gender || '',
              phone: profileData.phone || '',
              email: user.email || '',
            });
          }
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
      // Transform from our interface to match database structure
      const infoForDb = {
        user_id: user.id,
        first_name: updatedInfo.firstName || personalInfo.firstName,
        last_name: updatedInfo.lastName || personalInfo.lastName,
        date_of_birth: updatedInfo.dateOfBirth || personalInfo.dateOfBirth,
        gender: updatedInfo.gender || personalInfo.gender,
        phone: updatedInfo.phone || personalInfo.phone,
        email: updatedInfo.email || personalInfo.email,
        address: updatedInfo.address || personalInfo.address,
        city: updatedInfo.city || personalInfo.city,
        state: updatedInfo.state || personalInfo.state,
        postal_code: updatedInfo.postalCode || personalInfo.postalCode,
        blood_type: updatedInfo.bloodType || personalInfo.bloodType,
        emergency_contact: updatedInfo.emergencyContact || personalInfo.emergencyContact
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
        // Update existing record
        result = await supabase
          .from('health_personal_info')
          .update(infoForDb)
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('health_personal_info')
          .insert(infoForDb);
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
      
      // Also update the basic info in profiles table
      await supabase
        .from('profiles')
        .update({
          first_name: updatedInfo.firstName || personalInfo.firstName,
          last_name: updatedInfo.lastName || personalInfo.lastName,
          date_of_birth: updatedInfo.dateOfBirth || personalInfo.dateOfBirth,
          gender: updatedInfo.gender || personalInfo.gender,
          phone: updatedInfo.phone || personalInfo.phone,
        })
        .eq('id', user.id);
      
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
