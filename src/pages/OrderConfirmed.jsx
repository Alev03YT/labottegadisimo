import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function OrderConfirmed() {
  const [searchParams] = useSearchParams();
  const order = searchParams.get("order");

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">
        🎉 Ordine ricevuto!
      </h1>

      <p className="text-lg mb-6">
        Grazie per il tuo acquisto.
      </p>

      <div className="border rounded-2xl p-6 bg-white shadow mb-8">
        <p className="text-sm text-muted-foreground">
          Numero ordine
        </p>

        <p className="text-2xl font-bold mt-2">
          {order}
        </p>
      </div>

      <p className="mb-8">
        Conserva questo numero per qualsiasi comunicazione.
      </p>

      <Link to="/Shop">
        <Button className="rounded-full">
          Torna allo Shop
        </Button>
      </Link>
    </div>
  );
}
