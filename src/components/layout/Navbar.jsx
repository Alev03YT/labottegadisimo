const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

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

  // Close menu on route change
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
  ];

  const navLinks = allNavLinks.filter(l => !l.adminOnly || (isAdmin === true));

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Accedi */}
<div className="flex items-center gap-3 flex-shrink-0">
  <Link to="/Home" className="flex items-center gap-2">
    <img src="https://media.db.com/images/public/69b448a22c54a90583bd1ad4/c685ee6b7_logo-mini.png" alt="La Bottega di Simo" className="h-10 w-auto" />
    <span className="font-heading text-sm font-semibold text-foreground tracking-tight">La Bottega di Simo</span>
  </Link>

  <div className="hidden lg:block text-xs text-muted-foreground max-w-xs leading-tight">
    Accedi o registrati per acquistare e tenere traccia dei tuoi ordini
  </div>

  {isAuth === false && (
    <Button
      variant="outline"
      size="sm"
      className="rounded-full text-xs"
      onClick={() => db.auth.redirectToLogin(window.location.href)}
    >
      <LogIn className="w-3.5 h-3.5 mr-1" /> Registrati / Accedi
    </Button>
  )}
</div>

          {/* Cart + Hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={onCartClick} className="relative p-2 hover:bg-secondary rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-2 hover:bg-secondary rounded-full transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="bg-background/95 backdrop-blur-md border-b border-border/50 shadow-md">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
