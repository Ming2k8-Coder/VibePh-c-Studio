import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ChevronDown,
  Play,
  Pause,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Sliders,
  BookOpen,
  Crown,
  Wand2,
  BookmarkCheck,
  ExternalLink
} from 'lucide-react';
import {
  NhatBinhArtwork,
  TuThanArtwork,
  BaBaArtwork,
  AoTacArtwork
} from '../Assets/HeritageIllustrations';

// Register GSAP ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface NarrativeLink {
  label: string;
  route: 'atelier' | 'ai-studio' | 'rules' | 'lookbooks' | 'wiki';
  icon: 'layers' | 'wand' | 'book' | 'bookmark';
  highlight?: boolean;
}

interface ActNarrative {
  id: number;
  era: string;
  titleMain: string;
  titleSub: string;
  titleSubColor: string;
  desc: string;
  primaryAction: NarrativeLink;
  secondaryAction?: NarrativeLink;
}

const ACTS_NARRATIVES: ActNarrative[] = [
  {
    id: 0,
    era: 'HỒI I · KHỞI THỦY & TRỤC THẲNG (THẾ KỶ 18 - 19)',
    titleMain: 'Sống Lưng Chính Trung',
    titleSub: 'Cội Nguồn Đoan Chính',
    titleSubColor: 'text-heritage-hoang',
    desc: 'Sợi chỉ vàng hoàng thổ vẽ dọc sống lưng Chính Trung (正中), kết nối hai thân sau nhắc nhở tâm hồn luôn ngay thẳng. Vạt áo khép từ Trái sang Phải (Hữu Nhậm) bảo lưu quy tắc sinh khí bất biến của cổ phục Việt.',
    primaryAction: {
      label: 'Thử Ngũ Thân tại Atelier',
      route: 'atelier',
      icon: 'layers',
      highlight: true
    },
    secondaryAction: {
      label: 'Wiki Cổ Phục & Timelines',
      route: 'rules',
      icon: 'book'
    }
  },
  {
    id: 1,
    era: 'HỒI II · BƯỚC CHUYỂN TRĂM NĂM (1930s - 1960s)',
    titleMain: 'Từ Le Mur Tân Thời',
    titleSub: 'Đến Đột Phá Raglan',
    titleSubColor: 'text-purple-300',
    desc: 'Cuộc cách tân ngoạn mục: Họa sĩ Cát Tường đưa vai bồng Tây phương vào Áo dài Le Mur; kế thừa bởi hiệu may Dung Đakao với phát minh ráp tay Raglan xéo nách, tôn vinh trọn vẹn tà áo dài thanh xuân nữ sinh Việt Nam.',
    primaryAction: {
      label: 'Phối Áo Dài Raglan',
      route: 'atelier',
      icon: 'layers',
      highlight: true
    },
    secondaryAction: {
      label: 'AI Remix Áo Dài',
      route: 'ai-studio',
      icon: 'wand'
    }
  },
  {
    id: 2,
    era: 'HỒI III · DÒNG CHẢY ĐA BẢN SẮC 4 MIỀN',
    titleMain: 'Hội Tụ Bắc - Trung - Nam',
    titleSub: 'Sắc Điển Đa Vùng Miền',
    titleSubColor: 'text-rose-300',
    desc: 'Chiêm ngưỡng 4 di sản đặc trưng: Áo Tứ Thân Kinh Bắc duyên dáng bên nón quai thao; Áo Nhật Bình triều Nguyễn viền ngũ sắc; Áo Bà Ba Nam Bộ mộc mạc cùng khăn rằn; và Áo Tấc tay thụng vuông trang nghiêm đại lễ.',
    primaryAction: {
      label: 'Kho Lookbooks 4 Miền',
      route: 'lookbooks',
      icon: 'bookmark',
      highlight: true
    },
    secondaryAction: {
      label: 'Thử Đồ Đa Vùng Miền',
      route: 'atelier',
      icon: 'layers'
    }
  },
  {
    id: 3,
    era: 'HỒI IV · BẢN SẮC TÂN KỲ (GEN Z METAMORPHOSIS)',
    titleMain: 'Di Sản Sống Cùng',
    titleSub: 'Nhịp Thở Đường Phố',
    titleSubColor: 'text-cyber-lime',
    desc: 'Cổ phục bung nở cùng chunky sneaker, áo khoác Cyber Organza xuyên thấu, chất liệu denim tái chế và sắc neon Cyber Lime. Vừa kiêu hãnh cội nguồn, vừa bứt phá tự do cho thế hệ đương đại.',
    primaryAction: {
      label: 'Mở Xưởng Phối Đồ AI Atelier',
      route: 'atelier',
      icon: 'layers',
      highlight: true
    },
    secondaryAction: {
      label: 'Wiki Cổ Phục',
      route: 'wiki',
      icon: 'wand'
    }
  }
];

