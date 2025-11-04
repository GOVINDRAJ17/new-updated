import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  const scrollToCreate = () => {
    const element = document.querySelector("#create");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGetStarted = () => {
    if (user) {
      scrollToCreate();
    } else {
      navigate("/auth");
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="home" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20"
    >
      {/* Matte Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20"></div>
      
      {/* Animated circles for depth */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Move smarter with
            <span className="block mt-2">
              Velocity
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
            Simple, reliable ride-sharing designed for campus life.
            <span className="block mt-2">Create, join, and schedule rides with elegance.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="gradient-primary text-white hover:shadow-hover transition-smooth text-lg px-8 py-6 group rounded-full"
            >
              Get Started
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 hover:bg-muted text-lg px-8 py-6 rounded-full"
              onClick={scrollToAbout}
            >
              Learn More
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 border-2 shadow-card hover:shadow-hover transition-all hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">50K+</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">Active Riders</div>
            </div>
            <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 border-2 shadow-card hover:shadow-hover transition-all hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">2K+</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">Rides Daily</div>
            </div>
            <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 border-2 shadow-card hover:shadow-hover transition-all hover:scale-105">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">5K+</div>
              <div className="text-muted-foreground text-sm uppercase tracking-wider">Happy Students</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
