import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalHeader } from '../../components/legal/LegalHeader';
import { Footer } from '../../components/landing/Footer';
import { FileText, ShieldAlert, ArrowRight, ExternalLink } from 'lucide-react';
import { siteConfig } from '../../config/site';
import { legalConfig } from '../../config/legal';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for Veya — digital business cards, contactless networking, and profile sharing platform.',
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="legal-page-root">
      {/* Top Header */}
      <LegalHeader activeDoc="terms" />

      {/* Hero Header */}
      <section className="legal-header">
        <div className="legal-header-inner">
          <div className="legal-badge">
            <FileText size={13} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="legal-title">Terms of Service</h1>
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
              <span>Applicability:</span>
              <strong>Veya Web & Mobile Applications</strong>
            </div>
          </div>

          <div className="legal-counsel-notice">
            <strong>Notice & Disclaimer:</strong> This document represents the current Terms of Service for Veya Technologies.
            While tailored specifically to Veya&rsquo;s platform architecture, this agreement should be reviewed by qualified legal counsel
            admitted in the Republic of the Philippines before being relied upon as final corporate legal documentation.
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
              <a href="#section-1" className="legal-toc-link">1. Introduction & Definitions</a>
              <a href="#section-2" className="legal-toc-link">2. Eligibility & Age Requirements</a>
              <a href="#section-3" className="legal-toc-link">3. Account Registration & Security</a>
              <a href="#section-4" className="legal-toc-link">4. Digital Business Cards & Sharing</a>
              <a href="#section-5" className="legal-toc-link">5. User Content & Licensing</a>
              <a href="#section-6" className="legal-toc-link">6. Acceptable Use Policy</a>
              <a href="#section-7" className="legal-toc-link">7. Public Profiles & Disclosure</a>
              <a href="#section-8" className="legal-toc-link">8. Third-Party Services & Links</a>
              <a href="#section-9" className="legal-toc-link">9. Intellectual Property</a>
              <a href="#section-10" className="legal-toc-link">10. Subscriptions & Future Payments</a>
              <a href="#section-11" className="legal-toc-link">11. Service Availability & Uptime</a>
              <a href="#section-12" className="legal-toc-link">12. Suspension, Deletion & Termination</a>
              <a href="#section-13" className="legal-toc-link">13. Disclaimers & Warranties</a>
              <a href="#section-14" className="legal-toc-link">14. Limitation of Liability</a>
              <a href="#section-15" className="legal-toc-link">15. Indemnification</a>
              <a href="#section-16" className="legal-toc-link">16. Modifications to the Service</a>
              <a href="#section-17" className="legal-toc-link">17. Changes to These Terms</a>
              <a href="#section-18" className="legal-toc-link">18. Governing Law & Dispute Resolution</a>
              <a href="#section-19" className="legal-toc-link">19. Contact Information</a>
            </nav>
          </aside>

          {/* Document Content */}
          <article className="legal-content">
            {/* Section 1 */}
            <section id="section-1" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">1.0</span>
                <h2>Introduction and Definitions</h2>
              </div>
              <p>
                Welcome to <strong>Veya</strong> (&ldquo;Veya,&rdquo; &ldquo;Platform,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;),
                operated by <strong>Veya Technologies</strong> (&ldquo;Company&rdquo;), registered under the laws of the{' '}
                <strong>Republic of the Philippines</strong>, with office address at{' '}
                <strong>Phase 9 Bagong Silang, Caloocan City, Metro Manila, Philippines</strong>.
              </p>
              <p>
                Veya provides a digital business card and professional identity platform enabling users to create, design, customize,
                manage, and share digital profiles and contact information. Sharing mechanisms include Near Field Communication (NFC) tap-to-share
                interactions, dynamic Quick Response (QR) codes, direct profile URLs, and standard electronic contact card (.vcf) downloads.
              </p>
              <p>
                These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User,&rdquo; &ldquo;you,&rdquo;
                or &ldquo;your&rdquo;), whether individually or on behalf of an entity, and the Company concerning your access to and use of the Veya
                website located at <a href="https://veya.app" style={{ color: '#000000', fontWeight: 600 }}>https://veya.app</a> (the &ldquo;Website&rdquo;), the Veya mobile application
                (the &ldquo;App&rdquo;), public web profile viewers, and all associated software, APIs, and cloud services (collectively, the &ldquo;Services&rdquo;).
              </p>
              <p>
                <strong>PLEASE READ THESE TERMS CAREFULLY.</strong> BY CREATING AN ACCOUNT, DOWNLOADING OR INSTALLING THE APPLICATION,
                ACCESSING THE WEBSITE, OR CREATING OR VIEWING A DIGITAL BUSINESS CARD VIA VEYA, YOU EXPRESSLY ACKNOWLEDGE THAT YOU HAVE READ,
                UNDERSTOOD, AND AGREE TO BE BOUND BY ALL OF THESE TERMS. IF YOU DO NOT AGREE TO ALL OF THESE TERMS, YOU ARE EXPRESSLY PROHIBITED
                FROM USING THE SERVICES AND MUST DISCONTINUE USE IMMEDIATELY.
              </p>
              <h3>1.1 Defined Terms</h3>
              <ul>
                <li>
                  <strong>&ldquo;Account&rdquo;</strong> means the unique authenticated profile created by a User to access the management interface of the Services.
                </li>
                <li>
                  <strong>&ldquo;Digital Business Card&rdquo;</strong> or <strong>&ldquo;Card&rdquo;</strong> means an electronic profile created via the Services containing professional information, contact details, images, brand assets, social media links, and design preferences.
                </li>
                <li>
                  <strong>&ldquo;Public Profile&rdquo;</strong> means the web-accessible presentation of a Digital Business Card rendered at a unique slug URL (e.g., <code>/card/[slug]</code>) intended for public inspection and contact exchange.
                </li>
                <li>
                  <strong>&ldquo;Recipient&rdquo;</strong> or <strong>&ldquo;Viewer&rdquo;</strong> means any person who views or interacts with a Digital Business Card via a web browser, NFC interaction, or QR code scan, regardless of whether that person holds a Veya Account.
                </li>
                <li>
                  <strong>&ldquo;User Content&rdquo;</strong> means all text, photographs, graphics, corporate logos, hyperlinks, slogans, phone numbers, email addresses, and other materials submitted, uploaded, or displayed by a User through the Services.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="section-2" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">2.0</span>
                <h2>Eligibility and Age Requirements</h2>
              </div>
              <p>
                The Services are intended strictly for business, professional, and commercial networking purposes. By accessing or using the Services, you represent and warrant that:
              </p>
              <ol>
                <li>
                  You are at least <strong>18 years of age</strong>, or the age of legal majority in your jurisdiction, whichever is greater;
                </li>
                <li>
                  If you are under the age of legal majority, you have obtained the verifiable consent of your parent or legal guardian to access and use the Services under these Terms;
                </li>
                <li>
                  You possess the legal capacity and authority to enter into these Terms;
                </li>
                <li>
                  If you are accessing or using the Services on behalf of a corporation, partnership, organization, or other legal entity, you represent and warrant that you are fully authorized to bind such entity to these Terms; and
                </li>
                <li>
                  You are not currently restricted, suspended, or prohibited from using the Services under applicable laws or by prior action of Veya.
                </li>
              </ol>
              <p>
                Veya reserves the right, where permitted by applicable law, to refuse registration, suspend access, or terminate accounts of any person who does not meet these eligibility criteria or who misrepresents their eligibility.
              </p>
            </section>

            {/* Section 3 */}
            <section id="section-3" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">3.0</span>
                <h2>Account Registration and Security</h2>
              </div>
              <p>
                To create and manage Digital Business Cards, you must register for an Account. During registration, you agree to provide true, accurate, current, and complete information and to promptly update such information as necessary to maintain its accuracy.
              </p>
              <h3>3.1 Account Credentials & Authentication</h3>
              <p>
                Depending on the authentication method made available on the Platform, you may register via email and password or via supported third-party identity providers (such as Google OAuth). You are solely responsible for:
              </p>
              <ul>
                <li>Maintaining the strict confidentiality of your account credentials, passwords, and authentication tokens;</li>
                <li>Preventing unauthorized access to your account, computer, mobile device, or credentials; and</li>
                <li>All activities, modifications, and content published under your Account credentials.</li>
              </ul>
              <h3>3.2 Unauthorized Access & Notification</h3>
              <p>
                You agree to notify Veya immediately at <a href="mailto:veya.tech@gmail.com" style={{ color: '#000000', fontWeight: 600 }}>veya.tech@gmail.com</a> if you discover or suspect any unauthorized access, security breach, or compromise of your Account. Veya will not be liable for any loss, damage, or unauthorized publication arising from your failure to safeguard your credentials.
              </p>
            </section>

            {/* Section 4 */}
            <section id="section-4" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">4.0</span>
                <h2>Veya Digital Business Cards and Sharing Functionality</h2>
              </div>
              <p>
                Veya enables Users to build one or more Digital Business Cards containing personalized information. By utilizing this core functionality, you acknowledge and agree to the following operational terms:
              </p>
              <ul>
                <li>
                  <strong>Accuracy of Published Information:</strong> You are solely responsible for ensuring that all information, contact details, job titles, licenses, certifications, and affiliations displayed on your Digital Business Cards are truthful, accurate, and not misleading.
                </li>
                <li>
                  <strong>User Control Over Public Visibility:</strong> You control whether a Digital Business Card is published or unpublished. When you designate a Card as &ldquo;published&rdquo; and assign a public URL slug, you understand that this profile is accessible over the public internet.
                </li>
                <li>
                  <strong>Access by Non-Users:</strong> Recipients and Viewers do not need a Veya Account, app installation, or membership to view a published Digital Business Card. Anyone who taps a configured NFC card, scans a generated QR code, or navigates to your public link may view and download your published contact details.
                </li>
                <li>
                  <strong>Sharing Mechanisms:</strong> Veya supports sharing via NFC tap, dynamic QR codes, shareable hyperlinks, and standard vCard (.vcf) contact files. While Veya strives to adhere to universal industry standards (such as NDEF for NFC and RFC 6350 for vCard), we do not guarantee that every third-party device, operating system, or camera will successfully read or parse shared data.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="section-5" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">5.0</span>
                <h2>User Content and Intellectual Property Licensing</h2>
              </div>
              <p>
                You retain all right, title, and interest (including copyright and other intellectual property rights) in and to any User Content you upload, publish, or submit to the Platform, including your name, profile photograph, company name, slogan, corporate logo, contact information, and social links.
              </p>
              <h3>5.1 Limited Operating License to Veya</h3>
              <p>
                By submitting User Content to Veya, you grant Veya a non-exclusive, worldwide, royalty-free, fully paid-up, transferable, and sublicensable license to host, store, cache, reproduce, format, transcode, display, transmit, and distribute your User Content solely to the extent necessary to:
              </p>
              <ol>
                <li>Operate, provide, maintain, and improve the Services;</li>
                <li>Render and deliver your Digital Business Cards to Recipients via web viewers, NFC, and QR codes according to your visibility settings; and</li>
                <li>Comply with applicable laws, court orders, or enforceable governmental requests.</li>
              </ol>
              <p>
                This license terminates within a commercially reasonable timeframe when you delete your User Content or delete your Account, subject to standard automated backup cycles and statutory retention requirements.
              </p>
              <h3>5.2 User Content Representations & Warranties</h3>
              <p>
                You represent and warrant that: (a) you own or have obtained all necessary licenses, consents, rights, and permissions to submit and publish the User Content; (b) your User Content does not infringe, misappropriate, or violate any copyright, trademark, trade secret, privacy right, publicity right, or other proprietary right of any third party; and (c) your User Content complies with our Acceptable Use Policy.
              </p>
            </section>

            {/* Section 6 */}
            <section id="section-6" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">6.0</span>
                <h2>Acceptable Use Policy</h2>
              </div>
              <p>
                You agree not to access or use the Services for any purpose other than that for which Veya makes the Services available. You strictly agree that you shall NOT:
              </p>
              <ol>
                <li>
                  <strong>Illegal Activities:</strong> Use the Services for any unlawful, fraudulent, deceptive, or unauthorized purpose, or in violation of any local, national, or international statute, regulation, or treaty;
                </li>
                <li>
                  <strong>Impersonation & Fraud:</strong> Impersonate any person, business, official, or entity, falsely state or misrepresent an affiliation, or create a Digital Business Card intended to deceive or defraud the public;
                </li>
                <li>
                  <strong>Unauthorized Disclosure:</strong> Publish, transmit, or share personal contact information, phone numbers, email addresses, or images of any other individual without their explicit, prior written authorization;
                </li>
                <li>
                  <strong>Harassment & Hate Speech:</strong> Upload, transmit, or publish content that is defamatory, libelous, obscene, pornographic, threatening, abusive, harassing, hateful, or discriminatory;
                </li>
                <li>
                  <strong>Spam & Unsolicited Marketing:</strong> Use the Services or harvested contact information to transmit unsolicited promotional materials, chain letters, mass spam, phishing campaigns, or pyramid schemes;
                </li>
                <li>
                  <strong>Malicious Code:</strong> Upload or transmit files that contain viruses, Trojan horses, worms, logic bombs, or any other malicious or technologically harmful software;
                </li>
                <li>
                  <strong>Automated Scraping & Extraction:</strong> Use robots, spiders, scrapers, crawlers, or other automated devices to access, extract data from, harvest profiles from, or monitor the Services without our express written consent;
                </li>
                <li>
                  <strong>Infrastructure Interference:</strong> Interfere with, disrupt, or place an unreasonable load on the Services, servers, databases, or network connections connected to Veya;
                </li>
                <li>
                  <strong>Reverse Engineering:</strong> Decompile, reverse engineer, disassemble, decipher, or derive the source code of any software comprising or in any way making up a part of the Services; or
                </li>
                <li>
                  <strong>Circumvention:</strong> Bypass, disable, or circumvent any security measures, access controls, rate limits, or digital rights management implemented on the Platform.
                </li>
              </ol>
            </section>

            {/* Section 7 */}
            <section id="section-7" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">7.0</span>
                <h2>Public Profiles and Information Sharing</h2>
              </div>
              <div className="legal-callout-card warning">
                <p>
                  <strong>CRITICAL NOTICE REGARDING PUBLIC INFORMATION:</strong> Veya is explicitly engineered to facilitate the seamless, contactless exchange of professional contact information. Information placed on a published Digital Business Card is intentionally made public.
                </p>
              </div>
              <p>
                You acknowledge and understand the distinction between:
              </p>
              <ul>
                <li>
                  <strong>Private Account Information:</strong> Your account password hash, refresh tokens, and internal user identifier are private and never exposed to the public.
                </li>
                <li>
                  <strong>Published Card Information:</strong> Your name, professional title, company, email address, phone number, physical or office location, website, avatar, and company logo published on an active card are publicly accessible to anyone navigating to your link, tapping your NFC tag, or scanning your QR code.
                </li>
              </ul>
              <p>
                Once you share your Digital Business Card or distribute your public link, third-party Viewers may save, screenshot, download (via vCard), store, or redistribute your published information into their own address books or customer relationship management (CRM) systems. Veya cannot recall, retract, or control information once it has been received or downloaded by third parties.
              </p>
              <p>
                <strong>Recommendation:</strong> You should exercise sound judgment and refrain from publishing sensitive personal details (such as private home addresses, personal bank numbers, or confidential phone numbers) that you do not wish to be disseminated publicly.
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">8.0</span>
                <h2>Third-Party Services, Links, and Integrations</h2>
              </div>
              <p>
                The Services may allow you to link your Digital Business Card to third-party platforms, such as LinkedIn, X (formerly Twitter), Instagram, GitHub, personal portfolios, messaging applications, or external corporate websites.
              </p>
              <p>
                You acknowledge and agree that:
              </p>
              <ul>
                <li>Veya does not control, endorse, monitor, or assume responsibility for the content, privacy practices, terms of service, or availability of third-party websites or services;</li>
                <li>Your interactions, correspondences, or business dealings with third parties found on or through Veya are solely between you and the applicable third party; and</li>
                <li>Veya shall not be liable for any damage, loss, or security compromise caused by your use of or reliance on any third-party website, content, or product.</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section id="section-9" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">9.0</span>
                <h2>Intellectual Property Rights</h2>
              </div>
              <p>
                Except for User Content, the Services and all materials contained therein, including without limitation the Veya name, brand identity, logos, graphic designs, icons, typography, software source code, database architectures, APIs, user interfaces, documentation, visual designs, and algorithms (collectively, &ldquo;Veya IP&rdquo;) are the exclusive property of the Company or its licensors.
              </p>
              <p>
                Veya IP is protected by copyright, trademark, patent, trade secret, and other intellectual property and unfair competition laws of the Republic of the Philippines and international jurisdictions.
              </p>
              <p>
                Subject to your ongoing compliance with these Terms, Veya grants you a limited, personal, non-exclusive, non-transferable, revocable license to access the Website and download and use the mobile application solely for your lawful personal or business networking purposes. No right, title, or interest in Veya IP is transferred to you.
              </p>
            </section>

            {/* Section 10 */}
            <section id="section-10" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">10.0</span>
                <h2>Subscriptions, Fees, and Future Paid Features</h2>
              </div>
              <div className="legal-callout-card">
                <p>
                  <strong>Future Commercial Terms:</strong> Veya may offer both free tier features and optional paid subscriptions, physical NFC merchandise (e.g., custom NFC cards), or premium enterprise features. As of the Effective Date, this section establishes the governing framework for commercial transactions and subscriptions.
                </p>
              </div>
              <h3>10.1 Fees & Billing</h3>
              <p>
                If you elect to purchase a paid subscription, physical NFC card, or premium tier (&ldquo;Paid Services&rdquo;), you agree to pay all applicable fees at the rates and billing cycles presented at checkout. All fees are quoted in <strong>Philippine Pesos (PHP)</strong> or <strong>US Dollars (USD)</strong> unless otherwise stated.
              </p>
              <h3>10.2 Payment Processors</h3>
              <p>
                Payments are securely processed via certified third-party payment gateways, including <strong>Stripe</strong>. By submitting payment details, you authorize our payment processor to charge all accrued fees to your designated payment method in accordance with their terms.
              </p>
              <h3>10.3 Automatic Renewal & Cancellation</h3>
              <p>
                Unless stated otherwise at the time of subscription, recurring subscriptions automatically renew at the conclusion of each billing period (monthly or annually) unless cancelled by you prior to the renewal date. You may cancel your subscription at any time through your account settings or the relevant app store subscription management portal. Cancellation takes effect at the end of your current paid billing period; no prorated refunds are provided for partial periods unless required by applicable law.
              </p>
              <h3>10.4 Taxes & Price Modifications</h3>
              <p>
                All fees are exclusive of applicable taxes, value-added taxes (VAT), or governmental assessments, which will be added to your bill where required. Veya reserves the right to adjust pricing for Paid Services upon providing at least thirty (30) days advance notice via email or in-app announcement.
              </p>
            </section>

            {/* Section 11 */}
            <section id="section-11" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">11.0</span>
                <h2>Service Availability, Maintenance, and Uptime</h2>
              </div>
              <p>
                While Veya strives to maintain high availability and reliability across our edge infrastructure, we do not guarantee that the Services will be uninterrupted, error-free, continuous, or completely secure at all times.
              </p>
              <p>
                You acknowledge that:
              </p>
              <ul>
                <li>The Services may be temporarily suspended or degraded for scheduled or emergency maintenance, hardware repairs, system upgrades, or network failures;</li>
                <li>Performance may vary depending on local cellular data connectivity, internet service provider routing, and device capabilities; and</li>
                <li>Veya shall not be held liable for any loss of business opportunities, failure to transmit contact information during an event, or unavailability of public profile URLs.</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section id="section-12" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">12.0</span>
                <h2>Account Suspension, Deletion, and Termination</h2>
              </div>
              <h3>12.1 Termination by Veya</h3>
              <p>
                Veya reserves the right, in its sole discretion and without prior notice or liability, to suspend, restrict, or terminate your Account, remove or unpublish your Digital Business Cards, or prohibit your access to the Services, if:
              </p>
              <ol>
                <li>You breach or violate any provision of these Terms or the Acceptable Use Policy;</li>
                <li>Veya is required to do so by a court order, regulatory mandate, or legal authority;</li>
                <li>Your conduct poses a cybersecurity risk, threatens platform stability, or inflicts harm on other users; or</li>
                <li>Your Account remains inactive for an extended period of time following advance notification.</li>
              </ol>
              <h3>12.2 Account Deletion by User</h3>
              <p>
                You may terminate your Account and delete your profile at any time through the Account Settings screen within the Veya mobile app or by submitting a written deletion request to <a href="mailto:veya.privacy@gmail.com" style={{ color: '#000000', fontWeight: 600 }}>veya.privacy@gmail.com</a>.
              </p>
              <h3>12.3 Effect of Termination & Data Deletion Cascade</h3>
              <p>
                Upon verified account deletion:
              </p>
              <ul>
                <li>Your user record in our primary database is deleted;</li>
                <li>All associated Digital Business Cards are permanently deleted via database cascade;</li>
                <li>All profile avatars, company logos, and uploaded image assets stored in our object storage bucket (e.g., Cloudflare R2) are permanently removed; and</li>
                <li>Your unique public URL slugs are released and will immediately return a 404 Not Found error.</li>
              </ul>
              <p>
                Residual log entries or transactional records may be retained for a strictly limited duration where required for fraud prevention, resolving disputes, or satisfying legal or tax compliance requirements.
              </p>
            </section>

            {/* Section 13 */}
            <section id="section-13" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">13.0</span>
                <h2>Disclaimers of Warranties</h2>
              </div>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICES, INCLUDING ALL APPLICATIONS, WEBSITES, DIGITAL BUSINESS CARDS,
                PROFILE VIEWERS, AND FUNCTIONALITY, ARE PROVIDED ON AN <strong>&ldquo;AS IS&rdquo;</strong> AND <strong>&ldquo;AS AVAILABLE&rdquo;</strong> BASIS,
                WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
              </p>
              <p>
                WITHOUT LIMITING THE FOREGOING, VEYA EXPRESSLY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                TITLE, QUIET ENJOYMENT, ACCURACY, AND NON-INFRINGEMENT.
              </p>
              <p>
                SPECIFICALLY, VEYA MAKES NO WARRANTY OR REPRESENTATION THAT:
              </p>
              <ol>
                <li>THE SERVICES WILL MEET YOUR SPECIFIC PROFESSIONAL OR NETWORKING REQUIREMENTS;</li>
                <li>THE SERVICES WILL OPERATE UNINTERRUPTED, TIMELY, SECURELY, OR ERROR-FREE;</li>
                <li>INFORMATION PUBLISHED BY OTHER USERS ON DIGITAL BUSINESS CARDS IS ACCURATE, AUTHENTIC, VALID, OR LAWFUL;</li>
                <li>NFC CHIPS, NFC HARDWARE, TAGS, OR QR CODES WILL BE COMPATIBLE WITH EVERY SMARTPHONE, CAMERA APPLICATION, OR OPERATING SYSTEM; OR</li>
                <li>DEFECTS IN SOFTWARE OR SERVER INFRASTRUCTURE WILL BE IMMEDIATELY CORRECTED.</li>
              </ol>
            </section>

            {/* Section 14 */}
            <section id="section-14" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">14.0</span>
                <h2>Limitation of Liability</h2>
              </div>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL VEYA, ITS PARENT COMPANY, SUBSIDIARIES, AFFILIATES,
                DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                PUNITIVE, OR EXEMPLARY DAMAGES WHATSOEVER.
              </p>
              <p>
                SUCH EXCLUDED DAMAGES INCLUDE, WITHOUT LIMITATION:
              </p>
              <ul>
                <li>LOSS OF PROFITS, REVENUE, SALES, OR BUSINESS OPPORTUNITIES;</li>
                <li>LOSS OF DATA, GOODWILL, REPUTATION, OR BUSINESS CONTACTS;</li>
                <li>WORK STOPPAGE, COMPUTER FAILURE, OR SYSTEM MALFUNCTION; OR</li>
                <li>ANY DAMAGES RESULTING FROM THIRD-PARTY ACCESS, USE, ALTERATION, OR REDISTRIBUTION OF INFORMATION YOU INTENTIONALLY PUBLISHED ON YOUR DIGITAL BUSINESS CARD.</li>
              </ul>
              <p>
                TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, VEYA&rsquo;S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR IN CONNECTION WITH
                THESE TERMS OR YOUR USE OF THE SERVICES SHALL BE LIMITED TO THE GREATER OF: (A) THE TOTAL AMOUNT ACTUALLY PAID BY YOU TO VEYA FOR
                USE OF THE SERVICES IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM; OR (B) <strong>ONE THOUSAND PHILIPPINE PESOS (PHP 1,000.00)</strong> OR <strong>FIFTY US DOLLARS (USD 50.00)</strong>.
              </p>
              <p>
                NOTHING IN THESE TERMS SHALL EXCLUDE OR LIMIT LIABILITY FOR DEATH OR PERSONAL INJURY CAUSED BY GROSS NEGLIGENCE, WILLFUL MISCONDUCT,
                FRAUD, OR ANY OTHER LIABILITY THAT CANNOT BE LAWFULLY EXCLUDED UNDER THE LAWS OF THE APPLICABLE JURISDICTION.
              </p>
            </section>

            {/* Section 15 */}
            <section id="section-15" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">15.0</span>
                <h2>Indemnification</h2>
              </div>
              <p>
                You agree to defend, indemnify, and hold harmless Veya, its parent entity, directors, officers, employees, contractors,
                and agents from and against any and all claims, damages, obligations, losses, liabilities, costs, debts, and expenses
                (including reasonable attorneys&rsquo; fees and court costs) arising from or relating to:
              </p>
              <ol>
                <li>Your access to, use of, or inability to use the Services;</li>
                <li>Your violation or breach of any provision of these Terms or the Acceptable Use Policy;</li>
                <li>Your User Content, including claims that your profile information, logo, or images infringe upon third-party copyrights, trademarks, privacy rights, or publicity rights;</li>
                <li>Your violation of any applicable law, rule, or regulation; or</li>
                <li>Any fraudulent, deceptive, or misleading claims made on your Digital Business Cards.</li>
              </ol>
            </section>

            {/* Section 16 */}
            <section id="section-16" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">16.0</span>
                <h2>Modifications to the Service</h2>
              </div>
              <p>
                Veya is constantly iterating, upgrading, and improving the Platform. We reserve the right at any time to:
              </p>
              <ul>
                <li>Modify, enhance, replace, or discontinue any feature, tool, or component of the Services;</li>
                <li>Impose limits on certain features, cloud storage, or profile card counts; or</li>
                <li>Update mobile application releases, requiring users to install the latest version for continued compatibility.</li>
              </ul>
              <p>
                Where feasible and commercially practical, Veya will make reasonable efforts to provide advance notice of any material discontinuation of core features through the Website, the mobile app, or email.
              </p>
            </section>

            {/* Section 17 */}
            <section id="section-17" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">17.0</span>
                <h2>Changes to These Terms</h2>
              </div>
              <p>
                We reserve the right, in our sole discretion, to modify, update, or replace these Terms at any time. When changes are made,
                we will update the &ldquo;Last Updated&rdquo; date at the top of this document.
              </p>
              <p>
                For material changes that substantively alter your legal rights or obligations, we will provide reasonable advance notice
                via an email sent to your registered address, a prominent alert within the mobile application, or a banner on our Website.
              </p>
              <p>
                Your continued access or use of the Services following the posting of revised Terms constitutes your unconditional acceptance
                and agreement to be bound by the modifications. If you do not agree to the revised Terms, your sole remedy is to cease using the
                Services and delete your Account.
              </p>
            </section>

            {/* Section 18 */}
            <section id="section-18" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">18.0</span>
                <h2>Governing Law and Dispute Resolution</h2>
              </div>
              <p>
                These Terms and any dispute, controversy, or claim arising out of or relating to them, their interpretation, or your use of
                the Services shall be governed by and construed in accordance with the substantive laws of the{' '}
                <strong>Republic of the Philippines</strong>,
                without regard to conflict of law principles or the United Nations Convention on Contracts for the International Sale of Goods.
              </p>
              <h3>18.1 Informal Dispute Resolution</h3>
              <p>
                Before initiating formal legal action, you and Veya agree to attempt in good faith to resolve any dispute, controversy, or claim
                informally for at least thirty (30) days by contacting each other. Informal dispute notifications may be sent to{' '}
                <a href="mailto:veya.privacy@gmail.com" style={{ color: '#000000', fontWeight: 600 }}>veya.privacy@gmail.com</a>.
              </p>
              <h3>18.2 Venue & Jurisdiction</h3>
              <p>
                In the event that an informal resolution cannot be reached within thirty (30) days, any formal judicial proceedings arising from
                these Terms shall be submitted to the exclusive jurisdiction of the competent regional or municipal trial courts located in{' '}
                <strong>Caloocan City, Metro Manila, Philippines</strong>,
                and each party irrevocably waives any objection to venue or forum non conveniens in such courts.
              </p>
              <h3>18.3 International Users</h3>
              <p>
                The Services are administered and hosted on distributed cloud infrastructure. If you access the Services from outside the primary
                operating jurisdiction of the Company, you are responsible for compliance with all applicable local laws governing internet conduct
                and acceptable content in your territory.
              </p>
            </section>

            {/* Section 19 */}
            <section id="section-19" className="legal-section">
              <div className="legal-section-header">
                <span className="legal-section-number">19.0</span>
                <h2>Contact Information and Legal Inquiries</h2>
              </div>
              <p>
                If you have questions, comments, or legal notices concerning these Terms of Service, please contact our legal and support teams:
              </p>
              <ul>
                <li><strong>Entity Name:</strong> <strong>{legalConfig.companyName}</strong></li>
                <li><strong>Company Address:</strong> <strong>{legalConfig.companyAddress}</strong></li>
                <li><strong>General Support Email:</strong> <a href={`mailto:${legalConfig.supportEmail}`} style={{ color: '#000000', fontWeight: 600 }}>{legalConfig.supportEmail}</a></li>
                <li><strong>Privacy & Compliance Email:</strong> <a href={`mailto:${legalConfig.privacyEmail}`} style={{ color: '#000000', fontWeight: 600 }}>{legalConfig.privacyEmail}</a></li>
                <li><strong>Data Protection Officer:</strong> {legalConfig.dpo.name} (<a href={`mailto:${legalConfig.dpo.email}`} style={{ color: '#000000', fontWeight: 600 }}>{legalConfig.dpo.email}</a>)</li>
                <li><strong>Website:</strong> <a href={legalConfig.websiteUrl} style={{ color: '#000000', fontWeight: 600 }}>{legalConfig.websiteUrl}</a></li>
              </ul>
            </section>

            {/* Bottom Navigation */}
            <div className="legal-footer-nav">
              <Link href="/" className="legal-footer-nav-link">
                &larr; Return to Veya Homepage
              </Link>
              <Link href="/privacy" className="legal-footer-nav-link">
                Read Privacy Policy <ArrowRight size={14} />
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
