import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { CarColor, CarTrim } from '../../types/car';
import { EstimateOptions, EstimateResult, PublicLeadPayload } from '../../types/estimate';
import { LeadService, MULTI_LANDING_SITE_ID } from '../../services/leadService';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('이름을 입력해 주세요.');
      return;
    }
    if (!phone.trim()) {
      alert('연락처를 입력해 주세요.');
      return;
    }
    if (!agreed) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // 1) Context & Device & UTM 파라미터 파싱
    const isMobile =
      typeof window !== 'undefined'
        ? /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
          window.innerWidth <= 768
        : false;

    const utmParams: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
        const val = sp.get(key);
        if (val) utmParams[key] = val;
      });
    }

    const mileageLabel =
      estimateOptions.mileageKm === -1
        ? '무제한'
        : `연 ${estimateOptions.mileageKm === 15000 ? '1.5' : estimateOptions.mileageKm / 10000}만km`;

    // 2) selections: 고객이 견적기에서 선택한 조건들을 모두 담음
    const selections = [
      { key: 'model', label: '관심 모델', value: '기아 EV5' },
      { key: 'trim', label: '선택 트림', value: selectedTrim.name },
      { key: 'color', label: '외장 컬러', value: selectedColor.nameKo },
      {
        key: 'term',
        label: '계약 기간',
        value: `${estimateOptions.termYears}년 (${estimateOptions.termYears * 12}개월)`,
      },
      { key: 'prepayment', label: '선납금', value: `${estimateOptions.prepaymentRate}%` },
      { key: 'deposit', label: '보증금', value: `${estimateOptions.depositRate}%` },
      { key: 'mileage', label: '연간 주행거리', value: mileageLabel },
      { key: 'product_type', label: '이용 상품', value: '장기렌트' },
      {
        key: 'estimated_monthly',
        label: '예상 월 렌트료',
        value: `${formatCurrency(estimateResult.monthlyPayment)}원/월`,
      },
    ];

    // 3) Multi Landing Admin 규격에 맞춘 payload
    const publicLeadPayload: PublicLeadPayload = {
      site_id: MULTI_LANDING_SITE_ID,
      name: name.trim(),
      phone: phone.trim(),
      message: memo.trim() || undefined,
      payload: {
        selections,
        context: {
          device: isMobile ? 'mobile' : 'desktop',
          path: typeof window !== 'undefined' ? window.location.pathname : '/',
          url: typeof window !== 'undefined' ? window.location.href : '',
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          ...utmParams,
        },
      },
    };

    try {
      // Multi Landing Admin 고객 DB로 UTF-8 JSON 전송
      await LeadService.submitPublicLead(publicLeadPayload);

      // 로컬 스토리지 동기화 (로컬 관리자 프리뷰 모달용)
      try {
        await LeadService.submitLead({
          name: name.trim(),
          phone: phone.trim(),
          customerType: 'individual',
          preferredCallTime: '언제나 가능',
          requestedTrim: selectedTrim.name,
          requestedColor: selectedColor.nameKo,
          options: estimateOptions,
          calculatedMonthly: estimateResult.monthlyPayment,
          memo: memo.trim(),
        });
      } catch {
        // 로컬 스토리지 에러는 무시
      }

      setIsSuccess(true);
      onLeadSubmitted();
    } catch (err: any) {
      const msg = err?.message || '신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="consultation-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={handleClose} aria-label="닫기">
          <X size={20} />
        </button>

        {isSuccess ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={60} color="#008b74" style={{ margin: '0 auto 16px' }} />
            <h3 id="consultation-modal-title" style={{ fontSize: '1.45rem', fontWeight: 800, marginBottom: '8px' }}>
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
              <div><strong>계약 조건:</strong> {estimateOptions.termYears}년 · 선납금 {estimateOptions.prepaymentRate}% · 보증금 {estimateOptions.depositRate}% · {estimateOptions.mileageKm === -1 ? '주행거리 무제한' : `연 ${estimateOptions.mileageKm === 15000 ? '1.5' : estimateOptions.mileageKm / 10000}만km`}</div>
              <div><strong>예상 월 납입금:</strong> <span style={{ color: '#008b74', fontWeight: 800, whiteSpace: 'nowrap' }}>{formatCurrency(estimateResult.monthlyPayment)}원/월</span></div>
            </div>
            <button
              type="button"
              className="btn-primary-dark"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={handleClose}
            >
              확인
            </button>
          </div>
        ) : (
          <div>
            <h3 id="consultation-modal-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', marginBottom: '6px', paddingRight: '36px' }}>
              EV5 정밀 견적 분석 받아보기
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '20px' }}>
              금융사별 실시간 승인율, 비공개 할인 프로모션, 보조금 잔여 현황까지 전문 상담원이 1:1로 분석해 드립니다.
            </p>

            {/* Selected Vehicle Summary Pill */}
            <div className="modal-vehicle-summary">
              <div className="modal-vehicle-info">
                <div className="modal-vehicle-name">{selectedTrim.name}</div>
                <div className="modal-vehicle-specs">
                  {selectedColor.nameKo} · {estimateOptions.termYears}년 · 선납금 {estimateOptions.prepaymentRate}% · 보증금 {estimateOptions.depositRate}% · {estimateOptions.mileageKm === -1 ? '무제한' : `연 ${estimateOptions.mileageKm === 15000 ? '1.5' : estimateOptions.mileageKm / 10000}만km`} · 장기렌트
                </div>
              </div>
              <div className="modal-vehicle-price-box">
                <div className="modal-vehicle-price-label">예상 월 납입금</div>
                <div className="modal-vehicle-price-val">
                  {formatCurrency(estimateResult.monthlyPayment)}원
                </div>
              </div>
            </div>

            {/* 한글 인코딩 방지를 위한 acceptCharset="UTF-8" 적용 */}
            <form onSubmit={handleSubmit} acceptCharset="UTF-8">
              <div className="form-group">
                <label className="form-label" htmlFor="lead-name">이름 / 담당자명</label>
                <input
                  id="lead-name"
                  type="text"
                  className="form-input"
                  placeholder="예: 홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lead-phone">연락처</label>
                <input
                  id="lead-phone"
                  type="tel"
                  className="form-input"
                  placeholder="예: 010-1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="lead-memo">추가 요청사항 (선택)</label>
                <textarea
                  id="lead-memo"
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

              {/* 실패 시 에러 메시지 표시 */}
              {errorMessage && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                    lineHeight: 1.4,
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

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
