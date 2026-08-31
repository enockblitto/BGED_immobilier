import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-display text-5xl font-semibold text-navy">404</p>
      <p className="mt-2 text-gray-500">Cette page n'existe pas.</p>
      <Link to="/" className="btn-primary mt-6 inline-flex">
        Retour à l'accueil
      </Link>
    </div>
  );
}
