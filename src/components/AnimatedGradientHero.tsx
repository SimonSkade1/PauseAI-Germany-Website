"use client";

import React, { useState, useEffect, ReactNode } from "react";

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Gradient colors (OKLAB interpolation)
  colorStart: "#FFA033",
  colorEnd: "#FF6B6B",
  
  // Animation settings
  rotationDuration: 45000, // Time for one full rotation in ms (45 seconds)
  startAngle: 135,         // Starting angle in degrees
};
// ============================================

interface AnimatedGradientHeroProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedGradientHero({
  children,
  className = "",
}: AnimatedGradientHeroProps) {
  const [angle, setAngle] = useState(CONFIG.startAngle);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Calculate angle based on elapsed time (continuous rotation)
      const progress = (elapsed % CONFIG.rotationDuration) / CONFIG.rotationDuration;
      const newAngle = (CONFIG.startAngle + progress * 360) % 360;
      
      setAngle(newAngle);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const gradientStyle = {
    background: `linear-gradient(${angle}deg in oklab, ${CONFIG.colorStart}, ${CONFIG.colorEnd})`,
  };

  return (
    <section className={className} style={gradientStyle}>
      {children}
    </section>
  );
}
