import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import PropertyCard from "../components/PropertyCard";
import Loader from "../components/Loader";
import SkylineDivider from "../components/SkylineDivider";
import Reveal from "../components/Reveal";
import CountUp from "../components/CountUp";

const STEPS = [
  {
    title: "Créez votre compte",
    text: "En tant que chercheur de logement ou société immobilière, l'inscription prend moins d'une minute.",
    icon: "M12 4v16m8-8H4",
  },
  {
    title: "Recherchez ou publiez",
    text: "Filtrez par ville et budget, ou mettez en ligne vos biens avec photos en quelques clics.",
    icon: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm10 17-4.35-4.35",
  },
  {
    title: "Échangez directement",
    text: "Envoyez ou recevez une demande de visite, suivez son statut sans passer par un intermédiaire.",
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  },
  {
    title: "Emménagez",
    text: "Finalisez les détails avec l'agence et récupérez les clés de votre nouveau logement.",
    icon: "M3 12l2-2m0 0 7-7 7 7M5 10v10a1 1 0 0 0 1 1h3m10-11 2 2m-2-2v10a1 1 0 0 1-1 1h-3m-6 0a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1m-6 0h6",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "J'ai trouvé mon appartement à Cocody en trois jours, sans passer par un démarcheur. Le suivi de ma demande était clair du début à la fin.",
    name: "Aïcha K.",
    role: "Chercheuse de logement",
  },
  {
    quote:
      "Publier nos biens et gérer les demandes reçues nous prend beaucoup moins de temps qu'avant. Tout est centralisé.",
    name: "Agence Horizon Immobilier",
    role: "Société immobilière",
  },
  {
    quote:
      "Simple, rapide, et je peux comparer plusieurs quartiers avant de me décider. Exactement ce qu'il me manquait.",
    name: "Serge B.",
    role: "Chercheur de logement",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [stats, setStats] = useState({ properties: 0, societies: 0, cities: 0 });
  const [popularCities, setPopularCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadFeatured() {
      setLoading(true);
      const { data, error } = await supabase
        .from("properties")
        .select("*, property_images(image_url)")
        .eq("status", "disponible")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) console.error(error);
      setFeatured(data || []);
      setLoading(false);
    }

    async function loadStats() {
      const { count: propertiesCount } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true })
        .eq("status", "disponible");

      const { count: societiesCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "societe");

      const { data: cityRows } = await supabase
        .from("properties")
        .select("city")
        .eq("status", "disponible");

      const counts = {};
      (cityRows || []).forEach(({ city }) => {
        if (!city) return;
        counts[city] = (counts[city] || 0) + 1;
      });
      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([city, count]) => ({ city, count }));

      setPopularCities(sorted);
      setStats({
        properties: propertiesCount || 0,
        societies: societiesCount || 0,
        cities: Object.keys(counts).length,
      });
    }

    loadFeatured();
    loadStats();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(city ? `/recherche?ville=${encodeURIComponent(city)}` : "/recherche");
  };

  return (
    <div className="overflow-x-clip">
      {/* HERO */}
      <section className="bg-lagoon-gradient relative overflow-hidden">
        {/* décorations flottantes */}
        <div className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-clay/20 blur-3xl animate-float-slow" />
        <div className="pointer-events-none absolute right-0 top-32 h-72 w-72 rounded-full bg-lagoon-light/30 blur-3xl animate-float" />

        <div className="relative mx-auto max-w-6xl px-4 pb-28 pt-16 text-center md:pt-24">
          <p className="eyebrow animate-fade-in text-clay-light">
            Location de logements · Côte d'Ivoire
          </p>
          <h1
            className="mx-auto mt-4 max-w-3xl animate-fade-in font-display text-4xl font-semibold leading-[1.1] text-white md:text-6xl"
            style={{ animationDelay: "100ms" }}
          >
            Un chez-vous, quelque part
            <br className="hidden md:block" /> entre{" "}
            <span className="text-clay-light italic">lagune</span> et ville
          </h1>
          <p
            className="mx-auto mt-5 max-w-xl animate-fade-in text-white/75"
            style={{ animationDelay: "200ms" }}
          >
            BGED Immobilier connecte les chercheurs de logement aux sociétés
            immobilières ivoiriennes, sans intermédiaire informel.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-9 flex max-w-lg animate-fade-in flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl shadow-black/20 sm:flex-row"
            style={{ animationDelay: "300ms" }}
          >
            <input
              type="text"
              placeholder="Ville : Abidjan, Bouaké, Yamoussoukro..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 rounded-xl border-0 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-clay/40"
            />
            <button type="submit" className="btn-gold">
              Rechercher
            </button>
          </form>

          {/* bandeau de stats en direct */}
          <div
            className="mx-auto mt-12 grid max-w-lg animate-fade-in grid-cols-3 gap-4 text-white"
            style={{ animationDelay: "400ms" }}
          >
            <div>
              <p className="font-mono text-2xl font-semibold text-clay-light md:text-3xl">
                <CountUp end={stats.properties} suffix="+" />
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-white/60">
                Biens disponibles
              </p>
            </div>
            <div>
              <p className="font-mono text-2xl font-semibold text-clay-light md:text-3xl">
                <CountUp end={stats.societies} suffix="+" />
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-white/60">
                Sociétés partenaires
              </p>
            </div>
            <div>
              <p className="font-mono text-2xl font-semibold text-clay-light md:text-3xl">
                <CountUp end={stats.cities} />
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-white/60">
                Villes couvertes
              </p>
            </div>
          </div>
        </div>

        <SkylineDivider className="absolute bottom-0 left-0" />
      </section>

      {/* ANNONCES RECENTES */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-4">
        <Reveal className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Fraîchement publiés</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-lagoon-deep md:text-3xl">
              Biens disponibles maintenant
            </h2>
          </div>
          <a href="/recherche" className="hidden text-sm font-semibold text-clay hover:underline sm:block">
            Voir tout →
          </a>
        </Reveal>

        {loading ? (
          <Loader />
        ) : featured.length === 0 ? (
          <p className="text-ink/50">
            Aucun bien disponible pour le moment. Revenez bientôt !
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <PropertyCard property={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* VILLES POPULAIRES */}
      {popularCities.length > 0 && (
        <section className="border-t border-ink/5 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <Reveal>
              <p className="eyebrow text-center">Par destination</p>
              <h2 className="mt-1 text-center font-display text-2xl font-semibold text-lagoon-deep md:text-3xl">
                Villes populaires
              </h2>
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {popularCities.map(({ city, count }, i) => (
                <Reveal key={city} delay={i * 70}>
                  <button
                    onClick={() => navigate(`/recherche?ville=${encodeURIComponent(city)}`)}
                    className="card group w-full p-4 text-left transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <p className="font-display text-lg font-semibold text-lagoon-deep group-hover:text-clay">
                      {city}
                    </p>
                    <p className="mt-1 font-mono text-xs text-ink/40">
                      {count} bien{count > 1 ? "s" : ""}
                    </p>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COMMENT CA MARCHE */}
      <section className="bg-sand py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <p className="eyebrow text-center">Le parcours</p>
            <h2 className="mt-1 text-center font-display text-2xl font-semibold text-lagoon-deep md:text-3xl">
              Comment ça marche
            </h2>
          </Reveal>

          <div className="relative mt-12 grid grid-cols-1 gap-10 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-ink/10 md:block" />
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 120} className="relative text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lagoon text-white shadow-md">
                  <span className="font-mono text-sm">{i + 1}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-lagoon-deep">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-ink/60">{step.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* POURQUOI BGED */}
      <section className="border-t border-ink/5 bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <p className="eyebrow text-center">Pourquoi BGED</p>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
            {[
              {
                d: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm10 17-4.35-4.35",
                title: "Recherche filtrée",
                text: "Ville, budget, type de bien, nombre de pièces : trouvez exactement ce qu'il vous faut.",
              },
              {
                d: "M3 21V9l9-6 9 6v12M9 21v-8h6v8",
                title: "Agences vérifiées",
                text: "Les annonces sont publiées directement par les sociétés immobilières.",
              },
              {
                d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
                title: "Contact direct",
                text: "Envoyez une demande de visite en un clic, suivez son statut en temps réel.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 120} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lagoon/10 text-lagoon">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d={item.d} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-lagoon-deep">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-ink/60">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="bg-lagoon-deep py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <p className="eyebrow text-center text-clay-light">Ils en parlent</p>
            <h2 className="mt-1 text-center font-display text-2xl font-semibold text-white md:text-3xl">
              Ce que dit la communauté BGED
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 130}>
                <div className="h-full rounded-2xl bg-white/5 p-6 text-white/85 ring-1 ring-white/10">
                  <p className="font-mono text-2xl text-clay-light">"</p>
                  <p className="text-sm leading-relaxed">{t.quote}</p>
                  <p className="mt-4 text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/50">{t.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-clay py-14">
        <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white">
              Vous êtes une société immobilière ?
            </h2>
            <p className="mt-2 text-white/85">
              Publiez vos biens et recevez des demandes de visite qualifiées dès aujourd'hui.
            </p>
          </div>
          <a
            href="/inscription"
            className="btn bg-white text-clay shadow-md hover:-translate-y-0.5 hover:shadow-lg"
          >
            Créer un compte société
          </a>
        </Reveal>
      </section>
    </div>
  );
}
