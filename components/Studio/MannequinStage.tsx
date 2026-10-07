'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Zap,
  Info,
  Maximize2,
  Lock,
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { OutfitState, GarmentItem, AccessoryItem, HeritageValidationResult } from '../../types/vibephuc';
import { GARMENT_CATALOG, ACCESSORY_CATALOG } from '../../data/heritageCatalog';
import { validateOutfit } from '../../lib/guardrails';

export interface MannequinStageProps {
  outfit: OutfitState;
  onUpdateOutfit?: (updater: (prev: OutfitState) => OutfitState) => void;
  onTaNhamViolation?: () => void;
  className?: string;
  catalog?: GarmentItem[];
  accessories?: AccessoryItem[];
}

export const MannequinStage: React.FC<MannequinStageProps> = ({
  outfit,
  onUpdateOutfit,
  onTaNhamViolation,
  className = '',
  catalog = GARMENT_CATALOG,
  accessories = ACCESSORY_CATALOG
}) => {
  // Local stage state
  const [isXRayMode, setIsXRayMode] = useState<boolean>(outfit.isXRayMode || false);
  const [isTaNhamViolated, setIsTaNhamViolated] = useState<boolean>(false);
  const [snapTriggerCount, setSnapTriggerCount] = useState<number>(0);
  const [activeAnatomyNode, setActiveAnatomyNode] = useState<string | null>(null);

  const lapelControls = useAnimation();
  const mannequinControls = useAnimation();

  // Resolve active garment & accessories
  const coreGarment = useMemo(() => {
    return (
      catalog.find(g => g.id === outfit.outerId) ||
      catalog.find(g => g.id === outfit.baseId) ||
      catalog[0]
    );
  }, [catalog, outfit.baseId, outfit.outerId]);

  const bottomGarment = useMemo(() => {
    if (!outfit.bottomId) return null;
    return catalog.find(g => g.id === outfit.bottomId) || null;
  }, [catalog, outfit.bottomId]);

  const activeAccessories = useMemo(() => {
    return (outfit.accessoryIds || [])
      .map(id => accessories.find(a => a.id === id))
      .filter((a): a is AccessoryItem => Boolean(a));
  }, [accessories, outfit.accessoryIds]);

  // Realtime Deterministic Validation
  const validationResult: HeritageValidationResult = useMemo(() => {
    return validateOutfit(outfit, catalog);
  }, [outfit, catalog]);

  const hisScore = validationResult.score;

  // Toggle X-Ray mode and sync
  const toggleXRay = useCallback(() => {
    setIsXRayMode(prev => {
      const next = !prev;
      onUpdateOutfit?.(o => ({ ...o, isXRayMode: next }));
      return next;
    });
  }, [onUpdateOutfit]);

  // Global hotkey: Space bar toggles X-Ray mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        toggleXRay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleXRay]);

  // ==========================================================================
  // "MAGNETIC HỮU NHẬM SNAP" PHYSICS ENGINE
  // ==========================================================================
  const triggerTaNhamSnapBack = useCallback(async () => {
    setIsTaNhamViolated(true);
    setSnapTriggerCount(c => c + 1);

    // 1. Notify Athenya Persona assistant
    onTaNhamViolation?.();

    // 2. Shake mannequin violently (Đại kỵ tang ma phản vệ)
    mannequinControls.start({
      x: [0, -15, 12, -8, 6, 0],
      transition: { duration: 0.45, ease: 'easeInOut' }
    });

    // 3. Lapel flap vibrates and snaps forcefully back to RIGHT (Hữu Nhậm)
    await lapelControls.start({
      x: [0, -28, 20, -12, 8, 0],
      transition: { duration: 0.5 }
    });

    // 4. Spring magnetic snap back to original Hữu Nhậm position
    await lapelControls.start({
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 600,
        damping: 22
      }
    });

    // Clear alert flag after 2.5s
    setTimeout(() => {
      setIsTaNhamViolated(false);
    }, 2500);
  }, [lapelControls, mannequinControls, onTaNhamViolation]);

  // Handle lapel manual dragging
  const handleLapelDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -25) {
      // User dragged to the LEFT (Attempting Tả Nhậm)
      triggerTaNhamSnapBack();
    } else {
      // Snap naturally back to Hữu Nhậm
      lapelControls.start({
        x: 0,
        transition: { type: 'spring', stiffness: 500, damping: 25 }
      });
    }
  };

  // Helper to extract hex string safely
  const resolveHex = (val: unknown, fallback: string): string => {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object' && 'hex' in val && typeof (val as any).hex === 'string') {
      return (val as any).hex;
    }
    return fallback;
  };

  // Garment main color resolution
  const garmentColor: string = resolveHex(
    outfit.customColors?.[coreGarment.id] ||
      outfit.customColors?.['core'] ||
      coreGarment.defaultColor,
    '#C53030'
  );

  const bottomColor: string = resolveHex(
    outfit.customColors?.[bottomGarment?.id || ''] ||
      outfit.customColors?.['bottom'] ||
      bottomGarment?.defaultColor,
    '#F8FAFC'
  );

  // Circular gauge geometry
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (hisScore / 100) * circumference;

  const hisColor =
    hisScore >= 90 ? '#10B981' : hisScore >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div
      className={`relative w-full rounded-m3-lg bg-obsidian-900 border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between ${className}`}
      style={{ minHeight: '680px' }}
    >
      {/* Subtle Background Grid & Halftone Lacquer Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-halftone-dot" />

      {/* Atmospheric Ambient Rim Lighting */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-700"
        style={{
          backgroundColor: isTaNhamViolated
            ? 'rgba(197, 48, 48, 0.35)'
            : isXRayMode
            ? 'rgba(214, 158, 46, 0.25)'
            : 'rgba(30, 58, 138, 0.2)'
        }}
      />

      {/* ==================================================================== */}
      {/* 1. TOP HUD BAR: HIS Radial Progress Gauge & Quick Controls           */}
      {/* ==================================================================== */}
      <div className="relative z-20 px-5 py-4 border-b border-white/10 flex items-center justify-between backdrop-blur-md bg-obsidian-800/60">
        {/* Left: HIS Gauge (Heritage Integrity Score) */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 96 96">
              {/* Background circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-white/10 fill-none"
                strokeWidth="7"
              />
              {/* Dynamic progress circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="fill-none transition-all duration-700 ease-out"
                stroke={hisColor}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
              <span className="text-xs font-black text-white">{hisScore}</span>
              <span className="text-[7px] text-gray-400 font-bold uppercase -mt-0.5">HIS</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-imperial font-bold text-sm text-white">
                {validationResult.status === 'PASSED'
                  ? 'Điển Lễ Hoàn Hảo'
                  : validationResult.status === 'WARNING'
                  ? 'Cần Chỉnh Thước'
                  : 'Đại Kỵ Quy Thức'}
              </span>
              {validationResult.status === 'PASSED' ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-500 animate-bounce" />
              )}
            </div>
            <p className="text-[11px] font-mono text-gray-400">
              Quy thức: <span className="text-heritage-hoang">Hữu Nhậm 5 Cúc</span>
            </p>
          </div>
        </div>

        {/* Right: X-Ray Scanner & Reset Lapel Controls */}
        <div className="flex items-center gap-2">
          {/* X-Ray Anatomy Mode Toggle */}
          <button
            type="button"
            onClick={toggleXRay}
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isXRayMode
                ? 'bg-heritage-hoang text-obsidian-900 shadow-heritage-glow scale-105'
                : 'bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10'
            }`}
            title="Nhấn phím Space để bật/tắt X-Ray"
          >
            {isXRayMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-cyber-lime" />}
            <span>X-Ray Anatomy</span>
            <span className="hidden sm:inline text-[9px] px-1.5 py-0.2 rounded bg-black/30 font-mono">
              [Space]
            </span>
          </button>

          {/* Test Ta Nham Taboo Action */}
          <button
            type="button"
            onClick={triggerTaNhamSnapBack}
            className="p-1.5 rounded-full bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
            title="Thử kéo vạt sang trái để kích hoạt Magnetic Snap"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. TA NHAM TABOO INSTANT FLOATING BANNER                             */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isTaNhamViolated && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="absolute top-20 left-4 right-4 z-40 p-3 rounded-m3-md bg-heritage-son/90 border border-rose-400 text-white shadow-2xl backdrop-blur-md flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-yellow-300 animate-pulse shrink-0" />
              <div>
                <p className="font-imperial font-bold text-xs uppercase tracking-wider text-yellow-200">
                  Cảnh Báo Đại Kỵ Tang Ma: Tả Nhậm (左衽)
                </p>
                <p className="text-[11px] text-gray-100">
                  Người sống chỉ gài vạt sang phải. Từ trường đã tự động snap vạt áo về Hữu Nhậm!
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 text-yellow-300 shrink-0">
              Snap #{snapTriggerCount}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 3. 2D VECTOR MANNEQUIN STAGE (Z-INDEX STACKING)                      */}
      {/* ==================================================================== */}
      <div className="relative flex-1 flex items-center justify-center p-4 min-h-[500px]">
        {/* Mannequin Container with Shake Physics */}
        <motion.div
          animate={mannequinControls}
          className="relative w-full max-w-[340px] h-[520px] flex items-center justify-center select-none"
        >
          {/* SVG Vector Stage */}
          <svg
            viewBox="0 0 400 680"
            className="w-full h-full filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Neon Glow Filters */}
              <filter id="heritageGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="errorGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComponentTransfer in="blur" result="glow">
                  <feFuncA type="linear" slope="0.8" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Fabric Gradients */}
              <linearGradient id="mannequinSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E2026" />
                <stop offset="50%" stopColor="#16181D" />
                <stop offset="100%" stopColor="#0E0F12" />
              </linearGradient>

              <linearGradient id="lacquerShine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
              </linearGradient>
            </defs>

            {/* -------------------------------------------------------------- */}
            {/* MANNEQUIN SILHOUETTE (ANATOMICAL BASE)                         */}
            {/* -------------------------------------------------------------- */}
            <g id="mannequin-body" opacity={isXRayMode ? 0.35 : 0.85}>
              {/* Head & Neck */}
              <ellipse cx="200" cy="55" rx="30" ry="38" fill="url(#mannequinSkin)" stroke="#3A3D47" strokeWidth="1.5" />
              <path d="M190 90 L190 115 L210 115 L210 90 Z" fill="url(#mannequinSkin)" />

              {/* Shoulders & Torso */}
              <path
                d="M130 130 C155 118 245 118 270 130 L255 350 C240 370 160 370 145 350 Z"
                fill="url(#mannequinSkin)"
                stroke="#2E323D"
                strokeWidth="1.5"
              />

              {/* Arms */}
              <path d="M130 130 L95 270 L110 370 L125 365 L115 275 L145 155 Z" fill="url(#mannequinSkin)" opacity="0.9" />
              <path d="M270 130 L305 270 L290 370 L275 365 L285 275 L255 155 Z" fill="url(#mannequinSkin)" opacity="0.9" />

              {/* Legs */}
              <path d="M160 370 L150 560 L140 635 L175 635 L185 560 L190 370 Z" fill="url(#mannequinSkin)" opacity="0.7" />
              <path d="M240 370 L250 560 L260 635 L225 635 L215 560 L210 370 Z" fill="url(#mannequinSkin)" opacity="0.7" />
            </g>

            {/* -------------------------------------------------------------- */}
            {/* Z-1: HẠ Y (QUẦN THỤNG / CHÂN VÁY / CARGO)                       */}
            {/* -------------------------------------------------------------- */}
            <g id="layer-z1-bottom" opacity={isXRayMode ? 0.2 : 1}>
              {outfit.bottomId ? (
                <path
                  d="M150 340 L125 625 L185 625 L200 420 L215 625 L275 625 L250 340 Z"
                  fill={bottomColor}
                  stroke="rgba(0,0,0,0.3)"
                  strokeWidth="1.5"
                  className="transition-colors duration-300"
                />
              ) : (
                /* Missing pants warning outline */
                <g>
                  <path
                    d="M150 340 L125 625 L185 625 L200 420 L215 625 L275 625 L250 340 Z"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                  <text x="200" y="500" textAnchor="middle" fill="#EF4444" fontSize="11" fontFamily="monospace" fontWeight="bold">
                    [THIẾU HẠ Y ĐOAN CHÍNH]
                  </text>
                </g>
              )}
            </g>

            {/* -------------------------------------------------------------- */}
            {/* Z-2: ÁO TRUNG ĐƠN LÓT TRONG (VIỀN CỔ LẬP LĨNH 1.5mm)            */}
            {/* -------------------------------------------------------------- */}
            <g id="layer-z2-base">
              {/* White collar lining protruding 2mm */}
              <path
                d="M178 108 C192 104 208 104 222 108 L225 125 C210 128 190 128 175 125 Z"
                fill="#FFFFFF"
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <path d="M175 125 L190 240 L210 240 L225 125 Z" fill="#F8FAFC" opacity={isXRayMode ? 0.3 : 0.8} />
            </g>

            {/* -------------------------------------------------------------- */}
            {/* Z-3: ÁO CHÍNH (NGŨ THÂN, ÁO TẤC, NHẬT BÌNH, ÁO DÀI, BÀ BA)      */}
            {/* -------------------------------------------------------------- */}
            <g id="layer-z3-core" opacity={isXRayMode ? 0.25 : 1} className="transition-opacity duration-300">
              {/* Sleeves: Adapt to Wide Tay Thụ vs Fitted Tay Chẽn */}
              {coreGarment.category === 'NGU_THAN' && coreGarment.id === 'ao-tac-tay-thu' ? (
                /* Áo Tấc Wide Ceremonial Sleeves */
                <g>
                  <path d="M135 128 L50 250 L65 420 L135 320 L145 155 Z" fill={garmentColor} stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
                  <path d="M265 128 L350 250 L335 420 L265 320 L255 155 Z" fill={garmentColor} stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
                </g>
              ) : (
                /* Tay Chẽn / Áo Dài / Bà Ba Standard Fitted Sleeves */
                <g>
                  <path d="M135 128 L95 260 L110 365 L125 360 L118 268 L145 155 Z" fill={garmentColor} stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
                  <path d="M265 128 L305 260 L290 365 L275 360 L282 268 L255 155 Z" fill={garmentColor} stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
                </g>
              )}

              {/* Main Body Panels (Vạt áo) */}
              <path
                d="M140 125 C170 115 230 115 260 125 L275 480 C240 500 160 500 125 480 Z"
                fill={garmentColor}
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="1.5"
              />

              {/* Collar Rendering (Lập Lĩnh vs Nhật Bình vs Giao Lĩnh) */}
              {coreGarment.collarType === 'CHU_NHAT' ? (
                /* Nhật Bình rectangular chest embroidery plate */
                <rect x="175" y="115" width="50" height="150" fill="#D69E2E" stroke="#C53030" strokeWidth="2.5" />
              ) : coreGarment.collarType === 'GIAO_LINH' ? (
                /* Giao Lĩnh Cross Collar */
                <path d="M175 110 L230 190 M225 110 L170 190" stroke="#F8FAFC" strokeWidth="3" />
              ) : (
                /* Cổ Lập Lĩnh Đứng 2-3cm */
                <path d="M178 112 C192 108 208 108 222 112 L224 126 C210 128 190 128 176 126 Z" fill={garmentColor} stroke="#D69E2E" strokeWidth="1.5" />
              )}
            </g>

            {/* -------------------------------------------------------------- */}
            {/* Z-4: NẸP CÚC & HƯỚNG VẠT (MAGNETIC HỮU NHẬM SNAP DRAG LAYER)     */}
            {/* -------------------------------------------------------------- */}
            <motion.g
              id="layer-z4-lapel"
              animate={lapelControls}
              drag="x"
              dragConstraints={{ left: -50, right: 30 }}
              dragElastic={0.3}
              onDragEnd={handleLapelDragEnd}
              className="cursor-ew-resize transform-gpu will-change-transform"
            >
              {/* Lapel Curve (Hữu Nhậm: Wraps to the right underarm) */}
              <path
                d="M200 126 C200 160 220 180 235 200 L235 480"
                stroke={isTaNhamViolated ? '#EF4444' : '#D69E2E'}
                strokeWidth="2.5"
                fill="none"
                filter={isTaNhamViolated ? 'url(#errorGlow)' : undefined}
              />

              {/* 5 Buttons (Ngũ Luân: Quân Thần, Phụ Tử, Phu Thê, Huynh Đệ, Bằng Hữu) */}
              {[
                { y: 130, x: 205, label: 'Quân Thần (Nhân)' },
                { y: 165, x: 218, label: 'Phụ Tử (Lễ)' },
                { y: 200, x: 232, label: 'Phu Thê (Nghĩa)' },
                { y: 260, x: 235, label: 'Huynh Đệ (Trí)' },
                { y: 320, x: 235, label: 'Bằng Hữu (Tín)' }
              ].map((btn, idx) => (
                <g
                  key={idx}
                  className="cursor-pointer group"
                  onClick={() => setActiveAnatomyNode(btn.label)}
                >
                  {/* Button Glow Halo in X-Ray mode */}
                  {isXRayMode && (
                    <circle
                      cx={btn.x}
                      cy={btn.y}
                      r="9"
                      fill="none"
                      stroke="#CCFF00"
                      strokeWidth="1.5"
                      className="animate-ping opacity-75"
                    />
                  )}
                  {/* Button Node */}
                  <circle
                    cx={btn.x}
                    cy={btn.y}
                    r="4.5"
                    fill={isXRayMode ? '#CCFF00' : '#D69E2E'}
                    stroke="#0E0F12"
                    strokeWidth="1.5"
                    filter={isXRayMode ? 'url(#heritageGlow)' : undefined}
                  />
                </g>
              ))}
            </motion.g>

            {/* -------------------------------------------------------------- */}
            {/* Z-5: ÁO KHOÁC ĐƯƠNG ĐẠI (CYBER ORGANZA TRENCH COAT)             */}
            {/* -------------------------------------------------------------- */}
            {outfit.outerId && outfit.outerId.includes('cyber') && (
              <g id="layer-z5-outer" opacity={isXRayMode ? 0.1 : 0.75}>
                <path
                  d="M130 120 L270 120 L285 520 L240 530 L220 220 L180 220 L160 530 L115 520 Z"
                  fill="none"
                  stroke="#00F5D4"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="backdrop-blur-sm"
                />
              </g>
            )}

            {/* -------------------------------------------------------------- */}
            {/* Z-6: PHỤ KIỆN (NÓN QUAI THAO, KIỀNG BẠC, KHĂN RẰN)              */}
            {/* -------------------------------------------------------------- */}
            <g id="layer-z6-accessories">
              {/* Kiềng Bạc Chạm Sen Cổ Áo */}
              {outfit.accessoryIds?.includes('acc-kieng-bac') && (
                <path
                  d="M182 128 C194 135 206 135 218 128"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#heritageGlow)"
                />
              )}

              {/* Nón Quai Thao (Đỉnh đầu) */}
              {outfit.accessoryIds?.includes('acc-non-quai-thao') && (
                <g>
                  <ellipse cx="200" cy="30" rx="90" ry="24" fill="#D69E2E" stroke="#854D0E" strokeWidth="2" />
                  <path d="M125 35 L125 150 M275 35 L275 150" stroke="#C53030" strokeWidth="2.5" />
                </g>
              )}

              {/* Khăn Rằn Caro Quàng Cổ */}
              {outfit.accessoryIds?.includes('acc-khan-ran') && (
                <path
                  d="M170 125 L160 380 L180 380 L188 150 M230 125 L240 380 L220 380 L212 150"
                  stroke="#38BDF8"
                  strokeWidth="6"
                  strokeDasharray="4 3"
                  fill="none"
                />
              )}
            </g>

            {/* -------------------------------------------------------------- */}
            {/* X-RAY ANATOMY SKELETAL OVERLAY (SỐNG LƯNG CHÍNH TRUNG & 5 CÚC) */}
            {/* -------------------------------------------------------------- */}
            {isXRayMode && (
              <g id="layer-xray-anatomy" className="pointer-events-none">
                {/* 1. Sống Lưng Chính Trung (Chính trực, quang minh) */}
                <line
                  x1="200"
                  y1="110"
                  x2="200"
                  y2="480"
                  stroke="#D69E2E"
                  strokeWidth="3.5"
                  strokeDasharray="6 3"
                  filter="url(#heritageGlow)"
                  className="animate-pulse"
                />
                <text x="208" y="270" fill="#D69E2E" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  SỐNG LƯNG CHÍNH TRUNG
                </text>

                {/* 2. Thân Thứ 5 Che Chắn (Thân trong) */}
                <path
                  d="M175 130 L170 360 L200 360 L200 130 Z"
                  fill="none"
                  stroke="#00F5D4"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <text x="135" y="320" fill="#00F5D4" fontSize="8" fontFamily="monospace">
                  THÂN THỨ 5 (NỘI VẠT)
                </text>
              </g>
            )}
          </svg>

          {/* Interactive Lapel Drag Helper Badge */}
          <div className="absolute top-1/3 -right-2 transform translate-x-full hidden xl:flex flex-col gap-2">
            <div className="p-2 rounded-m3-md bg-obsidian-800/80 border border-white/10 text-[10px] font-mono text-gray-300 max-w-[130px] shadow-lg backdrop-blur-md">
              <span className="text-heritage-hoang font-bold">Kéo vạt áo:</span> Thử kéo sang trái để trải nghiệm từ trường phản vệ Tả Nhậm.
            </div>
          </div>
        </motion.div>
      </div>

      {/* ==================================================================== */}
      {/* 4. BOTTOM STATUS FOOTER: Garment Specs & Anatomy Inspector           */}
      {/* ==================================================================== */}
      <div className="relative z-20 px-5 py-3 border-t border-white/10 bg-obsidian-800/80 backdrop-blur-md flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-gray-300">
            <Layers className="w-3.5 h-3.5 text-cyber-lime" />
            <span className="font-bold text-white">{coreGarment.name}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="font-mono text-gray-400 text-[11px]">
            Cổ: <strong className="text-gray-200">{coreGarment.collarType}</strong>
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:inline" />
          <span className="font-mono text-gray-400 text-[11px] hidden sm:inline">
            Hàng cúc: <strong className="text-heritage-hoang">{coreGarment.buttonCount} cúc ngọc</strong>
          </span>
        </div>

        {/* Selected Anatomy Info Popover */}
        {activeAnatomyNode ? (
          <div className="text-[11px] font-mono text-cyber-lime bg-cyber-lime/10 px-2.5 py-1 rounded-full border border-cyber-lime/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Cúc {activeAnatomyNode}</span>
          </div>
        ) : (
          <div className="text-[11px] font-mono text-gray-400 flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Từ trường Hữu Nhậm: Ổn định</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MannequinStage;
