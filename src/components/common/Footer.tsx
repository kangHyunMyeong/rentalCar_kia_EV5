import React, { useState } from 'react';
import { X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="site-footer">
      <div className="container footer-container">
        {/* Top Header Row: Brand Logo + Terms / Privacy Links */}
        <div className="footer-header-row">
          <div className="footer-brand-name">핏카컴퍼니</div>
          <div className="footer-policy-links">
            <button
              type="button"
              className="footer-policy-link"
              onClick={() => setActivePolicy('privacy')}
            >
              개인정보처리방침
            </button>
            <span className="footer-link-divider">|</span>
            <button
              type="button"
              className="footer-policy-link"
              onClick={() => setActivePolicy('terms')}
            >
              이용약관
            </button>
          </div>
        </div>

        {/* Divider Line */}
        <div className="footer-divider" />

        {/* Info & Copyright Row */}
        <div className="footer-info-row">
          <div className="footer-company-meta">
            <span className="footer-meta-item">
              <span className="footer-meta-label">상호명</span>
              <span className="footer-meta-val">핏카컴퍼니</span>
            </span>
            <span className="footer-meta-sep">·</span>
            <span className="footer-meta-item">
              <span className="footer-meta-label">대표자</span>
              <span className="footer-meta-val">김민철</span>
            </span>
            <span className="footer-meta-sep">·</span>
            <span className="footer-meta-item">
              <span className="footer-meta-label">사업자등록번호</span>
              <span className="footer-meta-val">578-36-01253</span>
            </span>
            <span className="footer-meta-sep">·</span>
            <span className="footer-meta-item">
              <span className="footer-meta-label">주소</span>
              <span className="footer-meta-val">인천 서구 파랑로 495 에이스하이테크시티 1동 1004호</span>
            </span>
          </div>

          <div className="footer-copyright">
            © FitCar Company. All rights reserved.
          </div>
        </div>
      </div>

      {/* Modal for Privacy Policy / Terms */}
      {activePolicy && (
        <div className="modal-overlay" onClick={() => setActivePolicy(null)}>
          <div
            className="modal-container"
            style={{ maxWidth: '640px', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setActivePolicy(null)}
              aria-label="닫기"
            >
              <X size={20} />
            </button>

            {activePolicy === 'privacy' ? (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
                  개인정보처리방침
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p>
                    <strong>1. 개인정보의 수집 및 이용 목적</strong><br />
                    핏카컴퍼니는 기아 EV5 장기렌트 다이렉트 견적 산출, 최적 금융 플랜 비교 분석, 전문 상담 매니저 배정 및 고객 맞춤형 혜택 안내를 목적으로 개인정보를 수집·이용합니다.
                  </p>
                  <p>
                    <strong>2. 수집하는 개인정보 항목</strong><br />
                    성명, 휴대전화번호, 희망 트림 및 계약 조건(이용 기간, 선납금 비율 등).
                  </p>
                  <p>
                    <strong>3. 보유 및 이용 기간</strong><br />
                    상담 완료 및 고객 서비스 제공 완료 시점까지 보유하며, 정보주체의 삭제 요청 시 지체 없이 파기합니다.
                  </p>
                  <p>
                    <strong>4. 개인정보의 파기 절차</strong><br />
                    보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 재생 불가능한 기술적 방법을 사용하여 안전하게 파기합니다.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
                  서비스 이용약관
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p>
                    <strong>제1조 (목적)</strong><br />
                    본 약관은 핏카컴퍼니가 제공하는 기아 EV5 실시간 장기렌트 비교 견적 서비스의 이용 조건 및 절차에 관한 제반 사항을 규정함을 목적으로 합니다.
                  </p>
                  <p>
                    <strong>제2조 (견적 및 계약 안내)</strong><br />
                    사이트 상에 표기된 예상 견적은 표준 기준 요율이며, 고객님의 신용 평가 결과, 제조사 프로모션 및 최종 심사 조건에 따라 월 납입금이 일부 상이할 수 있습니다.
                  </p>
                  <p>
                    <strong>제3조 (회사의 의무)</strong><br />
                    핏카컴퍼니는 고객님의 소중한 정보를 안전하게 보호하며, 신속하고 정확한 견적 산출 및 친절한 상담 서비스를 제공하기 위해 최선을 다합니다.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
};
