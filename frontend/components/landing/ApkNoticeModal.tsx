'use client';

import React, { useEffect } from 'react';
import { X, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

interface ApkNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkNoticeModal: React.FC<ApkNoticeModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apk-modal-title"
      onClick={onClose}
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-icon-badge">
          <Smartphone size={28} color="#000000" />
        </div>

        <h2 id="apk-modal-title" className="modal-title">
          Android APK Release In Final Testing
        </h2>

        <p className="modal-text">
          The production Veya Android APK build is currently undergoing final deployment checks. The
          download link will be active shortly.
        </p>

        <div className="modal-feature-list">
          <div className="modal-feature-item">
            <CheckCircle2 size={16} color="#000000" />
            <span>Instant Digital Business Card Creator</span>
          </div>
          <div className="modal-feature-item">
            <CheckCircle2 size={16} color="#000000" />
            <span>Dynamic QR Code Generator & Scanner</span>
          </div>
          <div className="modal-feature-item">
            <CheckCircle2 size={16} color="#000000" />
            <span>Zero App Required for Contact Viewers</span>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => {
              onClose();
              const el = document.getElementById('product-showcase');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Sparkles size={16} />
            <span>Try Card Simulator in Browser</span>
          </button>
        </div>
      </div>
    </div>
  );
};
