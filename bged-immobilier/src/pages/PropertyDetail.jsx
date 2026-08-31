import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR").format(price);
}

export default function PropertyDetail() {
  const { id } = useParams();
  const { user, profile } = useAuth();

  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [requestError, setRequestError] = useState("");

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*, property_images(image_url), profiles!properties_owner_id_fkey(full_name, phone, city)")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      setProperty(data);
      setLoading(false);

      if (user) {
        const { data: fav } = await supabase
          .from("favorites")
          .select("id")
          .eq("user_id", user.id)
          .eq("property_id", id)
          .maybeSingle();
        setIsFavorite(!!fav);
      }
    }
    load();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) return;
    if (isFavorite) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("property_id", id);
      setIsFavorite(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, property_id: id });
      setIsFavorite(true);
    }
  };

  const sendRequest = async (e) => {
    e.preventDefault();
    setRequestError("");
    setSending(true);

    const { error } = await supabase.from("requests").insert({
      property_id: id,
      user_id: user.id,
      owner_id: property.owner_id,
      message,
    });

    setSending(false);
    if (error) {
      setRequestError("Impossible d'envoyer la demande : " + error.message);
      return;
    }
    setSent(true);
    setMessage("");
  };

  if (loading) return <Loader />;
  if (!property) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-gray-500">
        Ce bien n'existe pas ou a été retiré.
      </div>
    );
  }

  const images = property.property_images || [];
  const owner = property.profiles;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link to="/recherche" className="text-sm text-gold hover:underline">
        ← Retour aux résultats
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Galerie + description */}
        <div className="lg:col-span-2">
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
            {images.length > 0 ? (
              <img
                src={images[activeImage]?.image_url}
                alt={property.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-300">
                Pas de photo disponible
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? "border-gold" : "border-transparent"
                  }`}
                >
                  <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <h1 className="mt-6 font-display text-2xl font-semibold text-navy">
            {property.title}
          </h1>
          <p className="mt-1 text-gray-500">
            {[property.quartier, property.commune, property.city].filter(Boolean).join(", ")}
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-navy/5 px-3 py-1 text-navy">{property.type}</span>
            <span className="rounded-full bg-navy/5 px-3 py-1 text-navy">
              {property.rooms} pièce{property.rooms > 1 ? "s" : ""}
            </span>
            {property.surface && (
              <span className="rounded-full bg-navy/5 px-3 py-1 text-navy">
                {property.surface} m²
              </span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-700">
            {property.description}
          </p>
        </div>

        {/* Colonne contact */}
        <aside className="card h-fit p-5">
          <span className="price-tag !py-2">
            <span className="text-2xl font-semibold">{formatPrice(property.price)}</span>
            <span className="text-xs uppercase text-ink/40">FCFA/mois</span>
          </span>
          {owner && (
            <p className="mt-3 text-sm text-gray-500">
              Proposé par <span className="font-medium text-navy">{owner.full_name}</span>
            </p>
          )}

          {user && profile?.role === "chercheur" && (
            <button
              onClick={toggleFavorite}
              className={`btn-outline mt-4 w-full ${isFavorite ? "!bg-navy !text-white" : ""}`}
            >
              {isFavorite ? "★ Retiré des favoris" : "☆ Ajouter aux favoris"}
            </button>
          )}

          <div className="mt-5 border-t border-gray-100 pt-5">
            {!user && (
              <p className="text-sm text-gray-500">
                <Link to="/connexion" className="font-medium text-gold hover:underline">
                  Connectez-vous
                </Link>{" "}
                pour contacter cette agence.
              </p>
            )}

            {user && profile?.role === "societe" && (
              <p className="text-sm text-gray-400">
                Les demandes de visite sont réservées aux chercheurs de logement.
              </p>
            )}

            {user && profile?.role === "chercheur" && !sent && (
              <form onSubmit={sendRequest} className="space-y-3">
                <label className="label">Demande de visite / information</label>
                {requestError && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                    {requestError}
                  </p>
                )}
                <textarea
                  required
                  className="input"
                  rows={4}
                  placeholder="Bonjour, je suis intéressé(e) par ce bien..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit" disabled={sending} className="btn-primary w-full">
                  {sending ? "Envoi..." : "Envoyer la demande"}
                </button>
              </form>
            )}

            {sent && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
                Votre demande a bien été envoyée ! Suivez son statut depuis « Mon espace ».
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
