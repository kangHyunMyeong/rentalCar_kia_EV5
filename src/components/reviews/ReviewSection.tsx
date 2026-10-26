import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { REVIEWS } from '../../data/reviews';

interface ReviewSectionProps {
  onOpenAllReviews?: () => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = () => {
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const checkScroll = () => {
    if (!scrollTrackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollTrackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate active slide
    const cardWidth = 320; // approximate
    const index = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(Math.min(index, REVIEWS.length - 1));
  };

  useEffect(() => {
    const el = scrollTrackRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
    return () => el.removeEventListener('scroll', checkScroll);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollTrackRef.current) return;
    const container = scrollTrackRef.current;
    // Scroll by roughly 1 or 2 card widths
    const scrollAmount = container.clientWidth >= 1024 ? container.clientWidth * 0.75 : container.clientWidth * 0.85;
    const targetScroll = direction === 'left' ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <section id="reviews" className="reviews-section section-padding">
      <div className="container reviews-container">
        {/* Header matching Reference Image: Left Title + Right Subtitle */}
        <div className="reviews-header-row">
          <div className="reviews-header-left">
            <h2 className="reviews-lead-title">고객 리얼 후기</h2>
          </div>
          <div className="reviews-header-right">
            <p className="reviews-lead-sub">실제 출고 고객의 EV5 선택 경험을 확인해 보세요.</p>
            {/* Desktop Navigation Arrows */}
            <div className="reviews-nav-arrows desktop-arrows">
              <button
                type="button"
                className={`review-arrow-btn ${!canScrollLeft ? 'disabled' : ''}`}
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="이전 후기"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className={`review-arrow-btn ${!canScrollRight ? 'disabled' : ''}`}
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="다음 후기"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Slider Track matching Reference Image */}
        <div className="reviews-slider-wrapper">
          <div
            ref={scrollTrackRef}
            className="reviews-slider-track"
          >
            {REVIEWS.map((review) => (
              <div key={review.id} className="review-slide-card">
                {/* Photo of vehicle */}
                <div className="review-card-media">
                  <img
                    src={review.imageUrl}
                    alt={review.title}
                    className="review-card-img"
                    loading="lazy"
                  />
                </div>

                {/* Content Area - No "장기렌트 48개월" category tag as requested */}
                <div className="review-card-content">
                  <h3 className="review-card-headline">{review.title}</h3>
                  <p className="review-card-desc">{review.content}</p>

                  {/* Customer author & stars info */}
                  <div className="review-card-footer">
                    <span className="review-card-author">{review.author} · {review.carModel}</span>
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
              className={`review-arrow-btn-circle ${!canScrollLeft ? 'disabled' : ''}`}
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="이전 후기 슬라이드"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="reviews-pagination-dots">
              {REVIEWS.slice(0, 5).map((_, i) => (
                <span
                  key={i}
                  className={`pagination-dot ${Math.floor(currentIndex / 2) === i ? 'active' : ''}`}
                />
              ))}
            </div>
            <button
              type="button"
              className={`review-arrow-btn-circle ${!canScrollRight ? 'disabled' : ''}`}
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
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
