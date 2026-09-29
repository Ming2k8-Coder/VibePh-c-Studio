import React, { useState, useMemo, useEffect } from 'react';
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
  Info,
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Palette,
  ExternalLink,
  Shirt
} from 'lucide-react';
import { 
  HeritageItem, 
  LayerSlot, 
  ClosureDirection, 
  AtelierConfiguration, 
  evaluateHeritageIntegrity,
  HeritageValidationResult
} from '../../types/heritage';
import { HERITAGE_CATALOG } from '../../data/heritageCatalog';
import { HeritageHUD } from './HeritageHUD';
import { RemixResponse } from '../../types/lookbook';

interface ModularAtelierProps {
  onOpenLookbooks: () => void;
  onOpenGuide: () => void;
  onRemixWithAI: (garmentId: string, modernLayer: string, notes: string) => Promise<void>;
  isRemixingAI: boolean;
  savedLookbooksCount: number;
}

const LAYER_SLOTS: { id: LayerSlot; label: string; sub: string; icon: string }[] = [
  { id: 'base', label: '1. Lớp Cốt Lõi (Base)', sub: 'Trung Đơn / Yếm', icon: '🎽' },
  { id: 'core', label: '2. Lớp Di Sản (Core)', sub: 'Ngũ Thân / Nhật Bình / Bà Ba', icon: '👘' },
  { id: 'outer', label: '3. Lớp Khoác Ngoài (Outer)', sub: 'Bomber / Trench / Blazer', icon: '🧥' },
  { id: 'bottom', label: '4. Lớp Quần/Váy (Bottom)', sub: 'Ống Rộng / Cargo / Váy Đụp', icon: '👖' },
  { id: 'accessory', label: '5. Phụ Kiện (Accessory)', sub: 'Khăn Đóng / Quai Thao / Rằn', icon: '🧢' },
];

