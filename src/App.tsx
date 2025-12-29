import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppView, UserData, InterviewResponse } from "./types";
import LoginView from "./views/LoginView";
import DomainSelectionView from "./views/DomainSelectionView";
import InterviewRoom from "./views/InterviewRoom";
import SuccessView from "./views/SuccessView";
import HRDashboard from "./views/HRDashboard";
import { LayoutDashboard, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [userData, setUserData] = useState<UserData | null>(null);

  const saveResultToDatabase = async (
    userData: UserData,
    responses: InterviewResponse[],
    score: number,
    recommendation: string,
    summary: string
  ) => {
    const { error } = await supabase.from("interview_results").insert([{
      candidate_name: userData.fullName,
      candidate_email: userData.registrationNo,
      domain: userData.domain || "",
      responses: JSON.parse(JSON.stringify(responses)),
      score: score,
      recommendation: recommendation,
      summary: summary,
    }]);

    if (error) {
      console.error("Failed to save result:", error);
      toast.error("Failed to save interview result");
    }
  };

  const handleLogin = (data: UserData) => {
    setUserData(data);
    setCurrentView(AppView.DOMAIN_SELECTION);
  };

  const handleDomainSelect = (domain: string) => {
    if (userData) {
      setUserData({ ...userData, domain });
      setCurrentView(AppView.INTERVIEW);
    }
  };

  const handleInterviewComplete = async (
    finalResult: { score: number; recommendation: 'recommended' | 'not_recommended'; summary: string },
    responses: InterviewResponse[]
  ) => {
    if (userData) {
      await saveResultToDatabase(
        userData,
        responses,
        finalResult.score,
        finalResult.recommendation,
        finalResult.summary
      );
      setCurrentView(AppView.SUCCESS);
    }
  };

  const resetFlow = () => {
    setUserData(null);
    setCurrentView(AppView.LOGIN);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
          {/* Navigation Helper - Only show for non-login views */}
          {currentView !== AppView.LOGIN && (
            <nav className="fixed top-0 right-0 p-4 z-50 flex gap-4">
              {currentView !== AppView.DASHBOARD && (
                <button 
                  onClick={() => setCurrentView(AppView.DASHBOARD)}
                  className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full text-xs font-medium hover:bg-card transition-colors"
                >
                  <LayoutDashboard size={14} />
                  HR Panel
                </button>
              )}
              {currentView === AppView.DASHBOARD && (
                <button 
                  onClick={() => setCurrentView(AppView.LOGIN)}
                  className="flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm border border-border/50 rounded-full text-xs font-medium hover:bg-card transition-colors"
                >
                  <LogOut size={14} />
                  Candidate Portal
                </button>
              )}
            </nav>
          )}

          {/* Main View Router */}
          <main className="min-h-screen">
            {currentView === AppView.LOGIN && (
              <LoginView 
                onLogin={handleLogin} 
                onHRClick={() => setCurrentView(AppView.DASHBOARD)} 
              />
            )}
            {currentView === AppView.DOMAIN_SELECTION && (
              <DomainSelectionView onSelect={handleDomainSelect} userName={userData?.fullName || ''} />
            )}
            {currentView === AppView.INTERVIEW && userData && (
              <InterviewRoom userData={userData} onComplete={handleInterviewComplete} />
            )}
            {currentView === AppView.SUCCESS && <SuccessView onFinish={resetFlow} />}
            {currentView === AppView.DASHBOARD && <HRDashboard />}
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
