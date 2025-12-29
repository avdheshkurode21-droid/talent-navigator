import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Globe, CheckCircle, ArrowRight, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { UserData } from "@/types";

interface LoginViewProps {
  onLogin: (data: UserData) => void;
  onHRClick?: () => void;
}

const LoginView = ({ onLogin, onHRClick }: LoginViewProps) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !phone || !registrationNo) {
      toast.error("Please fill in all fields");
      return;
    }

    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onLogin({ fullName, phone, registrationNo });
    toast.success("Login successful!");
    setIsLoading(false);
  };

  const features = [
    { icon: Zap, text: "Instant AI Evaluation" },
    { icon: Globe, text: "Global Recruitment Standards" },
    { icon: CheckCircle, text: "Verified Domain Expertise" },
  ];

  return (
    <div className="min-h-screen flex bg-[#0a0a0f]">
      {/* HR Panel Button */}
      {onHRClick && (
        <button
          onClick={onHRClick}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg border border-border/30 bg-background/50 text-foreground hover:bg-background/80 transition-colors z-10"
        >
          <LayoutGrid size={18} />
          <span className="text-sm font-medium">HR Panel</span>
        </button>
      )}

      {/* Left Side - Marketing Content */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 xl:px-24">
        <h1 className="text-5xl xl:text-6xl font-bold leading-tight text-foreground mb-6">
          Professional<br />
          Hiring,<br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
            Redefined.
          </span>
        </h1>
        
        <p className="text-muted-foreground text-lg mb-12 max-w-md">
          Our AI-powered platform helps the world's leading companies identify top talent through dynamic, domain-specific intelligence.
        </p>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <feature.icon className="text-indigo-400" size={22} />
              </div>
              <span className="text-foreground font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 lg:px-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Candidate Portal
            </h2>
            <p className="text-muted-foreground">
              Please enter your registration details to proceed to the evaluation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-14 bg-[#1a1a24] border-[#2a2a3a] text-foreground placeholder:text-muted-foreground/50 pr-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20"
                />
                {fullName && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Phone Number
              </label>
              <div className="relative">
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-14 bg-[#1a1a24] border-[#2a2a3a] text-foreground placeholder:text-muted-foreground/50 pr-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20"
                />
                {phone.length >= 10 && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Registration / ID Number
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your ID number"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  className="h-14 bg-[#1a1a24] border-[#2a2a3a] text-foreground placeholder:text-muted-foreground/50 pr-12 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20"
                />
                {registrationNo && (
                  <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-14 mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Proceed to Domain Selection
                  <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By proceeding, you agree to our Terms of Service and Data Handling policies for the evaluation.
          </p>

          <div className="flex items-center justify-center gap-2 mt-8 text-muted-foreground/50 text-sm">
            <span>POWERED BY</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="font-semibold text-muted-foreground">ORBION</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
