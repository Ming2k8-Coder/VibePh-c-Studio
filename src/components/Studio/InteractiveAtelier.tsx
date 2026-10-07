'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Sparkles,
  Check,
  AlertTriangle,
  BookmarkPlus,
  Share2,
  Wand2,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Eye,
  Info,
  Calendar,
  Compass,
  Palette,
  Sun,
  MapPin,
  Shirt,
  Scissors,
  CheckCircle2,
  Send,
  BookOpen,
  ArrowRight,
  Award,
  ChevronDown,
  X
} from 'lucide-react';
import {
  OutfitState,
  HeritageValidationResult,
  GarmentItem,
  AccessoryItem,
  AIStylistCritique,
  Occasion,
  Region,
  Weather
} from '../../types/vibephuc';
import {
  GARMENT_CATALOG,
  ACCESSORY_CATALOG,
  validateOutfitHeritage
} from '../../data/heritageCatalog';
import { generateAIStylistAdvice } from '../../utils/aiStylist';
import { MannequinCanvas2D } from './MannequinCanvas2D';

export interface InteractiveAtelierProps {
  onOpenExporter: (outfit: OutfitState, validation: HeritageValidationResult, stylistCritique?: AIStylistCritique) => void;
  onOpenRules: () => void;
}

// 7 Preset Occasions (Simple, Visual, 1-Click Action)
const QUICK_OCCASIONS: { id: Occasion; icon: string; name: string; coreId: string; baseId: string; bottomId: string; accId: string }[] = [
  { id: 'KY_YEU_GRADUATION', icon: '🎓', name: 'Kỷ Yếu Học Đường', coreId: 'core-ao-dai-ngu-than', baseId: 'base-trung-don-bach', bottomId: 'bottom-quan-lua-trang', accId: 'acc-kieng-bac' },
  { id: 'TET_SPRING', icon: '🌸', name: 'Tết & Du Xuân', coreId: 'core-ao-tac', baseId: 'base-trung-don-bach', bottomId: 'bottom-quan-lua-trang', accId: 'acc-khan-dong-nam' },
  { id: 'DAM_CUOI_WEDDING', icon: '💍', name: 'Lễ Cưới Hỏi', coreId: 'core-nhat-binh', baseId: 'base-trung-don-bach', bottomId: 'bottom-quan-lua-trang', accId: 'acc-khan-vanh' },
  { id: 'DI_CHUA_TEMPLE', icon: '🪷', name: 'Đi Chùa Chiêm Bái', coreId: 'core-ngu-than-tay-chen', baseId: 'base-trung-don-bach', bottomId: 'bottom-quan-lua-trang', accId: 'acc-kieng-bac' },
  { id: 'LE_HOI_LANG', icon: '🚩', name: 'Hội Làng Quan Họ', coreId: 'core-tu-than', baseId: 'base-yem-canh-sen', bottomId: 'bottom-vay-dup-den', accId: 'acc-non-quai-thao' },
  { id: 'STREETWEAR_CASUAL', icon: '⚡', name: 'Dạo Phố Hiện Đại', coreId: 'core-ao-dai-hien-dai', baseId: 'base-trung-don-bach', bottomId: 'bottom-quan-lua-trang', accId: 'acc-sneaker-chunky' },
  { id: 'LE_HOI_TRUONG', icon: '🏛️', name: 'Nghi Lễ Cung Đình', coreId: 'core-giao-linh', baseId: 'base-trung-don-bach', bottomId: 'bottom-quan-lua-trang', accId: 'acc-kieng-bac' }
];

// Quick Natural Silk Dye Colors
const SILK_COLORS = [
  { name: 'Đỏ Son Cung Đình', hex: '#C53030' },
  { name: 'Vàng Hoàng Thổ', hex: '#D69E2E' },
  { name: 'Xanh Chàm Thủy', hex: '#1E3A8A' },
  { name: 'Xanh Cẩm Thạch', hex: '#059669' },
  { name: 'Hồng Phấn Cung Nữ', hex: '#DB2777' },
  { name: 'Tím Huế Mộng Mơ', hex: '#7E22CE' },
  { name: 'Trắng Ngà Tơ Tằm', hex: '#FDFBF7' },
  { name: 'Đen Lãnh Mỹ A', hex: '#1C1917' }
];

