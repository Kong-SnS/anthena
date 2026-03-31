"use client"

export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#ffdde1]" />
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gold/40">
        <path
          d="M12 2L13.5 8.5L20 7L15 12L20 17L13.5 15.5L12 22L10.5 15.5L4 17L9 12L4 7L10.5 8.5L12 2Z"
          fill="currentColor"
        />
      </svg>
      <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#ee9ca7]" />
    </div>
  )
}
