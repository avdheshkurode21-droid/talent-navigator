import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ProgressBar } from "@/components/ProgressBar";
import { UserData, InterviewResponse } from "@/types";
import { Clock, Send, ArrowRight, Brain, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InterviewRoomProps {
  userData: UserData;
  onComplete: (result: { score: number; recommendation: 'recommended' | 'not_recommended'; summary: string }, responses: InterviewResponse[]) => void;
}

const InterviewRoom = ({ userData, onComplete }: InterviewRoomProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);

  // Load AI-generated questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-questions', {
          body: { 
            domain: userData.domain, 
            candidateName: userData.fullName 
          }
        });

        if (error) throw error;
        
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions);
        } else {
          throw new Error("Invalid questions response");
        }
      } catch (error) {
        console.error("Failed to generate questions:", error);
        toast.error("Using default questions due to AI service issue");
        // Fallback questions
        setQuestions([
          `Tell us about your experience in ${userData.domain}.`,
          `What are the key skills needed for success in ${userData.domain}?`,
          `Describe a challenging project you've worked on.`,
          `How do you stay updated with industry trends?`,
          `Where do you see yourself in 5 years?`
        ]);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    loadQuestions();
  }, [userData]);

  // Timer
  useEffect(() => {
    if (isLoadingQuestions) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoadingQuestions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = async () => {
    if (!answer.trim()) {
      toast.error("Please provide an answer before continuing");
      return;
    }

    setIsThinking(true);
    
    try {
      // Evaluate the answer with AI
      const { data, error } = await supabase.functions.invoke('evaluate-answer', {
        body: { 
          question: questions[currentQuestion],
          answer: answer.trim(),
          domain: userData.domain
        }
      });

      if (error) throw error;

      const newResponse: InterviewResponse = {
        question: questions[currentQuestion],
        answer: answer.trim(),
        score: data.score || 70
      };

      const updatedResponses = [...responses, newResponse];
      setResponses(updatedResponses);
      setAnswer("");
      setIsThinking(false);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        handleFinalSubmit(updatedResponses);
      }
    } catch (error) {
      console.error("Failed to evaluate answer:", error);
      toast.error("Evaluation service unavailable, continuing with default score");
      
      // Fallback if AI fails
      const newResponse: InterviewResponse = {
        question: questions[currentQuestion],
        answer: answer.trim(),
        score: 70
      };

      const updatedResponses = [...responses, newResponse];
      setResponses(updatedResponses);
      setAnswer("");
      setIsThinking(false);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        handleFinalSubmit(updatedResponses);
      }
    }
  };

  const handleFinalSubmit = async (finalResponses?: InterviewResponse[]) => {
    setIsSubmitting(true);
    
    const allResponses = finalResponses || responses;
    const avgScore = allResponses.length > 0 
      ? Math.round(allResponses.reduce((acc, r) => acc + r.score, 0) / allResponses.length)
      : 0;

    try {
      // Generate AI summary
      const { data, error } = await supabase.functions.invoke('generate-summary', {
        body: { 
          candidateName: userData.fullName,
          domain: userData.domain,
          responses: allResponses,
          averageScore: avgScore
        }
      });

      if (error) throw error;

      const result = {
        score: avgScore,
        recommendation: data.recommendation as 'recommended' | 'not_recommended',
        summary: data.summary
      };

      onComplete(result, allResponses);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      
      // Fallback result
      const result = {
        score: avgScore,
        recommendation: avgScore >= 65 ? 'recommended' as const : 'not_recommended' as const,
        summary: `${userData.fullName} achieved an average score of ${avgScore}% in the ${userData.domain} assessment. ${avgScore >= 65 ? "Recommended for further consideration." : "Additional review may be required."}`
      };

      onComplete(result, allResponses);
    }
  };

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="text-primary animate-pulse" size={40} />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">
            Preparing Your Assessment
          </h2>
          <p className="text-muted-foreground">
            AI is generating personalized questions for {userData.domain}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-20">
        <div className="container max-w-4xl flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Brain className="text-primary" size={18} />
              <span className="text-muted-foreground">{userData.domain}</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft < 300 ? 'bg-destructive/20 text-destructive' : 'bg-primary/10 text-primary'}`}>
              <Clock size={16} />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="container max-w-4xl py-4">
        <ProgressBar current={currentQuestion + 1} total={questions.length} />
      </div>

      {/* Main Content */}
      <main className="flex-1 container max-w-4xl py-8 px-4">
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
          <CardContent className="p-8">
            {isThinking ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="text-primary animate-spin mb-4" size={48} />
                <p className="text-muted-foreground">AI is analyzing your response...</p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-primary" size={16} />
                    <span className="text-xs text-primary font-medium uppercase tracking-wider">
                      AI-Generated Question {currentQuestion + 1} of {questions.length}
                    </span>
                  </div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {questions[currentQuestion]}
                  </h2>
                </div>

                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="min-h-[200px] bg-background/50 border-border/50 text-base resize-none"
                />

                <div className="flex justify-end mt-6">
                  <Button
                    onClick={handleNextQuestion}
                    variant="gradient"
                    size="lg"
                    disabled={isSubmitting || !answer.trim()}
                  >
                    {currentQuestion < questions.length - 1 ? (
                      <>
                        Next Question
                        <ArrowRight size={18} />
                      </>
                    ) : (
                      <>
                        Submit Assessment
                        <Send size={18} />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Question dots navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentQuestion 
                  ? 'bg-primary scale-125' 
                  : index < currentQuestion 
                    ? 'bg-accent' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default InterviewRoom;
