import React from 'react';

interface IllustrationProps {
  className?: string;
  accentColor?: string;
}

/**
 * Hero Banner Visual Asset: Fusion of Imperial Dynastic Silhouettes with Cyber-Streetwear Aesthetic
 */
export const HeroHeritageIllustration: React.FC<IllustrationProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      viewBox="0 0 800 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Background Gradients */}
        <radialGradient id="heroAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D69E2E" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#C53030" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#0E0F12" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="goldThread" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D69E2E" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="crimsonRobe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C53030" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>

        <linearGradient id="indigoRobe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <linearGradient id="cyberNeon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#CCFF00" />
          <stop offset="100%" stopColor="#00F5D4" />
        </linearGradient>

        {/* Pattern: Thủy Ba Wave Grid */}
        <pattern id="thuyBaPattern" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 20 Q10 10 20 20 T40 20" stroke="#D69E2E" strokeWidth="1" strokeOpacity="0.2" fill="none" />
          <path d="M0 10 Q10 0 20 10 T40 10" stroke="#CCFF00" strokeWidth="0.75" strokeOpacity="0.15" fill="none" />
        </pattern>
      </defs>

      {/* Atmospheric Background Glow */}
      <rect width="800" height="450" fill="#0E0F12" />
      <circle cx="400" cy="225" r="320" fill="url(#heroAura)" />

      {/* Water Wave Pattern Base (Thủy Ba) */}
      <rect x="0" y="320" width="800" height="130" fill="url(#thuyBaPattern)" />

      {/* Imperial Palace Arch Eaves in Background */}
      <path
        d="M200 130 C280 110, 360 80, 400 60 C440 80, 520 110, 600 130 C610 132, 600 145, 580 142 C510 128, 450 100, 400 85 C350 100, 290 128, 220 142 C200 145, 190 132, 200 130 Z"
        fill="url(#goldThread)"
        opacity="0.4"
      />
      <path
        d="M240 170 C310 150, 370 125, 400 110 C430 125, 490 150, 560 170 C570 172, 560 182, 545 180 C490 168, 440 145, 400 132 C360 145, 310 168, 255 180 C240 182, 230 172, 240 170 Z"
        fill="url(#goldThread)"
        opacity="0.25"
      />

      {/* LEFT FIGURE: ÁO NGŨ THÂN TAY CHẼN × TECHWEAR */}
      <g transform="translate(180, 90)">
        {/* Shadow */}
        <ellipse cx="90" cy="310" rx="65" ry="12" fill="#000000" opacity="0.6" />

        {/* Outer Techwear Coat Overlay */}
        <path
          d="M30 110 L10 280 L55 290 L85 140 Z"
          fill="#16181D"
          stroke="#CCFF00"
          strokeWidth="1.2"
          opacity="0.8"
        />

        {/* Main Body: Áo Ngũ Thân Indigo */}
        <path
          d="M55 70 L125 70 L145 285 L35 285 Z"
          fill="url(#indigoRobe)"
          stroke="#D69E2E"
          strokeWidth="1.5"
        />

        {/* Lập Lĩnh High Collar (Đứng 2-3cm) */}
        <rect x="72" y="52" width="36" height="18" rx="4" fill="#0F172A" stroke="#FDE68A" strokeWidth="1.5" />
        {/* White Inner Collar (Trung Đơn) */}
        <rect x="76" y="50" width="28" height="4" rx="1" fill="#FFFFFF" opacity="0.9" />

        {/* Left-Over-Right Lapel Curve (HỮU NHẬM) */}
        <path
          d="M72 70 Q90 105 125 115 L125 285"
          stroke="url(#goldThread)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* 5 Buttons (Ngũ Thường) */}
        <circle cx="90" cy="74" r="3.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
        <circle cx="112" cy="98" r="3.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
        <circle cx="123" cy="125" r="3" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
        <circle cx="124" cy="155" r="3" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
        <circle cx="125" cy="185" r="3" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />

        {/* Sleeves: Tay Chẽn (Tightly tapered to wrist) */}
        <path d="M55 70 L15 150 L30 156 L62 95 Z" fill="#1E3A8A" stroke="#D69E2E" strokeWidth="1" />
        <path d="M125 70 L165 150 L150 156 L118 95 Z" fill="#1E3A8A" stroke="#D69E2E" strokeWidth="1" />

        {/* Neon Cyber Straps / Parachute Cargo Belt */}
        <line x1="42" y1="210" x2="138" y2="210" stroke="#CCFF00" strokeWidth="2" strokeDasharray="6 3" />
        <rect x="80" y="204" width="20" height="12" rx="2" fill="#CCFF00" />
      </g>

      {/* RIGHT FIGURE: ÁO NHẬT BÌNH × CYBER ORGANZA */}
      <g transform="translate(440, 75)">
        {/* Shadow */}
        <ellipse cx="100" cy="325" rx="75" ry="14" fill="#000000" opacity="0.6" />

        {/* Transparent Cyber Organza Trench Behind */}
        <path
          d="M20 120 L5 300 L195 300 L180 120 Z"
          fill="#00F5D4"
          fillOpacity="0.06"
          stroke="#00F5D4"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Main Robe: Nhật Bình Crimson */}
        <path
          d="M50 75 L150 75 L175 305 L25 305 Z"
          fill="url(#crimsonRobe)"
          stroke="#D69E2E"
          strokeWidth="1.5"
        />

        {/* Central Rectangular Collar (CỔ NHẬT BÌNH) */}
        <rect x="75" y="70" width="50" height="130" rx="3" fill="#7F1D1D" stroke="url(#goldThread)" strokeWidth="3" />
        <rect x="85" y="70" width="30" height="130" fill="none" stroke="#FDE68A" strokeWidth="1" strokeDasharray="3 3" />

        {/* Golden Central Tassel Knot (Dải Thao Ngọc) */}
        <circle cx="100" cy="195" r="6" fill="#00F5D4" stroke="#FDE68A" strokeWidth="1.5" />
        <line x1="100" y1="201" x2="100" y2="245" stroke="#FDE68A" strokeWidth="2" />
        <line x1="97" y1="245" x2="103" y2="245" stroke="#CCFF00" strokeWidth="2" />

        {/* Broad Sleeves (Tay Thụ) with Five-Element Rainbow Bands (Viền Ngũ Sắc) */}
        {/* Left Sleeve */}
        <path d="M50 75 L-5 180 L35 190 L70 110 Z" fill="#991B1B" stroke="#D69E2E" strokeWidth="1" />
        <rect x="0" y="172" width="32" height="4" fill="#1E3A8A" transform="rotate(14, 0, 172)" />
        <rect x="0" y="176" width="32" height="4" fill="#EAB308" transform="rotate(14, 0, 176)" />
        <rect x="0" y="180" width="32" height="4" fill="#FFFFFF" transform="rotate(14, 0, 180)" />
        <rect x="0" y="184" width="32" height="4" fill="#DC2626" transform="rotate(14, 0, 184)" />
        <rect x="0" y="188" width="32" height="4" fill="#16A34A" transform="rotate(14, 0, 188)" />

        {/* Right Sleeve */}
        <path d="M150 75 L205 180 L165 190 L130 110 Z" fill="#991B1B" stroke="#D69E2E" strokeWidth="1" />
        <rect x="170" y="172" width="32" height="4" fill="#1E3A8A" transform="rotate(-14, 170, 172)" />
        <rect x="170" y="176" width="32" height="4" fill="#EAB308" transform="rotate(-14, 170, 176)" />
        <rect x="170" y="180" width="32" height="4" fill="#FFFFFF" transform="rotate(-14, 170, 180)" />
        <rect x="170" y="184" width="32" height="4" fill="#DC2626" transform="rotate(-14, 170, 184)" />
        <rect x="170" y="188" width="32" height="4" fill="#16A34A" transform="rotate(-14, 170, 188)" />
      </g>

      {/* Central Axis Light Beam (Đường Sống Lưng Chính Trung Chiếu Sáng) */}
      <line x1="400" y1="40" x2="400" y2="410" stroke="url(#goldThread)" strokeWidth="1.5" strokeDasharray="8 6" opacity="0.7" />

      {/* Floating Cultural Emblems */}
      <g opacity="0.6">
        <circle cx="100" cy="100" r="28" stroke="#D69E2E" strokeWidth="1" strokeDasharray="3 3" />
        <text x="100" y="105" fill="#D69E2E" fontSize="13" fontFamily="serif" textAnchor="middle">禮</text>

        <circle cx="700" cy="110" r="28" stroke="#CCFF00" strokeWidth="1" strokeDasharray="3 3" />
        <text x="700" y="115" fill="#CCFF00" fontSize="13" fontFamily="serif" textAnchor="middle">義</text>
      </g>
    </svg>
  );
};

