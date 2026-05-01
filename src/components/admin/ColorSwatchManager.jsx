const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Upload, Loader2, ImageIcon } from 'lucide-react';

function SwatchGroup({ type, label, swatches, onDelete, onAdd }) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    setImageUrl(file_url);
    setUploading(false);
    toast.success('Foto caricata!');
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6">
      <h4 className="font-heading text-base font-semibold mb-4">{label}</h4>

      {/* Add new */}
      <div className="flex flex-wrap items-center gap-3 mb-5 p-4 bg-secondary/30 rounded-xl">
        <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
          {imageUrl ? <img src={imageUrl} alt="" className="w-full h-full object-cover" /> :
            <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-muted-foreground/40" /></div>}
        </div>
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          <Button variant="outline" size="sm" className="rounded-full pointer-events-none" asChild>
            <span>{uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <Upload className="w-3.5 h-3.5 mr-1" />}{uploading ? 'Caricamento...' : 'Foto'}</span>
          </Button>
        </label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome colore" className="w-40" onKeyDown={(e) => e.key === 'Enter' && name.trim() && onAdd(type, name, imageUrl, setName, setImageUrl)} />
        <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90" disabled={!name.trim()} onClick={() => onAdd(type, name, imageUrl, setName, setImageUrl)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Aggiungi
        </Button>
      </div>

      {/* Swatches grid */}
      {swatches.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nessun colore. Aggiungine uno sopra.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {swatches.map(sw => (
            <div key={sw.id} className="group relative flex flex-col items-center gap-1.5">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary border border-border">
                {sw.image_url ? <img src={sw.image_url} alt={sw.name} className="w-full h-full object-cover" /> :
                  <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-5 h-5 text-muted-foreground/40" /></div>}
              </div>
              <span className="text-[11px] text-center text-foreground max-w-[64px] leading-tight">{sw.name}</span>
              <button onClick={() => onDelete(sw.id)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ColorSwatchManager() {
  const queryClient = useQueryClient();

  const { data: swatches = [] } = useQuery({
    queryKey: ['colorSwatches'],
    queryFn: () => db.entities.ColorSwatch.list(),
    initialData: [],
  });

  const addMutation = useMutation({
    mutationFn: ({ type, name, image_url }) => db.entities.ColorSwatch.create({ type, name, image_url }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['colorSwatches'] }); toast.success('Colore aggiunto!'); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.ColorSwatch.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['colorSwatches'] }),
  });

  const handleAdd = (type, name, image_url, setName, setImageUrl) => {
    addMutation.mutate({ type, name, image_url });
    setName('');
    setImageUrl('');
  };

  const filato = swatches.filter(s => s.type === 'filato');
  const pelle = swatches.filter(s => s.type === 'pelle');

  return (
    <div className="space-y-6">
      <SwatchGroup type="filato" label="🧶 Colori Filato" swatches={filato} onAdd={handleAdd} onDelete={(id) => deleteMutation.mutate(id)} />
      <SwatchGroup type="pelle" label="🟤 Colori Pelle" swatches={pelle} onAdd={handleAdd} onDelete={(id) => deleteMutation.mutate(id)} />
    </div>
  );
}