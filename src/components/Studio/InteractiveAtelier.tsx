import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Layers,
  Sparkles,
  RotateCcw,
  Check,
  AlertTriangle,
  BookmarkPlus,
  Share2,
  Wand2,
  ChevronRight,
  Eye,
  EyeOff,
  Filter,
  Flame,
  Palette,
  ShieldCheck,
  ShieldAlert,
  Upload,
  User,
  Sliders,
  Columns,
  RefreshCw,
  Sun,
  CloudSnow,
  CloudRain,
  MapPin,
  Calendar,
  Compass,
  Zap,
  Info
} from 'lucide-react';
import {
  GarmentItem,
  AccessoryItem,
  Occasion,
  Region,
  Weather,
  FiveElement,
  OutfitState,
  HeritageValidationResult,
  CulturalViolation
} from '../../types/vibephuc';
import {
  GARMENT_CATALOG,
  ACCESSORY_CATALOG,
  OCCASION_RECOMMENDATIONS,
  validateOutfitHeritage
} from '../../data/heritageCatalog';
import { MannequinCanvas2D } from './MannequinCanvas2D';

interface InteractiveAtelierProps {
  onOpenExporter: (outfit: OutfitState, validation: HeritageValidationResult) => void;
  onOpenRules: () => void;
}

export const InteractiveAtelier: React.FC<InteractiveAtelierProps> = ({
  onOpenExporter,
  onOpenRules,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters State
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>('KY_YEU_GRADUATION');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'ALL'>('ALL');
  const [selectedWeather, setSelectedWeather] = useState<Weather>('NANG_AM');

  // Active outfit configuration state
  const [outfit, setOutfit] = useState<OutfitState>({
    avatarType: 'FEMALE_STUDENT',
    baseGarment: GARMENT_CATALOG.find(g => g.id === 'base-trung-don-bach') || null,
    coreGarment: GARMENT_CATALOG.find(g => g.id === 'core-ao-dai-ngu-than') || GARMENT_CATALOG[0],
    outerGarment: null,
    bottomPiece: GARMENT_CATALOG.find(g => g.id === 'bottom-quan-lua-trang') || null,
    footwear: ACCESSORY_CATALOG.find(a => a.id === 'acc-sneaker-chunky') || null,
    accessories: [ACCESSORY_CATALOG.find(a => a.id === 'acc-kieng-bac')!].filter(Boolean),
    modernAccents: ['translucent-hem'],
    lapelMode: 'HUU_NHAM',
    buttonCount: 5,
    isXRayMode: false
  });

  // Comparison Slot (Outfit B for Side-by-Side comparison)
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [outfitB, setOutfitB] = useState<OutfitState | null>(null);

  // Active Wardrobe Slot Filter in UI
  const [activeSlotTab, setActiveSlotTab] = useState<'core' | 'base' | 'outer' | 'bottom' | 'accessory'>('core');
  const [mobileTab, setMobileTab] = useState<'canvas' | 'wardrobe'>('canvas');

  // Validation Result calculated dynamically
  const validationResult = useMemo<HeritageValidationResult>(() => {
    return validateOutfitHeritage(outfit);
  }, [outfit]);

  const validationResultB = useMemo<HeritageValidationResult | null>(() => {
    return outfitB ? validateOutfitHeritage(outfitB) : null;
  }, [outfitB]);

  // Violation animation trigger
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const prevLapelRef = useRef(outfit.lapelMode);

  useEffect(() => {
    if (outfit.lapelMode === 'TA_NHAM' && prevLapelRef.current !== 'TA_NHAM') {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 600);
      return () => clearTimeout(timer);
    }
    prevLapelRef.current = outfit.lapelMode;
  }, [outfit.lapelMode]);

  // Filtered Garment Items based on active tab, region, and occasion
  const availableGarments = useMemo(() => {
    return GARMENT_CATALOG.filter(item => {
      if (item.slot !== activeSlotTab) return false;
      if (selectedRegion !== 'ALL' && item.region !== selectedRegion) return false;
      return true;
    });
  }, [activeSlotTab, selectedRegion]);

  const availableAccessories = useMemo(() => {
    if (activeSlotTab !== 'accessory') return [];
    return ACCESSORY_CATALOG.filter(acc => {
      if (selectedRegion !== 'ALL' && acc.region !== 'ALL' && acc.region !== selectedRegion) return false;
      return true;
    });
  }, [activeSlotTab, selectedRegion]);

  // Actions
  const handleSelectCore = (item: GarmentItem) => {
    setOutfit(prev => ({
      ...prev,
      coreGarment: item,
      buttonCount: item.hasFiveButtons ? 5 : prev.buttonCount
    }));
  };

  const handleSelectBase = (item: GarmentItem | null) => {
    setOutfit(prev => ({ ...prev, baseGarment: item }));
  };

  const handleSelectOuter = (item: GarmentItem | null) => {
    setOutfit(prev => ({ ...prev, outerGarment: item }));
  };

  const handleSelectBottom = (item: GarmentItem | null) => {
    setOutfit(prev => ({ ...prev, bottomPiece: item }));
  };

  const handleToggleAccessory = (acc: AccessoryItem) => {
    setOutfit(prev => {
      const exists = prev.accessories.some(a => a.id === acc.id);
      if (exists) {
        return { ...prev, accessories: prev.accessories.filter(a => a.id !== acc.id) };
      } else {
        return { ...prev, accessories: [...prev.accessories, acc] };
      }
    });
  };

  const handleToggleLapel = () => {
    setOutfit(prev => ({
      ...prev,
      lapelMode: prev.lapelMode === 'HUU_NHAM' ? 'TA_NHAM' : 'HUU_NHAM'
    }));
  };

  const handleAutoFix = () => {
    setOutfit(prev => ({
      ...prev,
      lapelMode: 'HUU_NHAM',
      accessories: prev.accessories.filter(a => !a.isForeignOrAssimilated),
      bottomPiece: prev.bottomPiece || GARMENT_CATALOG.find(g => g.id === 'bottom-quan-lua-trang') || null,
      buttonCount: 5
    }));
  };

  const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setOutfit(prev => ({
        ...prev,
        avatarType: 'CUSTOM_UPLOAD',
        customAvatarUrl: url
      }));
    }
  };

  const handleCopyToCompare = () => {
    if (!isCompareMode) {
      setOutfitB({ ...outfit });
      setIsCompareMode(true);
    } else {
      setIsCompareMode(false);
      setOutfitB(null);
    }
  };

  const currentRecommendation = OCCASION_RECOMMENDATIONS[selectedOccasion];

  return (
    <div className="w-full space-y-8 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. SMART FILTER & CONTEXT BAR (SỰ KIỆN, VÙNG MIỀN, THỜI TIẾT) */}
      {/* ========================================================================= */}
      <section className="bg-obsidian-800/90 border border-white/10 rounded-m3-xl p-5 backdrop-blur-organza shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-m3-md bg-heritage-hoang/20 text-heritage-hoang border border-heritage-hoang/40 flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-imperial text-white">
                Bộ Lọc Bối Cảnh Thông Minh (Smart Context Filter)
              </h2>
              <span className="text-xs text-neutral-400 font-sans">
                Tự động đề xuất phục sức chuẩn mực theo sự kiện, địa phương và thời tiết
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyToCompare}
              className={`px-4 py-2 rounded-m3-full text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isCompareMode
                  ? 'bg-amber-400 text-black shadow-heritage-glow'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Columns className="w-4 h-4" />
              <span>{isCompareMode ? 'Tắt So Sánh' : 'So Sánh 2 Outfit'}</span>
            </button>

            <button
              onClick={() => onOpenExporter(outfit, validationResult)}
              className="px-5 py-2 rounded-m3-full bg-cyber-lime hover:bg-lime-400 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-cyber-glow transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Xuất Lookbook Passport</span>
            </button>
          </div>
        </div>

        {/* Streamlined Context Filter Strip (Decluttered, Zero-Pill Aesthetic) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Occasion Selector */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-heritage-hoang" />
                Dịp:
              </span>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value as Occasion)}
                className="bg-obsidian-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-heritage-hoang cursor-pointer"
              >
                <option value="KY_YEU_GRADUATION">🎓 Kỷ Yếu Học Đường</option>
                <option value="TET_SPRING">🌸 Tết Du Xuân</option>
                <option value="LE_HOI_TRUONG">🚩 Lễ Hội Trường</option>
                <option value="STREETWEAR_CASUAL">⚡ Dạo Phố Streetwear</option>
                <option value="PROM_NIGHT">✨ Dạ Hội Prom Night</option>
                <option value="DAM_CUOI_WEDDING">💍 Đám Cưới Hôn Lễ</option>
              </select>
            </div>

            {/* Region Selector */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyber-lime" />
                Vùng:
              </span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as any)}
                className="bg-obsidian-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyber-lime cursor-pointer"
              >
                <option value="ALL">Toàn Quốc</option>
                <option value="BAC_BO">Bắc Bộ</option>
                <option value="TRUNG_BO">Huế & Miền Trung</option>
                <option value="NAM_BO">Nam Bộ</option>
                <option value="TAY_NGUYEN_TAY_BAC">Tây Nguyên / Tây Bắc</option>
              </select>
            </div>

            {/* Weather Selector */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-mono text-[11px] uppercase tracking-wider flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                Thời tiết:
              </span>
              <select
                value={selectedWeather}
                onChange={(e) => setSelectedWeather(e.target.value as Weather)}
                className="bg-obsidian-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-300 cursor-pointer"
              >
                <option value="NANG_AM">☀️ Nắng Ấm Thoáng Mát</option>
                <option value="SE_LANH">❄️ Se Lạnh Thu Đông</option>
                <option value="MUA_RAO">🌧️ Mưa Rào Nhiệt Đới</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-neutral-400">
            <span className="text-amber-200">💡 {currentRecommendation.weatherTips}</span>
          </div>
        </div>

        {/* Context Advisor Banner */}
        <div className="p-3 rounded-lg bg-obsidian-900 border border-white/10 text-xs text-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <strong className="text-white">{currentRecommendation.title}:</strong>
            <span className="text-neutral-300">{currentRecommendation.vibeDescription}</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. MAIN ATELIER WORKSPACE: STYLING CANVAS & WARDROBE RACK */}
      {/* ========================================================================= */}
      {/* Mobile Mode Switcher (Zero Clutter on Mobile) */}
      <div className="lg:hidden flex items-center bg-obsidian-800 p-1 rounded-m3-full border border-white/10 mb-4">
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex-1 py-2 text-xs font-mono font-bold rounded-m3-full flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'canvas' ? 'bg-heritage-hoang text-black shadow-heritage-glow' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Ma-nơ-canh 2D</span>
        </button>
        <button
          onClick={() => setMobileTab('wardrobe')}
          className={`flex-1 py-2 text-xs font-mono font-bold rounded-m3-full flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            mobileTab === 'wardrobe' ? 'bg-heritage-hoang text-black shadow-heritage-glow' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Tủ Đồ ({availableGarments.length} mẫu)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ===================================================================== */}
        {/* LEFT / CENTER: 2D HUMAN MANNEQUIN FITTING CANVAS & X-RAY STAGE       */}
        {/* ===================================================================== */}
        <div className={`${isCompareMode ? 'lg:col-span-7' : 'lg:col-span-5'} space-y-4 ${mobileTab === 'canvas' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Main Stage Card with 2D Mannequin Canvas */}
          <div
            className={`rounded-m3-xl bg-obsidian-800/90 border p-4 sm:p-6 backdrop-blur-organza shadow-2xl relative overflow-hidden transition-all duration-300 ${
              isShaking ? 'animate-shake-ta-nham border-rose-600 shadow-rule-error' : 'border-white/10'
            }`}
          >
            {/* Top Canvas Controls */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  CANVAS PHỐI ĐỒ MA-NƠ-CANH 2D
                </span>
                {validationResult.status === 'CRITICAL_BLOCKER' && (
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 text-[10px] font-mono font-bold animate-pulse">
                    ĐẠI KỴ CẦN SỬA
                  </span>
                )}
              </div>

              <div className="text-xs font-mono text-neutral-400">
                HIS Score: <strong className={validationResult.score >= 80 ? 'text-emerald-400' : 'text-rose-400'}>{validationResult.score}/100</strong>
              </div>
            </div>

            {/* 2D Mannequin Canvas (Outfit A) */}
            <MannequinCanvas2D
              outfit={outfit}
              onUpdateOutfit={setOutfit}
              onToggleLapel={handleToggleLapel}
              isShaking={isShaking}
            />

            {/* Outfit B Comparison Mode */}
            {isCompareMode && outfitB && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-3 text-xs font-mono">
                  <span className="text-amber-200 font-bold uppercase">Phương Án B (Đối Chiếu So Sánh)</span>
                  <button
                    onClick={() => setOutfitB({ ...outfit })}
                    className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  >
                    Đồng bộ A ➔ B
                  </button>
                </div>
                <MannequinCanvas2D
                  outfit={outfitB}
                  onUpdateOutfit={setOutfitB as any}
                  onToggleLapel={() => setOutfitB(prev => prev ? ({ ...prev, lapelMode: prev.lapelMode === 'HUU_NHAM' ? 'TA_NHAM' : 'HUU_NHAM' }) : null)}
                />
              </div>
            )}
          </div>

          {/* Cultural Guardrail Warning Banner & Auto-Fix */}
          {validationResult.violations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-m3-lg bg-rose-950/90 border border-rose-600/80 shadow-rule-error space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-200 font-imperial">
                      {validationResult.violations[0].title}
                    </h4>
                    <p className="text-xs text-rose-300 mt-1 leading-relaxed">
                      {validationResult.violations[0].message}
                    </p>
                    <p className="text-[11px] text-neutral-300 italic mt-1 bg-black/40 p-2 rounded border border-white/10">
                      {validationResult.violations[0].historicalContext}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAutoFix}
                  className="px-4 py-2 rounded-m3-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono shrink-0 shadow-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Tự Động Sửa Chuẩn Mực (Auto-Fix)</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* FENGSHUI & COLOR HARMONY CHECKER CARD */}
          <div className="mt-4 p-4 rounded-m3-lg bg-obsidian-900 border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-heritage-hoang font-bold uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                THƯỚC ĐO HÒA SẮC & NGŨ HÀNH FENGSHUI
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                Hòa Sắc: {validationResult.fengshui.score}%
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {validationResult.fengshui.advice}
            </p>
            {validationResult.fengshui.relationships.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
                {validationResult.fengshui.relationships.map((rel, rIdx) => (
                  <span
                    key={rIdx}
                    className={`px-2 py-0.5 rounded border ${
                      rel.relation === 'GENERATING'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                        : 'bg-rose-950/80 text-rose-300 border-rose-700'
                    }`}
                  >
                    {rel.description}
                  </span>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* ===================================================================== */}
        {/* RIGHT: WARDROBE RACK (LAYER SELECTION ACCORDION / TABS) (5 or 7 COLS) */}
        {/* ===================================================================== */}
        <div className={`${isCompareMode ? 'lg:col-span-5' : 'lg:col-span-7'} space-y-5 ${mobileTab === 'wardrobe' ? 'block' : 'hidden lg:block'}`}>
          
          {/* Wardrobe Slot Tabs */}
          <div className="flex items-center gap-1.5 bg-obsidian-800 p-1.5 rounded-m3-full border border-white/10 overflow-x-auto">
            {[
              { id: 'core', label: 'Áo Chính (Core)' },
              { id: 'base', label: 'Lót / Yếm (Base)' },
              { id: 'outer', label: 'Khoác (Outer)' },
              { id: 'bottom', label: 'Quần / Váy' },
              { id: 'accessory', label: 'Phụ Kiện' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSlotTab(tab.id as any)}
                className={`px-4 py-2 rounded-m3-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeSlotTab === tab.id
                    ? 'bg-heritage-hoang text-black shadow-heritage-glow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Garments List in Active Slot */}
          <div className="space-y-3.5 max-h-[620px] overflow-y-auto pr-2">
            
            {activeSlotTab !== 'accessory' && availableGarments.map(item => {
              const isSelected =
                activeSlotTab === 'core'
                  ? outfit.coreGarment.id === item.id
                  : activeSlotTab === 'base'
                  ? outfit.baseGarment?.id === item.id
                  : activeSlotTab === 'outer'
                  ? outfit.outerGarment?.id === item.id
                  : outfit.bottomPiece?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (activeSlotTab === 'core') handleSelectCore(item);
                    else if (activeSlotTab === 'base') handleSelectBase(isSelected ? null : item);
                    else if (activeSlotTab === 'outer') handleSelectOuter(isSelected ? null : item);
                    else if (activeSlotTab === 'bottom') handleSelectBottom(isSelected ? null : item);
                  }}
                  className={`p-4 rounded-m3-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    isSelected
                      ? 'bg-obsidian-800 border-heritage-hoang shadow-heritage-glow'
                      : 'bg-obsidian-800/70 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold font-imperial text-white">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-amber-200">
                        {item.era}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-200">
                        {item.region}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {item.historicalNote}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400 pt-1">
                      <span>Ngũ Hành: <strong className="text-amber-300">{item.harmonyElement}</strong></span>
                      <span>Sắc: {item.defaultColor.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <div
                      className="w-8 h-8 rounded-full border border-white/30 shadow-md"
                      style={{ backgroundColor: item.defaultColor.hex }}
                    />
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-heritage-hoang border-black text-black' : 'border-white/30'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Accessory Items List */}
            {activeSlotTab === 'accessory' && availableAccessories.map(acc => {
              const isSelected = outfit.accessories.some(a => a.id === acc.id);

              return (
                <div
                  key={acc.id}
                  onClick={() => handleToggleAccessory(acc)}
                  className={`p-4 rounded-m3-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                    acc.isForeignOrAssimilated
                      ? 'bg-rose-950/40 border-rose-800 hover:border-rose-600'
                      : isSelected
                      ? 'bg-obsidian-800 border-heritage-hoang shadow-heritage-glow'
                      : 'bg-obsidian-800/70 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold font-imperial text-white">
                        {acc.name}
                      </span>
                      {acc.isForeignOrAssimilated && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900 text-rose-200 border border-rose-700 font-bold">
                          ⚠️ NGOẠI LAI (CẢNH BÁO)
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                        {acc.type}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {acc.culturalNote}
                    </p>
                  </div>

                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-heritage-hoang border-black text-black' : 'border-white/30'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Avatar Switcher Bar */}
          <div className="p-4 rounded-m3-xl bg-obsidian-800 border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
              <User className="w-4 h-4 text-heritage-hoang" />
              <span>Avatar Thử Đồ:</span>
            </div>

            <div className="flex items-center gap-2">
              {[
                { id: 'FEMALE_STUDENT', label: 'Nữ Sinh' },
                { id: 'MALE_STUDENT', label: 'Nam Sinh' },
                { id: 'GENDER_NEUTRAL', label: 'Trung Tính' },
              ].map(av => (
                <button
                  key={av.id}
                  onClick={() => setOutfit(prev => ({ ...prev, avatarType: av.id as any }))}
                  className={`px-3 py-1.5 rounded-m3-full text-xs font-mono transition-colors cursor-pointer ${
                    outfit.avatarType === av.id
                      ? 'bg-heritage-hoang text-black font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-neutral-400'
                  }`}
                >
                  {av.label}
                </button>
              ))}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-m3-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                title="Tải ảnh cá nhân để thử đồ"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Tải Ảnh</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleUploadAvatar}
                className="hidden"
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
