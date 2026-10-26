import { EV5_TRIMS } from '../data/cars';
import { EstimateOptions, EstimateResult } from '../types/estimate';

/**
 * 실시간 견적 산출 서비스
 * 실제 주요 렌터카사(롯데, SK, 하나, 현대캐피탈, KB캐피탈 등) 비교 요율 알고리즘 모방
 */
export function calculateEstimate(options: EstimateOptions): EstimateResult {
  const trim = EV5_TRIMS.find((t) => t.id === options.trimId) || EV5_TRIMS[0];

  const termMonths = options.termYears * 12;

  // 1. 기간별 감가상각 가중치 (5년 기준을 1.00으로 설정)
  const termMultipliers: Record<number, number> = {
    5: 1.0,
    4: 1.09,
    3: 1.21,
    2: 1.38,
  };
  const termMultiplier = termMultipliers[options.termYears] || 1.0;

  // 2. 선납금 원화 금액 계산
  const prepaymentAmount = Math.round((trim.basePrice * (options.prepaymentRate / 100)) / 10000) * 10000;
  // 월 환산 선납 차감액
  const monthlyPrepaymentDeduction = prepaymentAmount / termMonths;

  // 3. 연간 주행거리 조정액
  const mileageDeltas: Record<number, number> = {
    10000: -15000,
    15000: 0, // 기준 1.5만km
    20000: 18000,
    30000: 45000,
  };
  const mileageDelta = mileageDeltas[options.mileageKm] ?? 0;

  // 4. 기본 월 렌트료 산정 (신차 장기렌트 올인원: 취등록세, 자동차세, 종합보험료 전액 포함)
  let adjustedMonthly = trim.baseRentMonthly * termMultiplier;
  adjustedMonthly = adjustedMonthly - monthlyPrepaymentDeduction + mileageDelta;

  // 100원 단위 절삭 및 최솟값 보정
  const monthlyPayment = Math.max(250000, Math.round(adjustedMonthly / 100) * 100);

  // 6. 쿠폰 할인 (5,000원 즉시 할인)
  const couponDiscountedPayment = monthlyPayment - 5000;

  // 7. 포함 혜택 텍스트
  const includedBenefits =
    options.productType === 'rent'
      ? ['보험·세금 포함', '부가세 포함']
      : ['취등록세 포함', '부가세 포함'];

  // 잔존가치 추정액 (만기 인수가)
  const residualRate = Math.max(0.3, 0.55 - options.termYears * 0.05);
  const residualValueEstimate = Math.round(trim.basePrice * residualRate);

  return {
    monthlyPayment,
    couponDiscountedPayment,
    prepaymentAmount,
    termMonths,
    bestAffiliateCount: 17,
    includedBenefits,
    taxIncentiveAmount: 6800000, // 전기차 국고+지자체 보조금 선반영
    residualValueEstimate,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR').format(amount);
}
