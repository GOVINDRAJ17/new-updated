import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("verifying");
  const [rideCode, setRideCode] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          setStatus("error");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/api/stripe/session/${sessionId}`);
        const data = await response.json();

        if (data.status === "completed") {
          setStatus("success");
          setRideCode(data.rideCode);
          toast.success("Payment successful! Booking confirmed.");
        } else {
          setStatus("error");
          toast.error("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        toast.error("Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      verifyPayment();
    }
  }, [searchParams, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md shadow-hover border-2">
        <CardHeader>
          <CardTitle className="text-2xl">Payment Status</CardTitle>
          <CardDescription>Verifying your booking</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Processing your payment...</p>
            </div>
          ) : status === "success" ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground mb-6">Your booking has been confirmed.</p>

              {rideCode && (
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Your Ride Code</p>
                  <p className="text-2xl font-bold text-primary">{rideCode}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Use this code to join the ride chat
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Button
                  onClick={() => navigate("/")}
                  className="w-full gradient-primary"
                >
                  Back to Home
                </Button>
                <Button
                  onClick={() => navigate("/upcoming-rides")}
                  variant="outline"
                  className="w-full"
                >
                  View Your Rides
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
              <p className="text-muted-foreground mb-6">
                There was an issue processing your payment. Please try again.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="w-full gradient-primary"
              >
                Return to Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
