import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordField from "../components/PasswordField";
import LogoMark from "../components/LogoMark";

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);

    setLoading(false);
    if (error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    navigate("/");
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 md:grid-cols-2">
      {/* Panneau gauche - identité */}
      <div className="bg-lagoon-gradient relative hidden flex-col justify-between overflow-hidden p-10 text-white md:flex">
        <div className="pointer-events-none absolute -left-10 bottom-10 h-64 w-64 rounded-full bg-clay/15 blur-3xl animate-float-slow" />
        <Link to="/" className="flex items-center gap-2">
          <LogoMark className="h-7 w-7 text-clay-light" />
          <span className="font-display text-xl font-semibold">BGED Immobilier</span>
        </Link>

        <div className="relative">
          <p className="eyebrow text-clay-light">Content de vous revoir</p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">
            Reprenez votre recherche
            <br /> là où vous l'aviez laissée.
          </h1>
          <p className="mt-4 max-w-sm text-white/70">
            Retrouvez vos favoris, le suivi de vos demandes, ou vos annonces
            publiées en un instant.
          </p>
        </div>

        <p className="relative text-xs text-white/40">
          © {new Date().getFullYear()} BGED Immobilier
        </p>
      </div>

      {/* Panneau droit - formulaire */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 text-lagoon-deep md:hidden">
            <LogoMark className="h-6 w-6 text-clay" />
            <span className="font-display text-lg font-semibold">BGED Immobilier</span>
          </Link>

          <h2 className="font-display text-2xl font-semibold text-lagoon-deep">Connexion</h2>
          <p className="mt-1 text-sm text-ink/50">Accédez à votre espace BGED Immobilier.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

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
              placeholder="••••••••"
            />

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-ink/50">
            Pas encore de compte ?{" "}
            <Link to="/inscription" className="font-semibold text-clay hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
