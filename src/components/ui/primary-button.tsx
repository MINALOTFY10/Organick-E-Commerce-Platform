import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface PrimaryButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "login"; // Added variant prop
  onClick?: () => void;
  className?: string;
  arrowClassName?: string;
}

export default function PrimaryButton({
  children,
  type = "button",
  variant = "default", // Default to standard size
  onClick,
  className = "",
  arrowClassName = "",
}: PrimaryButtonProps) {
  // Define size classes based on variant
  const isLogin = variant === "login";

  const sizeClasses =
    isLogin ?
      "px-4 py-[10px] text-sm rounded-full text-(--primary-color) bg-transparent border-(--primary-color) border-2 hover:bg-(--primary-color) hover:text-white" // Smaller size for login
    : "px-6 py-3.5 text-[12px] md:px-8 md:py-4 md:text-base rounded-xl md:rounded-2xl text-white";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        group flex items-center justify-between
        bg-(--primary-color)
        font-bold
        transition-all duration-300
        hover:bg-[#52504b]
        shadow-sm
        cursor-pointer
        
        ${sizeClasses}
        ${className}
      `}
    >
      <span className="tracking-wide">{children}</span>

      <span
        className={`
          flex items-center justify-center
          rounded-full
          bg-[#335B6B]
          text-white
          transition-transform duration-300
          group-hover:translate-x-1
          ml-2 
          ${isLogin ? "h-3 w-3" : "h-3.5 w-3.5 md:ml-3 md:h-4 md:w-4"}
          ${arrowClassName}
        `}
      >
        <ArrowRight className={isLogin ? "h-2 w-2" : "h-2.5 w-2.5 md:h-3 md:w-3"} />
      </span>
    </button>
  );
}
