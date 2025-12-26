import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: string;
  options: string[];
  selectedOption: number | null;
  onSelect: (index: number) => void;
}

export const QuestionCard = ({ question, options, selectedOption, onSelect }: QuestionCardProps) => {
  return (
    <Card className="animate-slide-up shadow-elevated border-0">
      <CardContent className="p-8">
        <h2 className="text-xl font-display font-semibold text-foreground mb-6">
          {question}
        </h2>
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={cn(
                "w-full p-4 rounded-lg border-2 text-left transition-all duration-200 hover:border-primary/50",
                selectedOption === index
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  selectedOption === index
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                )}>
                  {selectedOption === index && (
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  )}
                </div>
                <span className={cn(
                  "text-base transition-colors",
                  selectedOption === index ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {option}
                </span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
