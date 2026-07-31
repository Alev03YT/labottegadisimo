import React, { useEffect, useMemo, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";

const normalizeText = (value) => String(value || "").trim();

const productKey = (item) => {
  const id = normalizeText(item.product_id || item.id);
  if (id) return `id:${id}`;

  const name = normalizeText(item.product_name || item.name).toLowerCase();
  return name ? `name:${name}` : "";
};

const toRecoveredProduct = (item, source) => {
  const name = normalizeText(item.product_name || item.name);
  const image = normalizeText(
    item.product_image || item.image_url || item.image
  );
  const priceValue = item.price === "" || item.price == null
    ? null
    : Number(item.price);

  return {
    originalId: normalizeText(item.product_id || item.id),
    name,
    image_url: image,
    price: Number.isFinite(priceValue) ? priceValue : null,
    quantity: Number(item.quantity || 1),
    category: normalizeText(item.category) || "Accessori",
    material: normalizeText(item.material),
    color: normalizeText(item.color),
    dimensions: normalizeText(item.dimensions),
    bagSize: normalizeText(item.bagSize),
    available: true,
    recoveredFrom: source,
  };
};

export default function RecoverProducts() {
  const [loading, setLoading] = useState(true);
  const [recovering, setRecovering] = useState(false);
  const [existingProducts, setExistingProducts] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const scanSources = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const [productsSnap, ordersSnap, cartSnap] = await Promise.all([
        getDocs(collection(db, "products")),
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "cartItems")),
      ]);

      const existing = productsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      const found = [];

      ordersSnap.docs.forEach((orderDoc) => {
        const order = orderDoc.data();
        const items = Array.isArray(order.items) ? order.items : [];
        items.forEach((item) => {
          found.push(toRecoveredProduct(item, `ordine ${order.orderNumber || orderDoc.id}`));
        });
      });

      cartSnap.docs.forEach((cartDoc) => {
        found.push(toRecoveredProduct(cartDoc.data(), "carrello"));
      });

      try {
        const localFavorites = JSON.parse(
          localStorage.getItem("favorites") || "[]"
        );
        if (Array.isArray(localFavorites)) {
          localFavorites.forEach((item) => {
            found.push(toRecoveredProduct(item, "preferiti del dispositivo"));
          });
        }
      } catch {
        // Ignora preferiti locali non leggibili.
      }

      const existingKeys = new Set(
        existing
          .map((item) => productKey(item))
          .filter(Boolean)
      );

      const unique = new Map();

      found.forEach((item) => {
        if (!item.name) return;

        const key = productKey({
          id: item.originalId,
          name: item.name,
        });

        if (!key || existingKeys.has(key)) return;

        const current = unique.get(key);
        if (!current || (!current.image_url && item.image_url)) {
          unique.set(key, item);
        }
      });

      setExistingProducts(existing);
      setCandidates([...unique.values()]);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Errore durante la ricerca dei prodotti recuperabili.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scanSources();
  }, []);

  const withImage = useMemo(
    () => candidates.filter((item) => item.image_url).length,
    [candidates]
  );

  const recover = async () => {
    if (candidates.length === 0) return;

    if (!window.confirm(
      `Ricreare ${candidates.length} prodotti trovati? I prodotti già presenti non verranno modificati.`
    )) {
      return;
    }

    setRecovering(true);
    setError("");
    setMessage("");

    try {
      let restored = 0;

      for (const item of candidates) {
        const safeId = item.originalId || `recovered-${Date.now()}-${restored}`;

        await setDoc(
          doc(db, "products", safeId),
          {
            name: item.name,
            image_url: item.image_url,
            price: item.price,
            quantity: item.quantity,
            category: item.category,
            material: item.material,
            color: item.color,
            dimensions: item.dimensions,
            bagSize: item.bagSize,
            available: item.available,
            recoveredFrom: item.recoveredFrom,
            recoveredAt: serverTimestamp(),
            createdAt: serverTimestamp(),
          },
          { merge: true }
        );

        restored += 1;
      }

      setMessage(`${restored} prodotti recuperati e ricreati in Firestore.`);
      await scanSources();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Errore durante il recupero dei prodotti.");
    } finally {
      setRecovering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-3xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold mb-3">Recupero prodotti</h1>
        <p className="text-muted-foreground mb-6">
          Questa pagina cerca i prodotti rimasti negli ordini, nei carrelli e nei preferiti del dispositivo. Non elimina e non modifica i prodotti già presenti.
        </p>

        {loading ? (
          <p>Ricerca in corso...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="border rounded-2xl p-4">
                <p className="text-sm text-muted-foreground">Già presenti</p>
                <p className="text-2xl font-bold">{existingProducts.length}</p>
              </div>
              <div className="border rounded-2xl p-4">
                <p className="text-sm text-muted-foreground">Recuperabili</p>
                <p className="text-2xl font-bold">{candidates.length}</p>
              </div>
              <div className="border rounded-2xl p-4">
                <p className="text-sm text-muted-foreground">Con fotografia</p>
                <p className="text-2xl font-bold">{withImage}</p>
              </div>
            </div>

            {candidates.length > 0 && (
              <div className="space-y-3 mb-6 max-h-[420px] overflow-y-auto">
                {candidates.map((item, index) => (
                  <div key={`${productKey({ id: item.originalId, name: item.name })}-${index}`} className="border rounded-2xl p-3 flex gap-3">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl border"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                        No foto
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm">{item.price != null ? `${item.price}€` : "Prezzo non trovato"}</p>
                      <p className="text-xs text-muted-foreground">Da: {item.recoveredFrom}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {message && (
              <div className="mb-4 rounded-xl border border-green-300 bg-green-50 p-3 text-green-800">
                {message}
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-red-800 whitespace-pre-wrap">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={recover}
                disabled={recovering || candidates.length === 0}
                className="rounded-full"
              >
                {recovering ? "Recupero in corso..." : `Recupera ${candidates.length} prodotti`}
              </Button>

              <Button
                variant="outline"
                onClick={scanSources}
                disabled={recovering}
                className="rounded-full"
              >
                Ripeti ricerca
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
