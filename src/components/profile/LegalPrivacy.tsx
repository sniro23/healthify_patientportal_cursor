
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  FileText, 
  Shield, 
  Download, 
  Trash2,
  ExternalLink
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const LegalPrivacy = () => {
  const { toast } = useToast();
  const [isRequestingExport, setIsRequestingExport] = useState(false);
  const [isDeletionDialogOpen, setIsDeletionDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  
  const handleDataExport = () => {
    setIsRequestingExport(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRequestingExport(false);
      
      toast({
        title: "Data export requested",
        description: "Your data will be prepared and sent to your email within 48 hours",
      });
    }, 1000);
  };
  
  const handleDataDeletion = () => {
    if (confirmText !== "DELETE") {
      toast({
        title: "Confirmation required",
        description: 'Please type "DELETE" to confirm account deletion',
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsDeletionDialogOpen(false);
      setConfirmText("");
      
      toast({
        title: "Account deletion requested",
        description: "Your account deletion process has started and will be completed within 30 days",
      });
    }, 1000);
  };
  
  const documentsLinks = [
    {
      name: "Terms & Conditions",
      description: "Our user agreement and legal terms",
      icon: <FileText className="w-4 h-4" />
    },
    {
      name: "Privacy Policy",
      description: "How we collect and use your information",
      icon: <Shield className="w-4 h-4" />
    },
    {
      name: "Cookie Policy",
      description: "How we use cookies on our platform",
      icon: <FileText className="w-4 h-4" />
    }
  ];
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Legal & Privacy</h2>
      
      {/* Legal Documents */}
      <div className="mb-8">
        <h3 className="text-sm font-medium mb-3">Legal Documents</h3>
        
        <div className="space-y-3">
          {documentsLinks.map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center">
                <div className="bg-slate-100 p-2 rounded-full mr-3">
                  {doc.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Data Controls */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium mb-3">Your Data</h3>
        
        {/* Data Export */}
        <div className="border rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Download className="w-4 h-4 text-blue-700" />
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-medium">Export Your Data</h4>
              <p className="text-xs text-slate-500 mb-3">
                Request a complete copy of all your personal information
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDataExport}
                disabled={isRequestingExport}
              >
                {isRequestingExport ? "Processing..." : "Request Data Export"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Data Deletion */}
        <div className="border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-grow">
              <h4 className="text-sm font-medium">Delete Your Account</h4>
              <p className="text-xs text-slate-500 mb-3">
                Permanently delete your account and all associated data
              </p>
              
              <Dialog open={isDeletionDialogOpen} onOpenChange={setIsDeletionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Request Account Deletion
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-red-600">Delete Account Confirmation</DialogTitle>
                    <DialogDescription className="pt-2">
                      This action is irreversible. All your data, including health records, appointments, and profile information will be permanently deleted.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <p className="text-sm mb-4">
                      To confirm, please type <strong>DELETE</strong> below:
                    </p>
                    <Input 
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                      placeholder="Type DELETE to confirm"
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDeletionDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleDataDeletion}
                    >
                      Permanently Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Since we're using this component, make sure we have the Input component available
const Input = ({ value, onChange, placeholder }: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) => {
  return (
    <input
      className="border border-slate-300 w-full rounded-md px-3 py-2 text-sm"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default LegalPrivacy;
