import React from 'react';
import { aboutContent } from '../../content/landing';
import { CheckCircle2, RefreshCw, Smartphone, Leaf } from 'lucide-react';

export const AboutVeyaSection: React.FC = () => {
  return (
    <section className="section-wrapper" id="about">
      <div className="section-container">
        <div className="section-header-center">
          <div className="badge-pill">
            <span>{aboutContent.badge}</span>
          </div>
          <h2 className="section-heading">{aboutContent.heading}</h2>
          <p className="section-lead">{aboutContent.lead}</p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <div className="about-icon-wrapper">
              <Smartphone size={22} color="#000000" />
            </div>
            <h3 className="about-card-title">Zero App Needed for Viewers</h3>
            <p className="about-card-text">
              Anyone you meet can view your full business card in their default mobile browser. They
              never have to download or sign up for an app to connect with you.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon-wrapper">
              <RefreshCw size={22} color="#000000" />
            </div>
            <h3 className="about-card-title">Real-Time Information Sync</h3>
            <p className="about-card-text">
              Promoted to a new role? Changed your direct line or relocated? Update your card in
              seconds. Everyone with your link instantly sees your current information.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon-wrapper">
              <Leaf size={22} color="#000000" />
            </div>
            <h3 className="about-card-title">Permanent & Sustainable</h3>
            <p className="about-card-text">
              Never reorder cardboard business cards again. Stop contributing to paper waste and
              recurring printing bills with a sustainable digital identity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
