export default function Loader({ label = "Chargement..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-navy">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy/20 border-t-navy" />
      <p className="mt-3 text-sm text-gray-500">{label}</p>
    </div>
  );
}
