import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-11 w-11 text-base",
    lg: "h-16 w-16 text-xl"
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-xl font-extrabold text-white shadow-lg shadow-primary-500/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary-500/40",
        sizeClasses[size],
        "bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800",
        "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-50",
        className
      )}
    >
      <span className="relative z-10 leading-none tracking-tight">RH</span>
    </div>
  );
}
