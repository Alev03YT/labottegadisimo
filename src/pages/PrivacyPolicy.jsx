import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-8">
        <Link to="/"><Button variant="ghost" size="sm" className="rounded-full mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Torna alla home</Button></Link>
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">Legale</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2 text-sm">Ultimo aggiornamento: aprile 2025</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-foreground">
        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">1. Titolare del Trattamento</h2>
          <p className="text-muted-foreground leading-relaxed">
            Il Titolare del trattamento dei dati personali è <strong>La Bottega di Simo</strong>, contattabile all'indirizzo email <strong>info@labottegadisimo.it</strong> oppure tramite WhatsApp al numero <strong>347-7922931</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">2. Dati Raccolti</h2>
          <p className="text-muted-foreground leading-relaxed">Raccogliamo i seguenti dati personali:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li>Nome e cognome</li>
            <li>Indirizzo email</li>
            <li>Numero di telefono</li>
            <li>Indirizzo di spedizione e/o fatturazione</li>
            <li>Dati relativi agli ordini effettuati</li>
            <li>File e immagini di riferimento allegati volontariamente</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">3. Finalità del Trattamento</h2>
          <p className="text-muted-foreground leading-relaxed">I dati vengono trattati per:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li>Gestire le richieste di informazioni e preventivi</li>
            <li>Processare e gestire gli ordini di acquisto</li>
            <li>Gestire i pagamenti e la fatturazione</li>
            <li>Inviare comunicazioni relative all'ordine (conferme, aggiornamenti spedizione)</li>
            <li>Adempiere agli obblighi di legge</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">4. Base Giuridica</h2>
          <p className="text-muted-foreground leading-relaxed">
            Il trattamento è fondato sul consenso dell'interessato (art. 6, par. 1, lett. a GDPR), sull'esecuzione di un contratto (art. 6, par. 1, lett. b GDPR) e sull'adempimento di obblighi legali (art. 6, par. 1, lett. c GDPR).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">5. Conservazione dei Dati</h2>
          <p className="text-muted-foreground leading-relaxed">
            I dati personali sono conservati per il tempo strettamente necessario alle finalità per cui sono stati raccolti e, successivamente, per il periodo previsto dalla normativa fiscale e contabile (generalmente 10 anni).
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">6. Diritti dell'Interessato</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hai il diritto di accedere ai tuoi dati, rettificarli, cancellarli, limitarne il trattamento, opporti al trattamento e richiedere la portabilità. Per esercitare questi diritti, contattaci a <strong>info@labottegadisimo.it</strong>.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">7. Condivisione dei Dati</h2>
          <p className="text-muted-foreground leading-relaxed">
            I dati non vengono ceduti a terzi, salvo ai fornitori di servizi strettamente necessari all'erogazione del servizio (es. corrieri per la spedizione, piattaforme di pagamento) e agli enti pubblici ove richiesto dalla legge.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">8. Cookie</h2>
          <p className="text-muted-foreground leading-relaxed">
            Il sito utilizza esclusivamente cookie tecnici necessari al funzionamento della piattaforma. Non vengono utilizzati cookie di profilazione o tracciamento di terze parti.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">9. Contatti</h2>
          <p className="text-muted-foreground leading-relaxed">
            Per qualsiasi informazione relativa al trattamento dei tuoi dati, contattaci a <strong>info@labottegadisimo.it</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}