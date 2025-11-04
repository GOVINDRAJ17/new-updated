import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Users, DollarSign, Clock, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { formatDistance } from "date-fns";
import { Loader2 } from "lucide-react";


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function RideCard({ ride, isOwner = false, onJoin }) {
  const { user } = useAuth();
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [splitCount, setSplitCount] = useState(1);
  const [joining, setJoining] = useState(false);

  const departureDate = new Date(ride.departure_time);
  const timeUntilDeparture = formatDistance(departureDate, new Date(), {
    addSuffix: true,
  });
  const perPersonAmount =
    splitCount > 1
      ? Math.ceil(ride.price_per_seat / splitCount)
      : ride.price_per_seat;

  const handleJoinRide = async () => {
    if (!user) {
      toast.error("Please sign in to join a ride");
      return;
    }

    if (user.id === ride.created_by) {
      toast.error("You cannot join your own ride");
      return;
    }

    setJoining(true);

    try {
      const response = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rideId: ride.id,
          userId: user.id,
          amount: perPersonAmount,
          currency: "INR",
          driverEmail: user.email,
          rideTitle: ride.title,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to redirect to payment");
      }
    } catch (error) {
      console.error("Error joining ride:", error);
      toast.error((error && error.message) || "Failed to join ride");
    } finally {
      setJoining(false);
    }
  };

  const seatsPercentage = ((ride.total_seats - ride.seats_left) / ride.total_seats) * 100;

  return (
    <>
      <Card className="hover:shadow-hover transition-shadow overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg">{ride.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Departs {timeUntilDeparture}
              </p>
            </div>
            {isOwner && (
              <div className="px-2 py-1 bg-primary/10 rounded text-xs font-medium text-primary">
                Your Ride
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="font-medium">{ride.origin}</span>
            </div>
            <div className="ml-3.5 h-6 border-l-2 border-dashed border-muted"></div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="font-medium">{ride.destination}</span>
            </div>
          </div>

          <div className="pt-2 border-t grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Seats Available</p>
              <p className="text-lg font-bold">{ride.seats_left}</p>
              <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${seatsPercentage}%` }}
                ></div>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Price per Seat</p>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <p className="text-lg font-bold">
                  {(ride.price_per_seat / 100).toFixed(0)}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Time to Depart</p>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <p className="text-lg font-bold text-primary">
                  {formatDistance(new Date(), departureDate, { unit: "hour" }).split(" ")[0]}h
                </p>
              </div>
            </div>
          </div>

          {ride.seats_left === 0 ? (
            <Button disabled className="w-full" variant="outline">
              <AlertCircle className="mr-2 h-4 w-4" />
              No Seats Available
            </Button>
          ) : isOwner ? (
            <Button disabled variant="outline" className="w-full">
              Your Ride
            </Button>
          ) : (
            <Button
              onClick={() => setShowJoinDialog(true)}
              className="w-full gradient-primary text-primary-foreground hover:shadow-hover transition-shadow"
            >
              <Users className="mr-2 h-4 w-4" />
              Join Ride
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Join Ride - Confirm Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Ride Details</p>
              <div className="space-y-2 p-3 bg-muted rounded">
                <p className="text-sm">
                  <span className="font-medium">From:</span> {ride.origin}
                </p>
                <p className="text-sm">
                  <span className="font-medium">To:</span> {ride.destination}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Time:</span> {timeUntilDeparture}
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="split-count" className="text-sm font-medium">
                Split Cost with (people)
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                How many people will share the cost?
              </p>
              <select
                id="split-count"
                value={splitCount}
                onChange={(e) => setSplitCount(parseInt(e.target.value))}
                className="w-full p-2 border rounded-md bg-background"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-accent/10 rounded">
              <p className="text-sm text-muted-foreground mb-1">Total Cost per Person</p>
              <p className="text-2xl font-bold text-accent">
                ₹ {(perPersonAmount / 100).toFixed(2)}
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowJoinDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinRide}
                disabled={joining}
                className="flex-1 gradient-primary text-primary-foreground"
              >
                {joining ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Payment"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
