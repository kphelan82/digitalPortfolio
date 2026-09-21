// Résumé content, rendered by src/pages/cv.astro. Edit here; the page layout doesn't need to change.
// TODO: this is the May 2021 résumé. Update it from the newer LinkedIn version.

export interface Job {
  title: string;
  company: string;
  location: string;
  dates: string;
  description: string;
  highlightsLabel: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  year: string;
  honors?: string;
}

export interface Resume {
  about: string;
  experience: Job[];
  skills: string[];
  education: Education[];
  certifications: string[];
  affiliations: string[];
}

export const resume: Resume = {
  about:
    "Seasoned full stack visual/experience designer looking to continue creating outstanding digital content using my knowledge of design, client strategy, brand identity, UX and digital development to exceed client expectations. I've built a versatile design portfolio through working with major national brands on some exceptional teams. My strong organizational skills, adaptiveness, and teamwork have been instrumental to successfully working in a fast-paced agency space over the last several years.",

  experience: [
    {
      title: 'Senior Art Director/UI Designer',
      company: 'MRM',
      location: 'Princeton, NJ',
      dates: 'Sep. 2010 – May 2021',
      description:
        'Over a ten year span, I combined experience design, motion graphics, and technical knowledge to support multi-million dollar brands. Most recently, I sought to expand my skill set and pursue an interest in user experience. My UI Designer role allowed me to take my existing skills to a more granular level, using atomic design principles to build design systems based on content audits, modular components, and identifying design patterns to create more streamlined user interfaces.',
      highlightsLabel: 'Key highlights and clients',
      highlights: [
        'IHOP, U.S. Army, Educational Testing Service, Johnson & Johnson Vision, Acuvue, Bristol-Myers Squibb, Sunovion Pharmaceuticals, Verizon, Cigna',
        'Facebook Hackathon: Selected to represent MRM at this event, which brought together agencies from around the world to use digital innovation to "hack" and improve the new Canvas ad format',
      ],
    },
    {
      title: 'Art Director',
      company: 'Primal Stare Studios, Inc.',
      location: 'Tinton Falls, NJ',
      dates: 'Nov. 2007 – Apr. 2010',
      description:
        'Worked under the creative director as part of a small and tight-knit, award-winning interactive development team. Directly partnered with lead programmers to create a seamless design process between front and back-end development for several innovative interactive sites and digital campaigns. Provided art direction for freelance designers and interns on and off site.',
      highlightsLabel: 'Key highlights and clients',
      highlights: [
        'Texas A&M, U.S. Air Force, AARP, Chili\'s, Kohler',
        'Design and animation were part of an award-winning interactive site for the U.S. Air Force/NASCAR "Switching Seats" recruitment campaign',
        "Supported the agency's business development team with print and digital promotional tactics",
      ],
    },
    {
      title: 'Senior Designer',
      company: 'Group C Media, Inc.',
      location: 'Tinton Falls, NJ',
      dates: 'Sep. 2004 – Nov. 2007',
      description:
        "Designed magazine layouts for Business Facilities and Today's Facility Manager in cooperation with the editorial staff to bring the content to life. Worked with the Director of Marketing to produce all promotional sales materials and developed brand collateral for the publications' trade shows and events.",
      highlightsLabel: 'Key highlights',
      highlights: [
        'Produced 13 published magazine covers in three years',
        'Designed promo and identity materials for a brand new trade show',
      ],
    },
  ],

  skills: [
    'Adobe CC',
    'UX Prototyping',
    'Animation/Video Editing',
    'Print/Digital Production',
    'HTML5/CSS',
  ],

  education: [
    {
      degree: 'Bachelor of Fine Arts, Computer Graphics & Design',
      school: 'Monmouth University',
      location: 'West Long Branch, NJ',
      year: '2004',
      honors: 'Cum Laude',
    },
  ],

  certifications: [
    'UX Design Master Course',
    'Principles & Practices for Great UI Design',
    'Smart Interface Design Patterns 2021',
  ],

  affiliations: ['Sigma Pi Fraternity'],
};
