
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically integrate with Supabase or other auth provider
      // For now, we'll simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock successful login
      localStorage.setItem("isAuthenticated", "true");
      
      toast({
        title: "Login successful",
        description: "Welcome to Healthify Patient Portal",
      });
      
      // Check if the user has completed profile setup
      const hasCompletedProfile = localStorage.getItem("hasCompletedProfile");
      
      if (hasCompletedProfile) {
        navigate("/");
      } else {
        navigate("/profile-setup");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button
            variant="link"
            size="sm"
            className="text-xs text-health-primary p-0 h-auto"
            onClick={() => navigate("/forgot-password")}
            type="button"
          >
            Forgot password?
          </Button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-health-primary hover:bg-health-accent"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
      
      <div className="text-center text-sm">
        <span className="text-slate-600">Don't have an account?</span>{" "}
        <Button
          variant="link"
          className="p-0 h-auto text-health-primary"
          onClick={() => navigate("/register")}
          type="button"
        >
          Register here
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
