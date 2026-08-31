import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const STATUS_LABELS = {
  disponible: { text: "Disponible", classes: "bg-green-100 text-green-700" },
  loue: { text: "Loué", classes: "bg-gray-200 text-gray-600" },
  en_attente: { text: "En attente", classes: "bg-amber-100 text-amber-700" },
};

const REQUEST_STATUS_LABELS = {
  en_attente: { text: "En attente", classes: "bg-amber-100 text-amber-700" },
  repondu: { text: "Répondu", classes: "bg-green-100 text-green-700" },
  cloture: { text: "Clôturé", classes: "bg-gray-200 text-gray-600" },
};

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

export default function SocieteDashboard() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState("biens");

  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);

    const { data: props } = await supabase
      .from("properties")
      .select("*, property_images(image_url), requests(id)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    setProperties(props || []);

    const { data: reqs } = await supabase
      .from("requests")
      .select("*, properties(title), profiles!requests_user_id_fkey(full_name, phone)")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });
    setRequests(reqs || []);

    setLoading(false);
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const updatePropertyStatus = async (id, status) => {
    await supabase.from("properties").update({ status }).eq("id", id);
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const deleteProperty = async (id) => {
    if (!confirm("Supprimer définitivement cette annonce ?")) return;
    await supabase.from("properties").delete().eq("id", id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const updateRequestStatus = async (id, status) => {
    await supabase.from("requests").update({ status }).eq("id", id);
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-navy">
            Espace {profile?.full_name || "agence"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gérez vos annonces et les demandes reçues.
          </p>
        </div>
        <Link to="/espace-societe/nouveau-bien" className="btn-gold">
          + Publier un bien
        </Link>
      </div>

      <div className="mt-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab("biens")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "biens" ? "border-b-2 border-gold text-navy" : "text-gray-400"
          }`}
        >
          Mes biens ({properties.length})
        </button>
        <button
          onClick={() => setTab("demandes")}
          className={`px-4 py-2 text-sm font-medium ${
            tab === "demandes" ? "border-b-2 border-gold text-navy" : "text-gray-400"
          }`}
        >
          Demandes reçues ({requests.length})
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader />
        ) : tab === "biens" ? (
          properties.length === 0 ? (
            <p className="text-gray-500">
              Vous n'avez encore publié aucun bien.{" "}
              <Link to="/espace-societe/nouveau-bien" className="text-gold hover:underline">
                Publier ma première annonce
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {properties.map((p) => {
                const status = STATUS_LABELS[p.status] || STATUS_LABELS.disponible;
                return (
                  <div key={p.id} className="card flex flex-wrap items-center gap-4 p-4">
                    <img
                      src={p.property_images?.[0]?.image_url}
                      alt=""
                      className="h-16 w-24 rounded-lg object-cover bg-gray-100"
                    />
                    <div className="min-w-[180px] flex-1">
                      <Link to={`/biens/${p.id}`} className="font-medium text-navy hover:underline">
                        {p.title}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {formatPrice(p.price)} · {p.requests?.length || 0} demande(s)
                      </p>
                    </div>

                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.classes}`}>
                      {status.text}
                    </span>

                    <select
                      value={p.status}
                      onChange={(e) => updatePropertyStatus(p.id, e.target.value)}
                      className="input !w-auto !py-1.5 text-sm"
                    >
                      <option value="disponible">Disponible</option>
                      <option value="en_attente">En attente</option>
                      <option value="loue">Loué</option>
                    </select>

                    <Link
                      to={`/espace-societe/modifier/${p.id}`}
                      className="btn-outline !py-1.5 text-sm"
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => deleteProperty(p.id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                );
              })}
            </div>
          )
        ) : requests.length === 0 ? (
          <p className="text-gray-500">Aucune demande reçue pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => {
              const status = REQUEST_STATUS_LABELS[r.status] || REQUEST_STATUS_LABELS.en_attente;
              return (
                <div key={r.id} className="card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-navy">{r.properties?.title}</p>
                      <p className="text-xs text-gray-500">
                        De {r.profiles?.full_name} — {r.profiles?.phone}
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${status.classes}`}>
                      {status.text}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{r.message}</p>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => updateRequestStatus(r.id, "repondu")}
                      className="btn-outline !py-1.5 text-sm"
                    >
                      Marquer « Répondu »
                    </button>
                    <button
                      onClick={() => updateRequestStatus(r.id, "cloture")}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      Clôturer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
