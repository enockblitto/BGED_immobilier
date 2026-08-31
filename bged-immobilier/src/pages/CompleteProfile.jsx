import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";

const PENDING_PROFILE_KEY = "bged_pending_profile";

// Cette page ne sert plus qu'en dernier recours : normalement, le profil
// est déjà créé pendant l'inscription (ou automatiquement à la première
// connexion si une confirmation d'email était requise). Si l'utilisateur
// atterrit malgré tout ici, on préremplit avec les infos mémorisées.
function getPendingProfile() {
  try {
    const raw = localStorage.getItem(PENDING_PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CompleteProfile() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const pending = getPendingProfile();

  const [role, setRole] = useState(pending?.role || "chercheur");
  const [fullName, setFullName] = useState(pending?.full_name || "");
  const [phone, setPhone] = useState(pending?.phone || "");
  const [city, setCity] = useState(pending?.city || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  if (loading) return null;
  if (!user) return <Navigate to="/connexion" replace />;
  if (profile) return <Navigate to="/" replace />; // profil déjà complété

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const { error } = await supabase.from("profiles").insert({
      id: user.id,
      role,
      full_name: fullName,
      phone,
      city,
    });

    setSaving(false);

    if (error) {
      setError("Impossible d'enregistrer le profil : " + error.message);
      return;
    }

    localStorage.removeItem(PENDING_PROFILE_KEY);
    await refreshProfile();
    navigate(role === "societe" ? "/espace-societe" : "/espace-chercheur");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-center font-display text-2xl font-semibold text-lagoon-deep">
        Complétez votre profil
      </h1>
      <p className="mt-1 text-center text-sm text-ink/50">
        Encore une étape avant d'accéder à votre espace.
      </p>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <div>
          <label className="label">Type de compte</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("chercheur")}
              className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition ${
                role === "chercheur"
                  ? "border-clay bg-clay/10 text-lagoon-deep"
                  : "border-ink/10 text-ink/50"
              }`}
            >
              🔎 Chercheur de logement
            </button>
            <button
              type="button"
              onClick={() => setRole("societe")}
              className={`rounded-xl border-2 px-3 py-3 text-sm font-medium transition ${
                role === "societe"
                  ? "border-clay bg-clay/10 text-lagoon-deep"
                  : "border-ink/10 text-ink/50"
              }`}
            >
              🏢 Société immobilière
            </button>
          </div>
        </div>

        <div>
          <label className="label">
            {role === "societe" ? "Nom de la société" : "Nom complet"}
          </label>
          <input
            type="text"
            required
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Téléphone</label>
          <input
            type="tel"
            required
            className="input"
            placeholder="+225 07 00 00 00 00"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="label">Ville</label>
          <input
            type="text"
            required
            className="input"
            placeholder="Abidjan"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? "Enregistrement..." : "Valider mon profil"}
        </button>
      </form>
    </div>
  );
}
