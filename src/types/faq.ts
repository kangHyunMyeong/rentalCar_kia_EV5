export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'contract' | 'payment' | 'subsidy' | 'insurance' | 'termination';
  isPopular?: boolean;
}
