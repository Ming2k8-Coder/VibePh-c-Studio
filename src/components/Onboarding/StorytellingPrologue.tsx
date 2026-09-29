import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronRight, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ArrowDown, 
  ShieldCheck, 
  Check, 
  Compass,
  Play
} from 'lucide-react';

interface StorytellingPrologueProps {
  onComplete: () => void;
  onSkip: () => void;
}

const FIVE_VIRTUES = [
  { name: 'Nhân', meaning: 'Lòng nhân ái, bác ái, yêu thương con người', symbol: '仁' },
  { name: 'Lễ', meaning: 'Sự cung kính, chuẩn mực lễ nghi, tôn ti trật tự', symbol: '禮' },
  { name: 'Nghĩa', meaning: 'Lẽ phải, chính trực, trách nhiệm với cộng đồng', symbol: '義' },
  { name: 'Trí', meaning: 'Sự sáng suốt, thấu hiểu quy luật trời đất', symbol: '智' },
  { name: 'Tín', meaning: 'Lời hứa son sắt, đức tin và sự thành thực', symbol: '信' },
];

export const StorytellingPrologue: React.FC<StorytellingPrologueProps> = ({ onComplete, onSkip }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  // Scroll tracking across the 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth transforms based on scroll
  const seamDrawLength = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const leftFlapX = useTransform(scrollYProgress, [0.35, 0.65], ['-120%', '0%']);
  const rightFlapX = useTransform(scrollYProgress, [0.35, 0.65], ['120%', '0%']);
  const lapelOverlapZ = useTransform(scrollYProgress, [0.45, 0.65], [10, 30]); // Left over right
  const cyberGlowOpacity = useTransform(scrollYProgress, [0.7, 0.95], [0, 1]);
  const streetOverlayScale = useTransform(scrollYProgress, [0.75, 1], [0.95, 1]);

  // Audio synthesize chime
  const playChime = (freq = 440) => {
    if (!isAudioEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // AudioContext muted/unsupported
    }
  };

  // Sync scroll progress to active step
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v < 0.35) {
        if (activeStep !== 0) {
          setActiveStep(0);
          playChime(329.63); // E4
        }
      } else if (v < 0.70) {
        if (activeStep !== 1) {
          setActiveStep(1);
          playChime(440); // A4
        }
      } else {
        if (activeStep !== 2) {
          setActiveStep(2);
          playChime(554.37); // C#5
        }
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeStep, isAudioEnabled]);

  const scrollToPhase = (targetProgress: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const scrollHeight = container.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: container.offsetTop + scrollHeight * targetProgress,
      behavior: 'smooth',
    });
  };

  return (
    <div ref={containerRef} className="relative min-h-[320vh] bg-obsidian-900 text-white selection:bg-heritage-hoang selection:text-black">
      {/* Sticky Top Interactive HUD */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-organza bg-obsidian-900/80 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-heritage-hoang/20 border border-heritage-hoang/40 flex items-center justify-center text-heritage-hoang font-serif font-bold text-sm">
            VP
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider uppercase text-white font-imperial">
              Khởi Nguyên Di Sản
            </h1>
            <p className="text-xs text-neutral-400">
              Scrollytelling Prologue • Quy thức Cổ phục x Streetwear
            </p>
          </div>
        </div>

        {/* Phase Pill Indicators */}
        <div className="hidden md:flex items-center gap-2 bg-obsidian-800/80 px-3 py-1.5 rounded-m3-full border border-white/10">
          {[
            { id: 0, label: 'Hồi I: Sống Lưng Chính Trung', p: 0.15 },
            { id: 1, label: 'Hồi II: Quy Thức Hữu Nhậm', p: 0.50 },
            { id: 2, label: 'Hồi III: Hơi Thở Gen Z', p: 0.85 },
          ].map((phase) => (
            <button
              key={phase.id}
              onClick={() => scrollToPhase(phase.p)}
              className={`text-xs px-3 py-1 rounded-m3-full transition-all duration-300 ${
                activeStep === phase.id
                  ? 'bg-heritage-hoang text-black font-semibold shadow-heritage-glow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {phase.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            title={isAudioEnabled ? 'Tắt âm thanh trải nghiệm' : 'Bật âm thanh'}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-heritage-hoang" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={onSkip}
            className="text-xs px-4 py-2 rounded-m3-full border border-white/20 bg-white/5 hover:bg-white/10 text-neutral-200 transition-all font-medium flex items-center gap-1.5"
          >
            Bỏ qua mở đầu
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Sticky Visual Canvas (Viewport-Locked) */}
      <div className="sticky top-20 h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden px-4">
        {/* Background Ambient Aura */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
          <motion.div 
            className="w-[500px] h-[500px] rounded-full blur-[140px]"
            animate={{
              background: activeStep === 0 
                ? 'radial-gradient(circle, rgba(214,158,46,0.3) 0%, transparent 70%)'
                : activeStep === 1
                ? 'radial-gradient(circle, rgba(197,48,48,0.35) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(204,255,0,0.3) 0%, transparent 70%)',
            }}
            transition={{ duration: 1 }}
          />
        </div>

        {/* ========================================================================= */}
        {/* 3D GARMENT ARTIFACT CANVAS */}
        {/* ========================================================================= */}
        <div className="relative w-full max-w-lg aspect-[4/5] flex items-center justify-center">
          {/* SVG Frame for Thread & Garment Architecture */}
          <div className="relative w-72 md:w-80 h-96 md:h-[420px] rounded-m3-lg bg-obsidian-800/60 border border-white/10 backdrop-blur-organza flex flex-col items-center justify-center p-6 shadow-2xl overflow-hidden">
            
            {/* HỒI 1: ĐƯỜNG CHÍNH TRUNG (Vẽ sợi chỉ vàng) */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-20"
              viewBox="0 0 320 420"
            >
              {/* Back seam background guideline */}
              <line 
                x1="160" 
                y1="30" 
                x2="160" 
                y2="390" 
                stroke="rgba(255,255,255,0.06)" 
                strokeWidth="1" 
                strokeDasharray="4 4"
              />
              {/* Animated Gold Central Seam */}
              <motion.line
                x1="160"
                y1="40"
                x2="160"
                y2="380"
                stroke="#D69E2E"
                strokeWidth="3.5"
                strokeLinecap="round"
                style={{
                  pathLength: shouldReduceMotion ? 1 : seamDrawLength,
                  filter: 'drop-shadow(0 0 8px rgba(214,158,46,0.8))',
                }}
              />
            </svg>

            {/* HỒI 2: CÁNH VẢI 3D GẬP HỮU NHẬM (Left over Right) */}
            <div className="relative w-full h-full flex items-center justify-center z-10">
              
              {/* VẠT PHẢI (Nằm dưới - Right Flap) */}
              <motion.div
                className="absolute top-12 bottom-12 right-1/2 w-32 rounded-r-m3-md bg-gradient-to-l from-heritage-cham/80 to-obsidian-900 border-r border-heritage-hoang/30 p-3 flex flex-col justify-between"
                style={{
                  x: shouldReduceMotion ? '0%' : rightFlapX,
                  zIndex: 10,
                  boxShadow: 'inset 0 0 20px rgba(30,58,138,0.5)',
                }}
              >
                <div className="text-[10px] uppercase font-mono text-heritage-hoang/60 tracking-wider">
                  Vạt Trong
                </div>
                <div className="text-[9px] text-neutral-400">
                  Tiền thiềm lót bên phải
                </div>
              </motion.div>

              {/* VẠT TRÁI (Phủ lên trên - Left Over Right = HỮU NHẬM) */}
              <motion.div
                className="absolute top-8 bottom-8 left-1/2 w-36 rounded-l-m3-md bg-gradient-to-r from-heritage-son/90 to-heritage-son/60 border-l-2 border-heritage-hoang p-3 flex flex-col justify-between"
                style={{
                  x: shouldReduceMotion ? '0%' : leftFlapX,
                  zIndex: lapelOverlapZ,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(197,48,48,0.4)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-white font-bold tracking-wider">
                    Vạt Trái Phủ
                  </span>
                  <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-heritage-hoang font-mono font-bold">
                    Hữu Nhậm
                  </span>
                </div>

                {/* 5 Hạt Nút Ngũ Thường (Chỉ hiện rõ khi vạt khép ở Hồi 2) */}
                <div className="flex flex-col gap-2.5 my-auto pl-1">
                  {FIVE_VIRTUES.map((virtue, idx) => (
                    <motion.div
                      key={virtue.name}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: activeStep >= 1 ? 1 : 0,
                        opacity: activeStep >= 1 ? 1 : 0,
                      }}
                      transition={{
                        delay: shouldReduceMotion ? 0 : 0.15 + idx * 0.1,
                        type: 'spring',
                        stiffness: 500,
                      }}
                      className="group relative flex items-center gap-2 cursor-help"
                    >
                      <div className="w-5 h-5 rounded-full bg-heritage-hoang border border-amber-200 flex items-center justify-center text-[10px] font-bold text-black shadow-heritage-glow">
                        {virtue.symbol}
                      </div>
                      <div className="text-[11px] font-semibold text-amber-100 group-hover:text-cyber-lime transition-colors">
                        {virtue.name}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="text-[9px] text-neutral-300/80 italic">
                  5 cúc Ngũ Luân & Ngũ Thường
                </div>
              </motion.div>

              {/* HỒI 3: CYBER GEN Z OVERLAY (Viền neon Cyber Lime & Streetwear Tags) */}
              <motion.div
                className="absolute inset-2 rounded-m3-md border-2 border-cyber-lime/90 pointer-events-none z-40 p-4 flex flex-col justify-between"
                style={{
                  opacity: cyberGlowOpacity,
                  scale: streetOverlayScale,
                  boxShadow: '0 0 35px rgba(204,255,0,0.3), inset 0 0 25px rgba(204,255,0,0.15)',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-cyber-lime text-black px-2 py-0.5 rounded">
                    STREETWEAR REMIX
                  </span>
                  <span className="text-xs font-mono text-cyber-lime animate-pulse">
                    ● 2026 EDITION
                  </span>
                </div>

                <div className="space-y-1.5 bg-black/75 backdrop-blur-md p-3 rounded border border-cyber-lime/40">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyber-lime" />
                    Áo Ngũ Thân x Parachute Cargo
                  </div>
                  <p className="text-[11px] text-neutral-300">
                    Phom dáng cổ phục lập lĩnh 100% chuẩn Hữu Nhậm, phối cùng chất liệu chống thấm công nghệ cao và quai đeo utility.
                  </p>
                </div>

                <div className="text-[10px] font-mono text-cyber-lime/80 text-right">
                  HERITAGE INTEGRITY: 100%
                </div>
              </motion.div>

            </div>

            {/* Bottom Status Tag */}
            <div className="relative z-30 mt-3 w-full flex items-center justify-between text-[11px] text-neutral-400 font-mono border-t border-white/10 pt-2">
              <span>TRẠNG THÁI</span>
              <span className={`font-semibold ${
                activeStep === 0 ? 'text-heritage-hoang' : activeStep === 1 ? 'text-heritage-son' : 'text-cyber-lime'
              }`}>
                {activeStep === 0 && 'Khai Đường Chính Trung'}
                {activeStep === 1 && 'Khép Vạt Hữu Nhậm Chuẩn'}
                {activeStep === 2 && 'Hòa Sắc Gen Z Streetwear'}
              </span>
            </div>
          </div>
        </div>

        {/* Narrative Captions & Progression Card */}
        <div className="w-full max-w-xl mt-4 px-4 text-center z-30">
          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-2 bg-obsidian-800/80 backdrop-blur-organza p-4 rounded-m3-lg border border-heritage-hoang/30"
              >
                <div className="inline-flex items-center gap-1.5 text-xs text-heritage-hoang font-mono font-bold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5" />
                  HỒI 1: ĐƯỜNG MAY CHÍNH TRUNG
                </div>
                <h2 className="text-lg md:text-xl font-bold font-imperial text-amber-100">
                  Tâm Tính Ngay Thẳng Giữa Đất Trời
                </h2>
                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed max-w-md mx-auto">
                  Hai thân sau của chiếc áo ngũ thân được ghép lại bằng một đường may sống lưng thẳng tắp gọi là <strong className="text-heritage-hoang">Chính Trung</strong>, tượng trưng cho sự chính trực, đoan chính và tấm lòng quang minh của người mặc.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-neutral-400 animate-bounce">
                  <span>Cuộn chuột xuống để tiếp tục</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-2 bg-obsidian-800/80 backdrop-blur-organza p-4 rounded-m3-lg border border-heritage-son/40"
              >
                <div className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-mono font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  HỒI 2: ĐỊNH CHẾ HỮU NHẬM & 5 CÚC NGŨ THƯỜNG
                </div>
                <h2 className="text-lg md:text-xl font-bold font-imperial text-rose-100">
                  Vạt Trái Phủ Phải — Quy Ước Sự Sống
                </h2>
                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed max-w-md mx-auto">
                  Vạt trái bắt buộc phủ lên vạt phải (<strong className="text-amber-300">Hữu Nhậm</strong>), cài bằng đúng 5 hạt cúc tượng trưng cho <strong className="text-amber-300">Nhân - Lễ - Nghĩa - Trí - Tín</strong>. Cài vạt ngược lại (<strong className="text-rose-400">Tả Nhậm</strong>) là đại kỵ vì vốn chỉ dành cho nghi thức liệm tang ma.
                </p>
                <div className="pt-2 flex items-center justify-center gap-2 text-xs text-neutral-400">
                  <span>Cuộn tiếp để bước vào không gian đương đại</span>
                  <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                </div>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-3 bg-obsidian-800/90 backdrop-blur-organza p-5 rounded-m3-lg border border-cyber-lime/40 shadow-cyber-glow"
              >
                <div className="inline-flex items-center gap-1.5 text-xs text-cyber-lime font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  HỒI 3: THỜI TRANG ĐƯƠNG ĐẠI
                </div>
                <h2 className="text-xl md:text-2xl font-bold font-imperial text-white">
                  Di Sản Sống Trên Từng Bước Chân
                </h2>
                <p className="text-xs md:text-sm text-neutral-300 leading-relaxed max-w-md mx-auto">
                  Cổ phục không phải là hiện vật bảo tàng ngủ yên. Giữ vững linh hồn quy thức cổ truyền, tự do phối ngẫu cùng phong cách Streetwear thế hệ mới.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={onComplete}
                    className="px-6 py-2.5 rounded-m3-full bg-cyber-lime hover:bg-lime-400 text-black font-bold text-sm tracking-wide transition-all shadow-cyber-glow hover:scale-105 flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    Vào Atelier Phối Đồ Ngay
                  </button>
                  <button
                    onClick={() => scrollToPhase(0)}
                    className="p-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors"
                    title="Xem lại từ đầu"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
