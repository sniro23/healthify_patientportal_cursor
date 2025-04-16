
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Here you would typically integrate with Supabase or other auth provider
      // For now, we'll simulate a successful password reset request
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setIsSubmitted(true);
      
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: "There was a problem sending the reset link",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold">Check your email</h2>
        <p className="text-slate-600">
          We've sent a password reset link to {email}
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => navigate("/login")}
        >
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      
      <Button 
        type="submit" 
        className="w-full bg-health-primary hover:bg-health-accent"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send reset link"}
      </Button>
      
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => navigate("/login")}
      >
        Back to login
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
