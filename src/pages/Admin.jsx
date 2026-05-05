import React, { useState } from 'react';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const addProduct = () => {
    if (!name || !price || !image) return;

    setProducts([...products, { name, price, image }]);

    setName('');
    setPrice('');
    setImage('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Pannello Admin</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">Aggiungi prodotto</h2>

        <input
          placeholder="Nome prodotto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input
          placeholder="Prezzo"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full mb-2"
        />

        <input type="file" onChange={handleImage} className="mb-2" />

        <button onClick={addProduct} className="bg-black text-white px-4 py-2">
          Aggiungi
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {products.map((p, i) => (
          <div key={i} className="border p-2">
            <img src={p.image} className="w-full h-40 object-cover" />
            <h3>{p.name}</h3>
            <p>{p.price}€</p>
          </div>
        ))}
      </div>

    </div>
  );
}
