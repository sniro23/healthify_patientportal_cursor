
import { cn } from "@/lib/utils";
import React from "react";

interface OnboardingSlideProps {
  title: string;
  description: string;
  imageSrc: string;
  isActive: boolean;
}

const OnboardingSlide = ({
  title,
  description,
  imageSrc,
  isActive
}: OnboardingSlideProps) => {
  return (
    <div 
      className={cn(
        "absolute top-0 left-0 w-full h-full flex flex-col items-center px-6 transition-opacity duration-500",
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      )}
    >
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-xs">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
      
      <div className="text-center mb-24">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-600">{description}</p>
      </div>
    </div>
  );
};

export default OnboardingSlide;