/**
 * Áo Ngũ Thân Visual Artwork
 */
export const NguThanArtwork: React.FC<IllustrationProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="400" rx="16" fill="#16181D" />
    <circle cx="160" cy="180" r="120" fill="#1E3A8A" fillOpacity="0.2" />
    <line x1="160" y1="30" x2="160" y2="370" stroke="#D69E2E" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
    <rect x="135" y="45" width="50" height="22" rx="4" fill="#0E0F12" stroke="#D69E2E" strokeWidth="2" />
    <rect x="142" y="42" width="36" height="5" rx="1" fill="#FFFFFF" />
    <path d="M100 70 L220 70 L245 340 L75 340 Z" fill="#1E3A8A" stroke="#D69E2E" strokeWidth="1.5" />
    <path d="M135 67 Q165 110 215 125 L215 340" stroke="#FDE68A" strokeWidth="3" fill="none" />
    <circle cx="162" cy="74" r="4.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
    <circle cx="190" cy="102" r="4.5" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
    <circle cx="210" cy="135" r="4" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
    <circle cx="212" cy="175" r="4" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
    <circle cx="213" cy="215" r="4" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
    <path d="M100 70 L40 180 L65 186 L112 105 Z" fill="#1E3A8A" stroke="#D69E2E" strokeWidth="1" />
    <path d="M220 70 L280 180 L255 186 L208 105 Z" fill="#1E3A8A" stroke="#D69E2E" strokeWidth="1" />
  </svg>
);

