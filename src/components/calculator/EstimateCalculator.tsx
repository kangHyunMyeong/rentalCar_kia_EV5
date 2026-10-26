import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Check } from 'lucide-react';
import { CarColor, CarTrim } from '../../types/car';
import {
  EstimateOptions,
  EstimateResult,
  RentalTermYears,
  PrepaymentRate,
  AnnualMileageKm,
} from '../../types/estimate';
import { EV5_TRIMS } from '../../data/cars';
import { formatCurrency } from '../../services/estimateCalculator';

interface EstimateCalculatorProps {
  selectedTrim: CarTrim;
  onSelectTrim: (trim: CarTrim) => void;
  selectedColor: CarColor;
  estimateOptions: EstimateOptions;
  onUpdateOptions: (updates: Partial<EstimateOptions>) => void;
  estimateResult: EstimateResult;
  onOpenConsultation: () => void;
}

export const EstimateCalculator: React.FC<EstimateCalculatorProps> = ({
  selectedTrim,
  onSelectTrim,
  selectedColor,
  estimateOptions,
  onUpdateOptions,
  estimateResult,
  onOpenConsultation,
}) => {
  const [isTrimDropdownOpen, setIsTrimDropdownOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const toggleTooltip = (key: string) => {
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  return (
    <section id="calculator" className="calculator-section section-padding">
      <div className="container">
        <div className="section-badge-center">
          <div className="calc-badge-pill">
            <span>EV5 RENT ESTIMATE</span>
          </div>
        </div>
        <h2 className="section-title-center">
          EV5 장기렌트,<br />
          내 조건에 맞는 예상 견적
        </h2>
        <p className="section-desc-center">
          트림부터 계약 기간, 선납금, 연간 주행거리까지.<br />
          원하는 조건을 선택하고 예상 월 렌트료를 확인해 보세요.
        </p>

        {/* The Precise Card Layout from Reference Image 2 */}
        <div className="calculator-card">
          {/* Card Top: Car Title & Thumbnail */}
          <div className="calc-header-row">
            <div className="calc-car-title-group">
              <h3 className="calc-model-name">EV5</h3>
            </div>

            <img
              src={selectedColor.image}
              alt={selectedTrim.name}
              className="calc-header-thumb"
            />
          </div>

          {/* Trim Selector Dropdown (Image 2) */}
          <div style={{ position: 'relative' }}>
            <div
              className="calc-trim-box"
              onClick={() => setIsTrimDropdownOpen(!isTrimDropdownOpen)}
              role="button"
              tabIndex={0}
            >
              <div className="calc-trim-left">
                <span className="calc-trim-tag">트림</span>
                <span className="calc-trim-text">{selectedTrim.name}</span>
              </div>
              <ChevronDown
                size={18}
                color="#6b7280"
                style={{
                  transform: isTrimDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              />
            </div>

            {/* Dropdown Menu */}
            {isTrimDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% - 16px)',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '14px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 50,
                  overflow: 'hidden',
                  marginBottom: '16px',
                }}
              >
                {EV5_TRIMS.map((trim) => {
                  const isSelected = trim.id === selectedTrim.id;
                  return (
                    <div
                      key={trim.id}
                      onClick={() => {
                        onSelectTrim(trim);
                        onUpdateOptions({ trimId: trim.id });
                        setIsTrimDropdownOpen(false);
                      }}
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: isSelected ? '#f8fafc' : '#fff',
                        borderBottom: '1px solid #f1f5f9',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.92rem',
                      }}
                    >
                      <div>
                        <div>{trim.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          차량가 {formatCurrency(trim.basePrice)}원 · {trim.badge}
                        </div>
                      </div>
                      {isSelected && <Check size={16} color="#008b74" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Monthly Price Card */}
          <div className="calc-price-card">
            <div className="price-main-row">
              <div className="fintech-icon">₩</div>
              <div className="price-digits">
                {formatCurrency(estimateResult.monthlyPayment)}
              </div>
              <div className="price-unit">원 / 월</div>
              <div className="price-arrow">&gt;</div>
            </div>
          </div>

          {/* 1. 계약기간 (2년, 3년, 5년) */}
          <div className="calc-field-group">
            <div className="calc-field-header">
              <span className="calc-field-label">
                계약기간
                <HelpCircle
                  size={14}
                  style={{ cursor: 'pointer', color: '#9ca3af' }}
                  onClick={() => toggleTooltip('term')}
                />
              </span>
            </div>

            {activeTooltip === 'term' && (
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                계약기간이 길수록 감가상각이 분산되어 월 납입금이 가장 저렴해집니다. 통상 5년(60개월) 선택률이 78%로 가장 높습니다.
              </div>
            )}

            <div className="calc-btn-grid">
              {([2, 3, 5] as RentalTermYears[]).map((term) => {
                const isSelected = estimateOptions.termYears === term;
                return (
                  <button
                    key={term}
                    type="button"
                    className={`calc-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onUpdateOptions({ termYears: term })}
                  >
                    {term === 5 && <span className="badge-top-tag">최대</span>}
                    <span>{term}년</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 선납금 (10%, 20%, 30%) */}
          <div className="calc-field-group">
            <div className="calc-field-header">
              <span className="calc-field-label">
                선납금
                <HelpCircle
                  size={14}
                  style={{ cursor: 'pointer', color: '#9ca3af' }}
                  onClick={() => toggleTooltip('prepayment')}
                />
              </span>
              <span className="calc-field-value-preview">
                {`${Math.round(estimateResult.prepaymentAmount / 10000)}만원`}
              </span>
            </div>

            {activeTooltip === 'prepayment' && (
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                선납금은 월 렌트료의 일부를 미리 납부하여 월 부담금을 낮추는 방식(소멸성)입니다. 보증금(만기 환급) 전환도 가능합니다.
              </div>
            )}

            <div className="calc-btn-grid">
              {([10, 20, 30] as PrepaymentRate[]).map((rate) => {
                const isSelected = estimateOptions.prepaymentRate === rate;
                return (
                  <button
                    key={rate}
                    type="button"
                    className={`calc-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onUpdateOptions({ prepaymentRate: rate })}
                  >
                    {rate === 10 && <span className="badge-top-tag">최다</span>}
                    <span>{rate}%</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. 1년에 주행할 거리 (1만, 2만, 3만) */}
          <div className="calc-field-group">
            <div className="calc-field-header">
              <span className="calc-field-label">
                1년에 주행할 거리
                <HelpCircle
                  size={14}
                  style={{ cursor: 'pointer', color: '#9ca3af' }}
                  onClick={() => toggleTooltip('mileage')}
                />
              </span>
              <span className="calc-field-value-preview">km</span>
            </div>

            {activeTooltip === 'mileage' && (
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                예상 주행거리에 맞춰 선택하세요. 2만km를 초과할 가능성이 있다면 2만km 이상을 추천해 드립니다.
              </div>
            )}

            <div className="calc-btn-grid">
              {([10000, 20000, 30000] as AnnualMileageKm[]).map((mileage) => {
                const isSelected = estimateOptions.mileageKm === mileage;
                const labelText =
                  mileage === 10000
                    ? '1만'
                    : mileage === 20000
                    ? '2만'
                    : '3만';

                return (
                  <button
                    key={mileage}
                    type="button"
                    className={`calc-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onUpdateOptions({ mileageKm: mileage })}
                  >
                    {mileage === 20000 && <span className="badge-top-tag">최다</span>}
                    <span>{labelText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. 이용상품 (신차 장기렌트 전용) */}
          <div className="calc-field-group">
            <div className="calc-field-header">
              <span className="calc-field-label">
                이용상품
                <HelpCircle
                  size={14}
                  style={{ cursor: 'pointer', color: '#9ca3af' }}
                  onClick={() => toggleTooltip('product')}
                />
              </span>
              <span style={{ fontSize: '0.82rem', color: '#008b74', fontWeight: 700 }}>신차 장기렌트 전용</span>
            </div>

            {activeTooltip === 'product' && (
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                신차 장기렌트는 금융 대출이 아닌 대여 상품으로 신용도에 영향이 없으며, 취등록세·자동차세·종합보험료가 전액 포함되어 있습니다.
              </div>
            )}

            <div className="product-select-card selected" style={{ cursor: 'default' }}>
              <div className="product-title">신차 장기렌트 (All-in-One)</div>
              <div className="product-desc">취등록세 · 공채 · 자동차세 · 종합보험료 100% 전액 포함</div>
              <div className="product-sub-desc">신용점수 영향 없음(DSR 규제 미적용) · 만기 시 인수/반납 자유 선택</div>
            </div>
          </div>

          {/* Main Action Button (견적 분석 받아보기 - Image 2) */}
          <button
            type="button"
            className="btn-calc-submit"
            onClick={onOpenConsultation}
          >
            견적 분석 받아보기
          </button>
        </div>
      </div>
    </section>
  );
};
