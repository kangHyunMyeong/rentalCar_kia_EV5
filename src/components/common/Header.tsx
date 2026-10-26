import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenConsultation: () => void;
  onOpenAdminPreview?: () => void;
  leadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConsultation,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container header-inner">
          {/* Brand Logo - Volterra Minimalist Aesthetic */}
          <div className="brand-wrapper">
            <a href="#" className="brand-wrapper">
              <div className="brand-logo-badge" title="Kia EV5 Direct">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="brand-title">KIA EV5</span>
            </a>
          </div>

          {/* Navigation Links - Desktop */}
          <nav>
            <ul className="nav-links">
              <li><a href="#hero" className="nav-link active" onClick={(e) => handleNavClick(e, 'hero')}>차량 정보</a></li>
              <li><a href="#calculator" className="nav-link" onClick={(e) => handleNavClick(e, 'calculator')}>실시간 최저가 견적</a></li>
              <li><a href="#features" className="nav-link" onClick={(e) => handleNavClick(e, 'features')}>EV5 특장점</a></li>
              <li><a href="#reviews" className="nav-link" onClick={(e) => handleNavClick(e, 'reviews')}>고객 후기</a></li>
              <li><a href="#faq" className="nav-link" onClick={(e) => handleNavClick(e, 'faq')}>자주 묻는 질문</a></li>
            </ul>
          </nav>

          {/* Header Action Buttons */}
          <div className="header-actions">
            {/* Direct CTA Button (Volterra Pill) */}
            <button
              type="button"
              className="btn-header-cta"
              onClick={onOpenConsultation}
            >
              <span>빠른 견적</span>
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>→</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="mobile-nav-drawer"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="mobile-nav-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-nav-header">
              <span className="brand-title">KIA EV5</span>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>

            <ul className="mobile-nav-list">
              <li>
                <a href="#hero" onClick={(e) => handleNavClick(e, 'hero')}>차량 정보</a>
              </li>
              <li>
                <a href="#calculator" onClick={(e) => handleNavClick(e, 'calculator')}>실시간 최저가 견적</a>
              </li>
              <li>
                <a href="#features" onClick={(e) => handleNavClick(e, 'features')}>EV5 특장점</a>
              </li>
              <li>
                <a href="#reviews" onClick={(e) => handleNavClick(e, 'reviews')}>고객 후기</a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')}>자주 묻는 질문</a>
              </li>
            </ul>

            <div className="mobile-nav-footer">
              <button
                type="button"
                className="btn-primary-dark"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenConsultation();
                }}
              >
                실시간 최저가 견적받기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
