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
  "Abbigliamento - Donna",
  "Abbigliamento - Uomo",
  "Abbigliamento - Bambino",
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
  const [activeColorType, setActiveColorType] = useState("filato");
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
  const [editingProductId, setEditingProductId] = useState(null);
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

  const data = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  data.sort((a, b) => {
    const orderA = a.order ?? 999999;
    const orderB = b.order ?? 999999;
    return orderA - orderB;
  });

  setColors(data);
};
  const loadShipping = async () => {
    const snap = await getDocs(collection(db, "shippingMethods"));
    setShipping(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const loadPayments = async () => {
    const snap = await getDocs(collection(db, "paymentMethods"));
    setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

const resizeImage = (file, maxWidth = 900, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxWidth / img.width, 1);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.onerror = reject;
      img.src = event.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
  
const addProduct = async () => {
  try {
    if (!product.name || !productImage) {
  alert("Inserisci nome e foto.");
  return;
}

if (product.available && !product.price) {
  alert("Per i prodotti in pronta consegna inserisci anche il prezzo.");
  return;
}

    const imageUrl = await resizeImage(productImage, 900, 0.7);

    await addDoc(collection(db, "products"), {
      ...product,
      price: product.price ? Number(product.price) : null,
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

const startEditProduct = (p) => {
  setEditingProductId(p.id);

  setProduct({
    name: p.name || "",
    price: p.price || "",
    quantity: p.quantity || "",
    category: p.category || "Borsa",
    material: p.material || "",
    color: p.color || "",
    dimensions: p.dimensions || "",
    bagSize: p.bagSize || "",
    available: p.available === true || p.available === "true",
    image_url: p.image_url || "",
  });

  setProductImage(null);

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const saveProductChanges = async () => {
  try {
    if (!editingProductId) return;

    if (!product.name) {
  alert("Inserisci il nome.");
  return;
}

if (product.available && !product.price) {
  alert("Per i prodotti in pronta consegna inserisci anche il prezzo.");
  return;
}

    let imageUrl = product.image_url || "";

    if (productImage) {
      imageUrl = await resizeImage(productImage, 900, 0.7);
    }

    await updateDoc(doc(db, "products", editingProductId), {
      name: product.name,
      price: product.price ? Number(product.price) : null,
      quantity: Number(product.quantity || 0),
      category: product.category,
      material: product.material,
      color: product.color,
      dimensions: product.dimensions,
      bagSize: product.bagSize,
      available: product.available,
      image_url: imageUrl,
    });

    setEditingProductId(null);

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
      image_url: "",
    });

    setProductImage(null);

    await loadProducts();

    alert("Prodotto modificato.");
  } catch (err) {
    console.error(err);
    alert("Errore nella modifica prodotto.");
  }
};

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
    await loadProducts();
  };
const toggleAvailability = async (product) => {
  await updateDoc(doc(db, "products", product.id), {
    available: !product.available,
  });

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

    const sameTypeColors = colors.filter((c) => c.type === colorForm.type);
    const nextOrder = sameTypeColors.length + 1;

    await addDoc(collection(db, "colors"), {
      ...colorForm,
      image: imageUrl,
      order: nextOrder,
      createdAt: serverTimestamp(),
    });

    setColorForm({
      name: "",
      type: activeColorType,
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

const normalizeColorOrder = async () => {
  const grouped = ["filato", "pelle", "minuteria"];

  for (const type of grouped) {
    const sameTypeColors = colors
      .filter((c) => c.type === type)
      .sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999));

    for (let i = 0; i < sameTypeColors.length; i++) {
      await updateDoc(doc(db, "colors", sameTypeColors[i].id), {
        order: i + 1,
      });
    }
  }

  await loadColors();
  alert("Ordine colori sistemato.");
};

const moveColor = async (color, direction) => {
  const sameTypeColors = colors
    .filter((c) => c.type === color.type)
    .sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999));

  const index = sameTypeColors.findIndex((c) => c.id === color.id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;

  if (swapIndex < 0 || swapIndex >= sameTypeColors.length) return;

  const current = sameTypeColors[index];
  const target = sameTypeColors[swapIndex];

  await updateDoc(doc(db, "colors", current.id), {
    order: target.order ?? swapIndex + 1,
  });

  await updateDoc(doc(db, "colors", target.id), {
    order: current.order ?? index + 1,
  });

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
      <input
        className="border p-2 rounded"
        placeholder="Nome prodotto"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />

      <input
        className="border p-2 rounded"
        placeholder="Prezzo"
        value={product.price}
        onChange={(e) => setProduct({ ...product, price: e.target.value })}
      />

      <input
        className="border p-2 rounded"
        placeholder="Quantità"
        value={product.quantity}
        onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
      />

      <select
        className="border p-2 rounded"
        value={product.category}
        onChange={(e) => setProduct({ ...product, category: e.target.value })}
      >
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <input
        className="border p-2 rounded"
        placeholder="Materiale"
        value={product.material}
        onChange={(e) => setProduct({ ...product, material: e.target.value })}
      />

      <input
        className="border p-2 rounded"
        placeholder="Colore"
        value={product.color}
        onChange={(e) => setProduct({ ...product, color: e.target.value })}
      />

      <input
        className="border p-2 rounded"
        placeholder="Dimensioni"
        value={product.dimensions}
        onChange={(e) => setProduct({ ...product, dimensions: e.target.value })}
      />

      <input
        className="border p-2 rounded"
        placeholder="Misura borsa"
        value={product.bagSize}
        onChange={(e) => setProduct({ ...product, bagSize: e.target.value })}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={product.available}
          onChange={(e) =>
            setProduct({ ...product, available: e.target.checked })
          }
        />
        Disponibile / pronta consegna
      </label>

      <label className="border p-2 rounded cursor-pointer text-sm bg-white">
        {productImage ? productImage.name : "Scegli foto prodotto"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setProductImage(e.target.files?.[0] || null)}
        />
      </label>
    </div>

    <div className="flex gap-2 mb-6">
  <button
    onClick={editingProductId ? saveProductChanges : addProduct}
    className="bg-black text-white px-5 py-2 rounded-xl"
  >
    {editingProductId ? "Salva modifiche" : "Aggiungi prodotto"}
  </button>

  {editingProductId && (
    <button
      onClick={() => {
        setEditingProductId(null);
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
          image_url: "",
        });
        setProductImage(null);
      }}
      className="border px-5 py-2 rounded-xl"
    >
      Annulla
    </button>
  )}
</div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {products.map((p) => (
        <div key={p.id} className="border rounded-xl p-3">
          {p.image_url ? (
            <img
              src={p.image_url}
              alt={p.name}
              className="w-full h-40 object-cover rounded-xl mb-2"
            />
          ) : (
            <div className="w-full h-40 bg-secondary rounded-xl mb-2 flex items-center justify-center text-sm text-muted-foreground">
              Nessuna foto
            </div>
          )}

          <h3 className="font-semibold">{p.name}</h3>
          <p>{p.price}€</p>
          <p className="text-sm text-muted-foreground">{p.category}</p>

          <p className="text-sm">
            {p.available ? "Pronta consegna / Shop" : "Su richiesta / Catalogo"}
          </p>

          <button
            onClick={() => toggleAvailability(p)}
            className="mt-2 w-full bg-black text-white rounded-xl py-2 text-sm"
          >
            {p.available
              ? "Sposta nel catalogo"
              : "Sposta nello shop"}
          </button>
<button
  onClick={() => startEditProduct(p)}
  className="mt-2 w-full border rounded-xl py-2 text-sm"
>
  Modifica
</button>
          <button
            onClick={() => deleteProduct(p.id)}
            className="text-red-600 text-sm mt-2"
          >
            Elimina
          </button>
        </div>
      ))}
    </div>
  </section>
)}
          {activeTab === "colors" && (
  <section className="bg-white rounded-2xl shadow p-5">
    <h2 className="text-xl font-bold mb-4">
      Colori filato, pelle e minuteria
    </h2>

    <div className="flex gap-2 mb-4 flex-wrap">
      {[
        ["filato", "Filato"],
        ["pelle", "Pelle"],
        ["minuteria", "Minuteria"],
      ].map(([key, label]) => (
        <button
          key={key}
          onClick={() => {
            setActiveColorType(key);
            setColorForm({ ...colorForm, type: key });
          }}
          className={`px-4 py-2 rounded-full text-sm ${
            activeColorType === key
              ? "bg-black text-white"
              : "bg-secondary hover:bg-secondary/70"
          }`}
        >
          {label}
        </button>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
      <input
        className="border p-2 rounded"
        placeholder="Nome colore"
        value={colorForm.name}
        onChange={(e) =>
          setColorForm({ ...colorForm, name: e.target.value })
        }
      />

      <select
        className="border p-2 rounded"
        value={colorForm.type}
        onChange={(e) => {
          setColorForm({ ...colorForm, type: e.target.value });
          setActiveColorType(e.target.value);
        }}
      >
        <option value="filato">Colori filato</option>
        <option value="pelle">Pelle</option>
        <option value="minuteria">Minuteria</option>
      </select>

      <label className="border p-2 rounded cursor-pointer text-sm bg-white">
  {colorImage ? colorImage.name : "Scegli foto"}
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => setColorImage(e.target.files?.[0] || null)}
  />
</label>
    </div>

    <button
      onClick={addColor}
      className="bg-black text-white px-5 py-2 rounded-xl mb-6"
    >
      Aggiungi colore
    </button>

    <button
  onClick={normalizeColorOrder}
  className="ml-2 border px-5 py-2 rounded-xl mb-6"
>
  Sistema ordine colori
</button>

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
  {colors
    .filter((c) => c.type === activeColorType)
    .sort((a, b) => (a.order ?? 999999) - (b.order ?? 999999))
    .map((c) => (
      <div key={c.id} className="border rounded-xl p-3">
        {c.image ? (
          <img
            src={c.image}
            alt={c.name}
            className="w-full h-24 object-cover rounded-xl mb-2"
          />
        ) : (
          <div className="w-full h-24 bg-secondary rounded-xl mb-2 flex items-center justify-center text-xs text-muted-foreground">
            Nessuna foto
          </div>
        )}

        <p className="font-semibold text-sm">{c.name}</p>
        <p className="text-xs text-muted-foreground">{c.type}</p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => moveColor(c, "up")}
            className="flex-1 border rounded-lg py-1 text-xs"
          >
            ↑
          </button>

          <button
            onClick={() => moveColor(c, "down")}
            className="flex-1 border rounded-lg py-1 text-xs"
          >
            ↓
          </button>
        </div>

        <button
          onClick={() => deleteColor(c.id)}
          className="text-red-600 text-sm mt-2"
        >
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
