import React from 'react';
import { Heart, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-primary fill-primary" />
              <span className="font-heading text-lg font-semibold">La Bottega di Simo</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Creazioni fatte a mano con amore. Ogni pezzo è unico,
              realizzato con cura e passione.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 uppercase tracking-wider">Categorie</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Borse</li>
              <li>Abbigliamento</li>
              <li>Accessori & Gioielli</li>
              <li>Amigurumi</li>
              <li>Schemi Digitali</li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4 uppercase tracking-wider">Contatti</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="mailto:info@labottegadisimo.it" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@labottegadisimo.it</span>
              </a>
              <a href="https://wa.me/393477922931" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>347-7922931 (WhatsApp)</span>
              </a>
              <a href="https://www.instagram.com/labottega_di_simo?igsh=MWxuOXpwa3IyODRjZA==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Instagram className="w-4 h-4" />
                <span>@labottegadisimo</span>
              </a>
              <a href="https://www.facebook.com/share/1CapNbtNTY/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Facebook className="w-4 h-4" />
                <span>La Bottega di Simo</span>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2026 La Bottega di Simo — Fatto a mano con ❤️ in Italia
          </p>
        </div>
      </div>
    </footer>
  );
}