export const ModularAtelier: React.FC<ModularAtelierProps> = ({
  onOpenLookbooks,
  onOpenGuide,
  onRemixWithAI,
  isRemixingAI,
  savedLookbooksCount,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Active layer slot for selection panel
  const [activeSlot, setActiveSlot] = useState<LayerSlot>('core');

  // Atelier Outfit State
  const [atelierConfig, setAtelierConfig] = useState<AtelierConfiguration>({
    baseItem: (HERITAGE_CATALOG as any[]).find((i: any) => i.id === 'base-trung-don') || null,
    coreItem: (HERITAGE_CATALOG as any[]).find((i: any) => i.id === 'core-ngu-than-tay-chen') || null,
    outerItem: (HERITAGE_CATALOG as any[]).find((i: any) => i.id === 'outer-bomber-thuy-ba') || null,
    bottomItem: (HERITAGE_CATALOG as any[]).find((i: any) => i.id === 'bottom-cargo-parachute') || null,
    accessoryItem: (HERITAGE_CATALOG as any[]).find((i: any) => i.id === 'acc-khan-dong-7-vong') || null,
    customClosureOverride: 'HUU_NHAM',
    customButtonOverride: 5,
  });

  // Ta Nham Taboo Shake & Alert state
  const [isShakingTaNham, setIsShakingTaNham] = useState<boolean>(false);
  const [taNhamAlertMessage, setTaNhamAlertMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Compute live validation result
  const validationResult: HeritageValidationResult = useMemo(() => {
    return evaluateHeritageIntegrity(atelierConfig);
  }, [atelierConfig]);

  // Handle Layer Selection
  const handleSelectItem = (item: HeritageItem) => {
    setAtelierConfig(prev => {
      const next = { ...prev };
      switch (item.slot) {
        case 'base': next.baseItem = item; break;
        case 'core': 
          next.coreItem = item;
          // Sync defaults from core
          next.customClosureOverride = item.attributes.closureDirection;
          next.customButtonOverride = item.attributes.buttonCount;
          break;
        case 'outer': next.outerItem = item; break;
        case 'bottom': next.bottomItem = item; break;
        case 'accessory': next.accessoryItem = item; break;
      }
      return next;
    });
  };

  // Remove item from a slot
  const handleRemoveSlot = (slot: LayerSlot) => {
    setAtelierConfig(prev => {
      const next = { ...prev };
      switch (slot) {
        case 'base': next.baseItem = null; break;
        case 'core': next.coreItem = null; break;
        case 'outer': next.outerItem = null; break;
        case 'bottom': next.bottomItem = null; break;
        case 'accessory': next.accessoryItem = null; break;
      }
      return next;
    });
  };

  // Attempt to switch closure: Test Hữu Nhậm vs Tả Nhậm
  const handleToggleClosure = (targetClosure: ClosureDirection) => {
    if (targetClosure === 'TA_NHAM') {
      // TRIGGER CRITICAL TABOO BOUNCE / SHAKE MECHANIC
      setIsShakingTaNham(true);
      setTaNhamAlertMessage(
        'ĐẠI KỴ TẢ NHẬM (左衽): Cài vạt áo sang bên trái là quy thức tang lễ cổ truyền chỉ dùng khi liệm thi thể người mất. Trong văn hóa cổ phục Việt Nam, người sống tuyệt đối luôn cài Hữu Nhậm (Vạt trái phủ lên vạt phải).'
      );

      // Automatically elastic bounce back to HUU_NHAM after shake
      setTimeout(() => {
        setIsShakingTaNham(false);
      }, 500);

      // Keep it as HUU_NHAM or revert
      setAtelierConfig(prev => ({ ...prev, customClosureOverride: 'TA_NHAM' }));

      // Promptly auto-revert within 2.5s if not manually corrected
      setTimeout(() => {
        setAtelierConfig(prev => ({ ...prev, customClosureOverride: 'HUU_NHAM' }));
      }, 2600);
      return;
    }

    setTaNhamAlertMessage(null);
    setAtelierConfig(prev => ({ ...prev, customClosureOverride: targetClosure }));
  };

  // Auto-Fix implementation
  const handleAutoFix = () => {
    setTaNhamAlertMessage(null);
    setAtelierConfig(prev => ({
      ...prev,
      customClosureOverride: 'HUU_NHAM',
      customButtonOverride: 5,
    }));
  };

  // Save current lookbook to Firestore backend
  const handleSaveToLookbook = async () => {
    if (!validationResult.isValid) return;
    setIsSaving(true);
    try {
      const coreName = atelierConfig.coreItem?.name || 'Cổ Phục Việt Nam';
      const outerName = atelierConfig.outerItem?.name || 'Streetwear';
      const payload: Partial<RemixResponse> = {
        outfitName: `${coreName} × ${outerName}`,
        periodReference: `${atelierConfig.coreItem?.era || 'Triều Nguyễn'} × Đương đại 2026`,
        culturalGuardrailStatus: 'VERIFIED_HUU_NHAM',
        heritageIntegrityScore: validationResult.score,
        heritageScore: validationResult.score,
        layers: {
          innerBase: atelierConfig.baseItem?.name || 'Trung đơn lót trắng',
          heritageOuter: coreName,
          modernAccent: `${outerName} + ${atelierConfig.bottomItem?.name || 'Quần thụng'}`,
        },
        stylingGuide: 'Phối đồ chuẩn mực di sản Hữu Nhậm kết hợp chất liệu công nghệ cao.',
        curatorVerdict: 'Bản phối đạt chuẩn quy thức văn hóa với điểm HIS tối ưu.',
        coreGarment: {
          name: coreName,
          period: atelierConfig.coreItem?.era || 'Triều Nguyễn',
          historicalContext: atelierConfig.coreItem?.culturalNote || 'Chuẩn mực ngũ thân',
          keyFeatures: [
            atelierConfig.customClosureOverride === 'HUU_NHAM' ? 'Vạt cài Hữu Nhậm' : 'Vạt truyền thống',
            `${atelierConfig.customButtonOverride} khuy cúc ngũ thường`,
            'Đường may sống lưng Chính Trung',
          ],
        },
        modernElement: {
          name: outerName,
          category: 'Streetwear Fusion',
          stylingApproach: 'Layering đa tầng công nghệ cao',
          harmonicReasoning: 'Bảo tồn tính tôn nghiêm đồng thời tối ưu chuyển động đô thị',
        },
        colorPalette: [
          { name: 'Hoàng Thổ (Chính Trung)', hex: '#D69E2E', element: 'Thổ', symbolicMeaning: 'Đất mẹ trung tâm, sự ngay thẳng' },
          { name: 'Chu Sa (Hữu Nhậm)', hex: '#C53030', element: 'Hỏa', symbolicMeaning: 'Nhiệt huyết, danh dự, lễ tiết' },
          { name: 'Lam Chàm Cổ Truyền', hex: '#1E3A8A', element: 'Thủy', symbolicMeaning: 'Bền bỉ, sâu lắng' },
          { name: 'Cyber Lime Dạ Quang', hex: '#CCFF00', element: 'Mộc', symbolicMeaning: 'Sức sống thế hệ trẻ vươn tới tương lai' },
        ],
        stylingTips: [
          'Giữ nếp cổ lập lĩnh thẳng góc để trung đơn trắng bên trong lộ viền 2-3mm.',
          'Kết hợp cùng giày thể thao đế chunky để cân bằng độ dài vạt áo.',
        ],
        culturalEtiquetteCertified: true,
      };

      const res = await fetch('/api/lookbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save outfit:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Real-Time Responsible AI Heritage HUD */}
      <HeritageHUD
        validationResult={validationResult}
        onAutoFix={handleAutoFix}
        onOpenHeritageGuide={onOpenGuide}
      />

      {/* Ta Nham Alert Toast with Elastic Warning */}
      <AnimatePresence>
        {taNhamAlertMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="p-4 rounded-m3-md bg-heritage-son/20 border-2 border-heritage-son text-white shadow-rule-error backdrop-blur-organza flex items-start gap-3"
          >
            <div className="p-2 rounded-full bg-heritage-son text-white flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
                <span>Văn Hóa Đại Kỵ Được Kích Hoạt</span>
                <span className="text-[10px] bg-red-950 px-2 py-0.5 rounded text-rose-300">
                  Taboo Guardrail
                </span>
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed">
                {taNhamAlertMessage}
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs">
                <button
                  onClick={handleAutoFix}
                  className="text-amber-300 underline font-semibold hover:text-white"
                >
                  Snap-back về Hữu Nhậm ngay lập tức →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Atelier Grid Layout: Left Canvas | Right Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: INTERACTIVE VISUAL ATELIER CANVAS (7 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className={`relative w-full rounded-m3-xl bg-obsidian-800/90 border border-white/10 p-6 backdrop-blur-organza overflow-hidden flex flex-col items-center justify-between min-h-[520px] transition-all duration-300 ${
            isShakingTaNham ? 'animate-ta-nham-shake ring-4 ring-heritage-son' : ''
          }`}>
            
            {/* Canvas Header & Slot Badges */}
            <div className="w-full flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold tracking-wider text-neutral-400 uppercase">
                  MANNEQUIN ATELIER
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-m3-full bg-white/5 border border-white/10 text-neutral-300">
                  Tương Tác 5 Lớp
                </span>
              </div>

              {/* Closure Etiquette Status Pill */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleClosure(atelierConfig.customClosureOverride === 'HUU_NHAM' ? 'TA_NHAM' : 'HUU_NHAM')}
                  className={`text-xs px-3 py-1 rounded-m3-full font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                    atelierConfig.customClosureOverride === 'HUU_NHAM'
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900'
                      : 'bg-rose-950 text-rose-300 border border-rose-500 hover:bg-rose-900 animate-pulse'
                  }`}
                  title="Nhấn để thử nghiệm quy thức vạt áo"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Vạt: {atelierConfig.customClosureOverride === 'HUU_NHAM' ? 'HỮU NHẬM (Trái phủ Phải)' : 'TẢ NHẬM (Đại Kỵ!)'}</span>
                </button>
              </div>
            </div>

            {/* Visual Silhouette Representation */}
            <div className="relative my-auto w-full max-w-sm aspect-[3/4] flex items-center justify-center py-4">
              
              {/* Layer 1: Base (Trung Đơn / Cổ Lọ) */}
              {atelierConfig.baseItem && (
                <motion.div 
                  layout
                  className="absolute inset-x-12 top-6 h-28 rounded-t-m3-lg bg-neutral-100/90 border border-neutral-300 shadow-md flex flex-col items-center pt-2 z-10"
                  style={{
                    backgroundColor: atelierConfig.baseItem.attributes.color || '#F4F1EA',
                  }}
                >
                  <div className="w-10 h-3 rounded-full border border-neutral-400 bg-white/60 mb-1" />
                  <span className="text-[9px] font-mono text-neutral-600 font-bold uppercase">
                    {atelierConfig.baseItem.name}
                  </span>
                </motion.div>
              )}

              {/* Layer 2: Core Heritage Garment (Áo Ngũ Thân / Nhật Bình / Bà Ba) */}
              <div className="relative w-64 h-80 rounded-m3-lg bg-obsidian-900/90 border border-white/20 p-4 flex flex-col justify-between shadow-2xl z-20 overflow-hidden">
                
                {/* Collar Representation */}
                <div className="relative w-full flex items-center justify-center pt-1 z-30">
                  <div className="px-4 py-1 rounded-m3-sm bg-obsidian-700 border-2 border-heritage-hoang text-heritage-hoang text-[11px] font-mono font-bold shadow-heritage-glow">
                    {atelierConfig.coreItem?.attributes.collarType === 'LAP_LINH' && 'Cổ Lập Lĩnh (Đứng 2-3cm)'}
                    {atelierConfig.coreItem?.attributes.collarType === 'NHAT_BINH_RECT' && 'Cổ Nhật Bình Chữ Nhật'}
                    {atelierConfig.coreItem?.attributes.collarType === 'BA_BA_ROUND' && 'Cổ Tròn Bà Ba'}
                    {atelierConfig.coreItem?.attributes.collarType === 'GIAO_LINH_CROSS' && 'Cổ Giao Lĩnh Vạt Chéo'}
                    {!atelierConfig.coreItem && 'Chưa Chọn Lớp Di Sản'}
                  </div>
                </div>

                {/* Central Seam (Chính Trung) indicator */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 border-r border-dashed border-heritage-hoang/60 pointer-events-none z-20 flex items-center justify-center">
                  <span className="text-[8px] font-mono bg-obsidian-900/90 text-heritage-hoang px-1 py-0.5 rounded rotate-90 whitespace-nowrap">
                    Chính Trung
                  </span>
                </div>

                {/* Lapel Flaps & Closure Physics */}
                <div className="relative w-full h-44 flex items-center justify-center z-25 my-auto">
                  
                  {/* Flap A: Right Flap (Under) */}
                  <div 
                    className="absolute inset-y-0 right-1/2 w-28 rounded-r-m3-md border border-white/10 p-2 flex flex-col justify-between transition-colors duration-300"
                    style={{
                      backgroundColor: atelierConfig.coreItem?.attributes.color || '#1E3A8A',
                      opacity: 0.85,
                    }}
                  >
                    <span className="text-[9px] font-mono text-white/50">Thân Trong</span>
                  </div>

                  {/* Flap B: Left Flap (Overlap = Huu Nham) */}
                  <motion.div 
                    className="absolute inset-y-0 left-1/2 w-32 rounded-l-m3-md border-l-2 border-heritage-hoang p-2 flex flex-col justify-between shadow-xl transition-colors duration-300 cursor-pointer"
                    style={{
                      backgroundColor: atelierConfig.coreItem?.attributes.color || '#1E3A8A',
                      zIndex: atelierConfig.customClosureOverride === 'HUU_NHAM' ? 25 : 10,
                      transform: atelierConfig.customClosureOverride === 'HUU_NHAM' ? 'none' : 'translateX(-50%)',
                    }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleToggleClosure(atelierConfig.customClosureOverride === 'HUU_NHAM' ? 'TA_NHAM' : 'HUU_NHAM')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-amber-200">
                        {atelierConfig.customClosureOverride === 'HUU_NHAM' ? 'Vạt Hữu Nhậm' : 'Vạt Tả Nhậm ✕'}
                      </span>
                    </div>

                    {/* 5 Buttons Column */}
                    <div className="flex flex-col gap-1.5 my-auto pl-1">
                      {Array.from({ length: atelierConfig.customButtonOverride || 5 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full bg-heritage-hoang border border-amber-100 flex items-center justify-center text-[8px] font-bold text-black shadow-sm"
                          title={`Cúc thứ ${idx + 1}`}
                        >
                          {idx + 1}
                        </div>
                      ))}
                    </div>

                    <div className="text-[8px] text-white/70 font-mono">
                      {atelierConfig.coreItem?.attributes.sleeveType === 'TAY_THU' ? 'Tay Thụ (Áo Tấc)' : 'Tay Chẽn'}
                    </div>
                  </motion.div>

                </div>

                {/* Bottom Seam */}
                <div className="relative w-full text-center z-30 pt-1 border-t border-white/10">
                  <span className="text-[10px] font-mono text-neutral-400">
                    {atelierConfig.coreItem?.name || 'Trang phục di sản'}
                  </span>
                </div>
              </div>

              {/* Layer 3: Outer Accent (Bomber / Trench / Cyber Accent) */}
              {atelierConfig.outerItem && (
                <motion.div 
                  layout
                  className="absolute inset-x-4 inset-y-2 rounded-m3-xl border-2 border-cyber-lime/60 pointer-events-none z-35 flex flex-col justify-between p-3"
                  style={{
                    boxShadow: '0 0 25px rgba(204,255,0,0.15), inset 0 0 20px rgba(204,255,0,0.08)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono bg-cyber-lime text-black px-1.5 py-0.5 rounded font-bold">
                      OUTER: {atelierConfig.outerItem.name}
                    </span>
                    <span className="text-[8px] font-mono text-cyber-lime">
                      GEN Z LAYER
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Layer 4: Bottom Wear (Cargo / Đũi / Váy Đụp) */}
              {atelierConfig.bottomItem && (
                <motion.div 
                  layout
                  className="absolute -bottom-8 inset-x-14 h-16 rounded-b-m3-lg bg-obsidian-700 border border-white/20 z-15 flex items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: atelierConfig.bottomItem.attributes.color || '#16181D',
                  }}
                >
                  <span className="text-[9px] font-mono text-neutral-300 font-semibold">
                    {atelierConfig.bottomItem.name}
                  </span>
                </motion.div>
              )}

              {/* Layer 5: Accessory (Khăn Đóng / Nón Quai Thao) */}
              {atelierConfig.accessoryItem && (
                <motion.div 
                  layout
                  className="absolute -top-4 inset-x-20 h-10 rounded-t-m3-full bg-gradient-to-r from-heritage-hoang/80 to-amber-600 border border-amber-200 z-40 flex items-center justify-center shadow-heritage-glow"
                >
                  <span className="text-[9px] font-mono font-bold text-black px-2">
                    {atelierConfig.accessoryItem.name}
                  </span>
                </motion.div>
              )}

            </div>

            {/* Quick Action Bar under Canvas */}
            <div className="w-full flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 z-20">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAutoFix}
                  className="px-3 py-1.5 rounded-m3-md bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Mặc Định Chuẩn Mực
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Save Lookbook Button */}
                <button
                  onClick={handleSaveToLookbook}
                  disabled={!validationResult.isValid || isSaving}
                  className={`px-4 py-2 rounded-m3-full text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    saveSuccess
                      ? 'bg-emerald-600 text-white'
                      : validationResult.isValid
                      ? 'bg-heritage-hoang hover:bg-amber-400 text-black shadow-heritage-glow'
                      : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Đã Lưu Vào Lookbook!
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      Lưu Cấu Hình Di Sản
                    </>
                  )}
                </button>

                {/* Gemini AI Remix Integration */}
                <button
                  onClick={() => onRemixWithAI(
                    atelierConfig.coreItem?.id || 'ao-ngu-than',
                    atelierConfig.outerItem?.id || 'cyber-bomber',
                    `Phối đồ từ Modular Atelier với ${atelierConfig.coreItem?.name || 'Áo Ngũ Thân'}`
                  )}
                  disabled={isRemixingAI}
                  className="px-4 py-2 rounded-m3-full bg-cyber-lime hover:bg-lime-400 text-black text-xs font-bold font-mono transition-all shadow-cyber-glow flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-black" />
                  {isRemixingAI ? 'Đang Tạo Bằng Gemini...' : 'Remix AI Đầy Đủ'}
                </button>
              </div>
            </div>

          </div>

          {/* Quick Slot Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {LAYER_SLOTS.map((slot) => {
              const currentItem = 
                slot.id === 'base' ? atelierConfig.baseItem :
                slot.id === 'core' ? atelierConfig.coreItem :
                slot.id === 'outer' ? atelierConfig.outerItem :
                slot.id === 'bottom' ? atelierConfig.bottomItem :
                atelierConfig.accessoryItem;

              const isSelected = activeSlot === slot.id;

              return (
                <button
                  key={slot.id}
                  onClick={() => setActiveSlot(slot.id)}
                  className={`p-3 rounded-m3-md border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[75px] ${
                    isSelected
                      ? 'bg-obsidian-700 border-heritage-hoang shadow-heritage-glow'
                      : 'bg-obsidian-800/80 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{slot.icon}</span>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      {slot.id}
                    </span>
                  </div>
                  <div className="mt-1">
                    <div className="text-xs font-semibold text-white truncate">
                      {currentItem ? currentItem.name : 'Trống'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LAYER SELECTION DOCK & SARTORIAL CONTROLS (5 cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-obsidian-800/90 rounded-m3-xl border border-white/10 p-5 backdrop-blur-organza flex flex-col space-y-4">
            
            {/* Dock Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-bold font-imperial text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-heritage-hoang" />
                  Hiệu Chỉnh Tầng Phục Trang
                </h3>
                <p className="text-xs text-neutral-400">
                  Đổi trang phục cho tầng <strong className="text-heritage-hoang uppercase">{activeSlot}</strong>
                </p>
              </div>

              {/* Slot Switcher Tabs */}
              <div className="flex gap-1">
                {LAYER_SLOTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSlot(s.id)}
                    className={`w-7 h-7 rounded-m3-sm text-xs flex items-center justify-center transition-colors ${
                      activeSlot === s.id
                        ? 'bg-heritage-hoang text-black font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                    }`}
                    title={s.label}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Items for Active Slot */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {(HERITAGE_CATALOG as any[]).filter((item: any) => item.slot === activeSlot).map((item: any) => {
                const isCurrentActive = 
                  (activeSlot === 'base' && atelierConfig.baseItem?.id === item.id) ||
                  (activeSlot === 'core' && atelierConfig.coreItem?.id === item.id) ||
                  (activeSlot === 'outer' && atelierConfig.outerItem?.id === item.id) ||
                  (activeSlot === 'bottom' && atelierConfig.bottomItem?.id === item.id) ||
                  (activeSlot === 'accessory' && atelierConfig.accessoryItem?.id === item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className={`p-3.5 rounded-m3-md border transition-all cursor-pointer space-y-1.5 ${
                      isCurrentActive
                        ? 'bg-heritage-hoang/10 border-heritage-hoang shadow-heritage-glow'
                        : 'bg-obsidian-700/60 border-white/10 hover:border-white/20 hover:bg-obsidian-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">
                            {item.name}
                          </h4>
                          {item.isModern ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyber-lime/20 text-cyber-lime border border-cyber-lime/40">
                              GEN Z
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-heritage-hoang/20 text-amber-300 border border-heritage-hoang/40">
                              CỔ PHỤC
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex-shrink-0">
                        {isCurrentActive ? (
                          <div className="w-5 h-5 rounded-full bg-heritage-hoang text-black flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center hover:border-heritage-hoang" />
                        )}
                      </div>
                    </div>

                    {/* Cultural Attribute Badge */}
                    {item.culturalNote && (
                      <div className="text-[10px] text-amber-200/90 font-mono bg-amber-950/40 px-2 py-1 rounded border border-amber-900/40">
                        📜 {item.culturalNote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sartorial Etiquette Adjusters (Khuy Cúc & Quy Thức Vạt) */}
            <div className="p-4 rounded-m3-lg bg-obsidian-900/80 border border-white/10 space-y-3">
              <div className="text-xs font-bold font-imperial text-neutral-200 uppercase tracking-wider flex items-center justify-between">
                <span>Quy Thức Vạt & Số Hạt Cúc</span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {atelierConfig.customClosureOverride === 'HUU_NHAM' ? '✓ Hữu Nhậm' : '✕ Tả Nhậm'}
                </span>
              </div>

              {/* Closure Radio Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleClosure('HUU_NHAM')}
                  className={`p-2 rounded-m3-md border text-xs font-mono text-center transition-all cursor-pointer ${
                    atelierConfig.customClosureOverride === 'HUU_NHAM'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                  }`}
                >
                  HỮU NHẬM (Chuẩn)
                  <span className="block text-[9px] font-normal text-neutral-400">Trái phủ phải (Sự sống)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleClosure('TA_NHAM')}
                  className={`p-2 rounded-m3-md border text-xs font-mono text-center transition-all cursor-pointer ${
                    atelierConfig.customClosureOverride === 'TA_NHAM'
                      ? 'bg-rose-950 border-rose-500 text-rose-300 font-bold animate-pulse'
                      : 'bg-white/5 border-white/10 text-neutral-400 hover:border-rose-500/50'
                  }`}
                >
                  TẢ NHẬM (Thử Nghiệm)
                  <span className="block text-[9px] font-normal text-rose-400">Đại kỵ tang ma (Liệm tử)</span>
                </button>
              </div>

              {/* Button Count Slider (Ngũ Luân = 5 Cúc) */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-400">Số lượng khuy cúc:</span>
                  <span className={`font-bold ${
                    atelierConfig.customButtonOverride === 5 ? 'text-heritage-hoang' : 'text-rose-400'
                  }`}>
                    {atelierConfig.customButtonOverride} Cúc {atelierConfig.customButtonOverride === 5 ? '(Chuẩn Ngũ Thường)' : '(Lệch chuẩn)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="1"
                  value={atelierConfig.customButtonOverride || 5}
                  onChange={(e) => setAtelierConfig(prev => ({ ...prev, customButtonOverride: Number(e.target.value) }))}
                  className="w-full accent-heritage-hoang cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                  <span>1 cúc</span>
                  <span className="text-heritage-hoang font-bold">5 cúc (Chuẩn)</span>
                  <span>7 cúc</span>
                </div>
              </div>

            </div>

            {/* Quick Access to Persisted Lookbooks Drawer */}
            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={onOpenLookbooks}
                className="text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-heritage-hoang" />
                <span>Xem Bộ Sưu Tập Đã Lưu ({savedLookbooksCount})</span>
              </button>

              <button
                onClick={onOpenGuide}
                className="text-xs font-mono text-amber-300 hover:text-amber-200 flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Quy thức Hữu Nhậm</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
