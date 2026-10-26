import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Search, FileText, Database, Code, BarChart3 } from 'lucide-react';
import { ConsultationLead } from '../../types/estimate';
import { AdminDashboardStats } from '../../types/admin';
import { LeadService } from '../../services/leadService';
import { formatCurrency } from '../../services/estimateCalculator';

interface AdminPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated: () => void;
}

export const AdminPreviewModal: React.FC<AdminPreviewModalProps> = ({
  isOpen,
  onClose,
  onLeadUpdated,
}) => {
  const [tab, setTab] = useState<'leads' | 'stats' | 'apiDocs'>('leads');
  const [leads, setLeads] = useState<ConsultationLead[]>([]);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await LeadService.getLeads({
        status: statusFilter,
        search,
      });
      setLeads(data);
      const dashboardStats = await LeadService.getAdminStats();
      setStats(dashboardStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, statusFilter, search]);

  if (!isOpen) return null;

  const handleStatusChange = async (id: string, newStatus: ConsultationLead['status']) => {
    await LeadService.updateLeadStatus(id, newStatus);
    await loadData();
    onLeadUpdated();
  };

  const getStatusBadge = (status: ConsultationLead['status']) => {
    switch (status) {
      case 'PENDING':
        return <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>상담대기</span>;
      case 'CONTACTED':
        return <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>연락완료</span>;
      case 'QUOTED':
        return <span style={{ background: '#ede9fe', color: '#5b21b6', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>견적서발송</span>;
      case 'DELIVERED':
        return <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>계약·출고완료</span>;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: '960px', width: '95vw', padding: '28px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="닫기">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0c0d0e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Database size={16} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111' }}>
            EV5 견적 관리자 시스템 (Admin Panel Preview)
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px' }}>
          랜딩페이지에서 실시간 접수된 견적 신청 내역을 조회하고 상태를 변경할 수 있습니다. (추후 REST API 엔드포인트 연동 준비 완료)
        </p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px', paddingBottom: '10px' }}>
          <button
            type="button"
            onClick={() => setTab('leads')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: tab === 'leads' ? '#0c0d0e' : '#f1f5f9',
              color: tab === 'leads' ? '#fff' : '#475569',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={15} />
            <span>신청 리드 관리 ({leads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('stats')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: tab === 'stats' ? '#0c0d0e' : '#f1f5f9',
              color: tab === 'stats' ? '#fff' : '#475569',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BarChart3 size={15} />
            <span>상담 통계 지표</span>
          </button>

          <button
            type="button"
            onClick={() => setTab('apiDocs')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: tab === 'apiDocs' ? '#0c0d0e' : '#f1f5f9',
              color: tab === 'apiDocs' ? '#fff' : '#475569',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Code size={15} />
            <span>API 명세서 & 확장 가이드</span>
          </button>
        </div>

        {/* TAB 1: LEADS LIST */}
        {tab === 'leads' && (
          <div>
            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    background: '#fff',
                  }}
                >
                  <option value="ALL">전체 상태</option>
                  <option value="PENDING">상담대기 (PENDING)</option>
                  <option value="CONTACTED">연락완료 (CONTACTED)</option>
                  <option value="QUOTED">견적발송 (QUOTED)</option>
                  <option value="DELIVERED">출고완료 (DELIVERED)</option>
                </select>

                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="이름, 차종, 전화번호 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      padding: '8px 12px 8px 32px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      width: '210px',
                    }}
                  />
                  <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                </div>
              </div>

              <button
                type="button"
                onClick={loadData}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#475569',
                }}
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} />
                <span>새로고침</span>
              </button>
            </div>

            {/* Table Container */}
            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                    <th style={{ padding: '10px 14px' }}>접수번호 / 일시</th>
                    <th style={{ padding: '10px 14px' }}>고객명 / 유형</th>
                    <th style={{ padding: '10px 14px' }}>연락처 / 통화시간</th>
                    <th style={{ padding: '10px 14px' }}>신청 트림 & 색상</th>
                    <th style={{ padding: '10px 14px' }}>계약조건 / 월렌트료</th>
                    <th style={{ padding: '10px 14px' }}>진행상태 변경</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{lead.id}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{lead.createdAt}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 700 }}>{lead.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {lead.customerType === 'individual' ? '개인' : lead.customerType === 'corporate' ? '법인' : '개인사업자'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div>{lead.phone}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{lead.preferredCallTime}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600 }}>{lead.requestedTrim}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{lead.requestedColor}</div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div>{lead.options.termYears}년 · 선납 {lead.options.prepaymentRate}%</div>
                        <div style={{ fontWeight: 800, color: '#008b74' }}>
                          {formatCurrency(lead.calculatedMonthly)}원/월
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div>{getStatusBadge(lead.status)}</div>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                            style={{
                              fontSize: '0.75rem',
                              padding: '4px 6px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#fff',
                            }}
                          >
                            <option value="PENDING">상담대기</option>
                            <option value="CONTACTED">연락완료</option>
                            <option value="QUOTED">견적발송</option>
                            <option value="DELIVERED">출고완료</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                        검색 조건에 맞는 접수 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: STATS */}
        {tab === 'stats' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '6px' }}>총 견적 상담 신청</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>{stats.totalLeads}건</div>
              <div style={{ color: '#008b74', fontSize: '0.78rem', marginTop: '6px' }}>오늘 신규 {stats.todayLeads}건 접수</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '6px' }}>계약 전환 성공율</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#008b74' }}>{stats.conversionRate}%</div>
              <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '6px' }}>업계 평균(12%) 대비 2배 이상</div>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '6px' }}>평균 예상 월 렌트료</div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0c0d0e' }}>{formatCurrency(stats.avgEstimatedMonthly)}원</div>
              <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '6px' }}>인기 트림: {stats.popularTrim}</div>
            </div>
          </div>
        )}

        {/* TAB 3: API SPECS FOR FUTURE ADMIN EXPANSION */}
        {tab === 'apiDocs' && (
          <div style={{ background: '#0f172a', color: '#e2e8f0', padding: '20px', borderRadius: '12px', fontSize: '0.82rem', fontFamily: 'monospace', maxHeight: '50vh', overflowY: 'auto' }}>
            <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: '12px' }}>
              # REST API Endpoints Specification for Admin Backend Integration
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
{`// 1. [POST] 신규 견적 신청 접수
POST /api/v1/leads
Request Body:
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "customerType": "individual" | "corporate" | "sole_proprietor",
  "preferredCallTime": "오전 (09:00 ~ 12:00)",
  "requestedTrim": "스탠다드 에어 2WD (19인치)",
  "requestedColor": "스노우 화이트 펄",
  "options": {
    "termYears": 5,
    "prepaymentRate": 0,
    "mileageKm": 15000,
    "productType": "rent"
  },
  "calculatedMonthly": 502700,
  "memo": "추가 문의 사항"
}

// 2. [GET] 관리자 리드 목록 조회 및 검색/필터링
GET /api/v1/leads?status=PENDING&search=스노우&page=1&size=20

// 3. [PATCH] 상담 진행 상태 변경
PATCH /api/v1/leads/:id/status
Request Body: { "status": "CONTACTED" | "QUOTED" | "DELIVERED" }

// 4. [GET] 관리자 대시보드 통계
GET /api/v1/admin/stats

* 참고: src/services/leadService.ts 의 LeadService 클래스가
  위 엔드포인트와 1:1로 매핑되어 있으므로, 백엔드 준비 완료 시
  localStorage 로직을 fetch/axios 호출로 변경하기만 하면 즉시 연동됩니다.`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
