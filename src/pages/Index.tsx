import { Shield, Lock, Key, Eye, Database, Code, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecurityFeatureCard } from "@/components/SecurityFeatureCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Lock,
    title: "Secure Authentication",
    description: "Multi-factor authentication with secure password policies and session management.",
    status: "active" as const,
  },
  {
    icon: Key,
    title: "Data Encryption",
    description: "AES-256 encryption for data at rest and TLS 1.3 for data in transit.",
    status: "active" as const,
  },
  {
    icon: Shield,
    title: "XSS Protection",
    description: "Input sanitization and Content Security Policy to prevent cross-site scripting.",
    status: "active" as const,
  },
  {
    icon: Database,
    title: "SQL Injection Prevention",
    description: "Parameterized queries and prepared statements for all database operations.",
    status: "active" as const,
  },
  {
    icon: Eye,
    title: "Privacy Controls",
    description: "GDPR-compliant data handling with user consent management.",
    status: "active" as const,
  },
  {
    icon: Code,
    title: "Secure Development",
    description: "Following OWASP guidelines and security-first development practices.",
    status: "active" as const,
  },
];

const securityChecklist = [
  "Input validation on all user data",
  "Encrypted password storage with bcrypt",
  "HTTPS-only connections",
  "Rate limiting on authentication",
  "Secure session tokens",
  "Regular security audits",
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Enterprise-Grade Security</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 opacity-0 animate-fade-in" style={{ animationDelay: "100ms" }}>
              Build <span className="text-primary text-glow-primary">Secure</span> Web Applications
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
              A comprehensive cybersecurity platform demonstrating industry best practices for 
              authentication, encryption, and protection against common vulnerabilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/dashboard">
                  Explore Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/demos">
                  View Security Demos
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/3 right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* Features Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Security Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive protection against modern web vulnerabilities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <SecurityFeatureCard
                key={feature.title}
                {...feature}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Security Checklist */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Security Checklist
                </h2>
                <p className="text-muted-foreground mb-6">
                  Every component of this application follows strict security protocols 
                  to ensure your data remains protected.
                </p>
                <Button variant="cyber" asChild>
                  <Link to="/demos">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              
              <div className="space-y-4">
                {securityChecklist.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-background rounded-lg border border-border opacity-0 animate-slide-in-left"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="gradient-border rounded-2xl p-12 bg-card">
              <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-8">
                Create your secure account and explore the full range of cybersecurity features.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth?mode=signup">
                  Create Secure Account
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
