// Résumé content, rendered by src/pages/cv.astro. Edit here; the page layout doesn't need to change.
// Updated to match the 2026 résumé PDF (public/kevin-phelan-resume.pdf), finalized Sep 2026.

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
  education: Education[];
  certifications: string[];
  affiliations: string[];
}

export const resume: Resume = {
  about:
    "UX/Visual Designer with 20+ years of experience across startup, agency, and enterprise environments. I've partnered with a wide array of teams and clients to ship refined experiences that are intuitive, scalable, and built for launch — with a growing curiosity for AI-optimized design workflows.",

  experience: [
    {
      title: 'Senior UX Designer',
      company: 'Comcast Business',
      location: 'Philadelphia, PA',
      dates: 'Jul. 2021 – Present',
      description:
        'UX and UI design for Comcast Business customer education and acquisition experiences. In this role, I partner with multi-disciplinary teams and stakeholders to deliver features and merchandising campaigns in an agile and high speed environment.',
      highlightsLabel: 'Key highlights',
      highlights: [
        'Lead UI design for Comcast Business Mobile learn content.',
        'Selected as a 2026 AI Champion, using AI tools to rapid prototype designs and automate workflows.',
      ],
    },
    {
      title: 'Senior Art Director/UI Designer',
      company: 'MRM',
      location: 'Princeton, NJ',
      dates: 'Sep. 2010 – May 2021',
      description:
        'Combined visual design, motion graphics, and UI systems work for multi-million dollar brands. In my later role I specifically shifted to specializing in atomic design principles and modular component libraries.',
      highlightsLabel: 'Key highlights and clients',
      highlights: [
        'IHOP, U.S. Army, Educational Testing Service, Bristol-Myers Squibb, Sunovion Pharmaceuticals, Verizon',
        'Selected to represent MRM at the Facebook Hackathon event, in which agency teams came together to "hack" the Canvas ad format, which later led to launching an award-winning ad unit for IHOP.',
      ],
    },
    {
      title: 'Art Director',
      company: 'Primal Stare Studios, Inc.',
      location: 'Tinton Falls, NJ',
      dates: 'Nov. 2007 – Apr. 2010',
      description:
        'Partnered with Lead Programmers to create a seamless process between front-end design and back-end development for several innovative websites and digital campaigns as part of a small, award-winning interactive development team.',
      highlightsLabel: 'Key highlights and clients',
      highlights: [
        "Texas A&M, U.S. Air Force, AARP, Chili's, Kohler",
        'Created visual design and motion graphics for an award-winning website for the U.S. Air Force/NASCAR "Switching Seats" recruitment campaign',
      ],
    },
  ],

  education: [
    {
      degree: 'Bachelor of Fine Arts',
      school: 'Monmouth University',
      location: 'West Long Branch, NJ',
      year: '2004',
      honors: 'Cum Laude',
    },
  ],

  certifications: [
    'UX Design Master Course',
    'Principles & Practices for Great UI Design',
    'Smart Interface Design Patterns',
  ],

  affiliations: ['Sigma Pi Fraternity Member & Educational Foundation Donor'],
};
