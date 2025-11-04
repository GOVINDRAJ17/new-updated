import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from "lucide-react";

const Weather = () => {
  const [isFahrenheit, setIsFahrenheit] = useState(true);

  const convertTemp = (tempF: number) => {
    return isFahrenheit ? tempF : Math.round((tempF - 32) * 5 / 9);
  };

  const currentWeather = {
    temp: 72,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    feelsLike: 70,
  };

  const forecast = [
    { day: "Today", temp: 72, condition: "Partly Cloudy", icon: Cloud },
    { day: "Tomorrow", temp: 68, condition: "Rainy", icon: CloudRain },
    { day: "Wednesday", temp: 75, condition: "Sunny", icon: Sun },
    { day: "Thursday", temp: 70, condition: "Cloudy", icon: Cloud },
  ];

  return (
    <section id="weather" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-4xl font-bold">Weather Forecast</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFahrenheit(!isFahrenheit)}
              className="font-semibold"
            >
              °{isFahrenheit ? 'F' : 'C'}
            </Button>
          </div>
          <p className="text-muted-foreground text-lg">Check conditions before your ride</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Weather */}
          <Card className="lg:col-span-2 shadow-soft border-2 overflow-hidden">
            <div className="gradient-primary text-white p-8">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-white text-2xl">Current Weather</CardTitle>
                <p className="text-white/80">San Francisco, CA</p>
              </CardHeader>
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-7xl font-bold mb-2">
                    {convertTemp(currentWeather.temp)}°{isFahrenheit ? 'F' : 'C'}
                  </div>
                  <div className="text-xl text-white/90">{currentWeather.condition}</div>
                  <div className="text-white/70">
                    Feels like {convertTemp(currentWeather.feelsLike)}°{isFahrenheit ? 'F' : 'C'}
                  </div>
                </div>
                <Cloud size={120} className="text-white/80" />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets size={20} />
                    <span className="text-sm">Humidity</span>
                  </div>
                  <div className="text-2xl font-bold">{currentWeather.humidity}%</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Wind size={20} />
                    <span className="text-sm">Wind</span>
                  </div>
                  <div className="text-2xl font-bold">{currentWeather.windSpeed} mph</div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye size={20} />
                    <span className="text-sm">Visibility</span>
                  </div>
                  <div className="text-2xl font-bold">{currentWeather.visibility} mi</div>
                </div>
              </div>
            </div>
          </Card>

          {/* 4-Day Forecast */}
          <Card className="shadow-soft border-2">
            <CardHeader>
              <CardTitle>4-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {forecast.map((day, index) => {
                const Icon = day.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={32} className="text-primary" />
                      <div>
                        <div className="font-semibold">{day.day}</div>
                        <div className="text-sm text-muted-foreground">{day.condition}</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold">
                      {convertTemp(day.temp)}°{isFahrenheit ? 'F' : 'C'}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Weather;
