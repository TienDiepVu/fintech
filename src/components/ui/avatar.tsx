import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-2xl",
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden border border-border shrink-0", sizes[size], className)}>
        <img src={src} alt={name || "Avatar"} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center font-bold bg-primary/10 text-primary border border-primary/20 shrink-0",
        sizes[size],
        className
      )}
    >
      {name ? getInitials(name) : "?"}
    </div>
  );
}
