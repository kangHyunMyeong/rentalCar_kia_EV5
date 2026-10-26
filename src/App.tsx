import React, { useState, useEffect, useMemo } from 'react';
import { EV5_COLORS, EV5_TRIMS } from './data/cars';
import { CarColor, CarTrim } from './types/car';
import { EstimateOptions } from './types/estimate';
import { calculateEstimate } from './services/estimateCalculator';
import { LeadService } from './services/leadService';

import { Header } from './components/common/Header';
import { HeroSection } from './components/hero/HeroSection';
import { EstimateCalculator } from './components/calculator/EstimateCalculator';
import { EV5Features } from './components/features/EV5Features';
import { ReviewSection } from './components/reviews/ReviewSection';
import { FaqSection } from './components/faq/FaqSection';
import { FinalCtaSection } from './components/cta/FinalCtaSection';
import { Footer } from './components/common/Footer';
import { StickyCtaBar } from './components/sticky/StickyCtaBar';

import { ConsultationModal } from './components/modals/ConsultationModal';
import { AdminPreviewModal } from './components/modals/AdminPreviewModal';

export const App: React.FC = () => {
  // 차량 외장 색상 상태 (기본: 스노우 화이트 펄 - Reference Image 1 스타일)
  const [selectedColor, setSelectedColor] = useState<CarColor>(EV5_COLORS[0]);

  // 차량 트림 상태 (기본: 스탠다드 에어 2WD - Reference Image 2 스타일)
  const [selectedTrim, setSelectedTrim] = useState<CarTrim>(EV5_TRIMS[0]);

  // 견적 계산기 옵션
  const [estimateOptions, setEstimateOptions] = useState<EstimateOptions>({
    trimId: EV5_TRIMS[0].id,
    colorId: EV5_COLORS[0].id,
    termYears: 5,         // 최대 5년
    prepaymentRate: 10,   // 최다 10%
    mileageKm: 20000,     // 최다 2만km
    productType: 'rent',  // 장기렌트
  });

  // 모달 상태
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isAdminPreviewModalOpen, setIsAdminPreviewModalOpen] = useState(false);

  // 관리자 연동용 신청 리드 건수 상태
  const [leadCount, setLeadCount] = useState<number>(3);

  // 실시간 견적 결과 연산 (메모이제이션)
  const estimateResult = useMemo(() => {
    return calculateEstimate(estimateOptions);
  }, [estimateOptions]);

  // 리드 건수 로드
  const refreshLeadCount = async () => {
    const leads = await LeadService.getLeads();
    setLeadCount(leads.length);
  };

  useEffect(() => {
    refreshLeadCount();
  }, []);

  const handleUpdateOptions = (updates: Partial<EstimateOptions>) => {
    setEstimateOptions((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectTrim = (trim: CarTrim) => {
    setSelectedTrim(trim);
    setEstimateOptions((prev) => ({ ...prev, trimId: trim.id }));
  };

  const handleSelectColor = (color: CarColor) => {
    setSelectedColor(color);
    setEstimateOptions((prev) => ({ ...prev, colorId: color.id }));
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('calculator');
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="app-root">
      {/* 1. Header (Volterra Minimalist Style) */}
      <Header
        onOpenConsultation={() => setIsConsultationModalOpen(true)}
        onOpenAdminPreview={() => setIsAdminPreviewModalOpen(true)}
        leadCount={leadCount}
      />

      {/* 2. Hero Section (Image 1 Aesthetic + 9 Colors from @images) */}
      <HeroSection
        selectedColor={selectedColor}
        onSelectColor={handleSelectColor}
        selectedTrim={selectedTrim}
        onOpenConsultation={() => setIsConsultationModalOpen(true)}
        onScrollToCalculator={scrollToCalculator}
      />

      {/* 3. Real-time Estimate Calculator (Image 2 Matching) */}
      <EstimateCalculator
        selectedTrim={selectedTrim}
        onSelectTrim={handleSelectTrim}
        selectedColor={selectedColor}
        estimateOptions={estimateOptions}
        onUpdateOptions={handleUpdateOptions}
        estimateResult={estimateResult}
        onOpenConsultation={() => setIsConsultationModalOpen(true)}
      />

      {/* 4. EV5 Core Highlights & Innovation */}
      <EV5Features />

      {/* 5. Customer Reviews (Image 3 Matching) */}
      <ReviewSection />

      {/* 7. FAQ Accordion (Image 4 Matching) */}
      <FaqSection />

      {/* NEW: Final Consultation CTA Section (Cinematic EV5 with kia_ev5_6.jpg) */}
      <FinalCtaSection
        onOpenConsultation={() => setIsConsultationModalOpen(true)}
        onScrollToCalculator={scrollToCalculator}
      />

      {/* 8. Footer */}
      <Footer />

      {/* 9. Floating Sticky Bottom Bar for High Conversion */}
      <StickyCtaBar
        estimateResult={estimateResult}
        onOpenConsultation={() => setIsConsultationModalOpen(true)}
        selectedTrimName={selectedTrim.name}
      />

      {/* MODALS */}
      {/* 1) Quick Consultation Quote Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        selectedTrim={selectedTrim}
        selectedColor={selectedColor}
        estimateOptions={estimateOptions}
        estimateResult={estimateResult}
        onLeadSubmitted={refreshLeadCount}
      />

      {/* 4) Admin API Preview Modal for Future Admin Page Development */}
      <AdminPreviewModal
        isOpen={isAdminPreviewModalOpen}
        onClose={() => setIsAdminPreviewModalOpen(false)}
        onLeadUpdated={refreshLeadCount}
      />
    </div>
  );
};

export default App;