/**
 * Áo Nhật Bình Visual Artwork
 */
export const NhatBinhArtwork: React.FC<IllustrationProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="400" rx="16" fill="#16181D" />
    <circle cx="160" cy="180" r="120" fill="#991B1B" fillOpacity="0.25" />
    <path d="M90 65 L230 65 L260 345 L60 345 Z" fill="#831843" stroke="#D69E2E" strokeWidth="1.5" />
    <rect x="125" y="60" width="70" height="160" rx="4" fill="#701A75" stroke="#FDE68A" strokeWidth="3" />
    <rect x="138" y="60" width="44" height="160" fill="none" stroke="#FDE68A" strokeWidth="1" strokeDasharray="4 2" />
    <circle cx="160" cy="225" r="7" fill="#00F5D4" stroke="#FDE68A" strokeWidth="2" />
    <line x1="160" y1="232" x2="160" y2="295" stroke="#FDE68A" strokeWidth="2" />
    {/* Rainbow Sleeve Bands (Ngũ Sắc) */}
    <rect x="25" y="190" width="45" height="5" fill="#1E3A8A" transform="rotate(20, 25, 190)" />
    <rect x="25" y="196" width="45" height="5" fill="#EAB308" transform="rotate(20, 25, 196)" />
    <rect x="25" y="202" width="45" height="5" fill="#FFFFFF" transform="rotate(20, 25, 202)" />
    <rect x="25" y="208" width="45" height="5" fill="#DC2626" transform="rotate(20, 25, 208)" />
    <rect x="25" y="214" width="45" height="5" fill="#16A34A" transform="rotate(20, 25, 214)" />
    <rect x="250" y="190" width="45" height="5" fill="#1E3A8A" transform="rotate(-20, 250, 190)" />
    <rect x="250" y="196" width="45" height="5" fill="#EAB308" transform="rotate(-20, 250, 196)" />
    <rect x="250" y="202" width="45" height="5" fill="#FFFFFF" transform="rotate(-20, 250, 202)" />
    <rect x="250" y="208" width="45" height="5" fill="#DC2626" transform="rotate(-20, 250, 208)" />
    <rect x="250" y="214" width="45" height="5" fill="#16A34A" transform="rotate(-20, 250, 214)" />
  </svg>
);

/**
 * Áo Tấc / Tay Thụ Visual Artwork
 */
