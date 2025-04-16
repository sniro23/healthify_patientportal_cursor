
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  inApp: boolean;
  email: boolean;
  sms: boolean;
}

const NotificationSettings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "appointment",
      name: "Appointment Reminders",
      description: "Get notified about upcoming appointments",
      inApp: true,
      email: true,
      sms: false
    },
    {
      id: "prescription",
      name: "Prescription Alerts",
      description: "Notifications for new prescriptions and refills",
      inApp: true,
      email: false,
      sms: false
    },
    {
      id: "billing",
      name: "Billing Notifications",
      description: "Updates about billing, payments, and receipts",
      inApp: true,
      email: true,
      sms: false
    },
    {
      id: "health",
      name: "Health Tips & Blog Updates",
      description: "Health information and new articles",
      inApp: true,
      email: false,
      sms: false
    }
  ]);
  
  const handleToggle = (id: string, channel: 'inApp' | 'email' | 'sms', value: boolean) => {
    setSettings(settings.map(setting => 
      setting.id === id 
        ? { ...setting, [channel]: value }
        : setting
    ));
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Notification settings saved:", settings);
      setIsSaving(false);
      
      toast({
        title: "Notification preferences saved",
        description: "Your notification settings have been updated",
      });
    }, 800);
  };
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
      
      <div className="mb-6">
        <div className="flex border-b pb-2 mb-2">
          <div className="flex-grow text-sm font-medium">Notification Type</div>
          <div className="w-16 text-center text-sm font-medium">In-App</div>
          <div className="w-16 text-center text-sm font-medium">Email</div>
          <div className="w-16 text-center text-sm font-medium">SMS</div>
        </div>
        
        <div className="space-y-4">
          {settings.map(setting => (
            <div key={setting.id} className="flex items-center py-2">
              <div className="flex-grow">
                <p className="text-sm font-medium">{setting.name}</p>
                <p className="text-xs text-slate-500">{setting.description}</p>
              </div>
              
              <div className="w-16 flex justify-center">
                <Switch 
                  checked={setting.inApp}
                  onCheckedChange={(value) => handleToggle(setting.id, 'inApp', value)}
                />
              </div>
              
              <div className="w-16 flex justify-center">
                <Switch 
                  checked={setting.email}
                  onCheckedChange={(value) => handleToggle(setting.id, 'email', value)}
                />
              </div>
              
              <div className="w-16 flex justify-center">
                <Switch 
                  checked={setting.sms}
                  onCheckedChange={(value) => handleToggle(setting.id, 'sms', value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
};

export default NotificationSettings;
