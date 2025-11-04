import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Download, ArrowLeft, MapPin, Wallet } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from("history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;

        setHistory(data || []);
        setFilteredHistory(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching history:", error);
        toast.error("Failed to load history");
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, navigate]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredHistory(history);
    } else {
      setFilteredHistory(
        history.filter((entry) => entry.action === filter)
      );
    }
  }, [filter, history]);

  const handleDownload = () => {
    const csv = [
      ["Date", "Action", "Details"],
      ...filteredHistory.map((entry) => [
        format(new Date(entry.created_at), "yyyy-MM-dd HH:mm:ss"),
        entry.action.replace(/_/g, " ").toUpperCase(),
        JSON.stringify(entry.meta || {}),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ride-history-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success("History downloaded as CSV");
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "create_ride":
        return <MapPin className="h-4 w-4 text-blue-500" />;
      case "join_ride":
        return <MapPin className="h-4 w-4 text-green-500" />;
      case "payment":
        return <Wallet className="h-4 w-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case "create_ride":
        return "Created Ride";
      case "join_ride":
        return "Joined Ride";
      case "payment":
        return "Payment";
      default:
        return action.replace(/_/g, " ").toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Your History</h1>
              <p className="text-muted-foreground">Track all your ride activities</p>
            </div>
          </div>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
        </div>

        <div className="mb-6">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="create_ride">Created Rides</SelectItem>
              <SelectItem value="join_ride">Joined Rides</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No activities found</p>
              <Button
                onClick={() => navigate("/")}
                className="gradient-primary"
              >
                Create Your First Ride
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((entry) => (
              <Card key={entry.id} className="hover:shadow-hover transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 bg-muted rounded-lg">
                      {getActionIcon(entry.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="font-semibold">
                            {getActionLabel(entry.action)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(entry.created_at), "PPp")}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(entry.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>

                      {entry.meta && (
                        <div className="mt-3 p-2 bg-muted/50 rounded text-sm text-muted-foreground">
                          {entry.action === "create_ride" && (
                            <>
                              <p>
                                From: <span className="font-medium">{entry.meta.origin}</span>
                              </p>
                              <p>
                                To: <span className="font-medium">{entry.meta.destination}</span>
                              </p>
                              <p>
                                Seats: <span className="font-medium">{entry.meta.totalSeats}</span>
                              </p>
                            </>
                          )}
                          {entry.action === "join_ride" && (
                            <p>
                              Amount: ₹{" "}
                              <span className="font-medium">
                                {(entry.meta.amountDue / 100).toFixed(2)}
                              </span>
                            </p>
                          )}
                          {entry.action === "payment" && (
                            <p>
                              Amount: ₹{" "}
                              <span className="font-medium">
                                {(entry.meta.amount / 100).toFixed(2)}
                              </span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
