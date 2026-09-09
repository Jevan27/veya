import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="veya-web-card" style={{ backgroundColor: '#1E293B', minHeight: '230px' }}>
      <div className="card-inner">
        <div className="card-header-row">
          <div
            className="skeleton-box"
            style={{ width: '68px', height: '68px', borderRadius: '16px' }}
          />
          <div
            className="card-identity-col"
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <div className="skeleton-box" style={{ width: '65%', height: '22px' }} />
            <div className="skeleton-box" style={{ width: '45%', height: '14px' }} />
            <div
              className="skeleton-box"
              style={{ width: '35%', height: '18px', borderRadius: '6px' }}
            />
          </div>
        </div>

        <div className="card-divider" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

        <div className="card-contact-grid">
          <div className="skeleton-box" style={{ height: '30px' }} />
          <div className="skeleton-box" style={{ height: '30px' }} />
          <div className="skeleton-box" style={{ height: '30px' }} />
          <div className="skeleton-box" style={{ height: '30px' }} />
        </div>
      </div>
    </div>
  );
};
