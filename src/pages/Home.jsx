const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';
import { useOutletContext, Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroSection from '../components/home/HeroSection';
import CategoryCards from '../components/home/CategoryCards';
import FeaturedProducts from '../components/home/FeaturedProducts';
import AboutSection from '../components/home/AboutSection';

const HERO_IMAGE = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b448a22c54a90583bd1ad4/d9d0563fb_generated_407565ef.png';
const CATEGORY_IMAGES = {
  uncinetto: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b448a22c54a90583bd1ad4/bc18bcd2f_generated_e8952fdb.png',
  ferri: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b448a22c54a90583bd1ad4/38a68fcb1_generated_06e223ea.png',
  perline: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b448a22c54a90583bd1ad4/0b26490b2_generated_f10486b3.png',
};

export default function Home() {
  const { openCart } = useOutletContext() || {};
  const queryClient = useQueryClient();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    db.auth.isAuthenticated().then(setIsAuth).catch(() => setIsAuth(false));
  }, []);

  const { data: products = [] } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => db.entities.Product.filter({ featured: true }),
    initialData: [],
  });

  const addToCartMutation = useMutation({
    mutationFn: async (product) => {
      const cartItems = await db.entities.CartItem.list();
      const existing = cartItems.find((item) => item.product_id === product.id);
      if (existing) {
        return db.entities.CartItem.update(existing.id, {
          quantity: (existing.quantity || 1) + 1,
        });
      }
      return db.entities.CartItem.create({
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        price: product.price,
        quantity: 1,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems'] });
      toast.success('Aggiunto al carrello!');
      openCart?.();
    },
  });

  const handleAddToCart = async (product) => {
    const isAuth = await db.auth.isAuthenticated();
    if (!isAuth) {
      db.auth.redirectToLogin(window.location.href);
      return;
    }
    addToCartMutation.mutate(product);
  };

  return (
    <div>
      <HeroSection heroImage={HERO_IMAGE} />
      {isAuth === false && (
        <div className="bg-primary/5 border-y border-primary/20 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-foreground font-medium">Accedi o registrati per acquistare e tenere traccia dei tuoi ordini</p>
            <Button
                size="sm"
                className="rounded-full bg-primary hover:bg-primary/90"
                onClick={() => db.auth.redirectToLogin(window.location.href)}
              >
                <LogIn className="w-4 h-4 mr-1.5" /> Registrati / Accedi
              </Button>
          </div>
        </div>
      )}
      <CategoryCards images={CATEGORY_IMAGES} />
      <FeaturedProducts products={products} onAddToCart={handleAddToCart} />
      <AboutSection />
    </div>
  );
}