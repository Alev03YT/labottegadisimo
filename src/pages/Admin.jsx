import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, Save, Package, ClipboardList, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LS_PRODUCTS = 'labottega_admin_products';
const LS_ORDERS = 'labottega_admin_orders';
const LS_SETTINGS = 'labottega_admin_settings';

const emptyProduct = {
  name: '',
  category: 'Accessori',
  price: '',
  image_url: '',
  description: '',
  in_stock: true,
};

const emptySettings = {
  instagram: 'https://www.instagram.com/labottegadisimo/',
  facebook: 'https://www.facebook.com/labottegadisimo/',
  whatsapp: 'https://wa.me/393477922931',
  email: 'info@labottegadisimo.it',
};

function load(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState(() => load(LS_PRODUCTS, []));
  const [orders, setOrders] = useState(() => load(LS_ORDERS, []));
  const [settings, setSettings] = useState(() => load(LS_SETTINGS, emptySettings));
  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => save(LS_PRODUCTS, products), [products]);
  useEffect(() => save(LS_ORDERS, orders), [orders]);
  useEffect(() => save(LS_SETTINGS, settings), [settings]);

  const resetForm = () => {
    setProductForm(emptyProduct);
    setEditingId(null);
  };

  const submitProduct = (e) => {
    e.preventDefault();
    const product = {
      ...productForm,
      id: editingId || crypto.randomUUID(),
      price: Number(productForm.price || 0),
      updated_at: new Date().toISOString(),
    };

    setProducts((list) => editingId ? list.map((p) => p.id === editingId ? product : p) : [product, ...list]);
    resetForm();
  };

  const editProduct = (product) => {
    setProductForm({ ...product, price: String(product.price ?? '') });
    setEditingId(product.id);
    setActiveTab('products');
  };

  const deleteProduct = (id) => {
    if (confirm('Vuoi eliminare questo prodotto?')) {
      setProducts((list) => list.filter((p) => p.id !== id));
    }
  };

  const createTestOrder = () => {
    setOrders((list) => [{
      id: crypto.randomUUID(),
      customer_name: 'Cliente prova',
      customer_email: 'cliente@email.it',
      total: 0,
      status: 'in_attesa',
      created_at: new Date().toLocaleDateString('it-IT'),
    }, ...list]);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">Admin</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Pannello Admin</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Gestione base del negozio. I dati vengono salvati nel browser con localStorage, quindi funzionano anche su GitHub Pages senza database.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-border pb-3">
        <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'products' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
          <Package className="w-4 h-4 inline mr-1" /> Prodotti
        </button>
        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
          <ClipboardList className="w-4 h-4 inline mr-1" /> Ordini
        </button>
        <button onClick={() => setActiveTab('settings')} className={`px-4 py-2 rounded-full text-sm font-medium ${activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
          <Settings className="w-4 h-4 inline mr-1" /> Impostazioni
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="grid lg:grid-cols-[380px,1fr] gap-8">
          <form onSubmit={submitProduct} className="bg-card border border-border rounded-2xl p-5 space-y-4 h-fit">
            <h2 className="font-heading text-xl font-semibold">{editingId ? 'Modifica prodotto' : 'Nuovo prodotto'}</h2>
            <div className="space-y-2">
              <Label>Nome prodotto</Label>
              <Input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Input value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Prezzo</Label>
              <Input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Link immagine</Label>
              <Input value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Descrizione</Label>
              <textarea className="w-full min-h-24 rounded-md border border-input bg-background px-3 py-2 text-sm" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={productForm.in_stock} onChange={(e) => setProductForm({ ...productForm, in_stock: e.target.checked })} /> Disponibile
            </label>
            <div className="flex gap-2">
              <Button type="submit" className="rounded-full"><Save className="w-4 h-4 mr-1" /> Salva</Button>
              {editingId && <Button type="button" variant="outline" onClick={resetForm} className="rounded-full">Annulla</Button>}
            </div>
          </form>

          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="bg-secondary/50 rounded-2xl p-8 text-center text-muted-foreground">Nessun prodotto inserito.</div>
            ) : products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                  {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category} · €{Number(product.price || 0).toFixed(2)} · {product.in_stock ? 'Disponibile' : 'Esaurito'}</p>
                  <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                </div>
                <Button variant="outline" size="icon" onClick={() => editProduct(product)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="outline" size="icon" onClick={() => deleteProduct(product.id)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <Button onClick={createTestOrder} className="rounded-full"><Plus className="w-4 h-4 mr-1" /> Crea ordine prova</Button>
          {orders.length === 0 ? (
            <div className="bg-secondary/50 rounded-2xl p-8 text-center text-muted-foreground">Nessun ordine salvato.</div>
          ) : orders.map((order) => (
            <div key={order.id} className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">{order.customer_name}</h3>
                <p className="text-sm text-muted-foreground">{order.customer_email} · {order.created_at}</p>
              </div>
              <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={order.status} onChange={(e) => setOrders(list => list.map(o => o.id === order.id ? { ...o, status: e.target.value } : o))}>
                <option value="in_attesa">In attesa</option>
                <option value="confermato">Confermato</option>
                <option value="in_lavorazione">In lavorazione</option>
                <option value="spedito">Spedito</option>
                <option value="consegnato">Consegnato</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-card border border-border rounded-2xl p-5 max-w-2xl space-y-4">
          <h2 className="font-heading text-xl font-semibold">Link e contatti</h2>
          {Object.entries(settings).map(([key, value]) => (
            <div className="space-y-2" key={key}>
              <Label className="capitalize">{key}</Label>
              <Input value={value} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} />
            </div>
          ))}
          <p className="text-sm text-muted-foreground">Le impostazioni sono salvate automaticamente in questo browser.</p>
        </div>
      )}
    </div>
  );
}