export const AoTacArtwork: React.FC<IllustrationProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="400" rx="16" fill="#16181D" />
    <circle cx="160" cy="180" r="125" fill="#D69E2E" fillOpacity="0.18" />
    <path d="M100 65 L220 65 L245 350 L75 350 Z" fill="#451A03" stroke="#D69E2E" strokeWidth="1.5" />
    <rect x="135" y="42" width="50" height="22" rx="4" fill="#0E0F12" stroke="#D69E2E" strokeWidth="2" />
    <rect x="142" y="39" width="36" height="5" rx="1" fill="#FFFFFF" />
    <path d="M135 64 Q170 108 215 125 L215 350" stroke="#FDE68A" strokeWidth="2.5" fill="none" />
    <circle cx="162" cy="72" r="4.5" fill="#FDE68A" stroke="#78350F" />
    <circle cx="190" cy="98" r="4.5" fill="#FDE68A" stroke="#78350F" />
    <circle cx="210" cy="132" r="4" fill="#FDE68A" stroke="#78350F" />
    <circle cx="212" cy="172" r="4" fill="#FDE68A" stroke="#78350F" />
    <circle cx="213" cy="212" r="4" fill="#FDE68A" stroke="#78350F" />
    {/* Voluminous Square Tay Thụ Sleeves */}
    <path d="M100 65 L20 180 L20 270 L90 230 L110 95 Z" fill="#78350F" stroke="#D69E2E" strokeWidth="1.5" />
    <path d="M220 65 L300 180 L300 270 L230 230 L210 95 Z" fill="#78350F" stroke="#D69E2E" strokeWidth="1.5" />
  </svg>
);

/**
 * Áo Tứ Thân Visual Artwork (Bắc Bộ - Yếm Cánh Sen & Dải Thắt Lưng Buông Rơi)
 */
export const TuThanArtwork: React.FC<IllustrationProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="400" rx="16" fill="#16181D" />
    <circle cx="160" cy="180" r="120" fill="#047857" fillOpacity="0.2" />
    
    {/* Nón Quai Thao Silhouette Above */}
    <ellipse cx="160" cy="38" rx="80" ry="14" fill="#78350F" stroke="#D69E2E" strokeWidth="1.5" />
    <line x1="90" y1="42" x2="110" y2="90" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 2" />
    <line x1="230" y1="42" x2="210" y2="90" stroke="#FDE68A" strokeWidth="1" strokeDasharray="2 2" />

    {/* Inner Yếm Đào (Cổ Xây / Cánh Sen) */}
    <path d="M140 68 Q160 55 180 68 L195 145 L125 145 Z" fill="#E11D48" stroke="#FDA4AF" strokeWidth="1" />
    
    {/* 4 Outer Flowing Panels (Tứ Thân) */}
    {/* 2 Back Panels (Ráp sống đôi) */}
    <path d="M110 80 L140 80 L135 340 L85 340 Z" fill="#064E3B" stroke="#059669" strokeWidth="1" />
    <path d="M180 80 L210 80 L235 340 L185 340 Z" fill="#064E3B" stroke="#059669" strokeWidth="1" />
    
    {/* 2 Front Tied Panels (Thắt vạt lươn buông trước bụng) */}
    <path d="M125 145 Q150 170 155 220 L145 350 L130 350 Q140 230 115 155 Z" fill="#047857" stroke="#34D399" strokeWidth="1.2" />
    <path d="M195 145 Q170 170 165 220 L175 350 L190 350 Q180 230 205 155 Z" fill="#047857" stroke="#34D399" strokeWidth="1.2" />

    {/* Silk Sash Knot (Dải Lụa Thắt Lưng Hồng/Vàng) */}
    <ellipse cx="160" cy="185" rx="22" ry="8" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    <path d="M152 190 L145 280 L155 285 L160 192 Z" fill="#F59E0B" />
    <path d="M168 190 L175 275 L165 280 L160 192 Z" fill="#F59E0B" />

    {/* Flowing Sleeves */}
    <path d="M110 80 L55 180 L75 186 L125 110 Z" fill="#064E3B" stroke="#059669" strokeWidth="1" />
    <path d="M210 80 L265 180 L245 186 L195 110 Z" fill="#064E3B" stroke="#059669" strokeWidth="1" />
  </svg>
);

/**
 * Áo Bà Ba Visual Artwork (Nam Bộ - Giản Dị, Phóng Khoáng, Khăn Rằn)
 */
