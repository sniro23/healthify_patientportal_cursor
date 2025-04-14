
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationState {
  providerType: string;
  specialty?: string;
  appointmentType: string;
  deliveryMethod?: string;
  date: string;
  time: string;
  price: number;
  serviceArea?: string;
  address?: string;
  addressNotes?: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get state passed from the previous page
  const { 
    providerType,
    specialty,
    appointmentType,
    deliveryMethod,
    date,
    time,
    price,
    serviceArea,
    address,
    addressNotes
  } = (location.state as LocationState) || {};
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Mock card details state
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  
  // Handle payment submission
  const handlePaymentSubmit = () => {
    // Basic validation
    if (paymentMethod === "card") {
      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        toast({
          variant: "destructive",
          title: "Missing Information",
          description: "Please fill in all card details."
        });
        return;
      }
      
      // Simple card number validation
      if (cardNumber.replace(/\s/g, "").length !== 16) {
        toast({
          variant: "destructive",
          title: "Invalid Card Number",
          description: "Please enter a valid 16-digit card number."
        });
        return;
      }
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Successful payment
      toast({
        title: "Payment Successful",
        description: `Your payment of LKR ${price.toLocaleString()} has been processed.`,
      });
      
      // Navigate to confirmation
      navigate("/appointments/confirmation", {
        state: {
          providerType,
          specialty,
          appointmentType,
          deliveryMethod,
          date,
          time,
          serviceArea,
          address,
          addressNotes,
          paymentCompleted: true
        }
      });
    }, 2000);
  };

  return (
    <PageContainer 
      title="Payment"
      showBackButton={true}
    >
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg">Appointment Summary</h3>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Provider Type:</span>
                  <span className="font-medium">{providerType}</span>
                </div>
                {specialty && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialty:</span>
                    <span className="font-medium">{specialty}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Appointment Type:</span>
                  <span className="font-medium">{appointmentType}</span>
                </div>
                {deliveryMethod && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Method:</span>
                    <span className="font-medium">{deliveryMethod}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{time}</span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                  <span className="text-gray-800 font-medium">Total Amount:</span>
                  <span className="font-bold text-health-primary">LKR {price.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-4">Payment Method</h3>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as "card" | "bank")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex items-center">
                    <Landmark className="h-4 w-4 mr-2" />
                    Bank Transfer
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="cardHolder">Card Holder Name</Label>
                  <Input
                    id="cardHolder"
                    placeholder="Name as on card"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === "bank" && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium">Bank Transfer Instructions</h4>
                <p className="text-sm mt-2">
                  Please transfer LKR {price.toLocaleString()} to the following account within 24 hours:
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <p><span className="font-medium">Bank:</span> Global Trust Bank</p>
                  <p><span className="font-medium">Account Name:</span> Healthify Medical Services</p>
                  <p><span className="font-medium">Account Number:</span> 0072-35891-01</p>
                  <p><span className="font-medium">Reference:</span> APPT-{Date.now().toString().slice(-6)}</p>
                </div>
                <p className="text-xs mt-3 text-gray-600">
                  After making the transfer, click "Confirm Payment" below.
                </p>
              </div>
            )}
            
            <Button 
              className="w-full mt-6" 
              onClick={handlePaymentSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : `Pay LKR ${price.toLocaleString()}`}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-xs text-gray-600">
        <p>Your payment information is secure and encrypted. We do not store your complete card details on our servers.</p>
      </div>
    </PageContainer>
  );
};

export default Payment;
