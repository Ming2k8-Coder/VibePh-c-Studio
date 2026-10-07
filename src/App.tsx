import React, { useState, useEffect } from 'react';
import { HeritageSelector } from './components/HeritageSelector';
import { VibeSelector } from './components/VibeSelector';
import { RemixBreakdown } from './components/RemixBreakdown';
import { SavedLookbooksDrawer } from './components/SavedLookbooksDrawer';
import { CulturalGuardrailModal } from './components/CulturalGuardrailModal';
import { OnboardingPage } from './components/Onboarding/OnboardingPage';
import { WikiHeritagePage } from './components/Pages/WikiHeritagePage';
import { HeroStartScreen } from './components/Onboarding/HeroStartScreen';
import { FullscreenHeroStory } from './components/Showcase/FullscreenHeroStory';
import { InteractiveAtelier } from './components/Studio/InteractiveAtelier';
import { LookbookExporter } from './components/Studio/LookbookExporter';
import { WikiCodexModal } from './components/Modals/WikiCodexModal';
import { OutfitState, HeritageValidationResult, AIStylistCritique } from './types/vibephuc';
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

export type AppRoute = 'hero' | 'onboarding' | 'atelier' | 'ai-studio' | 'rules' | 'wiki';

export default function App() {
  // Navigation & Hash-based Route Management
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('atelier');
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
  const [isWikiCodexOpen, setIsWikiCodexOpen] = useState<boolean>(false);
  const [exportedData, setExportedData] = useState<{ outfit: OutfitState; validation: HeritageValidationResult; stylistCritique?: AIStylistCritique } | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync hash routing with window.location.hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      if (hash === 'hero') {
        setCurrentRoute('hero');
      } else if (hash === 'atelier' || hash === 'ai-studio') {
        setCurrentRoute('atelier');
      } else if (hash === 'wiki' || hash === 'codex' || hash === 'rules') {
        setCurrentRoute('wiki');
      } else if (hash === 'lookbooks') {
        setIsDrawerOpen(true);
      } else if (hash === 'onboarding') {
        setCurrentRoute('onboarding');
      } else {
        setCurrentRoute('atelier');
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
    if (route === 'rules' || route === 'wiki') {
      setCurrentRoute('wiki');
      window.location.hash = '#/wiki';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (route === 'ai-studio' || route === 'atelier') {
      setCurrentRoute('atelier');
      window.location.hash = '#/atelier';
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2024] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md transition-all animate-in slide-in-from-bottom duration-300 ${
            toastMessage.type === 'warn'
              ? 'bg-rose-50 text-rose-900 border-rose-200'
              : 'bg-emerald-50 text-emerald-900 border-emerald-200'
          }`}
        >
          {toastMessage.type === 'warn' ? (
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Luxury Navigation Header */}
      {currentRoute !== 'hero' && (
        <header className="border-b border-stone-200 bg-white/95 backdrop-blur-md px-4 py-3.5 sticky top-0 z-40 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <a
            href="#/onboarding"
            onClick={(e) => { e.preventDefault(); navigateTo('onboarding'); }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-500 flex items-center justify-center shadow-sm border border-amber-300/60 group-hover:scale-105 transition-transform text-white">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-imperial font-bold tracking-wide text-stone-900 group-hover:text-amber-800 transition-colors">
                  VibePhục<span className="text-amber-700"> Studio</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  Haute Heritage
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Nền tảng sáng tạo & giám tuyển thời trang di sản Việt Nam
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-full border border-stone-200">
            <a
              href="#/onboarding"
              onClick={(e) => { e.preventDefault(); navigateTo('onboarding'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                currentRoute === 'onboarding'
                  ? 'bg-white text-stone-900 font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Khởi Nguyên</span>
            </a>

            <a
              href="#/atelier"
              onClick={(e) => { e.preventDefault(); navigateTo('atelier'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                currentRoute === 'atelier'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Xưởng Phối Đồ AI Atelier</span>
            </a>

            <a
              href="#/wiki"
              onClick={(e) => { e.preventDefault(); navigateTo('wiki'); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
                currentRoute === 'wiki'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Wiki Cổ Phục & Timelines</span>
            </a>
          </nav>

          {/* Right Header Navigation: Lookbooks Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2 rounded-full bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <BookmarkCheck className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Bộ Sưu Tập</span>
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center">
                {savedLookbooks.length}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-stone-200 flex flex-col gap-2">
            <a
              href="#/onboarding"
              onClick={(e) => { e.preventDefault(); navigateTo('onboarding'); }}
              className="p-2.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-2 text-stone-700 bg-stone-50"
            >
              <Compass className="w-4 h-4" />
              <span>Khởi Nguyên (Giới thiệu)</span>
            </a>

            <a
              href="#/atelier"
              onClick={(e) => { e.preventDefault(); navigateTo('atelier'); }}
              className={`p-2.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-2 ${
                currentRoute === 'atelier' ? 'bg-amber-600 text-white font-bold' : 'text-stone-700 bg-stone-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Xưởng Phối Đồ AI Atelier</span>
            </a>

            <a
              href="#/wiki"
              onClick={(e) => { e.preventDefault(); navigateTo('wiki'); }}
              className={`p-2.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-2 ${
                currentRoute === 'wiki' ? 'bg-amber-600 text-white font-bold' : 'text-stone-700 bg-stone-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Wiki Cổ Phục (Timelines & Bách Khoa)</span>
            </a>
          </div>
        )}
      </header>
      )}

      {/* Main Body Content Switcher based on Route */}
      <main className={`flex-1 w-full ${(currentRoute === 'onboarding' || currentRoute === 'hero' || currentRoute === 'wiki') ? '' : 'max-w-7xl mx-auto px-4 py-8'}`}>
        
        {/* ROUTE 0: HERO START SCREEN WITH M3E HALFTONE TRANSITION */}
        {currentRoute === 'hero' && (
          <HeroStartScreen
            onTransitionComplete={(selection) => {
              setSelectedOccasion(selection.occasion);
              navigateTo('atelier');
              showToast(`✨ Chào mừng đến Atelier! Đã chọn: ${selection.occasion}`);
            }}
          />
        )}

        {/* ROUTE 1: ONBOARDING / LANDING PAGE */}
        {currentRoute === 'onboarding' && (
          <OnboardingPage
            onNavigate={(route) => navigateTo(route as any)}
          />
        )}

        {/* ROUTE WIKI: DEDICATED WIKI CỔ PHỤC & TIMELINES PAGE */}
        {currentRoute === 'wiki' && (
          <WikiHeritagePage
            onNavigate={(route) => navigateTo(route as any)}
          />
        )}

        {/* ROUTE 2 & 3: UNIFIED XƯỞNG PHỐI ĐỒ AI ATELIER (SMART ATELIER & AI STYLIST HUB) */}
        {(currentRoute === 'atelier' || currentRoute === 'ai-studio') && (
          <div className="space-y-6">
            <InteractiveAtelier
              onOpenExporter={(outfitState, val, critique) => {
                setExportedData({ outfit: outfitState, validation: val, stylistCritique: critique });
                setIsExporterOpen(true);
              }}
              onOpenRules={() => navigateTo('wiki')}
            />
          </div>
        )}

      </main>

      {/* Clean Luxury Footer */}
      <footer className="border-t border-stone-200 bg-white py-8 px-4 text-xs text-stone-500 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-700" />
            <span className="font-imperial font-bold text-stone-900 text-sm">
              VibePhục Studio
            </span>
            <span>• Nền Tảng Phục Sức & Thời Trang Di Sản Việt Nam</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
            <a
              href="#/onboarding"
              onClick={(e) => { e.preventDefault(); navigateTo('onboarding'); }}
              className="hover:text-amber-800 transition-colors"
            >
              Khởi Nguyên (Trang chủ)
            </a>
            <a
              href="#/atelier"
              onClick={(e) => { e.preventDefault(); navigateTo('atelier'); }}
              className="hover:text-amber-800 transition-colors"
            >
              Xưởng Phối Đồ AI Atelier
            </a>
            <button
              onClick={() => navigateTo('wiki')}
              className="hover:text-amber-800 transition-colors cursor-pointer flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span>Wiki Cổ Phục & Timelines</span>
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
          navigateTo('atelier');
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
          stylistCritique={exportedData.stylistCritique}
        />
      )}

      {/* Wiki Codex Grounded Modal */}
      <WikiCodexModal
        isOpen={isWikiCodexOpen}
        onClose={() => setIsWikiCodexOpen(false)}
        garmentId={selectedGarment.id}
      />
    </div>
  );
}
