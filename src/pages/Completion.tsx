import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Mail, Home } from "lucide-react";
import confetti from "canvas-confetti";

const Completion = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti on mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#22C55E', '#8B5CF6']
    });
  }, []);

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg animate-slide-up">
          <Card className="shadow-elevated border-0 text-center">
            <CardContent className="pt-12 pb-10 px-8">
              <div className="w-24 h-24 gradient-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft animate-scale-in">
                <CheckCircle2 className="text-accent-foreground" size={48} />
              </div>
              
              <h1 className="text-3xl font-display font-bold text-foreground mb-3">
                Assessment Complete!
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for completing the assessment. Your responses have been recorded successfully.
              </p>

              <div className="bg-secondary/50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Clock className="text-primary" size={24} />
                  <span className="text-xl font-semibold text-foreground">
                    Results in 24 Hours
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Our AI is analyzing your responses. You will receive the results via notification within 24 hours.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 text-muted-foreground mb-8">
                <Mail size={18} />
                <span className="text-sm">
                  Make sure your contact details are up to date
                </span>
              </div>

              <Button 
                variant="gradient" 
                size="lg" 
                onClick={() => navigate("/")}
                className="min-w-48"
              >
                <Home size={18} />
                Back to Home
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@talentai.com" className="text-primary hover:underline">
                support@talentai.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Completion;
