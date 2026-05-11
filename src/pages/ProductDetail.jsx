import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingBag, Package } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProductDetail() {
  const { id: productId } = useParams();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!productId) return;

        const ref = doc(db, "products", productId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProduct({
            id: snap.id,
            ...snap.data(),
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-secondary rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-secondary rounded w-20" />
            <div className="h-8 bg-secondary rounded w-64" />
            <div className="h-20 bg-secondary rounded" />
            <div className="h-8 bg-secondary rounded w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Prodotto non trovato.</p>
        <Link to="/Catalog" className="text-primary text-sm mt-4 inline-block">
          Torna al catalogo
        </Link>
      </div>
    );
  }

  const isAvailable = product.available === true || product.available === "true";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link
        to="/Catalog"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Torna al Catalogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-2xl overflow-hidden bg-secondary"
        >
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-20 h-20 text-muted-foreground/30" />
            </div>
          )}

          {!isAvailable && (
            <Badge className="absolute top-4 left-4 bg-black text-white">
              Non disponibile
            </Badge>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-2">
            {product.category}
          </span>

          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-2xl font-semibold mb-6">
            €{Number(product.price || 0).toFixed(2)}
          </p>

          <div className="space-y-3 mb-8 text-sm">
            {product.material && (
              <p><b>Materiale:</b> {product.material}</p>
            )}

            {product.color && (
              <p><b>Colore:</b> {product.color}</p>
            )}

            {product.dimensions && (
              <p><b>Dimensioni:</b> {product.dimensions}</p>
            )}

            {product.bagSize && (
              <p><b>Misura borsa:</b> {product.bagSize}</p>
            )}

            {product.quantity !== undefined && (
              <p><b>Quantità:</b> {product.quantity}</p>
            )}

            <p>
              <b>Disponibilità:</b>{" "}
              <span className={isAvailable ? "text-green-600" : "text-red-600"}>
                {isAvailable ? "Disponibile" : "Non disponibile"}
              </span>
            </p>
          </div>

          <Button
            className="rounded-full py-6 text-sm font-medium bg-primary hover:bg-primary/90"
            disabled={!isAvailable}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {isAvailable ? "Aggiungi al carrello" : "Non disponibile"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
