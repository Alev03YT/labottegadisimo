import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

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
    <div className="p-6 grid grid-cols-2 gap-4">
      {products.map(p => (
        <div key={p.id} className="border p-2">
          <img src={p.image} className="w-full h-40 object-cover" />
          <h3>{p.name}</h3>
          <p>{p.price}€</p>
        </div>
      ))}
    </div>
  );
}
