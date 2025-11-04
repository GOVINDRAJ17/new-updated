import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft, Search } from "lucide-react";
import { toast } from "sonner";
import RideCard from "@/components/RideCard";

export default function FindNearbyRides() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [sortBy, setSortBy] = useState("price-low");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const { data, error } = await supabase
          .from("rides")
          .select("*")
          .eq("status", "active")
          .gt("seats_left", 0)
          .order("departure_time", { ascending: true });

        if (error) throw error;

        setRides(data || []);
        setFilteredRides(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rides:", error);
        toast.error("Failed to load rides");
        setLoading(false);
      }
    };

    fetchRides();

    const channel = supabase
      .channel("public:rides")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rides",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const newRide = payload.new;
            if (newRide.status === "active" && newRide.seats_left > 0) {
              setRides((prev) => [...prev, newRide]);
            }
          } else if (payload.eventType === "UPDATE") {
            const updatedRide = payload.new;
            setRides((prev) => prev.map((r) => (r.id === updatedRide.id ? updatedRide : r)));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    let result = rides.filter((ride) => {
      const matchOrigin = ride.origin
        .toLowerCase()
        .includes(searchOrigin.toLowerCase());
      const matchDestination = ride.destination
        .toLowerCase()
        .includes(searchDestination.toLowerCase());
      return matchOrigin && matchDestination;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price_per_seat - b.price_per_seat);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price_per_seat - a.price_per_seat);
    } else if (sortBy === "seats-available") {
      result.sort((a, b) => b.seats_left - a.seats_left);
    } else if (sortBy === "departure-soon") {
      result.sort(
        (a, b) =>
          new Date(a.departure_time).getTime() -
          new Date(b.departure_time).getTime()
      );
    }

    setFilteredRides(result);
  }, [rides, searchOrigin, searchDestination, sortBy]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Find Nearby Rides</h1>
              <p className="text-muted-foreground">
                Discover available rides matching your destination
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Starting point"
                    value={searchOrigin}
                    onChange={(e) => setSearchOrigin(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Destination"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort rides" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="seats-available">Most Seats Available</SelectItem>
                  <SelectItem value="departure-soon">Departing Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredRides.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                {rides.length === 0
                  ? "No rides available at the moment"
                  : "No rides match your search criteria"}
              </p>
              {rides.length === 0 && (
                <Button
                  onClick={() => navigate("/")}
                  className="gradient-primary"
                >
                  Create a Ride Instead
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredRides.length} of {rides.length} rides
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRides.map((ride) => (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  isOwner={ride.created_by === user?.id}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
