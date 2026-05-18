import React, { useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputClass =
    "border rounded-xl px-4 py-3 w-full text-[16px] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  const submit = async (e) => {
    e.preventDefault();

    try {
      if (mode === "register") {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(res.user, {
          displayName: name,
        });

        await setDoc(doc(db, "users", res.user.uid), {
          name,
          email,
          role: "customer",
          createdAt: serverTimestamp(),
        });

        navigate("/Home");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/Home");
      }
    } catch (err) {
      console.error(err);
      alert("Errore: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 overflow-x-hidden">
      <h1 className="font-heading text-3xl font-bold mb-6">
        {mode === "login" ? "Accedi" : "Registrati"}
      </h1>

      <form onSubmit={submit} className="space-y-3">
        {mode === "register" && (
          <input
            className={inputClass}
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          className={inputClass}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className={inputClass}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button className="w-full rounded-full py-6 text-[16px]" type="submit">
          {mode === "login" ? "Accedi" : "Registrati"}
        </Button>
      </form>

      <button
        className="mt-4 text-[16px] text-primary underline"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login"
          ? "Non hai un account? Registrati"
          : "Hai già un account? Accedi"}
      </button>
    </div>
  );
}
