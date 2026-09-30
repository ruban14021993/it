"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function InteractiveFireworks() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find closest clickable element (button or a tag)
      const target = e.target as HTMLElement;
      const clickable = target.closest("button, a, [role='button']");
      
      if (clickable) {
        // Calculate click coordinates relative to screen for confetti origin
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // Fire crackers / confetti effect!
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { x, y },
          colors: ["#0a82bd", "#00a56f", "#fbbf24", "#ef4444"],
          disableForReducedMotion: true,
          zIndex: 9999,
        });
      }
    };

    // Attach to document body
    document.addEventListener("click", handleClick);
    
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null; // This component doesn't render anything visually by itself
}
