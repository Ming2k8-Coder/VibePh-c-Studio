'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  CloudSun,
  Palette,
  ArrowRight,
  ShieldCheck,
  Check,
  Compass,
  Layers,
  Thermometer,
  Wind
} from 'lucide-react';
import { Occasion } from '../../types/vibephuc';

export type AestheticStyle =
  | 'THUAN_CO_DIEN'
  | 'STREETWEAR_PHA_CACH'
  | 'TOI_GIAN_HOC_DUONG';

export interface PreSelection {
  occasion: Occasion | string;
  aesthetic: AestheticStyle;
}

export interface HeroStartScreenProps {
  onTransitionComplete?: (selection: PreSelection) => void;
  initialOccasion?: Occasion | string;
  initialAesthetic?: AestheticStyle;
}

interface OccasionOption {
  id: Occasion | string;
  name: string;
  tagline: string;
  badge: string;
  iconAccent: string;
}

interface AestheticOption {
  id: AestheticStyle;
  name: string;
  description: string;
  colorHex: string;
  tag: string;
}

const OCCASIONS: OccasionOption[] = [
  {
    id: 'KY_YEU',
    name: 'Kỷ Yếu Tốt Nghiệp',
    tagline: 'Áo dài raglan nữ sinh & Ngũ thân tay chẽn thanh xuân',
    badge: 'Phổ biến nhất',
    iconAccent: 'from-amber-400 to-yellow-600'
  },
  {
    id: 'TET',
    name: 'Tết & Du Xuân',
    tagline: 'Sắc đỏ son chu sa & Hoàng thổ nghinh tân phát tài',
    badge: 'Đại lễ',
    iconAccent: 'from-red-500 to-amber-500'
  },
  {
    id: 'PROM',
    name: 'Dạ Hội & Prom Night',
    tagline: 'Áo Nhật Bình quyền quý hoặc Áo Tấc kiêu sa lộng lẫy',
    badge: 'Vương giả',
    iconAccent: 'from-purple-500 to-pink-500'
  },
  {
    id: 'STREETWEAR',
    name: 'Dạo Phố Cuối Tuần',
    tagline: 'Áo Bà Ba hoặc Tay Chẽn phối Cyber Organza & Sneaker',
    badge: 'Gen Z Trend',
    iconAccent: 'from-emerald-400 to-cyan-400'
  },
  {
    id: 'LE_HOI_TRUONG',
    name: 'Lễ Hội Di Sản',
    tagline: 'Áo Tứ Thân Quan họ Kinh Bắc kết hợp nón quai thao',
    badge: 'Dân gian',
    iconAccent: 'from-amber-500 to-emerald-500'
  },
  {
    id: 'DAM_CUOI',
    name: 'Hôn Lễ Cổ Truyền',
    tagline: 'Đại lễ phục Áo Tấc thêu chỉ vàng chỉ bạc trang trọng',
    badge: 'Trang nghiêm',
    iconAccent: 'from-rose-600 to-amber-500'
  }
];

const AESTHETICS: AestheticOption[] = [
  {
    id: 'THUAN_CO_DIEN',
    name: 'Thuần Cổ Điển',
    description: 'Bảo toàn 100% quy thức triều Nguyễn, Hữu Nhậm, sống lưng Chính Trung & Ngũ luân cúc ngọc.',
    colorHex: '#D69E2E',
    tag: 'Hoàng Triều'
  },
  {
    id: 'STREETWEAR_PHA_CACH',
    name: 'Streetwear Phá Cách',
    description: 'Phối ngẫu táo bạo cùng áo khoác Cyber Organza xuyên thấu, Chunky Sneaker & Parachute Cargo.',
    colorHex: '#CCFF00',
    tag: 'Cyber Neo-Heritage'
  },
  {
    id: 'TOI_GIAN_HOC_DUONG',
    name: 'Tối Giản Học Đường',
    description: 'Chất liệu lụa tơ tằm Bảo Lộc và đũi Nam Cao mộc mạc, nhẹ nhõm, thanh khiết trong trẻo.',
    colorHex: '#00F5D4',
    tag: 'Thanh Xuân'
  }
];

