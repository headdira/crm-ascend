-- Mais banners por nicho (wizard exige 3; seed 008 só tinha 1 por nicho + 1 genérico)

INSERT INTO builder_assets (asset_type, name, niche, svg_content, sort_order) VALUES
(
  'banner',
  'Banner Pet 2',
  'Pet',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#PRIMARY"/><rect x="32" y="48" width="280" height="24" rx="6" fill="#SECONDARY"/><circle cx="480" cy="200" r="100" fill="#SECONDARY" opacity="0.85"/><path d="M120 320h400" stroke="#SECONDARY" stroke-width="14" stroke-linecap="round"/></svg>',
  2
),
(
  'banner',
  'Banner Pet 3',
  'Pet',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#SECONDARY"/><path d="M0 200 Q320 80 640 200 L640 400 L0 400 Z" fill="#PRIMARY" opacity="0.75"/><rect x="80" y="80" width="160" height="160" rx="80" fill="#PRIMARY"/></svg>',
  3
),
(
  'banner',
  'Banner Moda feminina 2',
  'Moda feminina',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#PRIMARY"/><circle cx="520" cy="120" r="64" fill="#SECONDARY"/><rect x="48" y="240" width="544" height="48" rx="8" fill="#SECONDARY" opacity="0.9"/></svg>',
  2
),
(
  'banner',
  'Banner Moda feminina 3',
  'Moda feminina',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#SECONDARY"/><path d="M64 360 L200 120 L320 280 L440 100 L576 360 Z" fill="#PRIMARY" opacity="0.7"/></svg>',
  3
),
(
  'banner',
  'Banner Moda masculina 2',
  'Moda masculina',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#SECONDARY"/><rect x="0" y="0" width="320" height="400" fill="#PRIMARY"/><rect x="360" y="120" width="240" height="32" rx="4" fill="#SECONDARY"/></svg>',
  2
),
(
  'banner',
  'Banner Moda masculina 3',
  'Moda masculina',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#PRIMARY"/><rect x="40" y="300" width="560" height="60" fill="#SECONDARY"/><rect x="40" y="40" width="120" height="120" rx="8" fill="#SECONDARY" opacity="0.8"/></svg>',
  3
),
(
  'banner',
  'Banner Genérico 2',
  'Genérico',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#PRIMARY"/><rect x="48" y="48" width="544" height="200" rx="20" fill="#SECONDARY" opacity="0.85"/><rect x="48" y="280" width="360" height="40" rx="8" fill="#SECONDARY"/></svg>',
  2
),
(
  'banner',
  'Banner Genérico 3',
  'Genérico',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400" fill="none"><rect width="640" height="400" fill="#SECONDARY"/><circle cx="320" cy="200" r="140" fill="#PRIMARY"/><rect x="200" y="320" width="240" height="24" rx="6" fill="#PRIMARY"/></svg>',
  3
);
