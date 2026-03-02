import React from "react";

interface CircleProps {
  heading: string;
  text: string;
}

const Circle: React.FC<CircleProps> = ({ heading, text }) => {
  return (
    <div
      className="
        w-[150px] h-[150px] 
        rounded-full 
        border-[4px] border-[#7eb693] 
        bg-[#f1f1f1] 
        flex flex-col justify-center items-center 
        m-2.5 
        shadow-sm
        transition-transform hover:scale-105 duration-300
      "
    >
      <div className="text-center text-[#525c60]">
        <h2 className="text-[28px] font-bold m-0 p-0 leading-tight">
          {heading}
        </h2>
        <p className="text-[13px] font-medium m-0 p-0 text-gray-500">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Circle;