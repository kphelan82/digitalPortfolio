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
  name: 'Your Name',
  tagline: 'Product designer making complicated things feel simple.',
  description: 'Portfolio of Your Name, product designer. Selected case studies, gallery, bio and résumé.',

  email: 'hello@example.com',

  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/your-handle/' },
  ],

  footerText: `© ${new Date().getFullYear()} Your Name. All rights reserved.`,

  nav: [
    { label: 'Work', href: '/' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Bio', href: '/bio' },
    { label: 'Résumé', href: '/cv' },
  ],

  resumePdf: '',
};
