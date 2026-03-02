import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface TransparentButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "login";
  onClick?: () => void;
  className?: string;
}

export default function TransparentButton({
  children,
  type = "button",
  variant = "default",
  onClick,
  className = "",
}: TransparentButtonProps) {
  
  const isLogin = variant === "login";

  // Define size classes based on variant
  const sizeClasses = isLogin
    ? "px-4 py-[10px] text-sm rounded-lg md:rounded-xl" // Smaller size for login
    : "px-6 py-3.5 text-[12px] md:px-8 md:py-4 md:text-base rounded-xl md:rounded-2xl"; // Original size

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        group flex items-center justify-between
        bg-white
        text-(--primary-color)
        font-bold
        transition-all duration-300
        border-(--primary-color)
        border-2
        hover:bg-(--primary-color)
        hover:text-white
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
          bg-(--primary-color)
          text-white
          transition-transform duration-300
          group-hover:translate-x-1
          ml-2
          ${isLogin ? "h-3 w-3" : "h-3.5 w-3.5 md:ml-3 md:h-4 md:w-4"}
        `}
      >
        <ArrowRight className={isLogin ? "h-2 w-2" : "h-2.5 w-2.5 md:h-3 md:w-3"} />
      </span>
    </button>
  );
}