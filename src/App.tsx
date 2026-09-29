import React, { useState, useEffect } from 'react';
import { DiagnosticHUD } from './components/DiagnosticHUD';
import { HeritageSelector } from './components/HeritageSelector';
import { VibeSelector } from './components/VibeSelector';
import { RemixBreakdown } from './components/RemixBreakdown';
import { SavedLookbooksDrawer } from './components/SavedLookbooksDrawer';
import { CulturalGuardrailModal } from './components/CulturalGuardrailModal';
import { StorytellingPrologue } from './components/Onboarding/StorytellingPrologue';
import { ModularAtelier } from './components/Studio/ModularAtelier';
import { GarmentInfo, LookbookRecord, RemixResponse } from './types/lookbook';
import { GARMENTS, SERVER_FALLBACK_LOOKBOOKS } from './data/garments';
import {
  BookmarkCheck,
  Crown,
  Sparkles,
  Info,
  ShieldCheck,
  CheckCircle,
  AlertOctagon,
  ArrowRight,
  Sliders,
  Play,
  Layers,
  Wand2,
} from 'lucide-react';

export default function App() {
  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<'atelier' | 'ai-studio'>('atelier');
  const [showPrologue, setShowPrologue] = useState<boolean>(false);

  // AI Studio State
  const [selectedGarment, setSelectedGarment] = useState<GarmentInfo>(GARMENTS[0]);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('streetwear');
  const [selectedModernLayer, setSelectedModernLayer] = useState<string>('cyber-trench');
  const [userNotes, setUserNotes] = useState<string>('');

  // Active remix result
  const [activeRemix, setActiveRemix] = useState<RemixResponse>(SERVER_FALLBACK_LOOKBOOKS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastLatency, setLastLatency] = useState<number | undefined>(28);

  // Saved collection state
  const [savedLookbooks, setSavedLookbooks] = useState<LookbookRecord[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSavedMap, setIsSavedMap] = useState<Record<string, boolean>>({});
  const [isLoadingLookbooks, setIsLoadingLookbooks] = useState<boolean>(false);

  // Modals & Feedback
  const [isGuardrailModalOpen, setIsGuardrailModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warn' } | null>(null);

  const showToast = (text: string, type: 'success' | 'warn' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
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
    const start = performance.now();
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

      const clientLatency = Math.round(performance.now() - start);
      setLastLatency(clientLatency);

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
      setViewMode('ai-studio');
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
        showToast('Đã lưu thành công vào Bộ sưu tập Firestore!');
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

  // If user opens the Prologue Scrollytelling Onboarding
  if (showPrologue) {
    return (
      <StorytellingPrologue
        onComplete={() => setShowPrologue(false)}
        onSkip={() => setShowPrologue(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-900 text-[#E3E2E6] flex flex-col font-sans selection:bg-heritage-hoang/30 selection:text-heritage-hoang">
      {/* 1. Architecture Diagnostic HUD Top Bar */}
      <DiagnosticHUD 
        lastLatencyMs={lastLatency} 
        mode={activeRemix.mode} 
        routedModel={activeRemix.routedModel} 
        handledCase492={activeRemix.handledCase492} 
      />

      {/* 2. Global Toast Notification */}
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

      {/* 3. Main Navigation Header */}
      <header className="border-b border-white/10 bg-obsidian-800/80 backdrop-blur-organza px-4 py-4 sticky top-10 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-m3-md bg-gradient-to-tr from-heritage-son via-heritage-hoang to-amber-200 flex items-center justify-center shadow-lg shadow-heritage-hoang/20 border border-amber-300/40">
              <Crown className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-imperial font-bold tracking-wide text-white">
                  VibePhục<span className="text-heritage-hoang"> Studio</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-m3-full bg-obsidian-700 text-amber-200 border border-heritage-hoang/40">
                  Neo-Heritage
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Vietnamese Heritage Fashion Remix Platform
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs (Material 3 Expressive Segmented Button) */}
          <div className="flex items-center bg-obsidian-900/90 p-1 rounded-m3-full border border-white/10">
            <button
              onClick={() => setViewMode('atelier')}
              className={`px-4 py-1.5 rounded-m3-full text-xs font-semibold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'atelier'
                  ? 'bg-heritage-hoang text-black shadow-heritage-glow font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Xưởng Atelier Đa Tầng</span>
            </button>

            <button
              onClick={() => setViewMode('ai-studio')}
              className={`px-4 py-1.5 rounded-m3-full text-xs font-semibold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'ai-studio'
                  ? 'bg-cyber-lime text-black shadow-cyber-glow font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>AI Lookbook Studio</span>
            </button>
          </div>

          {/* Right Header Navigation Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrologue(true)}
              className="px-3 py-1.5 rounded-m3-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Xem mở đầu trải nghiệm Scrollytelling"
            >
              <Play className="w-3 h-3 text-heritage-hoang fill-heritage-hoang" />
              <span className="hidden lg:inline">Khởi Nguyên Di Sản</span>
            </button>

            <button
              onClick={() => setIsGuardrailModalOpen(true)}
              className="px-3 py-1.5 rounded-m3-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-amber-300 border border-white/10 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Tìm hiểu về Quy thức Hữu Nhậm & Tả Nhậm"
            >
              <Info className="w-3.5 h-3.5 text-heritage-hoang" />
              <span className="hidden md:inline">Quy Thức Hữu Nhậm</span>
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2 rounded-m3-full bg-heritage-hoang/10 hover:bg-heritage-hoang/20 text-amber-200 border border-heritage-hoang/40 text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-heritage-hoang/10 cursor-pointer active:scale-95"
            >
              <BookmarkCheck className="w-4 h-4 text-heritage-hoang" />
              <span>Bộ Sưu Tập</span>
              <span className="w-5 h-5 rounded-full bg-heritage-hoang text-black text-[11px] font-bold flex items-center justify-center">
                {savedLookbooks.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 4. Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-10">
        
        {/* Hero Section Banner */}
        <section className="relative overflow-hidden rounded-m3-xl bg-gradient-to-r from-obsidian-800 via-obsidian-900 to-obsidian-800 border border-heritage-hoang/30 p-8 md:p-10 shadow-2xl backdrop-blur-organza">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-m3-full bg-heritage-hoang/15 border border-heritage-hoang/40 text-xs font-semibold text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-heritage-hoang" />
              <span>Giao Thoa Cổ Điển & Tương Lai • Chuẩn Hữu Nhậm Triều Nguyễn</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-imperial font-bold tracking-tight text-white leading-tight">
              Tái Định Nghĩa <span className="text-heritage-hoang">Cổ Phục Việt</span> Trong Nhịp Thở Đương Đại
            </h2>

            <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
              VibePhục Studio tích hợp không gian phối đồ trực quan đa tầng (Modular Atelier) và trí tuệ nhân tạo Gemini 2.5 Serverless Gateway để sáng tạo
              các bản phối thời trang đỉnh cao từ <strong>Áo Ngũ Thân, Nhật Bình, Tứ Thân, Áo Tấc, Áo Bà Ba</strong>.
              Hệ thống bảo chứng nghiêm ngặt quy thức <strong>"Hữu Nhậm" (Cài vạt sang phải)</strong> và cơ chế đàn hồi từ chối đại kỵ Tả Nhậm.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-m3-full bg-obsidian-700/80 border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-cyber-jade" />
                Bảo Chứng Hữu Nhậm 100%
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-m3-full bg-obsidian-700/80 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-heritage-hoang" />
                Phối Sắc Ngũ Hành Tương Sinh
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-m3-full bg-obsidian-700/80 border border-white/10">
                <Crown className="w-3.5 h-3.5 text-heritage-son" />
                Lưu Trữ Bền Vững Firestore
              </span>
            </div>
          </div>

          {/* Decorative Ambient Flares */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-heritage-hoang/10 blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-heritage-son/15 blur-3xl pointer-events-none" />
        </section>

        {/* View Mode Switching: 1. Modular Atelier vs 2. AI Lookbook Studio */}
        {viewMode === 'atelier' ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-heritage-hoang font-mono">
                  <Layers className="w-4 h-4" />
                  <span>XƯỞNG PHỤC TRANG TƯƠNG TÁC (MODULAR ATELIER)</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold font-imperial text-white mt-1">
                  Phối Đồ Đa Tầng & Kiểm Định Quy Thức
                </h2>
              </div>

              <button
                onClick={() => setViewMode('ai-studio')}
                className="text-xs text-cyber-lime hover:underline flex items-center gap-1 cursor-pointer font-mono"
              >
                <span>Chuyển sang AI Fast Remix Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <ModularAtelier
              onOpenLookbooks={() => setIsDrawerOpen(true)}
              onOpenGuide={() => setIsGuardrailModalOpen(true)}
              onRemixWithAI={(garmentId, modernLayer, notes) => handleRemix(garmentId, modernLayer, notes)}
              isRemixingAI={isLoading}
              savedLookbooksCount={savedLookbooks.length}
            />
          </section>
        ) : (
          <div className="space-y-10">
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
                  className="text-xs text-heritage-hoang hover:underline flex items-center gap-1 cursor-pointer"
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

      {/* 5. Footer */}
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
            <span className="text-cyber-jade">● Serverless Backend Active</span>
            <span className="text-amber-300">● Gemini 2.5 Flash Engine</span>
            <span className="text-emerald-300">● Quy thức Hữu Nhậm Bảo Chứng</span>
          </div>
        </div>
      </footer>

      {/* 6. Persistent Saved Lookbooks Drawer */}
      <SavedLookbooksDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        lookbooks={savedLookbooks}
        onSelectLookbook={(item) => {
          setActiveRemix(item);
          setViewMode('ai-studio');
        }}
        onRefresh={fetchSavedLookbooks}
        isLoading={isLoadingLookbooks}
      />

      {/* 7. Cultural Guardrail Educational Modal */}
      <CulturalGuardrailModal
        isOpen={isGuardrailModalOpen}
        onClose={() => setIsGuardrailModalOpen(false)}
      />
    </div>
  );
}
