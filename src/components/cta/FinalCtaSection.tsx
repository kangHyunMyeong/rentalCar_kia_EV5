import React from 'react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import ctaBgImage from '@images/kia_ev5_6.webp';

interface FinalCtaSectionProps {
  onOpenConsultation: () => void;
  onScrollToCalculator: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onOpenConsultation,
  onScrollToCalculator,
}) => {
  return (
    <section id="final-cta" className="final-cta-section" aria-label="EV5 장기렌트 최종 견적 상담">
      <div className="final-cta-outer-container">
        <div
          className="final-cta-panel"
          style={{ backgroundImage: `url(${ctaBgImage})` }}
          role="img"
          aria-label="맑은 하늘 아래 야외 광장에 정차된 기아 EV5 세 가지 외장 컬러 파노라마 배경"
        >
          {/* Gradient Overlay for Text Readability & Cinematic Vehicle Reveal */}
          <div className="final-cta-overlay" />

          {/* Left Text & CTA Content */}
          <div className="final-cta-content">
            <div className="final-cta-badge">
              <Sparkles size={13} className="final-cta-badge-icon" />
              <span>READY FOR YOUR EV5?</span>
            </div>

            <h2 className="final-cta-title">
              기아 EV5 장기렌트,<br />
              이제 내 조건으로 시작하세요.
            </h2>

            <p className="final-cta-desc">
              계약 기간부터 초기비용, 연간 주행거리까지.<br />
              나에게 맞는 EV5 장기렌트 조건을 확인해 보세요.
            </p>

            <div className="final-cta-actions">
              <button
                type="button"
                className="final-cta-btn-primary"
                onClick={onOpenConsultation}
                aria-label="EV5 맞춤 견적받기"
              >
                <span>EV5 맞춤 견적받기</span>
                <ArrowRight size={18} className="btn-arrow-icon" />
              </button>

              <button
                type="button"
                className="final-cta-btn-secondary"
                onClick={onScrollToCalculator}
                aria-label="예상 견적 다시 계산하기"
              >
                <span>예상 견적 다시 계산하기</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