export const HeroStartScreen: React.FC<HeroStartScreenProps> = ({
  onTransitionComplete,
  initialOccasion = 'KY_YEU',
  initialAesthetic = 'STREETWEAR_PHA_CACH'
}) => {
  const shouldReduceMotion = useReducedMotion();

  // User pre-selections
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | string>(initialOccasion);
  const [selectedAesthetic, setSelectedAesthetic] = useState<AestheticStyle>(initialAesthetic);

  // Transition orchestrator state
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionPhase, setTransitionPhase] = useState<'IDLE' | 'BURST' | 'HALFTONE_FLASH' | 'SPLIT' | 'DONE'>('IDLE');
  const [clickOrigin, setClickOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const startButtonRef = useRef<HTMLButtonElement | null>(null);

  // Trigger the M3E Halftone Transition sequence
  const handleStartTransition = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const originX = e.clientX || rect.left + rect.width / 2;
      const originY = e.clientY || rect.top + rect.height / 2;

      setClickOrigin({ x: originX, y: originY });
      setIsTransitioning(true);

      // Accessibility fast-path
      if (shouldReduceMotion) {
        setTimeout(() => {
          onTransitionComplete?.({
            occasion: selectedOccasion,
            aesthetic: selectedAesthetic
          });
        }, 350);
        return;
      }

      // Step 1 & 2: Radial burst initiates
      setTransitionPhase('BURST');

      // Step 3: Halftone matrix flash
      setTimeout(() => {
        setTransitionPhase('HALFTONE_FLASH');
      }, 350);

      // Step 4: Split curtain reveals Atelier
      setTimeout(() => {
        setTransitionPhase('SPLIT');
      }, 750);

      // Completion callback
      setTimeout(() => {
        setTransitionPhase('DONE');
        onTransitionComplete?.({
          occasion: selectedOccasion,
          aesthetic: selectedAesthetic
        });
      }, 1350);
    },
    [onTransitionComplete, selectedAesthetic, selectedOccasion, shouldReduceMotion]
  );

  return (
    <div className="relative h-screen w-full overflow-hidden bg-obsidian-900 text-[#E3E2E6] select-none font-sans flex flex-col justify-between">
      {/* Background Lacquer Texture & Subtle Halftone Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-halftone-dot" />

      {/* Atmospheric Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-heritage-son/15 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-heritage-hoang/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyber-lime/5 blur-[140px] pointer-events-none" />

      {/* ==================================================================== */}
      {/* HEADER SECTION: Branding & Simulated Weather Station                */}
      {/* ==================================================================== */}
      <header className="relative z-10 w-full px-6 py-5 md:px-12 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        {/* Brand Stamp */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-m3-sm bg-gradient-to-br from-heritage-son via-heritage-hoang to-cyber-lime p-[1.5px] shadow-heritage-glow">
            <div className="w-full h-full bg-obsidian-900 rounded-[7px] flex items-center justify-center">
              <span className="font-imperial font-black text-heritage-hoang text-lg tracking-wider">VP</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-imperial font-bold tracking-wider text-white text-base md:text-lg">
                VIBEPHỤC STUDIO
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-mono font-bold tracking-widest rounded-full bg-cyber-lime/10 text-cyber-lime border border-cyber-lime/30">
                PROD v2.6
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">
              Haute Heritage Mannequin Atelier & Occasion Engine
            </p>
          </div>
        </div>

        {/* Realtime Simulated Weather Widget */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-organza shadow-sm">
          <div className="flex items-center gap-1.5 text-cyber-jade text-xs font-mono">
            <CloudSun className="w-4 h-4 text-heritage-hoang animate-pulse" />
            <span className="font-bold text-white">Hà Nội, 22°C</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-1 text-[11px] text-gray-300">
            <Wind className="w-3.5 h-3.5 text-cyber-lime" />
            <span>Thu se lạnh · Gió nhẹ</span>
          </div>
          <span className="hidden md:inline text-[10px] text-heritage-hoang font-mono bg-heritage-hoang/10 px-2 py-0.5 rounded-full border border-heritage-hoang/20">
            Gợi ý: Lót trung đơn
          </span>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN VIEWPORT: Hero Headline & Rapid Pre-Selectors                  */}
      {/* ==================================================================== */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 md:px-12 py-6 flex flex-col justify-center gap-8 overflow-y-auto">
        {/* Hero Title & Ethos */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-heritage-son/10 border border-heritage-son/30 text-heritage-son text-xs font-mono font-semibold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KỶ NGUYÊN MỚI CỦA CỔ PHỤC VIỆT</span>
          </div>
          <h1 className="font-imperial text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Sắc Lụa Triều Nguyễn <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-heritage-hoang via-cyber-lime to-cyber-jade bg-clip-text text-transparent">
              Chạm Nhịp Thở Streetwear
            </span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Thiết kế cổ phục chuẩn quy thức lịch sử từ triều Nguyễn, Tiền triều đến tân thời. Thử đồ trực quan trên ma-nơ-canh 2D với bảo chứng kiểm duyệt văn hóa thời gian thực.
          </p>
        </div>

        {/* Interactive Pre-Selectors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
          {/* 1. Occasion Selector (7 cols) */}
          <div className="lg:col-span-7 bg-obsidian-800/60 p-5 rounded-m3-lg border border-white/10 backdrop-blur-organza shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-heritage-hoang" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-gray-300">
                  1. CHỌN DỊP MẶC (OCCASION)
                </span>
              </div>
              <span className="text-[11px] font-mono text-gray-400">
                Đã chọn: <strong className="text-heritage-hoang">{OCCASIONS.find(o => o.id === selectedOccasion)?.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {OCCASIONS.map(occ => {
                const isSelected = selectedOccasion === occ.id;
                return (
                  <button
                    key={occ.id}
                    type="button"
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`relative text-left p-3 rounded-m3-md transition-all duration-200 border transform-gpu ${
                      isSelected
                        ? 'bg-heritage-hoang/15 border-heritage-hoang text-white shadow-heritage-glow scale-[1.02]'
                        : 'bg-obsidian-900/50 border-white/5 text-gray-300 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-imperial font-bold text-sm text-white">
                        {occ.name}
                      </span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-heritage-hoang text-obsidian-900 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-gray-400 px-1.5 py-0.5 rounded bg-white/5">
                          {occ.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-1 leading-snug">
                      {occ.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Aesthetic Style Selector (5 cols) */}
          <div className="lg:col-span-5 bg-obsidian-800/60 p-5 rounded-m3-lg border border-white/10 backdrop-blur-organza shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyber-lime" />
                <span className="text-xs font-mono font-bold tracking-wider uppercase text-gray-300">
                  2. PHONG CÁCH ĐỊNH HƯỚNG
                </span>
              </div>
              <span className="text-[11px] font-mono text-gray-400">3 Thẩm Mỹ</span>
            </div>

            <div className="space-y-2.5">
              {AESTHETICS.map(aes => {
                const isSelected = selectedAesthetic === aes.id;
                return (
                  <button
                    key={aes.id}
                    type="button"
                    onClick={() => setSelectedAesthetic(aes.id)}
                    className={`w-full text-left p-3.5 rounded-m3-md transition-all duration-200 border transform-gpu ${
                      isSelected
                        ? 'bg-cyber-lime/10 border-cyber-lime text-white shadow-cyber-glow'
                        : 'bg-obsidian-900/50 border-white/5 text-gray-300 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: aes.colorHex }}
                        />
                        <span className="font-bold text-sm text-white">
                          {aes.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-white/10 text-gray-200">
                        {aes.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {aes.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Central Launchpad CTA */}
        <div className="flex flex-col items-center justify-center pt-2">
          <motion.button
            ref={startButtonRef}
            type="button"
            onClick={handleStartTransition}
            disabled={isTransitioning}
            whileHover={shouldReduceMotion ? {} : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
            className="group relative px-10 py-5 rounded-m3-lg font-imperial font-bold text-lg md:text-xl tracking-wider text-obsidian-900 bg-gradient-to-r from-heritage-hoang via-cyber-lime to-heritage-hoang bg-[length:200%_auto] shadow-heritage-glow hover:shadow-cyber-glow transition-all duration-300 flex items-center gap-3 overflow-hidden cursor-pointer transform-gpu will-change-transform"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />

            <Sparkles className="w-5 h-5 text-obsidian-900 transition-transform group-hover:rotate-12 duration-300" />
            <span className="uppercase tracking-widest font-black">
              BẮT ĐẦU PHỐI ĐỒ (START)
            </span>
            <ArrowRight className="w-5 h-5 text-obsidian-900 transition-transform group-hover:translate-x-1 duration-300" />
          </motion.button>

          <p className="text-[11px] font-mono text-gray-400 mt-3 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyber-jade" />
            <span>Kèm bộ bảo chứng văn hóa: Chống Tả Nhậm · Đoan trang hạ y · Sống lưng Chính Trung</span>
          </p>
        </div>
      </main>

      {/* FOOTER METADATA BAR */}
      <footer className="relative z-10 px-6 py-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
        <span>VibePhục Heritage Studio — Nền Tảng Di Sản Số</span>
        <span className="hidden sm:inline">Phím tắt: [ESC] Thoát · [M] Thu nhỏ chuyển động</span>
      </footer>

      {/* ==================================================================== */}
      {/* M3E HALFTONE TRANSITION OVERLAY ENGINE                               */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isTransitioning && (
          <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
            {/* REDUCED MOTION SIMPLE CROSS-FADE */}
            {shouldReduceMotion ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full bg-obsidian-900 flex items-center justify-center"
              >
                <div className="text-center font-imperial text-heritage-hoang text-xl font-bold tracking-widest">
                  ĐANG KHỞI TẠO ATELIER...
                </div>
              </motion.div>
            ) : (
              <>
                {/* STEP 1: Deep Backdrop Blur */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 backdrop-blur-3xl bg-obsidian-900/60"
                />

                {/* STEP 2: Radial Burst of Red Son & Yellow Hoang from click coordinates */}
                <motion.div
                  initial={{
                    scale: 0,
                    opacity: 0.9,
                    x: clickOrigin.x,
                    y: clickOrigin.y
                  }}
                  animate={{
                    scale: 40,
                    opacity: 1
                  }}
                  transition={{
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '60px',
                    height: '60px',
                    marginLeft: '-30px',
                    marginTop: '-30px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #C53030 0%, #D69E2E 40%, #0E0F12 85%)',
                    transformOrigin: 'center center'
                  }}
                  className="transform-gpu will-change-transform shadow-[0_0_80px_rgba(214,158,46,0.8)]"
                />

                {/* STEP 3: Halftone Dot Matrix Flash Layer (Woodblock print simulation) */}
                {(transitionPhase === 'HALFTONE_FLASH' || transitionPhase === 'SPLIT') && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{
                      opacity: [0, 0.95, 0],
                      scale: [1.05, 1, 0.98]
                    }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut'
                    }}
                    className="absolute inset-0 bg-halftone-dot bg-repeat transform-gpu will-change-transform z-20 pointer-events-none mix-blend-overlay"
                    style={{
                      color: '#CCFF00',
                      backgroundColor: 'rgba(14, 15, 18, 0.4)'
                    }}
                  />
                )}

                {/* STEP 4: Split Curtain Sliding Apart to Reveal the Atelier */}
                {transitionPhase === 'SPLIT' && (
                  <>
                    {/* Left Curtain */}
                    <motion.div
                      initial={{ x: '0%' }}
                      animate={{ x: '-100%' }}
                      transition={{
                        duration: 0.55,
                        ease: [0.85, 0, 0.15, 1]
                      }}
                      className="absolute top-0 left-0 w-1/2 h-full bg-obsidian-900 border-r border-heritage-hoang/40 shadow-2xl z-30 transform-gpu will-change-transform flex items-center justify-end pr-8"
                    >
                      <span className="font-imperial font-black text-6xl text-heritage-hoang/20 select-none">
                        VIBE
                      </span>
                    </motion.div>

                    {/* Right Curtain */}
                    <motion.div
                      initial={{ x: '0%' }}
                      animate={{ x: '100%' }}
                      transition={{
                        duration: 0.55,
                        ease: [0.85, 0, 0.15, 1]
                      }}
                      className="absolute top-0 right-0 w-1/2 h-full bg-obsidian-900 border-l border-heritage-hoang/40 shadow-2xl z-30 transform-gpu will-change-transform flex items-center justify-start pl-8"
                    >
                      <span className="font-imperial font-black text-6xl text-cyber-lime/20 select-none">
                        PHỤC
                      </span>
                    </motion.div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HeroStartScreen;
