import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { type Session, type User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

// Simplified interface for auth context
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple helper function to ensure profile exists
const ensureProfileExists = async (userId: string) => {
  try {
    console.log('Ensuring profile exists for user:', userId);
    
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking profile existence:', checkError);
      return false;
    }

    // If profile exists, no need to create one
    if (existingProfile) {
      console.log('Profile already exists');
      return true;
    }

    // Create new profile
    console.log('Creating new profile');
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        has_completed_profile: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (createError) {
      console.error('Error creating profile:', createError);
      return false;
    }

    console.log('Profile created successfully');
    return true;
  } catch (error) {
    console.error('Profile creation error:', error);
    return false;
  }
};

// Simplified AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log('AuthProvider rendering');
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Effect to check authentication on mount
  useEffect(() => {
    console.log('AuthProvider: Setting up auth state');
    
    const setupAuth = async () => {
      try {
        // Get current session
        const { data } = await supabase.auth.getSession();
        console.log('Current session:', data.session ? 'exists' : 'none');
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
        
        // Set up auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state change:', event);
            setSession(session);
            setUser(session?.user ?? null);
          }
        );
        
        setIsLoading(false);
        
        // Cleanup subscription
        return () => {
          console.log('Cleaning up auth subscription');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up auth:', error);
        setIsLoading(false);
      }
    };
    
    setupAuth();
  }, []);

  // Simplified sign in function
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with email:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        alert(`Sign in error: ${error.message}`);
        return;
      }
      
      console.log('Sign in successful');
      navigate('/dashboard');
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      alert('An unexpected error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified sign up function
  const signUp = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Signing up with email:', email);
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign up error:', error);
        alert(`Sign up error: ${error.message}`);
        return false;
      }
      
      console.log('Sign up successful');
      
      if (data.user) {
        // Get full name from localStorage if available
        const tempFullName = localStorage.getItem('tempFullName');
        
        // Create profile with additional details if available
        const profileData: any = {
          id: data.user.id,
          has_completed_profile: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Add name details if available
        if (tempFullName) {
          const nameParts = tempFullName.split(' ');
          profileData.first_name = nameParts[0] || '';
          profileData.last_name = nameParts.slice(1).join(' ') || '';
          
          // Clear the temporary storage
          localStorage.removeItem('tempFullName');
        }
        
        // Create the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);
          
        if (profileError) {
          console.error('Error creating profile:', profileError);
          alert(`Profile creation error: ${profileError.message}`);
        } else {
          console.log('Profile created successfully with data:', profileData);
        }
        
        navigate('/profile-setup');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      alert('An unexpected error occurred during sign up');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified sign out function
  const signOut = async () => {
    try {
      console.log('Signing out');
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        alert(`Sign out error: ${error.message}`);
        return;
      }
      
      console.log('Sign out successful');
      navigate('/login');
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      alert('An unexpected error occurred during sign out');
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified reset password function
  const resetPassword = async (email: string) => {
    try {
      console.log('Requesting password reset for:', email);
      setIsLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error('Password reset error:', error);
        alert(`Password reset error: ${error.message}`);
        return;
      }
      
      console.log('Password reset email sent');
      alert('Check your email for the password reset link');
    } catch (error) {
      console.error('Unexpected password reset error:', error);
      alert('An unexpected error occurred during password reset');
    } finally {
      setIsLoading(false);
    }
  };

  // Create auth context value
  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
