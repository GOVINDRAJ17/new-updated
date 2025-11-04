import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft, MapPin, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";
import RideChat from "@/components/RideChat";

export default function UpcomingRides() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createdRides, setCreatedRides] = useState([]);
  const [joinedRides, setJoinedRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchRides = async () => {
      try {
        const { data: createdData, error: createdError } = await supabase
          .from("rides")
          .select("*")
          .eq("created_by", user.id)
          .eq("status", "active")
          .order("departure_time", { ascending: true });

        if (createdError) throw createdError;
        setCreatedRides(createdData || []);

        const { data: joinedData, error: joinedError } = await supabase
          .from("ride_participants")
          .select(
            `
            ride_id,
            rides: ride_id (
              id,
              title,
              origin,
              destination,
              departure_time,
              total_seats,
              seats_left,
              price_per_seat,
              created_by,
              ride_code,
              status
            )
          `
          )
          .eq("user_id", user.id);

        if (joinedError) throw joinedError;

        const joinedRidesList = (joinedData || [])
          .map((p) => p.rides)
          .filter((r) => r && r.status === "active")
          .sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime());

        setJoinedRides(joinedRidesList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rides:", error);
        toast.error("Failed to load rides");
        setLoading(false);
      }
    };

    fetchRides();
  }, [user, navigate]);

  const allUpcomingRides = [...createdRides, ...joinedRides]
    .filter((r) => new Date(r.departure_time) > new Date())
    .sort(
      (a, b) =>
        new Date(a.departure_time).getTime() -
        new Date(b.departure_time).getTime()
    );

  const RideListItem = ({ ride, isCreated }) => {
    const departureDate = new Date(ride.departure_time);
    const timeUntilDeparture = formatDistanceToNow(departureDate, {
      addSuffix: true,
    });

    return (
      <Card
        className="cursor-pointer hover:shadow-hover transition-all"
        onClick={() => setSelectedRide(ride.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">{ride.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {timeUntilDeparture}
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{ride.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span>{ride.destination}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Available</p>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="font-medium">{ride.seats_left}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Price/Seat</p>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-medium">
                      {(ride.price_per_seat / 100).toFixed(0)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <span className="text-sm font-medium">
                    {format(departureDate, "MMM dd")}
                  </span>
                </div>
              </div>

              {ride.ride_code && (
                <div className="mt-3 p-2 bg-primary/10 rounded">
                  <p className="text-xs text-muted-foreground">Ride Code</p>
                  <p className="font-mono font-bold text-primary">{ride.ride_code}</p>
                </div>
              )}
            </div>

            <div className="text-right">
              {isCreated && (
                <div className="inline-block px-2 py-1 bg-primary/10 rounded text-xs font-medium text-primary">
                  Your Ride
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Upcoming Rides</h1>
              <p className="text-muted-foreground">
                Your scheduled rides and trips
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : selectedRide ? (
          <div className="space-y-6">
            <Button
              variant="outline"
              onClick={() => setSelectedRide(null)}
              className="mb-4"
            >
              ← Back to Rides
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RideChat rideId={selectedRide} />
              </div>
              <div>
                {allUpcomingRides
                  .filter((r) => r.id === selectedRide)
                  .map((ride) => (
                    <Card key={ride.id}>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-semibold">{ride.title}</h3>
                        <div className="space-y-2 text-sm">
                          <p>
                            <span className="text-muted-foreground">From:</span> {ride.origin}
                          </p>
                          <p>
                            <span className="text-muted-foreground">To:</span> {ride.destination}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Time:</span>{" "}
                            {format(new Date(ride.departure_time), "PPp")}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Seats:</span>{" "}
                            {ride.seats_left}/{ride.total_seats}
                          </p>
                        </div>
                        {ride.ride_code && (
                          <div className="p-2 bg-primary/10 rounded">
                            <p className="text-xs text-muted-foreground mb-1">Ride Code</p>
                            <p className="font-mono font-bold text-primary">
                              {ride.ride_code}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Rides</TabsTrigger>
              <TabsTrigger value="created">My Rides</TabsTrigger>
              <TabsTrigger value="joined">Joined</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {allUpcomingRides.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">No upcoming rides</p>
                    <Button
                      onClick={() => navigate("/")}
                      className="gradient-primary"
                    >
                      Find Rides
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                allUpcomingRides.map((ride) => (
                  <RideListItem
                    key={ride.id}
                    ride={ride}
                    isCreated={createdRides.some((r) => r.id === ride.id)}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="created" className="space-y-3 mt-4">
              {createdRides.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      You haven't created any rides yet
                    </p>
                    <Button
                      onClick={() => navigate("/")}
                      className="gradient-primary"
                    >
                      Create a Ride
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                createdRides.map((ride) => (
                  <RideListItem key={ride.id} ride={ride} isCreated={true} />
                ))
              )}
            </TabsContent>

            <TabsContent value="joined" className="space-y-3 mt-4">
              {joinedRides.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground mb-4">
                      You haven't joined any rides yet
                    </p>
                    <Button
                      onClick={() => navigate("/find-rides")}
                      className="gradient-primary"
                    >
                      Find Rides
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                joinedRides.map((ride) => (
                  <RideListItem key={ride.id} ride={ride} isCreated={false} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
