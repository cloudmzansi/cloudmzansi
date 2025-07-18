import { Lightbulb, Users, Globe, Award } from "lucide-react";
import durbanImg from "../assets/durban.jpg";

export default function About() {
  const features = [
    {
      icon: Users,
      title: "Local Expertise",
      description: "Deep understanding of South African business needs and market dynamics"
    },
    {
      icon: Globe,
      title: "Digital Innovation",
      description: "Cutting-edge web technologies tailored for local businesses"
    },
    {
      icon: Award,
      title: "Quality Focus",
      description: "Commitment to excellence in every project we undertake"
    }
  ];

  return (
    <section id="about" className="section-padding bg-gradient-to-br from-surface to-background">
      <div className="container mx-auto container-padding">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/50 border border-border text-sm font-medium text-muted-foreground mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              About Us
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Building Digital Success for Mzansi
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're a Durban-based design agency with one goal: to help South African businesses get online and stay connected.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every business deserves a clean, modern website that's built to perform - no jargon, no hidden costs, just real results. Rooted in thoughtful design and solid development, our work brings together the best local talent in design, development, SEO, and digital marketing.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We keep things simple and clear, so you can focus on running your business while we handle the digital side. Cloud Mzansi is built for small businesses, startups, and growing brands that want to stand out without breaking the bank.
                </p>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  From first websites to redesigns and online stores, each project is handled with care and built to grow with you. As we expand, so does our mission: to empower local businesses, support South African talent, and help keep Mzansi connected in a digital world.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative group">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src={durbanImg}
                  alt="Durban skyline" 
                  className="w-full h-auto rounded-2xl object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/10 transition-all duration-500 rounded-2xl"></div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-200 rounded-full blur-sm group-hover:bg-green-300 transition-all duration-500"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/20 rounded-full blur-sm group-hover:bg-primary/30 transition-all duration-500"></div>
            </div>
          </div>

          {/* Stats Section */}
          {/* REMOVED STATS SECTION */}
        </div>
      </div>
    </section>
  );
}
