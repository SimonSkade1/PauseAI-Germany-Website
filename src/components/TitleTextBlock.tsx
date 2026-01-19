interface TitleTextBlockProps {
  smallHeading: string;
  largeHeading: string;
  text: string | React.ReactNode;
  className?: string;
  id?: string;
}

export default function TitleTextBlock({
  smallHeading,
  largeHeading,
  text,
  className = "",
  id,
}: TitleTextBlockProps) {
  return (
    <div id={id} className={className}>
      {/* Small heading - full width above grid */}
      <span className="font-headline text-base sm:text-xl md:text-2xl text-black block mb-2">
        {smallHeading}
      </span>
      
      {/* Two-column grid for large heading and text - starts at sm (640px) for tablet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 md:gap-12">
        {/* Left side: Large Heading */}
        <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-black leading-tight">
          {largeHeading}
        </h2>

        {/* Right side: Text */}
        <p className="text-content text-content-mobile">
          {text}
        </p>
      </div>
    </div>
  );
}
