import { useState } from "react";
import { Menu, X, Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Create", href: "#create" },
    { name: "Radio", href: "#radio" },
    { name: "Schedule", href: "#schedule" },
    { name: "Weather", href: "#weather" },
    { name: "Location", href: "#location" },
    { name: "Split", href: "#split" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#home" className="text-2xl font-bold text-primary hover:text-primary/90 transition-smooth">
              Velocity
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-smooth rounded-lg hover:bg-muted"
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Theme Toggle & Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </Button>
            
            {user ? (
              <>
                <Button variant="ghost" className="text-sm font-medium gap-2">
                  <User size={18} />
                  {user.email}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="gap-2"
                >
                  <LogOut size={18} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-sm font-medium"
                  onClick={() => navigate("/auth")}
                >
                  Login
                </Button>
                <Button
                  className="gradient-primary text-primary-foreground hover:shadow-hover transition-smooth"
                  onClick={() => navigate("/auth")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-foreground hover:bg-muted transition-smooth"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-lg transition-smooth"
              >
                {item.name}
              </button>
            ))}
            <div className="pt-4 pb-2 space-y-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-full"
              >
                {theme === "light" ? (
                  <>
                    <Moon size={20} className="mr-2" />
                    Dark Mode
                  </>
                ) : (
                  <>
                    <Sun size={20} className="mr-2" />
                    Light Mode
                  </>
                )}
              </Button>
              
              {user ? (
                <>
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    {user.email}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => signOut()}
                    className="w-full gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => navigate("/auth")}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full gradient-primary text-primary-foreground"
                    onClick={() => navigate("/auth")}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
