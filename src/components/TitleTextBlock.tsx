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
      <span className="font-headline text-sm sm:text-lg md:text-2xl text-black block mb-2">
        {smallHeading}
      </span>
      
      {/* Two-column grid for large heading and text - starts at sm (640px) for tablet */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 md:gap-12">
        {/* Left side: Large Heading with container query */}
        <div className="@container">
          <h2 className="font-headline text-[9cqi] text-black leading-tight">
            {largeHeading}
          </h2>
        </div>

        {/* Right side: Text */}
        <p className="text-content text-content-mobile">
          {text}
        </p>
      </div>
    </div>
  );
}
