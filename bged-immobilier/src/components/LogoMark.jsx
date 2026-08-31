export default function LogoMark({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M4 15.5 L16 6 L28 15.5" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 14 V25 A1.5 1.5 0 0 0 9.5 26.5 H22.5 A1.5 1.5 0 0 0 24 25 V14" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="19.5" r="2.1" fill="currentColor" />
    </svg>
  );
}
