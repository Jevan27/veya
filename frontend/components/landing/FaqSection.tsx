'use client';

import React, { useState } from 'react';
import { faqContent } from '../../content/landing';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-wrapper bg-subtle" id="faq">
      <div className="section-container">
        <div className="section-header-center">
          <div className="badge-pill">
            <HelpCircle size={13} color="#000000" />
            <span>Got Questions?</span>
          </div>
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <p className="section-lead">
            Everything you need to know about creating, sharing, and using your Veya digital
            business card.
          </p>
        </div>

        <div className="faq-list">
          {faqContent.map((item, index) => {
            const isOpen = openIndex === index;
            const headingId = `faq-heading-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div key={index} className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}>
                <h3>
                  <button
                    type="button"
                    id={headingId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="faq-question-btn"
                    onClick={() => toggleItem(index)}
                  >
                    <span>{item.question}</span>
                    <span className={`faq-chevron-icon ${isOpen ? 'faq-chevron-rotated' : ''}`}>
                      <ChevronDown size={18} />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={headingId}
                  hidden={!isOpen}
                  className="faq-answer-panel"
                >
                  <p>{item.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
