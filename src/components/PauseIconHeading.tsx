import React from 'react';
import Image from 'next/image';

interface PauseIconHeadingProps {
  children: React.ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
}

export default function PauseIconHeading({
  children,
  as: Component = 'h2',
  className = '',
}: PauseIconHeadingProps) {
  return (
    <div className="flex items-center relative" style={{ marginLeft: '-1em' }}>
      {/* Pause icon SVG */}
      <div
      
        className="flex-shrink-0"
        style={{
          width: '3em',
          height: '3em',
        }}
      >
        <Image
          src="/Logo_Circle_White.svg"
          alt=""
          width={654}
          height={654}
          className="w-full h-full"
          aria-hidden="true"
        />
      </div>
      
      {/* Heading text - shifted left to overlap the circle */}
      <Component
        className={`font-headline text-2xl md:text-3xl text-black ${className}`}
        style={{
          marginLeft: '-0.28em',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </Component>
    </div>
  );
}
