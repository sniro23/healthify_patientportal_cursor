
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Landmark, 
  Calendar, 
  FileText, 
  ArrowUpDown, 
  ChevronDown, 
  Download,
  Filter
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubscriptionBadge from "@/components/dashboard/SubscriptionBadge";
import { generateInvoicePDF, formatCurrency, downloadBlob } from "@/lib/utils";

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'upi';
  name: string;
  details: string;
  isDefault: boolean;
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoice: string;
  service: string;
  paymentMethod: string;
}

const PaymentSettings = () => {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState("b");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("current-plan");
  const [dateFilter, setDateFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  
  // Mock data
  const paymentMethods: PaymentMethod[] = [
    {
      id: "pm_1",
      type: "card",
      name: "Visa ending in 4242",
      details: "Expires 12/2025",
      isDefault: true
    },
    {
      id: "pm_2",
      type: "bank",
      name: "Commercial Bank",
      details: "Account ending in 7890",
      isDefault: false
    }
  ];
  
  const billingHistory: BillingHistory[] = [
    {
      id: "inv_001",
      date: "2025-03-15",
      amount: 2500,
      status: "paid",
      invoice: "INV-2025-001",
      service: "Consultation",
      paymentMethod: "Visa Card"
    },
    {
      id: "inv_002",
      date: "2025-03-10",
      amount: 4000,
      status: "paid",
      invoice: "INV-2025-002",
      service: "Subscription",
      paymentMethod: "Bank Transfer"
    },
    {
      id: "inv_003",
      date: "2025-03-05",
      amount: 500,
      status: "failed",
      invoice: "INV-2025-003",
      service: "Lab Upload",
      paymentMethod: "Visa Card"
    },
    {
      id: "inv_004",
      date: "2025-02-28",
      amount: 1200,
      status: "paid",
      invoice: "INV-2025-004",
      service: "Home Visit",
      paymentMethod: "Bank Transfer"
    }
  ];
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handlePlanChange = (plan: string) => {
    setCurrentPlan(plan);
    setIsDialogOpen(false);
    
    toast({
      title: "Plan updated",
      description: `Your subscription has been updated to Plan ${plan.toUpperCase()}`,
    });
  };
  
  const handleDownloadInvoice = async (invoice: BillingHistory) => {
    setIsLoading(true);
    try {
      const blob = await generateInvoicePDF(invoice.id);
      downloadBlob(blob, `Invoice_${invoice.invoice}.pdf`);
      
      toast({
        title: "Invoice downloaded",
        description: `Invoice ${invoice.invoice} has been downloaded`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your invoice. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddPaymentMethod = () => {
    toast({
      title: "Payment method added",
      description: "Your new payment method has been saved",
    });
  };
  
  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-4 h-4" />;
      case 'bank':
        return <Landmark className="w-4 h-4" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Apply filters to billing history
  const filteredBillingHistory = billingHistory.filter(item => {
    const dateMatch = dateFilter === "all" ? true : 
      dateFilter === "recent" ? new Date(item.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : 
      dateFilter === "older" ? new Date(item.date) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) : true;
    
    const serviceMatch = serviceFilter === "all" ? true : item.service.toLowerCase() === serviceFilter.toLowerCase();
    
    return dateMatch && serviceMatch;
  });
  
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold mb-4">Payment Settings</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Button 
          variant={activeTab === "current-plan" ? "default" : "outline"} 
          className="flex-1"
          onClick={() => setActiveTab("current-plan")}
        >
          Current Plan
        </Button>
        <Button 
          variant={activeTab === "payment-methods" ? "default" : "outline"} 
          className="flex-1"
          onClick={() => setActiveTab("payment-methods")}
        >
          Payment Methods
        </Button>
        <Button 
          variant={activeTab === "billing-history" ? "default" : "outline"} 
          className="flex-1"
          onClick={() => setActiveTab("billing-history")}
        >
          Billing History
        </Button>
      </div>
      
      {activeTab === "current-plan" && (
        <div className="border rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-slate-700">Current Plan</h3>
              <div className="flex items-center mt-1">
                <span className="text-lg font-semibold mr-2">Plan {currentPlan.toUpperCase()}</span>
                <SubscriptionBadge tier={currentPlan} />
              </div>
              <p className="text-sm text-slate-500 mt-1">Renews on April 15, 2025</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  Change Plan
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Subscription Plan</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${currentPlan === "a" ? "border-health-primary bg-health-primary/5" : ""}`}
                    onClick={() => handlePlanChange("a")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium flex items-center">
                          Plan A <SubscriptionBadge tier="a" className="ml-2" />
                        </h3>
                        <p className="text-sm text-slate-500">Premium features + priority support</p>
                      </div>
                      <span className="text-md font-bold">$34.99/mo</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${currentPlan === "b" ? "border-health-primary bg-health-primary/5" : ""}`}
                    onClick={() => handlePlanChange("b")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium flex items-center">
                          Plan B <SubscriptionBadge tier="b" className="ml-2" />
                        </h3>
                        <p className="text-sm text-slate-500">Advanced features</p>
                      </div>
                      <span className="text-md font-bold">$24.99/mo</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${currentPlan === "c" ? "border-health-primary bg-health-primary/5" : ""}`}
                    onClick={() => handlePlanChange("c")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium flex items-center">
                          Plan C <SubscriptionBadge tier="c" className="ml-2" />
                        </h3>
                        <p className="text-sm text-slate-500">Basic features</p>
                      </div>
                      <span className="text-md font-bold">$14.99/mo</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${currentPlan === "d" ? "border-health-primary bg-health-primary/5" : ""}`}
                    onClick={() => handlePlanChange("d")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium flex items-center">
                          Plan D <SubscriptionBadge tier="d" className="ml-2" />
                        </h3>
                        <p className="text-sm text-slate-500">Limited features</p>
                      </div>
                      <span className="text-md font-bold">$9.99/mo</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${currentPlan === "free" ? "border-health-primary bg-health-primary/5" : ""}`}
                    onClick={() => handlePlanChange("free")}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium flex items-center">
                          Free Tier <SubscriptionBadge tier="free" className="ml-2" />
                        </h3>
                        <p className="text-sm text-slate-500">Basic access with limitations</p>
                      </div>
                      <span className="text-md font-bold">$0/mo</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
      
      {activeTab === "payment-methods" && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Payment Methods</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center">
                  <div className="bg-slate-100 p-2 rounded-full mr-3">
                    {getPaymentMethodIcon(method.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{method.name}</p>
                    <p className="text-xs text-slate-500">{method.details}</p>
                  </div>
                </div>
                {method.isDefault && (
                  <Badge variant="outline" className="text-xs">Default</Badge>
                )}
              </div>
            ))}
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-3">
                + Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <RadioGroup defaultValue="card" onValueChange={setSelectedPaymentMethod} className="mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center">
                        <CreditCard className="w-4 h-4 mr-2" /> Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center">
                        <Landmark className="w-4 h-4 mr-2" /> Bank Transfer
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
                
                {selectedPaymentMethod === "card" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input id="nameOnCard" placeholder="John Smith" />
                    </div>
                  </div>
                )}
                
                {selectedPaymentMethod === "bank" && (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input id="bankName" placeholder="Bank of Ceylon" />
                    </div>
                    <div>
                      <Label htmlFor="accountName">Account Name</Label>
                      <Input id="accountName" placeholder="John Smith" />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" placeholder="123456789" />
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <Button onClick={handleAddPaymentMethod}>Save Payment Method</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
      
      {activeTab === "billing-history" && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium">Billing History</h3>
            <div className="flex space-x-2">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="recent">Last 30 Days</SelectItem>
                  <SelectItem value="older">Older</SelectItem>
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-[150px] h-8">
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="consultation">Consultations</SelectItem>
                  <SelectItem value="subscription">Subscriptions</SelectItem>
                  <SelectItem value="lab upload">Lab Uploads</SelectItem>
                  <SelectItem value="home visit">Home Visits</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {filteredBillingHistory.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBillingHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{formatDate(item.date)}</TableCell>
                      <TableCell>{item.service}</TableCell>
                      <TableCell>{formatCurrency(item.amount)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2"
                          onClick={() => handleDownloadInvoice(item)}
                          disabled={item.status !== "paid" || isLoading}
                        >
                          <Download className="w-4 h-4 mr-1" /> 
                          Invoice
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-8 border rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No billing history available with the selected filters</p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === "billing-history" && filteredBillingHistory.length === 0 && (
        <div className="text-center py-4">
          <Button variant="outline" onClick={() => {
            setDateFilter("all");
            setServiceFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentSettings;
