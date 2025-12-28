import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppView, UserData, CandidateResult, InterviewResponse } from "./types";
import LoginView from "./views/LoginView";
import DomainSelectionView from "./views/DomainSelectionView";
import InterviewRoom from "./views/InterviewRoom";
import SuccessView from "./views/SuccessView";
import HRDashboard from "./views/HRDashboard";
import { LayoutDashboard, LogOut } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOGIN);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [results, setResults] = useState<CandidateResult[]>([]);

  // Load results from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('elitehire_results');
    if (saved) {
      setResults(JSON.parse(saved));
    }
  }, []);

  const saveResult = (result: CandidateResult) => {
    const updated = [...results, result];
    setResults(updated);
    localStorage.setItem('elitehire_results', JSON.stringify(updated));
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

  const handleInterviewComplete = (
    finalResult: { score: number; recommendation: 'recommended' | 'not_recommended'; summary: string },
    responses: InterviewResponse[]
  ) => {
    if (userData) {
      const fullResult: CandidateResult = {
        userData,
        responses,
        score: finalResult.score,
        recommendation: finalResult.recommendation,
        summary: finalResult.summary,
        timestamp: new Date().toISOString(),
      };
      saveResult(fullResult);
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
          {/* Navigation Helper */}
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

          {/* Main View Router */}
          <main className="min-h-screen">
            {currentView === AppView.LOGIN && <LoginView onLogin={handleLogin} />}
            {currentView === AppView.DOMAIN_SELECTION && (
              <DomainSelectionView onSelect={handleDomainSelect} userName={userData?.fullName || ''} />
            )}
            {currentView === AppView.INTERVIEW && userData && (
              <InterviewRoom userData={userData} onComplete={handleInterviewComplete} />
            )}
            {currentView === AppView.SUCCESS && <SuccessView onFinish={resetFlow} />}
            {currentView === AppView.DASHBOARD && <HRDashboard results={results} />}
          </main>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
