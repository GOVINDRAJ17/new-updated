import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Pause, Radio as RadioIcon } from "lucide-react";

const FMRadio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedStation, setSelectedStation] = useState("98.3");

  const stations = [
    { frequency: "98.3", name: "Radio Mirchi" },
    { frequency: "93.5", name: "Red FM" },
    { frequency: "104.0", name: "FM Gold" },
    { frequency: "106.4", name: "Big FM" },
    { frequency: "91.1", name: "Radio City" },
  ];

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="shadow-soft border-2">
      <CardHeader className="gradient-primary text-white">
        <CardTitle className="flex items-center gap-2 text-white">
          <RadioIcon />
          FM Radio
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="bg-gradient-primary/10 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold mb-2">{selectedStation} FM</div>
            <div className="text-sm text-muted-foreground">
              {stations.find(s => s.frequency === selectedStation)?.name}
            </div>
          </div>

          <Select value={selectedStation} onValueChange={setSelectedStation}>
            <SelectTrigger>
              <SelectValue placeholder="Select station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.frequency} value={station.frequency}>
                  {station.frequency} FM - {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              onClick={togglePlay}
              className="gradient-primary text-primary-foreground hover:shadow-hover transition-smooth"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2" size={20} />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2" size={20} />
                  Play
                </>
              )}
            </Button>
          </div>

          {isPlaying && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-sm text-primary animate-pulse">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                Now Playing
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FMRadio;
