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
      <span className="font-headline text-xl md:text-2xl text-black block mb-2">
        {smallHeading}
      </span>
      
      {/* Two-column grid for large heading and text */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {/* Left side: Large Heading */}
        <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl text-black leading-tight">
          {largeHeading}
        </h2>

        {/* Right side: Text */}
        <p className="text-content">
          {text}
        </p>
      </div>
    </div>
  );
}
