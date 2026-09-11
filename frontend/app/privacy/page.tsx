import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalHeader } from '../../components/legal/LegalHeader';
import { Footer } from '../../components/landing/Footer';
import { ShieldCheck, Lock, ArrowRight, ExternalLink } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { legalConfig } from '../../config/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for Veya — learn how we collect, use, store, protect, and process personal data across our digital business card platform.',
  alternates: {
    canonical: `${siteConfig.url}/privacy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-page-root">
      {/* Top Header */}
      <LegalHeader activeDoc="privacy" />

      {/* Hero Header */}
      <section className="legal-header">
        <div className="legal-header-inner">
          <div className="legal-badge">
            <ShieldCheck size={13} />
            <span>Data Protection & Privacy</span>
          </div>
          <h1 className="legal-title">Privacy Policy</h1>
          <div className="legal-meta-row">
            <div className="legal-meta-item">
              <span>Effective Date:</span>
              <strong>{legalConfig.dates.effectiveDate}</strong>
            </div>
            <div className="legal-meta-item">
              <span>Last Updated:</span>
              <strong>{legalConfig.dates.lastUpdatedDate}</strong>
            </div>
            <div className="legal-meta-item">
              <span>Jurisdictional Scope:</span>
              <strong>Philippines & Global Web Viewers</strong>
            </div>
          </div>

          <div className="legal-counsel-notice">
            <strong>Notice & Legal Disclaimer:</strong> This document outlines personal data governance, collection, and storage practices for Veya Technologies.
            While structured around the Philippine Data Privacy Act of 2012 (RA 10173), this policy should be reviewed by qualified legal counsel
            or a certified privacy consultant prior to formal corporate publication.
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="legal-main-wrap">
        <div className="legal-grid">
          {/* Table of Contents Sidebar */}
          <aside className="legal-sidebar" aria-label="Table of Contents">
            <div className="legal-sidebar-title">Table of Contents</div>
            <nav className="legal-toc-list">
              <a href="#section-1" className="legal-toc-link">1. Introduction & Scope</a>
              <a href="#section-2" className="legal-toc-link">2. Information We Collect</a>
              <a href="#section-3" className="legal-toc-link">3. Information Made Public by Users</a>
              <a href="#section-4" className="legal-toc-link">4. How We Use Personal Information</a>
              <a href="#section-5" className="legal-toc-link">5. Legal Bases / Lawful Processing</a>
              <a href="#section-6" className="legal-toc-link">6. How We Share Information</a>
              <a href="#section-7" className="legal-toc-link">7. Third-Party Service Providers</a>
              <a href="#section-8" className="legal-toc-link">8. Data Storage & Retention</a>
              <a href="#section-9" className="legal-toc-link">9. Data Security Safeguards</a>
              <a href="#section-10" className="legal-toc-link">10. Cookies & Tracking Technologies</a>
              <a href="#section-11" className="legal-toc-link">11. User Data Privacy Rights</a>
              <a href="#section-12" className="legal-toc-link">12. Publicly Shared Profile Risks</a>
              <a href="#section-13" className="legal-toc-link">13. Children's Privacy</a>
              <a href="#section-14" className="legal-toc-link">14. International Data Transfers</a>
              <a href="#section-15" className="legal-toc-link">15. Third-Party Websites & Links</a>
              <a href="#section-16" className="legal-toc-link">16. Security Incidents & Breach Response</a>
              <a href="#section-17" className="legal-toc-link">17. Changes to This Privacy Policy</a>
              <a href="#section-18" className="legal-toc-link">18. Contact Us & DPO</a>
            </nav>
          </aside>

          {/* Document Content */}
          <article className="legal-content">
            {/* Section 1 */}
            <section id="section-1" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">1.0</span>
                <h2>Introduction and Scope</h2>
              </div>
              <p>
                At <strong>Veya</strong> (&ldquo;Veya,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), operated by{' '}
                <strong>Veya Technologies</strong> (&ldquo;Company&rdquo;), with office address at{' '}
                <strong>Phase 9 Bagong Silang, Caloocan City, Metro Manila, Philippines</strong>, we value your privacy and are committed
                to safeguarding the personal data entrusted to us.
              </p>
              <p>
                This Privacy Policy outlines our principles, technical practices, and administrative procedures governing the collection,
                recording, organization, storage, updating, retrieval, consultation, use, consolidation, blocking, erasure, and destruction
                of personal information when you access:
              </p>
              <ul>
                <li>The Veya mobile application (the &ldquo;App&rdquo;);</li>
                <li>The Veya marketing website and web application located at <a href="https://veya.app" style={{ color: '#000000', fontWeight: 600 }}>https://veya.app</a> (the &ldquo;Website&rdquo;);</li>
                <li>The Veya public web profile viewer pages (e.g., <code>/card/[slug]</code>); and</li>
                <li>Any associated NFC tap endpoints, QR code redirection services, or backend APIs (collectively, the &ldquo;Services&rdquo;).</li>
              </ul>
              <p>
                This Privacy Policy applies to registered account holders (&ldquo;Users&rdquo;), individuals who interact with or view a Veya digital
                business card (&ldquo;Viewers&rdquo; or &ldquo;Recipients&rdquo;), and visitors to our Website. For the purposes of applicable data
                protection legislation, including the Philippine Data Privacy Act of 2012 (Republic Act No. 10173),{' '}
                <strong>Veya Technologies</strong> acts as the Personal Information Controller (PIC) regarding
                account data, while providing software tools that allow Users to control what contact information they choose to publish and share.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">2.0</span>
                <h2>Information We Collect</h2>
              </div>
              <p>
                We adhere to the principle of data minimization, collecting only information strictly necessary to provide, protect, and optimize the Services.
                We distinguish between information you provide directly and information gathered automatically.
              </p>

              <h3>2.1 Information Users Provide Directly</h3>
              <ul>
                <li>
                  <strong>Account Registration Data:</strong> When registering an account, we collect your email address, an encrypted representation of your password (one-way hashed using secure algorithms; plaintext passwords are never stored or readable by us), and optional identity attributes such as your name, corporate organization, and telephone number. If third-party authentication (such as Google OAuth) is configured, we receive your OAuth provider identifier, authorized email, and public profile picture link.
                </li>
                <li>
                  <strong>Digital Business Card Profile Data:</strong> Information you intentionally enter to construct your digital business card, which may include:
                  <ul>
                    <li>Full professional name and job title;</li>
                    <li>Company or organization name and company slogan/tagline;</li>
                    <li>Direct contact email address and direct phone number;</li>
                    <li>Physical or office geographic location (e.g., &ldquo;Makati City, Philippines&rdquo;);</li>
                    <li>External website URLs and professional portfolio links;</li>
                    <li>Uploaded profile pictures (avatars) and uploaded company brand logos;</li>
                    <li>Design customization preferences (primary theme colors, background colors, and selected font families); and</li>
                    <li>Custom URL slug identifier (e.g., <code>veya.app/card/your-name</code>).</li>
                  </ul>
                </li>
                <li>
                  <strong>Communications & Support Inquiries:</strong> Any information you provide when sending a support request, feedback form, or privacy inquiry to our team.
                </li>
              </ul>

              <h3>2.2 Information Collected Automatically</h3>
              <p>
                When you access our Website, launch our mobile application, or open a public digital card web page, our servers automatically record certain technical telemetry:
              </p>
              <ul>
                <li>
                  <strong>Device & Connection Information:</strong> Operating system version (e.g., Android, iOS, Windows, macOS), web browser type and version, mobile application build number, preferred language setting, and screen resolution.
                </li>
                <li>
                  <strong>Network & Server Logs:</strong> Internet Protocol (IP) address, referring URL, HTTP request method, request timestamps, and status codes. Log data is utilized exclusively for server performance monitoring, DDoS mitigation, and diagnostic troubleshooting.
                </li>
                <li>
                  <strong>Session Authentication Tokens:</strong> Secure cryptographic JSON Web Tokens (JWTs) and securely stored refresh tokens used to authenticate and sustain your authorized login session.
                </li>
                <li>
                  <strong>Crash Reports & Diagnostics:</strong> Diagnostic logs generated during application crashes, which do not contain your plain text credentials or contact address books.
                </li>
              </ul>
              <p>
                <em>Note on Precise Geolocation:</em> Veya does NOT track or collect real-time background GPS geolocation from your mobile device. Any location displayed on a card is strictly text inputted manually by the User (e.g., &ldquo;Metro Manila, Philippines&rdquo;).
              </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">3.0</span>
                <h2>Information Made Public by Users</h2>
              </div>
              <div className="legal-callout-card warning">
                <p>
                  <strong>INTENTIONAL PUBLIC DISCLOSURE NOTICE:</strong> The core purpose of Veya is to act as a contactless digital business card.
                  Information you enter into a Digital Business Card that is marked as &ldquo;published&rdquo; is intentionally made available for public retrieval.
                </p>
              </div>
              <p>
                When you share your card or make it published:
              </p>
              <ul>
                <li>
                  <strong>Universal Web Access:</strong> Any individual who navigates to your public card slug (via direct link, search result, or bookmark) can view your published card details, profile image, and company logo.
                </li>
                <li>
                  <strong>NFC & QR Code Interactions:</strong> Anyone who taps a compatible smartphone to your programmed NFC card or scans your unique QR code will be routed directly to your public profile.
                </li>
                <li>
                  <strong>vCard Contact Downloads:</strong> Viewers can click a single button to download your electronic contact file (.vcf) directly into their smartphone&rsquo;s local contact book or CRM software.
                </li>
              </ul>
              <p>
                <strong>Your Discretion:</strong> You retain complete control over which cards are published or unpublished in your mobile application. You should never include personal information on a digital business card that you are not willing to share with prospective business acquaintances or the general public.
              </p>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">4.0</span>
                <h2>How We Use Personal Information</h2>
              </div>
              <p>
                We process your personal information strictly for legitimate business, operational, and technical purposes:
              </p>
              <ol>
                <li>
                  <strong>Providing Core Services:</strong> Creating your account, authenticating your login sessions, issuing API tokens, and storing your business cards;
                </li>
                <li>
                  <strong>Public Profile Delivery:</strong> Rendering and formatting your digital business card on web browsers for Recipients upon NFC tap, QR scan, or link access;
                </li>
                <li>
                  <strong>Asset Hosting & Transcoding:</strong> Validating, storing, and serving your avatar and company logo images securely via high-speed Content Delivery Networks (CDNs);
                </li>
                <li>
                  <strong>vCard (.vcf) Generation:</strong> Dynamically generating standardized contact files for instant recipient download into device address books;
                </li>
                <li>
                  <strong>Customer Service & Support:</strong> Responding to your questions, error reports, and technical assistance requests;
                </li>
                <li>
                  <strong>Platform Security:</strong> Detecting, preventing, and mitigating fraudulent account creations, unauthorized access, brute-force login attempts, and denial-of-service attacks; and
                </li>
                <li>
                  <strong>Legal & Regulatory Compliance:</strong> Satisfying statutory tax, accounting, or judicial requirements under applicable law.
                </li>
              </ol>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">5.0</span>
                <h2>Legal Bases and Lawful Processing</h2>
              </div>
              <p>
                Our processing of personal data complies with applicable data protection principles, including the <strong>Philippine Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, its Implementing Rules and Regulations (IRR), and international privacy frameworks.
              </p>
              <p>
                We process personal information under the following lawful bases:
              </p>
              <ul>
                <li>
                  <strong>Contractual Necessity:</strong> Processing required to perform our contractual obligations to you under our Terms of Service (e.g., maintaining your account and serving your digital cards).
                </li>
                <li>
                  <strong>Consent:</strong> Where you have granted express, informed, and unambiguous consent, such as electing to upload a profile photograph, publishing a card to the public internet, or opting into optional updates.
                </li>
                <li>
                  <strong>Legitimate Interests:</strong> Processing necessary for our legitimate interests, provided these do not override your fundamental rights and freedoms (e.g., securing network infrastructure, preventing platform abuse, and debugging technical malfunctions).
                </li>
                <li>
                  <strong>Legal Obligation:</strong> Processing necessary to comply with valid legal processes, national court orders, subpoenas, or statutory obligations in the Republic of the Philippines or applicable jurisdictions.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">6.0</span>
                <h2>How We Share Information</h2>
              </div>
              <p>
                <strong>WE DO NOT SELL, RENT, LEASE, OR TRADE YOUR PERSONAL INFORMATION OR CONTACT LISTS TO THIRD PARTIES OR ADVERTISERS FOR COMMERCIAL GAIN.</strong>
              </p>
              <p>
                We only disclose personal data under the following limited circumstances:
              </p>
              <ul>
                <li>
                  <strong>Public Distribution by Your Direction:</strong> Information published on your digital business card is delivered to Viewers who access your unique URL slug or scan your card.
                </li>
                <li>
                  <strong>Vetted Third-Party Infrastructure Providers:</strong> We disclose data to certified cloud hosting, database, and storage vendors operating strictly as data processors under binding contractual confidentiality and security terms.
                </li>
                <li>
                  <strong>Legal Requirements & Law Enforcement:</strong> We may disclose information if required to do so by applicable law, warrant, court order, or formal request from a competent governmental or regulatory authority (e.g., the National Privacy Commission).
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger, acquisition, corporate reorganization, or sale of all or a portion of our assets, user records may be transferred as part of the transaction, subject to the acquiring party honoring this Privacy Policy.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">7.0</span>
                <h2>Third-Party Infrastructure and Service Providers</h2>
              </div>
              <p>
                To provide scalable, secure, and resilient digital business card services, Veya partners with industry-standard technology vendors:
              </p>
              <ul>
                <li>
                  <strong>Cloud Storage Provider:</strong> <strong>Cloudflare R2</strong> object storage, utilized for the encrypted storage and low-latency worldwide edge delivery of user profile avatars and corporate logos.
                </li>
                <li>
                  <strong>Database Infrastructure:</strong> Managed <strong>PostgreSQL</strong> cloud database clusters hosted on <strong>Supabase</strong>, operating with encrypted storage at rest and TLS encryption in transit.
                </li>
                <li>
                  <strong>Edge CDN & Hosting:</strong> Cloudflare / Vercel edge networks, delivering low-latency cached web pages and Web Application Firewall (WAF) DDoS mitigation.
                </li>
                <li>
                  <strong>Authentication Providers:</strong> Optional third-party identity authentication services (e.g., Google Identity Services) if you choose to sign in via federated OAuth.
                </li>
              </ul>
              <p>
                All third-party service providers are contractually bound to process data solely on our documented instructions and maintain industry-standard security safeguards.
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">8.0</span>
                <h2>Data Storage, Retention, and Deletion</h2>
              </div>
              <h3>8.1 Retention Period</h3>
              <p>
                We retain your personal data and digital business cards only for as long as your Account remains active, or as necessary to provide the Services, resolve disputes, prevent fraud, and comply with statutory obligations.
              </p>
              <h3>8.2 Account Deletion and Cascade Process</h3>
              <p>
                You may delete your Account at any time directly through the mobile application settings or by contacting <a href="mailto:veya.privacy@gmail.com" style={{ color: '#000000', fontWeight: 600 }}>veya.privacy@gmail.com</a>.
              </p>
              <p>
                Upon verified account deletion, our automated backend triggers an immediate cascading deletion process:
              </p>
              <ol>
                <li>All profile avatars, images, and company logos stored in Cloudflare R2 under your user namespace (<code>users/&#123;userId&#125;/*</code>) are permanently deleted;</li>
                <li>All business card records associated with your user identifier in PostgreSQL are permanently removed; and</li>
                <li>Your core user record, email, and authentication credentials are wiped from the database.</li>
              </ol>
              <p>
                Backup archives are automatically rotated and permanently overwritten in accordance with standard disaster recovery lifecycle schedules (typically within thirty (30) days).
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">9.0</span>
                <h2>Data Security Safeguards</h2>
              </div>
              <p>
                Veya implements technical, organizational, and physical security measures designed to protect personal data against accidental or unlawful destruction, loss, alteration, unauthorized disclosure, or access:
              </p>
              <ul>
                <li>
                  <strong>Encryption in Transit:</strong> All HTTP traffic between our mobile app, website, and backend servers is encrypted using modern Transport Layer Security (TLS 1.2 / TLS 1.3).
                </li>
                <li>
                  <strong>Credential Hashing:</strong> User passwords are encrypted using salted one-way hashing algorithms (such as bcrypt or argon2). Plaintext passwords are never recorded in database tables or logs.
                </li>
                <li>
                  <strong>Token-Based Access Control:</strong> API requests require cryptographically signed JSON Web Tokens (JWTs) with short lifespans, paired with hashed refresh tokens.
                </li>
                <li>
                  <strong>Database Isolation:</strong> Production databases are protected behind private virtual networks, strict IP access control lists, and least-privilege administrative access policies.
                </li>
              </ul>
              <p>
                <em>Disclaimer:</em> While we implement rigorous, industry-recognized safeguards, no method of transmission over the public internet or electronic storage system is 100% immune from security threats. We cannot guarantee absolute, impenetrable security.
              </p>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">10.0</span>
                <h2>Cookies and Local Tracking Technologies</h2>
              </div>
              <p>
                Our Website and web profile viewers use minimal, functional cookies and local web storage mechanisms strictly necessary to maintain platform operations:
              </p>
              <ul>
                <li>
                  <strong>Essential & Authentication Tokens:</strong> Stored locally on your device to maintain your authenticated login state and preserve interface preferences.
                </li>
                <li>
                  <strong>Performance & Telemetry:</strong> Anonymized or aggregate server telemetry utilized to evaluate page render speeds and detect client-side errors.
                </li>
              </ul>
              <p>
                <strong>No Third-Party Advertising Trackers:</strong> Veya does NOT install cross-site advertising cookies, behavioral marketing trackers, or third-party pixel beacons to track your web browsing activities across external sites.
              </p>
            </section>

            {/* Section 11 */}
            <section id="section-11" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">11.0</span>
                <h2>User Data Privacy Rights</h2>
              </div>
              <p>
                Under applicable data privacy laws, including the <strong>Philippine Data Privacy Act of 2012</strong> and corresponding international regulations, you are endowed with specific statutory rights regarding your personal information:
              </p>
              <ol>
                <li>
                  <strong>Right to be Informed:</strong> You have the right to know whether your personal data is being processed, the purposes of processing, and the categories of data collected.
                </li>
                <li>
                  <strong>Right to Access:</strong> You have the right to request reasonable access to your personal data held by Veya, including card details and profile history.
                </li>
                <li>
                  <strong>Right to Rectification:</strong> You have the right to dispute and correct any inaccurate, outdated, or incomplete personal data. You can directly edit your information anytime inside the Veya mobile app.
                </li>
                <li>
                  <strong>Right to Erasure or Blocking:</strong> You have the right to suspend, withdraw, or order the blocking, removal, or destruction of your personal data from our systems upon request.
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> Where processing is carried out by automated means, you have the right to obtain a copy of your personal data in an electronic or structured format (such as exporting via vCard or JSON).
                </li>
                <li>
                  <strong>Right to File a Complaint:</strong> If you believe your privacy rights have been violated, you have the right to lodge a formal complaint with the competent privacy regulatory body, such as the <strong>National Privacy Commission (NPC) of the Philippines</strong> (<a href="https://privacy.gov.ph" target="_blank" rel="noopener noreferrer" style={{ color: '#000000', fontWeight: 600 }}>privacy.gov.ph</a>).
                </li>
              </ol>
              <p>
                To exercise any of these rights, submit your written request to our Data Protection Officer, <strong>Jevan Campillos</strong>, at <a href="mailto:jvncmplls@gmail.com" style={{ color: '#000000', fontWeight: 600 }}>jvncmplls@gmail.com</a> or via our privacy office at <a href="mailto:veya.privacy@gmail.com" style={{ color: '#000000', fontWeight: 600 }}>veya.privacy@gmail.com</a>. We will respond within thirty (30) days of receipt and verification of identity.
              </p>
            </section>

            {/* Section 12 */}
            <section id="section-12" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">12.0</span>
                <h2>Publicly Shared Profile Risks and Third-Party Storage</h2>
              </div>
              <p>
                You explicitly acknowledge that once contact information is published on a digital business card and disseminated via a public URL, NFC tap, or QR code:
              </p>
              <ul>
                <li>Third-party Viewers may copy, save, screenshot, or store your contact details in their private address books, emails, or third-party CRM software;</li>
                <li>Public web profile pages may be indexed or cached by search engine web crawlers if publicly accessible; and</li>
                <li>Veya has no technical ability or legal obligation to purge or retrieve your contact details from the personal phones, databases, or address books of third parties with whom you shared your card.</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section id="section-13" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">13.0</span>
                <h2>Children's Privacy</h2>
              </div>
              <p>
                The Services are designed and intended exclusively for adult professionals and individuals possessing legal capacity. We do not knowingly solicit, collect, or process personal data from children or minors under the age of <strong>18 years old</strong>.
              </p>
              <p>
                If we learn that we have inadvertently collected personal data from a minor without verifiable parental authorization, we will take immediate steps to delete the Account, cascade the removal of associated business cards and cloud images, and purge the data from our active databases. Parents or guardians who believe their child has registered an unauthorized account should contact us at <a href="mailto:veya.privacy@gmail.com" style={{ color: '#000000', fontWeight: 600 }}>veya.privacy@gmail.com</a>.
              </p>
            </section>

            {/* Section 14 */}
            <section id="section-14" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">14.0</span>
                <h2>International Data Transfers</h2>
              </div>
              <p>
                Because Veya operates using cloud-native infrastructure provided by global technology vendors (such as Cloudflare R2 and cloud PostgreSQL providers), personal data collected through the Services may be transmitted, processed, and stored on servers located outside the Republic of the Philippines.
              </p>
              <p>
                When transferring data across international borders, Veya ensures that adequate data protection mechanisms are in place, including standard contractual clauses, technical encryption standards, and adherence to cross-border transfer rules stipulated by the National Privacy Commission and relevant international standards.
              </p>
            </section>

            {/* Section 15 */}
            <section id="section-15" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">15.0</span>
                <h2>Third-Party Websites and External Links</h2>
              </div>
              <p>
                Digital business cards created on Veya frequently contain hyperlinks to external websites, social media accounts, messaging channels (e.g., WhatsApp, Telegram, Viber), or online scheduling portals.
              </p>
              <p>
                This Privacy Policy applies solely to Veya. We have no control over, and assume no responsibility for, the privacy practices, content, or policies of third-party websites or services. We encourage you to review the privacy documentation of any external service you connect or visit.
              </p>
            </section>

            {/* Section 16 */}
            <section id="section-16" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">16.0</span>
                <h2>Security Incidents and Data Breach Management</h2>
              </div>
              <p>
                Veya maintains a data breach response procedure. In the event of a verified cybersecurity incident or personal data breach that involves sensitive personal information or poses a real risk of serious harm to affected data subjects, Veya will:
              </p>
              <ol>
                <li>Take immediate technical containment and remediation actions to secure affected systems;</li>
                <li>Conduct a comprehensive forensic assessment of the incident;</li>
                <li>Notify the National Privacy Commission (NPC) within the statutory timelines prescribed by Philippine law (e.g., within 72 hours upon knowledge or reasonable belief of the breach); and</li>
                <li>Notify affected data subjects in clear language detailing the nature of the incident, data elements involved, and recommended mitigation steps where required by law.</li>
              </ol>
            </section>

            {/* Section 17 */}
            <section id="section-17" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">17.0</span>
                <h2>Changes to This Privacy Policy</h2>
              </div>
              <p>
                We may periodically update this Privacy Policy to reflect technological improvements, functional modifications to the Veya platform, or changes in legal regulations.
              </p>
              <p>
                When modifications are made, the &ldquo;Last Updated&rdquo; date at the top of this document will be revised. In the event of material changes affecting the collection, processing, or sharing of your personal data, we will provide conspicuous notice via email or within the Veya mobile app prior to the change taking effect.
              </p>
              <p>
                We encourage you to review this Privacy Policy periodically to stay informed regarding our data protection safeguards.
              </p>
            </section>

            {/* Section 18 */}
            <section id="section-18" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">18.0</span>
                <h2>Contact Us and Data Protection Officer</h2>
              </div>
              <p>
                If you have questions, feedback, or requests regarding this Privacy Policy, or wish to exercise your statutory privacy rights, please contact our designated privacy team:
              </p>
              <ul>
                <li><strong>Entity Name:</strong> <strong>{legalConfig.companyName}</strong></li>
                <li><strong>Physical Address:</strong> <strong>{legalConfig.companyAddress}</strong></li>
                <li><strong>Data Protection Officer (DPO):</strong> {legalConfig.dpo.name} (<a href={`mailto:${legalConfig.dpo.email}`} style={{ color: '#000000', fontWeight: 600 }}>{legalConfig.dpo.email}</a>)</li>
                <li><strong>Privacy Office Email:</strong> <a href={`mailto:${legalConfig.privacyEmail}`} style={{ color: '#000000', fontWeight: 600 }}>{legalConfig.privacyEmail}</a></li>
                <li><strong>General Support Email:</strong> <a href={`mailto:${legalConfig.supportEmail}`} style={{ color: '#000000', fontWeight: 600 }}>{legalConfig.supportEmail}</a></li>
                <li><strong>Website:</strong> <a href={legalConfig.websiteUrl} style={{ color: '#000000', fontWeight: 600 }}>{legalConfig.websiteUrl}</a></li>
              </ul>
            </section>

            {/* Bottom Navigation */}
            <div className="legal-footer-nav">
              <Link href="/" className="legal-footer-nav-link">
                &larr; Return to Veya Homepage
              </Link>
              <Link href="/terms" className="legal-footer-nav-link">
                Read Terms of Service <ArrowRight size={14} />
              </Link>
            </div>
          </article>
        </div>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
