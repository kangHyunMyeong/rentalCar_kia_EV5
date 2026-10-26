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
      // 300px 이상 스크롤되었을 때 바텀 바 노출
      setVisible(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="sticky-bottom-bar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 0 }}>
        <div className="sticky-bar-info">
          <span style={{ background: '#008b74', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
            최저가
          </span>
          <span style={{ fontSize: '0.85rem', color: '#4b5563', fontWeight: 600 }}>
            {selectedTrimName}
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span className="sticky-bar-price">
              {formatCurrency(estimateResult.monthlyPayment)}
            </span>
            <span className="sticky-bar-unit">원 / 월</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary-dark"
          style={{ padding: '10px 24px', fontSize: '0.92rem' }}
          onClick={onOpenConsultation}
        >
          <span>견적 분석 받기</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
