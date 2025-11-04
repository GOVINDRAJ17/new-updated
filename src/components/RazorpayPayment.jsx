import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const RazorpayPayment = ({ amount, rideId, splitId, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(amount.toString());

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to make payment");
      return;
    }

    setLoading(true);

    const res = await loadRazorpayScript();

    if (!res) {
      toast.error("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    // Note: In production, you would create an order from your backend
    // For now, we'll use test mode configuration
    const options = {
      key: "rzp_test_YOUR_KEY_ID", // Replace with your Razorpay Key ID
      amount: Math.round(parseFloat(paymentAmount) * 100), // Amount in paise
      currency: "INR",
      name: "Velocity",
      description: rideId ? "Ride Payment" : "Split Payment",
      image: "/placeholder.svg",
      handler: function (response) {
        toast.success("Payment successful!");
        console.log("Payment ID:", response.razorpay_payment_id);
        
        // Here you would save payment details to your database
        // updatePaymentStatus(response);
        
        if (onSuccess) {
          onSuccess();
        }
      },
      prefill: {
        email: user.email,
      },
      theme: {
        color: "#3b82f6",
      },
    };

  const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  return (
    <Card className="shadow-card border-2 rounded-3xl">
      <CardHeader className="gradient-primary text-white rounded-t-3xl">
        <CardTitle className="flex items-center gap-2 text-white">
          <CreditCard />
          Razorpay Payment
        </CardTitle>
        <CardDescription className="text-white/90">
          Secure payment gateway
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="text-2xl font-bold"
          />
        </div>

        <div className="bg-muted/50 p-4 rounded-xl space-y-2">
          <div className="flex justify-between text-sm">
            <span>Amount:</span>
            <span className="font-semibold">₹{paymentAmount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Payment Method:</span>
            <span className="font-semibold">Razorpay</span>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading || !paymentAmount}
          className="w-full gradient-primary text-white hover:shadow-hover transition-smooth py-6 text-lg rounded-full"
        >
          {loading ? "Processing..." : `Pay ₹${paymentAmount}`}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Powered by Razorpay • Secure Payment Gateway
        </p>
      </CardContent>
    </Card>
  );
};

export default RazorpayPayment;
