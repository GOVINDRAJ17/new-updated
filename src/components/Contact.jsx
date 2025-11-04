import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, Send, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // In a real app, this would send to backend
    console.log("Contact form submitted:", formData);
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground text-lg">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-soft border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="text-primary" />
                Send us a Message
              </CardTitle>
              <CardDescription>Fill out the form and we'll respond within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <Button type="submit" className="w-full gradient-primary text-primary-foreground hover:shadow-hover transition-smooth">
                  <Send className="mr-2" size={20} />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="shadow-soft border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="text-primary" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Email</div>
                  <a href="mailto:support@velocity.com" className="text-lg text-primary hover:underline">
                    support@velocity.com
                  </a>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Phone</div>
                  <a href="tel:+1234567890" className="text-lg text-primary hover:underline">
                    +1 (234) 567-8900
                  </a>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Address</div>
                  <p className="text-lg">
                    123 Innovation Drive<br />
                    San Francisco, CA 94102<br />
                    United States
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-2 gradient-primary text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <p className="mb-6 text-white/90">
                  Stay connected and get the latest updates from Velocity
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-smooth"
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
