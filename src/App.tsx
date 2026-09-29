import React, { useState, useEffect } from 'react';
import { HeritageSelector } from './components/HeritageSelector';
import { VibeSelector } from './components/VibeSelector';
import { RemixBreakdown } from './components/RemixBreakdown';
import { SavedLookbooksDrawer } from './components/SavedLookbooksDrawer';
import { CulturalGuardrailModal } from './components/CulturalGuardrailModal';
import { OnboardingPage } from './components/Onboarding/OnboardingPage';
import { FullscreenHeroStory } from './components/Showcase/FullscreenHeroStory';
import { InteractiveAtelier } from './components/Studio/InteractiveAtelier';
import { LookbookExporter } from './components/Studio/LookbookExporter';
import { OutfitState, HeritageValidationResult } from './types/vibephuc';
import { ModularAtelier } from './components/Studio/ModularAtelier';
import { GarmentInfo, LookbookRecord, RemixResponse } from './types/lookbook';
import { GARMENTS, SERVER_FALLBACK_LOOKBOOKS } from './data/garments';
import {
  BookmarkCheck,
  Crown,
  Sparkles,
  Info,
  CheckCircle,
  AlertOctagon,
  ArrowRight,
  Layers,
  Wand2,
  Compass,
  BookOpen,
  Menu,
  X,
} from 'lucide-react';

export type AppRoute = 'onboarding' | 'atelier' | 'ai-studio' | 'rules';

