# BGED Immobilier

Application web de recherche et de mise en location de logements en Côte d'Ivoire, construite avec **React (Vite)** et **Supabase**.

Deux types de compte :
- **Chercheur de logement** : recherche, favoris, demandes de visite.
- **Société immobilière** : publication et gestion des annonces, suivi des demandes reçues.

---

## 1. Prérequis

- Node.js 18+ installé
- Un compte gratuit sur [supabase.com](https://supabase.com)

## 2. Créer le projet Supabase

1. Sur [supabase.com](https://supabase.com), cliquez sur **New project**.
2. Une fois le projet créé, allez dans **SQL Editor** → **New query**.
3. Copiez-collez tout le contenu du fichier [`supabase/schema.sql`](./supabase/schema.sql) et cliquez sur **Run**.
   Cela crée les 5 tables (`profiles`, `properties`, `property_images`, `favorites`, `requests`), leurs règles de sécurité (RLS), et les 2 buckets de stockage (`avatars`, `properties`).
4. (Optionnel mais recommandé pour tester facilement) : allez dans **Authentication → Providers → Email** et désactivez **Confirm email**, le temps de vos tests. Vous pourrez le réactiver plus tard.
5. Allez dans **Project Settings → API** et notez :
   - `Project URL`
   - `anon public` key

### Insérer des données de démonstration (optionnel)

Pour obtenir tout de suite des résultats dans la recherche, vous pouvez insérer
une vingtaine de biens de démonstration (avec photos) répartis dans plusieurs villes :

1. Lancez l'application, créez au moins un compte **Société immobilière** et complétez son profil.
2. Ouvrez [`supabase/seed.sql`](./supabase/seed.sql) et collez-le tel quel dans
   **SQL Editor → New query**, puis cliquez sur **Run**.
   (Le script détecte automatiquement le ou les comptes société existants — rien à modifier à la main.)
3. Rafraîchissez la page de recherche : les biens apparaissent avec des photos
   thématisées (villa, maison, appartement, studio) fournies par LoremFlickr.

### Si les biens n'apparaissent pas

- Vérifiez dans **SQL Editor** que le script `seed.sql` s'est terminé sans erreur
  (bandeau rouge = le script s'est arrêté, aucune ligne n'a été insérée : le plus souvent
  parce qu'aucun compte société n'existait encore).
- Vérifiez dans **Table Editor → properties** que des lignes existent bien.
- Vérifiez que `.env` contient les **bonnes** valeurs `VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY` (celles de **ce** projet Supabase), puis relancez `npm run dev`
  après toute modification de `.env`.
- Faites un rafraîchissement complet du navigateur (Ctrl+Maj+R) : Vite met parfois en cache
  l'ancien build.
- Si vous êtes connecté en tant que société, les biens des **autres** sociétés ne
  s'affichent que dans la recherche publique, pas dans « Mon espace » (qui ne montre que vos propres biens).


## 3. Configurer le projet React

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env
```

Ouvrez `.env` et renseignez vos clés Supabase :

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
```

## 4. Lancer l'application

```bash
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

## 5. Tester le parcours complet

1. Créez un compte **Société immobilière** → complétez le profil → publiez un bien (avec photos).
2. Déconnectez-vous, créez un compte **Chercheur de logement**.
3. Recherchez le bien publié, ajoutez-le en favori, envoyez une demande de visite.
4. Reconnectez-vous avec le compte société : ouvrez « Demandes reçues » et marquez la demande comme « Répondu ».

---

## Structure du projet

```
src/
  lib/supabaseClient.js       -> connexion à Supabase
  context/AuthContext.jsx     -> session, profil, connexion/déconnexion
  components/                 -> Navbar, PropertyCard, ProtectedRoute, Loader...
  pages/
    Home.jsx                  -> page d'accueil
    Login.jsx / Register.jsx  -> authentification
    CompleteProfile.jsx       -> choix du rôle + infos de profil
    Profile.jsx                -> consultation / édition du profil (photo, nom, tél, ville)
    Search.jsx                -> recherche filtrée
    PropertyDetail.jsx        -> fiche d'un bien + demande de visite
    ChercheurDashboard.jsx    -> espace chercheur (favoris, demandes)
    SocieteDashboard.jsx      -> espace société (biens, demandes reçues)
    SocietePropertyForm.jsx   -> création / modification d'une annonce
supabase/schema.sql           -> script SQL complet (tables + RLS + storage)
```

## Notions clés à observer pour progresser

- **Inscription en une étape** : depuis la dernière version, `Register.jsx` collecte directement le nom, le téléphone et la ville (avec des libellés qui changent selon « Chercheur » ou « Société »), en plus de l'email et du mot de passe. Le profil est créé juste après l'inscription — plus besoin d'une page séparée dans le cas courant (confirmation d'email désactivée).
- **Cas où la confirmation d'email est activée** : les informations saisies sont mémorisées dans `localStorage` (`bged_pending_profile`) et appliquées automatiquement à la première connexion, dans `AuthContext.jsx` (fonction `fetchProfile`). `CompleteProfile.jsx` ne sert plus que de filet de sécurité si jamais cette étape automatique échoue.
- **`AuthContext.jsx`** : comment partager l'état de connexion (session Supabase) à toute l'application via le Context API et les Hooks (`useState`, `useEffect`, `useContext`).
- **`supabase.from("table").select()/insert()/update()/delete()`** : la syntaxe du client Supabase, utilisée dans toutes les pages.
- **Row Level Security (`supabase/schema.sql`)** : chaque table définit qui a le droit de lire/écrire quoi. C'est la base de la sécurité d'une app Supabase.
- **`ProtectedRoute.jsx`** : comment restreindre l'accès à certaines pages selon la connexion et le rôle.
- **Upload de fichiers (`SocietePropertyForm.jsx`)** : `supabase.storage.from(bucket).upload()` puis `getPublicUrl()`.

## Prochaines pistes d'évolution

- Notifications par email lors d'une nouvelle demande (via une Supabase Edge Function).
- Pagination des résultats de recherche.
- Système d'avis/notes sur les sociétés immobilières.
- Carte interactive des biens (Leaflet / Google Maps).
