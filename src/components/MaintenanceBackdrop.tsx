export function MaintenanceBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Big Toilet Paper Roll (left) */}
      <svg
        className="cc-float text-[#132238] dark:text-slate-300"
        style={{ left: '3%', animationDuration: '18s', animationDelay: '-3s' }}
        width="116"
        height="116"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="28" cy="22" rx="16" ry="9" fill="#FFFFFF" className="dark:fill-slate-800" />
        <ellipse cx="28" cy="22" rx="5" ry="2.8" fill="#D95D39" stroke="#D95D39" />
        <path d="M12 22v20c0 5 7.2 9 16 9s16-4 16-9V22" fill="#FFFFFF" className="dark:fill-slate-800" />
        <path d="M44 26h8v24c0 2-1.5 3-3 2l-2-1.5-2 1.5-3-2V26z" fill="#FFFFFF" className="dark:fill-slate-800" />
        <line x1="46" y1="35" x2="50" y2="35" strokeDasharray="2 2" />
        <line x1="46" y1="43" x2="50" y2="43" strokeDasharray="2 2" />
      </svg>

      {/* 2. Big Leaking Tap + Drop (mid-left) */}
      <svg
        className="cc-float"
        style={{ left: '20%', animationDuration: '23s', animationDelay: '-10s' }}
        width="110"
        height="110"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#1B6B5A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 26h26a10 10 0 0 1 10 10v4h-8v-4a2 2 0 0 0-2-2H10v-8z" fill="#FFFFFF" className="dark:fill-slate-800" />
        <line x1="22" y1="16" x2="22" y2="26" />
        <line x1="15" y1="16" x2="29" y2="16" />
        <path d="M42 46c0 3.5-4 8-4 8s-4-4.5-4-8a4 4 0 0 1 8 0z" fill="#38BDF8" stroke="#0284C7" />
      </svg>

      {/* 3. Big Spinning Ceiling Fan (center) */}
      <svg
        className="cc-float text-[#132238] dark:text-slate-200"
        style={{ left: '43%', animationDuration: '20s', animationDelay: '-6s' }}
        width="124"
        height="124"
        viewBox="0 0 64 64"
        fill="none"
      >
        <g className="cc-spin" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <ellipse cx="32" cy="14" rx="5.5" ry="11.5" fill="#D95D39" fillOpacity="0.45" />
          <ellipse cx="47" cy="41" rx="5.5" ry="11.5" transform="rotate(120 47 41)" fill="#D95D39" fillOpacity="0.45" />
          <ellipse cx="17" cy="41" rx="5.5" ry="11.5" transform="rotate(240 17 41)" fill="#D95D39" fillOpacity="0.45" />
        </g>
        <circle cx="32" cy="32" r="5.5" fill="currentColor" />
      </svg>

      {/* 4. Big Wrench / Spanner (mid-right) */}
      <svg
        className="cc-float"
        style={{ left: '66%', animationDuration: '25s', animationDelay: '-14s' }}
        width="108"
        height="108"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#D95D39"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M45 11a11 11 0 0 0-13.5 14.5L13 44a4.5 4.5 0 0 0 6.4 6.4l18.5-18.5A11 11 0 0 0 52.4 18.4l-6.2 6.2-5.4-5.4 6.2-6.2A11 11 0 0 0 45 11z"
          fill="#FFFFFF"
          className="dark:fill-slate-800"
        />
      </svg>

      {/* 5. Big Glowing Lightbulb (right) */}
      <svg
        className="cc-float"
        style={{ left: '84%', animationDuration: '17s', animationDelay: '-8s' }}
        width="104"
        height="104"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#D97706"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 36a14 14 0 1 1 20 0c-2.5 2.5-3.5 5-3.5 8h-13c0-3-1-5.5-3.5-8z" fill="#FEF3C7" className="dark:fill-amber-900/60" />
        <line x1="25" y1="49" x2="39" y2="49" />
        <line x1="27" y1="54" x2="37" y2="54" />
        <line x1="32" y1="6" x2="32" y2="10" />
        <line x1="12" y1="24" x2="8" y2="24" />
        <line x1="56" y1="24" x2="52" y2="24" />
      </svg>

      {/* 6. Big Drifting Wi-Fi Signal */}
      <svg
        className="cc-drift"
        style={{ top: '24%', animationDuration: '28s', animationDelay: '-5s' }}
        width="96"
        height="96"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#2AA18A"
        strokeWidth="3.2"
        strokeLinecap="round"
      >
        <path d="M12 28a28 28 0 0 1 40 0" />
        <path d="M20 36a17 17 0 0 1 24 0" />
        <circle cx="32" cy="46" r="3.5" fill="#2AA18A" />
      </svg>

      {/* 7. Big Second Toilet Paper Roll drifting across */}
      <svg
        className="cc-drift text-[#132238] dark:text-slate-300"
        style={{ top: '65%', animationDuration: '32s', animationDelay: '-18s' }}
        width="112"
        height="112"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="28" cy="22" rx="15" ry="8.5" fill="#FFFFFF" className="dark:fill-slate-800" />
        <ellipse cx="28" cy="22" rx="4.5" ry="2.5" fill="#1B6B5A" stroke="#1B6B5A" />
        <path d="M13 22v19c0 4.8 6.7 8.5 15 8.5s15-3.7 15-8.5V22" fill="#FFFFFF" className="dark:fill-slate-800" />
        <path d="M43 26h8v22c0 2-1.5 3-3 2l-2-1.5-3-2V26z" fill="#FFFFFF" className="dark:fill-slate-800" />
      </svg>
    </div>
  );
}
