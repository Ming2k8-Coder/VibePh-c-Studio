import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Eye,
  EyeOff,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  User,
  ZoomIn,
  ZoomOut,
  Palette,
  Layers,
  ArrowRightLeft,
  Check
} from 'lucide-react';
import { OutfitState, GarmentItem, AccessoryItem } from '../../types/vibephuc';

interface MannequinCanvas2DProps {
  outfit: OutfitState;
  onUpdateOutfit: (updater: (prev: OutfitState) => OutfitState) => void;
  onToggleLapel: () => void;
  isShaking?: boolean;
}

export const MannequinCanvas2D: React.FC<MannequinCanvas2DProps> = ({
  outfit,
  onUpdateOutfit,
  onToggleLapel,
  isShaking = false
}) => {
  // Local Canvas Controls
  const [modelGender, setModelGender] = useState<'FEMALE' | 'MALE'>('FEMALE');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [visibleLayers, setVisibleLayers] = useState({
    base: true,
    bottom: true,
    core: true,
    outer: true,
    accessory: true,
    footwear: true
  });

  // Color preset swatches for custom silk dyeing
  const SILK_PALETTES = [
    { name: 'Xanh Chàm (Indigo)', hex: '#1E3A8A' },
    { name: 'Đỏ Son (Crimson)', hex: '#C53030' },
    { name: 'Vàng Hoàng Thổ', hex: '#D69E2E' },
    { name: 'Đen Sơn Mài (Obsidian)', hex: '#16181D' },
    { name: 'Trắng Ngà (Ivory Silk)', hex: '#FDFBF7' },
    { name: 'Hồng Sen Cung Đình', hex: '#BE185D' },
    { name: 'Tím Xứ Huế', hex: '#701A75' },
    { name: 'Cyber Lime (Gen Z)', hex: '#CCFF00' },
    { name: 'Cyber Jade', hex: '#00F5D4' }
  ];

  const [activeColor, setActiveColor] = useState<string>(
    outfit.coreGarment.defaultColor?.hex || '#1E3A8A'
  );

  const toggleLayer = (layerKey: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const isTaNham = outfit.lapelMode === 'TA_NHAM';
  const isXRay = outfit.isXRayMode;
  const coreId = outfit.coreGarment?.id || '';
  const coreCat = outfit.coreGarment?.category;

  // Check accessory flags
  const hasNonQuaiThao = outfit.accessories.some(a => a.id === 'acc-non-quai-thao');
  const hasNonLa = outfit.accessories.some(a => a.id === 'acc-non-la-hue');
  const hasKhanRan = outfit.accessories.some(a => a.id === 'acc-khan-ran');
  const hasKiengBac = outfit.accessories.some(a => a.id === 'acc-kieng-bac');
  const hasKhanVanh = outfit.accessories.some(a => a.id.includes('khan-vanh') || a.id.includes('khan-dong'));
  const hasForeignObi = outfit.accessories.some(a => a.id === 'acc-foreign-kimono-obi');
  const hasForeignRuqun = outfit.accessories.some(a => a.id === 'acc-foreign-ruqun-ribbon');

  return (
    <div
      className={`relative w-full rounded-2xl bg-gradient-to-b from-obsidian-900 to-[#0A0B0E] border border-white/10 flex flex-col items-center justify-between p-3 sm:p-5 overflow-hidden shadow-2xl transition-all ${
        isTaNham ? 'border-rose-500/50 shadow-rose-950/40' : ''
      }`}
    >
      {/* Canvas Header / Mode Bar */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-2.5 mb-2 z-20 text-xs font-mono">
        {/* Model Gender Switcher */}
        <div className="flex items-center gap-1 bg-obsidian-800 p-0.5 rounded-lg border border-white/10">
          <button
            onClick={() => setModelGender('FEMALE')}
            className={`px-2.5 py-1 rounded text-[11px] transition-colors font-medium cursor-pointer ${
              modelGender === 'FEMALE'
                ? 'bg-heritage-hoang text-black font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Nữ Nhân
          </button>
          <button
            onClick={() => setModelGender('MALE')}
            className={`px-2.5 py-1 rounded text-[11px] transition-colors font-medium cursor-pointer ${
              modelGender === 'MALE'
                ? 'bg-heritage-hoang text-black font-bold shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Nam Nhân
          </button>
        </div>

        {/* Canvas Quick Actions: X-Ray & Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateOutfit(prev => ({ ...prev, isXRayMode: !prev.isXRayMode }))}
            className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] ${
              isXRay
                ? 'bg-teal-950 border-teal-400 text-teal-200'
                : 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
            }`}
            title="Soi chiếu cấu trúc đường may và sống lưng Chính Trung"
          >
            {isXRay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{isXRay ? 'X-Ray: Bật' : 'X-Ray'}</span>
          </button>

          <button
            onClick={() => setZoomLevel(prev => (prev === 1 ? 1.25 : 1))}
            className="p-1.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Phóng to chi tiết ngực, cổ và nẹp cúc"
          >
            {zoomLevel === 1 ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main 2D Fashion Mannequin Interactive Stage */}
      <div className="relative w-full h-[420px] sm:h-[470px] flex items-center justify-center overflow-hidden">
        
        {/* Ambient Halo Glow */}
        <div
          className={`absolute inset-0 transition-colors duration-700 pointer-events-none opacity-40 ${
            isTaNham
              ? 'bg-[radial-gradient(ellipse_at_center,rgba(159,18,57,0.5)_0%,transparent_70%)]'
              : isXRay
              ? 'bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.4)_0%,transparent_70%)]'
              : 'bg-[radial-gradient(ellipse_at_center,rgba(214,158,46,0.25)_0%,transparent_70%)]'
          }`}
        />

        {/* Taboo 01 Alert Watermark Banner */}
        {isTaNham && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1 rounded-full bg-rose-600/95 text-white font-mono text-[11px] font-bold shadow-rule-error flex items-center gap-1.5 animate-bounce">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>ĐẠI KỴ: TẢ NHẬM (CHỈ DÙNG KHÂM LIỆM NGƯỜI KHUẤT)</span>
          </div>
        )}

        {/* Foreign Assimilation Alert Banner */}
        {(hasForeignObi || hasForeignRuqun) && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1 rounded-full bg-amber-600/95 text-white font-mono text-[11px] font-bold shadow-lg flex items-center gap-1.5 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>CẢNH BÁO: PHỤ KIỆN LAI CĂNG ĐỒNG HÓA VĂN HÓA</span>
          </div>
        )}

        {/* =================================================================== */}
        {/* 2D FASHION MANNEQUIN SVG MODEL WITH DYNAMIC GARMENT DRAPING         */}
        {/* =================================================================== */}
        <div
          className="relative transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 320 540"
            className="w-[280px] sm:w-[320px] h-[410px] sm:h-[460px] drop-shadow-2xl select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Mannequin Skin Gradients */}
              <linearGradient id="skinTone" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F7EFE9" />
                <stop offset="60%" stopColor="#ECD9C8" />
                <stop offset="100%" stopColor="#DCBEA8" />
              </linearGradient>

              {/* Silk Core Fabric Gradient */}
              <linearGradient id="coreFabric" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={activeColor} />
                <stop offset="100%" stopColor="#0B132B" stopOpacity="0.88" />
              </linearGradient>

              {/* Gold Thread Accent for Chính Trung & Lập Lĩnh */}
              <linearGradient id="goldSeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="50%" stopColor="#D69E2E" />
                <stop offset="100%" stopColor="#B45309" />
              </linearGradient>

              {/* Cyber Organza Sheer Gradient */}
              <linearGradient id="organzaSheer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#00F5D4" stopOpacity="0.18" />
              </linearGradient>

              {/* Soft Drop Shadow Filter for Garment Folds */}
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* =============================================================== */}
            {/* 1. LAYER 0: HAUTE COUTURE 2D FASHION MANNEQUIN FIGURE           */}
            {/* =============================================================== */}
            <g id="mannequin-anatomy">
              {/* Obsidian pedestal shadow */}
              <ellipse cx="160" cy="516" rx="68" ry="11" fill="#000000" opacity="0.6" />
              <ellipse cx="160" cy="516" rx="45" ry="6" fill="#000000" opacity="0.8" />

              {/* Hair / Head Coiffure */}
              {modelGender === 'FEMALE' ? (
                <g id="female-hair">
                  {/* Traditional High Bun (Búi tóc củ hành đoan trang) */}
                  <circle cx="160" cy="46" r="15" fill="#1C1917" />
                  <ellipse cx="160" cy="60" rx="19" ry="22" fill="#1C1917" />
                  {/* Jade Hairpin (Trâm ngọc cài tóc) */}
                  <line x1="172" y1="42" x2="190" y2="34" stroke="#00F5D4" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="191" cy="34" r="2.5" fill="#FDE68A" />
                </g>
              ) : (
                <g id="male-hair">
                  {/* Male Topknot / Coiffure */}
                  <ellipse cx="160" cy="50" rx="12" ry="10" fill="#1C1917" />
                  <path d="M142 56 Q160 44 178 56 L178 68 Q160 74 142 68 Z" fill="#1C1917" />
                </g>
              )}

              {/* Graceful Face Silhouette */}
              <path
                d="M148 64 C148 78, 172 78, 172 64 C172 54, 148 54, 148 64 Z"
                fill="url(#skinTone)"
                stroke="#D6C4B2"
                strokeWidth="0.8"
              />
              {/* Subtle Elegant Facial Features */}
              <path d="M153 66 Q156 68 155 70" stroke="#C4A892" strokeWidth="0.8" fill="none" />
              <path d="M157 74 Q160 75 163 74" stroke="#BE185D" strokeWidth="1" strokeLinecap="round" />

              {/* Slender Graceful Neck (Cổ cao 3 ngấn) */}
              <path
                d="M153 76 L153 104 L167 104 L167 76 Z"
                fill="url(#skinTone)"
              />
              {/* Throat & Clavicle (Xương quai xanh) Lines */}
              <path
                d="M146 104 Q160 110 174 104"
                stroke="#CBB5A1"
                strokeWidth="1.2"
                strokeLinecap="round"
              />

              {/* Torso & Shoulder Anatomy (Mannequin body) */}
              <path
                d="M110 118 Q160 104 210 118 L200 232 Q160 238 120 232 Z"
                fill="url(#skinTone)"
                stroke="#D6C4B2"
                strokeWidth="0.8"
              />

              {/* Graceful Arms (Dáng đứng khoan thai) */}
              {/* Left Arm */}
              <path
                d="M110 118 Q92 172 96 252 L104 252 Q104 176 118 126 Z"
                fill="url(#skinTone)"
              />
              {/* Left Hand Fingers */}
              <path d="M96 252 Q94 260 97 264 Q100 260 104 252 Z" fill="url(#skinTone)" />

              {/* Right Arm */}
              <path
                d="M210 118 Q228 172 224 252 L216 252 Q216 176 202 126 Z"
                fill="url(#skinTone)"
              />
              {/* Right Hand Fingers */}
              <path d="M216 252 Q220 260 223 264 Q226 260 224 252 Z" fill="url(#skinTone)" />

              {/* Slender Long Legs & Feet (Chân dài chuẩn thời trang) */}
              <path d="M136 232 L138 482 L152 482 L156 232 Z" fill="url(#skinTone)" opacity="0.95" />
              <path d="M164 232 L168 482 L182 482 L184 232 Z" fill="url(#skinTone)" opacity="0.95" />
              {/* Feet */}
              <ellipse cx="145" cy="486" rx="8" ry="4" fill="url(#skinTone)" />
              <ellipse cx="175" cy="486" rx="8" ry="4" fill="url(#skinTone)" />
            </g>

            {/* =============================================================== */}
            {/* 2. LAYER 1: BASE / NỘI Y (YẾM ĐÀO HOẶC TRUNG ĐƠN)              */}
            {/* =============================================================== */}
            {visibleLayers.base && outfit.baseGarment && (
              <g id="layer-base">
                {outfit.baseGarment.id === 'base-yem-canh-sen' || outfit.baseGarment.id.includes('yem') ? (
                  // Yếm Đào Cổ Cánh Sen (Lụa cánh sen thắt yếm)
                  <g filter="url(#softGlow)">
                    {/* Halter neck cord tying behind neck */}
                    <path d="M152 88 Q160 102 168 88" stroke="#D69E2E" strokeWidth="1.6" fill="none" />
                    {/* Yếm Bodice: Vát chéo duyên dáng che ngực */}
                    <path
                      d="M142 110 Q160 116 178 110 L190 176 Q160 188 130 176 Z"
                      fill="#C53030"
                      stroke="#FDA4AF"
                      strokeWidth="1.2"
                    />
                    {/* Embroidered Golden Lotus flower center */}
                    <circle cx="160" cy="144" r="5" fill="#FDE68A" />
                    <path d="M155 144 Q160 137 165 144" stroke="#B45309" strokeWidth="1" fill="none" />
                    <path d="M153 148 Q160 154 167 148" stroke="#B45309" strokeWidth="1" fill="none" />
                  </g>
                ) : (
                  // Trung Đơn Bạch (Áo lót trắng lập lĩnh ôm khít cổ)
                  <g>
                    <path
                      d="M140 98 L180 98 L190 190 L130 190 Z"
                      fill="#FFFFFF"
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                    {/* Crisp white inner collar rim (Diềm trắng lập lĩnh) */}
                    <rect x="145" y="91" width="30" height="10" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
                  </g>
                )}
              </g>
            )}

            {/* =============================================================== */}
            {/* 3. LAYER 2: BOTTOM PIECE / HẠ Y (QUẦN LỤA / VÁY ĐỤP / CARGO)    */}
            {/* =============================================================== */}
            {visibleLayers.bottom && outfit.bottomPiece && (
              <g id="layer-bottom" filter="url(#softGlow)">
                {outfit.bottomPiece.id === 'bottom-vay-dup-den' ? (
                  // Váy đụp đen xòe Kinh Bắc
                  <g>
                    <path
                      d="M132 216 L188 216 L220 442 Q160 458 100 442 Z"
                      fill="#18181B"
                      stroke="#27272A"
                      strokeWidth="1.5"
                    />
                    {/* Soft folds of rustic fabric */}
                    <path d="M145 220 Q142 330 135 444" stroke="#27272A" strokeWidth="1.2" fill="none" />
                    <path d="M175 220 Q178 330 185 444" stroke="#27272A" strokeWidth="1.2" fill="none" />
                  </g>
                ) : outfit.bottomPiece.id === 'bottom-parachute-cargo' ? (
                  // Quần Cargo Techwear rộng ống Gen Z
                  <g>
                    <path
                      d="M130 216 L190 216 L210 476 L168 476 L160 280 L152 476 L110 476 Z"
                      fill="#1E293B"
                      stroke="#334155"
                      strokeWidth="1.5"
                    />
                    {/* Neon Straps & Cargo pockets */}
                    <line x1="118" y1="312" x2="148" y2="312" stroke="#CCFF00" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="172" y1="312" x2="202" y2="312" stroke="#CCFF00" strokeWidth="2" strokeDasharray="3 3" />
                    <rect x="120" y="322" width="22" height="26" rx="2" fill="#0F172A" stroke="#334155" />
                    <rect x="178" y="322" width="22" height="26" rx="2" fill="#0F172A" stroke="#334155" />
                  </g>
                ) : (
                  // Quần lụa trắng / Quần lụa đen ống suông rủ tha thướt
                  <g>
                    <path
                      d="M134 216 L186 216 L202 478 L168 478 L160 262 L152 478 L118 478 Z"
                      fill={outfit.bottomPiece.defaultColor?.hex || '#F8FAFC'}
                      stroke="#CBD5E1"
                      strokeWidth="0.8"
                      opacity={isXRay ? 0.35 : 1}
                    />
                    {/* Natural silk drapery lines */}
                    <path d="M142 240 Q138 360 134 478" stroke={outfit.bottomPiece.defaultColor?.hex === '#F8FAFC' ? '#E2E8F0' : '#27272A'} strokeWidth="1" fill="none" />
                    <path d="M178 240 Q182 360 186 478" stroke={outfit.bottomPiece.defaultColor?.hex === '#F8FAFC' ? '#E2E8F0' : '#27272A'} strokeWidth="1" fill="none" />
                  </g>
                )}
              </g>
            )}

            {/* =============================================================== */}
            {/* 4. LAYER 3: CORE ROBE / THÂN ÁO CHÍNH (ĐẮP LÊN NGƯỜI)           */}
            {/* =============================================================== */}
            {visibleLayers.core && (
              <g id="layer-core" opacity={isXRay ? 0.45 : 1} filter="url(#softGlow)">
                
                {/* --- A. ÁO NHẬT BÌNH CUNG ĐÌNH TRIỀU NGUYỄN --- */}
                {coreId === 'core-nhat-binh' || coreCat === 'NHAT_BINH' ? (
                  <g id="ao-nhat-binh">
                    {/* Main Imperial Crimson Robe Body */}
                    <path
                      d="M108 114 L212 114 L228 434 Q160 446 92 434 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.5"
                    />
                    {/* Wide Rectangular Embroidered Collar (Cổ Vuông Nhật Bình) */}
                    <rect
                      x="140"
                      y="100"
                      width="40"
                      height="174"
                      rx="3"
                      fill="#831843"
                      stroke="url(#goldSeam)"
                      strokeWidth="2.5"
                    />
                    {/* Phoenix & Cloud motifs on collar */}
                    <circle cx="160" cy="130" r="4" fill="#FDE68A" />
                    <circle cx="160" cy="180" r="4" fill="#FDE68A" />
                    <circle cx="160" cy="230" r="4" fill="#FDE68A" />

                    {/* Wide Drooping Sleeves with Five-Element Bands (Cửa tay viền ngũ sắc) */}
                    {/* Left Sleeve */}
                    <path d="M108 114 L64 252 L100 262 L124 160 Z" fill="url(#coreFabric)" />
                    <rect x="64" y="248" width="36" height="3" fill="#1E3A8A" transform="rotate(12, 64, 248)" />
                    <rect x="66" y="251" width="36" height="3" fill="#D69E2E" transform="rotate(12, 66, 251)" />
                    <rect x="68" y="254" width="36" height="3" fill="#FFFFFF" transform="rotate(12, 68, 254)" />
                    <rect x="70" y="257" width="36" height="3" fill="#C53030" transform="rotate(12, 70, 257)" />
                    <rect x="72" y="260" width="36" height="3" fill="#0E0F12" transform="rotate(12, 72, 260)" />

                    {/* Right Sleeve */}
                    <path d="M212 114 L256 252 L220 262 L196 160 Z" fill="url(#coreFabric)" />
                    <rect x="220" y="260" width="36" height="3" fill="#0E0F12" transform="rotate(-12, 220, 260)" />
                    <rect x="218" y="257" width="36" height="3" fill="#C53030" transform="rotate(-12, 218, 257)" />
                    <rect x="216" y="254" width="36" height="3" fill="#FFFFFF" transform="rotate(-12, 216, 254)" />
                    <rect x="214" y="251" width="36" height="3" fill="#D69E2E" transform="rotate(-12, 214, 251)" />
                    <rect x="212" y="248" width="36" height="3" fill="#1E3A8A" transform="rotate(-12, 212, 248)" />

                    {/* Imperial Jade Tassels & Chest Cord (Dây thao đai ngọc thắt ngực) */}
                    <circle cx="160" cy="274" r="6" fill="#00F5D4" stroke="#FDE68A" strokeWidth="1.8" />
                    <line x1="160" y1="280" x2="160" y2="348" stroke="#FDE68A" strokeWidth="2.2" />
                    <circle cx="160" cy="350" r="3" fill="#FDE68A" />
                  </g>

                ) : coreId === 'core-ao-tac' || coreCat === 'AO_TAC' ? (
                  // --- B. ÁO TẤC / TAY THỤ (ĐẠI LỄ TRIỀU NGUYỄN) ---
                  <g id="ao-tac">
                    {/* Robe Body flared wide past knees */}
                    <path
                      d="M110 114 L210 114 L232 444 Q160 456 88 444 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.5"
                    />
                    {/* High Standing Collar Lập Lĩnh */}
                    <rect
                      x="145"
                      y="92"
                      width="30"
                      height="12"
                      rx="3"
                      fill={isTaNham ? '#991B1B' : '#0F172A'}
                      stroke={isTaNham ? '#EF4444' : '#FDE68A'}
                      strokeWidth="1.5"
                    />
                    {/* MAGNIFICENT SQUARE DROOPING SLEEVES (Tay Thụng Vuông Vức 35-45cm) */}
                    {/* Left Wide Drooping Sleeve */}
                    <path
                      d="M110 114 L42 278 L98 288 L124 164 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.2"
                    />
                    {/* Right Wide Drooping Sleeve */}
                    <path
                      d="M210 114 L278 278 L222 288 L196 164 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.2"
                    />

                    {/* Sống Lưng Chính Trung Seamline */}
                    <line x1="160" y1="104" x2="160" y2="446" stroke="url(#goldSeam)" strokeWidth="1.8" />

                    {/* Lapel seam: Hữu Nhậm vs Tả Nhậm */}
                    {isTaNham ? (
                      <path d="M175 104 Q150 142 126 154 L126 440" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                    ) : (
                      <path d="M145 104 Q170 142 194 154 L194 440" stroke="url(#goldSeam)" strokeWidth="2.5" fill="none" />
                    )}

                    {/* 5 Brass Buttons */}
                    <g>
                      {[
                        { x: isTaNham ? 168 : 152, y: 108 },
                        { x: isTaNham ? 152 : 168, y: 132 },
                        { x: isTaNham ? 138 : 182, y: 156 },
                        { x: isTaNham ? 136 : 184, y: 182 },
                        { x: isTaNham ? 136 : 184, y: 208 },
                      ].map((btn, bIdx) => (
                        <circle
                          key={bIdx}
                          cx={btn.x}
                          cy={btn.y}
                          r="3"
                          fill={isTaNham ? '#EF4444' : '#FDE68A'}
                          stroke={isTaNham ? '#FFFFFF' : '#78350F'}
                          strokeWidth="1"
                        />
                      ))}
                    </g>
                  </g>

                ) : coreId === 'core-giao-linh' || coreCat === 'GIAO_LINH' ? (
                  // --- C. ÁO GIAO LĨNH CỔ CHÉO (ĐẠI VIỆT) ---
                  <g id="ao-giao-linh">
                    <path
                      d="M108 114 L212 114 L228 438 Q160 450 92 438 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.5"
                    />
                    {/* Wide Crossed Y-Collar (Cổ chéo Hữu Nhậm: Trái đè Phải) */}
                    <path
                      d="M138 98 L182 174 L170 180 L126 104 Z"
                      fill="#D69E2E"
                      stroke="#FDE68A"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M182 98 L138 174 L150 180 L194 104 Z"
                      fill="#B45309"
                      stroke="#FDE68A"
                      strokeWidth="1.2"
                    />
                    {/* Broad sleeves */}
                    <path d="M108 114 L68 250 L102 260 L124 160 Z" fill="url(#coreFabric)" stroke="#D69E2E" />
                    <path d="M212 114 L252 250 L218 260 L196 160 Z" fill="url(#coreFabric)" stroke="#D69E2E" />
                  </g>

                ) : coreId === 'core-ao-dai-raglan' || coreCat === 'AO_DAI_RAGLAN' ? (
                  // --- D. ÁO DÀI RAGLAN (1960s) ---
                  <g id="ao-dai-raglan">
                    {/* Tailored Body silhouette with feminine curves */}
                    <path
                      d="M122 116 L198 116 L208 456 Q160 464 112 456 Z"
                      fill="url(#coreFabric)"
                      stroke="#FDE68A"
                      strokeWidth="1.2"
                    />
                    {/* High Standing Collar Lập Lĩnh */}
                    <rect x="145" y="92" width="30" height="12" rx="3" fill={activeColor} stroke="#FDE68A" strokeWidth="1.2" />
                    
                    {/* Raglan Diagonal Seams (Nối xéo triệt tiêu nếp nhăn) */}
                    <line x1="145" y1="104" x2="112" y2="150" stroke="#CCFF00" strokeWidth="2" strokeDasharray="4 2" />
                    <line x1="175" y1="104" x2="208" y2="150" stroke="#CCFF00" strokeWidth="2" strokeDasharray="4 2" />

                    {/* Fitted Wrist Sleeves */}
                    <path d="M122 116 L92 238 L106 242 L132 146 Z" fill="url(#coreFabric)" />
                    <path d="M198 116 L228 238 L214 242 L188 146 Z" fill="url(#coreFabric)" />

                    {/* Side waist snap buttons */}
                    <circle cx="196" cy="172" r="2" fill="#FDE68A" />
                    <circle cx="196" cy="186" r="2" fill="#FDE68A" />
                  </g>

                ) : coreId === 'core-ao-dai-lemur' || coreCat === 'AO_DAI_LEMUR' ? (
                  // --- E. ÁO DÀI LE MUR (1930s) ---
                  <g id="ao-dai-lemur">
                    <path
                      d="M122 116 L198 116 L206 450 Q160 460 114 450 Z"
                      fill="url(#coreFabric)"
                      stroke="#E9D5FF"
                      strokeWidth="1.2"
                    />
                    {/* Romantic Lotus Collar (Cổ bẻ lá sen Pháp) */}
                    <ellipse cx="160" cy="106" rx="22" ry="8" fill="#6B21A8" stroke="#F3E8FF" strokeWidth="1.2" />

                    {/* 3D Puffed Sleeves (Vai Bồng kiêu sa) */}
                    <circle cx="110" cy="120" r="17" fill="url(#coreFabric)" stroke="#F3E8FF" strokeWidth="1" />
                    <circle cx="210" cy="120" r="17" fill="url(#coreFabric)" stroke="#F3E8FF" strokeWidth="1" />

                    {/* Sleeves */}
                    <path d="M104 132 L94 238 L108 242 L122 146 Z" fill="url(#coreFabric)" />
                    <path d="M216 132 L226 238 L212 242 L198 146 Z" fill="url(#coreFabric)" />
                  </g>

                ) : coreId === 'core-ba-ba' || coreCat === 'BA_BA' ? (
                  // --- F. ÁO BÀ BA NAM BỘ ---
                  <g id="ao-ba-ba">
                    <path
                      d="M118 114 L202 114 L206 296 Q160 302 114 296 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.2"
                    />
                    {/* Clean Center Slit & Button Row */}
                    <line x1="160" y1="110" x2="160" y2="294" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 3" />
                    {[125, 155, 185, 215, 245, 275].map(y => (
                      <circle key={y} cx="160" cy={y} r="2.5" fill="#FDE68A" stroke="#78350F" strokeWidth="0.8" />
                    ))}
                    {/* Two front patch pockets */}
                    <rect x="128" y="250" width="22" height="24" rx="2" fill="none" stroke="#FDE68A" strokeWidth="1" />
                    <rect x="170" y="250" width="22" height="24" rx="2" fill="none" stroke="#FDE68A" strokeWidth="1" />
                    {/* Sleeves */}
                    <path d="M118 114 L94 238 L108 242 L130 146 Z" fill="url(#coreFabric)" />
                    <path d="M202 114 L226 238 L212 242 L190 146 Z" fill="url(#coreFabric)" />
                  </g>

                ) : coreId === 'core-tu-than' || coreCat === 'TU_THAN' ? (
                  // --- G. ÁO TỨ THÂN KINH BẮC ---
                  <g id="ao-tu-than">
                    {/* Open robe panels revealing the crimson yếm inside */}
                    <path
                      d="M114 114 L142 114 L138 416 L106 416 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M178 114 L206 114 L214 416 L182 416 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.2"
                    />
                    {/* Tied flap bow at waist (Thắt Vạt Lươn Duyên Dáng) */}
                    <ellipse cx="160" cy="226" rx="15" ry="9" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
                    <path d="M152 232 Q144 282 138 316" stroke="#FDE68A" strokeWidth="3.2" strokeLinecap="round" />
                    <path d="M168 232 Q176 282 182 316" stroke="#FDE68A" strokeWidth="3.2" strokeLinecap="round" />
                    {/* Sleeves */}
                    <path d="M114 114 L94 238 L108 242 L130 146 Z" fill="url(#coreFabric)" />
                    <path d="M206 114 L226 238 L212 242 L190 146 Z" fill="url(#coreFabric)" />
                  </g>

                ) : (
                  // --- H. ÁO NGŨ THÂN TAY CHẼN (CHUẨN MỰC MINH MẠNG) ---
                  <g id="ao-ngu-than">
                    {/* Robe Body flared in classic A-shape */}
                    <path
                      d="M120 114 L200 114 L210 436 Q160 446 110 436 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.5"
                    />

                    {/* SỐNG LƯNG CHÍNH TRUNG (正中) GOLD SEAMLINE */}
                    <line x1="160" y1="104" x2="160" y2="438" stroke="url(#goldSeam)" strokeWidth="1.8" />

                    {/* High Standing Collar (Cổ Lập Lĩnh 2-3cm) */}
                    <rect
                      x="145"
                      y="92"
                      width="30"
                      height="12"
                      rx="3"
                      fill={isTaNham ? '#991B1B' : '#0F172A'}
                      stroke={isTaNham ? '#EF4444' : '#FDE68A'}
                      strokeWidth="1.5"
                    />

                    {/* Lapel Overlay: HỮU NHẬM (Trái đè Phải) vs TẢ NHẬM (Phải đè Trái) */}
                    {isTaNham ? (
                      // TẢ NHẬM (VI PHẠM TANG LỄ: Vạt Phải đè Vạt Trái)
                      <path
                        d="M175 104 Q150 142 124 154 L124 436"
                        stroke="#EF4444"
                        strokeWidth="2.5"
                        fill="none"
                      />
                    ) : (
                      // HỮU NHẬM (CHUẨN MỰC: Vạt Trái đè Vạt Phải)
                      <path
                        d="M145 104 Q170 142 196 154 L196 436"
                        stroke="url(#goldSeam)"
                        strokeWidth="2.5"
                        fill="none"
                      />
                    )}

                    {/* 5 Brass Buttons (Cúc Ngũ Thường / Ngũ Luân) */}
                    <g>
                      {[
                        { x: isTaNham ? 168 : 152, y: 108 },
                        { x: isTaNham ? 152 : 168, y: 132 },
                        { x: isTaNham ? 138 : 182, y: 156 },
                        { x: isTaNham ? 136 : 184, y: 182 },
                        { x: isTaNham ? 136 : 184, y: 208 },
                      ].map((btn, bIdx) => (
                        <circle
                          key={bIdx}
                          cx={btn.x}
                          cy={btn.y}
                          r="3"
                          fill={isTaNham ? '#EF4444' : '#FDE68A'}
                          stroke={isTaNham ? '#FFFFFF' : '#78350F'}
                          strokeWidth="1"
                        />
                      ))}
                    </g>

                    {/* Tapered Fitted Sleeves (Tay Chẽn) */}
                    <path d="M120 114 L94 238 L108 242 L132 146 Z" fill="url(#coreFabric)" stroke="#D69E2E" strokeWidth="1" />
                    <path d="M200 114 L226 238 L212 242 L188 146 Z" fill="url(#coreFabric)" stroke="#D69E2E" strokeWidth="1" />
                  </g>
                )}

              </g>
            )}

            {/* =============================================================== */}
            {/* 5. LAYER 4: OUTERWEAR / KHOÁC NGOÀI (CYBER ORGANZA TRENCH)      */}
            {/* =============================================================== */}
            {visibleLayers.outer && outfit.outerGarment && !isXRay && (
              <g id="layer-outer" filter="url(#softGlow)">
                {outfit.outerGarment.id === 'outer-cyber-organza' ? (
                  // Translucent Cyber Organza Silhouette (Nhìn xuyên thấu cổ phục bên trong)
                  <g>
                    <path
                      d="M104 110 L216 110 L234 460 Q160 470 86 460 Z"
                      fill="url(#organzaSheer)"
                      stroke="#CCFF00"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                    />
                    {/* Techwear Buckle Chest Straps */}
                    <line x1="118" y1="176" x2="202" y2="176" stroke="#CCFF00" strokeWidth="2" />
                    <rect x="152" y="170" width="16" height="12" rx="2" fill="#CCFF00" />
                  </g>
                ) : (
                  // Áo Tấc Sa Khoác Ngoài
                  <g>
                    <path
                      d="M102 110 L218 110 L236 462 Q160 472 84 462 Z"
                      fill="#C53030"
                      fillOpacity="0.55"
                      stroke="#FDE68A"
                      strokeWidth="1.5"
                    />
                  </g>
                )}
              </g>
            )}

            {/* =============================================================== */}
            {/* 6. LAYER 5: ACCESSORIES / PHỤ KIỆN (NÓN, KHĂN, KIỀNG BẠC)       */}
            {/* =============================================================== */}
            {visibleLayers.accessory && (
              <g id="layer-accessories" filter="url(#softGlow)">
                
                {/* A. Kiềng Bạc Chạm Hoa Sen Cung Đình */}
                {hasKiengBac && (
                  <path
                    d="M142 110 Q160 126 178 110"
                    stroke="#E2E8F0"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}

                {/* B. Khăn Rằn Nam Bộ Sọc Caro */}
                {hasKhanRan && (
                  <g id="acc-khan-ran">
                    {/* Scarf draped gracefully around neck and shoulder */}
                    <path
                      d="M146 104 Q160 114 174 104 L180 236 L168 236 L158 114 L148 214 L138 214 Z"
                      fill="#38BDF8"
                      stroke="#0F172A"
                      strokeWidth="1.2"
                    />
                    {/* Checkered pattern lines */}
                    <line x1="140" y1="160" x2="180" y2="160" stroke="#FFFFFF" strokeWidth="1" />
                    <line x1="140" y1="190" x2="180" y2="190" stroke="#FFFFFF" strokeWidth="1" />
                  </g>
                )}

                {/* C. Nón Ba Tầm / Nón Quai Thao (Kinh Bắc) */}
                {hasNonQuaiThao && (
                  <g id="acc-non-quai-thao">
                    {/* Wide circular flat hat with brim */}
                    <ellipse cx="160" cy="50" rx="58" ry="16" fill="#D69E2E" stroke="#FDE68A" strokeWidth="1.5" />
                    <ellipse cx="160" cy="48" rx="50" ry="12" fill="#B45309" opacity="0.4" />
                    {/* Long Silk Cords (Quai Thao) draping over both shoulders */}
                    <path d="M120 54 Q105 130 112 210" stroke="#D69E2E" strokeWidth="2" fill="none" />
                    <path d="M200 54 Q215 130 208 210" stroke="#D69E2E" strokeWidth="2" fill="none" />
                    <circle cx="112" cy="212" r="3" fill="#FDE68A" />
                    <circle cx="208" cy="212" r="3" fill="#FDE68A" />
                  </g>
                )}

                {/* D. Nón Lá Bài Thơ Xứ Huế */}
                {hasNonLa && (
                  <g id="acc-non-la">
                    {/* Conical Hat Triangle */}
                    <path d="M160 22 L112 66 L208 66 Z" fill="#FDE68A" stroke="#D69E2E" strokeWidth="1.2" />
                    <line x1="126" y1="52" x2="194" y2="52" stroke="#D69E2E" strokeWidth="0.8" />
                    <line x1="142" y1="38" x2="178" y2="38" stroke="#D69E2E" strokeWidth="0.8" />
                  </g>
                )}

                {/* E. Khăn Vành Dây Hoàng Tộc / Khăn Đóng */}
                {hasKhanVanh && (
                  <g id="acc-khan-vanh">
                    <path
                      d="M138 52 Q160 46 182 52 L186 64 Q160 60 134 64 Z"
                      fill="#D69E2E"
                      stroke="#FDE68A"
                      strokeWidth="1.2"
                    />
                    <line x1="136" y1="56" x2="184" y2="56" stroke="#FDE68A" strokeWidth="1" />
                    <line x1="135" y1="60" x2="185" y2="60" stroke="#FDE68A" strokeWidth="1" />
                  </g>
                )}

                {/* F. Ngoại lai: Kimono Obi (Alert Visual) */}
                {hasForeignObi && (
                  <g id="foreign-obi">
                    <rect x="122" y="196" width="76" height="28" rx="2" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="160" y="214" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      OBI NHẬT (LAI CĂNG)
                    </text>
                  </g>
                )}

                {/* G. Ngoại lai: Hanfu Ruqun Ribbon (Alert Visual) */}
                {hasForeignRuqun && (
                  <g id="foreign-ruqun">
                    <rect x="134" y="132" width="52" height="14" rx="2" fill="#E11D48" stroke="#FFFFFF" strokeWidth="1.5" />
                    <text x="160" y="142" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      NƠ HÁN PHỤC
                    </text>
                  </g>
                )}

              </g>
            )}

            {/* =============================================================== */}
            {/* 7. LAYER 6: FOOTWEAR / GIÀY DÉP (CHUNKY SNEAKER / GUỐC MỘC)     */}
            {/* =============================================================== */}
            {visibleLayers.footwear && (
              <g id="layer-footwear">
                {outfit.footwear?.id === 'acc-sneaker-chunky' ? (
                  // Chunky Sneaker Cyber Lime
                  <g>
                    <rect x="134" y="476" width="22" height="16" rx="4" fill="#FFFFFF" stroke="#CCFF00" strokeWidth="1.6" />
                    <rect x="164" y="476" width="22" height="16" rx="4" fill="#FFFFFF" stroke="#CCFF00" strokeWidth="1.6" />
                    <line x1="134" y1="488" x2="156" y2="488" stroke="#00F5D4" strokeWidth="2" />
                    <line x1="164" y1="488" x2="186" y2="488" stroke="#00F5D4" strokeWidth="2" />
                  </g>
                ) : (
                  // Guốc mộc quai nhung đỏ son
                  <g>
                    <rect x="136" y="482" width="18" height="6" rx="1" fill="#78350F" />
                    <path d="M139 482 Q145 476 151 482" stroke="#C53030" strokeWidth="2" fill="none" />
                    <rect x="166" y="482" width="18" height="6" rx="1" fill="#78350F" />
                    <path d="M169 482 Q175 476 181 482" stroke="#C53030" strokeWidth="2" fill="none" />
                  </g>
                )}
              </g>
            )}

            {/* =============================================================== */}
            {/* 8. X-RAY MODE LASER ANATOMY (SỐNG LƯNG CHÍNH TRUNG OVERLAY)     */}
            {/* =============================================================== */}
            {isXRay && (
              <g id="layer-xray" pointerEvents="none">
                {/* Cyan Sống Lưng Laser Line */}
                <line x1="160" y1="90" x2="160" y2="480" stroke="#00F5D4" strokeWidth="2.5" strokeDasharray="6 3" />
                <circle cx="160" cy="110" r="5" fill="#00F5D4" opacity="0.8" />
                <circle cx="160" cy="220" r="5" fill="#00F5D4" opacity="0.8" />
                <circle cx="160" cy="360" r="5" fill="#00F5D4" opacity="0.8" />
                {/* Anatomy Text Pointer */}
                <rect x="80" y="210" width="70" height="18" rx="3" fill="#042F2E" stroke="#00F5D4" strokeWidth="1" />
                <text x="115" y="222" fill="#00F5D4" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  CHÍNH TRUNG
                </text>
              </g>
            )}

          </svg>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* CANVAS DOCK: INTERACTIVE FITTING TOOLS & CULTURAL CONTROLS             */}
      {/* ===================================================================== */}
      <div className="w-full pt-2.5 border-t border-white/10 space-y-2.5 z-20">
        
        {/* Row 1: Flip Lapel (Hữu Nhậm vs Tả Nhậm) & Color Dyeing Swatches */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Flip Lapel Test Button */}
          <button
            onClick={onToggleLapel}
            className={`px-3 py-1.5 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm text-xs ${
              isTaNham
                ? 'bg-rose-600 text-white shadow-rule-error animate-pulse'
                : 'bg-heritage-hoang/20 hover:bg-heritage-hoang/30 text-amber-200 border border-heritage-hoang/40'
            }`}
            title="Đảo chiều vạt áo để kiểm thử quy chuẩn Hữu Nhậm / Tả Nhậm"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>{isTaNham ? 'Đang Tả Nhậm (Click Sửa)' : 'Đảo Vạt (Thử Tả Nhậm)'}</span>
          </button>

          {/* Color Silk Swatches */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-400 font-mono text-[10px] hidden sm:inline">Nhuộm Tơ Lụa:</span>
            <div className="flex items-center gap-1">
              {SILK_PALETTES.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setActiveColor(c.hex)}
                  className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                    activeColor === c.hex ? 'scale-125 border-white shadow-md ring-2 ring-heritage-hoang' : 'border-white/20 hover:scale-110'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Layer Visibility Checklist Pills */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-white/5 text-[10px] font-mono text-neutral-400">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-heritage-hoang" />
            <span>Lớp Đồ (Toggle):</span>
          </span>
          <div className="flex flex-wrap gap-1">
            {[
              { key: 'base', label: 'Nội y' },
              { key: 'core', label: 'Áo chính' },
              { key: 'bottom', label: 'Hạ y' },
              { key: 'outer', label: 'Khoác' },
              { key: 'accessory', label: 'Phụ kiện' },
              { key: 'footwear', label: 'Giày dép' }
            ].map(item => (
              <button
                key={item.key}
                onClick={() => toggleLayer(item.key as any)}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer text-[10px] ${
                  visibleLayers[item.key as keyof typeof visibleLayers]
                    ? 'bg-white/10 text-white font-medium'
                    : 'bg-transparent text-neutral-600 line-through'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
