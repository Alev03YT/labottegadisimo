import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Send, Upload } from "lucide-react";

const EMPTY = {
  requestType: "",
  articleName: "",
  name: "",
  email: "",
  phone: "",
  measureType: "",
  measureCm: "",
  threadColor: "",
  material: "",
  size: "",
  leatherType: "",
  leatherColor: "",
  hardwareType: "",
  message: "",
  fileName: "",
};

export default function Contacts() {
  const urlParams = new URLSearchParams(window.location.search);
  const productFromUrl = urlParams.get("product") || "";

  const [form, setForm] = useState({
    ...EMPTY,
    articleName: productFromUrl,
    requestType: productFromUrl ? "Preventivo" : "",
  });

  const [colors, setColors] = useState([]);
  const [sending, setSending] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      const snap = await getDocs(collection(db, "colors"));
      setColors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    loadOptions();
  }, []);

  const threadColors = colors.filter((c) => c.type === "filato");
  const leatherColors = colors.filter((c) => c.type === "pelle");
  const hardwareColors = colors.filter((c) => c.type === "minuteria");

  const set = (field) => (e) => {
    setForm((f) => ({
      ...f,
      [field]: e.target.value,
    }));
  };

  const fieldClass =
    "w-full mt-2 rounded-2xl border border-border/70 bg-white px-4 py-4 text-base outline-none shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20";

  const labelClass = "text-base font-semibold text-foreground";

  const handleSubmit = async () => {
    if (!form.requestType || !form.name || !form.email) {
      alert("Compila tipo richiesta, nome ed email.");
      return;
    }

    if (!acceptedPrivacy || !acceptedTerms) {
      alert("Devi accettare Privacy Policy e Termini e Condizioni.");
      return;
    }

    try {
      setSending(true);

      await addDoc(collection(db, "contactRequests"), {
        ...form,
        createdAt: serverTimestamp(),
        status: "Nuova",
      });

      alert("Richiesta inviata correttamente!");

      setForm({
        ...EMPTY,
        articleName: "",
        requestType: "",
      });
      setAcceptedPrivacy(false);
      setAcceptedTerms(false);
    } catch (err) {
      console.error(err);
      alert("Errore durante l'invio della richiesta.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-[#fbf7f5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="mb-10">
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-primary mb-4 block">
            SCRIVICI
          </span>

          <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground mb-4">
            Contatti
          </h1>

          <p className="text-muted-foreground text-xl leading-relaxed">
            Hai una domanda o vuoi un preventivo? Siamo qui!
          </p>
        </div>

        <div className="space-y-10">
          <div className="bg-white border border-border/50 rounded-[2rem] p-7 md:p-10 shadow-sm">
            <h3 className="font-heading text-3xl font-bold mb-8">
              Contattaci
            </h3>

            <div className="space-y-6">
              <a
                href="mailto:info@labottegadisimo.it"
                className="flex items-center gap-5 text-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <span>info@labottegadisimo.it</span>
              </a>

              <a
                href="https://wa.me/393477922931"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 text-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <span>347-7922931 (WhatsApp)</span>
              </a>
            </div>
          </div>

          <div className="bg-white border border-border/50 rounded-[2rem] p-7 md:p-10 shadow-sm">
            <h3 className="font-heading text-3xl font-bold mb-8">
              Informazioni / Preventivo
            </h3>

            <div className="space-y-7">
              <div>
                <label className={labelClass}>Tipo di richiesta *</label>
                <select
                  className={fieldClass}
                  value={form.requestType}
                  onChange={set("requestType")}
                >
                  <option value="">Seleziona...</option>
                  <option value="Informazioni">Informazioni</option>
                  <option value="Preventivo">Preventivo</option>
                </select>
              </div>

              {form.articleName && (
                <div>
                  <label className={labelClass}>Articolo di riferimento</label>
                  <input
                    className={fieldClass}
                    value={form.articleName}
                    onChange={set("articleName")}
                    placeholder="Nome articolo"
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>Nome *</label>
                <input
                  className={fieldClass}
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Il tuo nome"
                />
              </div>

              <div>
                <label className={labelClass}>Email *</label>
                <input
                  className={fieldClass}
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="email@esempio.it"
                />
              </div>

              <div>
                <label className={labelClass}>Telefono</label>
                <input
                  className={fieldClass}
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="333 1234567"
                />
              </div>

              <div>
                <label className={labelClass}>Tipo di misura</label>
                <select
                  className={fieldClass}
                  value={form.measureType}
                  onChange={set("measureType")}
                >
                  <option value="">Seleziona tipo...</option>
                  <option value="Larghezza">Larghezza</option>
                  <option value="Altezza">Altezza</option>
                  <option value="Profondità">Profondità</option>
                  <option value="Circonferenza">Circonferenza</option>
                  <option value="Personalizzata">Personalizzata</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Misure</label>
                <input
                  className={fieldClass}
                  value={form.measureCm}
                  onChange={set("measureCm")}
                  placeholder="Inserisci le misure..."
                />
              </div>

              <div>
                <label className={labelClass}>Colore Materiale</label>
                <select
                  className={fieldClass}
                  value={form.threadColor}
                  onChange={set("threadColor")}
                >
                  <option value="">Seleziona colore...</option>
                  {threadColors.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Taglia</label>
                <select
                  className={fieldClass}
                  value={form.size}
                  onChange={set("size")}
                >
                  <option value="">Seleziona taglia...</option>
                  <option value="Neonato">Neonato</option>
                  <option value="Bambino">Bambino</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="Su misura">Su misura</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Elementi (Pelle/Ecopelle)</label>
                <select
                  className={fieldClass}
                  value={form.leatherType}
                  onChange={set("leatherType")}
                >
                  <option value="">Seleziona elemento...</option>
                  <option value="Pelle">Pelle</option>
                  <option value="Ecopelle">Ecopelle</option>
                  <option value="Nessuno">Nessuno</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Colore Pelle</label>
                <select
                  className={fieldClass}
                  value={form.leatherColor}
                  onChange={set("leatherColor")}
                >
                  <option value="">Seleziona colore pelle...</option>
                  {leatherColors.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Colore Minuteria</label>
                <select
                  className={fieldClass}
                  value={form.hardwareType}
                  onChange={set("hardwareType")}
                >
                  <option value="">Seleziona colore minuteria...</option>
                  {hardwareColors.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Messaggio</label>
                <textarea
                  className={`${fieldClass} min-h-[140px] resize-none`}
                  rows={4}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Descrivi la tua richiesta..."
                />
              </div>

              <div>
                <label className={labelClass}>
                  Allega un file (foto di riferimento, schema...)
                </label>

                <label className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-border/70 bg-white px-5 py-3 text-muted-foreground shadow-sm cursor-pointer hover:bg-secondary/40">
                  <Upload className="w-5 h-5" />
                  <span>{form.fileName || "Scegli file"}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setForm((f) => ({ ...f, fileName: file.name }));
                    }}
                  />
                </label>
              </div>

              <div className="space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <span>
                    Ho letto e accetto la{" "}
                    <a href="#/PrivacyPolicy" className="text-primary underline">
                      Privacy Policy
                    </a>{" "}
                    *
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-5 h-5"
                  />
                  <span>
                    Ho letto e accetto i{" "}
                    <a href="#/TerminiCondizioni" className="text-primary underline">
                      Termini e Condizioni di Vendita
                    </a>{" "}
                    *
                  </span>
                </label>
              </div>

              <Button
                className="w-full rounded-full bg-primary hover:bg-primary/90 py-7 text-lg shadow-md"
                onClick={handleSubmit}
                disabled={sending || !acceptedPrivacy || !acceptedTerms}
              >
                <Send className="w-5 h-5 mr-3" />
                {sending ? "Invio in corso..." : "Invia Messaggio"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
