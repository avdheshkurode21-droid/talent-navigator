import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Mail, Home, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface SuccessViewProps {
  onFinish: () => void;
}

const SuccessView = ({ onFinish }: SuccessViewProps) => {
  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#6366f1', '#22c55e', '#8b5cf6']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#6366f1', '#22c55e', '#8b5cf6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10 animate-slide-up">
        <Card className="border-border/50 bg-card/80 backdrop-blur-xl shadow-elevated text-center">
          <CardContent className="pt-12 pb-10 px-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
              <div className="relative w-24 h-24 gradient-success rounded-full flex items-center justify-center shadow-soft">
                <CheckCircle2 className="text-accent-foreground" size={48} />
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="text-primary" size={20} />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Assessment Complete</span>
              <Sparkles className="text-primary" size={20} />
            </div>

            <h1 className="text-3xl font-display font-bold text-foreground mb-3">
              Great Job!
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Your responses have been recorded and are being analyzed by our AI system.
            </p>

            <div className="bg-secondary/30 rounded-xl p-6 mb-8 border border-border/50">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock className="text-primary" size={24} />
                <span className="text-xl font-semibold text-foreground">
                  Results in 24 Hours
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Our AI is evaluating your performance. You will receive the results via notification within 24 hours.
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
              onClick={onFinish}
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
            <a href="mailto:support@elitehire.com" className="text-primary hover:underline">
              support@elitehire.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessView;
