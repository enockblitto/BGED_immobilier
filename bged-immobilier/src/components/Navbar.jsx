import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoMark from "./LogoMark";

function initials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";
}

export default function Navbar() {
  const { session, user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await signOut();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium tracking-tight transition-colors ${
      isActive ? "text-clay" : "text-white/80 hover:text-white"
    }`;

  const spaceLink =
    profile?.role === "societe" ? "/espace-societe" : "/espace-chercheur";

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-lagoon-deep/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link to="/" className="flex items-center gap-2 text-white">
          <LogoMark className="h-6 w-6 text-clay" />
          <span className="font-display text-xl font-semibold">
            BGED <span className="text-clay">Immobilier</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <NavLink to="/" className={linkClass} end>
            Accueil
          </NavLink>
          <NavLink to="/recherche" className={linkClass}>
            Rechercher
          </NavLink>

          {!session && (
            <>
              <NavLink to="/connexion" className={linkClass}>
                Connexion
              </NavLink>
              <Link to="/inscription" className="btn-gold !py-2">
                Créer un compte
              </Link>
            </>
          )}

          {session && profile?.role === "chercheur" && (
            <NavLink to="/espace-chercheur" className={linkClass}>
              Mon espace
            </NavLink>
          )}

          {session && profile?.role === "societe" && (
            <NavLink to="/espace-societe" className={linkClass}>
              Mon espace agence
            </NavLink>
          )}

          {session && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-sm text-white transition hover:bg-white/15"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-clay font-mono text-xs font-semibold text-white">
                    {initials(profile?.full_name)}
                  </span>
                )}
                <span className="hidden max-w-[100px] truncate lg:inline">
                  {profile?.full_name?.split(" ")[0] || "Profil"}
                </span>
                <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${menuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-black/5">
                  <div className="flex items-center gap-3 border-b border-ink/5 p-4">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-clay font-mono text-sm font-semibold text-white">
                        {initials(profile?.full_name)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-lagoon-deep">
                        {profile?.full_name}
                      </p>
                      <p className="truncate text-xs text-ink/45">{user?.email}</p>
                    </div>
                  </div>
                  <div className="p-1.5 text-sm">
                    <Link
                      to="/mon-profil"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-ink/80 hover:bg-sand"
                    >
                      Mon profil
                    </Link>
                    <Link
                      to={spaceLink}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-ink/80 hover:bg-sand"
                    >
                      Mon espace
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-red-500 hover:bg-red-50"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
