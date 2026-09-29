import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Layers,
  Sparkles,
  BookOpen,
  BookmarkCheck,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ChevronDown,
  ArrowDown,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Maximize2,
  Minimize2,
  Flame,
  Check,
  Info,
  Sliders
} from 'lucide-react';
import {
  HeroHeritageIllustration,
  NguThanArtwork,
  NhatBinhArtwork,
  AoTacArtwork,
  TuThanArtwork,
  BaBaArtwork,
  FiveElementsWheelAsset,
  HuuNhamComparisonAsset
} from '../Assets/HeritageIllustrations';

interface OnboardingPageProps {
  onNavigate: (route: 'atelier' | 'ai-studio' | 'rules' | 'lookbooks') => void;
}

const FIVE_VIRTUES = [
  { name: 'Nhân', symbol: '仁', meaning: 'Lòng nhân ái, bác ái, trân quý sinh mệnh', element: 'Mộc', color: '#16A34A' },
  { name: 'Lễ', symbol: '禮', meaning: 'Kính cẩn, phép tắc, tôn ti trật tự xã hội', element: 'Hỏa', color: '#DC2626' },
  { name: 'Nghĩa', symbol: '義', meaning: 'Chính trực, phụng sự lẽ phải, trung nghĩa', element: 'Kim', color: '#F8FAFC' },
  { name: 'Trí', symbol: '智', meaning: 'Sự sáng suốt, thấu triệt quy luật tự nhiên', element: 'Thủy', color: '#0284C7' },
  { name: 'Tín', symbol: '信', meaning: 'Chữ tín son sắt, danh dự người mặc', element: 'Thổ', color: '#EAB308' },
];

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollySectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // State Management
  const [showCurtainIntro, setShowCurtainIntro] = useState<boolean>(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Scroll tracking on the scrollytelling container (420vh for generous cinematic pacing)
  const { scrollYProgress } = useScroll({
    target: scrollySectionRef,
    offset: ['start start', 'end end'],
  });

  // Global window scroll progress for top progress bar
  const { scrollYProgress: globalScrollProgress } = useScroll();

  // =========================================================================
  // HOOK DEFINITIONS AT TOP LEVEL (STRICT HOOK RULES ENFORCED - ZERO CONDITIONAL CALLS)
  // =========================================================================

  // Chapter 1: Sống Lưng Chính Trung (0.02 -> 0.30)
  const panelSpread = useTransform(scrollYProgress, [0.03, 0.28], ['160px', '0px']);
  const negativePanelSpread = useTransform(panelSpread, (v) => `-${v}`);
  const seamHeight = useTransform(scrollYProgress, [0.06, 0.30], ['0%', '100%']);
  const seamGlow = useTransform(scrollYProgress, [0.15, 0.30], [0.1, 1]);
  const chap1Opacity = useTransform(scrollYProgress, [0.0, 0.26, 0.33], [1, 1, 0]);

  // Transition Curtain Eclipse between Chap 1 and Chap 2 (0.31 -> 0.36)
  const eclipse1To2 = useTransform(scrollYProgress, [0.29, 0.32, 0.35], [0, 0.95, 0]);

  // Chapter 2: Quy Thức Hữu Nhậm & 5 Cúc Ngũ Thường (0.34 -> 0.66)
  const flapSwoopX = useTransform(scrollYProgress, [0.34, 0.49], ['-220px', '0px']);
  const flapRotateY = useTransform(scrollYProgress, [0.34, 0.49], [-30, 0]);
  const btn1 = useTransform(scrollYProgress, [0.42, 0.46], [0, 1]);
  const btn2 = useTransform(scrollYProgress, [0.46, 0.50], [0, 1]);
  const btn3 = useTransform(scrollYProgress, [0.50, 0.54], [0, 1]);
  const btn4 = useTransform(scrollYProgress, [0.54, 0.58], [0, 1]);
  const btn5 = useTransform(scrollYProgress, [0.58, 0.62], [0, 1]);
  const chap2Opacity = useTransform(scrollYProgress, [0.33, 0.38, 0.63, 0.67], [0, 1, 1, 0]);

  // Transition Curtain Eclipse between Chap 2 and Chap 3 (0.65 -> 0.70)
  const eclipse2To3 = useTransform(scrollYProgress, [0.63, 0.66, 0.69], [0, 0.95, 0]);

  // Chapter 3: Gen Z Streetwear Fusion (0.67 -> 1.00)
  const cyberOverlayOpacity = useTransform(scrollYProgress, [0.68, 0.85], [0, 1]);
  const cyberScale = useTransform(scrollYProgress, [0.68, 0.88], [0.90, 1]);
  const hisScoreCounter = useTransform(scrollYProgress, [0.72, 0.94], [40, 98]);
  const chap3Opacity = useTransform(scrollYProgress, [0.66, 0.71, 0.98, 1.0], [0, 1, 1, 1]);

  // Sync scroll position to chapter index
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      let chap = 0;
      if (v < 0.33) {
        chap = 0;
      } else if (v < 0.66) {
        chap = 1;
      } else {
        chap = 2;
      }

      if (chap !== currentChapter) {
        setCurrentChapter(chap);
      }
    });

    return () => unsub();
  }, [scrollYProgress, currentChapter]);

  // Auto-scroll Presentation Engine
  useEffect(() => {
    let animId: number;
    let lastTime: number = performance.now();

    const step = (time: number) => {
      if (!isAutoPlaying || !scrollySectionRef.current) return;
      const deltaTime = time - lastTime;
      lastTime = time;

      const container = scrollySectionRef.current;
      const start = container.offsetTop;
      const maxScroll = start + container.scrollHeight - window.innerHeight;

      if (window.scrollY >= maxScroll - 10) {
        setIsAutoPlaying(false);
        return;
      }

      // Smooth scroll advance ~ 180px per second for cinema pacing
      const scrollStep = (180 * deltaTime) / 1000;
      window.scrollBy({ top: scrollStep, behavior: 'auto' });

      animId = requestAnimationFrame(step);
    };

    if (isAutoPlaying) {
      lastTime = performance.now();
      animId = requestAnimationFrame(step);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isAutoPlaying]);

  // Stop auto-play on user manual wheel
  useEffect(() => {
    const handleUserWheel = () => {
      if (isAutoPlaying) {
        setIsAutoPlaying(false);
      }
    };
    window.addEventListener('wheel', handleUserWheel, { passive: true });
    window.addEventListener('touchmove', handleUserWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleUserWheel);
      window.removeEventListener('touchmove', handleUserWheel);
    };
  }, [isAutoPlaying]);

  const scrollToPhase = (targetPercent: number) => {
    if (!scrollySectionRef.current) return;
    const target = scrollySectionRef.current;
    const offset = target.offsetTop;
    const totalHeight = target.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: offset + totalHeight * targetPercent,
      behavior: 'smooth',
    });
  };

  const handleStartDebut = (auto: boolean) => {
    setShowCurtainIntro(false);
    if (auto) {
      if (scrollySectionRef.current) {
        window.scrollTo({ top: scrollySectionRef.current.offsetTop, behavior: 'smooth' });
      }
      setTimeout(() => {
        setIsAutoPlaying(true);
      }, 700);
    } else {
      if (scrollySectionRef.current) {
        window.scrollTo({ top: scrollySectionRef.current.offsetTop, behavior: 'smooth' });
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full relative bg-obsidian-900 text-[#E3E2E6] overflow-x-hidden selection:bg-heritage-hoang/30 selection:text-heritage-hoang">
      
      {/* 1. TOP SCROLL PROGRESS BAR (HAIRLINE GOLDEN GRADIENT) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-heritage-hoang via-amber-300 to-cyber-lime z-50 origin-left"
        style={{ scaleX: globalScrollProgress }}
      />

      {/* ========================================================================= */}
      {/* 2. CINEMATIC CURTAIN INTRO (MÀN ĐEN HUYỀN BÍ + HƯỚNG DẪN BẮT ĐẦU) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showCurtainIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-[#0E0F12] flex flex-col items-center justify-center p-6 sm:p-10 text-center"
          >
            {/* Ambient Background Gold Embers */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(214,158,46,0.15),transparent_70%)] pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="relative z-10 max-w-2xl space-y-6"
            >
              {/* Debut Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-m3-full bg-heritage-hoang/15 border border-heritage-hoang/40 text-xs font-mono font-semibold text-amber-200">
                <Sparkles className="w-4 h-4 text-heritage-hoang" />
                <span>VIBEPHỤC STUDIO • OFFICIAL PRESENTATION DEBUT</span>
              </div>

              {/* Grand Cinematic Title */}
              <h1 className="text-4xl sm:text-6xl font-imperial font-bold text-white tracking-tight leading-tight">
                Hành Trình Khởi Nguyên <br />
                <span className="text-heritage-hoang font-imperial">Di Sản Văn Hiến 2026</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-sans max-w-xl mx-auto">
                Trải nghiệm Scrollytelling toàn màn hình kết hợp quy thức Cổ Phục triều Nguyễn với làn sóng Gen Z Streetwear. Bạn có thể chọn tự động trình chiếu hoặc tự do cuộn chuột.
              </p>

              {/* Debut Presentation Action Options */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => handleStartDebut(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-m3-full bg-heritage-hoang hover:bg-amber-400 text-black font-bold text-sm font-mono flex items-center justify-center gap-2.5 shadow-heritage-glow hover:scale-105 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Bắt Đầu Tự Động Trình Diễn (Auto-Scroll)</span>
                </button>

                <button
                  onClick={() => handleStartDebut(false)}
                  className="w-full sm:w-auto px-7 py-4 rounded-m3-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm font-mono flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
                >
                  <ChevronDown className="w-4 h-4 text-heritage-hoang" />
                  <span>Tự Do Cuộn Khám Phá (Interactive)</span>
                </button>
              </div>

              {/* Navigation Guide */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-neutral-400 border-t border-white/10">
                <span className="flex items-center gap-1.5 text-amber-200">
                  <span className="w-2 h-2 rounded-full bg-heritage-hoang animate-ping" />
                  Khuyên dùng màn hình máy tính hoặc xoay ngang điện thoại để trải nghiệm trọn vẹn
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. HERO VIEWPORT HEADER */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center border-b border-white/10 bg-radial from-[#1A1612] via-obsidian-900 to-obsidian-900 px-6 sm:px-12 py-16 overflow-hidden">
        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10">
          
          {/* Left Text Intro (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-m3-full bg-heritage-hoang/15 border border-heritage-hoang/40 text-xs font-semibold text-amber-200">
              <Sparkles className="w-4 h-4 text-heritage-hoang" />
              <span>Chương Trình Khởi Nguyên • Cổ Phục x Streetwear 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-imperial font-bold text-white tracking-tight leading-tight">
              Di Sản Văn Hiến <br />
              <span className="text-heritage-hoang font-imperial">Sống Trên Từng Bước Chân</span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-sans max-w-2xl">
              Chào mừng bạn đến với <strong>VibePhục Studio</strong> — Không gian thời trang tương tác đưa phục sức triều Nguyễn & Đại Việt hòa mình vào nhịp thở Gen Z đương đại. Chúng tôi bảo tồn quy thức tiền nhân, đồng thời trao quyền cho sự sáng tạo tự do.
            </p>

            {/* Fast Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#/atelier"
                onClick={(e) => { e.preventDefault(); onNavigate('atelier'); }}
                className="px-6 py-3 rounded-m3-full bg-heritage-hoang hover:bg-amber-400 text-black font-bold text-xs sm:text-sm font-mono transition-all shadow-heritage-glow hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Vào Xưởng Atelier 3D</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#/ai-studio"
                onClick={(e) => { e.preventDefault(); onNavigate('ai-studio'); }}
                className="px-6 py-3 rounded-m3-full bg-cyber-lime hover:bg-lime-400 text-black font-bold text-xs sm:text-sm font-mono transition-all shadow-cyber-glow hover:scale-105 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Phòng Sáng Tạo AI</span>
              </a>

              <a
                href="#/rules"
                onClick={(e) => { e.preventDefault(); onNavigate('rules'); }}
                className="px-5 py-3 rounded-m3-full bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/15 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-heritage-hoang" />
                <span>Điển Lệ Cổ Phục</span>
              </a>
            </div>

            {/* Scroll Down Prompt */}
            <div
              onClick={() => scrollToPhase(0.05)}
              className="pt-4 inline-flex items-center gap-3 text-xs sm:text-sm font-mono text-neutral-400 hover:text-amber-200 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full border border-heritage-hoang/40 flex items-center justify-center bg-heritage-hoang/10">
                <ChevronDown className="w-4 h-4 text-heritage-hoang animate-bounce" />
              </div>
              <span>Cuộn xuống để bước vào Sân Khấu Scrollytelling 100% Toàn Màn Hình</span>
            </div>
          </div>

          {/* Right Visual Art Asset (5 cols) */}
          <div className="lg:col-span-5 relative h-80 sm:h-96 lg:h-[420px] flex items-center justify-center p-2 rounded-m3-xl bg-obsidian-800/60 border border-white/10 shadow-2xl overflow-hidden">
            <HeroHeritageIllustration className="w-full h-full max-h-[400px] drop-shadow-2xl" />
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TRUE 100% FULL-SCREEN SCROLL-DRIVEN PRESENTATION STAGE (420vh) */}
      {/* ========================================================================= */}
      <section ref={scrollySectionRef} className="relative h-[420vh] w-full">
        
        {/* Sticky 100vh Full-Screen Stage Canvas (Edge-to-Edge 100vw x 100vh) */}
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-obsidian-900 flex flex-col justify-between z-20">
          
          {/* Dynamic Background Atmosphere Glow shifting across acts */}
          <div
            className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
              currentChapter === 0
                ? 'bg-[radial-gradient(ellipse_at_top,#14223D_0%,#0E0F12_70%)]'
                : currentChapter === 1
                ? 'bg-[radial-gradient(ellipse_at_top,#40141A_0%,#0E0F12_70%)]'
                : 'bg-[radial-gradient(ellipse_at_top,#0E2E18_0%,#0E0F12_70%)]'
            }`}
          />

          {/* BLACKOUT ECLIPSE TRANSITION OVERLAYS BETWEEN ACTS ("Đen màn hình rồi animation hiện lên") */}
          <motion.div
            className="absolute inset-0 bg-black z-40 pointer-events-none"
            style={{ opacity: eclipse1To2 }}
          />
          <motion.div
            className="absolute inset-0 bg-black z-40 pointer-events-none"
            style={{ opacity: eclipse2To3 }}
          />

          {/* TOP PRESENTATION HUD BAR */}
          <div className="relative z-30 w-full px-6 sm:px-12 pt-5 flex items-center justify-between border-b border-white/10 bg-obsidian-900/70 backdrop-blur-organza pb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-heritage-hoang animate-ping" />
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-heritage-hoang font-bold block">
                  DEBUT PRESENTATION • 100% FULL SCREEN
                </span>
                <span className="text-[11px] text-neutral-400 font-sans hidden sm:block">
                  {isAutoPlaying ? '▶ Đang tự động trình chiếu di sản...' : 'Tự do cuộn hoặc điều khiển bằng thanh điều hướng'}
                </span>
              </div>
            </div>

            {/* Playback Controls & Chapter Stepper */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`px-3.5 py-1.5 rounded-m3-full flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                  isAutoPlaying
                    ? 'bg-heritage-hoang text-black shadow-heritage-glow'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={isAutoPlaying ? 'Tạm dừng tự động cuộn' : 'Bật tự động trình chiếu (Auto-Scroll)'}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                <span>{isAutoPlaying ? 'Tạm Dừng' : 'Auto Play'}</span>
              </button>

              <button
                onClick={() => scrollToPhase(currentChapter === 0 ? 0.48 : currentChapter === 1 ? 0.85 : 0.05)}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-m3-full bg-white/10 hover:bg-white/20 text-neutral-200 cursor-pointer"
                title="Chuyển đến Hồi kế tiếp"
              >
                <span>Next Act</span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full text-neutral-400 hover:text-white transition-colors cursor-pointer hidden md:block"
                title="Bật/Tắt chế độ Toàn Màn Hình"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* MAIN PRESENTATION STAGE (SPANS 85-90% OF VIEWPORT HEIGHT) */}
          <div className="relative z-20 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 my-auto">
            
            {/* LEFT / TOP: DYNAMIC EDITORIAL STORYTELLING TEXT */}
            <div className="w-full lg:w-5/12 space-y-6">
              <AnimatePresence mode="wait">
                {currentChapter === 0 && (
                  <motion.div
                    key="act-0"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.45 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-heritage-hoang/10 border border-heritage-hoang/40 text-xs font-mono font-bold text-amber-200 uppercase tracking-widest">
                      HỒI THỨ NHẤT: KHỞI THI CÔNG
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-imperial font-bold text-white leading-tight">
                      Sống Lưng Chính Trung <br />
                      <span className="text-heritage-hoang font-imperial">Đoan Chính Giữa Trời Đất</span>
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
                      Khi chế tác chiếc áo ngũ thân, người thợ may nối ghép hai khổ vải phía sau lưng thành một đường ráp nối duy nhất gọi là <strong>Đường May Chính Trung (正中)</strong>.
                      Đường chỉ vàng này chạy thẳng tắp dọc cột sống, nhắc nhở người mặc luôn giữ lòng dạ ngay thẳng, cương trực, không tà tâm trước đất trời.
                    </p>

                    <div className="p-4 rounded-m3-lg bg-obsidian-800/90 border border-white/15 text-xs sm:text-sm text-neutral-300 space-y-2">
                      <div className="flex items-center gap-2 text-heritage-hoang font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Quy Thức Bất Biến Triều Nguyễn</span>
                      </div>
                      <p className="text-xs text-neutral-400 font-sans">
                        Thân sau áo ngũ thân bắt buộc ráp đôi song song, tuyệt đối không dùng vải liền khổ lớn để giữ trọn triết lý cân bằng Âm Dương.
                      </p>
                    </div>
                  </motion.div>
                )}

                {currentChapter === 1 && (
                  <motion.div
                    key="act-1"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.45 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-950/80 border border-rose-600/50 text-xs font-mono font-bold text-rose-300 uppercase tracking-widest">
                      HỒI THỨ HAI: RANH GIỚI SINH TỬ
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-imperial font-bold text-white leading-tight">
                      Quy Thức Hữu Nhậm <br />
                      <span className="text-amber-300 font-imperial">& 5 Cúc Ngũ Luân</span>
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
                      Vạt áo cổ phục Việt Nam bắt buộc khép từ <strong>Trái sang Phải</strong> (Hữu Nhậm - 右衽), cài khuy tại lườn nách phải.
                      Cài ngược lại từ Phải sang Trái (Tả Nhậm) là <strong className="text-rose-400">ĐẠI KỴ</strong> vì đây là quy thức xưa nay chỉ dành để khâm liệm thi hài người mất.
                    </p>

                    {/* 5 Virtues Grid */}
                    <div className="space-y-2 pt-2">
                      <div className="text-xs font-mono text-neutral-400 font-semibold uppercase">
                        5 Khuy Cúc Tượng Trưng 5 Đạo Làm Người:
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {FIVE_VIRTUES.map((v) => (
                          <div key={v.name} className="p-2 rounded bg-obsidian-800 border border-white/10 text-center">
                            <div className="text-sm font-bold text-heritage-hoang font-imperial">{v.symbol}</div>
                            <div className="text-xs font-bold text-white mt-0.5">{v.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentChapter === 2 && (
                  <motion.div
                    key="act-2"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.45 }}
                    className="space-y-4"
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyber-lime/10 border border-cyber-lime/40 text-xs font-mono font-bold text-cyber-lime uppercase tracking-widest">
                      HỒI THỨ BA: TƯƠNG LAI HAUTE HERITAGE
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-imperial font-bold text-white leading-tight">
                      Hơi Thở Gen Z Streetwear <br />
                      <span className="text-cyber-lime font-imperial">Dung Hợp Công Nghệ Vị Lai</span>
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-sans">
                      Di sản không phải là hiện vật bảo tàng ngủ yên. Khi kết hợp lớp áo ngũ thân truyền thống cùng áo bomber cyber organza, quần parachute cargo và chunky boots, cổ phục hòa nhập sống động vào đời sống thế hệ trẻ.
                    </p>

                    {/* Fast Portal Jump Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-3">
                      <a
                        href="#/atelier"
                        onClick={(e) => { e.preventDefault(); onNavigate('atelier'); }}
                        className="px-6 py-2.5 rounded-m3-full bg-cyber-lime hover:bg-lime-400 text-black font-bold text-xs sm:text-sm font-mono transition-all shadow-cyber-glow flex items-center gap-2 cursor-pointer"
                      >
                        <Layers className="w-4 h-4" />
                        <span>Mở Xưởng Atelier 3D</span>
                      </a>

                      <a
                        href="#/ai-studio"
                        onClick={(e) => { e.preventDefault(); onNavigate('ai-studio'); }}
                        className="px-5 py-2.5 rounded-m3-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm font-mono transition-colors flex items-center gap-2 cursor-pointer border border-white/20"
                      >
                        <Sparkles className="w-4 h-4 text-cyber-lime" />
                        <span>Thử Gemini AI Remix</span>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT / CENTER: MASSIVE CINEMATIC VISUAL STAGE (SPANS 80-90% SCREEN HEIGHT) */}
            <div className="w-full lg:w-7/12 flex items-center justify-center p-2 sm:p-4">
              <div className="relative w-full max-w-lg h-[460px] sm:h-[530px] rounded-m3-xl bg-obsidian-900/90 border border-heritage-hoang/40 p-6 flex flex-col items-center justify-center shadow-2xl overflow-hidden backdrop-blur-organza">
                
                {/* Radial Aura Glow */}
                <div className="absolute inset-0 bg-radial from-heritage-hoang/10 via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* THE PHYSICAL GARMENT SIMULATION CANVAS */}
                <div className="relative w-72 sm:w-80 h-96 sm:h-[430px] flex items-center justify-center">
                  
                  {/* ACT 1 VISUALS: BACK PANELS & CHÍNH TRUNG SEAM */}
                  {currentChapter === 0 && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ opacity: chap1Opacity }}
                    >
                      {/* Left Back Panel of Áo Ngũ Thân */}
                      <motion.div
                        className="absolute left-4 top-8 bottom-8 w-32 bg-gradient-to-r from-[#0C1E3A] to-[#1E3A8A] border-y border-l border-heritage-hoang/40 rounded-l-lg shadow-xl"
                        style={{ x: negativePanelSpread }}
                      >
                        <div className="p-3 text-[10px] font-mono text-neutral-400">Thân sau bên trái</div>
                      </motion.div>

                      {/* Right Back Panel of Áo Ngũ Thân */}
                      <motion.div
                        className="absolute right-4 top-8 bottom-8 w-32 bg-gradient-to-l from-[#0C1E3A] to-[#1E3A8A] border-y border-r border-heritage-hoang/40 rounded-r-lg shadow-xl"
                        style={{ x: panelSpread }}
                      >
                        <div className="p-3 text-[10px] font-mono text-neutral-400 text-right">Thân sau bên phải</div>
                      </motion.div>

                      {/* High Collar (Lập Lĩnh) Center */}
                      <div className="absolute top-2 w-28 h-10 rounded-t-md bg-[#0F172A] border-2 border-heritage-hoang z-30 flex items-center justify-center shadow-lg">
                        <span className="text-[11px] font-mono font-bold text-amber-200">Cổ Lập Lĩnh</span>
                      </div>

                      {/* THE GOLDEN SEAM LINE (CHÍNH TRUNG) PIERCING VERTICALLY */}
                      <motion.div
                        className="absolute inset-y-8 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-amber-100 via-heritage-hoang to-amber-400 shadow-heritage-glow z-20"
                        style={{
                          height: seamHeight,
                          opacity: seamGlow,
                        }}
                      />

                      {/* Floating Seam Tag */}
                      <motion.div
                        className="absolute top-1/2 -translate-y-1/2 z-30 bg-black/90 px-3 py-1.5 rounded-m3-full border border-heritage-hoang/60 shadow-heritage-glow text-center"
                        style={{ opacity: seamGlow }}
                      >
                        <span className="text-xs font-mono font-bold text-heritage-hoang">
                          Đường May Chính Trung (正中)
                        </span>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* ACT 2 VISUALS: LAPEL CLOSURE (HỮU NHẬM) & 5 BUTTONS IGNITING */}
                  {currentChapter === 1 && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ opacity: chap2Opacity }}
                    >
                      {/* Under-Lapel (Tiền thiềm bên phải) */}
                      <div className="absolute inset-x-8 top-10 bottom-10 bg-gradient-to-br from-indigo-950 to-blue-950 border border-white/20 rounded-lg p-4 flex flex-col justify-end">
                        <span className="text-[10px] font-mono text-neutral-400">Tiền thiềm lót bên phải</span>
                      </div>

                      {/* OVER-LAPEL (VẠT TRÁI ĐÈ VẠT PHẢI - HỮU NHẬM) WITH 3D SWOOP */}
                      <motion.div
                        className="absolute inset-x-6 top-8 bottom-8 bg-gradient-to-tr from-[#1E3A8A] via-[#1E293B] to-[#1E3A8A] border-2 border-amber-300 rounded-lg shadow-2xl p-4 flex flex-col justify-between z-20"
                        style={{
                          x: flapSwoopX,
                          rotateY: flapRotateY,
                        }}
                      >
                        <div className="flex items-center justify-between text-xs font-mono text-amber-200 border-b border-amber-400/30 pb-2">
                          <span className="font-bold flex items-center gap-1 text-emerald-400">
                            <Check className="w-4 h-4" />
                            HỮU NHẬM (右衽)
                          </span>
                          <span className="text-[10px] text-neutral-300">Vạt Trái Phủ Lên Vạt Phải</span>
                        </div>

                        {/* 5 GOLDEN BUTTONS (NGŨ LUÂN) LIGHTING UP DOWN THE RIGHT SIDE */}
                        <div className="space-y-4 my-auto pl-2">
                          {[
                            { virtue: 'Nhân', symbol: '仁', op: btn1, meaning: 'Lòng Nhân Ái' },
                            { virtue: 'Lễ', symbol: '禮', op: btn2, meaning: 'Kính Trọng Lễ Nghi' },
                            { virtue: 'Nghĩa', symbol: '義', op: btn3, meaning: 'Chính Trực Lẽ Phải' },
                            { virtue: 'Trí', symbol: '智', op: btn4, meaning: 'Sáng Suốt Minh Triết' },
                            { virtue: 'Tín', symbol: '信', meaning: 'Chữ Tín Son Sắt' },
                          ].map((b) => (
                            <motion.div
                              key={b.virtue}
                              className="flex items-center gap-3"
                              style={{ opacity: b.op }}
                            >
                              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-heritage-hoang via-amber-200 to-amber-400 text-black font-imperial font-bold text-xs flex items-center justify-center shadow-heritage-glow border border-amber-100">
                                {b.symbol}
                              </div>
                              <div className="text-xs font-mono text-amber-100">
                                <strong className="text-white">{b.virtue}</strong>: {b.meaning}
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Taboo Warning Banner */}
                        <div className="bg-rose-950/90 border border-rose-600 p-2 rounded text-[11px] font-mono text-rose-200 text-center flex items-center justify-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span>Tuyệt đối cấm Tả Nhậm (Vạt phải đè vạt trái)</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {/* ACT 3 VISUALS: CYBER STREETWEAR FUSION & HIS METER GAUGE */}
                  {currentChapter === 2 && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ opacity: chap3Opacity }}
                    >
                      {/* Traditional Core Silhouette underneath */}
                      <div className="w-48 h-72 rounded-lg bg-gradient-to-b from-indigo-900 to-blue-950 border border-amber-300/40 p-4 relative overflow-hidden shadow-inner">
                        <div className="w-full text-center text-xs font-mono text-amber-200">
                          Áo Ngũ Thân Cổ Phục Lõi
                        </div>
                      </div>

                      {/* TRANSFORMATION: CYBER ORGANZA TRENCH & PARACHUTE TECH WEAR */}
                      <motion.div
                        className="absolute inset-0 rounded-m3-xl bg-cyber-lime/10 border-2 border-cyber-lime/70 backdrop-blur-[3px] p-6 flex flex-col justify-between shadow-cyber-glow z-30"
                        style={{
                          opacity: cyberOverlayOpacity,
                          scale: cyberScale,
                        }}
                      >
                        <div className="flex items-center justify-between text-xs font-mono text-cyber-lime font-bold">
                          <span>CYBER ORGANZA TRENCH</span>
                          <span>HAUTE STREETWEAR</span>
                        </div>

                        {/* Middle Silhouettes Details */}
                        <div className="space-y-2 text-center my-auto">
                          <div className="text-sm font-bold text-white">Cyber Trenchcoat Xuyên Thấu</div>
                          <div className="text-xs text-neutral-300">Khóa kim loại Tactical Buckle & Quần Cargo</div>
                          <div className="text-xs font-mono text-cyber-lime">Chunky Boots Hợp Kim Titan</div>
                        </div>

                        {/* HIS METER GAUGE */}
                        <div className="bg-black/90 p-3 rounded-m3-md border border-cyber-lime/40 space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-neutral-400">Heritage Integrity Score:</span>
                            <span className="text-cyber-lime font-bold text-sm">98% (Chuẩn Mực)</span>
                          </div>

                          {/* Progress Meter Bar */}
                          <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-heritage-hoang via-cyber-lime to-cyber-jade rounded-full w-[98%]" />
                          </div>

                          <div className="text-[10px] font-mono text-center text-emerald-400">
                            ✓ Bảo chứng Quy Thức Hữu Nhậm & Triết Lý Ngũ Luân
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                </div>

                {/* BOTTOM STAGE CAPTION */}
                <div className="mt-4 text-xs font-mono text-neutral-400 text-center z-20">
                  {currentChapter === 0 && 'Sống lưng ghép đôi — Nhắc nhở người mặc luôn đoan chính giữa đất trời'}
                  {currentChapter === 1 && 'Vạt áo Hữu Nhậm cài nách phải — 5 khuy cúc tượng trưng Nhân Lễ Nghĩa Trí Tín'}
                  {currentChapter === 2 && 'Gen Z Haute Heritage — Đưa cổ phục bước xuống đường phố đương đại'}
                </div>

              </div>
            </div>

          </div>

          {/* BOTTOM HUD BAR & CHAPTER STEPPER */}
          <div className="relative z-30 w-full px-6 sm:px-12 pb-5 pt-3 border-t border-white/10 bg-obsidian-900/70 backdrop-blur-organza flex items-center justify-between text-xs font-mono">
            <div className="text-neutral-400">
              Tiến trình Scrollytelling:{' '}
              <span className="text-heritage-hoang font-bold">
                {currentChapter === 0 ? '33% (Hồi I)' : currentChapter === 1 ? '66% (Hồi II)' : '100% (Hồi III Hoàn Tất)'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-neutral-400 hidden sm:inline">
                Cuộn tiếp để vào Cổng Kết Nối Không Gian
              </span>
              <button
                onClick={() => scrollToPhase(currentChapter === 0 ? 0.48 : currentChapter === 1 ? 0.85 : 0.05)}
                className="px-4 py-1.5 rounded-m3-full bg-white/10 hover:bg-white/20 text-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{currentChapter < 2 ? 'Xem Hồi Tiếp Theo' : 'Về Đầu Scrolly'}</span>
                <ChevronDown className={`w-3.5 h-3.5 ${currentChapter === 2 ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. APP PORTAL GATEWAY HUBS (RELATIVE LINKS DIRECTLY TO ALL ROUTES) */}
      {/* ========================================================================= */}
      <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 py-20 space-y-8 z-30">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-heritage-hoang flex items-center gap-1.5">
            <Compass className="w-4 h-4" />
            <span>CỔNG KẾT NỐI KHÔNG GIAN (APP PORTAL HUBS)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-imperial text-white mt-1">
            Chọn Điểm Đến Trong VibePhục Studio
          </h2>
          <p className="text-sm text-neutral-400 font-sans">
            Mỗi không gian phục vụ một mục đích chuyên biệt. Truy cập ngay bằng các liên kết tương đối (relative-links) dưới đây:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* PORTAL 1: MODULAR ATELIER 3D */}
          <a
            href="#/atelier"
            onClick={(e) => { e.preventDefault(); onNavigate('atelier'); }}
            className="group block p-6 rounded-m3-xl bg-obsidian-800/90 border border-white/10 hover:border-heritage-hoang hover:bg-obsidian-800 transition-all duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-m3-md bg-heritage-hoang/20 text-heritage-hoang border border-heritage-hoang/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <Layers className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-imperial text-white group-hover:text-heritage-hoang transition-colors">
                  Xưởng Atelier 3D
                </h3>
                <span className="text-xs font-mono text-neutral-400 block mt-1">
                  Đường dẫn: #/atelier
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Thử nghiệm phối đồ đa tầng thời gian thực (Base, Core, Outer, Bottom, Phụ kiện). Trải nghiệm cơ chế vật lý nảy đàn hồi chống Tả Nhậm.
              </p>
            </div>

            <div className="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-heritage-hoang font-bold">
              <span>Mở Xưởng Phục Trang</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </a>

          {/* PORTAL 2: GEMINI AI REMIX STUDIO */}
          <a
            href="#/ai-studio"
            onClick={(e) => { e.preventDefault(); onNavigate('ai-studio'); }}
            className="group block p-6 rounded-m3-xl bg-obsidian-800/90 border border-white/10 hover:border-cyber-lime hover:bg-obsidian-800 transition-all duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-m3-md bg-cyber-lime/20 text-cyber-lime border border-cyber-lime/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-imperial text-white group-hover:text-cyber-lime transition-colors">
                  Gemini AI Studio
                </h3>
                <span className="text-xs font-mono text-neutral-400 block mt-1">
                  Đường dẫn: #/ai-studio
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Khởi tạo bản phối thông minh với Adaptive Multi-Model Routing (Gemini 3.8 Flash & 3.1 Pro), tự động cân bằng ngũ hành và xử lý lỗi mạng Case 492.
              </p>
            </div>

            <div className="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-cyber-lime font-bold">
              <span>Khởi Tạo Bằng AI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </a>

          {/* PORTAL 3: HERITAGE RULES ARCHIVE */}
          <a
            href="#/rules"
            onClick={(e) => { e.preventDefault(); onNavigate('rules'); }}
            className="group block p-6 rounded-m3-xl bg-obsidian-800/90 border border-white/10 hover:border-heritage-son hover:bg-obsidian-800 transition-all duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-m3-md bg-heritage-son/20 text-rose-300 border border-heritage-son/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-imperial text-white group-hover:text-rose-200 transition-colors">
                  Điển Lệ Cổ Phục
                </h3>
                <span className="text-xs font-mono text-neutral-400 block mt-1">
                  Đường dẫn: #/rules
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Bách khoa điển lệ phục sức: Áo Ngũ Thân, Áo Tấc, Nhật Bình, Tứ Thân, Bà Ba, luật Hữu Nhậm và sumptuary laws cấm ngụy tạo rồng 5 móng phong kiến.
              </p>
            </div>

            <div className="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-rose-300 font-bold">
              <span>Tra Cứu Điển Lệ</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </a>

          {/* PORTAL 4: LOOKBOOK ARCHIVE */}
          <a
            href="#/lookbooks"
            onClick={(e) => { e.preventDefault(); onNavigate('lookbooks'); }}
            className="group block p-6 rounded-m3-xl bg-obsidian-800/90 border border-white/10 hover:border-amber-300 hover:bg-obsidian-800 transition-all duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-m3-md bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                <BookmarkCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-imperial text-white group-hover:text-amber-200 transition-colors">
                  Kho Lookbook
                </h3>
                <span className="text-xs font-mono text-neutral-400 block mt-1">
                  Đường dẫn: #/lookbooks
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Lưu trữ các bản phối đã được giám tuyển và bảo chứng quy thức trên nền tảng cơ sở dữ liệu Google Cloud Firestore lâu dài.
              </p>
            </div>

            <div className="pt-5 border-t border-white/10 flex items-center justify-between text-xs font-mono text-amber-300 font-bold">
              <span>Xem Bộ Sưu Tập</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </a>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. VISUAL CULTURAL PRINCIPLES ASSETS */}
      {/* ========================================================================= */}
      <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 py-10 space-y-8 z-30">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-heritage-hoang flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>NGUYÊN LÝ VĂN HÓA CỐT LÕI (CULTURAL PRINCIPLES)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-imperial text-white mt-1">
            Quy Thức Hữu Nhậm & Triết Lý Ngũ Hành
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Huu Nham vs Ta Nham Comparison Asset */}
          <div className="lg:col-span-7 bg-obsidian-800/80 rounded-m3-xl border border-white/10 p-6 sm:p-8 backdrop-blur-organza shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                CHẨN ĐOÁN QUY THỨC MAY MẶC
              </span>
              <h3 className="text-2xl font-bold font-imperial text-white mt-1">
                Phân Định Rạch Ròi: Hữu Nhậm (右衽) vs Tả Nhậm (左衽)
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed font-sans">
                Người xưa quan niệm vạt áo bên trái tượng trưng cho phần Dương (Sự sống, sinh trưởng), vạt bên phải tượng trưng cho phần Âm. Khi cài áo, vạt trái đè lên vạt phải (Hữu Nhậm) là thuận theo lẽ tự nhiên của người sống. Cài ngược lại (Tả Nhậm) là nghịch lý sinh tồn, đại kỵ trong đời sống thường nhật.
              </p>
            </div>

            <div className="w-full h-72 rounded-m3-lg overflow-hidden flex items-center justify-center p-2 bg-obsidian-900 border border-white/5">
              <HuuNhamComparisonAsset className="w-full h-full max-h-64" />
            </div>
          </div>

          {/* Right: Five Elements Wheel Asset */}
          <div className="lg:col-span-5 bg-obsidian-800/80 rounded-m3-xl border border-white/10 p-6 sm:p-8 backdrop-blur-organza shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-mono text-heritage-hoang font-bold uppercase tracking-wider">
                TRIẾT LÝ SẮC ĐIỂN
              </span>
              <h3 className="text-2xl font-bold font-imperial text-white mt-1">
                Vòng Tương Sinh Ngũ Hành
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed font-sans">
                Màu sắc trong phục sức Cổ phục Việt Nam không phối ngẫu tùy tiện mà tuân theo nguyên lý Ngũ Hành: Kim (Trắng), Mộc (Xanh lá), Thủy (Chàm/Đen), Hỏa (Đỏ), Thổ (Vàng Hoàng Thổ).
              </p>
            </div>

            <div className="w-full h-72 rounded-m3-lg overflow-hidden flex items-center justify-center p-2 bg-obsidian-900 border border-white/5">
              <FiveElementsWheelAsset className="w-full h-full max-h-64" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. VISUAL BENTO GALLERY OF 5 CORE GARMENTS */}
      {/* ========================================================================= */}
      <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-12 py-10 space-y-8 z-30">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-heritage-hoang flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>BỘ NGŨ PHỤC DI SẢN (HERITAGE SHOWCASE)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-imperial text-white mt-1">
              5 Dòng Cổ Phục & Biểu Tượng Văn Hóa
            </h2>
          </div>

          <a
            href="#/atelier"
            onClick={(e) => { e.preventDefault(); onNavigate('atelier'); }}
            className="text-xs sm:text-sm font-mono text-heritage-hoang hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <span>Thử phối các trang phục này tại Xưởng Atelier</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 5 Garments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Áo Ngũ Thân Tay Chẽn */}
          <div className="bg-obsidian-800/80 rounded-m3-xl border border-white/10 p-6 backdrop-blur-organza space-y-4 hover:border-heritage-hoang transition-all duration-300 group flex flex-col justify-between">
            <div className="w-full h-64 rounded-m3-lg bg-obsidian-900 overflow-hidden flex items-center justify-center p-2 border border-white/5 group-hover:scale-[1.02] transition-transform">
              <NguThanArtwork className="w-full h-full max-h-56 drop-shadow-md" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-imperial text-white group-hover:text-heritage-hoang transition-colors">
                  Áo Ngũ Thân Tay Chẽn
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-heritage-hoang/20 text-amber-200">
                  Triều Nguyễn
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Phom dáng 5 thân tượng trưng tứ thân phụ mẫu và chính mình. Cổ đứng lập lĩnh cao 2-3cm, 5 cúc cài nách phải theo đúng quy thức Hữu Nhậm.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <a
                  href="#/atelier"
                  onClick={(e) => { e.preventDefault(); onNavigate('atelier'); }}
                  className="text-amber-300 hover:underline flex items-center gap-1"
                >
                  <span>Phối đồ ngay</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Áo Nhật Bình Cung Đình */}
          <div className="bg-obsidian-800/80 rounded-m3-xl border border-white/10 p-6 backdrop-blur-organza space-y-4 hover:border-heritage-son transition-all duration-300 group flex flex-col justify-between">
            <div className="w-full h-64 rounded-m3-lg bg-obsidian-900 overflow-hidden flex items-center justify-center p-2 border border-white/5 group-hover:scale-[1.02] transition-transform">
              <NhatBinhArtwork className="w-full h-full max-h-56 drop-shadow-md" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-imperial text-white group-hover:text-rose-200 transition-colors">
                  Áo Nhật Bình Cung Đình
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-heritage-son/20 text-rose-200">
                  Hoàng Tộc
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Lễ phục của Hoàng hậu, Công chúa triều Nguyễn. Điểm nhấn là cổ áo hình chữ nhật to bản và dải ngũ sắc viền cửa tay áo đại diện cho Ngũ Hành.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <a
                  href="#/atelier"
                  onClick={(e) => { e.preventDefault(); onNavigate('atelier'); }}
                  className="text-rose-300 hover:underline flex items-center gap-1"
                >
                  <span>Phối đồ ngay</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Áo Tấc / Tay Thụ */}
          <div className="bg-obsidian-800/80 rounded-m3-xl border border-white/10 p-6 backdrop-blur-organza space-y-4 hover:border-amber-400 transition-all duration-300 group flex flex-col justify-between">
            <div className="w-full h-64 rounded-m3-lg bg-obsidian-900 overflow-hidden flex items-center justify-center p-2 border border-white/5 group-hover:scale-[1.02] transition-transform">
              <AoTacArtwork className="w-full h-full max-h-56 drop-shadow-md" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-imperial text-white group-hover:text-amber-200 transition-colors">
                  Áo Tấc / Tay Thụ
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                  Đại Lễ
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Đại lễ phục trang nghiêm của quan viên và sĩ thứ. Ống tay rộng 35-50cm thụng buông vuông góc khi chắp tay hành lễ uy nghi.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <a
                  href="#/atelier"
                  onClick={(e) => { e.preventDefault(); onNavigate('atelier'); }}
                  className="text-amber-300 hover:underline flex items-center gap-1"
                >
                  <span>Phối đồ ngay</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 4: Áo Tứ Thân Bắc Bộ */}
          <div className="bg-obsidian-800/80 rounded-m3-xl border border-white/10 p-6 backdrop-blur-organza space-y-4 hover:border-emerald-400 transition-all duration-300 group flex flex-col justify-between">
            <div className="w-full h-64 rounded-m3-lg bg-obsidian-900 overflow-hidden flex items-center justify-center p-2 border border-white/5 group-hover:scale-[1.02] transition-transform">
              <TuThanArtwork className="w-full h-full max-h-56 drop-shadow-md" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-imperial text-white group-hover:text-emerald-200 transition-colors">
                  Áo Tứ Thân & Nón Quai Thao
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                  Kinh Bắc
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Nét duyên dáng phụ nữ Bắc Bộ với 4 vạt vải thắt vạt lươn trước bụng, yếm đào cánh sen, thắt lưng lụa đào và nón quai thao trăng tròn.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <a
                  href="#/atelier"
                  onClick={(e) => { e.preventDefault(); onNavigate('atelier'); }}
                  className="text-emerald-300 hover:underline flex items-center gap-1"
                >
                  <span>Phối đồ ngay</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 5: Áo Bà Ba Nam Bộ */}
          <div className="bg-obsidian-800/80 rounded-m3-xl border border-white/10 p-6 backdrop-blur-organza space-y-4 hover:border-sky-400 transition-all duration-300 group flex flex-col justify-between">
            <div className="w-full h-64 rounded-m3-lg bg-obsidian-900 overflow-hidden flex items-center justify-center p-2 border border-white/5 group-hover:scale-[1.02] transition-transform">
              <BaBaArtwork className="w-full h-full max-h-56 drop-shadow-md" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold font-imperial text-white group-hover:text-sky-200 transition-colors">
                  Áo Bà Ba & Khăn Rằn
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-200">
                  Nam Bộ
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                Biểu tượng phóng khoáng của miền sông nước Cửu Long. Cổ tròn hoặc tim nông, xẻ dọc chính giữa, hai túi vuông dưới vạt và khăn rằn mộc mạc.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs font-mono">
                <a
                  href="#/atelier"
                  onClick={(e) => { e.preventDefault(); onNavigate('atelier'); }}
                  className="text-sky-300 hover:underline flex items-center gap-1"
                >
                  <span>Phối đồ ngay</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 6: AI Studio Call to Action */}
          <div className="bg-gradient-to-br from-cyber-lime/10 via-obsidian-800/90 to-obsidian-900 rounded-m3-xl border border-cyber-lime/40 p-6 sm:p-8 backdrop-blur-organza flex flex-col justify-between space-y-4 shadow-cyber-glow">
            <div className="space-y-3">
              <div className="w-14 h-14 rounded-m3-md bg-cyber-lime/20 text-cyber-lime border border-cyber-lime/40 flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold font-imperial text-white">
                Sáng Tạo Bản Phối Bằng AI
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                Gemini AI phân tích bối cảnh, phối ngẫu lớp áo Cổ phục với áo khoác Cyber Organza và quần Cargo hiện đại với hệ thống bảo chứng văn hóa nghiêm ngặt.
              </p>
            </div>

            <div className="space-y-2 pt-4">
              <a
                href="#/ai-studio"
                onClick={(e) => { e.preventDefault(); onNavigate('ai-studio'); }}
                className="w-full py-3.5 rounded-m3-full bg-cyber-lime hover:bg-lime-400 text-black font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2 shadow-cyber-glow cursor-pointer transition-all hover:scale-[1.02]"
              >
                <span>Kích Hoạt Gemini AI Studio</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <span className="text-[11px] font-mono text-neutral-400 text-center block">
                Adaptive Multi-Model Router • Tự động xử lý Case 492
              </span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
