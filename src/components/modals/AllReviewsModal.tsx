import React, { useState } from 'react';
import { X } from 'lucide-react';
import { REVIEWS } from '../../data/reviews';

interface AllReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AllReviewsModal: React.FC<AllReviewsModalProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredReviews =
    filter === 'ALL'
      ? REVIEWS
      : REVIEWS.filter((r) => r.carModel.includes(filter) || r.badge?.includes(filter));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '720px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="닫기">
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111', marginBottom: '6px' }}>
          차즘 실시간 고객 출고 후기 (2,125건)
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '20px' }}>
          실제 기아 EV5 및 전기차를 출고하신 고객님들의 100% 솔직한 후기입니다.
        </p>

        {/* Rating Summary Bar */}
        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0c0d0e' }}>4.98</span>
            <div>
              <div style={{ color: '#0c0d0e', fontSize: '1rem', letterSpacing: '2px' }}>★★★★★</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>누적 고객 만족도 99.8% 달성</div>
            </div>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#64748b', textAlign: 'right' }}>
            실시간 등록 후기 2,125건<br />(출고 인증 사진 1,840건)
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[
            { key: 'ALL', label: '전체 후기' },
            { key: '장기렌트', label: '장기렌트' },
            { key: '즉시출고', label: '즉시출고' },
            { key: '법인', label: '법인/사업자' },
          ].map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: filter === f.key ? '1px solid #0c0d0e' : '1px solid #e2e8f0',
                background: filter === f.key ? '#0c0d0e' : '#fff',
                color: filter === f.key ? '#fff' : '#475569',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '55vh', overflowY: 'auto' }}>
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                border: '1px solid #f1f5f9',
                borderRadius: '14px',
                padding: '16px',
                background: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div>
                  <strong style={{ fontSize: '0.95rem' }}>{rev.author}</strong>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', marginLeft: '8px' }}>
                    {rev.carModel} · {rev.date}
                  </span>
                </div>
                <span style={{ color: '#0c0d0e', fontSize: '0.88rem' }}>★★★★★</span>
              </div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
                {rev.title}
              </h4>
              <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, marginBottom: '12px' }}>
                {rev.content}
              </p>
              {rev.buddyReply && (
                <div
                  style={{
                    background: '#f8fafc',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '0.8rem',
                    color: '#475569',
                    borderLeft: '3px solid #0c0d0e',
                  }}
                >
                  <strong style={{ color: '#1e293b' }}>{rev.buddyReply.buddyName}:</strong>{' '}
                  {rev.buddyReply.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
