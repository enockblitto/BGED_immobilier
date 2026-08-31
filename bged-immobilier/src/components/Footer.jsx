import LogoMark from "./LogoMark";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-ink/5 bg-lagoon-deep">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-white/60">
        <div className="flex items-center gap-2 text-white">
          <LogoMark className="h-5 w-5 text-clay" />
          <p className="font-display text-base font-semibold">BGED Immobilier</p>
        </div>
        <p className="mt-2 max-w-sm">
          Trouvez votre prochaine location en Côte d'Ivoire, en toute simplicité.
        </p>
        <p className="mt-6 text-xs text-white/35">
          © {new Date().getFullYear()} BGED Immobilier — Projet d'apprentissage React &amp; Supabase.
        </p>
      </div>
    </footer>
  );
}
