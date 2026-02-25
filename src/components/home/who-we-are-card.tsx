import React from "react";

interface WhoWeAreCardProps {
  children: React.ReactNode;
  className?: string;
}

const WhoWeAreCard: React.FC<WhoWeAreCardProps> = ({ children, className = "" }) => {
  return (
    <section
      className={`
    bg-white p-8 md:p-12 rounded-[20px] w-[90%] max-w-160
    static mx-auto
    shadow-[0_4px_15px_rgba(0,0,0,0.2)] 
    xl:absolute xl:-left-17.5 xl:top-1/2 xl:-translate-y-1/2 xl:shadow-none
    ${className}
  `}
    >
      {children}
    </section>
  );
};

export default WhoWeAreCard;
