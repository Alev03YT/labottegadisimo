import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

function ColorSection({ title, emoji, items }) {
  if (items.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="font-heading text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2">
        <span>{emoji}</span>
        {title}
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {items.map((item) => (
          <div key={item.id} className="text-center">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary border shadow-sm mb-2">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  No foto
                </div>
              )}
            </div>

            <p className="text-xs font-medium uppercase leading-tight">
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Materials() {
  const [colors, setColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadColors = async () => {
      try {
        const snap = await getDocs(collection(db, "colors"));
        setColors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Errore caricamento colori:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadColors();
  }, []);

  const filati = colors.filter((c) => c.type === "filato");
  const pelle = colors.filter((c) => c.type === "pelle");
  const minuteria = colors.filter((c) => c.type === "minuteria");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">
          Varianti disponibili
        </span>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Colori e Materiali
        </h1>

        <p className="text-muted-foreground text-sm mt-2">
          Consulta tutti i colori disponibili per filati, pelle/ecopelle e minuteria.
        </p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Caricamento colori...</p>
      ) : (
        <>
          <ColorSection title="Colori Filato" emoji="🧶" items={filati} />
          <ColorSection title="Colori Pelle" emoji="👜" items={pelle} />
          <ColorSection title="Colori Minuteria" emoji="🔩" items={minuteria} />
        </>
      )}
    </div>
  );
}
