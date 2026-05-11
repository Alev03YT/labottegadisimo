import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const categories = [
  "Borsa",
  "Amigurumi",
  "Accessori",
  "Gioielli",
  "Ricamo",
  "Abbigliamento donna",
  "Abbigliamento uomo",
  "Abbigliamento bambino",
  "Schema digitale",
];

const orderStatuses = [
  "Ricevuto",
  "In lavorazione",
  "Spedito",
  "Consegnato",
  "Annullato",
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [colors, setColors] = useState([]);
  const [shipping, setShipping] = useState([]);
  const [payments, setPayments] = useState([]);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "Borsa",
    material: "",
    color: "",
    dimensions: "",
    bagSize: "",
    available: true,
  });

  const [productImage, setProductImage] = useState(null);

  const [colorForm, setColorForm] = useState({
    name: "",
    type: "filato",
  });

  const [colorImage, setColorImage] = useState(null);

  const [shippingForm, setShippingForm] = useState({
    name: "",
    price: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    name: "",
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    await Promise.all([
      loadProducts(),
      loadOrders(),
      loadRequests(),
      loadColors(),
      loadShipping(),
      loadPayments(),
    ]);
  };

  const loadProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const loadOrders = async () => {
    const snap = await getDocs(collection(db, "orders"));
    setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const loadRequests = async () => {
    const snap = await getDocs(collection(db, "contactRequests"));
    setRequests(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const loadColors = async () => {
    const snap = await getDocs(collection(db, "colors"));
    setColors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const loadShipping = async () => {
    const snap = await getDocs(collection(db, "shippingMethods"));
    setShipping(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const loadPayments = async () => {
    const snap = await getDocs(collection(db, "paymentMethods"));
    setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

const addProduct = async () => {
  try {
    if (!product.name || !product.price || !productImage) {
      alert("Inserisci nome, prezzo e foto.");
      return;
    }

    const imageUrl = await new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(productImage);
    });

    await addDoc(collection(db, "products"), {
      ...product,
      price: Number(product.price),
      quantity: Number(product.quantity || 0),
      image_url: imageUrl,
      createdAt: serverTimestamp(),
    });

    setProduct({
      name: "",
      price: "",
      quantity: "",
      category: "Borsa",
      material: "",
      color: "",
      dimensions: "",
      bagSize: "",
      available: true,
    });

    setProductImage(null);

    await loadProducts();

    alert("Prodotto salvato.");
  } catch (err) {
    console.error(err);
    alert("Errore nel salvataggio prodotto.");
  }
};

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    await loadProducts();
  };

  const updateOrderStatus = async (id, status) => {
    await updateDoc(doc(db, "orders", id), { status });
    await loadOrders();
  };

  const addColor = async () => {
  try {
    if (!colorForm.name || !colorImage) {
      alert("Inserisci nome colore e foto.");
      return;
    }

    const imageUrl = await new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(colorImage);
    });

    await addDoc(collection(db, "colors"), {
      ...colorForm,
      image: imageUrl,
      createdAt: serverTimestamp(),
    });

    setColorForm({
      name: "",
      type: "filato",
    });

    setColorImage(null);

    await loadColors();

    alert("Colore salvato.");
  } catch (err) {
    console.error(err);
    alert("Errore nel salvataggio colore.");
  }
};

  const deleteColor = async (id) => {
    await deleteDoc(doc(db, "colors", id));
    await loadColors();
  };

  const addShipping = async () => {
    if (!shippingForm.name || !shippingForm.price) return;

    await addDoc(collection(db, "shippingMethods"), {
      name: shippingForm.name,
      price: Number(shippingForm.price),
    });

    setShippingForm({ name: "", price: "" });
    await loadShipping();
  };

  const deleteShipping = async (id) => {
    await deleteDoc(doc(db, "shippingMethods", id));
    await loadShipping();
  };

  const addPayment = async () => {
    if (!paymentForm.name) return;

    await addDoc(collection(db, "paymentMethods"), {
      name: paymentForm.name,
    });

    setPaymentForm({ name: "" });
    await loadPayments();
  };

  const deletePayment = async (id) => {
    await deleteDoc(doc(db, "paymentMethods", id));
    await loadPayments();
  };

  const menu = [
    ["products", "Prodotti"],
    ["orders", "Ordini"],
    ["requests", "Richieste"],
    ["colors", "Colori"],
    ["settings", "Impostazioni shop"],
  ];

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-white rounded-2xl shadow p-4 h-fit">
          <h1 className="font-bold text-xl mb-4">Admin</h1>

          <div className="space-y-2">
            {menu.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm ${
                  activeTab === key
                    ? "bg-black text-white"
                    : "hover:bg-secondary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        <main>
          {activeTab === "products" && (
            <section className="bg-white rounded-2xl shadow p-5">
              <h2 className="text-xl font-bold mb-4">Prodotti</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <input className="border p-2 rounded" placeholder="Nome prodotto" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Prezzo" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Quantità" value={product.quantity} onChange={(e) => setProduct({ ...product, quantity: e.target.value })} />

                <select className="border p-2 rounded" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })}>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>

                <input className="border p-2 rounded" placeholder="Materiale" value={product.material} onChange={(e) => setProduct({ ...product, material: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Colore" value={product.color} onChange={(e) => setProduct({ ...product, color: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Dimensioni" value={product.dimensions} onChange={(e) => setProduct({ ...product, dimensions: e.target.value })} />
                <input className="border p-2 rounded" placeholder="Misura borsa" value={product.bagSize} onChange={(e) => setProduct({ ...product, bagSize: e.target.value })} />

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={product.available} onChange={(e) => setProduct({ ...product, available: e.target.checked })} />
                  Disponibile
                </label>

                <input type="file" accept="image/*" onChange={(e) => setProductImage(e.target.files[0])} />
              </div>

              <button onClick={addProduct} className="bg-black text-white px-5 py-2 rounded-xl mb-6">
                Aggiungi prodotto
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="border rounded-xl p-3">
                    <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover rounded-xl mb-2" />
                    <h3 className="font-semibold">{p.name}</h3>
                    <p>{p.price}€</p>
                    <p className="text-sm text-muted-foreground">{p.category}</p>
                    <p className="text-sm">{p.available ? "Disponibile" : "Non disponibile"}</p>
                    <button onClick={() => deleteProduct(p.id)} className="text-red-600 text-sm mt-2">
                      Elimina
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "orders" && (
            <section className="bg-white rounded-2xl shadow p-5">
              <h2 className="text-xl font-bold mb-4">Ordini</h2>

              {orders.length === 0 && <p>Nessun ordine ricevuto.</p>}

              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="border rounded-xl p-4">
                    <p><b>Cliente:</b> {o.customerName || "Non indicato"}</p>
                    <p><b>Totale:</b> {o.total || 0}€</p>

                    <select
                      className="border p-2 rounded mt-2"
                      value={o.status || "Ricevuto"}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                    >
                      {orderStatuses.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "requests" && (
            <section className="bg-white rounded-2xl shadow p-5">
              <h2 className="text-xl font-bold mb-4">Richieste / Contatti</h2>

              {requests.length === 0 && <p>Nessuna richiesta ricevuta.</p>}

              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.id} className="border rounded-xl p-4">
                    <p><b>Tipo:</b> {r.requestType}</p>
                    <p><b>Articolo:</b> {r.articleName}</p>
                    <p><b>Colore:</b> {r.color}</p>
                    <p><b>Materiale:</b> {r.material}</p>
                    <p><b>Pelle:</b> {r.leatherType}</p>
                    <p><b>Minuteria:</b> {r.hardwareType}</p>
                    <p><b>Taglia:</b> {r.size}</p>
                    <p><b>Misura:</b> {r.measureCm}</p>
                    <p><b>Messaggio:</b> {r.message}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "colors" && (
            <section className="bg-white rounded-2xl shadow p-5">
              <h2 className="text-xl font-bold mb-4">Colori filato, pelle e minuteria</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <input className="border p-2 rounded" placeholder="Nome colore" value={colorForm.name} onChange={(e) => setColorForm({ ...colorForm, name: e.target.value })} />

                <select
  className="border p-2 rounded"
  value={colorForm.type}
  onChange={(e) => setColorForm({ ...colorForm, type: e.target.value })}
>
  <option value="filato">Colori filato</option>
  <option value="pelle">Pelle</option>
  <option value="minuteria">Minuteria</option>
</select>

                <input type="file" accept="image/*" onChange={(e) => setColorImage(e.target.files[0])} />
              </div>

              <button onClick={addColor} className="bg-black text-white px-5 py-2 rounded-xl mb-6">
                Aggiungi colore
              </button>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {colors.map((c) => (
                  <div key={c.id} className="border rounded-xl p-3">
                    <img src={c.image} alt={c.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                    <p className="font-semibold">{c.name}</p>
                    <p className="text-sm">{c.type}</p>
                    <button onClick={() => deleteColor(c.id)} className="text-red-600 text-sm">
                      Elimina
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "settings" && (
            <section className="bg-white rounded-2xl shadow p-5">
              <h2 className="text-xl font-bold mb-4">Impostazioni shop</h2>

              <div className="mb-8">
                <h3 className="font-semibold mb-2">Spedizioni</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <input className="border p-2 rounded" placeholder="Tipo spedizione" value={shippingForm.name} onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })} />
                  <input className="border p-2 rounded" placeholder="Costo" value={shippingForm.price} onChange={(e) => setShippingForm({ ...shippingForm, price: e.target.value })} />
                  <button onClick={addShipping} className="bg-black text-white rounded-xl">Aggiungi</button>
                </div>

                {shipping.map((s) => (
                  <div key={s.id} className="flex justify-between border-b py-2">
                    <span>{s.name} — {s.price}€</span>
                    <button onClick={() => deleteShipping(s.id)} className="text-red-600">Elimina</button>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Pagamenti</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <input className="border p-2 rounded" placeholder="Metodo pagamento" value={paymentForm.name} onChange={(e) => setPaymentForm({ name: e.target.value })} />
                  <button onClick={addPayment} className="bg-black text-white rounded-xl">Aggiungi</button>
                </div>

                {payments.map((p) => (
                  <div key={p.id} className="flex justify-between border-b py-2">
                    <span>{p.name}</span>
                    <button onClick={() => deletePayment(p.id)} className="text-red-600">Elimina</button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