export const BaBaArtwork: React.FC<IllustrationProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 320 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="400" rx="16" fill="#16181D" />
    <circle cx="160" cy="180" r="120" fill="#0284C7" fillOpacity="0.2" />

    {/* Khăn Rằn Quàng Cổ (B&W Checkered Scarf) */}
    <path d="M125 45 Q160 30 195 45 L180 150 L170 150 L160 65 L150 150 L140 150 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="1" />
    <path d="M140 70 L180 70 M140 90 L180 90 M140 110 L180 110 M140 130 L180 130" stroke="#0F172A" strokeWidth="1.5" strokeDasharray="3 3" />

    {/* Áo Bà Ba Silk Body (Xẻ Giữa, Cổ Tim / Tròn Nông) */}
    <path d="M100 65 L220 65 L240 330 L80 330 Z" fill="#0369A1" stroke="#38BDF8" strokeWidth="1.5" />
    
    {/* Central Seam & Button Row (Hàng cúc cài chính giữa thân áo) */}
    <line x1="160" y1="75" x2="160" y2="330" stroke="#0284C7" strokeWidth="2" />
    <circle cx="160" cy="95" r="3.5" fill="#E0F2FE" stroke="#0369A1" />
    <circle cx="160" cy="130" r="3.5" fill="#E0F2FE" stroke="#0369A1" />
    <circle cx="160" cy="165" r="3.5" fill="#E0F2FE" stroke="#0369A1" />
    <circle cx="160" cy="200" r="3.5" fill="#E0F2FE" stroke="#0369A1" />
    <circle cx="160" cy="235" r="3.5" fill="#E0F2FE" stroke="#0369A1" />

    {/* 2 Lower Front Square Pockets (Hai túi vuông vạt trước) */}
    <rect x="105" y="240" width="36" height="42" rx="3" fill="#075985" stroke="#38BDF8" strokeWidth="1" />
    <rect x="179" y="240" width="36" height="42" rx="3" fill="#075985" stroke="#38BDF8" strokeWidth="1" />

    {/* Raglan Cut Sleeve Seams (Đường xẻ tà hai bên hông) */}
    <path d="M80 270 L80 330" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
    <path d="M240 270 L240 330" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />

    {/* Sleeves */}
    <path d="M100 65 L45 175 L70 182 L115 105 Z" fill="#0369A1" stroke="#38BDF8" strokeWidth="1" />
    <path d="M220 65 L275 175 L250 182 L205 105 Z" fill="#0369A1" stroke="#38BDF8" strokeWidth="1" />
  </svg>
);

/**
 * Ngũ Hành Wheel Diagram Asset (Kim, Mộc, Thủy, Hỏa, Thổ)
 */
export const FiveElementsWheelAsset: React.FC<IllustrationProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="wheelGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#D69E2E" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#0E0F12" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="360" height="360" rx="20" fill="#16181D" />
    <circle cx="180" cy="180" r="150" fill="url(#wheelGlow)" />
    <circle cx="180" cy="180" r="120" stroke="#2B2C31" strokeWidth="1.5" strokeDasharray="4 4" />

    {/* Generating cycle arrows */}
    <circle cx="180" cy="180" r="85" stroke="#D69E2E" strokeWidth="1" strokeOpacity="0.3" />

    {/* 1. HỎA (Top: Red) */}
    <g transform="translate(180, 60)">
      <circle cx="0" cy="0" r="26" fill="#7F1D1D" stroke="#DC2626" strokeWidth="2" />
      <text x="0" y="5" fill="#FCA5A5" fontSize="13" fontWeight="bold" textAnchor="middle">HỎA</text>
      <text x="0" y="38" fill="#8E9099" fontSize="9" textAnchor="middle">Đỏ / Hồng Sa</text>
    </g>

    {/* 2. THỔ (Right: Yellow / Gold) */}
    <g transform="translate(290, 140)">
      <circle cx="0" cy="0" r="26" fill="#78350F" stroke="#EAB308" strokeWidth="2" />
      <text x="0" y="5" fill="#FDE047" fontSize="13" fontWeight="bold" textAnchor="middle">THỔ</text>
      <text x="0" y="38" fill="#8E9099" fontSize="9" textAnchor="middle">Vàng Hoàng Thổ</text>
    </g>

    {/* 3. KIM (Bottom Right: White / Silver) */}
    <g transform="translate(250, 260)">
      <circle cx="0" cy="0" r="26" fill="#334155" stroke="#F8FAFC" strokeWidth="2" />
      <text x="0" y="5" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">KIM</text>
      <text x="0" y="38" fill="#8E9099" fontSize="9" textAnchor="middle">Bạch Lụa</text>
    </g>

    {/* 4. THỦY (Bottom Left: Indigo / Black) */}
    <g transform="translate(110, 260)">
      <circle cx="0" cy="0" r="26" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
      <text x="0" y="5" fill="#38BDF8" fontSize="13" fontWeight="bold" textAnchor="middle">THỦY</text>
      <text x="0" y="38" fill="#8E9099" fontSize="9" textAnchor="middle">Chàm / Lam Huyền</text>
    </g>

    {/* 5. MỘC (Left: Green) */}
    <g transform="translate(70, 140)">
      <circle cx="0" cy="0" r="26" fill="#064E3B" stroke="#22C55E" strokeWidth="2" />
      <text x="0" y="5" fill="#86EFAC" fontSize="13" fontWeight="bold" textAnchor="middle">MỘC</text>
      <text x="0" y="38" fill="#8E9099" fontSize="9" textAnchor="middle">Lục Trúc</text>
    </g>

    {/* Center Emblem */}
    <circle cx="180" cy="180" r="24" fill="#0E0F12" stroke="#D69E2E" strokeWidth="1.5" />
    <text x="180" y="184" fill="#D69E2E" fontSize="11" fontWeight="bold" textAnchor="middle">NGŨ HÀNH</text>
  </svg>
);

