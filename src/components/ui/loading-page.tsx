"use client";

import React from "react";
import { Leaf } from "lucide-react";

const LoadingPage: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F9F8F4]">
      <div className="relative flex items-center justify-center mb-8">
        
        <div className="
          h-24 w-24 
          rounded-full 
          border-4 
          border-gray-200 
          border-t-[#274C5B] 
          animate-spin
        "></div>
        
        <div className="absolute">
          <Leaf 
            className="w-10 h-10 text-[#7EB693] animate-pulse" 
            fill="currentColor" 
          />
        </div>
      </div>


      <div className="text-center space-y-2">
        <p
          className="
            font-semibold text-[#8FA8A8]
            text-[clamp(0.8rem,1.5vw,1.1rem)]
            uppercase tracking-widest
          "
        >
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;