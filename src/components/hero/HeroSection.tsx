import React, { useState } from 'react';
import { MoveHorizontal, Layers, Monitor, Plug, Check } from 'lucide-react';
import { CarColor, CarTrim } from '../../types/car';
import { EV5_COLORS } from '../../data/cars';

interface HeroSectionProps {
  selectedColor: CarColor;
  onSelectColor: (color: CarColor) => void;
  selectedTrim?: CarTrim;
  onOpenConsultation: () => void;
  onScrollToCalculator?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedColor,
  onSelectColor,
  onOpenConsultation,
}) => {
  const [isChanging, setIsChanging] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<CarColor | null>(null);

  const handleColorChange = (color: CarColor) => {
    if (color.id === selectedColor.id) return;
    setIsChanging(true);
    setTimeout(() => {
      onSelectColor(color);
      setIsChanging(false);
    }, 150);
  };

  const activeOrHoveredColor = hoveredColor || selectedColor;

  return (
    <section id="hero" className="hero-section">
      {/* Background Curved Graphic */}
      <div className="hero-curve-bg" />

      {/* Main Container */}
      <div className="container hero-container-inner">
        <div className="hero-content-grid">
          {/* Main Headline & Intro (Left Column) */}
          <div className="hero-headline-block">
            <h1 className="hero-title">
              기아 EV5,<br />
              일상은 더 넓게.<br />
              장기렌트는 내 조건대로.
            </h1>

            <p className="hero-subtitle">
              넉넉한 공간과 스마트한 전동화 기술을 갖춘 기아 EV5.<br />
              계약 기간부터 초기비용, 차량 옵션까지 비교하고 나에게 맞는 장기렌트 견적을 확인해 보세요.
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="btn-primary-dark"
                onClick={onOpenConsultation}
              >
                <span>EV5 장기렌트 견적받기</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Vehicle Visual Showcase with Maximized Scale */}
          <div className="hero-visual-showcase">
            <div className="hero-car-image-container">
              <img
                src={selectedColor.image}
                alt={selectedColor.imageAlt || `기아 EV5 ${selectedColor.nameKo} (${selectedColor.name}) 외장 컬러 측면 실루엣 디자인`}
                className={`hero-car-image ${isChanging ? 'changing' : ''}`}
                loading="eager"
              />
            </div>

            {/* Mobile/Tablet Only: Horizontal Swatch Bar underneath car */}
            <div className="hero-color-bar-mobile mobile-only">
              <ul className="mobile-color-list">
                {EV5_COLORS.map((color) => {
                  const isActive = color.id === selectedColor.id;
                  return (
                    <li key={color.id}>
                      <button
                        type="button"
                        className={`mobile-color-btn ${isActive ? 'active' : ''}`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => handleColorChange(color)}
                        title={color.nameKo}
                        aria-label={`색상 선택: ${color.nameKo}`}
                      >
                        {isActive && (
                          <Check
                            size={12}
                            color={color.hex === '#F4F5F7' || color.hex === '#CBCAC4' ? '#111' : '#fff'}
                            style={{ margin: 'auto' }}
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mobile-color-label">{selectedColor.nameKo}</div>
            </div>
          </div>
        </div>

        {/* Vehicle Information Strip */}
        <ul className="hero-spec-strip" aria-label="기아 EV5 핵심 제원">
          <li className="spec-strip-item">
            <div className="spec-icon-box">
              <MoveHorizontal size={26} />
            </div>
            <div className="spec-strip-meta">
              <span className="spec-strip-value">2,750mm</span>
              <span className="spec-strip-label">여유로운 휠베이스</span>
            </div>
          </li>

          <li className="spec-strip-item">
            <div className="spec-icon-box">
              <Layers size={26} />
            </div>
            <div className="spec-strip-meta">
              <span className="spec-strip-value">풀플랫</span>
              <span className="spec-strip-label">2열 6:4 폴딩 시트</span>
            </div>
          </li>

          <li className="spec-strip-item">
            <div className="spec-icon-box">
              <Monitor size={26} />
            </div>
            <div className="spec-strip-meta">
              <span className="spec-strip-value">12.3인치</span>
              <span className="spec-strip-label">디지털 클러스터</span>
            </div>
          </li>

          <li className="spec-strip-item">
            <div className="spec-icon-box">
              <Plug size={26} />
            </div>
            <div className="spec-strip-meta">
              <span className="spec-strip-value">220V</span>
              <span className="spec-strip-label">실내 V2L 콘센트</span>
            </div>
          </li>
        </ul>
      </div>

      {/* PC ONLY: Vertical Color Swatches Sidebar pinned to the FAR RIGHT EDGE of the screen */}
      <aside className="hero-color-sidebar desktop-only" aria-label="차량 색상 선택">
        {/* Hover Tooltip indicating color name */}
        <div className="sidebar-color-tooltip">
          <span className="tooltip-name">{activeOrHoveredColor.nameKo}</span>
          {activeOrHoveredColor.isPopular && <span className="tooltip-tag-best">BEST</span>}
          {activeOrHoveredColor.type === 'matte' && <span className="tooltip-tag-matte">MATTE</span>}
        </div>

        <ul className="vertical-color-list">
          {EV5_COLORS.map((color) => {
            const isActive = color.id === selectedColor.id;
            return (
              <li key={color.id} className="vertical-color-item">
                <button
                  type="button"
                  className={`vertical-color-btn ${isActive ? 'active' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => handleColorChange(color)}
                  onMouseEnter={() => setHoveredColor(color)}
                  onMouseLeave={() => setHoveredColor(null)}
                  title={color.nameKo}
                  aria-label={`색상 선택: ${color.nameKo}`}
                >
                  {isActive && (
                    <Check
                      size={13}
                      color={color.hex === '#F4F5F7' || color.hex === '#CBCAC4' ? '#111' : '#fff'}
                      style={{ margin: 'auto' }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Vertical 'COLORS' Text Label matching reference image */}
        <div className="vertical-colors-label">COLORS</div>
      </aside>
    </section>
  );
};
