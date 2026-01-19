import Image from "next/image";

interface MemberBlurbProps {
  name: string;
  description: string;
  quote: string;
  image: string;
}

export default function MemberBlurb({ name, description, quote, image }: MemberBlurbProps) {
  // Remove any ** markers from quote (no orange highlights)
  const cleanQuote = quote.replace(/\*\*/g, '');

  return (
    <div className="member-blurb h-full">
      {/* Dark grey rectangle containing everything */}
      <div className="border md:border-2 border-[#333333] bg-white p-6 md:p-8 h-full flex flex-col">
        {/* Quote - serif font with italic, no quote characters */}
        <blockquote className="font-body italic text-black text-base md:text-lg leading-relaxed mb-6 flex-grow text-justify">
          {cleanQuote}
        </blockquote>

        {/* Profile section */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Profile Picture - circular, no orange border */}
          <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden">
            <Image
              src={image}
              alt={name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name and Description */}
          <div className="flex flex-col">
            <span className="font-body-bold text-[#FF9416] text-lg md:text-xl">
              {name}
            </span>
            <span className="font-body text-black text-sm md:text-base mt-1">
              {description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
