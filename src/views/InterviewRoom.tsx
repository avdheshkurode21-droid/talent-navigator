import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ProgressBar } from "@/components/ProgressBar";
import { UserData, InterviewResponse } from "@/types";
import { Clock, Send, ArrowRight, Brain, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface InterviewRoomProps {
  userData: UserData;
  onComplete: (result: { score: number; recommendation: 'recommended' | 'not_recommended'; summary: string }, responses: InterviewResponse[]) => void;
}

// AI-generated questions based on domain
const domainQuestions: Record<string, string[]> = {
  "HR Services": [
    "Describe your approach to handling employee conflicts in the workplace.",
    "How would you design an effective onboarding program for new hires?",
    "Explain your experience with performance management systems.",
    "How do you stay updated with employment laws and regulations?",
    "Describe a challenging recruitment scenario you handled successfully."
  ],
  "Frontend Developer": [
    "Explain the difference between React hooks and class components.",
    "How would you optimize a web application for performance?",
    "Describe your approach to responsive design and accessibility.",
    "What state management solutions have you worked with?",
    "How do you handle cross-browser compatibility issues?"
  ],
  "Backend Developer": [
    "Explain RESTful API design principles you follow.",
    "How would you design a scalable microservices architecture?",
    "Describe your approach to database optimization.",
    "What security measures do you implement in backend systems?",
    "How do you handle error logging and monitoring?"
  ],
  "default": [
    "Tell us about your most significant professional achievement.",
    "How do you approach problem-solving in your field?",
    "Describe a situation where you had to learn a new skill quickly.",
    "How do you prioritize tasks when facing multiple deadlines?",
    "Where do you see yourself professionally in 5 years?"
  ]
};

const InterviewRoom = ({ userData, onComplete }: InterviewRoomProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [responses, setResponses] = useState<InterviewResponse[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const questions = domainQuestions[userData.domain || "default"] || domainQuestions["default"];

  useEffect(() => {
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
  }, []);

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
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newResponse: InterviewResponse = {
      question: questions[currentQuestion],
      answer: answer.trim(),
      score: Math.floor(Math.random() * 40) + 60 // Simulated score 60-100
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
  };

  const handleFinalSubmit = async (finalResponses?: InterviewResponse[]) => {
    setIsSubmitting(true);
    
    const allResponses = finalResponses || responses;
    const avgScore = allResponses.length > 0 
      ? Math.round(allResponses.reduce((acc, r) => acc + r.score, 0) / allResponses.length)
      : 0;

    // Simulate AI evaluation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = {
      score: avgScore,
      recommendation: avgScore >= 65 ? 'recommended' as const : 'not_recommended' as const,
      summary: `Candidate demonstrated ${avgScore >= 75 ? 'strong' : avgScore >= 65 ? 'adequate' : 'insufficient'} proficiency in ${userData.domain}. ${avgScore >= 65 ? 'Recommended for further consideration.' : 'Additional training may be required.'}`
    };

    onComplete(result, allResponses);
  };

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
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <h2 className="text-2xl font-display font-bold text-foreground mt-3">
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
