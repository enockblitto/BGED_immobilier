// Élément signature : une silhouette stylisée d'Abidjan (immeubles + pont sur la
// lagune) qui referme la section héro et ancre l'identité "lagune" du site.
export default function SkylineDivider({ className = "" }) {
  return (
    <svg
      viewBox="0 0 1440 110"
      preserveAspectRatio="none"
      className={`block w-full ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 70 L60 70 L60 40 L100 40 L100 60 L140 60 L140 20 L180 20 L180 55 L230 55
           L230 35 L270 35 L270 65 L330 65 L330 15 L380 15 L380 50 L420 50 L420 30 L460 30
           L460 68 L520 68 L520 45 L560 45 L560 60 L610 60 L610 25 L660 25 L660 55 L700 55
           L700 40 L760 40 L760 12 L800 12 L800 58 L850 58 L850 33 L900 33 L900 63 L950 63
           L950 42 L1000 42 L1000 20 L1050 20 L1050 60 L1110 60 L1110 38 L1150 38 L1150 66
           L1210 66 L1210 28 L1260 28 L1260 55 L1320 55 L1320 45 L1380 45 L1380 68 L1440 68
           L1440 110 L0 110 Z"
        className="fill-lagoon-deep"
      />
      <path
        d="M0 78 C 180 40, 340 100, 520 68 S 900 30, 1080 72 S 1320 50, 1440 78 L1440 110 L0 110 Z"
        className="fill-sand"
      />
    </svg>
  );
}
