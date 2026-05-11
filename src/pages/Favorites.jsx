import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS } from "@/components/categories";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
    } catch {
      setFavorites([]);
    }
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter((p) => p.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-8">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">
          Articoli salvati
        </span>

        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-7 h-7 fill-current text-primary" />
          Preferiti
        </h1>

        <p className="text-muted-foreground text-sm mt-2">
          Qui trovi gli articoli non disponibili che hai salvato.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-14 h-14 mx-auto text-muted-foreground opacity-40 mb-4" />
          <p className="text-muted-foreground mb-4">
            Non hai ancora aggiunto preferiti.
          </p>

          <Link to="/Catalog">
            <Button className="rounded-full">
              Vai al catalogo
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="group relative">
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
                </div>

                <span className="text-[10px] font-medium uppercase tracking-widest text-primary">
                  {CATEGORY_LABELS[product.category] || product.category}
                </span>

                <h3 className="font-heading text-sm font-medium text-foreground mt-0.5 leading-snug line-clamp-2">
                  {product.name}
                </h3>

                {product.price && (
                  <p className="text-sm font-semibold mt-1">
                    {product.price}€
                  </p>
                )}
              </Link>

              <button
                onClick={() => removeFavorite(product.id)}
                className="mt-2 w-full rounded-full border px-3 py-2 text-xs flex items-center justify-center gap-1 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="w-3 h-3" />
                Rimuovi
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
