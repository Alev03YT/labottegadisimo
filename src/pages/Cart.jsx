import React, { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCart = async (currentUser) => {
    if (!currentUser) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "cartItems"),
      where("userId", "==", currentUser.uid)
    );

    const snap = await getDocs(q);
    setCartItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setIsLoading(false);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await loadCart(currentUser);
    });

    return () => unsub();
  }, []);

  const updateQuantity = async (item, newQuantity) => {
    if (newQuantity <= 0) {
      await removeItem(item.id);
      return;
    }

    await updateDoc(doc(db, "cartItems", item.id), {
      quantity: newQuantity,
    });

    await loadCart(user);
  };

  const removeItem = async (id) => {
    await deleteDoc(doc(db, "cartItems", id));
    await loadCart(user);
  };

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
    0
  );

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-bold mb-3">Accedi per vedere il carrello</h1>
        <Link to="/Login">
          <Button className="rounded-full">Accedi / Registrati</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p>Caricamento carrello...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-10">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">
          Il Tuo Carrello
        </span>

        <h1 className="font-heading text-3xl font-bold">
          Carrello ({cartItems.length})
        </h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">Il tuo carrello è vuoto</p>

          <Link to="/Shop">
            <Button variant="outline" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continua lo shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 p-4 rounded-xl bg-card border"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                {item.product_image ? (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium">{item.product_name}</h3>
                <p className="text-sm text-primary font-semibold">
                  €{Number(item.price || 0).toFixed(2)}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-7 h-7 rounded-full"
                    onClick={() => updateQuantity(item, (item.quantity || 1) - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>

                  <span className="text-sm font-medium w-6 text-center">
                    {item.quantity || 1}
                  </span>

                  <Button
                    variant="outline"
                    size="icon"
                    className="w-7 h-7 rounded-full"
                    onClick={() => updateQuantity(item, (item.quantity || 1) + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-semibold">
                  €{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                </p>

                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 text-sm mt-3 inline-flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Rimuovi
                </button>
              </div>
            </div>
          ))}

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold">Totale</span>
              <span className="text-2xl font-bold">
                €{itemsTotal.toFixed(2)}
              </span>
            </div>

            <Button className="w-full rounded-full py-6">
              Procedi all’ordine
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
