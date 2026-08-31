import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import PasswordField from "../components/PasswordField";
import LogoMark from "../components/LogoMark";

const BENEFITS = {
  chercheur: [
    "Recherchez par ville, budget et type de bien",
    "Enregistrez vos favoris",
    "Suivez le statut de vos demandes de visite",
  ],
  societe: [
    "Publiez vos biens avec plusieurs photos",
    "Gérez le statut de chaque annonce",
    "Recevez et répondez aux demandes reçues",
  ],
};

const PENDING_PROFILE_KEY = "bged_pending_profile";

export default function Register() {
  const { signUp, syncProfile } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("chercheur");

  // Compte
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profil (les libellés changent selon le rôle sélectionné)
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setLoading(false);
      setError(
        signUpError.message.includes("already registered")
          ? "Un compte existe déjà avec cet email."
          : signUpError.message
      );
      return;
    }

    const profileData = { role, full_name: fullName, phone, city };

    if (data.session) {
      // Confirmation d'email désactivée : session immédiate, on peut créer
      // le profil et accéder directement au tableau de bord.
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: data.session.user.id, ...profileData });

      setLoading(false);

      if (profileError) {
        setError(
          "Votre compte a été créé mais le profil n'a pas pu être enregistré : " +
            profileError.message
        );
        return;
      }

      await syncProfile(data.session.user.id);
      navigate(role === "societe" ? "/espace-societe" : "/espace-chercheur");
    } else {
      // Confirmation d'email requise : on mémorise les informations pour
      // compléter automatiquement le profil dès la première connexion.
      localStorage.setItem(PENDING_PROFILE_KEY, JSON.stringify(profileData));
      setLoading(false);
      setMessage(
        "Compte créé ! Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous : votre profil sera complété automatiquement."
      );
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-2">
      {/* Panneau gauche - formulaire */}
      <div className="order-2 flex items-center justify-center px-4 py-12 md:order-1">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 text-lagoon-deep md:hidden">
            <LogoMark className="h-6 w-6 text-clay" />
            <span className="font-display text-lg font-semibold">BGED Immobilier</span>
          </Link>

          <h2 className="font-display text-2xl font-semibold text-lagoon-deep">
            Créer un compte
          </h2>
          <p className="mt-1 text-sm text-ink/50">
            Choisissez le type de compte qui vous correspond.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}
            {message && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
            )}

            {!message && (
              <>
                <div>
                  <label className="label">Je suis...</label>
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
                      🔎 Chercheur
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
                      🏢 Société
                    </button>
                  </div>
                </div>

                {/* --- Section identité : change selon le rôle --- */}
                <div className="space-y-4 rounded-xl border border-clay/20 bg-clay/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-clay">
                    {role === "societe"
                      ? "Informations sur la société"
                      : "Informations personnelles"}
                  </p>

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
                      placeholder={role === "societe" ? "Horizon Immobilier" : "Aïcha Koffi"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label">Téléphone</label>
                      <input
                        type="tel"
                        required
                        className="input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+225 07 00 00 00 00"
                      />
                    </div>
                    <div>
                      <label className="label">Ville</label>
                      <input
                        type="text"
                        required
                        className="input"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Abidjan"
                      />
                    </div>
                  </div>
                </div>

                {/* --- Section compte --- */}
                <div className="space-y-4">
                  <div>
                    <label className="label">Adresse email</label>
                    <input
                      type="email"
                      required
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                    />
                  </div>

                  <PasswordField
                    label="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6 caractères minimum"
                    minLength={6}
                  />

                  <PasswordField
                    label="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ressaisissez le mot de passe"
                    minLength={6}
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-gold w-full">
                  {loading ? "Création en cours..." : "Créer mon compte"}
                </button>
              </>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-ink/50">
            Déjà inscrit ?{" "}
            <Link to="/connexion" className="font-semibold text-clay hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Panneau droit - avantages selon le rôle */}
      <div className="order-1 relative hidden flex-col justify-between overflow-hidden bg-clay p-10 text-white md:order-2 md:flex">
        <div className="pointer-events-none absolute -right-14 top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-float" />

        <Link to="/" className="flex items-center gap-2">
          <LogoMark className="h-7 w-7 text-white" />
          <span className="font-display text-xl font-semibold">BGED Immobilier</span>
        </Link>

        <div className="relative">
          <p className="eyebrow text-white/70">
            {role === "societe" ? "Espace société immobilière" : "Espace chercheur de logement"}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
            {role === "societe"
              ? "Publiez vos biens, atteignez plus de locataires."
              : "Trouvez un logement qui vous ressemble."}
          </h1>

          <ul className="mt-6 space-y-3">
            {BENEFITS[role].map((b) => (
              <li key={b} className="flex items-start gap-2 text-white/85">
                <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/50">
          © {new Date().getFullYear()} BGED Immobilier
        </p>
      </div>
    </div>
  );
}
