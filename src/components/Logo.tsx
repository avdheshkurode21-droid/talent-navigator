import { Briefcase } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const textClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} gradient-primary rounded-xl flex items-center justify-center shadow-soft`}>
        <Briefcase className="text-primary-foreground" size={size === "lg" ? 28 : size === "md" ? 22 : 18} />
      </div>
      <span className={`${textClasses[size]} font-display font-bold text-foreground`}>
        Talent<span className="text-primary">AI</span>
      </span>
    </div>
  );
};
