import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

import Navbar from './Navbar';
import Footer from './Footer';

export default function AppLayout() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  const loadCart = async (currentUser) => {
    if (!currentUser) {
      setCartItems([]);
      return;
    }

    const q = query(
      collection(db, "cartItems"),
      where("userId", "==", currentUser.uid)
    );

    const snap = await getDocs(q);
    setCartItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await loadCart(currentUser);
    });

    return () => unsub();
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar cartCount={cartCount} />
      <main className="flex-1">
        <Outlet context={{ refreshCart: () => loadCart(user) }} />
      </main>
      <Footer />
    </div>
  );
}
