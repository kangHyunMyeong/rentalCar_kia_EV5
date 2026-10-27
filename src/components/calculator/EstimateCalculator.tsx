import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Check } from 'lucide-react';
import { CarColor, CarTrim } from '../../types/car';
import {
  EstimateOptions,
  EstimateResult,
  RentalTermYears,
  PrepaymentRate,
  DepositRate,
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
          {/* Card Top: Car Thumbnail (Left) & Model Name (Right) */}
          <div className="calc-header-row">
            <img
              src={selectedColor.image}
              alt={selectedTrim.name}
              className="calc-header-thumb"
            />

            <div className="calc-car-title-group">
              <h3 className="calc-model-name">EV5</h3>
            </div>
          </div>

          {/* Monthly Price Card */}
          <div className="calc-price-card">
            <div className="price-top-caption">차량가 기준 월 예상 이용료</div>
            <div className="price-main-row">
              <div className="fintech-icon">₩</div>
              <div className="price-digits">
                {formatCurrency(estimateResult.monthlyPayment)}
              </div>
              <div className="price-unit">원 / 월</div>
              <div className="price-arrow">&gt;</div>
            </div>

            {/* Included Expenses & Conditions Subtext */}
            <div className="price-included-info">
              <div className="price-included-sub">
                DSR 규제 미적용 · 만기 시 인수/반납 선택 가능
              </div>
              <div className="price-included-notice">
                ※ 일반적인 장기렌트 기준이며, 신용심사 및 계약 조건에 따라 이용 가능 여부가 달라집니다. 일부 상품은 만기 선택이 제한될 수 있습니다.
              </div>
            </div>
          </div>

          {/* Trim Selector Dropdown (Moved below Price Card, above Contract Term) */}
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
                <span className="calc-trim-price-tag" style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                  (차량가 {formatCurrency(selectedTrim.basePrice)}원)
                </span>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{trim.name}</span>
                          <span
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: '#008b74',
                              background: '#e6f7f4',
                              padding: '2px 8px',
                              borderRadius: '4px',
                            }}
                          >
                            차량가 {formatCurrency(trim.basePrice)}원
                          </span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                          {trim.badge} · {trim.spec.maxRange} · {trim.wheelSize}
                        </div>
                      </div>
                      {isSelected && <Check size={16} color="#008b74" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 1. 선납금 (0%, 10%, 20%, 30%) */}
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
                {estimateOptions.prepaymentRate === 0
                  ? '0원'
                  : `${Math.round(estimateResult.prepaymentAmount / 10000)}만원`}
              </span>
            </div>

            {activeTooltip === 'prepayment' && (
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                선납금은 월 렌트료의 일부를 미리 납부하여 월 부담금을 낮추는 방식(소멸성)입니다. 보증금(만기 환급) 전환도 가능합니다.
              </div>
            )}

            <div className="calc-btn-grid calc-btn-grid-4">
              {([
                { rate: 0, sub: undefined },
                { rate: 10, sub: '균형형' },
                { rate: 20, sub: undefined },
                { rate: 30, sub: undefined },
              ] as const).map(({ rate, sub }) => {
                const isSelected = estimateOptions.prepaymentRate === rate;
                return (
                  <button
                    key={rate}
                    type="button"
                    className={`calc-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onUpdateOptions({ prepaymentRate: rate as PrepaymentRate })}
                  >
                    <span className="calc-opt-main">{rate}%</span>
                    {sub && <span className="calc-opt-sub">{sub}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 보증금 (0%, 10%, 20%, 30%) */}
          <div className="calc-field-group">
            <div className="calc-field-header">
              <span className="calc-field-label">
                보증금
                <HelpCircle
                  size={14}
                  style={{ cursor: 'pointer', color: '#9ca3af' }}
                  onClick={() => toggleTooltip('deposit')}
                />
              </span>
              <span className="calc-field-value-preview">
                {estimateOptions.depositRate === 0
                  ? '0원'
                  : `${Math.round(estimateResult.depositAmount / 10000)}만원`}
              </span>
            </div>

            {activeTooltip === 'deposit' && (
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                보증금은 계약 시 맡기는 금액으로, 월 렌트료를 낮출 수 있습니다. 계약 만기 시 정산 후 돌려받거나 차량 인수금으로 사용할 수 있습니다.
              </div>
            )}

            <div className="calc-btn-grid calc-btn-grid-4">
              {([0, 10, 20, 30] as DepositRate[]).map((rate) => {
                const isSelected = estimateOptions.depositRate === rate;
                return (
                  <button
                    key={rate}
                    type="button"
                    className={`calc-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onUpdateOptions({ depositRate: rate })}
                  >
                    <span className="calc-opt-main">{rate}%</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. 1년에 주행할 거리 (1만, 1.5만, 2만, 3만, 무제한) */}
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
              <span className="calc-field-value-preview">
                {estimateOptions.mileageKm === -1
                  ? '무제한'
                  : `${estimateOptions.mileageKm === 15000 ? '1.5' : estimateOptions.mileageKm / 10000}만km`}
              </span>
            </div>

            {activeTooltip === 'mileage' && (
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                예상 주행거리에 맞춰 선택하세요. 2만km를 초과할 가능성이 있다면 2만km 이상 또는 무제한을 추천해 드립니다.
              </div>
            )}

            <div className="calc-btn-grid calc-btn-grid-5">
              {([
                { mileage: 10000, label: '1만', sub: undefined },
                { mileage: 15000, label: '1.5만', sub: undefined },
                { mileage: 20000, label: '2만', sub: '최다' },
                { mileage: 30000, label: '3만', sub: undefined },
                { mileage: -1, label: '무제한', sub: undefined },
              ] as const).map(({ mileage, label, sub }) => {
                const isSelected = estimateOptions.mileageKm === mileage;
                return (
                  <button
                    key={mileage}
                    type="button"
                    className={`calc-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onUpdateOptions({ mileageKm: mileage as AnnualMileageKm })}
                  >
                    <span className="calc-opt-main">{label}</span>
                    {sub && <span className="calc-opt-sub">{sub}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. 계약기간 (3년, 4년, 5년) */}
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
              {([
                { term: 3, sub: undefined },
                { term: 4, sub: undefined },
                { term: 5, sub: '장기 이용' },
              ] as const).map(({ term, sub }) => {
                const isSelected = estimateOptions.termYears === term;
                return (
                  <button
                    key={term}
                    type="button"
                    className={`calc-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onUpdateOptions({ termYears: term as RentalTermYears })}
                  >
                    <span className="calc-opt-main">{term}년</span>
                    {sub && <span className="calc-opt-sub">{sub}</span>}
                  </button>
                );
              })}
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
