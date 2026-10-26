import { FaqItem } from '../types/faq';

export const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: '월 렌트료에는 어떤 비용이 포함되어 있나요?',
    answer:
      '월 렌트료에는 계약 상품에 따라 차량 이용료, 자동차세, 보험료 등이 포함될 수 있습니다. 정비 서비스 포함 여부는 상품에 따라 다르며, 충전비·통행료·과태료 등은 일반적으로 별도 부담입니다. 정확한 포함 항목은 견적 상담 시 안내해 드립니다.',
    category: 'payment',
    isPopular: true,
  },
  {
    id: 'faq-2',
    question: '초기비용 없이 EV5 장기렌트를 이용할 수 있나요?',
    answer:
      '보증금이나 선납금 없이 이용하는 상품도 있습니다. 다만 초기비용 0원 가능 여부는 계약 기간, 신용 심사 결과, 렌트 상품 조건에 따라 달라질 수 있습니다. 고객님의 상황에 맞는 조건을 상담받으실 수 있습니다.',
    category: 'payment',
    isPopular: true,
  },
  {
    id: 'faq-3',
    question: 'EV5는 한 번 충전으로 얼마나 주행할 수 있나요?',
    answer:
      'EV5는 스탠다드와 롱레인지 등 모델에 따라 주행거리가 다릅니다. 롱레인지 2WD는 1회 충전 시 최대 460km(국내 복합 인증 기준)를 주행할 수 있으며, 실제 주행거리는 운전 환경과 기온 등에 따라 달라집니다.',
    category: 'contract',
    isPopular: true,
  },
  {
    id: 'faq-4',
    question: '원하는 EV5 트림과 옵션을 선택할 수 있나요?',
    answer:
      '상담 시 희망하시는 트림, 외장 색상, 옵션 등을 요청하실 수 있습니다. 선택 가능 여부와 출고 일정은 차량 재고 및 공급 상황에 따라 달라지며, 최종 견적과 함께 확인하실 수 있습니다.',
    category: 'contract',
    isPopular: true,
  },
  {
    id: 'faq-5',
    question: 'EV5 장기렌트도 전기차 보조금 혜택을 받을 수 있나요?',
    answer:
      '전기차 보조금의 적용 및 처리 방식은 렌트 상품과 차량 등록 조건 등에 따라 달라질 수 있습니다. 보조금이 렌트료에 반영되는지, 별도로 적용되는 조건이 있는지는 상담 시 확인하실 수 있습니다.',
    category: 'subsidy',
    isPopular: true,
  },
  {
    id: 'faq-6',
    question: '보험은 어떻게 적용되고, 사고가 발생하면 어떻게 하나요?',
    answer:
      '보험 가입 조건은 렌트 상품에 따라 달라집니다. 사고 발생 시에는 해당 렌트사의 사고 접수 절차에 따라 처리하며, 보험 보장 범위와 자기부담금 등은 계약 내용을 기준으로 적용됩니다.',
    category: 'insurance',
    isPopular: true,
  },
  {
    id: 'faq-7',
    question: '장기렌트를 이용하면 신용점수에 영향이 있나요?',
    answer:
      '장기렌트는 일반적인 자동차 할부 구매와 계약 구조가 다릅니다. 다만 계약 심사 과정에서 신용정보 조회가 진행될 수 있으며, 신용평가에 미치는 영향은 심사 방식과 계약 조건에 따라 달라질 수 있습니다.',
    category: 'contract',
    isPopular: false,
  },
  {
    id: 'faq-8',
    question: '계약 기간 중 차량을 반납하거나 해지할 수 있나요?',
    answer:
      '계약 기간 중에도 중도 해지를 신청할 수 있으나, 계약 조건에 따라 중도해지 위약금이나 별도 정산 비용이 발생할 수 있습니다. 계약 전 해지 조건을 충분히 확인하시는 것이 좋습니다.',
    category: 'termination',
    isPopular: false,
  },
  {
    id: 'faq-9',
    question: '계약이 끝나면 EV5를 인수할 수도 있나요?',
    answer:
      '계약 상품에 따라 만기 시 차량 반납 또는 인수 등을 선택할 수 있습니다. 차량 인수 가능 여부와 인수금액은 계약 조건에 따라 달라지므로 최초 견적 단계에서 확인하는 것을 추천합니다.',
    category: 'termination',
    isPopular: false,
  },
  {
    id: 'faq-10',
    question: '개인사업자나 법인도 EV5 장기렌트를 이용할 수 있나요?',
    answer:
      '네, 개인뿐 아니라 개인사업자와 법인도 장기렌트를 신청할 수 있습니다. 사업 목적으로 이용하는 경우 비용처리를 검토할 수 있으나, 실제 세무상 인정 범위는 사용 목적과 관련 규정에 따라 달라집니다.',
    category: 'contract',
    isPopular: false,
  },
];
