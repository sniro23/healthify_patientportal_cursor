import { useState, useEffect } from "react";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const accountSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().regex(phoneRegex, "Invalid phone number"),
});

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [googleLinked, setGoogleLinked] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      email: user?.email || "",
      phone: ""
    }
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
        form.setValue('email', user?.email || "");
        form.setValue('phone', data.phone || "");
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  
  const onSubmit = async (data: z.infer<typeof accountSchema>) => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          phone: data.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Account updated",
        description: "Your account information has been updated",
      });
    } catch (error: any) {
      console.error('Update error:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update account",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please ensure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      });

      if (error) throw error;
      
      setPasswordDialogOpen(false);
      passwordForm.reset();
      
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully",
      });
    } catch (error: any) {
      toast({
        title: "Password update failed",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    }
  };
  
  const toggleGoogleLink = () => {
    setGoogleLinked(!googleLinked);
    toast({
      title: googleLinked ? "Google account unlinked" : "Google account linked",
      description: googleLinked 
        ? "Your Google account has been disconnected" 
        : "Your Google account has been connected",
    });
  };
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Account Information</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-slate-50" />
                </FormControl>
                <FormDescription>
                  Your email is used for login and cannot be changed
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Your phone number for account recovery
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="pt-2">
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" type="button">
                  Change Password
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 mt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <Input 
                      type="password" 
                      {...passwordForm.register("currentPassword")} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input 
                      type="password" 
                      {...passwordForm.register("newPassword")} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input 
                      type="password" 
                      {...passwordForm.register("confirmPassword")} 
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => setPasswordDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Update Password
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-medium">Linked Accounts</h3>
            
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Google Sign-in</p>
                <p className="text-xs text-slate-500">
                  {googleLinked 
                    ? "Your account is linked to Google" 
                    : "Connect your Google account for easy login"}
                </p>
              </div>
              <Switch
                checked={googleLinked}
                onCheckedChange={toggleGoogleLink}
              />
            </div>
          </div>
          
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AccountSettings;
