const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Pencil, MessageSquare, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES_FILTER, CATEGORY_LABELS } from '@/components/categories';
import ProductFormDialog from '@/components/products/ProductFormDialog';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Novità' },
  { value: 'price_asc', label: 'Prezzo: crescente' },
  { value: 'price_desc', label: 'Prezzo: decrescente' },
];

export default function Catalog() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialCategory = urlParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isAdmin, setIsAdmin] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    db.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => {});
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => db.entities.Product.list('-created_date', 100),
    initialData: [],
  });

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (p.category === 'schemi_digitali') return false;
      const categoryMatch = activeCategory === 'all' || p.category === activeCategory;
      const searchMatch = !searchQuery || p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });

    if (sortBy === 'price_asc') result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === 'price_desc') result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  const activeFiltersCount = [activeCategory !== 'all', !!searchQuery].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">
          Tutte le Creazioni
        </span>
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Il Nostro Catalogo
        </h1>
        <p className="text-muted-foreground text-sm mt-2">Sfoglia le nostre creazioni. Per acquistare un articolo disponibile vai allo <Link to="/Shop" className="text-primary underline">Shop</Link>.</p>
      </div>

      {isAdmin && (
        <div className="mb-6">
          <Button className="rounded-full bg-primary hover:bg-primary/90" onClick={() => { setEditingProduct(null); setFormOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Aggiungi Prodotto
          </Button>
        </div>
      )}

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cerca prodotti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full bg-secondary/50 border-border/50"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48 rounded-full bg-secondary/50 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categorie */}
      <div className="flex gap-2 flex-wrap mb-8">
        {CATEGORIES_FILTER.map((cat) => (
          <Button
            key={cat.key}
            variant={activeCategory === cat.key ? 'default' : 'outline'}
            size="sm"
            className="rounded-full text-xs"
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {activeFiltersCount > 0 && (
        <p className="text-xs text-muted-foreground mb-4">{filtered.length} prodotti trovati</p>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-secondary rounded-2xl mb-4" />
              <div className="h-3 bg-secondary rounded w-16 mb-2" />
              <div className="h-4 bg-secondary rounded w-32 mb-2" />
              <div className="h-4 bg-secondary rounded w-20" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground">Nessun prodotto trovato.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative"
              >
                <Link to={`/ProductDetail?id=${product.id}`} className="block">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary mb-3">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 opacity-30 text-muted-foreground" />
                      </div>
                    )}
                    {product.featured && (
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider">
                        In Evidenza
                      </span>
                    )}
                    {isAdmin && (
                      <button
                        onClick={(e) => { e.preventDefault(); setEditingProduct(product); setFormOpen(true); }}
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Pencil className="w-3.5 h-3.5 text-foreground" />
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-widest text-primary">
                    {CATEGORY_LABELS[product.category] || product.category}
                  </span>
                  <h3 className="font-heading text-sm font-medium text-foreground mt-0.5 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  {product.size && <p className="text-xs text-muted-foreground mt-0.5">Taglia: {product.size}</p>}
                  {product.bag_size && <p className="text-xs text-muted-foreground mt-0.5">Misura: {product.bag_size}</p>}
                </Link>

                {/* Richiedi preventivo con nome articolo pre-compilato */}
                <div className="mt-2">
                  <Link to={`/Contacts?product=${encodeURIComponent(product.name)}`}>
                    <Button size="sm" variant="outline" className="w-full rounded-full text-xs border-primary/30 hover:bg-primary hover:text-primary-foreground">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Richiedi Preventivo
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <ProductFormDialog open={formOpen} onOpenChange={setFormOpen} editingProduct={editingProduct} />
    </div>
  );
}