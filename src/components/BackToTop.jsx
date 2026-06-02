import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      setVisible(scrollTop > 120);
    };

    window.addEventListener("scroll", checkScroll, { passive: true });
    document.addEventListener("scroll", checkScroll, { passive: true });

    checkScroll();

    return () => {
      window.removeEventListener("scroll", checkScroll);
      document.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        document.body.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={`fixed bottom-5 right-5 z-[9999] w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      aria-label="Torna su"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
