import { Logo } from "@/components/Logo";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, 
  DollarSign, 
  Scale, 
  Code, 
  TestTube, 
  Briefcase, 
  LineChart,
  Monitor,
  Server,
  Database,
  Shield,
  Megaphone
} from "lucide-react";

interface DomainSelectionViewProps {
  onSelect: (domain: string) => void;
  userName: string;
}

const domains = [
  { id: "hr", icon: Users, title: "HR Services", description: "Human Resource Management" },
  { id: "finance", icon: DollarSign, title: "Finance", description: "Financial Operations & Analysis" },
  { id: "company-secretary", icon: Scale, title: "Company Secretary", description: "Corporate Governance & Compliance" },
  { id: "software-dev", icon: Code, title: "Software Developer", description: "Full Stack Development" },
  { id: "qa-tester", icon: TestTube, title: "QA Tester", description: "Quality Assurance & Testing" },
  { id: "management", icon: Briefcase, title: "Management Services", description: "Business Operations & Strategy" },
  { id: "business-analyst", icon: LineChart, title: "Business Analyst", description: "Data Analysis & Insights" },
  { id: "frontend", icon: Monitor, title: "Frontend Developer", description: "UI/UX & Web Development" },
  { id: "backend", icon: Server, title: "Backend Developer", description: "Server-side & APIs" },
  { id: "data-science", icon: Database, title: "Data Science", description: "ML & Data Engineering" },
  { id: "cybersecurity", icon: Shield, title: "Cybersecurity", description: "Security & Threat Analysis" },
  { id: "marketing", icon: Megaphone, title: "Digital Marketing", description: "Marketing & Growth" },
];

const DomainSelectionView = ({ onSelect, userName }: DomainSelectionViewProps) => {
  return (
    <div className="min-h-screen flex flex-col p-6">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10">
        <Logo />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-8 relative z-10">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Welcome, {userName || 'Candidate'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Select your professional domain to begin the AI-powered assessment
          </p>
        </div>

        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {domains.map((domain, index) => (
              <Card 
                key={domain.id}
                onClick={() => onSelect(domain.title)}
                className="group cursor-pointer border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-primary/50 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-5 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <domain.icon className="text-primary" size={24} />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{domain.title}</h3>
                  <p className="text-xs text-muted-foreground">{domain.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DomainSelectionView;
