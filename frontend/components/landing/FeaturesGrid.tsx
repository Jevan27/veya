import React from 'react';
import { featuresContent } from '../../content/landing';
import {
  QrCode,
  Download,
  Palette,
  Layers,
  Type,
  Scan,
  Image as ImageIcon,
  Lock,
} from 'lucide-react';

const featureIconMap: Record<string, React.ReactNode> = {
  QrCode: <QrCode size={22} color="#000000" />,
  Download: <Download size={22} color="#000000" />,
  Palette: <Palette size={22} color="#000000" />,
  Layers: <Layers size={22} color="#000000" />,
  Type: <Type size={22} color="#000000" />,
  Scan: <Scan size={22} color="#000000" />,
  Image: <ImageIcon size={22} color="#000000" />,
  Lock: <Lock size={22} color="#000000" />,
};

export const FeaturesGrid: React.FC = () => {
  return (
    <section className="section-wrapper" id="features">
      <div className="section-container">
        <div className="section-header-center">
          <div className="badge-pill">
            <span>Features Showcase</span>
          </div>
          <h2 className="section-heading">Every feature designed for effortless networking.</h2>
          <p className="section-lead">
            Explore the verified tools built into Veya to present your professional identity with
            maximum polish.
          </p>
        </div>

        <div className="features-grid">
          {featuresContent.map((feature) => (
            <div key={feature.id} className="feature-card">
              <div className="feature-card-header">
                <div className="feature-icon-box">
                  {featureIconMap[feature.iconName] || <QrCode size={22} color="#000000" />}
                </div>
                {feature.badge && <span className="feature-tag">{feature.badge}</span>}
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-text">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