export default function App() {
  // Navigation & Hash-based Route Management
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('onboarding');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // AI Studio State
  const [selectedGarment, setSelectedGarment] = useState<GarmentInfo>(GARMENTS[0]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('streetwear');
  const [selectedModernLayer, setSelectedModernLayer] = useState<string>('cyber-trench');
  const [userNotes, setUserNotes] = useState<string>('');

  // Active remix result
  const [activeRemix, setActiveRemix] = useState<RemixResponse>(SERVER_FALLBACK_LOOKBOOKS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Saved collection state
  const [savedLookbooks, setSavedLookbooks] = useState<LookbookRecord[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSavedMap, setIsSavedMap] = useState<Record<string, boolean>>({});
  const [isLoadingLookbooks, setIsLoadingLookbooks] = useState<boolean>(false);

  // Modals & Feedback
  const [isGuardrailModalOpen, setIsGuardrailModalOpen] = useState<boolean>(false);
  const [isExporterOpen, setIsExporterOpen] = useState<boolean>(false);
  const [exportedData, setExportedData] = useState<{ outfit: OutfitState; validation: HeritageValidationResult } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync hash routing with window.location.hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash === 'atelier') {
        setCurrentRoute('atelier');
      } else if (hash === 'ai-studio') {
        setCurrentRoute('ai-studio');
      } else if (hash === 'rules') {
        setIsGuardrailModalOpen(true);
      } else if (hash === 'lookbooks') {
        setIsDrawerOpen(true);
      } else {
        setCurrentRoute('onboarding');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: AppRoute | 'lookbooks') => {
    setIsMobileMenuOpen(false);
    if (route === 'lookbooks') {
      setIsDrawerOpen(true);
      window.location.hash = '#/lookbooks';
      return;
    }
    if (route === 'rules') {
      setIsGuardrailModalOpen(true);
      window.location.hash = '#/rules';
      return;
    }
    setCurrentRoute(route);
    window.location.hash = `#/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch saved lookbooks from backend Firestore/Storage
  const fetchSavedLookbooks = async () => {
    setIsLoadingLookbooks(true);
    try {
      const res = await fetch('/api/lookbooks');
      if (res.ok) {
        const data = await res.json();
        if (data.lookbooks) {
          setSavedLookbooks(data.lookbooks);
          const map: Record<string, boolean> = {};
          data.lookbooks.forEach((lb: LookbookRecord) => {
            if (lb.id) map[lb.id] = true;
            if (lb.outfitName) map[lb.outfitName] = true;
          });
          setIsSavedMap(map);
        }
      }
    } catch (err) {
      console.warn('Could not fetch saved lookbooks:', err);
    } finally {
      setIsLoadingLookbooks(false);
    }
  };

  useEffect(() => {
    fetchSavedLookbooks();
  }, []);

  // Handle Remix generation via server POST /api/remix
  const handleRemix = async (customGarmentId?: string, customModernLayer?: string, customNotes?: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          garmentId: customGarmentId || selectedGarment.id,
          occasion: selectedOccasion,
          modernLayer: customModernLayer || selectedModernLayer,
          userNotes: (customNotes || userNotes).trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const result: RemixResponse = await response.json();
      setActiveRemix(result);

      if (result.culturalGuardrailStatus === 'FLAGGED_VIOLATION') {
        showToast('⚠️ Cảnh báo: Hệ thống đã can thiệp do phát hiện vi phạm quy thức Tả Nhậm!', 'warn');
      } else {
        showToast('✨ Bản phối mới đã hoàn tất và được bảo chứng Hữu Nhậm thành công!');
      }

      fetchSavedLookbooks();
      navigateTo('ai-studio');
    } catch (error) {
      console.error('Error generating remix:', error);
      showToast('Đã kích hoạt bản phối cứu nguy dự phòng chất lượng cao.', 'warn');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving an approved lookbook configuration to Firestore
  const handleSaveToCollection = async (outfit: RemixResponse) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/lookbooks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(outfit),
      });

      if (res.ok) {
        if (outfit.id) setIsSavedMap((prev) => ({ ...prev, [outfit.id!]: true }));
        if (outfit.outfitName) setIsSavedMap((prev) => ({ ...prev, [outfit.outfitName]: true }));
        showToast('Đã lưu thành công vào Bộ sưu tập!');
        await fetchSavedLookbooks();
        return true;
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error('Error saving lookbook:', err);
      showToast('Không thể lưu lookbook vào cơ sở dữ liệu', 'warn');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const isCurrentSaved =
    (activeRemix.id && isSavedMap[activeRemix.id]) ||
    (activeRemix.outfitName && isSavedMap[activeRemix.outfitName]) ||
    false;

  return (
    <div className="min-h-screen bg-obsidian-900 text-[#E3E2E6] flex flex-col font-sans selection:bg-heritage-hoang/30 selection:text-heritage-hoang">
      
      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-m3-md shadow-2xl border text-xs font-semibold flex items-center gap-2.5 backdrop-blur-organza transition-all animate-in slide-in-from-bottom duration-300 ${
            toastMessage.type === 'warn'
              ? 'bg-rose-950/90 text-rose-200 border-rose-800 shadow-rule-error'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-700 shadow-heritage-glow'
          }`}
        >
          {toastMessage.type === 'warn' ? (
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Luxury Navigation Header (Only on regular studio pages) */}
      {currentRoute !== 'onboarding' && (
        <header className="border-b border-white/10 bg-obsidian-900/90 backdrop-blur-organza px-4 py-3.5 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <a
            href="#/onboarding"
            onClick={(e) => { e.preventDefault(); navigateTo('onboarding'); }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-m3-md bg-gradient-to-tr from-heritage-son via-heritage-hoang to-amber-200 flex items-center justify-center shadow-lg shadow-heritage-hoang/20 border border-amber-300/40 group-hover:scale-105 transition-transform">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-imperial font-bold tracking-wide text-white group-hover:text-heritage-hoang transition-colors">
                  VibePhục<span className="text-heritage-hoang"> Studio</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-m3-full bg-obsidian-800 text-amber-200 border border-heritage-hoang/40">
                  Haute Heritage
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Vietnamese Heritage Fashion Remix Platform
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links / Relative Route Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-obsidian-800/90 p-1 rounded-m3-full border border-white/10">
            <a
              href="#/onboarding"
              onClick={(e) => { e.preventDefault(); navigateTo('onboarding'); }}
              className="px-4 py-1.5 rounded-m3-full text-xs font-semibold font-mono transition-all flex items-center gap-1.5 text-neutral-400 hover:text-white"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Khởi Nguyên (Onboarding)</span>
            </a>

            <a
              href="#/atelier"
              onClick={(e) => { e.preventDefault(); navigateTo('atelier'); }}
              className={`px-4 py-1.5 rounded-m3-full text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                currentRoute === 'atelier'
                  ? 'bg-heritage-hoang text-black font-bold shadow-heritage-glow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Xưởng Atelier 3D</span>
            </a>

            <a
              href="#/ai-studio"
              onClick={(e) => { e.preventDefault(); navigateTo('ai-studio'); }}
              className={`px-4 py-1.5 rounded-m3-full text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                currentRoute === 'ai-studio'
                  ? 'bg-cyber-lime text-black font-bold shadow-cyber-glow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Gemini AI Studio</span>
            </a>

            <a
              href="#/rules"
              onClick={(e) => { e.preventDefault(); navigateTo('rules'); }}
              className="px-3.5 py-1.5 rounded-m3-full text-xs font-medium text-neutral-400 hover:text-amber-200 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-heritage-hoang" />
              <span>Điển Lệ Di Sản</span>
            </a>
          </nav>

          {/* Right Header Navigation: Lookbooks Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2 rounded-m3-full bg-heritage-hoang/10 hover:bg-heritage-hoang/20 text-amber-200 border border-heritage-hoang/40 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-heritage-hoang/10 cursor-pointer active:scale-95"
            >
              <BookmarkCheck className="w-4 h-4 text-heritage-hoang" />
              <span className="hidden sm:inline">Bộ Sưu Tập</span>
              <span className="w-5 h-5 rounded-full bg-heritage-hoang text-black text-[11px] font-bold flex items-center justify-center">
                {savedLookbooks.length}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-m3-md bg-white/5 border border-white/10 text-neutral-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href="#/onboarding"
              onClick={(e) => { e.preventDefault(); navigateTo('onboarding'); }}
              className="p-2.5 rounded-m3-md text-xs font-mono font-semibold flex items-center gap-2 text-neutral-300 bg-white/5"
            >
              <Compass className="w-4 h-4" />
              <span>Khởi Nguyên (Onboarding)</span>
            </a>

            <a
              href="#/atelier"
              onClick={(e) => { e.preventDefault(); navigateTo('atelier'); }}
              className={`p-2.5 rounded-m3-md text-xs font-mono font-semibold flex items-center gap-2 ${
                currentRoute === 'atelier' ? 'bg-heritage-hoang text-black font-bold' : 'text-neutral-300 bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Xưởng Atelier 3D</span>
            </a>

            <a
              href="#/ai-studio"
              onClick={(e) => { e.preventDefault(); navigateTo('ai-studio'); }}
              className={`p-2.5 rounded-m3-md text-xs font-mono font-semibold flex items-center gap-2 ${
                currentRoute === 'ai-studio' ? 'bg-cyber-lime text-black font-bold' : 'text-neutral-300 bg-white/5'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Gemini AI Studio</span>
            </a>

            <a
              href="#/rules"
              onClick={(e) => { e.preventDefault(); navigateTo('rules'); }}
              className="p-2.5 rounded-m3-md text-xs font-mono text-amber-200 bg-white/5 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-heritage-hoang" />
              <span>Điển Lệ Cổ Phục & Guardrails</span>
            </a>
          </div>
        )}
      </header>
      )}

      {/* Main Body Content Switcher based on Route */}
      <main className={`flex-1 w-full ${currentRoute === 'onboarding' ? '' : 'max-w-7xl mx-auto px-4 py-8'}`}>
        
        {/* ROUTE 1: ONBOARDING FULL-SCREEN CINEMATIC SCROLLYTELLING */}
        {currentRoute === 'onboarding' && (
          <FullscreenHeroStory
            onEnterAtelier={() => navigateTo('atelier')}
            onExploreRules={() => setIsGuardrailModalOpen(true)}
            onOpenAiStudio={() => navigateTo('ai-studio')}
            onOpenLookbooks={() => { setIsDrawerOpen(true); window.location.hash = '#/lookbooks'; }}
          />
        )}

        {/* ROUTE 2: INTERACTIVE ATELIER (PHÒNG PHỐI ĐỒ TOÀN NĂNG) */}
        {currentRoute === 'atelier' && (
          <div className="space-y-6">
            <InteractiveAtelier
              onOpenExporter={(outfitState, val) => {
                setExportedData({ outfit: outfitState, validation: val });
                setIsExporterOpen(true);
              }}
              onOpenRules={() => setIsGuardrailModalOpen(true)}
            />
          </div>
        )}

        {/* ROUTE 3: GEMINI AI REMIX STUDIO */}
        {currentRoute === 'ai-studio' && (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyber-lime font-mono">
                  <Wand2 className="w-4 h-4" />
                  <span>PHÒNG SÁNG TẠO GEMINI AI LOOKBOOK</span>
                </div>
                <h2 className="text-2xl font-bold font-imperial text-white mt-1">
                  Khởi Tạo Bản Phối Bằng Adaptive Multi-Model Routing
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="#/onboarding"
                  onClick={(e) => { e.preventDefault(); navigateTo('onboarding'); }}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                >
                  <Compass className="w-3.5 h-3.5 text-heritage-hoang" />
                  <span>Về Onboarding</span>
                </a>
                <a
                  href="#/atelier"
                  onClick={(e) => { e.preventDefault(); navigateTo('atelier'); }}
                  className="text-xs text-heritage-hoang hover:underline flex items-center gap-1 font-mono"
                >
                  <span>Mở Xưởng Atelier 3D</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 1. Heritage Garment Selector */}
            <HeritageSelector
              selectedGarmentId={selectedGarment.id}
              onSelectGarment={(g) => setSelectedGarment(g)}
            />

            {/* 2. Occasion, Modern Vibe & Custom Notes Filter */}
            <VibeSelector
              selectedOccasion={selectedOccasion}
              onSelectOccasion={(id) => setSelectedOccasion(id)}
              selectedModernLayer={selectedModernLayer}
              onSelectModernLayer={(id) => setSelectedModernLayer(id)}
              userNotes={userNotes}
              onChangeUserNotes={(txt) => setUserNotes(txt)}
              onRemix={() => handleRemix()}
              isLoading={isLoading}
            />

            {/* 3. Lookbook Result Showcase */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-heritage-hoang">
                    <Sparkles className="w-4 h-4" />
                    <span>Không Gian Giám Tuyển Lookbook</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold font-imperial text-white mt-1">
                    Bản Phối Di Sản Hiện Tại
                  </h2>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-xs text-heritage-hoang hover:underline flex items-center gap-1 cursor-pointer font-mono"
                >
                  <span>Xem {savedLookbooks.length} bản phối trong kho lưu trữ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <RemixBreakdown
                remix={activeRemix}
                onSaveToCollection={handleSaveToCollection}
                isSaving={isSaving}
                isSaved={isCurrentSaved}
              />
            </section>
          </div>
        )}

      </main>

      {/* Clean Luxury Footer (No telemetry logs) */}
      <footer className="border-t border-white/10 bg-obsidian-900 py-8 px-4 text-xs text-neutral-400 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-heritage-hoang" />
            <span className="font-imperial font-bold text-white text-sm">
              VibePhục Studio
            </span>
            <span>• Nền Tảng Phối Thời Trang Di Sản Việt Nam</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
            <a
              href="#/onboarding"
              onClick={(e) => { e.preventDefault(); navigateTo('onboarding'); }}
              className="hover:text-white transition-colors"
            >
              Khởi Nguyên (Onboarding)
            </a>
            <a
              href="#/atelier"
              onClick={(e) => { e.preventDefault(); navigateTo('atelier'); }}
              className="hover:text-white transition-colors"
            >
              Xưởng Atelier 3D
            </a>
            <a
              href="#/ai-studio"
              onClick={(e) => { e.preventDefault(); navigateTo('ai-studio'); }}
              className="hover:text-white transition-colors"
            >
              Gemini AI Studio
            </a>
            <button
              onClick={() => setIsGuardrailModalOpen(true)}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Điển Lệ Hữu Nhậm
            </button>
          </div>
        </div>
      </footer>

      {/* Persistent Saved Lookbooks Drawer */}
      <SavedLookbooksDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          if (window.location.hash === '#/lookbooks') {
            window.location.hash = `#/${currentRoute}`;
          }
        }}
        lookbooks={savedLookbooks}
        onSelectLookbook={(item) => {
          setActiveRemix(item);
          navigateTo('ai-studio');
        }}
        onRefresh={fetchSavedLookbooks}
        isLoading={isLoadingLookbooks}
      />

      {/* Cultural Guardrail Educational Modal */}
      <CulturalGuardrailModal
        isOpen={isGuardrailModalOpen}
        onClose={() => {
          setIsGuardrailModalOpen(false);
          if (window.location.hash === '#/rules') {
            window.location.hash = `#/${currentRoute}`;
          }
        }}
      />

      {/* Lookbook Digital Heritage Passport Exporter */}
      {exportedData && (
        <LookbookExporter
          isOpen={isExporterOpen}
          onClose={() => setIsExporterOpen(false)}
          outfit={exportedData.outfit}
          validation={exportedData.validation}
        />
      )}
    </div>
  );
}
