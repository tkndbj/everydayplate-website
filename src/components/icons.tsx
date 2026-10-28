import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = { width: 20, height: 20, viewBox: "0 0 24 24", "aria-hidden": true } as const;

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base} fill="currentColor" {...props}>
      <path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9Z" />
    </svg>
  );
}

/** The Everyday Plate mark: a plate seen from above with a sprig of thyme. */
export function PlateMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 32" width={32} height={32} aria-hidden {...props}>
      <circle cx="16" cy="16" r="14.5" fill="var(--color-terracotta)" />
      <circle cx="16" cy="16" r="10" fill="none" stroke="var(--color-paper)" strokeWidth="1.4" opacity="0.85" />
      <path
        d="M11.5 20.5c2.6-1.2 5.8-4.5 8.6-9.4"
        fill="none"
        stroke="var(--color-paper)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14.2 17.6c-.9-1.4-.8-2.6.2-3.6m1.8 1.5c-.8-1.5-.5-2.7.6-3.6m1.5 1.3c-.5-1.4-.2-2.4.8-3.1m-3.2 6.4c1.6.3 2.7-.1 3.4-1.2m-1.6 2.6c1.5.2 2.5-.2 3.1-1.2"
        fill="none"
        stroke="var(--color-paper)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
