import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

/**
 * Protège une route :
 * - redirige vers /connexion si personne n'est connecté
 * - redirige vers /completer-profil si le profil n'existe pas encore
 * - si `role` est fourni, vérifie que le profil correspond à ce rôle
 */
export default function ProtectedRoute({ children, role }) {
  const { session, profile, loading } = useAuth();

  if (loading) return <Loader />;

  if (!session) return <Navigate to="/connexion" replace />;

  if (!profile) return <Navigate to="/completer-profil" replace />;

  if (role && profile.role !== role) return <Navigate to="/" replace />;

  return children;
}
