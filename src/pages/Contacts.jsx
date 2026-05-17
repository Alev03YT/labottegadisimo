import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, Send } from "lucide-react";

const EMPTY = {
  requestType: "Informazioni",
  articleName: "",
  name: "",
  email: "",
  phone: "",
  threadColor: "",
  material: "",
  leatherType: "",
  hardwareType: "",
  size: "",
  measureCm: "",
  leatherColor: "",
  message: "",
};

export default function Contacts() {
  const urlParams = new URLSearchParams(window.location.search);
  const productFromUrl = urlParams.get("product") || "";

  const [form, setForm] = useState({
    ...EMPTY,
    articleName: productFromUrl,
    requestType: productFromUrl ? "Preventivo" : "Informazioni",
  });

  const [colors, setColors] = useState([]);
  const [sending, setSending] = useState(false);

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

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.requestType) {
      alert("Compila nome, email e tipo richiesta.");
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
        requestType: "Informazioni",
      });
    } catch (err) {
      console.error(err);
      alert("Errore durante l'invio della richiesta.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">
          Scrivici
        </span>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Contatti
        </h1>

        <p className="text-muted-foreground mt-2 text-sm">
          Hai una domanda o vuoi un preventivo? Compila il modulo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-5">
            <h3 className="font-heading text-lg font-semibold">Contattaci</h3>

            <a
              href="mailto:info@labottegadisimo.it"
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <span>info@labottegadisimo.it</span>
            </a>

            <a
              href="https://wa.me/393477922931"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <span>347-7922931 (WhatsApp)</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-6 md:p-8 space-y-5">
          <h3 className="font-heading text-lg font-semibold">
            Informazioni / Preventivo
          </h3>

          <div>
            <label className="text-sm font-medium">Tipo richiesta *</label>
            <select
              className="border rounded-xl p-3 w-full mt-1"
              value={form.requestType}
              onChange={set("requestType")}
            >
              <option value="Informazioni">Informazioni</option>
              <option value="Preventivo">Preventivo</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Articolo di riferimento</label>
            <input
              className="border rounded-xl p-3 w-full mt-1"
              value={form.articleName}
              onChange={set("articleName")}
              placeholder="Nome articolo"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome *</label>
              <input
                className="border rounded-xl p-3 w-full mt-1"
                value={form.name}
                onChange={set("name")}
                placeholder="Il tuo nome"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email *</label>
              <input
                className="border rounded-xl p-3 w-full mt-1"
                type="email"
                value={form.email}
                onChange={set("email")}
                placeholder="email@esempio.it"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Telefono</label>
              <input
                className="border rounded-xl p-3 w-full mt-1"
                value={form.phone}
                onChange={set("phone")}
                placeholder="333 1234567"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Taglia</label>
              <input
                className="border rounded-xl p-3 w-full mt-1"
                value={form.size}
                onChange={set("size")}
                placeholder="S / M / L / XL..."
              />
            </div>

            <div>
              <label className="text-sm font-medium">Misura in cm</label>
              <input
                className="border rounded-xl p-3 w-full mt-1"
                value={form.measureCm}
                onChange={set("measureCm")}
                placeholder="es. 30 x 20 cm"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Materiale</label>
              <input
                className="border rounded-xl p-3 w-full mt-1"
                value={form.material}
                onChange={set("material")}
                placeholder="Cotone, lana, pelle..."
              />
            </div>

            <div>
              <label className="text-sm font-medium">Colore filato</label>
              <select
                className="border rounded-xl p-3 w-full mt-1"
                value={form.threadColor}
                onChange={set("threadColor")}
              >
                <option value="">Seleziona colore</option>
                {threadColors.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Tipo pelle</label>
              <input
                className="border rounded-xl p-3 w-full mt-1"
                value={form.leatherType}
                onChange={set("leatherType")}
                placeholder="Pelle, ecopelle..."
              />
            </div>

            <div>
              <label className="text-sm font-medium">Colore pelle</label>
              <select
                className="border rounded-xl p-3 w-full mt-1"
                value={form.leatherColor}
                onChange={set("leatherColor")}
              >
                <option value="">Seleziona colore pelle</option>
                {leatherColors.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Tipo minuteria</label>
              <select
                className="border rounded-xl p-3 w-full mt-1"
                value={form.hardwareType}
                onChange={set("hardwareType")}
              >
                <option value="">Seleziona minuteria</option>
                {hardwareColors.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Messaggio</label>
            <textarea
              className="border rounded-xl p-3 w-full mt-1"
              rows={4}
              value={form.message}
              onChange={set("message")}
              placeholder="Descrivi la tua richiesta..."
            />
          </div>

          <Button
            className="w-full rounded-full bg-primary hover:bg-primary/90 py-5"
            onClick={handleSubmit}
            disabled={sending}
          >
            <Send className="w-4 h-4 mr-2" />
            {sending ? "Invio in corso..." : "Invia richiesta"}
          </Button>
        </div>
      </div>
    </div>
  );
}
