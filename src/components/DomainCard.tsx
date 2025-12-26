import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DomainCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  selected?: boolean;
  onClick: () => void;
}

export const DomainCard = ({ icon: Icon, title, description, selected, onClick }: DomainCardProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative p-6 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-elevated",
        selected 
          ? "border-primary bg-primary/5 shadow-soft" 
          : "border-border bg-card hover:border-primary/50"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300",
        selected ? "gradient-primary" : "bg-secondary group-hover:bg-primary/10"
      )}>
        <Icon className={cn(
          "transition-colors duration-300",
          selected ? "text-primary-foreground" : "text-primary"
        )} size={24} />
      </div>
      <h3 className="font-display font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 gradient-primary rounded-full flex items-center justify-center animate-scale-in">
          <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
};
