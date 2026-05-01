import React from 'react';
import { Sparkles, Hand, Heart, Facebook, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Hand,
    title: '100% Fatto a Mano',
    description: 'Ogni creazione è realizzata interamente a mano con tecniche tradizionali.',
  },
  {
    icon: Sparkles,
    title: 'Materiali Pregiati',
    description: 'Utilizziamo solo filati e materiali di alta qualità, selezionati con cura.',
  },
  {
    icon: Heart,
    title: 'Pezzi Unici',
    description: 'Ogni articolo è un pezzo unico, mai identico ad un altro.',
  },
];

export default function AboutSection() {
  return (
    <section className="bg-secondary/30 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-3 block">
            Chi Sono
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            L'Arte delle Mani
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
            Da anni creo con passione oggetti unici, combinando la tradizione dell'handmade 
            italiano con il design contemporaneo.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="text-center p-8 rounded-2xl bg-card border border-border/50"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-12">
          <a
            href="https://www.facebook.com/labottegadisimo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border/50 text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </a>
          <a
            href="https://www.instagram.com/labottegadisimo"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border/50 text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}