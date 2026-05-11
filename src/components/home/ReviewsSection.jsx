import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";

const reviews = [
  {
    text: "Ho ordinato una borsa personalizzata per il mio compleanno e sono rimasta senza parole. Qualità altissima, ogni punto è perfetto. Simo è stata gentilissima e disponibile in ogni fase.",
    name: "Martina R.",
    detail: "Borsa personalizzata",
  },
  {
    text: "Prodotto bellissimo, curato nei dettagli e confezionato con amore. Si vede che è fatto a mano con tanta passione.",
    name: "Giulia M.",
    detail: "Accessori handmade",
  },
  {
    text: "Ho richiesto una personalizzazione e il risultato è stato ancora più bello di quello che immaginavo.",
    name: "Sara L.",
    detail: "Creazione su misura",
  },
];

export default function ReviewsSection() {
  const [index, setIndex] = useState(0);
  const review = reviews[index];

  const prev = () => setIndex((index - 1 + reviews.length) % reviews.length);
  const next = () => setIndex((index + 1) % reviews.length);

  return (
    <section className="bg-[#fbf6f3] px-4 py-16 text-center">
      <p className="text-sm tracking-[0.4em] text-rose-400 font-semibold mb-3">
        COSA DICONO DI NOI
      </p>

      <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
        Clienti Soddisfatte
      </h2>

      <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
        Ogni creazione nasce dall'amore per il lavoro a mano e dalla cura per chi la riceve.
      </p>

      <div className="max-w-xl mx-auto bg-white rounded-[2rem] shadow-sm border p-8">
        <Quote className="w-10 h-10 mx-auto text-rose-100 mb-6" />

        <p className="text-xl italic leading-relaxed mb-8">
          “{review.text}”
        </p>

        <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 flex items-center justify-center mb-3">
          <span className="font-bold text-rose-500">{review.name[0]}</span>
        </div>

        <h3 className="font-bold">{review.name}</h3>
        <p className="text-sm text-muted-foreground">{review.detail}</p>
      </div>

      <div className="flex items-center justify-center gap-6 mt-8">
        <button onClick={prev} className="w-12 h-12 rounded-full bg-white shadow border flex items-center justify-center">
          <ChevronLeft />
        </button>

        <div className="flex gap-2">
          {reviews.map((_, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-full ${i === index ? "bg-rose-400 w-8" : "bg-rose-100"}`}
            />
          ))}
        </div>

        <button onClick={next} className="w-12 h-12 rounded-full bg-white shadow border flex items-center justify-center">
          <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-14">
        <div>
          <p className="text-3xl font-heading font-bold text-rose-400">500+</p>
          <p className="text-sm text-muted-foreground">Clienti felici</p>
        </div>

        <div>
          <p className="text-3xl font-heading font-bold text-rose-400 flex items-center justify-center gap-1">
            4.9 <Star className="w-7 h-7 fill-current" />
          </p>
          <p className="text-sm text-muted-foreground">Valutazione media</p>
        </div>

        <div>
          <p className="text-3xl font-heading font-bold text-rose-400">100%</p>
          <p className="text-sm text-muted-foreground">Fatto a mano</p>
        </div>
      </div>
    </section>
  );
}
