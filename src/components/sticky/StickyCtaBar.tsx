import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { EstimateResult } from '../../types/estimate';
import { formatCurrency } from '../../services/estimateCalculator';

interface StickyCtaBarProps {
  estimateResult: EstimateResult;
  onOpenConsultation: () => void;
  selectedTrimName: string;
}

export const StickyCtaBar: React.FC<StickyCtaBarProps> = ({
  estimateResult,
  onOpenConsultation,
  selectedTrimName,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 350px 이상 스크롤되었을 때 바텀 바 노출
      const isPastHero = window.scrollY > 350;

      // 최종 CTA 섹션(#final-cta)이 화면에 충분히 나타나면 스티키 바 숨김
      const ctaEl = document.getElementById('final-cta');
      let isCtaInView = false;
      if (ctaEl) {
        const rect = ctaEl.getBoundingClientRect();
        isCtaInView = rect.top < window.innerHeight - 80 && rect.bottom > 80;
      }

      setVisible(isPastHero && !isCtaInView);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside className="sticky-bottom-bar" aria-label="실시간 견적 빠른 신청 바">
      <div className="sticky-bar-container">
        <div className="sticky-bar-left">
          <div className="sticky-bar-meta">
            <span className="sticky-bar-badge">최저가</span>
            <span className="sticky-bar-trim">{selectedTrimName}</span>
          </div>
          <div className="sticky-bar-price-wrap">
            <span className="sticky-bar-price">
              {formatCurrency(estimateResult.monthlyPayment)}
            </span>
            <span className="sticky-bar-unit">원/월</span>
          </div>
        </div>

        <button
          type="button"
          className="sticky-bar-cta-btn"
          onClick={onOpenConsultation}
          aria-label="견적 분석 받기"
        >
          <span>견적 분석 받기</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </aside>
  );
};
