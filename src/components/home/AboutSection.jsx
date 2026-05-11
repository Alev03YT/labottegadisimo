import React from "react";
import { HandHeart } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="bg-[#fbf6f3] px-4 py-16 text-center">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm tracking-[0.4em] text-rose-400 font-semibold mb-3">
          CHI SONO
        </p>

        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-5">
          L'Arte delle Mani
        </h2>

        <p className="text-muted-foreground text-lg leading-relaxed mb-10">
          Da anni creo con passione oggetti unici, combinando la tradizione della manifattura italiana
          con il design contemporaneo.
        </p>

        <div className="bg-white rounded-[2rem] border shadow-sm p-8">
          <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-5">
            <HandHeart className="w-9 h-9 text-rose-400" />
          </div>

          <h3 className="font-heading text-3xl font-bold mb-3">
            100% Fatto a Mano
          </h3>

          <p className="text-muted-foreground leading-relaxed">
            Ogni creazione è realizzata con cura, pazienza e attenzione ai dettagli,
            per offrire prodotti unici e personalizzati.
          </p>
        </div>
      </div>
    </section>
  );
}
