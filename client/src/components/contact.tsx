import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Contact() {
  const [status, setStatus] = useState<null | { type: 'success' | 'error', message: string }>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    formData.append('access_key', 'b61aef1b-4125-420c-8ec9-1509fe524e61');
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      let result = {};
      try {
        result = await response.json();
        console.log('Web3Forms response:', result);
      } catch {
        setStatus({ type: 'error', message: 'Unexpected response from server.' });
        setLoading(false);
        return;
      }
      if (
        (response.ok && result && result.success === true) ||
        (response.ok && typeof result.message === 'string' && result.message.toLowerCase().includes('success'))
      ) {
        setStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you within 24 hours.' });
        e.currentTarget.reset();
      } else {
        setStatus({ type: 'error', message: result.message || 'Failed to send message. Please try again later.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Location",
      content: "Queensburgh, Durban, South Africa",
      description: "Based in the heart of KwaZulu-Natal"
    },
    {
      icon: Phone,
      title: "Phone Number",
      content: "+27 74 839 4350",
      description: "Available during business hours"
    },
    {
      icon: Mail,
      title: "Email Address",
      content: "info@cloudmzansi.co.za",
      description: "We'll respond within 24 hours"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon - Fri: 8:00 AM - 5:00 PM SAST",
      description: "Weekends by appointment"
    }
  ];

  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-background via-surface to-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-transparent"></div>
      <div className="container mx-auto container-padding relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/50 border border-border text-sm font-medium text-muted-foreground mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Get In Touch
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Let's Build Something Amazing
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Whether you're a startup with an idea, an established business looking to refresh 
              your digital presence, or somewhere in between, we'd love to hear about your project. 
              Our inbox is always open for new opportunities and collaborations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start space-x-4 p-6 rounded-2xl bg-card border border-border hover:border-primary transition-all duration-300 shadow-md">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <info.icon className="text-white" size={22} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-2 text-lg">{info.title}</h4>
                        <p className="text-foreground font-medium mb-1">{info.content}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Social/Contact Icons */}
              <div className="flex gap-4 mt-8 justify-center">
                <a href="https://www.linkedin.com/in/andrew-michaels/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
                <a href="https://www.instagram.com/cloudmzansi/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="https://wa.me/27748394350" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" aria-label="WhatsApp">
                  <MessageSquare size={20} />
                </a>
                <a href="mailto:info@cloudmzansi.co.za" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors" aria-label="Email">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-md border border-border/40 shadow-2xl rounded-2xl p-8 lg:p-10 card-hover relative">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                  <MessageSquare className="text-primary" size={24} />
                  Send us a message
                </h3>
                <p className="text-muted-foreground">Tell us about your project and we'll get back to you soon.</p>
              </div>
              {/* Success/Error Modal */}
              {status && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40`}>
                  <div className={`bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center ${status.type === 'success' ? 'border-green-500' : 'border-red-500'} border-2`}>
                    <div className={`mb-4 text-2xl ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.type === 'success' ? 'Success!' : 'Error'}</div>
                    <div className="mb-6 text-muted-foreground">{status.message}</div>
                    <Button onClick={() => setStatus(null)} className="btn-primary px-6 py-2 rounded-lg">Close</Button>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground">First Name</label>
                    <Input name="firstName" placeholder="John" className="rounded-xl border-border bg-white/80" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Last Name</label>
                    <Input name="lastName" placeholder="Doe" className="rounded-xl border-border bg-white/80" required />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <Input name="email" type="email" placeholder="john@example.com" className="rounded-xl border-border bg-white/80" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Service Required</label>
                  <Input name="subject" placeholder="e.g. Website Design" className="rounded-xl border-border bg-white/80" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <Textarea name="message" placeholder="Tell us about your project..." className="rounded-xl border-border bg-white/80" rows={4} required />
                </div>
                <Button type="submit" className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl shadow-lg w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send size={18} className="ml-2" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
