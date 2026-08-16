/**
 * Line icons, 24x24, stroke 1.5, currentColor.
 * Replaces the emoji set — emoji render inconsistently across platforms
 * and read as clip art next to real typography.
 */

type IconProps = {
  name: string;
  className?: string;
};

const PATHS: Record<string, React.ReactNode> = {
  // --- Developer ---
  'json-formatter': (
    <>
      <path d="M8 4H7a2 2 0 0 0-2 2v3a2 2 0 0 1-2 2 2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h1" />
      <path d="M16 4h1a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0-2 2v3a2 2 0 0 1-2 2h-1" />
    </>
  ),
  'base64-encoder': (
    <>
      <path d="m7 8-4 4 4 4" />
      <path d="m17 8 4 4-4 4" />
      <path d="m14 4-4 16" />
    </>
  ),
  'url-encoder': (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  'code-beautifier': (
    <>
      <path d="m8 6-6 6 6 6" />
      <path d="m16 6 6 6-6 6" />
    </>
  ),
  'regex-tester': (
    <>
      <path d="M12 4v10" />
      <path d="m7.5 6.5 9 5" />
      <path d="m16.5 6.5-9 5" />
      <rect x="3" y="16" width="6" height="5" rx="1.5" />
    </>
  ),
  'hash-generator': (
    <>
      <path d="M4 9h16" />
      <path d="M4 15h16" />
      <path d="M10 3 8 21" />
      <path d="M16 3l-2 18" />
    </>
  ),
  'html-encoder': (
    <>
      <path d="M4 3 5.5 20l6.5 2 6.5-2L20 3z" />
      <path d="M15.5 8H9l.4 3.5h5.7l-.4 4-2.7.8-2.7-.8-.15-1.5" />
    </>
  ),
  'xml-formatter': (
    <>
      <path d="M6 4h9l4 4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      <path d="M14 4v5h5" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 13 2 2-2 2" />
    </>
  ),

  // --- Content ---
  'word-counter': (
    <>
      <path d="M4 6h16" />
      <path d="M4 11h16" />
      <path d="M4 16h10" />
      <path d="M4 21h6" />
    </>
  ),
  'case-converter': (
    <>
      <path d="m3 17 4.5-11L12 17" />
      <path d="M4.8 13.5h5.4" />
      <path d="M21 11.5a3 3 0 0 0-5.5-1.7" />
      <path d="M21 9v8" />
      <path d="M21 14.5a3 3 0 1 1-5.5 1.7" />
    </>
  ),
  'slug-generator': (
    <>
      <path d="M9 17H7A5 5 0 0 1 7 7h2" />
      <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
      <path d="M8 12h8" />
    </>
  ),
  'markdown-editor': (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 15V9l2.5 3L12 9v6" />
      <path d="M16 9v6" />
      <path d="m14 13 2 2 2-2" />
    </>
  ),
  'meta-tag-generator': (
    <>
      <path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h9l7.6 7.6a2 2 0 0 1 0 2.8z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </>
  ),
  'plagiarism-checker': (
    <>
      <rect x="8" y="3" width="12" height="15" rx="2" />
      <path d="M16 21H6a2 2 0 0 1-2-2V7" />
      <path d="M11.5 10.5h5" />
      <path d="M11.5 14h3" />
    </>
  ),

  // --- Image ---
  'qr-code-generator': (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3z" />
      <path d="M20 14v.01" />
      <path d="M14 20v.01" />
      <path d="M20 20v.01" />
      <path d="M20 17v.01" />
      <path d="M17 20v.01" />
    </>
  ),
  'qr-code-decoder': (
    <>
      <path d="M4 8V5a1 1 0 0 1 1-1h3" />
      <path d="M16 4h3a1 1 0 0 1 1 1v3" />
      <path d="M20 16v3a1 1 0 0 1-1 1h-3" />
      <path d="M8 20H5a1 1 0 0 1-1-1v-3" />
      <path d="M4 12h16" />
    </>
  ),
  'color-converter': (
    <>
      <circle cx="9" cy="9" r="5.5" />
      <circle cx="15" cy="15" r="5.5" />
    </>
  ),
  'color-palette': (
    <>
      <path d="M12 21a9 9 0 1 1 9-9c0 1.7-1.3 3-3 3h-1.5a2 2 0 0 0-1.4 3.4 1.9 1.9 0 0 1-1.4 3.3z" />
      <circle cx="7.5" cy="12" r="1" />
      <circle cx="10" cy="8" r="1" />
      <circle cx="15" cy="8.5" r="1" />
    </>
  ),
  'image-compressor': (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m3 16 5-4 3.5 2.5" />
      <circle cx="15.5" cy="9" r="1.5" />
      <path d="M14 20v-3h-3" />
      <path d="m17.5 16.5-6.5 3.5" />
    </>
  ),

  // --- Converter ---
  'json-to-csv': (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M9 10v10" />
      <path d="M15 10v10" />
    </>
  ),
  'unit-converter': (
    <>
      <rect x="2" y="8" width="20" height="8" rx="2" />
      <path d="M7 8v3" />
      <path d="M12 8v4" />
      <path d="M17 8v3" />
    </>
  ),
  'temperature-converter': (
    <>
      <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z" />
      <path d="M12 12v5" />
    </>
  ),
  'password-generator': (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <path d="M12 14.5v2.5" />
    </>
  ),
  'random-generator': (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.2" />
      <circle cx="15.5" cy="15.5" r="1.2" />
      <circle cx="15.5" cy="8.5" r="1.2" />
      <circle cx="8.5" cy="15.5" r="1.2" />
    </>
  ),

  'timestamp-converter': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  'jwt-decoder': (
    <>
      <rect x="3" y="10" width="18" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0" />
      <path d="M8.5 15.5h7" />
    </>
  ),
  'base-converter': (
    <>
      <path d="M5 7h6" />
      <path d="M8 4v6" />
      <path d="M5 16h6" />
      <path d="M13 5.5h6" />
      <path d="M13 12h6" />
      <path d="M13 18.5h6" />
    </>
  ),
  'text-diff': (
    <>
      <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4" />
      <path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4" />
      <path d="M12 4v16" />
    </>
  ),
  'lorem-ipsum': (
    <>
      <path d="M4 5h16" />
      <path d="M4 10h16" />
      <path d="M4 15h12" />
      <path d="M4 20h7" />
    </>
  ),
  'csv-to-json': (
    <>
      <rect x="3" y="4" width="8" height="16" rx="1.5" />
      <path d="M3 9h8" />
      <path d="M15 7h1a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2 2 2 0 0 0-2 2v2a2 2 0 0 1-2 2h-1" />
    </>
  ),

  'cron-parser': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v4.5l3 1.8" />
      <path d="M12 3v1.5" />
      <path d="M21 12h-1.5" />
    </>
  ),
  'url-parser': (
    <>
      <path d="M4 7h16" />
      <path d="M4 12h9" />
      <path d="M4 17h6" />
      <circle cx="18" cy="15" r="3" />
      <path d="m20.2 17.2 1.8 1.8" />
    </>
  ),
  'line-tools': (
    <>
      <path d="M4 6h11" />
      <path d="M4 12h8" />
      <path d="M4 18h5" />
      <path d="M17.5 8v11" />
      <path d="m14.5 16 3 3 3-3" />
    </>
  ),

  // --- Categories ---
  developer: (
    <>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
    </>
  ),
  content: (
    <>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h9" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m3 17 5.5-4.5L21 20" />
    </>
  ),
  converter: (
    <>
      <path d="M4 8h13l-3-3" />
      <path d="M20 16H7l3 3" />
    </>
  ),

  // --- UI ---
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </>
  ),
  check: <path d="m4 12.5 5 5L20 6.5" />,
  arrow: (
    <>
      <path d="M4 12h16" />
      <path d="m14 6 6 6-6 6" />
    </>
  ),
  slash: <path d="m15 4-6 16" />,
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
};

export default function Icon({ name, className = 'w-5 h-5' }: IconProps) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
