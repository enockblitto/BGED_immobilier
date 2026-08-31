import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import PropertyCard from "../components/PropertyCard";
import Loader from "../components/Loader";

const TYPES = ["Maison", "Appartement", "Studio", "Villa"];

export default function Search() {
  const [searchParams] = useSearchParams();

  const [city, setCity] = useState(searchParams.get("ville") || "");
  const [type, setType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rooms, setRooms] = useState("");
  const [sort, setSort] = useState("recent");

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProperties(e) {
    if (e) e.preventDefault();
    setLoading(true);

    let query = supabase
      .from("properties")
      .select("*, property_images(image_url)")
      .eq("status", "disponible");

    if (city) query = query.ilike("city", `%${city}%`);
    if (type) query = query.eq("type", type);
    if (maxPrice) query = query.lte("price", Number(maxPrice));
    if (rooms) query = query.gte("rooms", Number(rooms));

    query =
      sort === "prix_asc"
        ? query.order("price", { ascending: true })
        : sort === "prix_desc"
        ? query.order("price", { ascending: false })
        : query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (error) console.error(error);
    setProperties(data || []);
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy">Rechercher un logement</h1>

      <form
        onSubmit={fetchProperties}
        className="card mt-6 grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5"
      >
        <div>
          <label className="label">Ville</label>
          <input
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Abidjan"
          />
        </div>

        <div>
          <label className="label">Type de bien</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Tous</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Budget max (FCFA)</label>
          <input
            type="number"
            className="input"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="300000"
          />
        </div>

        <div>
          <label className="label">Pièces min.</label>
          <input
            type="number"
            className="input"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            placeholder="2"
          />
        </div>

        <div>
          <label className="label">Trier par</label>
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">Plus récent</option>
            <option value="prix_asc">Prix croissant</option>
            <option value="prix_desc">Prix décroissant</option>
          </select>
        </div>

        <div className="sm:col-span-2 lg:col-span-5">
          <button type="submit" className="btn-primary">
            Appliquer les filtres
          </button>
        </div>
      </form>

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : properties.length === 0 ? (
          <p className="text-gray-500">Aucun bien ne correspond à votre recherche.</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-500">{properties.length} bien(s) trouvé(s)</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
