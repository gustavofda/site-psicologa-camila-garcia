import type { ReactNode } from 'react';

// Ícones em SVG (traço estilo Feather, desenhados aqui). Troque por logos oficiais se preferir.
const Svg = ({ children, size = 20 }: { children: ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

export const WhatsAppIcon = ({ size }: { size?: number }) => (
  <Svg size={size}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M15.5 14.4c-.6.6-1.4.6-2.4.2a8 8 0 0 1-3.7-3.7c-.4-1-.4-1.8.2-2.4l.5-.5" />
  </Svg>
);
export const LinkedInIcon = () => (
  <Svg><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></Svg>
);
export const InstagramIcon = () => (
  <Svg><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></Svg>
);
export const MailIcon = () => (
  <Svg><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></Svg>
);
export const GlobeIcon = () => (
  <Svg><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Svg>
);

type Kind = 'wa' | 'in' | 'ig' | 'mail' | 'web';
const ICONS: Record<Kind, () => ReactNode> = {
  wa: () => <WhatsAppIcon />, in: LinkedInIcon, ig: InstagramIcon, mail: MailIcon, web: GlobeIcon,
};

export function kindFromLabel(label: string): Kind {
  const l = label.toLowerCase();
  if (l.includes('linkedin')) return 'in';
  if (l.includes('instagram')) return 'ig';
  if (l.includes('whats')) return 'wa';
  return 'web';
}

export function BrandButton({ kind, href, label, external = true }: { kind: Kind; href: string; label: string; external?: boolean }) {
  const Icon = ICONS[kind];
  return (
    <a className="brand-btn" href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      <span className={`ico ${kind}`}>{Icon()}</span>{label}
    </a>
  );
}

export function Sunflower({ size = 240 }: { size?: number }) {
  const angles = Array.from({ length: 16 }, (_, i) => i * 22.5);
  return (
    <svg className="spin" viewBox="-100 -100 200 200" width={size} height={size} role="img" aria-label="Girassol">
      {angles.map((a) => (
        <ellipse key={a} cx="0" cy="-62" rx="13" ry="30" fill="#f2c94c" stroke="#e0b12e" transform={`rotate(${a})`} />
      ))}
      <circle r="40" fill="#6b4a2b" />
      <circle r="28" fill="#80593a" />
      <circle r="14" fill="#4a3220" />
    </svg>
  );
}
