import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const TYPES = ["Maison", "Appartement", "Studio", "Villa"];

const emptyForm = {
  title: "",
  description: "",
  type: "Maison",
  price: "",
  city: "",
  commune: "",
  quartier: "",
  rooms: "",
  surface: "",
};

export default function SocietePropertyForm() {
  const { id } = useParams(); // présent uniquement en mode "modification"
  const isEditing = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    async function load() {
      const { data, error } = await supabase
        .from("properties")
        .select("*, property_images(id, image_url)")
        .eq("id", id)
        .single();
      if (error) {
        setError(error.message);
      } else {
        setForm({
          title: data.title,
          description: data.description || "",
          type: data.type,
          price: data.price,
          city: data.city,
          commune: data.commune || "",
          quartier: data.quartier || "",
          rooms: data.rooms,
          surface: data.surface || "",
        });
        setExistingImages(data.property_images || []);
      }
      setLoading(false);
    }
    load();
  }, [id, isEditing]);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const removeExistingImage = async (imageId) => {
    await supabase.from("property_images").delete().eq("id", imageId);
    setExistingImages((imgs) => imgs.filter((i) => i.id !== imageId));
  };

  const uploadImages = async (propertyId) => {
    for (const file of newFiles) {
      const path = `${user.id}/${propertyId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("properties")
        .upload(path, file);
      if (uploadError) {
        console.error("Erreur upload image :", uploadError.message);
        continue;
      }
      const { data: pub } = supabase.storage.from("properties").getPublicUrl(path);
      await supabase
        .from("property_images")
        .insert({ property_id: propertyId, image_url: pub.publicUrl });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      title: form.title,
      description: form.description,
      type: form.type,
      price: Number(form.price),
      city: form.city,
      commune: form.commune,
      quartier: form.quartier,
      rooms: Number(form.rooms),
      surface: form.surface ? Number(form.surface) : null,
    };

    try {
      if (isEditing) {
        const { error } = await supabase.from("properties").update(payload).eq("id", id);
        if (error) throw error;
        await uploadImages(id);
      } else {
        const { data, error } = await supabase
          .from("properties")
          .insert({ ...payload, owner_id: user.id })
          .select()
          .single();
        if (error) throw error;
        await uploadImages(data.id);
      }
      navigate("/espace-societe");
    } catch (err) {
      setError("Erreur lors de l'enregistrement : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-navy">
        {isEditing ? "Modifier l'annonce" : "Publier un nouveau bien"}
      </h1>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4 p-6">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <div>
          <label className="label">Titre de l'annonce</label>
          <input
            required
            className="input"
            value={form.title}
            onChange={handleChange("title")}
            placeholder="Belle villa 4 pièces à Cocody"
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            required
            rows={5}
            className="input"
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Décrivez le bien, les équipements, l'environnement..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Type de bien</label>
            <select className="input" value={form.type} onChange={handleChange("type")}>
              {TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Loyer mensuel (FCFA)</label>
            <input
              type="number"
              required
              className="input"
              value={form.price}
              onChange={handleChange("price")}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Ville</label>
            <input required className="input" value={form.city} onChange={handleChange("city")} />
          </div>
          <div>
            <label className="label">Commune</label>
            <input className="input" value={form.commune} onChange={handleChange("commune")} />
          </div>
          <div>
            <label className="label">Quartier</label>
            <input className="input" value={form.quartier} onChange={handleChange("quartier")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Nombre de pièces</label>
            <input
              type="number"
              required
              className="input"
              value={form.rooms}
              onChange={handleChange("rooms")}
            />
          </div>
          <div>
            <label className="label">Superficie (m²)</label>
            <input
              type="number"
              className="input"
              value={form.surface}
              onChange={handleChange("surface")}
            />
          </div>
        </div>

        {existingImages.length > 0 && (
          <div>
            <label className="label">Photos actuelles</label>
            <div className="flex flex-wrap gap-2">
              {existingImages.map((img) => (
                <div key={img.id} className="relative">
                  <img src={img.image_url} alt="" className="h-20 w-28 rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="label">
            {isEditing ? "Ajouter des photos" : "Photos du bien"}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewFiles(Array.from(e.target.files))}
            className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-navy file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Publier l'annonce"}
        </button>
      </form>
    </div>
  );
}
