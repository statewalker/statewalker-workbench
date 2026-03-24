import { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref,
  ) => {
    const variantClass = variant === "default" ? "btn" : `btn-${variant}`;
    const sizeClass = size === "default" ? "" : `btn-${size}`;
    return (
      <button
        ref={ref}
        className={`${variantClass} ${sizeClass} ${className}`.trim()}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
