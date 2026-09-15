import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { usePageTitle } from '@/hooks/usePageTitle';
import AppSidebar from '@/components/layout/AppSidebar';
import TemplateSelector from '@/components/Wizard/TemplateSelector';
import BusinessContextForm from '@/components/Wizard/BusinessContextForm';
import BrandKitSelector from '@/components/Wizard/BrandKitSelector';
import WizardStepper from '@/components/Wizard/WizardStepper';
import WizardFooterBar from '@/components/Wizard/WizardFooterBar';
import { projectStore } from '@/lib/projectStore';
import { generateOutlineAi } from '@/lib/aiService';

const HEX_REGEX = /^#([A-Fa-f0-9]{6})$/;

function WizardPage() {
  usePageTitle('Buat Pitch Deck Baru');
  const navigate = useNavigate();
  const location = useLocation();

  const initialProjectId = location.state?.projectId;
  const initialProject = initialProjectId
    ? projectStore.getProject(initialProjectId)
    : null;

  // ── Wizard state ─────────────────────────────────────────
  const [step, setStep] = useState(location.state?.step || 1); // 1 = Template selection, 2 = Context & Brand Kit
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    initialProject?.template || null
  );
  const [formData, setFormData] = useState(initialProject?.structuredData || {});
  const [rawText, setRawText] = useState(initialProject?.rawContext || '');

  const [brandKit, setBrandKit] = useState(
    initialProject?.brandKit || {
      logoUrl: null,
      logoFile: null,
      logoName: '',
      logoSize: '',
      primaryColor: '#0F4C81',
      accentColor: '#F2A007',
      fontFamily: 'Inter',
    }
  );

  // Sync state when location.state updates (e.g. back navigation from OutlinePage)
  useEffect(() => {
    if (location.state?.step) {
      setStep(location.state.step);
    }
    if (location.state?.projectId) {
      const p = projectStore.getProject(location.state.projectId);
      if (p) {
        if (p.template) setSelectedTemplateId(p.template);
        if (p.structuredData) setFormData(p.structuredData);
        if (p.rawContext) setRawText(p.rawContext);
        if (p.brandKit) setBrandKit(p.brandKit);
      }
    }
  }, [location.state]);

  // ── Derived state ────────────────────────────────────────
  const canProceedStep1 = !!selectedTemplateId;
  const rawLen = (rawText || '').length;
  const isRawValid = rawLen >= 50 && rawLen <= 2000;
  const isColorValid =
    HEX_REGEX.test(brandKit.primaryColor || '') &&
    HEX_REGEX.test(brandKit.accentColor || '');
  const canProceedStep2 = isRawValid && isColorValid;

  // ── Handlers ─────────────────────────────────────────────
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);

  const handleNext = async () => {
    if (step === 1 && canProceedStep1) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (step === 2 && canProceedStep2) {
      try {
        setIsGeneratingOutline(true);
        const existingProjectId = location.state?.projectId;

        // Siapkan input business context untuk AI Outline
        const businessName =
          formData.companyName ||
          formData.productName ||
          'Usaha Anda';
        const audience =
          formData.partnerTarget ||
          formData.industry ||
          'Calon Mitra / Klien / Investor';

        toast.info('AI sedang merancang kerangka slide...', {
          description: 'Menyesuaikan 8-10 poin topik dengan konteks bisnis Anda.',
        });

        // Panggil AI Outline (dengan fallback generator otomatis)
        const generatedOutlines = await generateOutlineAi({
          template: selectedTemplateId,
          businessName,
          audience,
          brief: rawText,
          structuredData: formData,
        });

        let project;
        if (existingProjectId) {
          project = projectStore.updateProjectData(existingProjectId, {
            template: selectedTemplateId,
            structuredData: formData,
            rawContext: rawText,
            brandKit,
          });
          projectStore.updateOutline(existingProjectId, generatedOutlines);
        } else {
          project = projectStore.createProjectDraft({
            template: selectedTemplateId,
            structuredData: formData,
            rawContext: rawText,
            brandKit,
          });
          projectStore.updateOutline(project.id, generatedOutlines);
        }

        toast.success('Kerangka slide berhasil dibuat!');
        navigate(`/outline/${project?.id || existingProjectId}`);
      } catch (err) {
        console.error('Error saat membuat outline:', err);
        toast.error('Gagal membuat outline', {
          description: err.message,
        });
      } finally {
        setIsGeneratingOutline(false);
      }
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