
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import OnboardingSlide from "@/components/auth/OnboardingSlide";
import { useIsMobile } from "@/hooks/use-mobile";

const slides = [
  {
    title: "Your Health, Digitized",
    description: "Access your medical records anytime and anywhere with Healthify.",
    imageSrc: "/placeholder.svg" // Replace with actual image
  },
  {
    title: "Access Anytime, Anywhere",
    description: "Connect with doctors instantly through text, audio, or video consultations.",
    imageSrc: "/placeholder.svg" // Replace with actual image
  },
  {
    title: "Care You Can Trust",
    description: "Secure, private, and personalized healthcare management.",
    imageSrc: "/placeholder.svg" // Replace with actual image
  }
];

const SplashScreen = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    // Set that the user has seen the splash screen
    localStorage.setItem("hasSeenSplash", "true");
    
    // Check authentication status after setting hasSeenSplash
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const hasCompletedProfile = localStorage.getItem("hasCompletedProfile") === "true";
    
    if (isAuthenticated) {
      if (hasCompletedProfile) {
        navigate("/dashboard");
      } else {
        navigate("/profile-setup");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1 relative overflow-hidden">
        {slides.map((slide, index) => (
          <OnboardingSlide
            key={index}
            title={slide.title}
            description={slide.description}
            imageSrc={slide.imageSrc}
            isActive={activeSlide === index}
          />
        ))}
      </div>
      
      <div className={cn(
        "p-6 flex flex-col items-center",
        isMobile ? "pb-10" : ""
      )}>
        <div className="flex justify-center space-x-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-300",
                activeSlide === index ? "bg-health-primary" : "bg-slate-200"
              )}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        <Button
          className="w-full bg-health-accent hover:bg-health-accent/90 text-white"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default SplashScreen;
