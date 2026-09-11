import { useState } from 'react';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import AppSidebar from '@/components/layout/AppSidebar';
import TemplateSelector from '@/components/Wizard/TemplateSelector';
import BusinessContextForm from '@/components/Wizard/BusinessContextForm';
import BrandKitSelector from '@/components/Wizard/BrandKitSelector';
import WizardStepper from '@/components/Wizard/WizardStepper';
import WizardFooterBar from '@/components/Wizard/WizardFooterBar';

const HEX_REGEX = /^#([A-Fa-f0-9]{6})$/;

function WizardPage() {
  usePageTitle('Buat Pitch Deck Baru');

  // ── Wizard state ─────────────────────────────────────────
  const [step, setStep] = useState(1); // 1 = Template selection, 2 = Context & Brand Kit
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [formData, setFormData] = useState({});
  const [rawText, setRawText] = useState('');

  const [brandKit, setBrandKit] = useState({
    logoUrl: null,
    logoFile: null,
    logoName: '',
    logoSize: '',
    primaryColor: '#0F4C81',
    accentColor: '#F2A007',
    fontFamily: 'Inter',
  });

  // ── Derived state ────────────────────────────────────────
  const canProceedStep1 = !!selectedTemplateId;
  const rawLen = (rawText || '').length;
  const isRawValid = rawLen >= 50 && rawLen <= 2000;
  const isColorValid =
    HEX_REGEX.test(brandKit.primaryColor || '') &&
    HEX_REGEX.test(brandKit.accentColor || '');
  const canProceedStep2 = isRawValid && isColorValid;

  // ── Handlers ─────────────────────────────────────────────
  const handleNext = () => {
    if (step === 1 && canProceedStep1) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && canProceedStep2) {
      toast.success('Konteks bisnis & Brand Kit berhasil disimpan!', {
        description: `Warna: ${brandKit.primaryColor} / ${brandKit.accentColor} • Font: ${brandKit.fontFamily}`,
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplateId(templateId);
    // Reset form data when template changes
    if (templateId !== selectedTemplateId) {
      setFormData({});
      setRawText('');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#070C15] text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      {/* Canva-style narrow icon-rail sidebar */}
      <AppSidebar />

      {/* Main wizard content workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl w-full mx-auto px-6 py-8">
            {/* Stepper: only visible from Step 2 onward */}
            {step >= 2 && (
              <div className="mb-8">
                <WizardStepper currentStep={step - 2} />
              </div>
            )}

            {/* Step 1: Template Selection */}
            {step === 1 && (
              <TemplateSelector
                selectedId={selectedTemplateId}
                onSelect={handleTemplateSelect}
              />
            )}

            {/* Step 2: Business Context Form & Brand Kit Selector (2 Columns) */}
            {step === 2 && (
              <div className="space-y-8">
                {/* Section Title Header */}
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">
                    LANGKAH KEDUA
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Konteks Bisnis & Brand Kit
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Lengkapi informasi bisnis dan tentukan identitas visual agar AI dapat menghasilkan pitch deck yang profesional dan konsisten.
                  </p>
                </div>

                {/* 2-Column Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Business Context & Raw Material Form */}
                  <div className="lg:col-span-7">
                    <BusinessContextForm
                      templateId={selectedTemplateId}
                      formData={formData}
                      onFormDataChange={setFormData}
                      rawText={rawText}
                      onRawTextChange={setRawText}
                    />
                  </div>

                  {/* Right Column: Brand Kit Visual */}
                  <div className="lg:col-span-5 lg:sticky lg:top-6">
                    <BrandKitSelector
                      brandKit={brandKit}
                      onBrandKitChange={setBrandKit}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Wizard navigation footer bar */}
        <WizardFooterBar
          step={step}
          onBack={handleBack}
          onNext={handleNext}
          canProceed={step === 1 ? canProceedStep1 : canProceedStep2}
        />
      </div>
    </div>
  );
}

export default WizardPage;