import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import Loader from "../components/Loader";

function initials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

export default function Profile() {
  const { user, profile, loading, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [city, setCity] = useState(profile?.city || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (loading || !profile) return <Loader />;

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError("Erreur lors de l'envoi de la photo : " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(pub.publicUrl);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, city, avatar_url: avatarUrl })
      .eq("id", user.id);

    setSaving(false);
    if (error) {
      setError("Impossible d'enregistrer : " + error.message);
      return;
    }
    await refreshProfile();
    setMessage("Profil mis à jour avec succès.");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="eyebrow">
        {profile.role === "societe" ? "Société immobilière" : "Chercheur de logement"}
      </p>
      <h1 className="mt-1 font-display text-2xl font-semibold text-lagoon-deep">
        Mon profil
      </h1>

      <div className="card mt-6 p-6">
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-clay font-mono text-lg font-semibold text-white">
              {initials(fullName)}
            </span>
          )}
          <div>
            <label className="btn-outline cursor-pointer !py-1.5 text-sm">
              {uploading ? "Envoi..." : "Changer la photo"}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
            <p className="mt-1 text-xs text-ink/40">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          {message && (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
          )}

          <div>
            <label className="label">
              {profile.role === "societe" ? "Nom de la société" : "Nom complet"}
            </label>
            <input
              required
              className="input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Adresse email</label>
            <input className="input bg-ink/5" value={user?.email || ""} disabled />
            <p className="mt-1 text-xs text-ink/40">
              L'email de connexion ne peut pas être modifié ici.
            </p>
          </div>

          <div>
            <label className="label">Téléphone</label>
            <input
              type="tel"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+225 07 00 00 00 00"
            />
          </div>

          <div>
            <label className="label">Ville</label>
            <input
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Abidjan"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
}
