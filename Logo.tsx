export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden>
      <rect x="2" y="2" width="36" height="36" rx="10" fill="#C8FF3E" />
      <path d="M13 12h14M13 12v16M13 20h9" stroke="#08130F" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="29" cy="28" r="2.6" fill="#08130F" />
      <circle cx="26" cy="20" r="1.8" fill="#08130F" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-[15px] font-bold leading-none tracking-tight">
        FUTURE<span className="text-lime">/</span>TECH
        <span className="mt-1 block font-mono text-[9px] font-medium tracking-[0.3em] text-mute">EDU PLATFORM</span>
      </span>
    </span>
  );
}
