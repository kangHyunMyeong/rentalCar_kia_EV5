import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { REVIEWS } from '../../data/reviews';

// 3세트 복제로 무한 루프 구현 (Set 0: 0..22, Set 1: 23..45 [중심], Set 2: 46..68)
const CLONED_REVIEWS = [...REVIEWS, ...REVIEWS, ...REVIEWS];
const TOTAL_COUNT = REVIEWS.length; // 23

export const ReviewSection: React.FC = () => {
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const isJumpingRef = useRef(false);

  // 단일 세트(23개 카드)의 총 이동 픽셀 거리 계산
  const getSingleSetWidth = useCallback(() => {
    const el = scrollTrackRef.current;
    if (!el || el.children.length < TOTAL_COUNT * 2) return 0;
    const firstCard = el.children[0] as HTMLElement;
    const secondSetFirst = el.children[TOTAL_COUNT] as HTMLElement;
    return secondSetFirst.offsetLeft - firstCard.offsetLeft;
  }, []);

  // 카드 1개의 이동 스텝(카드 폭 + gap 20px)
  const getCardStep = useCallback(() => {
    const el = scrollTrackRef.current;
    if (!el || !el.children[0]) return 300;
    const firstCard = el.children[0] as HTMLElement;
    return firstCard.offsetWidth + 20;
  }, []);

  // 초기 위치: 가운데 세트(Set 1)의 첫 카드로 세팅
  useEffect(() => {
    const el = scrollTrackRef.current;
    if (!el) return;

    const initScroll = () => {
      const setWidth = getSingleSetWidth();
      if (setWidth > 0 && (el.scrollLeft < setWidth * 0.5 || el.scrollLeft === 0)) {
        isJumpingRef.current = true;
        el.scrollLeft = setWidth;
        setTimeout(() => {
          isJumpingRef.current = false;
        }, 60);
      }
    };

    const timer = setTimeout(initScroll, 80);
    window.addEventListener('resize', initScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initScroll);
    };
  }, [getSingleSetWidth]);

  // 스크롤 이벤트 감지 및 경계선 무한 루프 자동 보정 (Debounced Boundary Wrap)
  useEffect(() => {
    const el = scrollTrackRef.current;
    if (!el) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScrollEvent = () => {
      if (isJumpingRef.current) return;

      const setWidth = getSingleSetWidth();
      const step = getCardStep();
      if (setWidth <= 0 || step <= 0) return;

      // 현재 활성화 카드 인덱스 (0 ~ 22) 계산
      const offsetInSet = ((el.scrollLeft - setWidth) % setWidth + setWidth) % setWidth;
      const activeIdx = Math.round(offsetInSet / step) % TOTAL_COUNT;
      setCurrentIndex(activeIdx);

      // 스크롤이 끝났을 때 경계에 다다르면 가운데 세트로 무음(instant) 위치 재조정
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (!el || isJumpingRef.current) return;
        const currentSetWidth = getSingleSetWidth();
        if (currentSetWidth <= 0) return;

        // 오른쪽 끝(Set 2 후반)에 도달한 경우 Set 1로 즉시 워프
        if (el.scrollLeft >= currentSetWidth * 1.85) {
          isJumpingRef.current = true;
          el.scrollLeft -= currentSetWidth;
          setTimeout(() => { isJumpingRef.current = false; }, 40);
        }
        // 왼쪽 끝(Set 0 전반)에 도달한 경우 Set 1로 즉시 워프
        else if (el.scrollLeft <= currentSetWidth * 0.15) {
          isJumpingRef.current = true;
          el.scrollLeft += currentSetWidth;
          setTimeout(() => { isJumpingRef.current = false; }, 40);
        }
      }, 140);
    };

    el.addEventListener('scroll', handleScrollEvent, { passive: true });
    return () => {
      el.removeEventListener('scroll', handleScrollEvent);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [getSingleSetWidth, getCardStep]);

  // 좌우 버튼 클릭 시 부드럽게 무한 스크롤 이동
  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollTrackRef.current;
    if (!el) return;

    const setWidth = getSingleSetWidth();
    const step = getCardStep();
    if (setWidth <= 0 || step <= 0) return;

    // 반응형 스크롤 폭: 데스크톱은 2장, 모바일/태블릿은 1장씩
    const scrollAmount = el.clientWidth >= 1024 ? step * 2 : step;

    if (direction === 'right') {
      // 오른쪽 이동 전, 경계선 근접 시 가운데 세트로 즉시 위치 보정 후 이동
      if (el.scrollLeft >= setWidth * 1.8) {
        isJumpingRef.current = true;
        el.scrollLeft -= setWidth;
        isJumpingRef.current = false;
      }
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
      // 왼쪽 이동 전, 경계선 근접 시 가운데 세트로 즉시 위치 보정 후 이동
      if (el.scrollLeft <= setWidth * 0.2) {
        isJumpingRef.current = true;
        el.scrollLeft += setWidth;
        isJumpingRef.current = false;
      }
      el.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  // 자동 슬라이드 (4.5초 주기, 마우스 호버 시 일시 정지)
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleScroll('right');
    }, 4500);
    return () => clearInterval(interval);
  }, [isHovered, getSingleSetWidth, getCardStep]);

  return (
    <section id="reviews" className="reviews-section section-padding">
      <div className="container reviews-container">
        {/* Header: Title + Subtitle + Desktop Navigation Arrows */}
        <div className="reviews-header-row">
          <div className="reviews-header-left">
            <h2 className="reviews-lead-title">고객 리얼 후기</h2>
          </div>
          <div className="reviews-header-right">
            <p className="reviews-lead-sub">실제 출고 고객의 EV5 선택 경험을 확인해 보세요.</p>
            {/* Desktop Navigation Arrows (무한 루프이므로 disabled 없음) */}
            <div className="reviews-nav-arrows desktop-arrows">
              <button
                type="button"
                className="review-arrow-btn"
                onClick={() => handleScroll('left')}
                aria-label="이전 후기 보기"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="review-arrow-btn"
                onClick={() => handleScroll('right')}
                aria-label="다음 후기 보기"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Infinite Slider Track */}
        <div
          className="reviews-slider-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div
            ref={scrollTrackRef}
            className="reviews-slider-track"
          >
            {CLONED_REVIEWS.map((review, idx) => (
              <div key={`${review.id}-${idx}`} className="review-slide-card">
                {/* Photo of vehicle */}
                <div className="review-card-media">
                  <img
                    src={review.imageUrl}
                    alt={review.title}
                    className="review-card-img"
                    loading="lazy"
                  />
                </div>

                {/* Content Area */}
                <div className="review-card-content">
                  <h3 className="review-card-headline">{review.title}</h3>
                  <p className="review-card-desc">{review.content}</p>

                  {/* Customer author & stars info */}
                  <div className="review-card-footer">
                    <span className="review-card-author">{review.author}</span>
                    <div className="review-card-rating">
                      <Star size={13} fill="#0c0d0e" color="#0c0d0e" />
                      <Star size={13} fill="#0c0d0e" color="#0c0d0e" />
                      <Star size={13} fill="#0c0d0e" color="#0c0d0e" />
                      <Star size={13} fill="#0c0d0e" color="#0c0d0e" />
                      <Star size={13} fill="#0c0d0e" color="#0c0d0e" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation & Indicator Row */}
        <div className="reviews-bottom-row">
          <div className="reviews-bottom-nav">
            <button
              type="button"
              className="review-arrow-btn-circle"
              onClick={() => handleScroll('left')}
              aria-label="이전 후기 슬라이드"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="reviews-indicator-group">
              <div className="reviews-counter-pill">
                <span className="reviews-counter-current">{String(currentIndex + 1).padStart(2, '0')}</span>
                <span className="reviews-counter-sep">/</span>
                <span className="reviews-counter-total">{TOTAL_COUNT}</span>
              </div>
              <div className="reviews-pagination-dots">
                {Array.from({ length: 5 }).map((_, i) => {
                  const activeDot = Math.min(4, Math.floor((currentIndex / TOTAL_COUNT) * 5));
                  return (
                    <span
                      key={i}
                      className={`pagination-dot ${activeDot === i ? 'active' : ''}`}
                    />
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="review-arrow-btn-circle"
              onClick={() => handleScroll('right')}
              aria-label="다음 후기 슬라이드"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
