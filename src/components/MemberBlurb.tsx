import Image from "next/image";

interface MemberBlurbProps {
  name: string;
  description: string;
  quote: string;
  image: string;
}

export default function MemberBlurb({ name, description, quote, image }: MemberBlurbProps) {
  return (
    <div className="member-blurb relative w-full">
      {/* Profile Picture Circle */}
      <div className="relative z-10 w-32 h-32 md:w-40 md:h-40">
        <div className="w-full h-full rounded-full border-4 border-[#FF9416] overflow-hidden bg-white">
          <Image
            src={image}
            alt={name}
            width={160}
            height={160}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Info Box - overlapping bottom right of circle */}
      <div className="relative -mt-10 ml-16 md:ml-20 bg-pause-black rounded-2xl px-8 py-5 md:px-10 md:py-6">
        {/* Name and Description */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-body-bold text-white text-lg md:text-xl">{name}</span>
          <span className="font-body text-white/70 text-sm md:text-base">{description}</span>
        </div>

        {/* Quote */}
        <blockquote className="font-body text-white/90 text-sm md:text-base leading-loose text-left italic">
          &ldquo;{quote}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}
