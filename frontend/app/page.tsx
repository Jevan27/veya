import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { AboutVeyaSection } from '../components/landing/AboutVeyaSection';
import { WhyVeyaSection } from '../components/landing/WhyVeyaSection';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { ProductShowcase } from '../components/landing/ProductShowcase';
import { AudienceSection } from '../components/landing/AudienceSection';
import { ComparisonTable } from '../components/landing/ComparisonTable';
import { TrustSection } from '../components/landing/TrustSection';
import { DownloadSection } from '../components/landing/DownloadSection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { Footer } from '../components/landing/Footer';
import { StructuredData } from '../components/landing/StructuredData';

export default function HomePage() {
  return (
    <div className="landing-page-root">
      {/* Schema.org Structured Data */}
      <StructuredData />

      {/* Primary Navigation */}
      <Navbar />

      {/* Main Content Landmark */}
      <main id="main-content">
        <HeroSection />
        <AboutVeyaSection />
        <WhyVeyaSection />
        <FeaturesGrid />
        <HowItWorksSection />
        <ProductShowcase />
        <AudienceSection />
        <ComparisonTable />
        <TrustSection />
        <DownloadSection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      {/* Footer Landmark */}
      <Footer />
    </div>
  );
}
