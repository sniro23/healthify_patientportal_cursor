import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Medication } from '@/lib/fhir/types';

export const useMedications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchMedications = async () => {
      try {
        const { data, error } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching medications:', error);
        } else if (data) {
          setMedications(data.map(med => ({
            id: med.id,
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency,
            start_date: med.start_date,
            end_date: med.end_date,
            notes: med.notes
          })));
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, [user]);

  const addMedication = async (medication: Omit<Medication, 'id'>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add medications",
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

      const medicationForDb = {
        user_id: user.id,
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        start_date: medication.start_date,
        end_date: medication.end_date,
        notes: medication.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('medications')
        .insert(medicationForDb)
        .select()
        .single();

      if (error) throw error;

      setMedications(prev => [data, ...prev]);
      
      toast({
        title: "Medication added",
        description: "Your medication has been added successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error adding medication:', error);
      
      toast({
        title: "Add failed",
        description: "Could not add medication",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const updateMedication = async (id: string, updatedMedication: Partial<Medication>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to update medications",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('medications')
        .update({
          ...updatedMedication,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setMedications(prev => 
        prev.map(med => 
          med.id === id ? { ...med, ...updatedMedication } : med
        )
      );
      
      toast({
        title: "Medication updated",
        description: "Your medication has been updated successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error updating medication:', error);
      
      toast({
        title: "Update failed",
        description: "Could not update medication",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const deleteMedication = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to delete medications",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setMedications(prev => prev.filter(med => med.id !== id));
      
      toast({
        title: "Medication deleted",
        description: "Your medication has been deleted successfully"
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting medication:', error);
      
      toast({
        title: "Delete failed",
        description: "Could not delete medication",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return { medications, addMedication, updateMedication, deleteMedication, isLoading };
}; 