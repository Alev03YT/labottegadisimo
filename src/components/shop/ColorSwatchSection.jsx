const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { ImageIcon } from 'lucide-react';

function SwatchRow({ title, swatches }) {
  if (swatches.length === 0) return null;
  return (
    <div>
      <h3 className="font-heading text-lg font-semibold mb-4">{title}</h3>
      <div className="flex flex-wrap gap-4">
        {swatches.map(sw => (
          <div key={sw.id} className="flex flex-col items-center gap-1.5">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary border border-border shadow-sm">
              {sw.image_url ? <img src={sw.image_url} alt={sw.name} className="w-full h-full object-cover" /> :
                <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-muted-foreground/40" /></div>}
            </div>
            <span className="text-[11px] text-center text-foreground max-w-[64px] leading-tight">{sw.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ColorSwatchSection() {
  const { data: swatches = [] } = useQuery({
    queryKey: ['colorSwatches'],
    queryFn: () => db.entities.ColorSwatch.list(),
    initialData: [],
  });

  const filato = swatches.filter(s => s.type === 'filato');
  const pelle = swatches.filter(s => s.type === 'pelle');

  if (filato.length === 0 && pelle.length === 0) return null;

  return (
    <div className="mt-16 border-t border-border pt-12 space-y-10">
      <div className="mb-6">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2 block">Personalizza</span>
        <h2 className="font-heading text-2xl font-bold text-foreground">Colori Disponibili</h2>
        <p className="text-sm text-muted-foreground mt-1">Sfoglia i colori disponibili per personalizzare il tuo ordine</p>
      </div>
      <SwatchRow title="🧶 Colori Filato" swatches={filato} />
      <SwatchRow title="🟤 Colori Pelle" swatches={pelle} />
    </div>
  );
}