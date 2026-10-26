import { ConsultationLead } from '../types/estimate';
import { AdminDashboardStats, AdminLeadFilter } from '../types/admin';

const STORAGE_KEY = 'kia_ev5_consultation_leads';

const SEED_LEADS: ConsultationLead[] = [
  {
    id: 'LEAD-2026-001',
    name: '김태환',
    phone: '010-8291-****',
    customerType: 'individual',
    preferredCallTime: '오후 (14:00~17:00)',
    requestedTrim: '스탠다드 에어 2WD (19인치)',
    requestedColor: '스노우 화이트 펄',
    options: {
      trimId: 'standard_air',
      colorId: 'white_pearl',
      termYears: 5,
      prepaymentRate: 0,
      mileageKm: 15000,
      productType: 'rent',
    },
    calculatedMonthly: 502700,
    createdAt: '2026-04-26 13:42:10',
    status: 'PENDING',
    memo: '선발주 재고 즉시출고 가능 여부 및 보조금 잔여 현황 문의',
  },
  {
    id: 'LEAD-2026-002',
    name: '(주)넥스트모빌리티',
    phone: '010-3341-****',
    customerType: 'corporate',
    preferredCallTime: '오전 (09:00~12:00)',
    requestedTrim: '롱레인지 어스 2WD (19인치)',
    requestedColor: '그래비티 그레이',
    options: {
      trimId: 'longrange_earth',
      colorId: 'gravity_gray',
      termYears: 4,
      prepaymentRate: 20,
      mileageKm: 20000,
      productType: 'rent',
    },
    calculatedMonthly: 418000,
    createdAt: '2026-04-26 11:15:30',
    status: 'CONTACTED',
    memo: '법인 업무용 2대 일괄 진행 견적서 요청 완료',
  },
  {
    id: 'LEAD-2026-003',
    name: '이수민',
    phone: '010-9122-****',
    customerType: 'sole_proprietor',
    preferredCallTime: '언제나 가능',
    requestedTrim: 'GT-Line AWD (21인치)',
    requestedColor: '마그마 레드',
    options: {
      trimId: 'gt_line',
      colorId: 'magma_red',
      termYears: 5,
      prepaymentRate: 10,
      mileageKm: 15000,
      productType: 'rent',
    },
    calculatedMonthly: 592000,
    createdAt: '2026-04-25 18:20:00',
    status: 'QUOTED',
    memo: '신차 장기렌트 즉시출고 선발주 물량 확인 및 전자세금계산서 발행 희망',
  },
];

export class LeadService {
  /**
   * 로컬 스토리지에서 리드 목록 로드 (추후 백엔드 API 연동 시 fetch/axios로 교체 가능)
   */
  public static async getLeads(filter?: AdminLeadFilter): Promise<ConsultationLead[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      let leads: ConsultationLead[] = data ? JSON.parse(data) : SEED_LEADS;

      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LEADS));
      }

      if (filter?.status && filter.status !== 'ALL') {
        leads = leads.filter((item) => item.status === filter.status);
      }
      if (filter?.search) {
        const query = filter.search.toLowerCase();
        leads = leads.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            item.requestedTrim.toLowerCase().includes(query) ||
            item.phone.includes(query)
        );
      }

      return leads;
    } catch {
      return SEED_LEADS;
    }
  }

  /**
   * 신규 견적 상담 신청 접수 (추후 POST /api/leads 연동)
   */
  public static async submitLead(
    leadData: Omit<ConsultationLead, 'id' | 'createdAt' | 'status'>
  ): Promise<ConsultationLead> {
    const leads = await this.getLeads();
    const newId = `LEAD-2026-${String(leads.length + 1).padStart(3, '0')}`;
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newLead: ConsultationLead = {
      ...leadData,
      id: newId,
      createdAt: formattedDate,
      status: 'PENDING',
    };

    const updated = [newLead, ...leads];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newLead;
  }

  /**
   * 상태 변경 (추후 PATCH /api/leads/:id/status 연동)
   */
  public static async updateLeadStatus(
    id: string,
    status: ConsultationLead['status']
  ): Promise<ConsultationLead | null> {
    const leads = await this.getLeads();
    const target = leads.find((l) => l.id === id);
    if (!target) return null;

    target.status = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    return target;
  }

  /**
   * 관리자 대시보드 통계 계산 (추후 GET /api/admin/stats 연동)
   */
  public static async getAdminStats(): Promise<AdminDashboardStats> {
    const leads = await this.getLeads();
    const totalLeads = leads.length;
    const todayLeads = leads.filter((l) => l.createdAt.startsWith('2026-04-26')).length;
    const converted = leads.filter((l) => l.status === 'DELIVERED' || l.status === 'QUOTED').length;
    const conversionRate = totalLeads ? Math.round((converted / totalLeads) * 1000) / 10 : 0;

    const avgEstimatedMonthly = Math.round(
      leads.reduce((acc, l) => acc + (l.calculatedMonthly || 500000), 0) / (totalLeads || 1)
    );

    return {
      totalLeads,
      todayLeads,
      conversionRate,
      popularTrim: '스탠다드 에어 2WD',
      popularColor: '스노우 화이트 펄',
      avgEstimatedMonthly,
    };
  }
}
