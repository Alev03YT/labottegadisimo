import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "Quanto tempo ci vuole per ricevere il mio ordine?",
    a: "I prodotti già disponibili vengono spediti entro 2-3 giorni lavorativi. Per articoli personalizzati o su ordinazione, i tempi variano da 5 a 15 giorni lavorativi a seconda della complessità.",
  },
  {
    q: "Posso richiedere una personalizzazione?",
    a: "Assolutamente sì. Puoi scegliere colori, dimensioni, materiali e aggiungere dettagli in pelle o minuteria.",
  },
  {
    q: "Spedite in tutta Italia? E all'estero?",
    a: "Sì, spedisco in tutta Italia. Per spedizioni internazionali è meglio contattarmi prima dell'ordine per concordare modalità e costi.",
  },
  {
    q: "Come devo prendermi cura dei prodotti in lana/filato?",
    a: "Consiglio il lavaggio a mano in acqua fredda con detergente delicato. Evita l'asciugatrice e stendi in piano senza strizzare.",
  },
  {
    q: "Come funzionano gli schemi digitali?",
    a: "Gli schemi digitali sono file PDF inviati via email dopo l'acquisto. Una volta acquistati sono tuoi per sempre.",
  },
  {
    q: "I prodotti sono adatti ai bambini piccoli?",
    a: "Gli amigurumi e alcuni accessori sono realizzati con materiali sicuri, ma potrebbero contenere piccoli elementi decorativi. Per bambini sotto i 3 anni consiglio di contattarmi prima.",
  },
  {
    q: "Quali metodi di pagamento accettate?",
    a: "I metodi di pagamento disponibili vengono indicati al momento dell'ordine o concordati direttamente in fase di acquisto.",
  },
  {
    q: "Posso fare un reso o un cambio?",
    a: "Per prodotti standard puoi richiedere un reso entro 14 giorni. I prodotti personalizzati non sono rimborsabili salvo difetti di lavorazione.",
  },
  {
    q: "I prodotti sono fatti davvero a mano?",
    a: "Sì, ogni prodotto è realizzato a mano con cura, passione e attenzione ai dettagli.",
  },
  {
    q: "Posso richiedere una fattura o documento fiscale?",
    a: "Sì, puoi richiederlo prima della conferma dell'ordine indicando i dati necessari.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-[#fbf6f3] px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm tracking-[0.4em] text-rose-400 font-semibold mb-3">
          HAI DUBBI?
        </p>

        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
          Domande Frequenti
        </h2>

        <p className="text-muted-foreground text-lg mb-10">
          Tutto quello che devi sapere su spedizioni, personalizzazioni e cura dei prodotti.
        </p>

        <div className="space-y-4 text-left">
          {faqs.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex justify-between items-center gap-4 p-5 font-semibold text-left"
              >
                <span>{item.q}</span>
                {open === i ? <ChevronUp className="text-rose-400" /> : <ChevronDown className="text-rose-400" />}
              </button>

              {open === i && (
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 text-muted-foreground">
          Non hai trovato la risposta?{" "}
          <Link to="/Contacts" className="text-rose-400 underline font-semibold">
            Scrivici direttamente →
          </Link>
        </p>
      </div>
    </section>
  );
}
