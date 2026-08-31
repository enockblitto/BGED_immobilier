import { useEffect, useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import PropertyDetail from "./pages/PropertyDetail";
import ChercheurDashboard from "./pages/ChercheurDashboard";
import SocieteDashboard from "./pages/SocieteDashboard";
import SocietePropertyForm from "./pages/SocietePropertyForm";
import NotFound from "./pages/NotFound";

export default function App() {
  const { loading, profile } = useAuth();
  const navigate = useNavigate();
  const handledRedirect = useRef(false);

  // Quand on revient sur le site après avoir cliqué sur le lien de
  // confirmation reçu par email, Supabase ajoute des paramètres à l'URL
  // (ex: #access_token=... ou ?code=...). On détecte ce cas pour rediriger
  // automatiquement vers le bon tableau de bord, une fois le profil prêt.
  useEffect(() => {
    if (handledRedirect.current || loading) return;

    const isAuthRedirect =
      window.location.hash.includes("access_token") ||
      window.location.search.includes("code=") ||
      window.location.search.includes("type=signup") ||
      window.location.search.includes("type=email_change");

    if (isAuthRedirect && profile) {
      handledRedirect.current = true;
      navigate(profile.role === "societe" ? "/espace-societe" : "/espace-chercheur", {
        replace: true,
      });
    }
  }, [loading, profile, navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recherche" element={<Search />} />
          <Route path="/biens/:id" element={<PropertyDetail />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />

          <Route path="/completer-profil" element={<CompleteProfile />} />
          <Route
            path="/mon-profil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/espace-chercheur"
            element={
              <ProtectedRoute role="chercheur">
                <ChercheurDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/espace-societe"
            element={
              <ProtectedRoute role="societe">
                <SocieteDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/espace-societe/nouveau-bien"
            element={
              <ProtectedRoute role="societe">
                <SocietePropertyForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/espace-societe/modifier/:id"
            element={
              <ProtectedRoute role="societe">
                <SocietePropertyForm />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
