import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingBag } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(data);
    };

    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-heading text-3xl font-bold mb-6">Shop</h1>

      {products.length === 0 ? (
        <p className="text-muted-foreground">Nessun prodotto disponibile.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/ProductDetail/${p.id}`}
              className="border rounded-2xl p-3 block hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-secondary rounded-xl overflow-hidden mb-3">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 opacity-30" />
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-sm">{p.name}</h3>
              <p className="text-sm">{p.price}€</p>

              <p className="text-xs mt-1">
                {p.available ? "Disponibile" : "Non disponibile"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
