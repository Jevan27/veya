import React from 'react';
import { whyVeyaContent } from '../../content/landing';
import { RefreshCw, UserCheck, Sparkles, Share2, ShieldCheck } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  RefreshCw: <RefreshCw size={20} color="#000000" />,
  UserCheck: <UserCheck size={20} color="#000000" />,
  Sparkles: <Sparkles size={20} color="#000000" />,
  Share2: <Share2 size={20} color="#000000" />,
  ShieldCheck: <ShieldCheck size={20} color="#000000" />,
};

export const WhyVeyaSection: React.FC = () => {
  return (
    <section className="section-wrapper bg-subtle" id="why-veya">
      <div className="section-container">
        <div className="section-header-center">
          <div className="badge-pill">
            <span>{whyVeyaContent.badge}</span>
          </div>
          <h2 className="section-heading">{whyVeyaContent.heading}</h2>
          <p className="section-lead">{whyVeyaContent.description}</p>
        </div>

        <div className="why-grid">
          {whyVeyaContent.pillars.map((pillar, index) => (
            <div key={index} className="why-card">
              <div className="why-icon-box">
                {iconMap[pillar.icon] || <Sparkles size={20} color="#818CF8" />}
              </div>
              <h3 className="why-card-title">{pillar.title}</h3>
              <p className="why-card-text">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
