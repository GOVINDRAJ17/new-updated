import { Card, CardContent } from "@/components/ui/card";
import { Zap, Heart, Shield, Sparkles } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get matched with nearby drivers in seconds and reach your destination quickly.",
    },
    {
      icon: Heart,
      title: "Community Driven",
      description: "Built for riders and drivers who care about making travel better for everyone.",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Advanced verification, real-time tracking, and 24/7 support for your peace of mind.",
    },
    {
      icon: Sparkles,
      title: "Innovation First",
      description: "Unique features like ride radio, weather forecasts, and smart payment splitting.",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">About Velocity</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're reimagining ride-sharing with innovation, safety, and community at our core.
              Velocity isn't just about getting from A to B—it's about enjoying the journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="shadow-soft border-2 hover:shadow-hover transition-smooth">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                      <Icon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="shadow-soft border-2 overflow-hidden">
            <div className="gradient-primary text-white p-12">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-lg text-white/90 leading-relaxed">
                  To make transportation accessible, enjoyable, and sustainable for everyone. We believe 
                  every ride should be safe, affordable, and enhanced with features that make your journey 
                  memorable. From real-time weather updates to your favorite music, we're here to transform 
                  how you move through the world.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default About;
