import React from 'react';
import { howItWorksContent } from '../../content/landing';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="section-wrapper bg-subtle" id="how-it-works">
      <div className="section-container">
        <div className="section-header-center">
          <div className="badge-pill">
            <span>How It Works</span>
          </div>
          <h2 className="section-heading">Create your digital business card in 4 simple steps.</h2>

        </div>

        <div className="steps-grid">
          {howItWorksContent.map((item, index) => (
            <div key={item.step} className="step-card">
              <div className="step-number-row">
                <span className="step-number">{item.step}</span>
                <span className="step-highlight-tag">{item.highlight}</span>
              </div>
              <h3 className="step-title">{item.title}</h3>
              <p className="step-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
