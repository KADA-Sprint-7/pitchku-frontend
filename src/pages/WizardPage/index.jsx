import { useState } from 'react';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import AppSidebar from '@/components/layout/AppSidebar';
import Footer from '@/components/layout/Footer';
import TemplateSelector from '@/components/Wizard/TemplateSelector';
import BusinessContextForm from '@/components/Wizard/BusinessContextForm';
import WizardStepper from '@/components/Wizard/WizardStepper';
import WizardFooterBar from '@/components/Wizard/WizardFooterBar';

function WizardPage() {
  usePageTitle('Buat Pitch Deck Baru');

  // ── Wizard state ─────────────────────────────────────────
  const [step, setStep] = useState(1); // 1 = Template selection, 2 = Context form
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [formData, setFormData] = useState({});
  const [rawText, setRawText] = useState('');

  // ── Derived state ────────────────────────────────────────
  const canProceedStep1 = !!selectedTemplateId;
  const rawLen = (rawText || '').length;
  const canProceedStep2 = rawLen >= 50 && rawLen <= 2000;

  // ── Handlers ─────────────────────────────────────────────
  const handleNext = () => {
    if (step === 1 && canProceedStep1) {
      setStep(2);
    } else if (step === 2 && canProceedStep2) {
      toast.success('Konteks bisnis berhasil disimpan!', {
        description: 'Data sedang diproses untuk menghasilkan outline pitch deck.',
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
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

            {/* Step 2: Business Context Form */}
            {step === 2 && (
              <BusinessContextForm
                templateId={selectedTemplateId}
                formData={formData}
                onFormDataChange={setFormData}
                rawText={rawText}
                onRawTextChange={setRawText}
              />
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