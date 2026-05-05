import React, { useState } from 'react';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Admin() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);

  const addProduct = async () => {
    if (!name || !price || !file) return;

    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      await addDoc(collection(db, "products"), {
        name,
        price,
        image: imageUrl,
        createdAt: new Date()
      });

      alert("Prodotto aggiunto!");
      setName('');
      setPrice('');
      setFile(null);

    } catch (err) {
      console.error(err);
      alert("Errore!");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Admin</h1>

      <input
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        placeholder="Prezzo"
        value={price}
        onChange={e => setPrice(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input type="file" onChange={e => setFile(e.target.files[0])} />

      <button onClick={addProduct} className="bg-black text-white px-4 py-2 mt-3">
        Aggiungi prodotto
      </button>
    </div>
  );
}
