import React from 'react';
import { X, Check } from 'lucide-react';
import { CarTrim } from '../../types/car';
import { EV5_TRIMS } from '../../data/cars';
import { formatCurrency } from '../../services/estimateCalculator';

interface TrimDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTrim: CarTrim;
  onSelectTrim: (trim: CarTrim) => void;
}

export const TrimDetailModal: React.FC<TrimDetailModalProps> = ({
  isOpen,
  onClose,
  selectedTrim,
  onSelectTrim,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="닫기">
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111', marginBottom: '6px' }}>
          기아 EV5 공식 트림 및 사양 안내
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '24px' }}>
          배터리 용량 및 구동 방식(2WD/AWD)에 따른 5가지 세부 트림 정보를 비교해 보세요.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {EV5_TRIMS.map((trim) => {
            const isSelected = trim.id === selectedTrim.id;
            return (
              <div
                key={trim.id}
                style={{
                  border: isSelected ? '2px solid #008b74' : '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  background: isSelected ? '#f0fdfa' : '#fff',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                        {trim.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: '#e0f2fe',
                          color: '#0369a1',
                          padding: '2px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        {trim.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      기본 차량가: <strong>{formatCurrency(trim.basePrice)}원</strong> · 기준 월 렌트료: <strong style={{ color: '#008b74' }}>{formatCurrency(trim.baseRentMonthly)}원/월</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTrim(trim);
                      onClose();
                    }}
                    style={{
                      background: isSelected ? '#008b74' : '#f1f5f9',
                      color: isSelected ? '#fff' : '#334155',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    {isSelected ? '선택됨' : '이 트림 선택'}
                  </button>
                </div>

                {/* Specs Pill Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '8px',
                    background: isSelected ? '#ffffff' : '#f8fafc',
                    padding: '10px',
                    borderRadius: '10px',
                    marginBottom: '12px',
                    fontSize: '0.78rem',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <div style={{ color: '#94a3b8' }}>배터리</div>
                    <div style={{ fontWeight: 700 }}>{trim.spec.batteryCapacity}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8' }}>주행거리</div>
                    <div style={{ fontWeight: 700, color: '#008b74' }}>{trim.spec.maxRange}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8' }}>최고출력</div>
                    <div style={{ fontWeight: 700 }}>{trim.spec.maxPower}</div>
                  </div>
                  <div>
                    <div style={{ color: '#94a3b8' }}>0-100km/h</div>
                    <div style={{ fontWeight: 700 }}>{trim.spec.zeroToHundred}</div>
                  </div>
                </div>

                {/* Features List */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {trim.features.map((feature, fIdx) => (
                    <li key={fIdx} style={{ fontSize: '0.8rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Check size={14} color="#008b74" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
