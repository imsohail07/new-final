import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const [step, setStep] = useState("zoom"); // "zoom", "greet"
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    // 1. Calculate time-of-day greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 17) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    // 2. Zoom phase (1.8s duration)
    const zoomTimer = setTimeout(() => {
      setStep("greet");
    }, 1800);

    // 3. Greeting phase (1.8s duration) then redirect to news
    const redirectTimer = setTimeout(() => {
      navigate("/dashboard");
    }, 3600);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white overflow-hidden relative">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(170,142,93,0.12),transparent_60%)] pointer-events-none" />

      {step === "zoom" && (
        <div className="text-center animate-fade-in-zoom px-6">
          <img 
            src="/images/meridian-logo.png" 
            alt="The Meridian Times" 
            className="w-[450px] md:w-[600px] max-w-full object-contain filter drop-shadow-[0_0_35px_rgba(170,142,93,0.15)] mx-auto"
          />
        </div>
      )}

      {step === "greet" && (
        <div className="text-center animate-fade-in space-y-4 font-cinzel">
          <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-white">
            {greeting}
          </h2>
          <p className="text-xs text-purple-400 tracking-[0.3em] font-semibold uppercase animate-pulse">
            NEWS THAT DEFINES OUR WORLD
          </p>
        </div>
      )}
    </div>
  );
}
