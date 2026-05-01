import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TerminiCondizioni() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-8">
        <Link to="/"><Button variant="ghost" size="sm" className="rounded-full mb-4"><ArrowLeft className="w-4 h-4 mr-2" />Torna alla home</Button></Link>
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">Legale</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Termini e Condizioni di Vendita</h1>
        <p className="text-muted-foreground mt-2 text-sm">Ultimo aggiornamento: aprile 2025</p>
      </div>

      <div className="prose prose-sm max-w-none space-y-6 text-foreground">
        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">1. Informazioni Generali</h2>
          <p className="text-muted-foreground leading-relaxed">
            I presenti Termini e Condizioni regolano l'acquisto di prodotti artigianali handmade tramite il sito <strong>La Bottega di Simo</strong>. Effettuando un ordine o inviando una richiesta di preventivo, l'utente accetta integralmente i presenti termini.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">2. Prodotti Artigianali</h2>
          <p className="text-muted-foreground leading-relaxed">
            Tutti i prodotti sono realizzati a mano con cura e dedizione. In quanto artigianali, ogni pezzo è unico e possono presentare lievi variazioni rispetto alle foto, che ne attestano l'autenticità. I prodotti digitali (schemi) sono file scaricabili non rimborsabili una volta consegnati.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">3. Prezzi e Pagamenti</h2>
          <p className="text-muted-foreground leading-relaxed">
            Tutti i prezzi sono espressi in Euro (€) e sono comprensivi di IVA ove applicabile. I costi di spedizione vengono indicati al momento dell'ordine. I pagamenti sono accettati tramite PayPal, Carta di Credito/Debito, Bonifico Bancario, Klarna e Scalapay.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-2">
            In caso di bonifico bancario, l'ordine viene elaborato solo dopo la ricezione del pagamento. Per tutti gli altri metodi, l'ordine viene elaborato immediatamente.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">4. Spedizioni</h2>
          <p className="text-muted-foreground leading-relaxed">
            Le spedizioni vengono effettuate tramite i corrieri selezionati (Corriere Espresso, Poste Italiane, Fermo Deposito). I tempi di consegna indicativi sono:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li><strong>Corriere Espresso:</strong> 24-48 ore lavorative</li>
            <li><strong>Poste Italiane:</strong> 3-5 giorni lavorativi</li>
            <li><strong>Fermo Deposito Corriere:</strong> 2-4 giorni lavorativi (ritiro presso punto di deposito)</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-2">
            I tempi di produzione per articoli personalizzati o su ordinazione vengono comunicati al momento della conferma dell'ordine.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">5. Resi e Rimborsi</h2>
          <p className="text-muted-foreground leading-relaxed">
            Il cliente ha diritto di recesso entro 14 giorni dalla ricezione del prodotto, ai sensi del D.Lgs. 206/2005 (Codice del Consumo). I prodotti personalizzati o realizzati su misura sono esclusi dal diritto di recesso. I prodotti digitali (schemi) non sono rimborsabili.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-2">
            Per avviare un reso, contattare info@labottegadisimo.it. Le spese di restituzione sono a carico del cliente, salvo difetti del prodotto.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">6. Preventivi e Ordini su Misura</h2>
          <p className="text-muted-foreground leading-relaxed">
            I preventivi sono validi per 30 giorni dalla data di emissione. L'accettazione del preventivo e il pagamento dell'acconto (se previsto) costituiscono accettazione dell'ordine. I tempi di realizzazione variano in base alla complessità del prodotto e verranno comunicati al momento della conferma.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">7. Limitazione di Responsabilità</h2>
          <p className="text-muted-foreground leading-relaxed">
            La Bottega di Simo non è responsabile per ritardi nelle consegne causati da eventi al di fuori del proprio controllo (forza maggiore, scioperi, condizioni meteo avverse, ecc.). In caso di prodotto danneggiato durante il trasporto, il cliente deve segnalarlo entro 48 ore dalla ricezione.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">8. Legge Applicabile</h2>
          <p className="text-muted-foreground leading-relaxed">
            I presenti Termini e Condizioni sono regolati dalla legge italiana. Per qualsiasi controversia sarà competente il foro del domicilio del consumatore, ai sensi della normativa vigente.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold mb-3">9. Contatti</h2>
          <p className="text-muted-foreground leading-relaxed">
            Per qualsiasi informazione: <strong>info@labottegadisimo.it</strong> — WhatsApp: <strong>347-7922931</strong>
          </p>
        </section>
      </div>
    </div>
  );
}