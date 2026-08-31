import { Link } from "react-router-dom";
import { useState } from "react";

const STATUS_LABELS = {
  disponible: { text: "Disponible", classes: "bg-lagoon-light/15 text-lagoon" },
  loue: { text: "Loué", classes: "bg-ink/10 text-ink/50" },
  en_attente: { text: "En attente", classes: "bg-clay/15 text-clay" },
};

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR").format(price);
}

export default function PropertyCard({ property }) {
  const image = property.property_images?.[0]?.image_url;
  const [imgError, setImgError] = useState(false);
  const status = STATUS_LABELS[property.status] || STATUS_LABELS.disponible;

  return (
    <Link
      to={`/biens/${property.id}`}
      className="card group block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(8,47,48,0.35)]"
    >
      <div className="relative h-48 w-full overflow-hidden bg-ink/5">
        {image && !imgError ? (
          <img
            src={image}
            alt={property.title}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink/25">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 16 5-5 4 4 3-3 6 6" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8.5" cy="9" r="1.5" />
            </svg>
            <span className="text-xs">Photo indisponible</span>
          </div>
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur ${status.classes}`}
        >
          {status.text}
        </span>
      </div>

      <div className="p-4">
        <p className="font-display text-lg font-semibold text-lagoon-deep line-clamp-1">
          {property.title}
        </p>
        <p className="mt-0.5 text-sm text-ink/50">
          {[property.commune, property.city].filter(Boolean).join(", ")}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="price-tag">
            <span className="text-sm font-semibold">{formatPrice(property.price)}</span>
            <span className="text-[10px] uppercase text-ink/40">FCFA/mois</span>
          </span>
          <span className="text-xs text-ink/40">
            {property.rooms} pièce{property.rooms > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
