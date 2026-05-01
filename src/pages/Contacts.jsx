const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MessageCircle, Upload, Loader2, Send } from 'lucide-react';

const EMPTY = {
  tipo: '',
  articolo: '',
  nome: '',
  email: '',
  telefono: '',
  dimensioni: '',
  colore_materiale: '',
  taglia: '',
  elemento: '',
  colore_pelle: '',
  colore_minuteria: '',
  messaggio: '',
  file_url: '',
};

function OptionsSelect({ type, options, value, onChange, placeholder }) {
  const filtered = options.filter(o => o.type === type && o.active !== false);
  if (filtered.length === 0) return null;
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
      <SelectContent>
        {filtered.map(o => <SelectItem key={o.id} value={o.value}>{o.value}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

export default function Contacts() {
  const urlParams = new URLSearchParams(window.location.search);
  const productFromUrl = urlParams.get('product') || '';
  const tipoFromUrl = urlParams.get('tipo') || '';
  const [form, setForm] = useState({ ...EMPTY, articolo: productFromUrl, tipo: tipoFromUrl });
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { data: options = [] } = useQuery({
    queryKey: ['contactFormOptions'],
    queryFn: () => db.entities.ContactFormOption.list(),
    initialData: [],
  });

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: typeof val === 'string' ? val : val.target.value }));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, file_url }));
    setUploading(false);
    toast.success('File caricato!');
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.email || !form.tipo) {
      toast.error('Compila i campi obbligatori (Nome, Email, Tipo richiesta)');
      return;
    }
    if (!acceptedPrivacy || !acceptedTerms) {
      toast.error('Devi accettare la Privacy Policy e i Termini e Condizioni');
      return;
    }
    setSending(true);

    try {
      const rows = [
        `Tipo richiesta: ${form.tipo}`,
        form.articolo && `Articolo: ${form.articolo}`,
        `Nome: ${form.nome}`,
        `Email: ${form.email}`,
        form.telefono && `Telefono: ${form.telefono}`,
        form.dimensioni && `Dimensioni: ${form.dimensioni}`,
        form.colore_materiale && `Colore Materiale: ${form.colore_materiale}`,
        form.taglia && `Taglia: ${form.taglia}`,
        form.elemento && `Elemento: ${form.elemento}`,
        form.colore_pelle && `Colore Pelle: ${form.colore_pelle}`,
        form.colore_minuteria && `Colore Minuteria: ${form.colore_minuteria}`,
        form.messaggio && `Messaggio: ${form.messaggio}`,
        form.file_url && `File allegato: <a href="${form.file_url}">Scarica</a>`,
      ].filter(Boolean).join('<br/>');

      // Email a info@labottegadisimo.it
      await db.integrations.Core.SendEmail({
        from_name: 'La Bottega di Simo – Sito Web',
        to: 'info@labottegadisimo.it',
        subject: `[${form.tipo}] da ${form.nome}`,
        body: `<h2>Nuova richiesta dal sito</h2><p>${rows}</p>`,
      });

      // Risposta automatica personalizzata al cliente
      const autoReplyBody = form.tipo === 'Preventivo'
        ? `<h2>Ciao ${form.nome}! 💕</h2>
<p>Grazie per averci contattato! Abbiamo ricevuto la tua richiesta di <strong>preventivo</strong>${form.articolo ? ` per <em>${form.articolo}</em>` : ''}.</p>
<p>Il nostro team valuterà i dettagli della tua richiesta e ti risponderà entro <strong>2–3 giorni lavorativi</strong> con un preventivo personalizzato.</p>
<p>Nel frattempo, puoi esplorare il nostro catalogo sul sito o scriverci su WhatsApp al <strong>347-7922931</strong> per qualsiasi domanda urgente.</p>
<br/><p>A presto! 🧶</p><p><strong>– La Bottega di Simo</strong></p>`
        : `<h2>Ciao ${form.nome}! 💕</h2>
<p>Grazie per averci scritto! Abbiamo ricevuto la tua <strong>richiesta di informazioni</strong>${form.articolo ? ` riguardo a <em>${form.articolo}</em>` : ''}.</p>
<p>Ti risponderemo il prima possibile, solitamente entro <strong>24–48 ore</strong>.</p>
<p>Nel frattempo puoi visitare il nostro negozio online o contattarci su WhatsApp al <strong>347-7922931</strong>.</p>
<br/><p>A presto! 🧶</p><p><strong>– La Bottega di Simo</strong></p>`;

      await db.integrations.Core.SendEmail({
        from_name: 'La Bottega di Simo',
        to: form.email,
        subject: form.tipo === 'Preventivo'
          ? '✅ Richiesta preventivo ricevuta – La Bottega di Simo'
          : '✅ Abbiamo ricevuto la tua richiesta – La Bottega di Simo',
        body: autoReplyBody,
      });

      toast.success('Messaggio inviato! Controlla la tua email 💕');
      setForm(EMPTY);
      setAcceptedPrivacy(false);
      setAcceptedTerms(false);
    } catch (err) {
      toast.error('Errore durante l\'invio. Riprova o scrivici su WhatsApp.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">Scrivici</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Contatti</h1>
        <p className="text-muted-foreground mt-2 text-sm">Hai una domanda o vuoi un preventivo? Siamo qui!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contatti diretti */}
        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-5">
            <h3 className="font-heading text-lg font-semibold">Contattaci</h3>
            <a href="mailto:info@labottegadisimo.it" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <span>info@labottegadisimo.it</span>
            </a>
            <a href="https://wa.me/393477922931" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <span>347-7922931 (WhatsApp)</span>
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-5">
          <h3 className="font-heading text-lg font-semibold">Informazioni / Preventivo</h3>

          <div className="space-y-1.5">
            <Label>Tipo di richiesta *</Label>
            <Select value={form.tipo} onValueChange={set('tipo')}>
              <SelectTrigger><SelectValue placeholder="Seleziona..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Informazioni">Informazioni</SelectItem>
                <SelectItem value="Preventivo">Preventivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {productFromUrl && (
            <div className="space-y-1.5">
              <Label>Articolo di riferimento</Label>
              <Input value={form.articolo} onChange={set('articolo')} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nome *</Label>
              <Input value={form.nome} onChange={set('nome')} placeholder="Il tuo nome" />
            </div>
            <div className="space-y-1.5">
              <Label>Email *</Label>
              <Input type="email" value={form.email} onChange={set('email')} placeholder="email@esempio.it" />
            </div>
            <div className="space-y-1.5">
              <Label>Telefono</Label>
              <Input type="tel" value={form.telefono} onChange={set('telefono')} placeholder="333 1234567" />
            </div>
            <div className="space-y-1.5">
              <Label>Dimensioni (larghezza × altezza × profondità)</Label>
              <Input value={form.dimensioni} onChange={set('dimensioni')} placeholder="es. 30×20×10 cm" />
            </div>
          </div>

          {/* Opzioni dinamiche da admin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {options.some(o => o.type === 'colore_materiale' && o.active !== false) && (
              <div className="space-y-1.5">
                <Label>Colore Materiale</Label>
                <OptionsSelect type="colore_materiale" options={options} value={form.colore_materiale} onChange={set('colore_materiale')} placeholder="Seleziona colore..." />
              </div>
            )}
            {options.some(o => o.type === 'taglia' && o.active !== false) && (
              <div className="space-y-1.5">
                <Label>Taglia</Label>
                <OptionsSelect type="taglia" options={options} value={form.taglia} onChange={set('taglia')} placeholder="Seleziona taglia..." />
              </div>
            )}
            {options.some(o => o.type === 'elemento' && o.active !== false) && (
              <div className="space-y-1.5">
                <Label>Elementi (Pelle/Ecopelle)</Label>
                <OptionsSelect type="elemento" options={options} value={form.elemento} onChange={set('elemento')} placeholder="Seleziona elemento..." />
              </div>
            )}
            {options.some(o => o.type === 'colore_pelle' && o.active !== false) && (
              <div className="space-y-1.5">
                <Label>Colore Pelle</Label>
                <OptionsSelect type="colore_pelle" options={options} value={form.colore_pelle} onChange={set('colore_pelle')} placeholder="Seleziona colore pelle..." />
              </div>
            )}
            {options.some(o => o.type === 'colore_minuteria' && o.active !== false) && (
              <div className="space-y-1.5">
                <Label>Colore Minuteria</Label>
                <OptionsSelect type="colore_minuteria" options={options} value={form.colore_minuteria} onChange={set('colore_minuteria')} placeholder="Seleziona colore minuteria..." />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Messaggio</Label>
            <Textarea value={form.messaggio} onChange={set('messaggio')} placeholder="Descrivi la tua richiesta..." rows={3} />
          </div>

          <div className="space-y-1.5">
            <Label>Allega un file (foto di riferimento, schema...)</Label>
            <label className="cursor-pointer inline-block">
              <input type="file" className="hidden" onChange={handleUpload} />
              <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 transition-colors">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Caricamento...' : form.file_url ? '✓ File caricato' : 'Scegli file'}
              </div>
            </label>
          </div>

          {/* Privacy e Termini */}
          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} className="mt-0.5 rounded" />
              <span className="text-xs text-muted-foreground">
                Ho letto e accetto la{' '}
                <a href="/PrivacyPolicy" target="_blank" className="text-primary underline">Privacy Policy</a> *
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 rounded" />
              <span className="text-xs text-muted-foreground">
                Ho letto e accetto i{' '}
                <a href="/TerminiCondizioni" target="_blank" className="text-primary underline">Termini e Condizioni di Vendita</a> *
              </span>
            </label>
          </div>

          <Button
            className="w-full rounded-full bg-primary hover:bg-primary/90 py-5"
            onClick={handleSubmit}
            disabled={sending || !acceptedPrivacy || !acceptedTerms}
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            {sending ? 'Invio in corso...' : 'Invia Messaggio'}
          </Button>
        </div>
      </div>
    </div>
  );
}