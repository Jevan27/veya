import React from 'react';
import { trustContent } from '../../content/landing';
import { ShieldCheck, Zap, Lock, Globe } from 'lucide-react';

const trustIconMap: React.ReactNode[] = [
  <ShieldCheck key="1" size={22} color="#000000" />,
  <Zap key="2" size={22} color="#000000" />,
  <Lock key="3" size={22} color="#000000" />,
  <Globe key="4" size={22} color="#000000" />,
];

export const TrustSection: React.FC = () => {
  return (
    <section className="section-wrapper bg-subtle" id="trust">
      <div className="section-container">
        <div className="section-header-center">
          <div className="badge-pill">
            <ShieldCheck size={13} color="#000000" />
            <span>{trustContent.badge}</span>
          </div>
          <h2 className="section-heading">{trustContent.heading}</h2>
          <p className="section-lead">{trustContent.description}</p>
        </div>

        <div className="trust-grid">
          {trustContent.points.map((pt, idx) => (
            <div key={idx} className="trust-card">
              <div className="trust-icon-box">{trustIconMap[idx]}</div>
              <h3 className="trust-card-title">{pt.title}</h3>
              <p className="trust-card-text">{pt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
