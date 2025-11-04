# Add to your .env file:

VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Steps to implement Google Maps:

1. Install required dependencies:
```bash
pnpm add @react-google-maps/api @types/google.maps
```

2. Get a Google Maps API key:
- Go to the Google Cloud Console (https://console.cloud.google.com/)
- Create a new project or select an existing one
- Enable the Maps JavaScript API and Places API
- Create credentials (API key)
- Restrict the API key to your domain and required APIs

3. Add the API key to your .env file:
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. Update the NearbyRidesMap component:
```tsx
// Add to imports:
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Add after your imports:
const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 20.5937, // Default center (India)
  lng: 78.9629
};

// Add to your component state:
const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
const [mapLoaded, setMapLoaded] = useState(false);

// Add this JSX where you want to show the map:
<Card>
  <CardContent className="p-0">
    <LoadScript 
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}
      onLoad={() => setMapLoaded(true)}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || defaultCenter}
        zoom={11}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {/* User's location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          />
        )}

        {/* Ride markers */}
        {nearbyRides.map((ride) => (
          ride.profiles?.location_lat && ride.profiles?.location_lng && (
            <Marker
              key={ride.id}
              position={{
                lat: ride.profiles.location_lat,
                lng: ride.profiles.location_lng
              }}
              onClick={() => setSelectedRide(ride)}
            />
          )
        ))}

        {/* Info window for selected ride */}
        {selectedRide && selectedRide.profiles?.location_lat && selectedRide.profiles?.location_lng && (
          <InfoWindow
            position={{
              lat: selectedRide.profiles.location_lat,
              lng: selectedRide.profiles.location_lng
            }}
            onCloseClick={() => setSelectedRide(null)}
          >
            <div className="p-2">
              <h3 className="font-semibold">{selectedRide.title}</h3>
              <p>From: {selectedRide.origin}</p>
              <p>To: {selectedRide.destination}</p>
              <p>Departure: {new Date(selectedRide.departure_time).toLocaleString()}</p>
              <p>Seats Available: {selectedRide.seats_left}</p>
              <p>Price per seat: ₹{selectedRide.price_per_seat / 100}</p>
              <Button
                className="mt-2 w-full"
                onClick={() => joinRide(selectedRide.id)}
              >
                Join Ride
              </Button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  </CardContent>
</Card>
```

5. Update your fetchNearbyRides function to include distance calculation:
```tsx
const fetchNearbyRides = async () => {
  if (!userLocation) return;

  try {
    const { data, error } = await supabase
      .from("rides")
      .select(`
        *,
        profiles:user_id (is_verified, location_lat, location_lng)
      `)
      .eq("status", "active")
      .gt("seats_left", 0);

    if (error) throw error;

    // Filter verified rides within radius
    const verifiedRides = (data || []).filter((ride: any) => {
      if (!ride.profiles?.is_verified || !ride.profiles?.location_lat || !ride.profiles?.location_lng) {
        return false;
      }

      // Calculate distance
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        ride.profiles.location_lat,
        ride.profiles.location_lng
      );

      // Filter rides within 50km radius (adjust as needed)
      return distance <= 50;
    });

    setNearbyRides(verifiedRides);
  } catch (error: any) {
    console.error("Error fetching nearby rides:", error);
    toast.error("Failed to fetch nearby rides");
  }
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};