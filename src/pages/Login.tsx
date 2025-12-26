import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone, CreditCard, ArrowRight, Shield } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || !registrationNo) {
      toast.error("Please fill in all fields");
      return;
    }

    if (phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store user data
    localStorage.setItem("candidateData", JSON.stringify({ phone, registrationNo }));
    
    toast.success("Login successful!");
    navigate("/domain-selection");
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <Logo />
        <Link to="/hr-dashboard">
          <Button variant="ghost" className="text-muted-foreground hover:text-primary">
            HR Login
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          <Card className="shadow-elevated border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Shield className="text-primary-foreground" size={32} />
              </div>
              <CardTitle className="text-2xl">Candidate Portal</CardTitle>
              <CardDescription className="text-base">
                Enter your details to start the assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Registration / ID Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      type="text"
                      placeholder="Enter your ID number"
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="gradient" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Continue to Assessment
                      <ArrowRight size={18} />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
