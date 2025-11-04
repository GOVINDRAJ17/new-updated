import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Search } from "lucide-react";

const Location = () => {
  const nearbyRides = [
    { id: 1, driver: "Sarah M.", distance: "0.3 mi", eta: "2 min", rating: 4.9, seats: 3 },
    { id: 2, driver: "John D.", distance: "0.5 mi", eta: "4 min", rating: 4.8, seats: 2 },
    { id: 3, driver: "Emma W.", distance: "0.7 mi", eta: "6 min", rating: 5.0, seats: 4 },
  ];

  return (
    <section id="location" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Find Nearby Rides</h2>
          <p className="text-muted-foreground text-lg">Discover rides around you</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Preview */}
          <Card className="shadow-soft border-2 overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="text-primary" />
                Your Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Map placeholder with gradient */}
              <div className="relative h-96 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40"></div>
                
                {/* Animated location markers */}
                <div className="relative">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-pulse shadow-hover">
                    <MapPin className="text-white" size={32} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full animate-ping"></div>
                </div>
                
                {/* Nearby pins */}
                <div className="absolute top-20 left-20 w-10 h-10 bg-accent/80 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: "0.2s" }}>
                  <MapPin className="text-white" size={20} />
                </div>
                <div className="absolute bottom-24 right-16 w-10 h-10 bg-accent/80 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: "0.4s" }}>
                  <MapPin className="text-white" size={20} />
                </div>
              </div>
              
              <div className="p-4 bg-card">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation size={16} className="text-primary" />
                  <span className="text-sm font-medium">Current Location</span>
                </div>
                <p className="text-muted-foreground">123 Market Street, San Francisco, CA</p>
              </div>
            </CardContent>
          </Card>

          {/* Search & Nearby Rides */}
          <div className="space-y-6">
            <Card className="shadow-soft border-2">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    placeholder="Search destination..."
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="text-primary" />
                  Nearby Available Rides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {nearbyRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="border border-border rounded-lg p-4 hover:shadow-soft transition-smooth bg-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {ride.driver.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{ride.driver}</div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <span>⭐ {ride.rating}</span>
                            <span>•</span>
                            <span>{ride.seats} seats</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{ride.distance}</div>
                        <div className="text-sm text-muted-foreground">{ride.eta} away</div>
                      </div>
                    </div>
                    
                    <Button className="w-full gradient-primary text-primary-foreground hover:shadow-hover transition-smooth">
                      Request Ride
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
