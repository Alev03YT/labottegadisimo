const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Package, Clock, Truck, CheckCircle2, ShoppingBag, CreditCard, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const STATUS_STEPS = [
  { key: 'in_attesa', label: 'In Attesa', icon: Clock },
  { key: 'confermato', label: 'Confermato', icon: Package },
  { key: 'in_lavorazione', label: 'In Lavorazione', icon: Scissors },
  { key: 'spedito', label: 'Spedito', icon: Truck },
  { key: 'consegnato', label: 'Consegnato', icon: CheckCircle2 },
];

const PAYMENT_STATUS_COLORS = {
  in_attesa: 'bg-amber-100 text-amber-700',
  ricevuto: 'bg-green-100 text-green-700',
  fallito: 'bg-red-100 text-red-700',
};
const PAYMENT_STATUS_LABELS = {
  in_attesa: 'Pagamento in attesa',
  ricevuto: 'Pagamento ricevuto',
  fallito: 'Pagamento fallito',
};
const PAYMENT_LABELS = {
  paypal: 'PayPal',
  carta: 'Carta di Credito/Debito',
  bonifico: 'Bonifico Bancario',
  klarna: 'Klarna',
  scalapay: 'Scalapay',
};

function StatusTracker({ status }) {
  const currentIdx = STATUS_STEPS.findIndex(s => s.key === status);
  return (
    <div className="mt-4">
      {/* Desktop: orizzontale */}
      <div className="hidden sm:flex items-center">
        {STATUS_STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i <= currentIdx;
          const isLast = i === STATUS_STEPS.length - 1;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1 min-w-[56px]">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-primary border-primary text-primary-foreground shadow-md' : 'bg-background border-border text-muted-foreground'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-medium text-center leading-tight ${done ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-0.5 mb-4 transition-colors ${i < currentIdx ? 'bg-primary' : 'bg-border'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: verticale */}
      <div className="flex sm:hidden flex-col gap-0">
        {STATUS_STEPS.map((step, i) => {
          const Icon = step.icon;
          const done = i <= currentIdx;
          const isLast = i === STATUS_STEPS.length - 1;
          return (
            <div key={step.key} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${done ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-border text-muted-foreground'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {!isLast && <div className={`w-0.5 h-5 ${i < currentIdx ? 'bg-primary' : 'bg-border'}`} />}
              </div>
              <span className={`text-sm font-medium pt-1.5 ${done ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Orders() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    db.auth.me().then(setUser).catch(() => {
      db.auth.redirectToLogin(window.location.href);
    });
  }, []);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.email],
    queryFn: () => db.entities.Order.filter({ created_by: user.email }, '-created_date', 50),
    enabled: !!user,
    initialData: [],
  });

  if (isLoading || !user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="h-48 bg-secondary rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">Storico Acquisti</span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">I Miei Ordini</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground mb-4">Non hai ancora effettuato ordini</p>
          <Link to="/Catalog">
            <Button variant="outline" className="rounded-full">Inizia a Comprare</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border/50 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              {/* Header ordine */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_date).toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">#{order.id}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {order.payment_status && (
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${PAYMENT_STATUS_COLORS[order.payment_status] || 'bg-secondary text-foreground'}`}>
                      <CreditCard className="w-3 h-3 inline mr-1" />
                      {PAYMENT_STATUS_LABELS[order.payment_status] || order.payment_status}
                    </span>
                  )}
                  <span className="text-sm font-bold text-primary">€{order.total?.toFixed(2)}</span>
                </div>
              </div>

              {/* Tracker avanzamento */}
              <StatusTracker status={order.status} />

              {/* Tracking number */}
              {order.tracking_number && (
                <div className="bg-secondary/50 rounded-xl px-4 py-2.5 text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Tracking: </span>
                  <span className="font-mono font-medium">{order.tracking_number}</span>
                </div>
              )}

              {/* Prodotti */}
              <div className="border-t border-border/50 pt-3 space-y-1.5">
                {order.items?.map((item, j) => (
                  <div key={j} className="flex justify-between items-center text-sm">
                    <span className="text-foreground">{item.product_name} <span className="text-muted-foreground">× {item.quantity}</span></span>
                    <span className="text-muted-foreground">€{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Note */}
              {order.notes && (
                <p className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2">{order.notes}</p>
              )}

              {/* Metodo pagamento */}
              {order.payment_method && (
                <p className="text-xs text-muted-foreground">
                  Pagamento: <span className="font-medium text-foreground">{PAYMENT_LABELS[order.payment_method] || order.payment_method}</span>
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}