// Single source of truth for site-wide details. Edit here; nothing else needs to change.

export interface SocialLink {
  label: string;
  url: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  /** Short line under the name in the header logo lockup. Only shown once there's room (see Header.astro). */
  brandTagline: string;
  description: string;
  /** Never rendered as plain text in the HTML — see components/EmailLink.astro. */
  email: string;
  socials: SocialLink[];
  footerText: string;
  nav: NavItem[];
  /** Optional. Path under /public (e.g. '/jane-doe-resume.pdf'). Shows a download link on /cv. */
  resumePdf: string;
}

export const site: SiteConfig = {
  name: 'Kevin Phelan',
  tagline: 'Product designer making complicated things feel simple.',
  brandTagline: 'Digital experience & visual design',
  description: 'Portfolio of Kevin Phelan, product designer. Selected case studies, gallery, bio and résumé.',

  email: 'kphelandesign@gmail.com',

  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/kevin-phelan-5b059b41/' },
  ],

  footerText: `© ${new Date().getFullYear()} Kevin Phelan. All rights reserved.`,

  nav: [
    { label: 'Work', href: '/' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Bio', href: '/bio' },
    { label: 'Résumé', href: '/cv' },
  ],

  resumePdf: '/kevin-phelan-resume.pdf',
};