/**
 * Quy Thức Hữu Nhậm vs Tả Nhậm Comparison Diagram Asset
 */
export const HuuNhamComparisonAsset: React.FC<IllustrationProps> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 540 280" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="540" height="280" rx="16" fill="#16181D" />
    
    {/* LEFT SIDE: HỮU NHẬM (RIGHT-OVER-LEFT / LEFT LAPEL OVER RIGHT) - CORRECT */}
    <g transform="translate(30, 20)">
      <rect width="220" height="240" rx="12" fill="#064E3B" fillOpacity="0.25" stroke="#059669" strokeWidth="1.5" />
      <text x="110" y="30" fill="#34D399" fontSize="13" fontWeight="bold" textAnchor="middle">✓ HỮU NHẬM (右衽)</text>
      <text x="110" y="46" fill="#86EFAC" fontSize="10" textAnchor="middle">Quy Chuẩn Cổ Phục Người Sống</text>

      {/* Robe Collar Demonstration */}
      <circle cx="110" cy="95" r="20" fill="#0F172A" />
      {/* Right Under-Flap */}
      <path d="M90 100 L140 180" stroke="#059669" strokeWidth="4" />
      {/* Left Over-Flap (Covers Right Flap) */}
      <path d="M130 95 L80 180" stroke="#34D399" strokeWidth="6" strokeLinecap="round" />
      <circle cx="132" cy="115" r="4" fill="#FDE68A" stroke="#78350F" />
      <circle cx="140" cy="135" r="4" fill="#FDE68A" stroke="#78350F" />

      <rect x="20" y="195" width="180" height="32" rx="6" fill="#064E3B" />
      <text x="110" y="215" fill="#A7F3D0" fontSize="10" textAnchor="middle">Vạt Trái đè lên Vạt Phải</text>
    </g>

    {/* RIGHT SIDE: TẢ NHẬM (LEFT-OVER-RIGHT / RIGHT LAPEL OVER LEFT) - TABOO */}
    <g transform="translate(290, 20)">
      <rect width="220" height="240" rx="12" fill="#7F1D1D" fillOpacity="0.25" stroke="#DC2626" strokeWidth="1.5" />
      <text x="110" y="30" fill="#F87171" fontSize="13" fontWeight="bold" textAnchor="middle">✕ TẢ NHẬM (左衽)</text>
      <text x="110" y="46" fill="#FCA5A5" fontSize="10" textAnchor="middle">ĐẠI KỴ - CHỈ DÙNG KHÂM LIỆM TỬ THI</text>

      {/* Robe Collar Inverted */}
      <circle cx="110" cy="95" r="20" fill="#0F172A" />
      {/* Left Under-Flap */}
      <path d="M130 95 L80 180" stroke="#7F1D1D" strokeWidth="4" />
      {/* Right Over-Flap (Inverted - Taboo) */}
      <path d="M90 100 L140 180" stroke="#DC2626" strokeWidth="6" strokeLinecap="round" />
      <circle cx="88" cy="115" r="4" fill="#DC2626" stroke="#FFFFFF" />

      <rect x="20" y="195" width="180" height="32" rx="6" fill="#7F1D1D" />
      <text x="110" y="215" fill="#FECACA" fontSize="10" textAnchor="middle">Vạt Phải đè Vạt Trái (CẤM KỴ)</text>
    </g>
  </svg>
);
