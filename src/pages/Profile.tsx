
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import ProfileSettings from "@/components/profile/ProfileSettings";
import AccountSettings from "@/components/profile/AccountSettings";
import PaymentSettings from "@/components/profile/PaymentSettings";
import NotificationSettings from "@/components/profile/NotificationSettings";
import HelpSupport from "@/components/profile/HelpSupport";
import LegalPrivacy from "@/components/profile/LegalPrivacy";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("app-settings");
  
  const handleLogout = () => {
    // Simulate logout functionality
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("hasCompletedProfile");
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    
    navigate("/login");
  };
  
  return (
    <PageContainer title="Profile & Settings" showBackButton={false}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Profile & Settings</h1>
        <p className="text-slate-600 mt-1">
          Manage your account preferences and settings
        </p>
      </div>
      
      <Tabs 
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full overflow-x-auto mb-6 flex flex-nowrap justify-start">
          <TabsTrigger value="app-settings">App Settings</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notification">Notifications</TabsTrigger>
          <TabsTrigger value="help">Help & Support</TabsTrigger>
          <TabsTrigger value="legal">Legal & Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="app-settings">
          <ProfileSettings />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentSettings />
        </TabsContent>
        
        <TabsContent value="notification">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="help">
          <HelpSupport />
        </TabsContent>
        
        <TabsContent value="legal">
          <LegalPrivacy />
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 pb-8">
        <Button 
          variant="outline" 
          className="w-full border-red-300 text-red-500 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </PageContainer>
  );
};

export default Profile;
