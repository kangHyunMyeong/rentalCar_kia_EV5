export type RentalTermYears = 3 | 4 | 5; // 36, 48, 60개월
export type PrepaymentRate = 0 | 10 | 20 | 30; // 0%, 10%, 20%, 30%
export type DepositRate = 0 | 10 | 20 | 30; // 0%, 10%, 20%, 30% (연간 6% 할인)
export type AnnualMileageKm = 10000 | 15000 | 20000 | 30000 | -1; // 1만, 1.5만, 2만, 3만, 무제한(-1)
export type ProductType = 'rent'; // EV5 장기렌트 전용

export interface EstimateOptions {
  trimId: string;
  colorId: string;
  termYears: RentalTermYears;
  prepaymentRate: PrepaymentRate;
  depositRate: DepositRate;
  mileageKm: AnnualMileageKm;
  productType: ProductType;
  selectedOptions?: string[];
}

export interface EstimateResult {
  monthlyPayment: number; // 월 납입금 (원)
  couponDiscountedPayment: number; // 쿠폰 적용시 1개월간 금액 (원)
  prepaymentAmount: number; // 선납금 원화 금액 (원)
  depositAmount: number; // 보증금 원화 금액 (원)
  termMonths: number; // 24~60개월
  bestAffiliateCount: number; // 비교 금융사 수
  includedBenefits: string[]; // ['보험·세금 포함', '부가세 포함']
  taxIncentiveAmount: number; // 전기차 보조금 선반영액
  residualValueEstimate: number; // 만기 인수가(잔존가치)
}

export interface ConsultationLead {
  id: string;
  name: string;
  phone: string;
  customerType: 'individual' | 'corporate' | 'sole_proprietor'; // 개인 | 법인 | 개인사업자
  preferredCallTime: string; // 오전 | 오후 | 언제나
  requestedTrim: string;
  requestedColor: string;
  options: EstimateOptions;
  calculatedMonthly: number;
  createdAt: string;
  status: 'PENDING' | 'CONTACTED' | 'QUOTED' | 'DELIVERED';
  memo?: string;
}

/**
 * Multi Landing Admin 고객 DB 연동 스키마
 */
export interface LeadSelectionItem {
  key: string;
  label: string;
  value: string;
}

export interface LeadContext {
  device: 'mobile' | 'desktop';
  path: string;
  url: string;
  referrer: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  [key: string]: string | undefined;
}

export interface PublicLeadPayload {
  site_id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  payload: {
    selections: LeadSelectionItem[];
    context: LeadContext;
  };
}
