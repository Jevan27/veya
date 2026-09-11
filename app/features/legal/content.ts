export interface LegalSection {
  title: string;
  content: string[];
}

export interface LegalDocumentData {
  title: string;
  badge: string;
  effectiveDate: string;
  lastUpdatedDate: string;
  entityName: string;
  entityAddress: string;
  webUrl: string;
  sections: LegalSection[];
}

export const termsData: LegalDocumentData = {
  title: 'Terms of Service',
  badge: 'User Agreement',
  effectiveDate: 'September 11, 2026',
  lastUpdatedDate: 'September 11, 2026',
  entityName: 'Veya Technologies',
  entityAddress: 'Phase 9 Bagong Silang, Caloocan City, Metro Manila, Philippines',
  webUrl: 'https://veya.app/terms',
  sections: [
    {
      title: '1. Introduction & Acceptance',
      content: [
        'Welcome to Veya, operated by Veya Technologies ("Company", "we", "us", or "our"), registered in the Republic of the Philippines with office address at Phase 9 Bagong Silang, Caloocan City, Metro Manila.',
        'Veya provides a digital business card and professional identity platform enabling users to create, personalize, and share digital profiles and contact details via NFC tap-to-share, QR codes, direct links, and vCard downloads.',
        'By creating an account, installing the application, or creating or viewing a digital card, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.',
      ],
    },
    {
      title: '2. Eligibility & Age Requirements',
      content: [
        'The Services are intended strictly for professional, business, and commercial networking purposes.',
        'You must be at least 18 years of age, or the age of legal majority in your jurisdiction, to register for an Account and use the Services.',
        'If you access or use the Services on behalf of an enterprise or entity, you represent and warrant that you possess full authority to bind that entity to these Terms.',
      ],
    },
    {
      title: '3. Account Registration & Security',
      content: [
        'To manage Digital Business Cards, you must register for an Account with accurate, complete, and current information.',
        'You are solely responsible for safeguarding your login credentials and authentication tokens.',
        'You accept responsibility for all activities occurring under your account. Notify us immediately at veya.tech@gmail.com if you suspect unauthorized access.',
      ],
    },
    {
      title: '4. Digital Business Cards & Sharing',
      content: [
        'Users can create and manage digital business cards. You are solely responsible for verifying the accuracy of information published on your cards.',
        'You control whether a card is published or unpublished. Published cards are accessible on the public internet to anyone who navigates to your link, scans your QR code, or taps your NFC card.',
        'Viewers and recipients do NOT require the Veya mobile app or an account to view and save your shared contact card.',
        'While Veya complies with universal NFC (NDEF) and vCard (RFC 6350) standards, we do not warrant that every third-party device or camera will support or parse shared data.',
      ],
    },
    {
      title: '5. User Content & Licensing',
      content: [
        'You retain full intellectual property ownership in and to all materials you upload, including your name, profile photo, company name, logo, phone numbers, and social links.',
        'You grant Veya a non-exclusive, worldwide, royalty-free license to host, store, cache, format, and display your User Content solely to operate the Services and render your cards to viewers according to your visibility settings.',
      ],
    },
    {
      title: '6. Acceptable Use Policy',
      content: [
        'You agree not to use the Services for any unlawful, fraudulent, or deceptive activity.',
        'Prohibited activities include impersonating others, uploading malware, scraping data, sending spam, publishing another person\'s private data without consent, or attempting to compromise Veya\'s servers or infrastructure.',
      ],
    },
    {
      title: '7. Public Profiles & Intentional Sharing',
      content: [
        'Notice: Information placed on an active, published card is intentionally made public.',
        'Third-party viewers may screenshot, download (.vcf), or save your published contact details. Veya cannot recall or control information once it has been downloaded or recorded by third parties.',
        'Do not publish confidential personal data (e.g., home address, national ID, banking numbers) that you do not want publicly accessible.',
      ],
    },
    {
      title: '8. Subscriptions, Payments & Fees',
      content: [
        'Veya may offer free service features as well as optional paid subscriptions, premium customizations, or physical NFC merchandise.',
        'Paid transactions are processed securely via certified payment processors, including Stripe, denominated in Philippine Pesos (PHP) or US Dollars (USD).',
        'Recurring subscriptions renew automatically unless cancelled prior to the billing renewal date.',
      ],
    },
    {
      title: '9. Account Deletion & Data Cascade',
      content: [
        'You can delete your account at any time in the mobile app Settings or by contacting veya.privacy@gmail.com.',
        'Upon verified account deletion, your user record in PostgreSQL is purged, all associated digital cards are permanently deleted via database cascade, and all profile avatars and logos stored in Cloudflare R2 are permanently erased.',
      ],
    },
    {
      title: '10. Disclaimers & Limitation of Liability',
      content: [
        'The Services are provided on an "as is" and "as available" basis without warranties of any kind.',
        'To the maximum extent permitted by law, Veya\'s aggregate liability shall be limited to the greater of amounts paid in the preceding 12 months or One Thousand Philippine Pesos (PHP 1,000.00) / USD 50.00.',
      ],
    },
    {
      title: '11. Governing Law & Contact',
      content: [
        'These Terms are governed by the substantive laws of the Republic of the Philippines.',
        'Disputes not resolved informally within 30 days shall be submitted to the exclusive jurisdiction of the competent courts of Caloocan City, Metro Manila, Philippines.',
        'Support: veya.tech@gmail.com | Privacy: veya.privacy@gmail.com | DPO: Jevan Campillos (jvncmplls@gmail.com).',
      ],
    },
  ],
};

