const Footer = () => {
  return (
    <footer className="bg-muted/50 py-12 mt-auto border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-primary mb-2">Velocity</h3>
            <p className="text-sm text-muted-foreground">Your ride-sharing companion</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-3">Contact Us</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📞 8767425781</p>
              <p>✉️ velocity.tech@gmail.com</p>
              <p>📍 Mumbai Suburban</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="#about" className="block text-muted-foreground hover:text-primary transition-colors">About</a>
              <a href="#create" className="block text-muted-foreground hover:text-primary transition-colors">Create Ride</a>
              <a href="#schedule" className="block text-muted-foreground hover:text-primary transition-colors">Schedule</a>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground border-t pt-6">
          <p>© 2024 <span className="font-semibold text-primary">Velocity</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
