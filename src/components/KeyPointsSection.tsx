'use client';

import React, { useEffect, useRef, useState } from 'react';

interface KeyPoint {
  text: string;
}

interface KeyPointsSectionProps {
  title: string;
  points: KeyPoint[];
  containerColor?: string;
  pointColor?: string;
}

export default function KeyPointsSection({
  title,
  points,
  containerColor = '#FF9416',
  pointColor = '#e91e6eff',
}: KeyPointsSectionProps) {
  const [visiblePoints, setVisiblePoints] = useState<boolean[]>(
    new Array(points.length).fill(false)
  );
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            // Stagger the animations
            points.forEach((_, index) => {
              setTimeout(() => {
                setVisiblePoints((prev) => {
                  const newState = [...prev];
                  newState[index] = true;
                  return newState;
                });
              }, index * 200);
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [points]);

  const keyPointStyle = {
    padding: '1.5rem 1.75rem',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.6,
    color: 'white',
    backgroundColor: pointColor,
  };

  return (
    <div
      ref={sectionRef}
      className="rounded-2xl p-6 md:p-8 my-8"
      style={{ backgroundColor: containerColor }}
    >
      {/* Title */}
      <h3 className="font-headline text-2xl md:text-1xl text-white mb-6 text-right">
        {title}
      </h3>

      {/* Key Points */}
      <div className="space-y-4">
        {points.map((point, index) => (
          <div
            key={index}
            style={{
              ...keyPointStyle,
              opacity: visiblePoints[index] ? 1 : 0,
              transform: visiblePoints[index]
                ? 'translateY(0)'
                : 'translateY(20px)',
              transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
            }}
            className="flex items-start gap-3"
          >
            <span className="flex-shrink-0" style={{ fontSize: '1.2em', lineHeight: 1.2 }}>→</span>
            <span>{point.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
