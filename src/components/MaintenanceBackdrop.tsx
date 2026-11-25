export function MaintenanceBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none"
    >
      {/* 1. Toilet Paper Roll (floating up, left) */}
      <svg
        className="cc-float"
        style={{ left: '5%', animationDuration: '19s', animationDelay: '-3s' }}
        width="56"
        height="56"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#132238"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="28" cy="22" rx="16" ry="9" fill="#FFFFFF" />
        <ellipse cx="28" cy="22" rx="5" ry="2.8" fill="#D95D39" stroke="#D95D39" />
        <path d="M12 22v20c0 5 7.2 9 16 9s16-4 16-9V22" fill="#FFFFFF" />
        <path d="M44 26h8v24c0 2-1.5 3-3 2l-2-1.5-2 1.5-3-2V26z" fill="#FFFFFF" />
        <line x1="46" y1="35" x2="50" y2="35" strokeDasharray="2 2" />
        <line x1="46" y1="43" x2="50" y2="43" strokeDasharray="2 2" />
      </svg>

      {/* 2. Leaking Tap + Drop (floating up, mid-left) */}
      <svg
        className="cc-float"
        style={{ left: '22%', animationDuration: '24s', animationDelay: '-11s' }}
        width="54"
        height="54"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#1B6B5A"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 26h26a10 10 0 0 1 10 10v4h-8v-4a2 2 0 0 0-2-2H10v-8z" fill="#FFFFFF" />
        <line x1="22" y1="16" x2="22" y2="26" />
        <line x1="15" y1="16" x2="29" y2="16" />
        <path d="M42 46c0 3.5-4 8-4 8s-4-4.5-4-8a4 4 0 0 1 8 0z" fill="#38BDF8" stroke="#0284C7" />
      </svg>

      {/* 3. Spinning Ceiling Fan (floating up, center) */}
      <svg
        className="cc-float"
        style={{ left: '44%', animationDuration: '21s', animationDelay: '-6s' }}
        width="58"
        height="58"
        viewBox="0 0 64 64"
        fill="none"
      >
        <g className="cc-spin" stroke="#132238" strokeWidth="2.6" strokeLinecap="round">
          <ellipse cx="32" cy="14" rx="5" ry="11" fill="#D95D39" fillOpacity="0.35" />
          <ellipse cx="47" cy="41" rx="5" ry="11" transform="rotate(120 47 41)" fill="#D95D39" fillOpacity="0.35" />
          <ellipse cx="17" cy="41" rx="5" ry="11" transform="rotate(240 17 41)" fill="#D95D39" fillOpacity="0.35" />
        </g>
        <circle cx="32" cy="32" r="5" fill="#132238" />
      </svg>

      {/* 4. Wrench / Spanner (floating up, mid-right) */}
      <svg
        className="cc-float"
        style={{ left: '68%', animationDuration: '26s', animationDelay: '-15s' }}
        width="52"
        height="52"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#D95D39"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M45 11a11 11 0 0 0-13.5 14.5L13 44a4.5 4.5 0 0 0 6.4 6.4l18.5-18.5A11 11 0 0 0 52.4 18.4l-6.2 6.2-5.4-5.4 6.2-6.2A11 11 0 0 0 45 11z" fill="#FFFFFF" />
      </svg>

      {/* 5. Lightbulb (floating up, right) */}
      <svg
        className="cc-float"
        style={{ left: '86%', animationDuration: '18s', animationDelay: '-8s' }}
        width="50"
        height="50"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#B45309"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 36a14 14 0 1 1 20 0c-2.5 2.5-3.5 5-3.5 8h-13c0-3-1-5.5-3.5-8z" fill="#FEF3C7" />
        <line x1="25" y1="49" x2="39" y2="49" />
        <line x1="27" y1="54" x2="37" y2="54" />
        <line x1="32" y1="6" x2="32" y2="10" />
        <line x1="12" y1="24" x2="8" y2="24" />
        <line x1="56" y1="24" x2="52" y2="24" />
      </svg>

      {/* 6. Drifting Wi-Fi Signal (across upper-mid) */}
      <svg
        className="cc-drift"
        style={{ top: '26%', animationDuration: '30s', animationDelay: '-5s' }}
        width="48"
        height="48"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#1B6B5A"
        strokeWidth="3"
        strokeLinecap="round"
      >
        <path d="M12 28a28 28 0 0 1 40 0" />
        <path d="M20 36a17 17 0 0 1 24 0" />
        <circle cx="32" cy="46" r="3" fill="#1B6B5A" />
      </svg>

      {/* 7. Second Toilet Paper Roll drifting gently across lower screen */}
      <svg
        className="cc-drift"
        style={{ top: '68%', animationDuration: '34s', animationDelay: '-19s' }}
        width="52"
        height="52"
        viewBox="0 0 64 64"
        fill="none"
        stroke="#132238"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <ellipse cx="28" cy="22" rx="15" ry="8.5" fill="#FFFFFF" />
        <ellipse cx="28" cy="22" rx="4.5" ry="2.5" fill="#1B6B5A" stroke="#1B6B5A" />
        <path d="M13 22v19c0 4.8 6.7 8.5 15 8.5s15-3.7 15-8.5V22" fill="#FFFFFF" />
        <path d="M43 26h8v22c0 2-1.5 3-3 2l-2-1.5-3-2V26z" fill="#FFFFFF" />
      </svg>
    </div>
  );
}
