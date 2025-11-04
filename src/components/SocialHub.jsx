import PushToTalk from "./PushToTalk";
import RideChat from "./RideChat";
import FMRadio from "./FMRadio";
import NearbyRidesMap from "./NearbyRidesMap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SocialHubProps {
  rideId?: string;
}

const SocialHub = ({ rideId }: SocialHubProps) => {
  return (
    <section id="social" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Connect & Communicate</h2>
          <p className="text-muted-foreground text-lg">Stay connected during your journey</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Push to Talk & Chat */}
          <div className="space-y-8">
            <PushToTalk />
            
            {rideId && <RideChat rideId={rideId} />}

            <FMRadio />
          </div>

          {/* Map & Nearby Rides */}
          <div>
            <NearbyRidesMap />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialHub;
