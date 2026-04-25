import { forwardRef } from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variantClass = variant === "outline" ? "badge-outline" : "badge";
    return <span ref={ref} className={`${variantClass} ${className}`.trim()} {...props} />;
  },
);
Badge.displayName = "Badge";
