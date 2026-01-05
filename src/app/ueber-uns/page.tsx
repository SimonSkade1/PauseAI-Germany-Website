import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MemberBlurb from "@/components/MemberBlurb";
import members from "@/data/members.json";

function HeroSection() {
  return (
    <section className="relative min-h-screen pt-20 bg-[#FF9416]">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        {/* Hero Image */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
          <Image
            src="/img_gruendung.webp"
            alt="PauseAI Germany Gründung"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Title */}
        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-black text-center">
          Wer Wir Sind
        </h1>
      </div>
    </section>
  );
}

function MembersSection() {
  return (
    <section className="bg-pause-gray-light py-16 md:py-24">
      <div className="w-full px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {members.map((member) => (
            <MemberBlurb
              key={member.id}
              name={member.name}
              description={member.description}
              quote={member.quote}
              image={member.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function UeberUns() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <MembersSection />
      </main>
      <Footer />
    </>
  );
}
