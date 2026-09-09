/**
 * Centralized Content Architecture for Veya Landing Page
 * Strictly represents verified product capabilities.
 */

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface StepItem {
  step: string;
  title: string;
  description: string;
  highlight: string;
}

export interface ComparisonRow {
  aspect: string;
  traditional: string;
  veya: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PersonaItem {
  role: string;
  tagline: string;
  benefits: string[];
}

export const heroContent = {
  badge: 'Next-Generation Digital Business Cards',
  headline: 'Your Business Card, Reimagined.',
  headlineHighlight: 'Reimagined.',
  description:
    'Create and share your digital business card with a tap, QR code, or simple link. Keep your contact details up to date and let people save them directly to their phone.',
  primaryCta: 'Download Veya',
  secondaryCta: 'Explore Features',
  subText: '100% Free · No paper waste · Instant contact save',
};

export const aboutContent = {
  badge: 'What Is Veya',
  heading: 'A digital business card you can share anywhere.',
  lead: 'Veya lets you share your contact details with a simple tap, scan, or link. Keep your information updated in one place and make it easy for people to save your details.',
  body: 'Veya replaces fragile paper with an intelligent, elegant digital business card that lives right on your phone. Whenever you meet a prospective client, colleague, or partner, present your dynamic card via QR code or contactless link. Recipients can view your polished profile in any web browser and download your complete contact info directly into their address book with a single tap.',
  highlights: [
    {
      title: 'Zero App Needed for Recipients',
      desc: 'Anyone can open your public card link on iOS, Android, or desktop without installing any software.',
    },
    {
      title: 'Real-Time Updates',
      desc: 'Change your phone number, title, or company logo in the app — everyone with your link instantly sees the updated card.',
    },
    {
      title: 'Sustainable & Cost-Effective',
      desc: 'Eliminate continuous printing costs, paper clutter, and environmental waste with a permanent digital solution.',
    },
  ],
};

export const whyVeyaContent = {
  badge: 'Why Choose Veya',
  heading: 'A simpler way to share your contact details',
  description:
    'Veya makes it easy to share your contact information, keep it up to date, and stay connected after you meet someone.',
  pillars: [
    {
      title: 'Keep Your Information Updated',
      description:
        'Update your Veya card anytime, and your latest contact details are available through the same link. No need to print a new card every time something changes.',
      icon: 'RefreshCw',
    },
    {
      title: 'Save Contacts in One Tap',
      description:
        'Let people save your name, phone number, email, company, and other details directly to their phone contacts.',
      icon: 'UserCheck',
    },
    {
      title: 'Make Your Card Look Professional',
      description:
        'Choose your colors, fonts, photos, and company logo to create a digital business card that represents you or your business.',
      icon: 'Sparkles',
    },
    {
      title: 'Everything You Need in One Card',
      description:
        'Keep your phone number, email, location, social links, and other contact details together in one easy-to-share profile.',
      icon: 'Share2',
    },
    {
      title: 'Your Card, Your Choice',
      description:
        'Control when your card is visible and decide what information you want to share. Keep unfinished cards private until you\'re ready.',
      icon: 'ShieldCheck',
    },
  ],
};

export const featuresContent: FeatureItem[] = [
  {
    id: 'qr-sharing',
    title: 'Dynamic QR Code',
    description:
      'Create a QR code for your Veya card and share your contact details instantly. Scan it from a phone, screen, or printed badge.',
    iconName: 'QrCode',
    badge: 'Sharing',
  },
  {
    id: 'vcard-export',
    title: 'Save Contacts with vCard',
    description:
      'Let people save your name, phone number, email, company, and other details directly to their contacts.',
    iconName: 'Download',
    badge: 'Contacts',
  },
  {
    id: 'color-presets',
    title: 'Personalize Your Card',
    description:
      'Choose from different colors, backgrounds, and styles to create a digital business card that fits your personal or business brand.',
    iconName: 'Palette',
    badge: 'Design',
  },
  {
    id: 'wave-accents',
    title: 'Veya Card Designs',
    description:
      'Give your digital business card a distinct look with Veya’s signature wave designs and clean layouts.',
    iconName: 'Layers',
    badge: 'Aesthetics',
  },
  {
    id: 'curated-fonts',
    title: 'Choose Your Font Style',
    description:
      'Pick from five font styles to match the look and personality of your digital business card.',
    iconName: 'Type',
    badge: 'Typography',
  },
  {
    id: 'quick-scanner',
    title: 'Scan Digital Business Cards',
    description:
      'Scan another Veya card with your phone to quickly view their profile and save their contact details.',
    iconName: 'Scan',
    badge: 'Mobile Tool',
  },
  {
    id: 'media-storage',
    title: 'Profile Photos & Company Logos',
    description:
      'Add a clear profile photo or company logo to your Veya card and keep your profile looking professional.',
    iconName: 'Image',
    badge: 'Cloud Storage',
  },
  {
    id: 'privacy-controls',
    title: 'Privacy & Custom Card Links',
    description:
      'Choose whether your card is public and create a custom link that makes your Veya profile easy to share.',
    iconName: 'Lock',
    badge: 'Security',
  },
];

export const howItWorksContent: StepItem[] = [
  {
    step: '01',
    title: 'Create Your Card',
    description:
      'Sign up in seconds and fill out your professional profile — your name, job title, company name, and direct contact avenues.',
    highlight: 'Takes under 2 minutes',
  },
  {
    step: '02',
    title: 'Style & Customize',
    description:
      'Pick a color theme, select your font, add your avatar photo, and upload your company emblem to make it distinctly yours.',
    highlight: 'Live visual preview',
  },
  {
    step: '03',
    title: 'Share Anywhere',
    description:
      'Display your on-screen QR code during in-person meetings, or copy your personalized web card link to send via message, email, or bio.',
    highlight: 'No recipient app needed',
  },
  {
    step: '04',
    title: 'Instant Connection',
    description:
      'Your contact opens your card in any mobile browser and saves you directly to their device contacts with a single tap.',
    highlight: 'One-tap vCard save',
  },
];

export const comparisonContent: ComparisonRow[] = [
  {
    aspect: 'Updating Information',
    traditional: 'You need to print new cards when your details change.',
    veya: 'Update your card anytime, and your shared link shows the latest information.',
  },
  {
    aspect: 'Saving to Contacts',
    traditional: 'People have to type your details into their phone.',
    veya: 'Save your contact details directly to their phone with one tap.',
  },
  {
    aspect: 'Sharing Channels',
    traditional: 'Hand someone a card in person.',
    veya: 'Share with NFC, QR code, link, text, email, or messaging apps.',
  },
  {
    aspect: 'Longevity',
    traditional: 'Easy to lose, damage, or throw away.',
    veya: 'Your card stays available through your personal Veya link.',
  },
  {
    aspect: 'Media & Branding',
    traditional: 'Limited to what fits on a printed card.',
    veya: 'Add your photo, company logo, links, and other profile details.',
  },
  {
    aspect: 'Environmental Impact',
    traditional: 'Reprint the card and replace your old ones.',
    veya: 'Make changes in the app without replacing your card.',
  },
];

export const audienceContent: PersonaItem[] = [
  {
    role: 'Independent Professionals & Consultants',
    tagline: 'Always make a memorable, organized first impression.',
    benefits: [
      'Carry your card at all times right in your smartphone pocket',
      'Provide instant links to your portfolio and scheduling site',
      'Never run out of physical cards at critical networking events',
    ],
  },
  {
    role: 'Founders & Entrepreneurs',
    tagline: 'Represent your startup with cutting-edge digital polish.',
    benefits: [
      'Showcase your company logo and brand slogan with pride',
      'Easily update role or company website as your venture evolves',
      'Signal technical modernism to investors, partners, and recruits',
    ],
  },
  {
    role: 'Freelancers & Creatives',
    tagline: 'Stand out from standard corporate business cards.',
    benefits: [
      'Select fonts and color palettes that reflect your personal brand',
      'Link clients directly to your website and contact channels',
      'One tap for clients to save your direct mobile number',
    ],
  },
  {
    role: 'Sales & Business Development',
    tagline: 'Shorten the bridge between introduction and follow-up.',
    benefits: [
      'Guarantee prospect has your direct line saved in their phone',
      'Eliminate manual card scanning or transcription errors',
      'Share your card seamlessly over video calls via QR code',
    ],
  },
];

export const trustContent = {
  badge: 'Security & Infrastructure',
  heading: 'Built with privacy, speed, and reliability at the core.',
  description:
    'Your professional identity deserves enterprise-grade hosting and privacy protection.',
  points: [
    {
      title: 'No Ad Tracking',
      desc: 'Your contact details aren\'t used for advertising. We don\'t add ad trackers to your card or sell your personal contact information.',
    },
    {
      title: 'Fast & Reliable',
      desc: 'Your public Veya card is delivered through a global network so it loads quickly for people wherever they are.',
    },
    {
      title: 'Secure by Design',
      desc: 'Your account and card data are protected with modern security measures and encrypted connections.',
    },
    {
      title: 'Control What You Share',
      desc: 'Choose when your card is public or private. You can update, unpublish, or change your card whenever you need.',
    },
  ],
};

export const faqContent: FaqItem[] = [
  {
    question: 'What is Veya?',
    answer:
      'Veya is a modern digital business card platform. It allows you to create a beautiful, interactive digital business card on your mobile phone, customize its appearance, and share it instantly via QR code or web link.',
  },
  {
    question: 'Does the recipient need to install the Veya app to view my card?',
    answer:
      'No! That is one of Veya’s biggest advantages. When someone scans your QR code or taps your link, your card opens in their standard web browser on iOS, Android, or desktop. They can immediately view your details, make a call, or save your contact without installing any app.',
  },
  {
    question: 'How do contacts save my information into their phone?',
    answer:
      'Every Veya public card features a prominent "Save Contact" button. Tapping it automatically downloads a standard vCard (.vcf) file that prompts the recipient’s device to save your name, title, company, phone number, email, address, and profile photo directly into their address book.',
  },
  {
    question: 'What happens when I update my phone number or job title?',
    answer:
      'Whenever you make an update inside the Veya mobile app, changes sync immediately to the cloud. Anyone who visits your card link will instantly see the latest information — no reprints required.',
  },
  {
    question: 'Can I have more than one card?',
    answer:
      'Yes! Veya supports multiple business cards. You can maintain distinct cards for different business ventures, freelance projects, or roles, and switch between them effortlessly in the app.',
  },
  {
    question: 'How do I share my card in person?',
    answer:
      'Simply open the Veya app and tap on your card to bring up your fullscreen dynamic QR code. The person you are speaking with points their phone camera at your screen, and your card opens immediately on their device.',
  },
  {
    question: 'Is Veya currently available on Android and iOS?',
    answer:
      'Veya is currently being distributed for Android via direct APK download. iOS support is actively in development and will be released in an upcoming update.',
  },
  {
    question: 'Is Veya free to use?',
    answer: 'Yes! You can create, customize, and share your digital business card for free.',
  },
];

export const sampleCardPresets = [
  {
    id: 'obsidian-indigo',
    name: 'Obsidian Executive',
    bgColor: '#0F172A',
    primaryColor: '#4F46E5',
    fontFamily: 'Montserrat',
    card: {
      name: 'Alexander Reed',
      role: 'Head of Product Strategy',
      company: 'Veya Technologies',
      slogan: 'BUILD · SCALE · CONNECT',
      phoneNumber: '+1 415 890 2341',
      email: 'alexander@veya.app',
      location: 'San Francisco, CA',
      website: 'veya.app',
      isPublished: true,
    },
  },
  {
    id: 'pure-white-black',
    name: 'Modern Minimalist',
    bgColor: '#FFFFFF',
    primaryColor: '#111111',
    fontFamily: 'Inter',
    card: {
      name: 'Sophia Chen',
      role: 'Creative Director & Designer',
      company: 'Chen Studio',
      slogan: 'DESIGN THAT INSPIRES',
      phoneNumber: '+1 212 555 0198',
      email: 'sophia@chenstudio.design',
      location: 'New York, NY',
      website: 'chenstudio.design',
      isPublished: true,
    },
  },
  {
    id: 'warm-cream-royal',
    name: 'Editorial Studio',
    bgColor: '#FAF8F5',
    primaryColor: '#2563EB',
    fontFamily: 'Playfair Display',
    card: {
      name: 'Julian Vance',
      role: 'Managing Partner',
      company: 'Vance Advisory Group',
      slogan: 'INSIGHT · TRUST · GROWTH',
      phoneNumber: '+44 20 7946 0912',
      email: 'julian@vanceadvisory.com',
      location: 'London, UK',
      website: 'vanceadvisory.com',
      isPublished: true,
    },
  },
  {
    id: 'midnight-cyan',
    name: 'Midnight Cyber',
    bgColor: '#0B132B',
    primaryColor: '#0284C7',
    fontFamily: 'Poppins',
    card: {
      name: 'Marcus Vance',
      role: 'Chief Technology Officer',
      company: 'Apex Cloud Systems',
      slogan: 'SCALE AT LIGHTSPEED',
      phoneNumber: '+1 206 555 0142',
      email: 'marcus@apexcloud.io',
      location: 'Seattle, WA',
      website: 'apexcloud.io',
      isPublished: true,
    },
  },
];
