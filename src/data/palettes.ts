// Palettes available in the dev-only switcher (components/PaletteSwitcher.astro). Each id needs a
// matching block in src/styles/palettes.css; "default" is the palette in global.css.
export const palettes = [
  { id: 'default', label: 'Current (orange, light blue & blue)' },
  { id: 'classic', label: 'Previous (red & blue)' },
  { id: 'moss-amber', label: 'Moss & amber' },
  { id: 'indigo-coral', label: 'Indigo & coral' },
  { id: 'graphite-lime', label: 'Graphite & lime' },
  { id: 'blue', label: 'Blue (#2176FF)' },
  { id: 'blue-orange', label: 'Blue & orange (#FF8552)' },
];
