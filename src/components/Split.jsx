import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Users, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import QRScanner from "./QRScanner";

const Split = () => {
  const [totalAmount, setTotalAmount] = useState("50.00");
  const [loading, setLoading] = useState(false);
  const [splitId, setSplitId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([
    { id: 1, name: "You", email: user?.email || "you@example.com", share: 0 },
  ]);

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { id: Date.now(), name: "", email: "", share: 0 },
    ]);
  };

  const removeParticipant = (id: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((p) => p.id !== id));
    }
  };

  const calculateShare = () => {
    const amount = parseFloat(totalAmount) || 0;
    return (amount / participants.length).toFixed(2);
  };

  const handleSendRequest = async () => {
    if (!user) {
      toast.error("Please login to split payments");
      navigate("/auth");
      return;
    }

    if (!totalAmount || participants.some((p) => !p.email)) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.from("split_payments").insert({
        creator_id: user.id,
        total_amount: parseFloat(totalAmount),
        participants: participants.map((p) => ({
          name: p.name,
          email: p.email,
          share: parseFloat(calculateShare()),
        })),
        status: "pending",
      }).select().single();

      if (error) throw error;

      toast.success("Payment split requests sent successfully!");
      setSplitId(data.id);
      setTotalAmount("50.00");
      setParticipants([{ id: 1, name: "You", email: user.email || "", share: 0 }]);
    } catch (error: any) {
      toast.error(error.message || "Failed to send requests");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="split" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-5xl font-bold mb-4">Split Ride Cost</h2>
          <p className="text-muted-foreground text-xl">Share expenses easily with fellow riders</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Split Form */}
            <Card className="shadow-card border-2 rounded-3xl lg:col-span-2 animate-fade-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="text-primary" />
                  Ride Cost Details
                </CardTitle>
                <CardDescription>Enter the total amount and add participants</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="total">Total Ride Cost</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      id="total"
                      type="number"
                      placeholder="0.00"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      className="pl-10 text-lg h-12"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Users size={20} />
                      Participants ({participants.length})
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addParticipant}
                      className="gap-2"
                    >
                      <Plus size={16} />
                      Add
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {participants.map((participant, index) => (
                      <div key={participant.id} className="border border-border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Participant {index + 1}</span>
                          {participants.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeParticipant(participant.id)}
                              className="h-6 w-6 p-0 text-destructive"
                            >
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Input
                            placeholder="Name"
                            value={participant.name}
                            onChange={(e) => {
                              const updated = [...participants];
                              updated[index].name = e.target.value;
                              setParticipants(updated);
                            }}
                            disabled={index === 0}
                          />
                          <Input
                            placeholder="Email or Phone"
                            value={participant.email}
                            onChange={(e) => {
                              const updated = [...participants];
                              updated[index].email = e.target.value;
                              setParticipants(updated);
                            }}
                            disabled={index === 0}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="shadow-soft border-2">
              <CardHeader>
                <CardTitle>Split Summary</CardTitle>
                <CardDescription>Review the split before sending</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="gradient-primary text-white rounded-2xl p-6">
                  <div className="text-sm opacity-90 mb-2">Total Amount</div>
                  <div className="text-5xl font-bold mb-4">${totalAmount}</div>
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="opacity-90">Each person pays</span>
                      <span className="text-2xl font-bold">${calculateShare()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium mb-2">Breakdown</div>
                  {participants.map((participant, index) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                          {participant.name ? participant.name.charAt(0).toUpperCase() : index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{participant.name || `Participant ${index + 1}`}</div>
                          <div className="text-sm text-muted-foreground">{participant.email || "No email"}</div>
                        </div>
                      </div>
                      <div className="font-bold text-primary">${calculateShare()}</div>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={handleSendRequest}
                  disabled={loading}
                  className="w-full gradient-primary text-primary-foreground hover:shadow-hover transition-smooth text-lg py-6"
                >
                  {loading ? "Sending..." : "Send Payment Requests"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  All participants will receive a payment request via email or SMS
                </p>
              </CardContent>
            </Card>

            {/* Stripe Payment */}
            <div className="animate-fade-right">
              <Card className="shadow-card border-2 rounded-3xl">
                <CardHeader className="gradient-primary text-white rounded-t-3xl">
                  <CardTitle className="text-white">Pay with Stripe</CardTitle>
                  <CardDescription className="text-white/90">
                    <blockquote style={{ margin: "0 0 0 40px", border: "none", padding: "0px" }}>
                      Secure payment gateway for split payments
                    </blockquote>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="bg-muted/50 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Your Share:</span>
                      <span className="font-bold text-primary text-xl">₹{calculateShare()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment Method:</span>
                      <span className="font-semibold">Stripe</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      toast.info("Stripe integration ready! Add your Stripe key to enable payments.");
                    }}
                    disabled={!totalAmount}
                    className="w-full gradient-primary text-white hover:shadow-hover transition-smooth py-6 text-lg rounded-full"
                  >
                    Pay ₹{calculateShare()}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Powered by Stripe • Secure Payment Gateway
                  </p>
                </CardContent>
              </Card>

            {splitId && (
              <div className="mt-6">
                <QRScanner splitId={splitId} />
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Split;
