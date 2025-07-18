import { Palette, Code2, Award, Search, ShoppingCart, Settings, Smartphone, Zap, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

const services = [
  {
    icon: Code2,
    title: "Web Design",
    description: "Clean, modern websites that help your business get seen online. No jargon, just beautiful designs that work for Mzansi.",
    features: ["Responsive Design", "Modern Layouts", "Fast Loading", "SEO Optimized"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: ShoppingCart,
    title: "e-Commerce",
    description: "Online stores that help you sell to customers across South Africa. Built for local businesses with local payment options.",
    features: ["Shopify Stores", "Payment Integration", "Inventory Management", "Order Tracking"],
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Settings,
    title: "Maintenance",
    description: "Ongoing support and maintenance to keep your website running smoothly and securely at all times.",
    features: ["Security Updates", "Performance Monitoring", "Backup Services", "24/7 Support"],
    color: "from-gray-500 to-slate-500"
  }
];

// Pricing card data
const pricing = [
  {
    title: "Starter Website",
    price: "R1500",
    features: [
      "Up to 5 pages",
      "Responsive Design",
      "Contact Form",
      "Basic SEO"
    ],
    cta: "Get Started"
  },
  {
    title: "Business Website",
    price: "R2500",
    features: [
      "Up to 10 pages",
      "Custom Design",
      "Blog/News Section",
      "Advanced SEO",
      "1 Year Support"
    ],
    cta: "Get Started"
  },
  {
    title: "eCommerce Website",
    price: "R3500",
    features: [
      "Online Store Setup",
      "Payment Integration",
      "Product Management",
      "Secure Checkout",
      "Order Tracking"
    ],
    cta: "Get Started"
  }
];

export function Pricing() {
  const [loading, setLoading] = useState(false);

  const handlePayNow = async (plan) => {
    setLoading(true);
    try {
      const res = await fetch('/api/payfast/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_first: 'Demo',
          name_last: 'User',
          email_address: 'demo@example.com',
          amount: plan.price.replace(/[^\d.]/g, ''),
          item_name: plan.title,
          return_url: window.location.origin + '/payment-success',
          cancel_url: window.location.origin + '/payment-cancel',
          notify_url: window.location.origin + '/api/payfast/webhook',
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      const res = await fetch('/api/payfast/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_first: 'Demo',
          name_last: 'User',
          email_address: 'demo@example.com',
          amount: plan.price.replace(/[^\d.]/g, ''),
          item_name: plan.title + ' Subscription',
          frequency: 3, // monthly
          cycles: 0, // indefinite
          return_url: window.location.origin + '/subscription-success',
          cancel_url: window.location.origin + '/subscription-cancel',
          notify_url: window.location.origin + '/api/payfast/webhook',
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Pricing Section Header */}
      <div className="text-center mb-16 lg:mb-20">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/50 border border-border text-sm font-medium text-muted-foreground mb-6">
          <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
          Pricing
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
          Transparent, Affordable Packages
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Simple, upfront pricing for every stage of your business. No hidden fees, no surprises—just great value and results.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {pricing.map((plan, idx) => {
          const isRecommended = idx === 1;
          return (
            <Card
              key={plan.title}
              className={`relative rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-md p-[2px] flex flex-col h-full transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl ${isRecommended ? 'ring-4 ring-primary/30 scale-105 z-10' : ''}`}
            >
              {isRecommended && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold shadow-lg z-20">
                  Most Popular
                </span>
              )}
              <div className="bg-background rounded-3xl flex flex-col h-full">
                <CardHeader className="pb-2 pt-10">
                  <CardTitle className="text-center text-2xl font-bold tracking-tight mb-2">
                    {plan.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="text-5xl font-extrabold text-primary mb-4 drop-shadow-lg">{plan.price}</div>
                  <ul className="text-muted-foreground text-base space-y-3 mb-8 text-left w-full max-w-xs mx-auto">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary mr-2">
                          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 8.5l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-center pb-8 mt-auto">
                  <Button className="btn-primary px-8 py-3 text-base font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-200" onClick={() => handlePayNow(plan)} disabled={loading}>
                    {loading ? 'Processing...' : plan.cta}
                  </Button>
                  <Button className="btn-secondary px-8 py-3 text-base font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-200 ml-2" onClick={() => handleSubscribe(plan)} disabled={loading}>
                    {loading ? 'Processing...' : 'Subscribe'}
                  </Button>
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="section-padding bg-background">
      <div className="container mx-auto container-padding">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/50 border border-border text-sm font-medium text-muted-foreground mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Our Services
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              What We Do
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Every project is different, so we tailor our work to fit what you need and want to achieve. 
              Whether you're a startup building your first website or an established business updating your 
              online presence, we're here to help you grow.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="flex justify-center">
                <div className="relative bg-gradient-to-br from-green-200/60 via-white/80 to-blue-200/60 rounded-3xl p-[2px] shadow-xl max-w-md w-full">
                  <div className="bg-background rounded-3xl overflow-hidden flex flex-col items-center px-8 py-10">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}>
                      <service.icon size={28} className="text-white" />
                    </div>
                    {/* Title */}
                    <h3 className="text-xl font-bold text-foreground mb-3 tracking-tight drop-shadow-sm text-center">
                      {service.title}
                    </h3>
                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-5 text-center">
                      {service.description}
                    </p>
                    {/* Features */}
                    <div className="space-y-2 w-full">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
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
