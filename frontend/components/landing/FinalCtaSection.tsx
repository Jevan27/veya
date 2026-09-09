import React from 'react';
import { Download, Sparkles, ArrowRight } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  return (
    <section className="section-wrapper final-cta-wrapper">
      <div className="section-container">
        <div className="final-cta-card">
          <div className="badge-pill" style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <Sparkles size={13} color="#000000" />
            <span>Elevate Your Network</span>
          </div>

          <h2 className="final-cta-heading">Ready to leave the old business card behind?</h2>

          <p className="final-cta-subtext">
            Join the professionals who never get caught without a business card. Download Veya and
            share your digital identity anywhere, anytime.
          </p>

          <div className="final-cta-buttons">
            <a href="#download" className="btn btn-primary btn-lg">
              <Download size={18} />
              <span>Download Veya App</span>
            </a>

            <a href="#product-showcase" className="btn btn-secondary btn-lg">
              <span>Try Live Card Simulator</span>
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