interface FullscreenHeroStoryProps {
  onEnterAtelier: () => void;
  onExploreRules: () => void;
  onOpenAiStudio?: () => void;
  onOpenLookbooks?: () => void;
}

export const FullscreenHeroStory: React.FC<FullscreenHeroStoryProps> = ({
  onEnterAtelier,
  onExploreRules,
  onOpenAiStudio,
  onOpenLookbooks
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const cameraRigRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // User Preferences & State
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [userForcedMotion, setUserForcedMotion] = useState<boolean | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [currentAct, setCurrentAct] = useState<number>(0);
  const [scrollPercent, setScrollPercent] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Relative link navigation helper
  const navigateRelative = (route: 'atelier' | 'ai-studio' | 'rules' | 'lookbooks' | 'wiki') => {
    window.location.hash = `#/${route}`;
    if (route === 'atelier' || route === 'ai-studio') onEnterAtelier();
    else if (route === 'rules' || route === 'wiki') onExploreRules();
    else if (route === 'lookbooks' && onOpenLookbooks) onOpenLookbooks();
  };

  // Detect system reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const isMotionReduced = userForcedMotion !== null ? userForcedMotion : prefersReducedMotion;

  // Master GSAP ScrollTrigger Scrollytelling Setup (NO SOUND, SINGLE PINNED SCROLLER)
  useEffect(() => {
    const rootEl = rootRef.current;
    const pinEl = pinSectionRef.current;
    const cameraEl = cameraRigRef.current;

    if (!rootEl || !pinEl || !cameraEl) return;

    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: 'top top',
          end: '+=2800',
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
          scrub: isMotionReduced ? 0.3 : 1,
          onUpdate: (self) => {
            const progress = self.progress;
            setScrollPercent(Math.round(progress * 100));

            let act = 0;
            if (progress < 0.25) act = 0;
            else if (progress < 0.50) act = 1;
            else if (progress < 0.75) act = 2;
            else act = 3;

            setCurrentAct(act);
          }
        }
      });

      // Initial visual states
      gsap.set('.stage-act-0', { opacity: 1, pointerEvents: 'auto', scale: 1 });
      gsap.set('.stage-act-1', { opacity: 0, pointerEvents: 'none', scale: 0.96 });
      gsap.set('.stage-act-2', { opacity: 0, pointerEvents: 'none', scale: 0.96 });
      gsap.set('.stage-act-3', { opacity: 0, pointerEvents: 'none', scale: 0.96 });

      if (!isMotionReduced) {
        // --- HỒI I (Progress 0.00 -> 0.25) ---
        masterTl
          .fromTo(
            cameraEl,
            { rotateX: 4, rotateY: 0, z: -15 },
            { rotateX: 1, rotateY: 0, z: 25, duration: 1.0, ease: 'power1.out' },
            0
          )
          .fromTo(
            '.act1-seam',
            { scaleY: 0, transformOrigin: 'top center' },
            { scaleY: 1, duration: 0.7, ease: 'power2.out' },
            0.1
          )
          .fromTo(
            '.act1-left-panel',
            { rotateY: -35, x: -20, opacity: 0.8 },
            { rotateY: 0, x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' },
            0.15
          )
          .fromTo(
            '.act1-button-node',
            { scale: 0, opacity: 0, z: -10 },
            { scale: 1, opacity: 1, z: 12, stagger: 0.08, duration: 0.5, ease: 'back.out(1.5)' },
            0.3
          );

        // --- TRANSITION 1 -> 2 (Progress 0.25) ---
        masterTl
          .to('.stage-act-0', { opacity: 0, scale: 0.95, pointerEvents: 'none', duration: 0.25 }, 0.95)
          .to('.stage-act-1', { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.25 }, 1.05)
          .to(cameraEl, { rotateY: 7, rotateX: -2, z: 30, duration: 0.5, ease: 'power1.inOut' }, 1.0);

        // --- HỒI II (Progress 0.25 -> 0.50) ---
        masterTl
          .fromTo(
            '.act2-lemur-puff',
            { scale: 0.6, opacity: 0 },
            { scale: 1.15, opacity: 1, duration: 0.45, ease: 'power2.out' },
            1.15
          )
          .fromTo(
            '.act2-raglan-seam',
            { strokeDashoffset: 300, opacity: 0 },
            { strokeDashoffset: 0, opacity: 1, duration: 0.45, ease: 'power1.inOut' },
            1.4
          );

        // --- TRANSITION 2 -> 3 (Progress 0.50) ---
        masterTl
          .to('.stage-act-1', { opacity: 0, scale: 0.95, pointerEvents: 'none', duration: 0.25 }, 1.95)
          .to('.stage-act-2', { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.25 }, 2.05)
          .to(cameraEl, { rotateY: 0, rotateX: 0, z: 15, duration: 0.5, ease: 'power1.out' }, 2.0);

        // --- HỒI III (Progress 0.50 -> 0.75) ---
        masterTl.fromTo(
          '.act3-item',
          { y: 15, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
          2.15
        );

        // --- TRANSITION 3 -> 4 (Progress 0.75) ---
        masterTl
          .to('.stage-act-2', { opacity: 0, scale: 0.95, pointerEvents: 'none', duration: 0.25 }, 2.95)
          .to('.stage-act-3', { opacity: 1, scale: 1, pointerEvents: 'auto', duration: 0.25 }, 3.05)
          .to(cameraEl, { rotateX: -4, rotateY: 3, z: 35, duration: 0.5, ease: 'power2.out' }, 3.0);

        // --- HỒI IV (Progress 0.75 -> 1.00) ---
        masterTl
          .fromTo('.act4-cyber-grid', { opacity: 0 }, { opacity: 0.4, duration: 0.4 }, 3.15)
          .fromTo(
            '.act4-organza-layer',
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.4)' },
            3.25
          )
          .fromTo('.act4-his-bar', { width: '0%' }, { width: '98%', duration: 0.5, ease: 'power3.out' }, 3.4);

      } else {
        // Reduced Motion Timeline
        masterTl
          .to('.stage-act-0', { opacity: 0, duration: 0.3 }, 0.9)
          .to('.stage-act-1', { opacity: 1, duration: 0.3 }, 1.0)
          .to('.stage-act-1', { opacity: 0, duration: 0.3 }, 1.9)
          .to('.stage-act-2', { opacity: 1, duration: 0.3 }, 2.0)
          .to('.stage-act-2', { opacity: 0, duration: 0.3 }, 2.9)
          .to('.stage-act-3', { opacity: 1, duration: 0.3 }, 3.0)
          .fromTo('.act4-his-bar', { width: '0%' }, { width: '98%', duration: 0.4 }, 3.3);
      }
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [isMotionReduced]);

  // Smooth Auto-Play
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const step = (time: number) => {
      if (!isAutoPlaying || !pinSectionRef.current) return;
      const delta = time - lastTime;
      lastTime = time;

      const container = pinSectionRef.current;
      const start = container.offsetTop;
      const maxScroll = start + 2800;

      if (window.scrollY >= maxScroll - 15) {
        setIsAutoPlaying(false);
        return;
      }

      const scrollStep = (200 * delta) / 1000;
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

  useEffect(() => {
    const handleInterrupt = () => {
      if (isAutoPlaying) setIsAutoPlaying(false);
    };
    window.addEventListener('wheel', handleInterrupt, { passive: true });
    window.addEventListener('touchmove', handleInterrupt, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleInterrupt);
      window.removeEventListener('touchmove', handleInterrupt);
    };
  }, [isAutoPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        scrollToAct((currentAct + 1) % 4);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        scrollToAct((currentAct - 1 + 4) % 4);
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        setIsAutoPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAct]);

  const scrollToAct = (actIndex: number) => {
    if (!pinSectionRef.current) return;
    const target = pinSectionRef.current;
    const start = target.offsetTop;
    const targets = [0.05, 0.35, 0.65, 0.92];
    const targetScroll = start + 2800 * targets[actIndex];

    window.scrollTo({
      top: targetScroll,
      behavior: isMotionReduced ? 'auto' : 'smooth',
    });
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

  const activeStory = ACTS_NARRATIVES[currentAct] || ACTS_NARRATIVES[0];

  return (
    <div
      ref={rootRef}
      className="w-full relative bg-obsidian-900 text-[#E3E2E6] overflow-x-hidden select-none font-sans"
      role="region"
      aria-label="VibePhục Showcase"
    >
      {/* Screen Reader Skip Link */}
      <a
        href="#/atelier"
        onClick={(e) => {
          e.preventDefault();
          navigateRelative('atelier');
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-cyber-lime text-black font-mono font-bold rounded"
      >
        Chuyển thẳng tới Phòng Phối Đồ (Skip to Atelier)
      </a>

      {/* Top Hairline Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <div
          className="h-full bg-gradient-to-r from-heritage-hoang via-amber-300 to-cyber-lime transition-all duration-75"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* ========================================================================= */}
      {/* PINNED HERO CONTAINER (100DVH SPATIOUS EDITORIAL VIEWPORT)                */}
      {/* ========================================================================= */}
      <section
        ref={pinSectionRef}
        className="relative h-[100dvh] min-h-[580px] w-full overflow-hidden bg-obsidian-900 flex flex-col justify-between"
      >
        {/* Subtle Atmospheric Gradient */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${
            currentAct === 0
              ? 'bg-[radial-gradient(ellipse_at_top,#14243C_0%,#0E0F12_75%)]'
              : currentAct === 1
              ? 'bg-[radial-gradient(ellipse_at_top,#2E1A3C_0%,#0E0F12_75%)]'
              : currentAct === 2
              ? 'bg-[radial-gradient(ellipse_at_top,#3D141C_0%,#0E0F12_75%)]'
              : 'bg-[radial-gradient(ellipse_at_top,#0E2E18_0%,#0E0F12_75%)]'
          }`}
        />

        {/* ======================================================================= */}
        {/* STREAMLINED LUXURY HEADER (DE-CLUTTERED, BREATHING ROOM)               */}
        {/* ======================================================================= */}
        <header className="relative z-30 w-full px-4 sm:px-8 lg:px-14 py-2.5 sm:py-3.5 flex items-center justify-between border-b border-white/10 bg-obsidian-900/85 backdrop-blur-md shrink-0">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-heritage-son via-heritage-hoang to-amber-200 flex items-center justify-center shadow-md border border-amber-300/40">
              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
            </div>
            <div>
              <span className="text-sm sm:text-base lg:text-lg font-imperial font-bold tracking-wide text-white">
                VibePhục<span className="text-heritage-hoang"> Studio</span>
              </span>
            </div>
          </div>

          {/* Clean Primary Navigation Links (Zero-Pill Discipline) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono">
            <a
              href="#/atelier"
              onClick={(e) => { e.preventDefault(); navigateRelative('atelier'); }}
              className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Xưởng Atelier
            </a>
            <a
              href="#/ai-studio"
              onClick={(e) => { e.preventDefault(); navigateRelative('ai-studio'); }}
              className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Gemini AI
            </a>
            <a
              href="#/rules"
              onClick={(e) => { e.preventDefault(); navigateRelative('rules'); }}
              className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Điển Lệ
            </a>
            <a
              href="#/lookbooks"
              onClick={(e) => { e.preventDefault(); navigateRelative('lookbooks'); }}
              className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Lookbooks
            </a>
          </nav>

          {/* Controls Hub (Minimal, Functional) */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] sm:text-xs ${
                isAutoPlaying
                  ? 'bg-heritage-hoang text-black font-bold shadow'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
              title={isAutoPlaying ? 'Tạm dừng auto tour' : 'Chạy auto tour'}
            >
              {isAutoPlaying ? <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />}
              <span>{isAutoPlaying ? 'Đang Diễn' : 'Auto'}</span>
            </button>

            <button
              onClick={() => setUserForcedMotion(!isMotionReduced)}
              className={`p-1.5 sm:p-2 rounded-full border transition-colors cursor-pointer ${
                isMotionReduced
                  ? 'bg-amber-400/20 border-amber-400/50 text-amber-200'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
              }`}
              title="Chuyển đổi hiệu ứng chuyển động giảm thiểu"
            >
              <Sliders className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 sm:p-2 rounded-full text-neutral-400 hover:text-white bg-white/5 transition-colors cursor-pointer hidden md:block"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>

        {/* ======================================================================= */}
        {/* MAIN CINEMA STAGE: GENEROUS PADDING & BALANCED SCALE                    */}
        {/* ======================================================================= */}
        <div className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-2 sm:py-4 flex flex-col md:grid md:grid-cols-12 items-center gap-4 sm:gap-6 lg:gap-14 my-auto overflow-hidden">
          
          {/* --------------------------------------------------------------------- */}
          {/* LEFT NARRATIVE COLUMN (UNBOXED, REFINED TYPOGRAPHY)                   */}
          {/* --------------------------------------------------------------------- */}
          <div className="w-full md:col-span-5 flex flex-col justify-center order-2 md:order-1 min-h-[140px] sm:min-h-[180px] md:min-h-[260px]">
            <div
              key={currentAct}
              className="space-y-2 sm:space-y-3.5 transition-opacity duration-300 animate-fadeIn"
            >
              {/* Unboxed Minimal Kicker */}
              <div className="text-[10px] sm:text-xs font-mono font-semibold tracking-widest text-heritage-hoang uppercase">
                {activeStory.era}
              </div>

              {/* Regal Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-imperial font-bold text-white tracking-tight leading-snug sm:leading-tight">
                {activeStory.titleMain} <br className="hidden sm:inline" />
                <span className={`font-imperial ${activeStory.titleSubColor}`}>
                  {activeStory.titleSub}
                </span>
              </h1>

              {/* Story Excerpt */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans max-w-md line-clamp-3 sm:line-clamp-none">
                {activeStory.desc}
              </p>

              {/* Clean Actions (No Clutter, 1 Primary + 1 Secondary) */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
                <a
                  href={`#/${activeStory.primaryAction.route}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigateRelative(activeStory.primaryAction.route);
                  }}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-heritage-hoang hover:bg-amber-400 text-black font-bold text-xs font-mono flex items-center gap-1.5 sm:gap-2 shadow-heritage-glow transition-all cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{activeStory.primaryAction.label}</span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </a>

                {activeStory.secondaryAction && (
                  <a
                    href={`#/${activeStory.secondaryAction.route}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (activeStory.secondaryAction) {
                        navigateRelative(activeStory.secondaryAction.route);
                      }
                    }}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {activeStory.secondaryAction.icon === 'book' && <BookOpen className="w-3.5 h-3.5 text-amber-300" />}
                    {activeStory.secondaryAction.icon === 'wand' && <Wand2 className="w-3.5 h-3.5 text-cyber-lime" />}
                    {activeStory.secondaryAction.icon === 'layers' && <Layers className="w-3.5 h-3.5 text-heritage-hoang" />}
                    <span>{activeStory.secondaryAction.label}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT 2D VISUAL STAGE: CLEAN, FOCUSED COSTUME CANVAS                  */}
          {/* --------------------------------------------------------------------- */}
          <div
            ref={cameraRigRef}
            className="w-full md:col-span-7 flex items-center justify-center order-1 md:order-2 shrink-0"
            style={{
              perspective: '1200px',
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            <div className="relative w-full max-w-lg h-[210px] sm:h-[290px] md:h-[350px] lg:h-[400px] rounded-2xl bg-obsidian-900/90 border border-amber-500/20 p-2 sm:p-5 flex flex-col items-center justify-center shadow-2xl overflow-hidden backdrop-blur-md">
              
              {/* STAGE 0: CHÍNH TRUNG & HỮU NHẬM (HỒI I) */}
              <div className="stage-act-0 absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4">
                <div className="relative w-44 sm:w-56 md:w-64 h-48 sm:h-64 md:h-72 flex items-center justify-center scale-90 sm:scale-100">
                  <div
                    ref={leftPanelRef}
                    className="act1-left-panel absolute left-2 sm:left-4 top-4 sm:top-6 bottom-4 sm:bottom-6 w-20 sm:w-24 bg-gradient-to-r from-[#0C1E3A] to-[#1E3A8A] border-y border-l border-heritage-hoang/50 rounded-l-lg shadow-2xl z-20"
                    style={{ transformOrigin: 'left center' }}
                  />
                  <div
                    ref={rightPanelRef}
                    className="act1-right-panel absolute right-2 sm:right-4 top-4 sm:top-6 bottom-4 sm:bottom-6 w-20 sm:w-24 bg-gradient-to-l from-[#0C1E3A] to-[#1E3A8A] border-y border-r border-heritage-hoang/50 rounded-r-lg shadow-xl z-10"
                  />
                  {/* High Standing Collar */}
                  <div className="absolute top-1 w-20 sm:w-24 h-7 sm:h-8 rounded-t-md bg-[#0F172A] border-2 border-heritage-hoang z-30 flex items-center justify-center shadow-lg">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-200">Cổ Lập Lĩnh</span>
                  </div>

                  {/* Golden Seamline */}
                  <div className="act1-seam absolute inset-y-4 left-1/2 -translate-x-1/2 w-1.5 bg-gradient-to-b from-amber-100 via-heritage-hoang to-amber-500 z-30 shadow-heritage-glow" />

                  {/* 5 Buttons */}
                  <div className="absolute top-10 sm:top-14 right-6 sm:right-8 flex flex-col gap-2.5 sm:gap-4 z-40">
                    {['Nhân', 'Lễ', 'Nghĩa', 'Trí', 'Tín'].map((virtue) => (
                      <div
                        key={virtue}
                        className="act1-button-node w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-heritage-hoang border border-amber-100 flex items-center justify-center shadow text-[7px] sm:text-[8px] font-mono font-bold text-black"
                        title={virtue}
                      >
                        {virtue[0]}
                      </div>
                    ))}
                  </div>

                  {/* Clean Watermark */}
                  <div className="absolute bottom-1 z-30 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-black/80 border border-heritage-hoang/40 text-[9px] sm:text-[10px] font-mono text-heritage-hoang flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Hữu Nhậm: Vạt Trái đè Phải</span>
                  </div>
                </div>
              </div>

              {/* STAGE 1: LE MUR & RAGLAN (HỒI II) */}
              <div className="stage-act-1 absolute inset-0 flex flex-col items-center justify-center p-2 sm:p-4">
                <div className="relative w-44 sm:w-56 md:w-64 h-48 sm:h-64 md:h-72 flex items-center justify-center scale-90 sm:scale-100">
                  <div className="w-40 sm:w-48 h-52 sm:h-64 rounded-xl bg-gradient-to-b from-purple-950 via-indigo-950 to-obsidian-900 border border-purple-500/40 p-3 sm:p-4 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                    <div className="w-22 sm:w-24 h-5 sm:h-6 mx-auto rounded-full bg-purple-900 border border-purple-300 flex items-center justify-center text-[9px] sm:text-[10px] font-mono text-purple-200">
                      Cổ Bẻ Lá Sen
                    </div>

                    {/* Vai Bồng */}
                    <div className="act2-lemur-puff absolute -top-1 -left-2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-purple-700/60 border border-purple-300 shadow-md" />
                    <div className="act2-lemur-puff absolute -top-1 -right-2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-purple-700/60 border border-purple-300 shadow-md" />

                    {/* Raglan Seams SVG */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 260">
                      <line x1="70" y1="30" x2="15" y2="95" stroke="#CCFF00" strokeWidth="2" strokeDasharray="5 3" className="act2-raglan-seam" />
                      <line x1="130" y1="30" x2="185" y2="95" stroke="#CCFF00" strokeWidth="2" strokeDasharray="5 3" className="act2-raglan-seam" />
                    </svg>

                    <div className="my-auto space-y-1 text-center z-20">
                      <div className="text-xs sm:text-sm font-bold text-white font-imperial">Ráp Tay Raglan (1960s)</div>
                      <div className="text-[9px] sm:text-[10px] text-purple-200 font-mono">Nối xéo triệt tiêu nếp nhăn nách</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAGE 2: 4 VÙNG MIỀN (HỒI III - NO HORIZONTAL SCROLL) */}
              <div className="stage-act-2 absolute inset-0 p-2 sm:p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-rose-300 font-semibold border-b border-rose-500/20 pb-1">
                  <span>TỨ TRỤ CỔ PHỤC</span>
                  <span className="text-[9px] sm:text-[10px] text-neutral-400">4 Miền Di Sản</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 sm:gap-3 my-auto">
                  <div className="act3-item rounded-lg bg-emerald-950/60 border border-emerald-500/30 p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2">
                    <div className="w-8 sm:w-10 h-10 sm:h-12 shrink-0 overflow-hidden">
                      <TuThanArtwork className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-[11px] font-bold font-imperial text-emerald-300 truncate">Áo Tứ Thân</div>
                      <div className="text-[8px] sm:text-[9px] text-neutral-400 truncate">Kinh Bắc · Yếm đào</div>
                    </div>
                  </div>

                  <div className="act3-item rounded-lg bg-rose-950/60 border border-rose-500/30 p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2">
                    <div className="w-8 sm:w-10 h-10 sm:h-12 shrink-0 overflow-hidden">
                      <NhatBinhArtwork className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-[11px] font-bold font-imperial text-rose-300 truncate">Áo Nhật Bình</div>
                      <div className="text-[8px] sm:text-[9px] text-neutral-400 truncate">Hoàng tộc · Ngũ sắc</div>
                    </div>
                  </div>

                  <div className="act3-item rounded-lg bg-sky-950/60 border border-sky-500/30 p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2">
                    <div className="w-8 sm:w-10 h-10 sm:h-12 shrink-0 overflow-hidden">
                      <BaBaArtwork className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-[11px] font-bold font-imperial text-sky-300 truncate">Áo Bà Ba</div>
                      <div className="text-[8px] sm:text-[9px] text-neutral-400 truncate">Nam Bộ · Khăn rằn</div>
                    </div>
                  </div>

                  <div className="act3-item rounded-lg bg-amber-950/60 border border-amber-500/30 p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2">
                    <div className="w-8 sm:w-10 h-10 sm:h-12 shrink-0 overflow-hidden">
                      <AoTacArtwork className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] sm:text-[11px] font-bold font-imperial text-amber-300 truncate">Áo Tấc Đại Lễ</div>
                      <div className="text-[8px] sm:text-[9px] text-neutral-400 truncate">Tay thụng · Cung đình</div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[9px] sm:text-[10px] font-mono text-neutral-400 pt-0.5">
                  Khám phá toàn bộ 4 sắc phục trong Xưởng Atelier
                </div>
              </div>

              {/* STAGE 3: GEN Z METAMORPHOSIS (HỒI IV) */}
              <div className="stage-act-3 absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4">
                <div className="relative w-full h-full rounded-xl bg-cyber-lime/10 border border-cyber-lime/40 p-3 sm:p-4 flex flex-col justify-between shadow-cyber-glow overflow-hidden">
                  <div className="act4-cyber-grid absolute inset-x-0 bottom-0 h-24 sm:h-28 bg-[linear-gradient(to_right,#CCFF0015_1px,transparent_1px),linear-gradient(to_bottom,#CCFF0015_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-cyber-lime font-bold z-10">
                    <span>STREETWEAR</span>
                    <span>GEN Z FUSION</span>
                  </div>

                  <div className="act4-organza-layer text-center my-auto z-10 space-y-1">
                    <div className="text-sm sm:text-base font-bold text-white font-imperial">
                      Ngũ Thân × Cyber Organza Trench
                    </div>
                    <p className="text-[11px] sm:text-xs text-neutral-300 max-w-xs mx-auto">
                      Lụa tơ truyền thống hòa quyện cùng áo khoác mỏng xuyên thấu và chunky sneaker
                    </p>
                  </div>

                  <div className="bg-black/90 p-2 sm:p-2.5 rounded-lg border border-cyber-lime/30 z-10">
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono">
                      <span className="text-neutral-400">Heritage Integrity:</span>
                      <span className="text-cyber-lime font-bold">98% Chuẩn Mực</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                      <div className="act4-his-bar h-full bg-gradient-to-r from-heritage-hoang via-cyber-lime to-cyber-jade w-0 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* STREAMLINED CHAPTER SELECTOR BAR (MINIMAL FOOTER)                       */}
        {/* ======================================================================= */}
        <footer className="relative z-30 w-full px-4 sm:px-8 lg:px-14 py-2 sm:py-2.5 border-t border-white/10 bg-obsidian-900/85 backdrop-blur-md flex items-center justify-between text-xs font-mono shrink-0">
          <div className="flex items-center gap-2 sm:gap-4">
            {[
              { index: 0, short: '01', full: '01 · Khởi Thủy' },
              { index: 1, short: '02', full: '02 · 100 Năm Áo Dài' },
              { index: 2, short: '03', full: '03 · 4 Miền' },
              { index: 3, short: '04', full: '04 · Gen Z' },
            ].map((item) => (
              <button
                key={item.index}
                onClick={() => scrollToAct(item.index)}
                className={`py-1 text-xs transition-colors cursor-pointer ${
                  currentAct === item.index
                    ? 'text-heritage-hoang font-bold border-b border-heritage-hoang'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span className="sm:hidden">{item.short}</span>
                <span className="hidden sm:inline">{item.full}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollToAct((currentAct + 1) % 4)}
              className="text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] sm:text-xs"
            >
              <span>{currentAct < 3 ? 'Hồi Tiếp' : 'Đầu'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${currentAct === 3 ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </footer>
      </section>

      {/* ========================================================================= */}
      {/* DISCOVERY GRID AT BOTTOM                                                  */}
      {/* ========================================================================= */}
      <section className="relative z-30 max-w-6xl mx-auto px-6 sm:px-10 py-12 border-t border-white/10 bg-obsidian-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyber-lime font-bold block">
              HỆ SINH THÁI VIBEPHỤC
            </span>
            <h3 className="text-2xl font-bold font-imperial text-white mt-1">
              Phòng Thử Đồ & Định Chuẩn Di Sản
            </h3>
          </div>

          <button
            onClick={() => navigateRelative('atelier')}
            className="px-6 py-2.5 rounded-full bg-cyber-lime hover:bg-lime-400 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-cyber-glow cursor-pointer w-fit"
          >
            <Layers className="w-4 h-4" />
            <span>Vào Xưởng Atelier 2D</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <a
            href="#/atelier"
            onClick={(e) => { e.preventDefault(); navigateRelative('atelier'); }}
            className="p-4 rounded-xl bg-obsidian-800/80 border border-white/10 hover:border-cyber-lime/40 transition-all flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <h4 className="font-imperial font-bold text-base text-white">Xưởng Phối Đồ AI 2D</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Phối đồ ma-nơ-canh 2D theo điển chế trang nghiêm.
              </p>
            </div>
            <span className="text-xs font-mono text-cyber-lime mt-3 flex items-center gap-1">
              Mở Atelier <ArrowRight className="w-3 h-3" />
            </span>
          </a>

          <a
            href="#/ai-studio"
            onClick={(e) => { e.preventDefault(); navigateRelative('ai-studio'); }}
            className="p-4 rounded-xl bg-obsidian-800/80 border border-white/10 hover:border-purple-500/40 transition-all flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <h4 className="font-imperial font-bold text-base text-white">Gemini AI Studio</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Tạo sinh & phối đồ thông minh với Gemini 3.8.
              </p>
            </div>
            <span className="text-xs font-mono text-purple-300 mt-3 flex items-center gap-1">
              Mở AI Studio <ArrowRight className="w-3 h-3" />
            </span>
          </a>

          <a
            href="#/rules"
            onClick={(e) => { e.preventDefault(); navigateRelative('rules'); }}
            className="p-4 rounded-xl bg-obsidian-800/80 border border-white/10 hover:border-heritage-hoang/40 transition-all flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <div className="flex items-center gap-1.5 text-heritage-hoang text-xs font-mono font-bold uppercase mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Wiki Cổ Phục & Timelines</span>
              </div>
              <h4 className="font-imperial font-bold text-base text-white">Bách Khoa Cổ Phục</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Niên biểu lịch sử qua các triều đại, chi tiết 6 hệ trang phục và quy thức Hữu Nhậm.
              </p>
            </div>
            <span className="text-xs font-mono text-heritage-hoang mt-3 flex items-center gap-1">
              Khám Phá Wiki & Timelines <ArrowRight className="w-3 h-3" />
            </span>
          </a>

          <a
            href="#/lookbooks"
            onClick={(e) => { e.preventDefault(); navigateRelative('lookbooks'); }}
            className="p-4 rounded-xl bg-obsidian-800/80 border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col justify-between min-h-[140px]"
          >
            <div>
              <h4 className="font-imperial font-bold text-base text-white">Kho Lookbooks</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Bộ sưu tập cổ phục lưu trữ Cloud Firestore.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-300 mt-3 flex items-center gap-1">
              Xem Lookbooks <ArrowRight className="w-3 h-3" />
            </span>
          </a>
        </div>
      </section>
    </div>
  );
};
