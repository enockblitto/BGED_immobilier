import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

const PENDING_PROFILE_KEY = "bged_pending_profile";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupère le profil (table "profiles") lié à l'utilisateur connecté.
  // Si aucun profil n'existe encore mais que des informations d'inscription
  // ont été mémorisées localement (cas d'une confirmation d'email requise),
  // on complète automatiquement le profil ici, sans action de l'utilisateur.
  const fetchProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return null;
    }

    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Erreur de récupération du profil :", error.message);
      setProfile(null);
      return null;
    }

    if (!data) {
      const pending = localStorage.getItem(PENDING_PROFILE_KEY);
      if (pending) {
        try {
          const pendingProfile = JSON.parse(pending);
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({ id: userId, ...pendingProfile });

          if (!insertError) {
            localStorage.removeItem(PENDING_PROFILE_KEY);
            const retry = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userId)
              .maybeSingle();
            data = retry.data;
          } else {
            console.error("Complétion automatique du profil impossible :", insertError.message);
          }
        } catch (e) {
          console.error("Données d'inscription en attente invalides :", e);
        }
      }
    }

    setProfile(data);
    return data;
  }, []);

  useEffect(() => {
    // 1. On récupère la session existante au chargement de l'app
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) await fetchProfile(session.user.id);
      setLoading(false);
    });

    // 2. On écoute les changements (connexion / déconnexion / refresh de token)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile]);

  const signUp = async (email, password) => {
    return supabase.auth.signUp({ email, password });
  };

  const signIn = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const refreshProfile = async () => {
    if (session?.user) return fetchProfile(session.user.id);
  };

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    // Permet de resynchroniser le profil juste après une inscription,
    // sans dépendre du timing de mise à jour de `session` dans le contexte.
    syncProfile: fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>");
  return ctx;
}
