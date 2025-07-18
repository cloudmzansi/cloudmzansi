import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex flex-col justify-center items-center relative overflow-hidden section-padding">
      {/* Subtle animated background visual */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] animate-pulse"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-float-slow"></div>
      <div className="container mx-auto container-padding relative z-10 flex-1 flex flex-col justify-center items-center">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center items-center">
          {/* Main Content */}
          <div className="text-center space-y-8 lg:space-y-12 flex flex-col items-center justify-center flex-1">
            {/* Main Heading */}
            <div className="space-y-6 animate-slide-up">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-foreground leading-[0.95] tracking-tight drop-shadow-lg">
                Design. Develop. Dominate.
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-muted-foreground font-medium max-w-3xl mx-auto">
                Modern websites for South African businesses. No jargon. No fuss. Just results.
              </h2>
            </div>
            {/* Description */}
            <div className="max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Cloud Mzansi is your digital partner for clean, effective, and beautiful web design. We help you get seen online and grow your business with a local touch.
              </p>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button 
                size="lg"
                onClick={() => scrollToSection('contact')}
                className="btn-primary px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Get In Touch
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('portfolio')}
                className="btn-outline px-8 py-4 text-lg font-semibold rounded-xl border-2 hover:border-primary/50 transition-all duration-300"
              >
                View Our Work
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// Add subtle background animation classes to your CSS if not present:
// .animate-float { animation: float 6s ease-in-out infinite alternate; }
// .animate-float-slow { animation: float 10s ease-in-out infinite alternate; }
// @keyframes float { 0% { transform: translateY(0); } 100% { transform: translateY(-20px); } }
