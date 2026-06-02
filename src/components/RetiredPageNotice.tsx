import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RetiredPageNotice() {
  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        <section className="mx-auto flex min-h-[55vh] max-w-2xl flex-col justify-center px-6 py-20 md:px-10">
          <p className="font-section text-sm text-[#FF9416]">
            PauseAI Deutschland
          </p>
          <h1 className="font-headline mt-2 text-3xl text-pause-black md:text-5xl">
            This page doesn&apos;t exist anymore
          </h1>
          <p className="mt-5 font-body text-lg text-pause-black/80">
            The guide that used to live here has moved, and is no longer hosted
            on this site.
          </p>
          <p className="mt-4 font-body text-pause-black/75">
            If someone sent you this link, go back to that message or page and
            check it again — it has most likely been updated to point to the new
            location.
          </p>
          <p className="mt-4 font-body text-pause-black/75">
            Need a hand? Message Simon on Signal (username{" "}
            <code className="rounded bg-pause-black/5 px-1 py-0.5 font-mono text-sm">
              SimonSkade.01
            </code>
            ) or email{" "}
            <a
              href="mailto:simon@pauseai.info"
              className="orange-link font-body-bold"
            >
              simon@pauseai.info
            </a>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
