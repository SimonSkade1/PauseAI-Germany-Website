import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Download, ExternalLink } from "lucide-react";

type LogoAsset = {
  file: string;
  label: string;
  bg: "dark" | "checkered";
};

const logos: LogoAsset[] = [
  {
    file: "logo-wordmark.png",
    label: "Wortmarke",
    bg: "checkered",
  },
  {
    file: "logo-wordmark-dark-bg.png",
    label: "Wortmarke (dunkler Hintergrund)",
    bg: "checkered",
  },
  {
    file: "logo-wordmark-white-bg.png",
    label: "Wortmarke (weißer Hintergrund)",
    bg: "checkered",
  },
  {
    file: "logo-icon-circle.png",
    label: "Icon Kreis",
    bg: "checkered",
  },
  {
    file: "logo-icon-circle.svg",
    label: "Icon Kreis (SVG)",
    bg: "checkered",
  },
  {
    file: "logo-icon-square.png",
    label: "Icon Quadrat",
    bg: "checkered",
  },
  {
    file: "logo-icon-square-germany.png",
    label: "Icon Quadrat Deutschland",
    bg: "checkered",
  },
];

const bgClass: Record<LogoAsset["bg"], string> = {
  dark: "bg-[#1a1a1a]",
  checkered:
    "bg-[length:16px_16px] bg-[position:0_0,8px_8px]",
};

function LogoCard({ asset }: { asset: LogoAsset }) {
  const ext = asset.file.split(".").pop()?.toUpperCase();
  const isSquareIcon = asset.file.includes("icon-square");
  const isCircleIcon = asset.file.includes("icon-circle");
  const isCompact = isSquareIcon || isCircleIcon;

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
      <div
        className={`flex items-center justify-center p-8 ${
          asset.bg === "checkered"
            ? "bg-[linear-gradient(45deg,#e0e0e0_25%,transparent_25%),linear-gradient(-45deg,#e0e0e0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e0e0e0_75%),linear-gradient(-45deg,transparent_75%,#e0e0e0_75%)] bg-[length:16px_16px] bg-[position:0_0,0_8px,8px_-8px,-8px_0]"
            : bgClass[asset.bg]
        }`}
        style={{ minHeight: "160px" }}
      >
        <Image
          src={`/logos/${asset.file}`}
          alt={asset.label}
          width={isCompact ? 120 : 320}
          height={isCompact ? 120 : 80}
          className={isCompact ? "h-24 w-auto" : "h-16 w-auto max-w-full"}
        />
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
        <div>
          <p className="font-body-bold text-sm text-pause-black">{asset.label}</p>
          <p className="text-xs text-gray-400 font-mono">{asset.file}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 font-mono uppercase">{ext}</span>
          <a
            href={`/logos/${asset.file}`}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-pause-orange text-white text-sm rounded hover:bg-[#e88510] transition-colors"
          >
            <Download size={14} />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

export default function PressePage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-[#1a1a1a] pt-20 pb-16">
          <div className="px-6 sm:px-10 lg:px-16 pt-8">
            <h1 className="font-headline text-4xl sm:text-5xl text-white mb-4">
              Presse & Medien
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mb-6">
              Logos und Medien für Presseanfragen und Berichterstattung. Alle Dateien können frei für redaktionelle Zwecke verwendet werden.
            </p>
            <a
              href="https://drive.google.com/drive/folders/1bQ_MZ8giK-Mee4ABkO0BgcFInaXruNpa?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-body-bold"
            >
              <ExternalLink size={16} />
              Weiteres Medienmaterial auf Google Drive
            </a>
          </div>
        </section>

        <section className="bg-pause-gray-light py-16">
          <div className="px-6 sm:px-10 lg:px-16">
            <h2 className="font-section text-2xl text-pause-black mb-8">Logos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {logos.map((logo) => (
                <LogoCard key={logo.file} asset={logo} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
