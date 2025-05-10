import type { SVGProps } from 'react';

export function FinPathLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 50"
      width="120"
      height="30"
      aria-label="FinPath Logo"
      {...props}
    >
      <style>
        {`
          .logo-text { fill: hsl(var(--primary)); font-family: var(--font-geist-sans), sans-serif; font-size: 38px; font-weight: 600; }
          .logo-path { fill: hsl(var(--accent)); }
          @media (prefers-color-scheme: dark) {
            .logo-text { fill: hsl(var(--primary)); }
            .logo-path { fill: hsl(var(--accent)); }
          }
        `}
      </style>
      <path
        className="logo-path"
        d="M10 40 Q15 10 30 25 T50 40"
        stroke="hsl(var(--accent))"
        strokeWidth="4"
        fill="none"
      />
      <text x="58" y="38" className="logo-text">
        FinPath
      </text>
    </svg>
  );
}
