import React from 'react';
import { audienceContent } from '../../content/landing';
import { CheckCircle2, Users } from 'lucide-react';

export const AudienceSection: React.FC = () => {
  return (
    <section className="section-wrapper bg-subtle" id="audience">
      <div className="section-container">
        <div className="section-header-center">
          <div className="badge-pill">
            <Users size={13} color="#000000" />
            <span>Built For You</span>
          </div>
          <h2 className="section-heading">Tailored for driven professionals.</h2>
          <p className="section-lead">
            Whether you are meeting clients one-on-one, speaking on stage, or growing a business,
            Veya empowers your network.
          </p>
        </div>

        <div className="audience-grid">
          {audienceContent.map((item, idx) => (
            <div key={idx} className="audience-card">
              <h3 className="audience-role">{item.role}</h3>
              <p className="audience-tagline">{item.tagline}</p>

              <ul className="audience-benefits-list">
                {item.benefits.map((benefit, bIdx) => (
                  <li key={bIdx} className="audience-benefit-item">
                    <CheckCircle2
                      size={16}
                      color="#000000"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
