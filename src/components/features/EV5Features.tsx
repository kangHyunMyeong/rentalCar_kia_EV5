import { Sparkles } from 'lucide-react';

import ev5Img1 from '@images/kia_ev5_1.webp';
import ev5Img2 from '@images/kia_ev5_2.webp';
import ev5Img5 from '@images/kia_ev5_5.webp';
import ev5Img7 from '@images/kia_ev5_7.webp';
import ev5Img8 from '@images/kia_ev5_8.webp';
import ev5Img9 from '@images/kia_ev5_9.webp';

export interface HighlightCardItem {
  id: string;
  image: string;
  tag: string;
  badge: string;
  title: string;
  desc: string;
}

export const EV5Features: React.FC = () => {
  // 6 Priority Highlight Cards (PC: 3 columns x 2 rows)
  const cards: HighlightCardItem[] = [
    {
      id: 'highlight-1',
      image: ev5Img2,
      tag: 'SUV DESIGN',
      badge: '디지털 타이거 페이스',
      title: '강인한 존재감, 세련된 디자인',
      desc: '정통 SUV의 당당한 실루엣과 미래지향적인 디자인으로 완성한 EV5만의 스타일.',
    },
    {
      id: 'highlight-2',
      image: ev5Img9,
      tag: 'SPACIOUS INTERIOR',
      badge: '2,750mm 휠베이스',
      title: '함께할수록 여유로운 실내 공간',
      desc: '넉넉한 2열 공간으로 일상 속 출퇴근부터 가족과 함께하는 여행까지 편안하게.',
    },
    {
      id: 'highlight-3',
      image: ev5Img7,
      tag: 'FULL FLAT SPACE',
      badge: '2열 풀플랫 시트',
      title: '필요한 만큼 자유롭게 넓어지는 공간',
      desc: '6:4 폴딩 시트로 넓게 활용하는 적재 공간. 여행과 레저 활동까지 실용적으로.',
    },
    {
      id: 'highlight-4',
      image: ev5Img8,
      tag: 'DIGITAL COCKPIT',
      badge: '파노라믹 와이드 디스플레이',
      title: '한눈에 들어오는 스마트한 운전석',
      desc: '클러스터와 내비게이션, 공조 정보를 직관적으로 확인하는 편리한 디지털 공간.',
    },
    {
      id: 'highlight-5',
      image: ev5Img1,
      tag: 'V2L TECHNOLOGY',
      badge: '실내 V2L · 220V',
      title: '차 안에서도 편리한 전원 활용',
      desc: '차량 내부의 220V 콘센트를 통해 다양한 전자기기를 사용할 수 있는 실용적인 편의 기능.',
    },
    {
      id: 'highlight-6',
      image: ev5Img5,
      tag: 'SMART SAFETY',
      badge: '첨단 운전자 보조 시스템',
      title: '운전의 부담을 덜어주는 안전 기술',
      desc: '전방 충돌방지 보조, 차로 유지 보조 등 다양한 주행 보조 기능으로 더욱 든든한 드라이브.',
    },
  ];

  return (
    <section id="features" className="highlights-section section-padding">
      <div className="container highlights-container">
        {/* Header with requested texts */}
        <div className="highlights-header">
          <div className="highlights-badge-pill">
            <Sparkles size={14} className="highlights-badge-icon" />
            <span>EV5 HIGHLIGHTS</span>
          </div>

          <h2 className="highlights-title">기아 EV5, 일상을 넓히는 전기 SUV</h2>

          <p className="highlights-description">
            당당한 SUV 디자인과 넉넉한 공간, 스마트한 전동화 기술까지.<br />
            일상의 이동부터 특별한 여행까지 더욱 여유롭게 만들어줍니다.
          </p>
        </div>

        {/* 6 Image Cards Grid (PC: 3 columns x 2 rows) */}
        <div className="highlights-cards-grid">
          {cards.map((card) => (
            <div key={card.id} className="highlight-image-card">
              {/* Background Full-bleed Car Photo */}
              <div className="highlight-image-wrapper">
                <img
                  src={card.image}
                  alt={card.title}
                  className="highlight-card-img"
                  loading="lazy"
                />
                <div className="highlight-card-gradient" />
              </div>

              {/* Top Floating Badge */}
              <div className="highlight-card-top-tag">
                <span className="card-badge-pill">{card.badge}</span>
              </div>

              {/* Bottom Content Area */}
              <div className="highlight-card-content">
                <span className="highlight-card-category">{card.tag}</span>
                <h3 className="highlight-card-headline">{card.title}</h3>
                <p className="highlight-card-subtext">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
