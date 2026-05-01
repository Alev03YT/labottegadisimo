const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, Upload, Loader2, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ORDERS_EMAIL = 'ordini@labottegadisimo.it';
const ADMIN_EMAIL = 'amministrazione@labottegadisimo.it';

export default function Cart() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [differentBilling, setDifferentBilling] = useState(false);
  const [uploadingFor, setUploadingFor] = useState(null);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [shopSettings, setShopSettings] = useState(null);

  useEffect(() => {
    db.entities.ShopSettings.list().then(s => s.length > 0 && setShopSettings(s[0])).catch(() => {});
  }, []);

  const SHIPPING_OPTIONS = [
    { value: 'corriere_espresso', label: 'Corriere Espresso (24-48h)', cost: shopSettings?.corriere_espresso_cost ?? 8.90 },
    { value: 'poste_italiane', label: 'Poste Italiane (3-5 gg)', cost: shopSettings?.poste_italiane_cost ?? 5.90 },
    { value: 'fermo_deposito', label: 'Fermo Deposito Corriere', cost: shopSettings?.fermo_deposito_cost ?? 4.90 },
  ];

  const [orderForm, setOrderForm] = useState({
    customer_name: '',
    customer_surname: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    billing_address: '',
    notes: '',
  });

  useEffect(() => {
    db.auth.me().then(u => {
      if (!u) return;
      setOrderForm(f => ({
        ...f,
        customer_name: u.full_name?.split(' ')[0] || '',
        customer_surname: u.full_name?.split(' ').slice(1).join(' ') || u.cognome || '',
        customer_email: u.email || '',
        customer_phone: u.telefono || '',
        shipping_address: u.indirizzo_spedizione || '',
        billing_address: u.indirizzo_fatturazione || '',
      }));
      if (u.indirizzo_fatturazione && u.indirizzo_fatturazione !== u.indirizzo_spedizione) {
        setDifferentBilling(true);
      }
    }).catch(() => {});
  }, []);

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cartItems'],
    queryFn: () => db.entities.CartItem.list(),
    initialData: [],
  });

  const updateQtyMutation = useMutation({
    mutationFn: ({ id, quantity }) => db.entities.CartItem.update(id, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cartItems'] }),
  });

  const removeItemMutation = useMutation({
    mutationFn: (id) => db.entities.CartItem.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      toast.success('Rimosso dal carrello');
    },
  });

  const handleDigitalUpload = async (e, itemId) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFor(itemId);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    await db.entities.CartItem.update(itemId, { digital_file_url: file_url });
    queryClient.invalidateQueries({ queryKey: ['cartItems'] });
    setUploadingFor(null);
    toast.success('File allegato!');
  };

  const buildItemsHtml = () =>
    cartItems.map(i => `<li>${i.product_name} × ${i.quantity || 1} — €${((i.price || 0) * (i.quantity || 1)).toFixed(2)}${i.is_digital && i.digital_file_url ? ' [File allegato]' : ''}</li>`).join('');

  const itemsTotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shippingCost = SHIPPING_OPTIONS.find(s => s.value === shippingMethod)?.cost ?? 0;
  const total = itemsTotal + (showPayment ? shippingCost : 0);

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const fullName = `${orderForm.customer_name} ${orderForm.customer_surname}`.trim();
      const billingAddr = differentBilling ? orderForm.billing_address : orderForm.shipping_address;
      const shippingLabel = SHIPPING_OPTIONS.find(s => s.value === shippingMethod)?.label || shippingMethod;

      const order = await db.entities.Order.create({
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity || 1,
          digital_file_url: item.digital_file_url,
        })),
        total,
        status: 'in_attesa',
        payment_method: paymentMethod,
        customer_name: fullName,
        customer_email: orderForm.customer_email,
        shipping_address: orderForm.shipping_address,
        notes: `Tel: ${orderForm.customer_phone} | Spedizione: ${shippingLabel} (€${shippingCost.toFixed(2)})${billingAddr ? ' | Fatturazione: ' + billingAddr : ''}${orderForm.notes ? ' | ' + orderForm.notes : ''}`,
      });

      await db.auth.updateMe({
        cognome: orderForm.customer_surname,
        telefono: orderForm.customer_phone,
        indirizzo_spedizione: orderForm.shipping_address,
        indirizzo_fatturazione: billingAddr,
      });

      for (const item of cartItems) {
        await db.entities.CartItem.delete(item.id);
      }

      const itemsList = buildItemsHtml();
      const paymentInfo = {
        paypal: 'PayPal — indirizzo: info@labottegadisimo.it',
        carta: 'Carta di Credito — verrete contattati per il pagamento sicuro',
        bonifico: `Bonifico Bancario — IBAN: IT00 X000 0000 0000 0000 0000 000 — Causale: Ordine ${order.id}`,
        klarna: 'Klarna — riceverete le istruzioni via email',
        scalapay: 'Scalapay — riceverete le istruzioni via email',
      }[paymentMethod] || paymentMethod;

      await db.integrations.Core.SendEmail({
        from_name: 'La Bottega di Simo',
        to: orderForm.customer_email,
        subject: '✅ Ordine confermato – La Bottega di Simo',
        body: `<h2>Grazie per il tuo ordine, ${fullName}!</h2>
<p>Il tuo ordine è stato ricevuto ed è <strong>in lavorazione</strong>.</p>
<h3>Riepilogo ordine</h3><ul>${itemsList}</ul>
<p>Subtotale: €${itemsTotal.toFixed(2)}</p>
<p>🚚 Spedizione (${shippingLabel}): €${shippingCost.toFixed(2)}</p>
<p><strong>Totale: €${total.toFixed(2)}</strong></p>
<p>💳 Pagamento: ${paymentInfo}</p>
<p>📍 Spedizione a: ${orderForm.shipping_address}</p>
${billingAddr && billingAddr !== orderForm.shipping_address ? `<p>🧾 Fatturazione: ${billingAddr}</p>` : ''}
<br/><p>Ti aggiorneremo non appena il tuo ordine verrà spedito. 💕</p><p>– La Bottega di Simo</p>`,
      });

      await db.integrations.Core.SendEmail({
        from_name: 'La Bottega di Simo',
        to: ORDERS_EMAIL,
        subject: `🛍️ Nuovo ordine da ${fullName} – €${total.toFixed(2)}`,
        body: `<h2>Nuovo ordine!</h2>
<p><strong>Cliente:</strong> ${fullName} (${orderForm.customer_email}) — Tel: ${orderForm.customer_phone}</p>
<ul>${itemsList}</ul>
<p>Subtotale: €${itemsTotal.toFixed(2)}</p>
<p>🚚 Spedizione: ${shippingLabel} — €${shippingCost.toFixed(2)}</p>
<p><strong>Totale: €${total.toFixed(2)}</strong></p>
<p>💳 Pagamento: ${paymentMethod}</p>
<p>📍 Spedizione a: ${orderForm.shipping_address}</p>
${billingAddr && billingAddr !== orderForm.shipping_address ? `<p>🧾 Fatturazione: ${billingAddr}</p>` : ''}`,
      });

      await db.integrations.Core.SendEmail({
        from_name: 'La Bottega di Simo',
        to: ADMIN_EMAIL,
        subject: `💳 Pagamento in attesa: ${fullName} – €${total.toFixed(2)}`,
        body: `<h2>Nuovo pagamento da processare</h2>
<p><strong>Cliente:</strong> ${fullName} (${orderForm.customer_email})</p>
<p><strong>Totale: €${total.toFixed(2)}</strong></p>
<p><strong>Metodo:</strong> ${paymentMethod} — ${paymentInfo}</p>
<ul>${itemsList}</ul>`,
      });

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      setOrderConfirmed(true);
      setTimeout(() => navigate('/Home'), 4000);
    },
  });

  if (orderConfirmed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Grazie per il tuo ordine!</h2>
        <p className="text-muted-foreground mb-2">Il tuo ordine è stato confermato e riceverai una email di riepilogo.</p>
        <p className="text-sm text-muted-foreground">Verrai reindirizzata alla Home tra pochi secondi...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          {Array(3).fill(0).map((_, i) => <div key={i} className="h-24 bg-secondary rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">Il Tuo Carrello</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">Carrello ({cartItems.length})</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">Il tuo carrello è vuoto</p>
          <Link to="/Catalog"><Button variant="outline" className="rounded-full"><ArrowLeft className="w-4 h-4 mr-2" />Continua lo Shopping</Button></Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="space-y-3">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm md:text-base truncate">{item.product_name}</h3>
                    <p className="text-sm text-primary font-semibold">€{item.price?.toFixed(2)}</p>
                    {item.is_digital && (
                      <div className="mt-2">
                        {item.digital_file_url ? (
                          <span className="flex items-center gap-1 text-xs text-accent">
                            <FileText className="w-3.5 h-3.5" /> File allegato ✓
                          </span>
                        ) : (
                          <label className="cursor-pointer">
                            <input type="file" className="hidden" onChange={(e) => handleDigitalUpload(e, item.id)} />
                            <span className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                              {uploadingFor === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                              {uploadingFor === item.id ? 'Caricamento...' : 'Allega file di riferimento (opzionale)'}
                            </span>
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" size="icon" className="w-7 h-7 rounded-full"
                      onClick={() => (item.quantity || 1) <= 1 ? removeItemMutation.mutate(item.id) : updateQtyMutation.mutate({ id: item.id, quantity: (item.quantity || 1) - 1 })}>
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity || 1}</span>
                    <Button variant="outline" size="icon" className="w-7 h-7 rounded-full"
                      onClick={() => updateQtyMutation.mutate({ id: item.id, quantity: (item.quantity || 1) + 1 })}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <span className="font-semibold text-foreground text-sm w-20 text-right flex-shrink-0">
                    €{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0"
                    onClick={() => removeItemMutation.mutate(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-border pt-6">
            <div className="space-y-2 mb-6">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Subtotale prodotti</span>
                <span>€{itemsTotal.toFixed(2)}</span>
              </div>
              {shippingMethod && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Spedizione</span>
                  <span>€{shippingCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-lg font-heading font-semibold">Totale</span>
                <span className="text-2xl font-bold text-foreground">€{(itemsTotal + (shippingMethod ? shippingCost : 0)).toFixed(2)}</span>
              </div>
            </div>

            {!showCheckout ? (
              <Button className="w-full rounded-full py-6 text-sm font-medium bg-primary hover:bg-primary/90"
                onClick={async () => {
                  const auth = await db.auth.isAuthenticated();
                  if (!auth) { db.auth.redirectToLogin(window.location.href); return; }
                  setShowCheckout(true); setShowPayment(false);
                }}>
                Procedi all'Ordine <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : !showPayment ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 bg-secondary/30 rounded-2xl p-6">
                <h3 className="font-heading text-lg font-semibold mb-2">Dati per l'Ordine</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Nome *</Label>
                    <Input value={orderForm.customer_name} onChange={(e) => setOrderForm({ ...orderForm, customer_name: e.target.value })} placeholder="Mario" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cognome *</Label>
                    <Input value={orderForm.customer_surname} onChange={(e) => setOrderForm({ ...orderForm, customer_surname: e.target.value })} placeholder="Rossi" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email *</Label>
                    <Input type="email" value={orderForm.customer_email} onChange={(e) => setOrderForm({ ...orderForm, customer_email: e.target.value })} placeholder="mario@email.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Telefono *</Label>
                    <Input type="tel" value={orderForm.customer_phone} onChange={(e) => setOrderForm({ ...orderForm, customer_phone: e.target.value })} placeholder="333 1234567" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Indirizzo di Spedizione *</Label>
                  <Textarea value={orderForm.shipping_address} onChange={(e) => setOrderForm({ ...orderForm, shipping_address: e.target.value })} placeholder="Via Roma 1, 00100, Roma (RM)" className="rounded-lg" />
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={differentBilling} onChange={(e) => setDifferentBilling(e.target.checked)} className="rounded" />
                  <span className="text-sm text-muted-foreground">Indirizzo di fatturazione diverso da quello di spedizione</span>
                </label>

                {differentBilling && (
                  <div className="space-y-1.5">
                    <Label>Indirizzo di Fatturazione *</Label>
                    <Textarea value={orderForm.billing_address} onChange={(e) => setOrderForm({ ...orderForm, billing_address: e.target.value })} placeholder="Via Fattura 1, 00100, Roma (RM)" className="rounded-lg" />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label>Note (opzionale)</Label>
                  <Textarea value={orderForm.notes} onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })} placeholder="Istruzioni speciali..." className="rounded-lg" rows={2} />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="rounded-full" onClick={() => setShowCheckout(false)}>Indietro</Button>
                  <Button
                    className="flex-1 rounded-full py-5 bg-primary hover:bg-primary/90"
                    disabled={!orderForm.customer_name || !orderForm.customer_surname || !orderForm.customer_email || !orderForm.customer_phone || !orderForm.shipping_address || (differentBilling && !orderForm.billing_address)}
                    onClick={() => setShowPayment(true)}
                  >
                    Scegli Pagamento <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 bg-secondary/30 rounded-2xl p-6">
                <h3 className="font-heading text-lg font-semibold mb-2">Spedizione</h3>
                <div className="space-y-2 mb-4">
                  {SHIPPING_OPTIONS.map((s) => (
                    <label key={s.value} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${shippingMethod === s.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <input type="radio" name="shipping" value={s.value} checked={shippingMethod === s.value} onChange={() => setShippingMethod(s.value)} className="mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{s.label}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">€{s.cost.toFixed(2)}</span>
                    </label>
                  ))}
                </div>

                <h3 className="font-heading text-lg font-semibold mb-4">Metodo di Pagamento</h3>
                <div className="space-y-3">
                  {[
                    { value: 'paypal', label: 'PayPal', desc: 'Paga in modo sicuro con il tuo account PayPal' },
                    { value: 'carta', label: 'Carta di Credito / Debito', desc: 'Visa, Mastercard, Amex' },
                    { value: 'bonifico', label: 'Bonifico Bancario', desc: 'Riceverai i dati bancari via email' },
                    { value: 'klarna', label: 'Klarna', desc: 'Paga in 3 rate senza interessi' },
                    { value: 'scalapay', label: 'Scalapay', desc: 'Paga in 3 rate, subito disponibile' },
                  ].map((m) => (
                    <label key={m.value} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === m.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                      <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} className="mt-1" />
                      <div>
                        <p className="font-medium text-sm">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked={acceptedPrivacy} onChange={(e) => setAcceptedPrivacy(e.target.checked)} className="mt-0.5 rounded" />
                    <span className="text-xs text-muted-foreground">
                      Ho letto e accetto la{' '}
                      <a href="/PrivacyPolicy" target="_blank" className="text-primary underline">Privacy Policy</a> *
                    </span>
                  </label>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="mt-0.5 rounded" />
                    <span className="text-xs text-muted-foreground">
                      Ho letto e accetto i{' '}
                      <a href="/TerminiCondizioni" target="_blank" className="text-primary underline">Termini e Condizioni di Vendita</a> *
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="rounded-full" onClick={() => setShowPayment(false)}>Indietro</Button>
                  <Button
                    className="flex-1 rounded-full py-5 bg-primary hover:bg-primary/90"
                    onClick={() => placeOrderMutation.mutate()}
                    disabled={!paymentMethod || !shippingMethod || !acceptedPrivacy || !acceptedTerms || placeOrderMutation.isPending}
                  >
                    {placeOrderMutation.isPending ? 'Elaborazione...' : 'Conferma Ordine'}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}