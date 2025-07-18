import { MapPin, Phone, Mail, Clock, ArrowUp, Heart, Linkedin, Instagram, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-surface to-background border-t border-border/50">
      <div className="container mx-auto container-padding py-4 lg:py-5">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="text-2xl font-bold text-foreground mb-6">
                Cloud<span className="text-green-600">Mzansi</span>
              </div>
              <p className="text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Empowering Mzansi, Digitally. We help South African businesses get online and stay connected with clean, modern websites and digital solutions that drive real results.
              </p>
              {/* Removed Get Started and View Our Work buttons */}
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="font-semibold text-foreground text-lg mb-6">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors duration-200">
                    <MapPin className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">Location</p>
                    <p className="text-muted-foreground text-sm">Queensburgh, Durban</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors duration-200">
                    <Phone className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">Phone</p>
                    <p className="text-muted-foreground text-sm">+27 74 839 4350</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors duration-200">
                    <Mail className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">Email</p>
                    <p className="text-muted-foreground text-sm">info@cloudmzansi.co.za</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors duration-200">
                    <Clock className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm">Hours</p>
                    <p className="text-muted-foreground text-sm">Mon - Fri: 8:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="font-semibold text-foreground text-lg mb-6">Quick Links</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => scrollToSection('about')}
                  className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium hover:translate-x-1 transform transition-transform"
                >
                  About Us
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium hover:translate-x-1 transform transition-transform"
                >
                  Our Services
                </button>
                <button 
                  onClick={() => scrollToSection('portfolio')}
                  className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium hover:translate-x-1 transform transition-transform"
                >
                  Our Work
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium hover:translate-x-1 transform transition-transform"
                >
                  Get In Touch
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border/50 pt-3">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-0">
              {/* Copyright */}
              <p className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
                © 2025 Cloud Mzansi. Built with <span className="inline">🖤</span> in Durban, South Africa.
              </p>
              {/* Additional Links */}
              <div className="flex flex-wrap justify-center gap-4 text-xs md:text-sm">
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                  Privacy Policy
                </Link>
                <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
