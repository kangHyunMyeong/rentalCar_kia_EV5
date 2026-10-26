import React, { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import { CarColor, CarTrim } from '../../types/car';
import { EstimateOptions, EstimateResult } from '../../types/estimate';
import { LeadService } from '../../services/leadService';
import { formatCurrency } from '../../services/estimateCalculator';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTrim: CarTrim;
  selectedColor: CarColor;
  estimateOptions: EstimateOptions;
  estimateResult: EstimateResult;
  onLeadSubmitted: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  selectedTrim,
  selectedColor,
  estimateOptions,
  estimateResult,
  onLeadSubmitted,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [memo, setMemo] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('이름과 연락처를 입력해 주세요.');
      return;
    }
    if (!agreed) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await LeadService.submitLead({
        name,
        phone,
        customerType: 'individual',
        preferredCallTime: '언제나 가능',
        requestedTrim: selectedTrim.name,
        requestedColor: selectedColor.nameKo,
        options: estimateOptions,
        calculatedMonthly: estimateResult.monthlyPayment,
        memo,
      });

      setIsSuccess(true);
      onLeadSubmitted();
    } catch {
      alert('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="닫기">
          <X size={20} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={60} color="#008b74" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '8px' }}>
              견적 분석 신청이 완료되었습니다!
            </h3>
            <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
              <strong>{name}</strong> 고객님께 10분 이내로 전담 버디가 배정되어<br />
              실시간 최저가 상세 비교 리포트를 전송해 드리겠습니다.
            </p>
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
                fontSize: '0.88rem',
                marginBottom: '24px',
              }}
            >
              <div><strong>선택 차량:</strong> {selectedTrim.name} ({selectedColor.nameKo})</div>
              <div><strong>계약 조건:</strong> {estimateOptions.termYears}년 · 선납금 {estimateOptions.prepaymentRate}% · 연 {estimateOptions.mileageKm / 10000}만km</div>
              <div><strong>예상 월 납입금:</strong> <span style={{ color: '#008b74', fontWeight: 800 }}>{formatCurrency(estimateResult.monthlyPayment)}원/월</span></div>
            </div>
            <button
              type="button"
              className="btn-primary-dark"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={onClose}
            >
              확인
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} color="#0c0d0e" />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0c0d0e' }}>
                실시간 다이렉트 최저가 특판
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', marginBottom: '6px' }}>
              EV5 정밀 견적 분석 받아보기
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '20px' }}>
              금융사별 실시간 승인율, 비공개 할인 프로모션, 보조금 잔여 현황까지 전문 상담원이 1:1로 분석해 드립니다.
            </p>

            {/* Selected Vehicle Summary Pill */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedTrim.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {selectedColor.nameKo} · {estimateOptions.termYears}년 · 선납금 {estimateOptions.prepaymentRate}% · 신차 장기렌트
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>예상 월 납입금</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#008b74' }}>
                  {formatCurrency(estimateResult.monthlyPayment)}원
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">이름 / 담당자명</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="예: 홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">연락처</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="예: 010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">추가 요청사항 (선택)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="예: 빌트인캠2 옵션 추가 희망, 스노우 화이트 즉시출고 가능 여부 등"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  id="agree-check"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#0c0d0e' }}
                />
                <label htmlFor="agree-check" style={{ fontSize: '0.8rem', color: '#6b7280', cursor: 'pointer' }}>
                  [필수] 개인정보 수집 및 최저가 견적 안내를 위한 이용에 동의합니다.
                </label>
              </div>

              <button
                type="submit"
                className="btn-calc-submit"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? '견적 신청 분석 중...' : '최저가 견적서 무료 신청하기'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
