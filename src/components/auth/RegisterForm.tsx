import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const RegisterForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signUp, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const success = await signUp(email, password);
      if (success) {
        // Store full name in localStorage temporarily
        if (fullName) {
          localStorage.setItem("tempFullName", fullName);
        }
        
        // Get the current user and update their profile
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id && fullName) {
          // Parse the fullName into first_name and last_name
          const nameParts = fullName.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";
          
          // Update the profile with the name
          const { error } = await supabase
            .from('profiles')
            .update({
              first_name: firstName,
              last_name: lastName,
              updated_at: new Date().toISOString()
            })
            .eq('id', session.user.id);
            
          if (error) {
            console.error("Error updating profile name:", error);
          }
        }
        
        // Successfully signed up and authenticated
        toast({
          title: "Account created",
          description: "Please set up your profile to continue",
        });
        navigate("/profile-setup");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-health-primary hover:bg-health-accent"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
      
      <div className="text-center text-sm">
        <span className="text-slate-600">Already have an account?</span>{" "}
        <Button
          variant="link"
          className="p-0 h-auto text-health-primary"
          onClick={() => navigate("/login")}
          type="button"
        >
          Sign in
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;
