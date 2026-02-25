import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface SecondaryButtonProps {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  // It is often helpful to allow passing extra classes for width (e.g., w-full)
  className?: string; 
}

export default function SecondaryButton({
  children,
  type = "button",
  onClick,
  className = "",
}: SecondaryButtonProps) {
  const buttonClasses = [
    "group flex items-center justify-between",
    "bg-(--accent-color)",
    "text-[#214a3a]",
    "font-bold",
    "transition-all duration-300",
    "hover:bg-[#f6e28e]",
    "shadow-sm",
    "cursor-pointer",
    "rounded-xl px-5 py-3 text-[12px]",
    "md:rounded-2xl md:px-7 md:py-4 md:text-base",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconWrapperClasses =
    "flex items-center justify-center rounded-full bg-[#214a3a] text-white transition-transform duration-300 group-hover:translate-x-1 ml-2 h-3.5 w-3.5 md:ml-3 md:h-4 md:w-4";

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
    >
      <span className="tracking-wide">
        {children}
      </span>

      <span className={iconWrapperClasses}>
        {/* Responsive Icon Size */}
        <ArrowRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
      </span>
    </button>
  );
}