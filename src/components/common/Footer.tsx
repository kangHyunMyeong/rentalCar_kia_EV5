import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <div className="footer-brand-title">KIA EV5 DIRECT</div>
            <p style={{ color: '#9ca3af', maxWidth: '420px', lineHeight: 1.6, marginBottom: '16px' }}>
              대한민국 주요 전업 렌터카사의 실시간 다이렉트 최저가 요율을 비교 분석하여 고객님께 가장 유리한 맞춤형 신차 장기렌트 플랜을 제공합니다.
            </p>
            <div style={{ display: 'flex', gap: '16px', color: '#6b7280', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="#008b74" />
                <span>금융감독원 공식 인허가 비교 플랫폼</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: '12px' }}>고객 상담 센터</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>
              1588-0000
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: 1.6 }}>
              운영시간: 평일 09:00 ~ 18:30 (주말/공휴일 온라인 견적 신청 가능)<br />
              전담 매니저 배정 및 1:1 카카오톡 실시간 상담 지원
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            (주)모빌리티다이렉트 | 대표이사: 홍길동 | 사업자등록번호: 123-45-67890 | 통신판매업신고: 제2026-서울강남-0000호<br />
            주소: 서울특별시 강남구 테헤란로 123 모빌리티타워 14층 | 개인정보관리책임자: 김현명
          </div>
          <div>
            © 2026 KIA EV5 RENTAL CAR DIRECT. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
