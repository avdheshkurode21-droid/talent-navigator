import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { DomainCard } from "@/components/DomainCard";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  DollarSign, 
  FileText, 
  Code, 
  Bug, 
  BarChart3, 
  Briefcase, 
  Layout, 
  Server,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

const domains = [
  { id: "hr", icon: Users, title: "HR Services", description: "Human Resources and Recruitment" },
  { id: "finance", icon: DollarSign, title: "Finance", description: "Accounting and Financial Management" },
  { id: "secretary", icon: FileText, title: "Company Secretary", description: "Corporate Governance and Compliance" },
  { id: "fullstack", icon: Code, title: "Software Developer", description: "Full-stack Development" },
  { id: "tester", icon: Bug, title: "QA Tester", description: "Quality Assurance and Testing" },
  { id: "management", icon: Briefcase, title: "Management", description: "Project and Team Management" },
  { id: "analyst", icon: BarChart3, title: "Business Analyst", description: "Business Analysis and Strategy" },
  { id: "frontend", icon: Layout, title: "Frontend Developer", description: "UI/UX and Frontend Technologies" },
  { id: "backend", icon: Server, title: "Backend Developer", description: "Server-side Development" },
];

const DomainSelection = () => {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selectedDomain) {
      toast.error("Please select a domain to continue");
      return;
    }

    const domain = domains.find(d => d.id === selectedDomain);
    localStorage.setItem("selectedDomain", JSON.stringify(domain));
    navigate("/assessment");
  };

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <Logo />
        <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground">
          <ArrowLeft size={18} />
          Back
        </Button>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl py-12 px-6">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Select Your Domain
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Choose the field that best matches your expertise. Our AI will generate tailored questions based on your selection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {domains.map((domain, index) => (
            <div 
              key={domain.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <DomainCard
                icon={domain.icon}
                title={domain.title}
                description={domain.description}
                selected={selectedDomain === domain.id}
                onClick={() => setSelectedDomain(domain.id)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            variant="hero" 
            size="xl" 
            onClick={handleContinue}
            disabled={!selectedDomain}
            className="min-w-64"
          >
            Start Assessment
            <ArrowRight size={20} />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default DomainSelection;
