const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null, redirectToLogin:()=>{} } };

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar({ cartCount = 0, onCartClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isAuth, setIsAuth] = useState(null);
  const location = useLocation();

  useEffect(() => {
    db.auth.me()
      .then(u => { setIsAdmin(u?.role === 'admin'); setIsAuth(true); })
      .catch(() => setIsAuth(false));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const allNavLinks = [
    { label: 'Home', path: '/Home' },
    { label: 'Shop', path: '/Shop' },
    { label: 'Catalogo', path: '/Catalog' },
    { label: 'Contatti', path: '/Contacts' },
    { label: 'I Miei Ordini', path: '/Orders' },
    { label: 'Admin', path: '/Admin', adminOnly: true },
    { label: 'Preferiti', path: '/Favorites' },
  ];

  const navLinks = allNavLinks.filter(l => !l.adminOnly || (isAdmin === true));

  return (
    <header className="sticky top-0 z-50">

      {/* BARRA LOGIN SOPRA */}
      <div className="w-full bg-primary/5 border-b border-primary/20">
  <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
    <p className="text-sm text-foreground font-medium text-center sm:text-left">
      Accedi o registrati per acquistare e tenere traccia dei tuoi ordini
    </p>

    <Button
  size="sm"
  className="rounded-full bg-primary hover:bg-primary/90 whitespace-nowrap"
  onClick={() => window.location.href = "#/Login"}
  >
    <LogIn className="w-4 h-4 mr-1.5" /> Registrati / Accedi
</Button>
  </div>
</div>

      {/* NAVBAR */}
      <div className="bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

          <Link to="/Home" className="flex items-center gap-2">
            <img src="https://media.db.com/images/public/69b448a22c54a90583bd1ad4/c685ee6b7_logo-mini.png" className="h-10" />
            <span className="font-semibold text-sm">La Bottega di Simo</span>
          </Link>

          <div className="flex items-center gap-2">
            <button onClick={onCartClick} className="relative p-2">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="bg-white border-b">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} className="block p-3">
              {link.label}
            </Link>
          ))}
        </div>
      )}

    </header>
  );
}
