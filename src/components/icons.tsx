// Inline stroke icons matching the prototype (Lucide-shaped). Swap for your icon
// library if you prefer — the paths line up closely with Lucide.

import type { CSSProperties } from "react";

interface IconProps {
  size?: number;
  stroke?: string;
  width?: number;
  style?: CSSProperties;
}

function base(size = 24, stroke = "currentColor", strokeWidth = 2, style?: CSSProperties) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    style,
  };
}

export const ChevronLeft = ({ size = 17, stroke = "currentColor", width = 2.2, style }: IconProps) => (
  <svg {...base(size, stroke, width, style)}>
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export const ChevronRight = ({ size = 18, stroke = "currentColor", width = 2.2, style }: IconProps) => (
  <svg {...base(size, stroke, width, style)}>
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export const ChevronDown = ({ size = 14, stroke = "#7a8794", width = 2.2, style }: IconProps) => (
  <svg {...base(size, stroke, width, style)}>
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const Video = ({ size = 17, stroke = "#7a8794", width = 1.9, style }: IconProps) => (
  <svg {...base(size, stroke, width, style)}>
    <path d="M15 10l4.55-2.6A1 1 0 0 1 21 8.27v7.46a1 1 0 0 1-1.45.87L15 14M4 6h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
  </svg>
);

export const Clock = ({ size = 19, stroke = "#7a8794", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width, style)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const CalendarIcon = ({ size = 19, stroke = "#7a8794", width = 2, style }: IconProps) => (
  <svg {...base(size, stroke, width, style)}>
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M3 9h18M8 2.5v4M16 2.5v4" />
  </svg>
);

export const Globe = ({ size = 16, stroke = "#5a6573", width = 1.9, style }: IconProps) => (
  <svg {...base(size, stroke, width, style)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </svg>
);

export const Check = ({ size = 15, stroke = "#1a45c0", width = 2.6, style }: IconProps) => (
  <svg {...base(size, stroke, width, style)}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);