export const privacyData: LegalDocumentData = {
  title: 'Privacy Policy',
  badge: 'Data Protection',
  effectiveDate: 'September 11, 2026',
  lastUpdatedDate: 'September 11, 2026',
  entityName: 'Veya Technologies',
  entityAddress: 'Phase 9 Bagong Silang, Caloocan City, Metro Manila, Philippines',
  webUrl: 'https://veya.app/privacy',
  sections: [
    {
      title: '1. Introduction & Scope',
      content: [
        'Veya Technologies ("we", "us", or "our") is committed to protecting your personal data in accordance with the Philippine Data Privacy Act of 2012 (Republic Act No. 10173).',
        'This Privacy Policy applies to the Veya mobile app, website (https://veya.app), public profile viewers (/card/[slug]), and associated NFC/QR services.',
        'Veya Technologies acts as the Personal Information Controller (PIC) regarding user accounts and platform management.',
      ],
    },
    {
      title: '2. Information We Collect',
      content: [
        'Account Data: Email address, encrypted password hash (salted one-way hash; plaintext passwords are never stored), name, company, and phone number.',
        'Card Profile Data: Professional name, role/title, company, slogan, phone number, email, location (manual text), website, avatar photo, logo, and design styling.',
        'Technical Telemetry: Device OS, browser type, app build, IP address, and request timestamps for security monitoring and server diagnostics.',
        'No Location Tracking: Veya does NOT track or collect real-time background GPS geolocation from your device.',
      ],
    },
    {
      title: '3. Public Information Notice',
      content: [
        'The primary function of Veya is contactless professional networking. Information published on a digital business card is intentionally made public.',
        'Anyone who taps your NFC card, scans your QR code, or visits your profile slug can view your published card and download your electronic vCard.',
        'You have full discretion to publish or unpublish cards anytime within the app.',
      ],
    },
    {
      title: '4. How We Use Information',
      content: [
        'We process personal data solely to provide accounts, authenticate logins, host avatars and logos on Cloudflare R2, generate vCards, deliver cards to recipients, provide technical support, and maintain cybersecurity defenses.',
      ],
    },
    {
      title: '5. Lawful Bases for Processing',
      content: [
        'In compliance with RA 10173, processing is conducted under contractual necessity (delivering your cards), express consent (publishing cards/uploading photos), legitimate operational interests (platform security), and legal compliance.',
      ],
    },
    {
      title: '6. No Sale of Personal Data',
      content: [
        'WE DO NOT SELL, RENT, OR TRADE YOUR PERSONAL INFORMATION OR CONTACT LISTS TO THIRD PARTIES OR ADVERTISERS FOR COMMERCIAL PURPOSES.',
      ],
    },
    {
      title: '7. Infrastructure & Service Providers',
      content: [
        'Cloudflare R2: Used for encrypted object storage and fast worldwide CDN delivery of user profile avatars and company logos.',
        'Supabase / PostgreSQL: Managed database infrastructure operating with encryption at rest and TLS in transit.',
        'All third-party vendors operate as data processors bound by strict confidentiality and data protection obligations.',
      ],
    },
    {
      title: '8. Data Retention & Deletion Cascade',
      content: [
        'You can delete your account anytime in the app Settings or by emailing veya.privacy@gmail.com.',
        'Deletion immediately triggers a cascade: database user record deleted, all cards removed, and all Cloudflare R2 uploaded photos permanently purged.',
      ],
    },
    {
      title: '9. Security Safeguards',
      content: [
        'We enforce TLS 1.2/1.3 encryption in transit, salted password hashing, short-lived signed JWT session tokens, and strict database access controls.',
      ],
    },
    {
      title: '10. Your Privacy Rights (RA 10173)',
      content: [
        'Under Philippine law, you have the right to be informed, right to access, right to rectification, right to erasure/blocking, right to data portability, and the right to lodge a complaint with the National Privacy Commission (NPC, privacy.gov.ph).',
        'To exercise your rights, contact our Data Protection Officer at jvncmplls@gmail.com or veya.privacy@gmail.com. Requests are addressed within 30 days.',
      ],
    },
    {
      title: '11. Children\'s Privacy & Contact',
      content: [
        'Veya is intended strictly for individuals aged 18 and older. We do not knowingly collect information from minors.',
        'Entity: Veya Technologies | Address: Phase 9 Bagong Silang, Caloocan City, Metro Manila, Philippines',
        'DPO: Jevan Campillos (jvncmplls@gmail.com) | Privacy: veya.privacy@gmail.com | Support: veya.tech@gmail.com.',
      ],
    },
  ],
};