export const InteractiveAtelier: React.FC<InteractiveAtelierProps> = ({
  onOpenExporter,
  onOpenRules,
}) => {
  // 1. Occasion & View Mode
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>('KY_YEU_GRADUATION');
  const [presentationMode, setPresentationMode] = useState<'MANNEQUIN' | 'MOCKUP'>('MANNEQUIN');

  // 2. Outfit state
  const [outfit, setOutfit] = useState<OutfitState>({
    avatarType: 'FEMALE_STUDENT',
    baseGarment: GARMENT_CATALOG.find(g => g.id === 'base-trung-don-bach') || null,
    coreGarment: GARMENT_CATALOG.find(g => g.id === 'core-ao-dai-ngu-than') || GARMENT_CATALOG[0],
    outerGarment: null,
    bottomPiece: GARMENT_CATALOG.find(g => g.id === 'bottom-quan-lua-trang') || null,
    footwear: ACCESSORY_CATALOG.find(a => a.id === 'acc-kieng-bac') || null,
    accessories: [ACCESSORY_CATALOG.find(a => a.id === 'acc-kieng-bac')!].filter(Boolean),
    modernAccents: ['translucent-hem'],
    lapelMode: 'HUU_NHAM',
    buttonCount: 5,
    isXRayMode: false,
    customColors: {
      core: '#C53030'
    }
  });

  // 3. Active Wardrobe Tab: Core, Base, Bottom, Accessory
  const [activeTab, setActiveTab] = useState<'core' | 'base' | 'bottom' | 'accessory'>('core');

  // 4. AI & Citations
  const [isAiStyling, setIsAiStyling] = useState<boolean>(false);
  const [aiFeedbackToast, setAiFeedbackToast] = useState<string | null>(null);
  const [isAiInputOpen, setIsAiInputOpen] = useState<boolean>(false);
  const [customAiText, setCustomAiText] = useState<string>('');
  const [activeCitation, setActiveCitation] = useState<GarmentItem | null>(null);
  const [isCuratorAdviceExpanded, setIsCuratorAdviceExpanded] = useState<boolean>(false);

  // 5. Cultural validation calculation
  const validationResult = useMemo<HeritageValidationResult>(() => {
    return validateOutfitHeritage(outfit, selectedOccasion);
  }, [outfit, selectedOccasion]);

  // 6. AI Stylist Critique
  const stylistCritique = useMemo<AIStylistCritique>(() => {
    return generateAIStylistAdvice({
      outfit,
      validation: validationResult,
      occasion: selectedOccasion,
      region: 'ALL',
      weather: 'NANG_AM',
    });
  }, [outfit, validationResult, selectedOccasion]);

  // Current silk color
  const currentSilkColor = outfit.customColors?.['core'] || outfit.coreGarment.defaultColor?.hex || '#C53030';

  // 1-Click Occasion Selector
  const handleSelectOccasionPreset = (occ: typeof QUICK_OCCASIONS[0]) => {
    setSelectedOccasion(occ.id);
    const core = GARMENT_CATALOG.find(g => g.id === occ.coreId) || GARMENT_CATALOG[0];
    const base = GARMENT_CATALOG.find(g => g.id === occ.baseId) || null;
    const bottom = GARMENT_CATALOG.find(g => g.id === occ.bottomId) || null;
    const acc = ACCESSORY_CATALOG.find(a => a.id === occ.accId);

    setOutfit(prev => ({
      ...prev,
      coreGarment: core,
      baseGarment: base,
      bottomPiece: bottom,
      accessories: acc ? [acc] : [],
      lapelMode: 'HUU_NHAM',
      buttonCount: core.hasFiveButtons ? 5 : prev.buttonCount
    }));

    setAiFeedbackToast(`✨ Đã phối mẫu chuẩn cho: ${occ.name}!`);
    setTimeout(() => setAiFeedbackToast(null), 3000);
  };

  // Instant AI Auto-Stylist
  const handleAIAutoStyle = (customPrompt?: string) => {
    setIsAiStyling(true);
    setTimeout(() => {
      const text = (customPrompt || customAiText || '').toLowerCase();
      let occ = QUICK_OCCASIONS[0];

      if (text.includes('cưới') || text.includes('hôn')) occ = QUICK_OCCASIONS[2];
      else if (text.includes('tết') || text.includes('xuân')) occ = QUICK_OCCASIONS[1];
      else if (text.includes('chùa') || text.includes('tâm')) occ = QUICK_OCCASIONS[3];
      else if (text.includes('hội') || text.includes('quan họ')) occ = QUICK_OCCASIONS[4];
      else if (text.includes('phố') || text.includes('street')) occ = QUICK_OCCASIONS[5];
      else if (text.includes('cung') || text.includes('triều')) occ = QUICK_OCCASIONS[6];
      else {
        // Random pick for fun exploration
        const randomIndex = Math.floor(Math.random() * QUICK_OCCASIONS.length);
        occ = QUICK_OCCASIONS[randomIndex];
      }

      handleSelectOccasionPreset(occ);
      setIsAiStyling(false);
      setIsAiInputOpen(false);
      setCustomAiText('');
    }, 350);
  };

  // Auto-Fix any cultural violation (e.g. reverse lapel)
  const handleAutoFix = () => {
    setOutfit(prev => ({
      ...prev,
      lapelMode: 'HUU_NHAM',
      buttonCount: prev.coreGarment.hasFiveButtons ? 5 : prev.buttonCount,
      bottomPiece: prev.bottomPiece || GARMENT_CATALOG.find(g => g.id === 'bottom-quan-lua-trang') || null
    }));
    setAiFeedbackToast('✅ Đã chuẩn hóa quy thức Hữu Nhậm 100%!');
    setTimeout(() => setAiFeedbackToast(null), 3000);
  };

  // Color change
  const handleChangeSilkColor = (hex: string) => {
    setOutfit(prev => ({
      ...prev,
      customColors: {
        ...(prev.customColors || {}),
        core: hex
      }
    }));
  };

  // Garment selection
  const handleSelectGarmentItem = (item: GarmentItem) => {
    if (activeTab === 'core') {
      setOutfit(prev => ({
        ...prev,
        coreGarment: item,
        buttonCount: item.hasFiveButtons ? 5 : prev.buttonCount
      }));
    } else if (activeTab === 'base') {
      setOutfit(prev => ({
        ...prev,
        baseGarment: prev.baseGarment?.id === item.id ? null : item
      }));
    } else if (activeTab === 'bottom') {
      setOutfit(prev => ({
        ...prev,
        bottomPiece: prev.bottomPiece?.id === item.id ? null : item
      }));
    }
  };

  const handleToggleAccessory = (acc: AccessoryItem) => {
    setOutfit(prev => {
      const exists = prev.accessories.some(a => a.id === acc.id);
      return {
        ...prev,
        accessories: exists
          ? prev.accessories.filter(a => a.id !== acc.id)
          : [...prev.accessories, acc]
      };
    });
  };

  // Wardrobe Items based on current active tab
  const tabItems = useMemo(() => {
    if (activeTab === 'accessory') return [];
    return GARMENT_CATALOG.filter(g => g.slot === activeTab);
  }, [activeTab]);

  return (
    <div className="w-full space-y-4 pb-16 font-sans">

      {/* ========================================================================= */}
      {/* 1. TOP STUDIO BAR: OCCASION PRESETS & ONE-CLICK AI ACTIONS                */}
      {/* ========================================================================= */}
      <section className="bg-white border border-stone-200 rounded-2xl p-3 sm:p-4 shadow-xs">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: Quick Occasions Horizontal Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-mono text-stone-500 uppercase font-bold shrink-0 mr-1 hidden sm:inline">
              Mục đích:
            </span>
            {QUICK_OCCASIONS.map(occ => {
              const isSelected = selectedOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => handleSelectOccasionPreset(occ)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-amber-600 text-white font-bold shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  <span>{occ.icon}</span>
                  <span>{occ.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right: AI & Export Actions */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            {/* Quick AI Auto-Stylist Button */}
            <button
              onClick={() => handleAIAutoStyle()}
              disabled={isAiStyling}
              className="px-3.5 py-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="Để AI tự động phối nhanh"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiStyling ? 'animate-spin' : ''}`} />
              <span>{isAiStyling ? 'Đang phối...' : '✨ AI Phối Nhanh'}</span>
            </button>

            {/* Custom Prompt Toggle */}
            <button
              onClick={() => setIsAiInputOpen(!isAiInputOpen)}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 border border-stone-200 transition-colors cursor-pointer"
              title="Nhập mô tả riêng cho AI"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-700" />
            </button>

            {/* Lookbook Export */}
            <button
              onClick={() => onOpenExporter(outfit, validationResult, stylistCritique)}
              className="px-4 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Xuất Thẻ Lookbook</span>
            </button>
          </div>
        </div>

        {/* Expandable Custom AI Input Bar */}
        {isAiInputOpen && (
          <div className="mt-3 pt-3 border-t border-stone-100 flex items-center gap-2">
            <input
              type="text"
              value={customAiText}
              onChange={(e) => setCustomAiText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAIAutoStyle(customAiText); }}
              placeholder="Nhập mong muốn riêng (Ví dụ: 'Chụp kỷ yếu hồ Tây', 'Đám cưới cổ truyền sang trọng')..."
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600"
              autoFocus
            />
            <button
              onClick={() => handleAIAutoStyle(customAiText)}
              disabled={isAiStyling}
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-mono font-bold hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
            >
              Phối Ngay
            </button>
          </div>
        )}

        {/* Toast Alert */}
        {aiFeedbackToast && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 font-medium flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{aiFeedbackToast}</span>
          </div>
        )}

      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN STUDIO WORKSPACE (TWO-PANEL CLEAN DESKTOP / MOBILE RESPONSIVE)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT / CENTER (5 COLS): THE HERO STAGE (MANNEQUIN OR MOCKUP)            */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs relative">
            
            {/* View Mode Toggle & Guardrail Pill */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-2.5 mb-2">
              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-mono">
                <button
                  onClick={() => setPresentationMode('MANNEQUIN')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    presentationMode === 'MANNEQUIN'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  👗 Ma-nơ-canh
                </button>
                <button
                  onClick={() => setPresentationMode('MOCKUP')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                    presentationMode === 'MOCKUP'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  🎴 Mockup Lookbook
                </button>
              </div>

              {/* Status Badge */}
              {validationResult.violations.length > 0 ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  <span>Cần Chỉnh Vạt Áo</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Chuẩn Hữu Nhậm</span>
                </span>
              )}
            </div>

            {/* STAGE RENDER: MANNEQUIN OR MOCKUP */}
            {presentationMode === 'MANNEQUIN' ? (
              <MannequinCanvas2D
                outfit={outfit}
                onUpdateOutfit={setOutfit}
                onToggleLapel={() => {
                  setOutfit(prev => ({
                    ...prev,
                    lapelMode: prev.lapelMode === 'HUU_NHAM' ? 'TA_NHAM' : 'HUU_NHAM'
                  }));
                }}
              />
            ) : (
              /* Self-Contained 2D Editorial Mockup Stage */
              <div className="relative w-full rounded-2xl overflow-hidden border border-amber-300/80 bg-gradient-to-br from-[#FFFDF7] via-[#FAF6EA] to-[#F5EEDC] p-4 text-stone-950 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-amber-800 font-bold block">
                      LOOKBOOK DI SẢN
                    </span>
                    <h4 className="font-imperial font-bold text-base text-stone-900">
                      {outfit.coreGarment.name}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-amber-300 text-amber-900 text-[10px] font-mono font-bold">
                    100/100 HIS
                  </span>
                </div>

                {/* SVG Silhouette Stage */}
                <div className="relative w-full h-[280px] rounded-xl overflow-hidden border border-amber-200 bg-stone-50 flex items-center justify-center">
                  <svg viewBox="0 0 320 460" className="w-full h-full max-h-[260px] filter drop-shadow-md">
                    <defs>
                      <linearGradient id="editorialRobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={currentSilkColor} stopOpacity="1" />
                        <stop offset="100%" stopColor="#1E2024" stopOpacity="0.25" />
                      </linearGradient>
                    </defs>
                    <ellipse cx="160" cy="445" rx="70" ry="10" fill="rgba(0,0,0,0.12)" />
                    <ellipse cx="160" cy="42" rx="17" ry="22" fill="#F8EFE4" stroke="#E2D1BE" />
                    <path d="M152 64 L152 84 L168 84 L168 64 Z" fill="#F8EFE4" />
                    {/* Trousers */}
                    <path d="M116 215 L96 440 L150 440 L160 270 L170 440 L224 440 L204 215 Z" fill={outfit.customColors?.['bottom'] || '#F8FAFC'} stroke="rgba(0,0,0,0.12)" />
                    {/* White Collar */}
                    <path d="M144 84 C155 80 165 80 176 84 L178 96 C165 98 155 98 142 96 Z" fill="#FFFFFF" stroke="#CBD5E1" />
                    {/* Robe Sleeves */}
                    <path d="M108 96 L74 200 L86 275 L102 270 L96 205 L118 112 Z" fill="url(#editorialRobeGrad)" stroke="rgba(0,0,0,0.2)" />
                    <path d="M212 96 L246 200 L234 275 L218 270 L224 205 L202 112 Z" fill="url(#editorialRobeGrad)" stroke="rgba(0,0,0,0.2)" />
                    {/* Robe Body */}
                    <path d="M110 96 C134 88 186 88 210 96 L226 350 C194 366 126 366 94 350 Z" fill="url(#editorialRobeGrad)" stroke="rgba(0,0,0,0.2)" />
                    {/* Center Back Stitch */}
                    <line x1="160" y1="96" x2="160" y2="355" stroke="rgba(0,0,0,0.15)" strokeWidth="1" strokeDasharray="4,2" />
                    {/* Lapel & Buttons */}
                    <path d="M160 96 C160 120 176 142 192 152 L192 350" stroke="#D97706" strokeWidth="1.8" fill="none" />
                    {[100, 126, 152, 198, 246].map((by, bIdx) => (
                      <circle key={by} cx={bIdx === 0 ? 162 : bIdx === 1 ? 174 : 192} cy={by} r="2.8" fill="#FDE68A" stroke="#92400E" strokeWidth="0.8" />
                    ))}
                  </svg>

                  {/* Stamp */}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg border border-rose-700 bg-white/95 text-rose-800 text-[8px] font-mono font-bold rotate-[-6deg] shadow-xs select-none">
                    ★ HỮU NHẬM BẢO CHỨNG ★
                  </div>
                </div>

                <div className="text-[11px] text-stone-700 leading-relaxed font-sans">
                  {outfit.coreGarment.historicalNote}
                </div>
              </div>
            )}

            {/* Quick Natural Silk Palette Dots */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-500 font-bold">Màu Lụa:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {SILK_COLORS.map(c => {
                  const isActive = currentSilkColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      onClick={() => handleChangeSilkColor(c.hex)}
                      className={`w-6 h-6 rounded-full border transition-all cursor-pointer shadow-2xs ${
                        isActive ? 'ring-2 ring-amber-600 scale-110 border-white' : 'border-stone-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  );
                })}
              </div>
            </div>

          </div>

          {/* Cultural Guardrail Warning (Only appears if violation detected) */}
          {validationResult.violations.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">{validationResult.violations[0].title}</strong>
                  <p className="text-[11px] text-amber-800">{validationResult.violations[0].message}</p>
                </div>
              </div>
              <button
                onClick={handleAutoFix}
                className="px-3 py-1.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs font-bold shrink-0 cursor-pointer shadow-xs"
              >
                ⚡ Sửa Ngay
              </button>
            </div>
          )}

          {/* Expandable Cultural Curator Notes (Collapsed by Default) */}
          <div className="bg-white border border-stone-200 rounded-2xl p-3 shadow-xs">
            <button
              onClick={() => setIsCuratorAdviceExpanded(!isCuratorAdviceExpanded)}
              className="w-full flex items-center justify-between text-xs font-mono font-bold text-stone-800 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Ý Nghĩa Di Sản & Sử Liệu ({outfit.coreGarment.name})</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${isCuratorAdviceExpanded ? 'rotate-180' : ''}`} />
            </button>

            {isCuratorAdviceExpanded && (
              <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-700 space-y-2 leading-relaxed">
                <p>{outfit.coreGarment.historicalNote}</p>
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-950">
                  <strong className="block font-mono text-[10px] uppercase text-amber-900">
                    Thư Tịch Đối Chiếu: {outfit.coreGarment.citation.sourceDocument}
                  </strong>
                  <span>{outfit.coreGarment.citation.citationText}</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT (7 COLS): CLEAN, VISUAL WARDROBE RACK (TỦ ĐỒ TRỰC QUAN)            */}
        {/* ----------------------------------------------------------------------- */}
        <div className="lg:col-span-7 space-y-3">
          
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-4">
            
            {/* 4 Clean Wardrobe Tabs */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
              {[
                { id: 'core' as const, label: '1. Áo Chính', icon: '👘' },
                { id: 'base' as const, label: '2. Yếm / Lót', icon: '🎽' },
                { id: 'bottom' as const, label: '3. Quần / Váy', icon: '👖' },
                { id: 'accessory' as const, label: '4. Phụ Kiện', icon: '📿' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === tab.id
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Garments Grid (Core, Base, Bottom) */}
            {activeTab !== 'accessory' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[580px] overflow-y-auto pr-1">
                {tabItems.map(item => {
                  const isEquipped =
                    activeTab === 'core'
                      ? outfit.coreGarment.id === item.id
                      : activeTab === 'base'
                      ? outfit.baseGarment?.id === item.id
                      : outfit.bottomPiece?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectGarmentItem(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isEquipped
                          ? 'bg-amber-50/80 border-2 border-amber-600 shadow-2xs'
                          : 'bg-stone-50/60 border-stone-200 hover:border-amber-300 hover:bg-white'
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-stone-900 font-imperial">
                            {item.name}
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono text-stone-500 block">
                          {item.era} · {item.region === 'BAC_BO' ? 'Bắc Bộ' : item.region === 'TRUNG_BO' ? 'Huế' : 'Nam Bộ'}
                        </span>
                        <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                          {item.historicalNote}
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-between shrink-0 h-full">
                        <div
                          className="w-5 h-5 rounded-full border border-stone-300 shadow-2xs"
                          style={{ backgroundColor: item.defaultColor.hex }}
                        />
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-3 ${
                          isEquipped ? 'bg-amber-600 border-amber-600 text-white' : 'border-stone-300'
                        }`}>
                          {isEquipped && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Accessory Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[580px] overflow-y-auto pr-1">
                {ACCESSORY_CATALOG.map(acc => {
                  const isEquipped = outfit.accessories.some(a => a.id === acc.id);
                  return (
                    <div
                      key={acc.id}
                      onClick={() => handleToggleAccessory(acc)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        acc.isForeignOrAssimilated
                          ? 'bg-rose-50/70 border-rose-300'
                          : isEquipped
                          ? 'bg-amber-50/80 border-2 border-amber-600 shadow-2xs'
                          : 'bg-stone-50/60 border-stone-200 hover:border-amber-300 hover:bg-white'
                      }`}
                    >
                      <div className="space-y-1 flex-1">
                        <h4 className="text-xs font-bold text-stone-900 font-imperial">
                          {acc.name}
                        </h4>
                        <span className="text-[10px] font-mono text-stone-500 block">
                          {acc.region === 'ALL' ? 'Toàn Quốc' : acc.region === 'BAC_BO' ? 'Bắc Bộ' : acc.region === 'TRUNG_BO' ? 'Cố Đô' : 'Nam Bộ'}
                        </span>
                        <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                          {acc.culturalNote}
                        </p>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isEquipped ? 'bg-amber-600 border-amber-600 text-white' : 'border-stone-300'
                      }`}>
                        {isEquipped && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Citation Detail Modal if opened */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-imperial font-bold text-base text-stone-900">
                {activeCitation.name} — Sử Liệu Đối Chiếu
              </h3>
              <button
                onClick={() => setActiveCitation(null)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {activeCitation.historicalNote}
            </p>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
              <strong className="block font-mono text-[10px] uppercase text-amber-900">
                Tài Liệu: {activeCitation.citation.sourceDocument}
              </strong>
              <span>{activeCitation.citation.citationText}</span>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveCitation(null)}
                className="px-4 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-mono font-bold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InteractiveAtelier;
