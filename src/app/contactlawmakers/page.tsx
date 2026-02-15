"use client";

import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import AbgeordneteSelect from "../../components/AbgeordneteSelect";

export default function ContactLawmakers() {
  return (
    <>
      <Header />
      <main className="pt-18">{/* add top padding so header doesn't overlap content */}
        <section className="bg-pause-gray-light py-12">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="font-headline text-3xl md:text-4xl text-pause-black mb-4">Kontakt zu Abgeordneten</h1>
            <p className="font-body text-pause-black/80 mb-6">Wähle einen Abgeordneten aus der Liste oder lasse einen zufälligen auswählen. Die Auswahl füllt die E‑Mail‑Vorlage in der Vorschau.</p>
            <div className="">
              <AbgeordneteSelect onSelect={(row) => console.log("selected", row)} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
