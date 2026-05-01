const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Package, ImageIcon, ShieldAlert, Settings, ClipboardList, Palette, Euro, X, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import ColorSwatchManager from '@/components/admin/ColorSwatchManager';
import { motion } from 'framer-motion';
import { CATEGORY_LABELS } from '@/components/categories';
import ProductFormDialog from '@/components/products/ProductFormDialog';

const OPTION_TYPES = [
{ value: 'colore_materiale', label: 'Colore Materiale' },
{ value: 'taglia', label: 'Taglia' },
{ value: 'elemento', label: 'Elemento (Pelle/Ecopelle)' },
{ value: 'colore_pelle', label: 'Colore Pelle' },
{ value: 'colore_minuteria', label: 'Colore Minuteria' }];

export default function Admin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [newOptionType, setNewOptionType] = useState('colore_materiale');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [shopSettings, setShopSettings] = useState(null);
  const [shopSettingsId, setShopSettingsId] = useState(null);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    db.auth.me()
      .then((u) => {
        const admin = u?.role === 'admin';
        setIsAdmin(admin);
        if (!admin) navigate('/Home', { replace: true });
      })
      .catch(() => { setIsAdmin(false); navigate('/Home', { replace: true }); });
  }, []);

  useEffect(() => {
    if (isAdmin) {
      db.entities.ShopSettings.list().then(s => {
        if (s.length > 0) { setShopSettings(s[0]); setShopSettingsId(s[0].id); }
        else setShopSettings({ corriere_espresso_cost: 8.90, poste_italiane_cost: 5.90, fermo_deposito_cost: 4.90, paypal_email: '', iban: '', iban_intestatario: '', carta_info: '', klarna_info: '', scalapay_info: '' });
      }).catch(() => {});
    }
  }, [isAdmin]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => db.entities.Product.list('-created_date', 200),
    initialData: [],
    enabled: isAdmin === true
  });

  const { data: options = [] } = useQuery({
    queryKey: ['contactFormOptions'],
    queryFn: () => db.entities.ContactFormOption.list(),
    initialData: [],
    enabled: isAdmin === true
  });

  const { data: allOrders = [] } = useQuery({
    queryKey: ['allOrders'],
    queryFn: () => db.entities.Order.list('-created_date', 100),
    initialData: [],
    enabled: isAdmin === true
  });

  const sendStatusEmail = async (order, newStatus, newPaymentStatus, newTracking) => {
    const statusLabels = {
      in_attesa: 'In Attesa',
      confermato: 'Confermato',
      in_lavorazione: 'In Lavorazione',
      spedito: 'Spedito',
      consegnato: 'Consegnato',
    };
    const paymentLabels = {
      in_attesa: 'In Attesa',
      ricevuto: '✅ Ricevuto',
      fallito: '❌ Fallito',
    };

    if (!order.customer_email) return;

    // Email avanzamento stato ordine
    if (newStatus && newStatus !== order.status) {
      const trackingInfo = (newStatus === 'spedito' && newTracking)
        ? `<p>📦 <strong>Numero di tracking:</strong> ${newTracking}</p>` : '';
      const emoji = { in_attesa: '⏳', confermato: '✅', in_lavorazione: '🧶', spedito: '🚚', consegnato: '🎉' }[newStatus] || '📦';
      await db.integrations.Core.SendEmail({
        from_name: 'La Bottega di Simo',
        to: order.customer_email,
        subject: `${emoji} Aggiornamento ordine – ${statusLabels[newStatus] || newStatus}`,
        body: `<h2>Ciao ${order.customer_name || 'cara cliente'}! 💕</h2>
<p>Il tuo ordine è stato aggiornato:</p>
<p style="font-size:18px;font-weight:bold;">${emoji} Nuovo stato: <strong>${statusLabels[newStatus] || newStatus}</strong></p>
${trackingInfo}
<h3>Riepilogo ordine</h3>
<ul>${order.items?.map(i => `<li>${i.product_name} × ${i.quantity} — €${((i.price||0)*(i.quantity||1)).toFixed(2)}</li>`).join('') || ''}</ul>
<p><strong>Totale: €${order.total?.toFixed(2)}</strong></p>
<br/><p>Per qualsiasi domanda scrivici a <a href="mailto:info@labottegadisimo.it">info@labottegadisimo.it</a> o su WhatsApp al 347-7922931.</p>
<p>– La Bottega di Simo 💕</p>`,
      }).catch(() => {});
    }

    // Email aggiornamento stato pagamento
    if (newPaymentStatus && newPaymentStatus !== order.payment_status) {
      const emoji = { ricevuto: '✅', fallito: '❌', in_attesa: '⏳' }[newPaymentStatus] || '💳';
      await db.integrations.Core.SendEmail({
        from_name: 'La Bottega di Simo',
        to: order.customer_email,
        subject: `${emoji} Aggiornamento pagamento – La Bottega di Simo`,
        body: `<h2>Ciao ${order.customer_name || 'cara cliente'}! 💕</h2>
<p>Ti informiamo che lo stato del pagamento del tuo ordine è stato aggiornato:</p>
<p style="font-size:18px;font-weight:bold;">${emoji} Pagamento: <strong>${paymentLabels[newPaymentStatus] || newPaymentStatus}</strong></p>
${newPaymentStatus === 'fallito' ? '<p>⚠️ Ti preghiamo di contattarci per risolvere il problema.</p>' : ''}
${newPaymentStatus === 'ricevuto' ? '<p>Il tuo ordine verrà ora messo in lavorazione. 🧶</p>' : ''}
<br/><p>Per qualsiasi domanda: <a href="mailto:amministrazione@labottegadisimo.it">amministrazione@labottegadisimo.it</a></p>
<p>– La Bottega di Simo 💕</p>`,
      }).catch(() => {});
    }
  };

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, status, payment_status, tracking_number }) => {
      const order = allOrders.find(o => o.id === id);
      await db.entities.Order.update(id, { status, payment_status, tracking_number });
      if (order) await sendStatusEmail(order, status, payment_status, tracking_number);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      toast.success('Ordine aggiornato');
      setUpdatingOrderId(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Product.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Prodotto eliminato');
    }
  });

  const toggleStockMutation = useMutation({
    mutationFn: ({ id, in_stock }) => db.entities.Product.update(id, { in_stock }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  });

  const addOptionMutation = useMutation({
    mutationFn: () => db.entities.ContactFormOption.create({ type: newOptionType, value: newOptionValue.trim(), active: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contactFormOptions'] });
      setNewOptionValue('');
      toast.success('Opzione aggiunta');
    }
  });

  const deleteOptionMutation = useMutation({
    mutationFn: (id) => db.entities.ContactFormOption.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contactFormOptions'] })
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (id) => db.entities.Order.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allOrders'] });
      toast.success('Ordine cancellato');
    }
  });

  const saveShopSettings = async () => {
    setSavingSettings(true);
    if (shopSettingsId) {
      await db.entities.ShopSettings.update(shopSettingsId, shopSettings);
    } else {
      const created = await db.entities.ShopSettings.create(shopSettings);
      setShopSettingsId(created.id);
    }
    toast.success('Impostazioni salvate');
    setSavingSettings(false);
  };

  const openNew = () => {setEditingProduct(null);setOpen(true);};
  const openEdit = (product) => {setEditingProduct(product);setOpen(true);};

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-secondary border-t-primary rounded-full animate-spin" />
      </div>);

  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
        <ShieldAlert className="w-16 h-16 text-muted-foreground/30" />
        <h2 className="font-heading text-2xl font-bold text-foreground">Accesso Negato</h2>
        <p className="text-muted-foreground text-sm max-w-xs">Solo gli amministratori possono accedere a questa sezione.</p>
      </div>);

  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">Admin</span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Pannello Admin</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          
          Prodotti ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          
          <ClipboardList className="w-3.5 h-3.5" />
          Ordini ({allOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('options')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'options' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          
          <Settings className="w-3.5 h-3.5" />
          Opzioni Form Contatti
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'colors' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          
          <Palette className="w-3.5 h-3.5" />
          Colori Filato &amp; Pelle
        </button>
        <button
          onClick={() => setActiveTab('impostazioni')}
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-1.5 ${activeTab === 'impostazioni' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          <Euro className="w-3.5 h-3.5" />
          Impostazioni Shop
        </button>
      </div>

      {activeTab === 'products' &&
      <>
          <div className="flex justify-end mb-4">
            <Button className="rounded-full bg-primary hover:bg-primary/90" onClick={openNew}>
              <Plus className="w-4 h-4 mr-2" /> Nuovo Prodotto
            </Button>
          </div>
          {isLoading ?
        <div className="space-y-3">
              {Array(4).fill(0).map((_, i) =>
          <div key={i} className="h-20 bg-secondary rounded-xl animate-pulse" />
          )}
            </div> :
        products.length === 0 ?
        <div className="text-center py-20">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">Nessun prodotto. Aggiungine uno!</p>
            </div> :

        <div className="space-y-2">
              {products.map((product, i) =>
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50">
            
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    {product.image_url ?
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" /> :

              <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-muted-foreground/30" />
                      </div>
              }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-foreground text-sm truncate">{product.name}</h3>
                      {product.featured && <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20 border">In Evidenza</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[product.category] || product.category}</span>
                      <span className="text-xs font-semibold text-primary">€{product.price?.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">Qtà: {product.quantity ?? 0}</span>
                      {product.size && <span className="text-xs text-muted-foreground">Taglia: {product.size}</span>}
                      {product.bag_size && <span className="text-xs text-muted-foreground">Misura: {product.bag_size}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">{product.in_stock ? 'Disponibile' : 'Esaurito'}</span>
                    <Switch
                checked={product.in_stock !== false}
                onCheckedChange={(val) => toggleStockMutation.mutate({ id: product.id, in_stock: val })} />
              
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}>
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button
                variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive"
                onClick={() => {if (confirm(`Eliminare "${product.name}"?`)) deleteMutation.mutate(product.id);}}>
                
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
          )}
            </div>
        }
        </>
      }

      {activeTab === 'orders' &&
      <div className="space-y-4">
          {allOrders.length === 0 ?
        <p className="text-center text-muted-foreground py-16">Nessun ordine ricevuto.</p> :
        allOrders.map((order) => (
          <div key={order.id} className="bg-card border border-border/50 rounded-2xl p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-sm">{order.customer_name} — {order.customer_email}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.created_date).toLocaleDateString('it-IT')} — {order.payment_method}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">€{order.total?.toFixed(2)}</span>
                <Button
                  variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive"
                  onClick={() => { if (confirm('Cancellare questo ordine?')) cancelOrderMutation.mutate(order.id); }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Select value={order.status} onValueChange={(v) => updateOrderMutation.mutate({ id: order.id, status: v, payment_status: order.payment_status, tracking_number: order.tracking_number })}>
                <SelectTrigger className="w-44 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['in_attesa','confermato','in_lavorazione','spedito','consegnato'].map(s => <SelectItem key={s} value={s}>{s.replace('_',' ')}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={order.payment_status || 'in_attesa'} onValueChange={(v) => updateOrderMutation.mutate({ id: order.id, status: order.status, payment_status: v, tracking_number: order.tracking_number })}>
                <SelectTrigger className="w-40 h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['in_attesa','ricevuto','fallito'].map(s => <SelectItem key={s} value={s}>{s.replace('_',' ')}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input
                className="w-48 h-8 text-xs"
                placeholder="Tracking number..."
                defaultValue={order.tracking_number || ''}
                onBlur={(e) => e.target.value !== order.tracking_number && updateOrderMutation.mutate({ id: order.id, status: order.status, payment_status: order.payment_status, tracking_number: e.target.value })}
              />
            </div>
            {order.notes && <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">{order.notes}</p>}
            <ul className="text-xs text-muted-foreground space-y-0.5">
              {order.items?.map((it, i) => <li key={i}>{it.product_name} × {it.quantity} — €{((it.price || 0) * (it.quantity || 1)).toFixed(2)}</li>)}
            </ul>
          </div>
        ))
      }
        </div>
      }

      {activeTab === 'options' &&
      <div className="space-y-8">
          {/* Aggiungi opzione */}
          <div className="bg-card border border-border/50 rounded-2xl p-6">
            <h3 className="font-heading text-base font-semibold mb-4">Aggiungi Opzione</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={newOptionType} onValueChange={setNewOptionType}>
                <SelectTrigger className="sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OPTION_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input
              value={newOptionValue}
              onChange={(e) => setNewOptionValue(e.target.value)}
              placeholder="Es. Rosso, S/M, Pelle..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && newOptionValue.trim() && addOptionMutation.mutate()} />
            
              <Button
              className="rounded-full bg-primary hover:bg-primary/90"
              disabled={!newOptionValue.trim() || addOptionMutation.isPending}
              onClick={() => addOptionMutation.mutate()}>
              
                <Plus className="w-4 h-4 mr-1" /> Aggiungi
              </Button>
            </div>
          </div>

          {/* Lista opzioni per tipo */}
          {OPTION_TYPES.map((ot) => {
          const filtered = options.filter((o) => o.type === ot.value);
          return (
            <div key={ot.value} className="bg-card border border-border/50 rounded-2xl p-6">
                <h4 className="font-heading text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">{ot.label}</h4>
                {filtered.length === 0 ?
              <p className="text-xs text-muted-foreground">Nessuna opzione. Aggiungine una sopra.</p> :

              <div className="flex flex-wrap gap-2">
                    {filtered.map((opt) =>
                <div key={opt.id} className="flex items-center gap-1.5 bg-secondary rounded-full pl-3 pr-1.5 py-1">
                        <span className="text-sm">{opt.value}</span>
                        <button
                    onClick={() => deleteOptionMutation.mutate(opt.id)}
                    className="w-5 h-5 rounded-full hover:bg-destructive/20 hover:text-destructive flex items-center justify-center transition-colors">
                    
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                )}
                  </div>
              }
              </div>);

        })}
        </div>
      }

      {activeTab === 'colors' && <ColorSwatchManager />}

      {activeTab === 'impostazioni' && shopSettings && (
        <div className="space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
            <h3 className="font-heading text-base font-semibold">Costi di Spedizione</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[{key:'corriere_espresso_cost',label:'Corriere Espresso (€)'},{key:'poste_italiane_cost',label:'Poste Italiane (€)'},{key:'fermo_deposito_cost',label:'Fermo Deposito (€)'}].map(f => (
                <div key={f.key} className="space-y-1.5">
                  <Label className="text-xs">{f.label}</Label>
                  <Input type="number" step="0.01" value={shopSettings[f.key] || ''} onChange={e => setShopSettings({...shopSettings,[f.key]:parseFloat(e.target.value)||0})} />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
            <h3 className="font-heading text-base font-semibold">Dati per i Pagamenti</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Email PayPal</Label>
                <Input value={shopSettings.paypal_email||''} onChange={e=>setShopSettings({...shopSettings,paypal_email:e.target.value})} placeholder="email@paypal.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">IBAN Bonifico</Label>
                <Input value={shopSettings.iban||''} onChange={e=>setShopSettings({...shopSettings,iban:e.target.value})} placeholder="IT00 X000 0000 ..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Intestatario conto</Label>
                <Input value={shopSettings.iban_intestatario||''} onChange={e=>setShopSettings({...shopSettings,iban_intestatario:e.target.value})} placeholder="Nome Cognome" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Info Klarna</Label>
                <Input value={shopSettings.klarna_info||''} onChange={e=>setShopSettings({...shopSettings,klarna_info:e.target.value})} placeholder="Istruzioni Klarna..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Info Scalapay</Label>
                <Input value={shopSettings.scalapay_info||''} onChange={e=>setShopSettings({...shopSettings,scalapay_info:e.target.value})} placeholder="Istruzioni Scalapay..." />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Info Carta di Credito</Label>
                <Input value={shopSettings.carta_info||''} onChange={e=>setShopSettings({...shopSettings,carta_info:e.target.value})} placeholder="Istruzioni pagamento carta..." />
              </div>
            </div>
          </div>
          <Button className="rounded-full bg-primary hover:bg-primary/90" onClick={saveShopSettings} disabled={savingSettings}>
            {savingSettings ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Euro className="w-4 h-4 mr-2" />}
            Salva Impostazioni
          </Button>
        </div>
      )}

      <ProductFormDialog open={open} onOpenChange={setOpen} editingProduct={editingProduct} />
    </div>);

}