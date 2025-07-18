import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Eye } from "lucide-react";
import abbaquarImg from "../assets/abbaquar.png";
import kdinteriorsImg from "../assets/kdinteriors.png";

const portfolioItems = [
  {
    title: "Abbaqaur-San Dream Centre",
    description: "Restaurant website with online ordering system and table reservations",
    tech: ["React", "Node.js", "Stripe API", "MongoDB"],
    image: abbaquarImg,
    year: "2024",
    category: "Restaurant",
    liveUrl: "https://site-theta-rouge.vercel.app/",
    githubUrl: "https://github.com/cloudmzansi/site"
  },
  {
    title: "Kitchen Designs & Interiors",
    description: "Corporate website for consulting firm with client portal and case studies",
    tech: ["WordPress", "Custom Theme", "SEO", "Analytics"],
    image: kdinteriorsImg,
    year: "2023",
    category: "Corporate",
    liveUrl: "https://kdinteriors.co.za",
    githubUrl: "https://github.com/cloudmzansi/kdinteriors"
  },
  {
    title: "Abbaqaur-San Dream Centre",
    description: "Restaurant website with online ordering system and table reservations",
    tech: ["React", "Node.js", "Stripe API", "MongoDB"],
    image: abbaquarImg,
    year: "2024",
    category: "Restaurant",
    liveUrl: "https://site-theta-rouge.vercel.app/",
    githubUrl: "https://github.com/cloudmzansi/site"
  }
];

const categories = ["All", ...Array.from(new Set(portfolioItems.map(item => item.category)))];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const filteredItems = activeCategory === "All"
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="section-padding bg-gradient-to-br from-surface to-background">
      <div className="container mx-auto container-padding">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10 lg:mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/50 border border-border text-sm font-medium text-muted-foreground mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Our Work
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Portfolio
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A selection of recent projects that showcase our expertise in web design, development, and digital solutions for South African businesses.
            </p>
          </div>
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-200 shadow-sm
                  ${activeCategory === cat
                    ? 'bg-primary text-white border-primary shadow'
                    : 'bg-white/80 text-muted-foreground border-border hover:bg-primary/10 hover:text-primary'}
                `}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredItems.map((item, index) => (
              <div key={index} className="group flex justify-center">
                <div className="relative rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-md p-[2px] flex flex-col w-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
                  <div className="bg-background rounded-3xl overflow-hidden flex flex-col h-full relative">
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl z-10"></div>
                    {/* Icons in top-right */}
                    <div className='absolute top-4 right-4 flex gap-2 z-20'>
                      <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-black/80 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                        <Github className="text-white" size={18} />
                      </a>
                      <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-black/80 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                        <ExternalLink className="text-white" size={18} />
                      </a>
                    </div>
                    {/* Image */}
                    <div className="relative overflow-hidden w-full rounded-t-3xl" style={{ aspectRatio: '16/9' }}>
                      <img 
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{ minHeight: 0, minWidth: 0 }}
                      />
                    </div>
                    {/* Card Content */}
                    <div className="flex flex-col items-center px-16 py-16">
                      <h3 className="text-xl font-bold text-foreground mb-2 text-center drop-shadow-sm">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-center mb-4">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-center mb-4">
                        {item.tech.map((tech, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3 justify-center mt-2">
                        <a href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                          <Button className="btn-primary px-6 py-2 text-sm font-semibold rounded-xl shadow hover:scale-105 transition-transform duration-200 flex items-center gap-2">
                            <Eye size={16} /> View Site
                          </Button>
                        </a>
                        <a href={item.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Button className="btn-outline px-6 py-2 text-sm font-semibold rounded-xl flex items-center gap-2">
                            <Github size={16} /> Code
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
