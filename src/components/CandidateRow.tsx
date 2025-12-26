import { Badge } from "@/components/ui/badge";
import { User, Phone, Calendar, TrendingUp, TrendingDown } from "lucide-react";

interface CandidateRowProps {
  name: string;
  phone: string;
  registrationNo: string;
  domain: string;
  score: number;
  recommendation: "recommended" | "not_recommended" | "pending";
  date: string;
}

export const CandidateRow = ({ 
  name, 
  phone, 
  registrationNo, 
  domain, 
  score, 
  recommendation, 
  date 
}: CandidateRowProps) => {
  const getRecommendationStyle = () => {
    switch (recommendation) {
      case "recommended":
        return "bg-accent/10 text-accent border-accent/20";
      case "not_recommended":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getScoreColor = () => {
    if (score >= 70) return "text-accent";
    if (score >= 50) return "text-yellow-600";
    return "text-destructive";
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border hover:shadow-card transition-all duration-200 group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Phone size={12} />
              {phone}
            </span>
            <span>ID: {registrationNo}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <Badge variant="secondary" className="font-medium">
          {domain}
        </Badge>
        
        <div className="flex items-center gap-2">
          {score >= 70 ? (
            <TrendingUp size={16} className="text-accent" />
          ) : (
            <TrendingDown size={16} className="text-destructive" />
          )}
          <span className={`font-bold text-lg ${getScoreColor()}`}>{score}%</span>
        </div>
        
        <Badge className={`${getRecommendationStyle()} border capitalize`}>
          {recommendation === "recommended" ? "✓ Recommended" : 
           recommendation === "not_recommended" ? "✗ Not Recommended" : "⏳ Pending"}
        </Badge>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar size={14} />
          {date}
        </div>
      </div>
    </div>
  );
};
