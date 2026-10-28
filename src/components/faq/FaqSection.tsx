import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../../data/faqs';

export const FaqSection: React.FC = () => {
  // 기본 첫번째 아이템 열림 또는 닫힘 상태
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [showAll, setShowAll] = useState(false);

  const toggleItem = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const displayedFaqs = showAll ? FAQS : FAQS.slice(0, 6);

  return (
    <section id="faq" className="faq-section section-padding">
      <div className="container-narrow">
        {/* Title */}
        <h2 className="faq-title">EV5 장기렌트, 무엇이 궁금하세요?</h2>

        {/* Accordion List */}
        <div className="faq-accordion-list">
          {displayedFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const cleanQuestion = faq.question.replace(/^Q\.\s*/, '');
            return (
              <div
                key={faq.id}
                className={`faq-item-row ${isOpen ? 'open' : ''}`}
              >
                <h3 className="faq-item-heading">
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    id={`faq-btn-${faq.id}`}
                  >
                    <div className="faq-q-left">
                      <span className="faq-q-icon">Q</span>
                      <span className="faq-q-text">{cleanQuestion}</span>
                    </div>
                    <ChevronDown
                      size={20}
                      className="faq-chevron"
                    />
                  </button>
                </h3>

                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  className="faq-answer-pane"
                >
                  <p className="faq-answer-text">{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All FAQs Toggle Button */}
        {FAQS.length > 6 && (
          <button
            type="button"
            className="btn-all-faqs-view"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'FAQ 간략히 보기' : `FAQ 전체보기 (${FAQS.length})`}
          </button>
        )}
      </div>
    </section>
  );
};
