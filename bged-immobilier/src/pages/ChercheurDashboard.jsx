import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";
import Loader from "../components/Loader";

const STATUS_LABELS = {
  en_attente: { text: "En attente", classes: "bg-amber-100 text-amber-700" },
  repondu: { text: "Répondu", classes: "bg-green-100 text-green-700" },
  cloture: { text: "Clôturé", classes: "bg-gray-200 text-gray-600" },
};

export default function ChercheurDashboard() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState("favoris");

  const [favorites, setFavorites] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data: favs } = await supabase
        .from("favorites")
        .select("id, properties(*, property_images(image_url))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setFavorites(favs || []);

      const { data: reqs } = await supabase
        .from("requests")
        .select("*, properties(title, city, commune)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setRequests(reqs || []);

      setLoading(false);
    }
    load();
  }, [user.id]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy">
        Bonjour {profile?.full_name?.split(" ")[0] || ""} 👋
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Retrouvez vos biens favoris et le suivi de vos demandes.
      </p>

      <div className="mt-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab("favoris")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "favoris" ? "border-b-2 border-gold text-navy" : "text-gray-400"
          }`}
        >
          Mes favoris ({favorites.length})
        </button>
        <button
          onClick={() => setTab("demandes")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "demandes" ? "border-b-2 border-gold text-navy" : "text-gray-400"
          }`}
        >
          Mes demandes ({requests.length})
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader />
        ) : tab === "favoris" ? (
          favorites.length === 0 ? (
            <p className="text-gray-500">
              Vous n'avez pas encore de favoris.{" "}
              <Link to="/recherche" className="text-gold hover:underline">
                Parcourir les annonces
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((f) => (
                <PropertyCard key={f.id} property={f.properties} />
              ))}
            </div>
          )
        ) : requests.length === 0 ? (
          <p className="text-gray-500">Vous n'avez envoyé aucune demande pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => {
              const status = STATUS_LABELS[r.status] || STATUS_LABELS.en_attente;
              return (
                <div key={r.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-navy">{r.properties?.title}</p>
                      <p className="text-xs text-gray-500">
                        {[r.properties?.commune, r.properties?.city].filter(Boolean).join(", ")}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${status.classes}`}>
                      {status.text}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{r.message}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
