"use client";

import { useState, useRef, useEffect } from "react";
import MemberBlurb from "./MemberBlurb";

interface Member {
  id: string;
  name: string;
  description: string;
  quote: string;
  image: string;
}

interface MemberCarouselProps {
  members: Member[];
}

export default function MemberCarousel({ members }: MemberCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll to update active dot
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setActiveIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to specific member when dot is clicked - faster animation
  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const itemWidth = container.offsetWidth;
    const targetScroll = index * itemWidth;
    const startScroll = container.scrollLeft;
    const distance = targetScroll - startScroll;
    const duration = 150; // Fast animation duration in ms
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      container.scrollLeft = startScroll + distance * easeOut;
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <div className="member-carousel -mx-6">
      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {members.map((member) => (
          <div
            key={member.id}
            className="flex-shrink-0 w-full px-6 snap-center"
            style={{ scrollSnapStop: "always" }}
          >
            <MemberBlurb
              name={member.name}
              description={member.description}
              quote={member.quote}
              image={member.image}
            />
          </div>
        ))}
      </div>

      {/* Square indicators - fixed height, spread wide, with half-gap margin on sides */}
      <div 
        className="flex justify-between items-center h-6 mt-6"
        style={{ marginLeft: 'calc(100% / 14)', marginRight: 'calc(100% / 14)' }}
      >
        {members.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2.5 h-2.5 transition-all duration-150 ${
              index === activeIndex
                ? "bg-[#FF9416]"
                : "bg-gray-300"
            }`}
            aria-label={`Go to member ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
