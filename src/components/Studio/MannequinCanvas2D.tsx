'use client';

import React, { useState, useRef } from 'react';
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
  Check,
  Camera,
  Upload,
  X,
  Smile,
  Maximize2
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
  const [avatarRole, setAvatarRole] = useState<'STUDENT' | 'ROYAL'>('STUDENT');
  const [skinToneType, setSkinToneType] = useState<'IVORY' | 'HONEY' | 'ROSE'>('IVORY');
  const [displayMode, setDisplayMode] = useState<'FIGURE' | 'DRESS_FORM'>('FIGURE');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [visibleLayers, setVisibleLayers] = useState({
    base: true,
    bottom: true,
    core: true,
    outer: true,
    accessory: true,
    footwear: true
  });

  // Camera / Face Try-On Modal State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setIsCameraModalOpen(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 480, height: 480 }
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraModalOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 300, 300);
      const dataUrl = canvas.toDataURL('image/png');
      onUpdateOutfit(prev => ({
        ...prev,
        avatarType: 'CUSTOM_UPLOAD',
        customAvatarUrl: dataUrl
      }));
    }
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateOutfit(prev => ({
        ...prev,
        avatarType: 'CUSTOM_UPLOAD',
        customAvatarUrl: url
      }));
      setIsCameraModalOpen(false);
    }
  };

  const handleResetFace = () => {
    onUpdateOutfit(prev => ({
      ...prev,
      avatarType: 'FEMALE_STUDENT',
      customAvatarUrl: undefined
    }));
  };

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

  const activeColor = outfit.customColors?.['core'] || outfit.coreGarment.defaultColor?.hex || '#C53030';

  const toggleLayer = (layerKey: keyof typeof visibleLayers) => {
    setVisibleLayers(prev => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const isTaNham = outfit.lapelMode === 'TA_NHAM';
  const isXRay = outfit.isXRayMode;

  const coreCat = outfit.coreGarment.category;
  const coreId = outfit.coreGarment.id;

  // Has Sleeves flag: True for all traditional robes except bare Yếm alone
  const hasFullSleeves = visibleLayers.core && outfit.coreGarment;

  // Accessories flags
  const hasKiengBac = outfit.accessories.some(a => a.id === 'acc-kieng-bac');
  const hasNonQuaiThao = outfit.accessories.some(a => a.id === 'acc-non-quai-thao');
  const hasNonLa = outfit.accessories.some(a => a.id === 'acc-non-la');
  const hasKhanVanh = outfit.accessories.some(a => a.id === 'acc-khan-vanh' || a.id === 'acc-khan-dong-nam');
  const hasKhanRan = outfit.accessories.some(a => a.id === 'acc-khan-ran');
  const hasForeignObi = outfit.accessories.some(a => a.id === 'acc-foreign-kimono-obi');
  const hasForeignRuqun = outfit.accessories.some(a => a.id === 'acc-foreign-ruqun-ribbon');

  return (
    <div
      className={`relative w-full rounded-2xl bg-gradient-to-b from-[#FCFBF8] via-[#F8F6F0] to-[#EFECE2] border flex flex-col items-center justify-between p-3 sm:p-5 overflow-hidden shadow-xs transition-all ${
        isTaNham ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-stone-200'
      }`}
    >
      {/* ===================================================================== */}
      {/* CANVAS HEADER: CHARACTER ARCHETYPES & ATELIER TOOLS                   */}
      {/* ===================================================================== */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 pb-2.5 mb-2 z-20 text-xs font-mono">
        
        {/* Character Archetypes / Atelier Mode */}
        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
          <button
            onClick={() => {
              setDisplayMode('FIGURE');
              setModelGender('FEMALE');
              setAvatarRole('STUDENT');
            }}
            className={`px-2 py-1 rounded text-[11px] transition-colors font-medium cursor-pointer ${
              displayMode === 'FIGURE' && modelGender === 'FEMALE' && avatarRole === 'STUDENT'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Nữ Sinh Đoan Trang"
          >
            👩 Nữ Sinh
          </button>

          <button
            onClick={() => {
              setDisplayMode('FIGURE');
              setModelGender('FEMALE');
              setAvatarRole('ROYAL');
            }}
            className={`px-2 py-1 rounded text-[11px] transition-colors font-medium cursor-pointer ${
              displayMode === 'FIGURE' && modelGender === 'FEMALE' && avatarRole === 'ROYAL'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Nữ Quý Tộc Cung Đình"
          >
            👸 Quý Tộc
          </button>

          <button
            onClick={() => {
              setDisplayMode('FIGURE');
              setModelGender('MALE');
              setAvatarRole('STUDENT');
            }}
            className={`px-2 py-1 rounded text-[11px] transition-colors font-medium cursor-pointer ${
              displayMode === 'FIGURE' && modelGender === 'MALE' && avatarRole === 'STUDENT'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Nam Nho Sinh / Sĩ Tử"
          >
            👨 Nho Sinh
          </button>

          <button
            onClick={() => {
              setDisplayMode('FIGURE');
              setModelGender('MALE');
              setAvatarRole('ROYAL');
            }}
            className={`px-2 py-1 rounded text-[11px] transition-colors font-medium cursor-pointer ${
              displayMode === 'FIGURE' && modelGender === 'MALE' && avatarRole === 'ROYAL'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Nam Quan Viên Triều Đình"
          >
            🤴 Quan Viên
          </button>

          <button
            onClick={() => setDisplayMode(displayMode === 'DRESS_FORM' ? 'FIGURE' : 'DRESS_FORM')}
            className={`px-2 py-1 rounded text-[11px] transition-colors font-medium cursor-pointer ${
              displayMode === 'DRESS_FORM'
                ? 'bg-stone-800 text-white font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
            title="Chuyển chế độ Ma-nơ-canh Cốt Gỗ Công Xưởng (Atelier Dress Form)"
          >
            🪡 Cốt Gỗ
          </button>
        </div>

        {/* Quick Tools: Face Try-On, X-Ray Structure, Zoom */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={startCamera}
            className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] ${
              outfit.customAvatarUrl
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 shadow-xs'
            }`}
            title="Thử mặt chân dung qua Camera hoặc tải ảnh"
          >
            <Camera className="w-3.5 h-3.5 text-amber-700" />
            <span>{outfit.customAvatarUrl ? 'Mặt Cá Nhân' : 'Thử Mặt'}</span>
          </button>

          {outfit.customAvatarUrl && (
            <button
              onClick={handleResetFace}
              className="p-1 rounded bg-stone-100 border border-stone-200 text-stone-600 hover:text-stone-900 text-[10px] cursor-pointer"
              title="Gỡ ảnh thử mặt"
            >
              Gỡ
            </button>
          )}

          <button
            onClick={() => onUpdateOutfit(prev => ({ ...prev, isXRayMode: !prev.isXRayMode }))}
            className={`px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition-colors cursor-pointer text-[11px] ${
              isXRay
                ? 'bg-teal-50 border-teal-300 text-teal-900 font-semibold'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50 shadow-xs'
            }`}
            title="Chế độ soi chiếu cấu trúc đường may Chính Trung & các lớp phục sức"
          >
            {isXRay ? <Eye className="w-3.5 h-3.5 text-teal-700" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>X-Ray</span>
          </button>

          <button
            onClick={() => setZoomLevel(prev => (prev === 1 ? 1.25 : 1))}
            className="p-1.5 rounded-md bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer shadow-xs"
            title="Phóng to chi tiết ngực, cổ áo và nẹp cúc"
          >
            {zoomLevel === 1 ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MAIN 2D ATELIER STAGE (SEAMLESS VECTOR MANNEQUIN)                      */}
      {/* ===================================================================== */}
      <div className="relative w-full h-[430px] sm:h-[480px] flex items-center justify-center overflow-hidden">
        
        {/* Ambient Radial Spotlight */}
        <div
          className={`absolute inset-0 transition-colors duration-700 pointer-events-none opacity-40 ${
            isTaNham
              ? 'bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.18)_0%,transparent_70%)]'
              : isXRay
              ? 'bg-[radial-gradient(ellipse_at_center,rgba(13,148,136,0.15)_0%,transparent_70%)]'
              : 'bg-[radial-gradient(ellipse_at_center,rgba(214,158,46,0.14)_0%,transparent_70%)]'
          }`}
        />

        {/* Taboo Alert Watermark Banner */}
        {isTaNham && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1 rounded-full bg-amber-800 text-white font-mono text-[11px] font-semibold shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>LƯU Ý: VẠT ÁO NGƯỜI SỐNG KHÉP SANG PHẢI (HỮU NHẬM)</span>
          </div>
        )}

        {/* Foreign Assimilation Alert Banner */}
        {(hasForeignObi || hasForeignRuqun) && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1 rounded-full bg-rose-700 text-white font-mono text-[11px] font-semibold shadow-md flex items-center gap-1.5 whitespace-nowrap">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>LƯU Ý: PHỤ KIỆN LAI CĂNG NGOẠI LAI CẦN THAY THẾ</span>
          </div>
        )}

        {/* =================================================================== */}
        {/* RE-ENGINEERED VECTOR MANNEQUIN & GARMENTS                           */}
        {/* =================================================================== */}
        <div
          className="relative transition-transform duration-300 ease-out origin-center select-none"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 320 540"
            className="w-[290px] sm:w-[330px] h-[420px] sm:h-[475px] drop-shadow-xl select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Skin Tone Gradient */}
              <linearGradient id="skinTone" x1="0%" y1="0%" x2="100%" y2="100%">
                {skinToneType === 'HONEY' ? (
                  <>
                    <stop offset="0%" stopColor="#DFC3A7" />
                    <stop offset="60%" stopColor="#C9A280" />
                    <stop offset="100%" stopColor="#B38664" />
                  </>
                ) : skinToneType === 'ROSE' ? (
                  <>
                    <stop offset="0%" stopColor="#FFF2EE" />
                    <stop offset="60%" stopColor="#F9DDD6" />
                    <stop offset="100%" stopColor="#ECC4BC" />
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#FAF2EB" />
                    <stop offset="60%" stopColor="#EEDCCE" />
                    <stop offset="100%" stopColor="#DEC2AF" />
                  </>
                )}
              </linearGradient>

              {/* Atelier Fabric Dress Form Texture */}
              <linearGradient id="dressFormFabric" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5EFE6" />
                <stop offset="50%" stopColor="#E8DEC8" />
                <stop offset="100%" stopColor="#D5C5A8" />
              </linearGradient>

              {/* Atelier Stand Metallic Brass */}
              <linearGradient id="brassMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#F6E08B" />
                <stop offset="100%" stopColor="#AA820A" />
              </linearGradient>

              {/* Core Silk Fabric Gradient */}
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

              {/* Cyber Organza Gradient */}
              <linearGradient id="organzaSheer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#00F5D4" stopOpacity="0.2" />
              </linearGradient>

              {/* Clip path for user camera avatar face */}
              <clipPath id="avatarUserFaceClip">
                <ellipse cx="160" cy="62" rx="14" ry="16" />
              </clipPath>

              {/* Soft Drop Shadow Filter */}
              <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* =============================================================== */}
            {/* 1. ATELIER PEDESTAL & SHADOW BASE                               */}
            {/* =============================================================== */}
            <g id="atelier-pedestal">
              {/* Studio floor shadow */}
              <ellipse cx="160" cy="516" rx="72" ry="12" fill="#C5BFB0" opacity="0.4" />
              <ellipse cx="160" cy="516" rx="48" ry="7" fill="#A8A190" opacity="0.5" />

              {/* Atelier Brass Stand Base (If Dress Form Mode) */}
              {displayMode === 'DRESS_FORM' && (
                <g id="stand-pole">
                  {/* Brass circular base plate */}
                  <ellipse cx="160" cy="514" rx="42" ry="6" fill="url(#brassMetal)" stroke="#B45309" strokeWidth="0.8" />
                  <ellipse cx="160" cy="512" rx="36" ry="5" fill="#FAF5E4" opacity="0.6" />
                  {/* Center Brass Pole */}
                  <rect x="157" y="270" width="6" height="242" rx="2" fill="url(#brassMetal)" stroke="#92400E" strokeWidth="0.6" />
                  <circle cx="160" cy="460" r="5" fill="url(#brassMetal)" />
                </g>
              )}
            </g>

            {/* =============================================================== */}
            {/* 2. BASE ANATOMY / BODY SILHOUETTE (NO SLEEVE CLIPPING!)          */}
            {/* =============================================================== */}
            <g id="body-anatomy">
              
              {/* A. DRESS FORM MODE (Atelier Linen Tailor's Dummy) */}
              {displayMode === 'DRESS_FORM' ? (
                <g id="dress-form-body">
                  {/* Wooden Neck Cap & Finial */}
                  <ellipse cx="160" cy="80" rx="12" ry="4" fill="url(#brassMetal)" />
                  <circle cx="160" cy="74" r="5" fill="url(#brassMetal)" />
                  <path d="M157 74 L157 80 L163 80 L163 74 Z" fill="url(#brassMetal)" />

                  {/* Tailored Linen Torso Form */}
                  <path
                    d="M148 84 L172 84 L204 118 L192 188 Q160 196 128 188 L116 118 Z"
                    fill="url(#dressFormFabric)"
                    stroke="#B8A78A"
                    strokeWidth="1"
                  />
                  {/* Lower hips of dress form */}
                  <path
                    d="M128 188 Q160 196 192 188 L196 268 Q160 274 124 268 Z"
                    fill="url(#dressFormFabric)"
                    stroke="#B8A78A"
                    strokeWidth="1"
                  />
                  {/* Atelier Princess Seams (Đường may mẫu định hình) */}
                  <path d="M148 84 Q142 140 144 268" stroke="#A89475" strokeWidth="0.8" strokeDasharray="3 2" fill="none" />
                  <path d="M172 84 Q178 140 176 268" stroke="#A89475" strokeWidth="0.8" strokeDasharray="3 2" fill="none" />
                  <line x1="160" y1="84" x2="160" y2="270" stroke="#8C795C" strokeWidth="1" />
                </g>
              ) : (
                /* B. HUMAN CROQUIS MODE (Graceful Vietnamese Fashion Model) */
                <g id="human-croquis">
                  {/* Hair / Head Coiffure */}
                  {modelGender === 'FEMALE' ? (
                    <g id="female-hair">
                      <circle cx="160" cy="45" r="15" fill="#1C1917" />
                      <ellipse cx="160" cy="58" rx="19" ry="21" fill="#1C1917" />
                      {avatarRole === 'ROYAL' ? (
                        <>
                          <circle cx="160" cy="40" r="5" fill="#F59E0B" stroke="#D97706" strokeWidth="0.8" />
                          <line x1="172" y1="40" x2="194" y2="30" stroke="#00F5D4" strokeWidth="2.5" strokeLinecap="round" />
                          <circle cx="195" cy="30" r="3" fill="#FDE68A" />
                          <line x1="148" y1="40" x2="126" y2="30" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                          <circle cx="125" cy="30" r="3" fill="#FDE68A" />
                        </>
                      ) : (
                        <>
                          <line x1="172" y1="42" x2="190" y2="34" stroke="#00F5D4" strokeWidth="2" strokeLinecap="round" />
                          <circle cx="191" cy="34" r="2.5" fill="#FDE68A" />
                        </>
                      )}
                    </g>
                  ) : (
                    <g id="male-hair">
                      <ellipse cx="160" cy="48" rx="12" ry="10" fill="#1C1917" />
                      <path d="M142 54 Q160 42 178 54 L178 66 Q160 72 142 66 Z" fill="#1C1917" />
                      {avatarRole === 'ROYAL' && (
                        <>
                          <line x1="148" y1="46" x2="172" y2="46" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
                          <circle cx="173" cy="46" r="2.5" fill="#00F5D4" />
                        </>
                      )}
                    </g>
                  )}

                  {/* Face: User Camera Selfie or Elegant Vector Silhouette */}
                  {outfit.customAvatarUrl ? (
                    <g id="user-camera-face">
                      <ellipse cx="160" cy="62" rx="14" ry="16" fill="url(#skinTone)" />
                      <image
                        href={outfit.customAvatarUrl}
                        x="146"
                        y="46"
                        width="28"
                        height="32"
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="url(#avatarUserFaceClip)"
                      />
                      <ellipse cx="160" cy="62" rx="14" ry="16" fill="none" stroke="#D4AF37" strokeWidth="1" />
                    </g>
                  ) : (
                    <g id="croquis-face">
                      <ellipse cx="160" cy="62" rx="14" ry="16" fill="url(#skinTone)" stroke="#D6C4B2" strokeWidth="0.8" />
                      {/* Gentle Facial Details */}
                      <path d="M154 62 Q156 64 155 66" stroke="#C4A892" strokeWidth="0.8" fill="none" />
                      <path d="M157 70 Q160 71 163 70" stroke="#BE185D" strokeWidth="1" strokeLinecap="round" />
                    </g>
                  )}

                  {/* Slender Neck (Cổ cao ba ngấn) */}
                  <path d="M153 76 L153 98 L167 98 L167 76 Z" fill="url(#skinTone)" />
                  <path d="M146 98 Q160 104 174 98" stroke="#CBB5A1" strokeWidth="1.2" strokeLinecap="round" />

                  {/* Graceful Shoulders & Torso */}
                  <path
                    d="M108 114 Q160 102 212 114 L200 230 Q160 238 120 230 Z"
                    fill="url(#skinTone)"
                    stroke="#D6C4B2"
                    strokeWidth="0.8"
                  />

                  {/* Legs & Feet (Chân dài chuẩn thời trang) */}
                  <path d="M136 230 L138 480 L152 480 L156 230 Z" fill="url(#skinTone)" opacity="0.95" />
                  <path d="M164 230 L168 480 L182 480 L184 230 Z" fill="url(#skinTone)" opacity="0.95" />
                  <ellipse cx="145" cy="484" rx="8" ry="4" fill="url(#skinTone)" />
                  <ellipse cx="175" cy="484" rx="8" ry="4" fill="url(#skinTone)" />

                  {/* BARE ARMS: ONLY RENDERED WHEN NO CORE ROBE IS ACTIVE (ELIMINATING ARM CLIPPING!) */}
                  {!hasFullSleeves && (
                    <g id="bare-arms">
                      {/* Left Bare Arm */}
                      <path
                        d="M108 114 Q90 170 94 246 L104 246 Q106 174 120 126 Z"
                        fill="url(#skinTone)"
                        stroke="#D6C4B2"
                        strokeWidth="0.8"
                      />
                      <path d="M94 246 Q92 254 96 258 Q100 254 104 246 Z" fill="url(#skinTone)" />

                      {/* Right Bare Arm */}
                      <path
                        d="M212 114 Q230 170 226 246 L216 246 Q214 174 200 126 Z"
                        fill="url(#skinTone)"
                        stroke="#D6C4B2"
                        strokeWidth="0.8"
                      />
                      <path d="M216 246 Q220 254 224 258 Q228 254 226 246 Z" fill="url(#skinTone)" />
                    </g>
                  )}
                </g>
              )}
            </g>

            {/* =============================================================== */}
            {/* 3. LAYER 1: BASE LAYER / NỘI Y (YẾM ĐÀO HOẶC TRUNG ĐƠN)        */}
            {/* =============================================================== */}
            {visibleLayers.base && outfit.baseGarment && (
              <g id="layer-base">
                {outfit.baseGarment.id === 'base-yem-canh-sen' || outfit.baseGarment.id.includes('yem') ? (
                  /* Yếm Đào Cổ Cánh Sen */
                  <g filter="url(#softGlow)">
                    <path d="M152 86 Q160 100 168 86" stroke="#D69E2E" strokeWidth="1.6" fill="none" />
                    <path
                      d="M142 108 Q160 114 178 108 L188 174 Q160 186 132 174 Z"
                      fill="#C53030"
                      stroke="#FDA4AF"
                      strokeWidth="1.2"
                    />
                    {/* Golden Lotus center embroidery */}
                    <circle cx="160" cy="140" r="5" fill="#FDE68A" />
                    <path d="M155 140 Q160 133 165 140" stroke="#B45309" strokeWidth="1" fill="none" />
                    <path d="M153 144 Q160 150 167 144" stroke="#B45309" strokeWidth="1" fill="none" />
                  </g>
                ) : (
                  /* Trung Đơn Lụa Bạch (Áo Lót Trắng Lập Lĩnh) */
                  <g>
                    <path
                      d="M140 96 L180 96 L190 190 L130 190 Z"
                      fill="#FFFFFF"
                      stroke="#E5E7EB"
                      strokeWidth="1"
                    />
                    {/* Diềm trắng lập lĩnh ôm khít 1.5mm */}
                    <rect x="145" y="90" width="30" height="9" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
                  </g>
                )}
              </g>
            )}

            {/* =============================================================== */}
            {/* 4. LAYER 2: BOTTOM PIECE / HẠ Y (QUẦN LỤA / VÁY ĐỤP / CARGO)    */}
            {/* =============================================================== */}
            {visibleLayers.bottom && outfit.bottomPiece && (
              <g id="layer-bottom" filter="url(#softGlow)">
                {outfit.bottomPiece.id === 'bottom-vay-dup-den' ? (
                  /* Váy Đụp Đen Kinh Bắc */
                  <g>
                    <path
                      d="M132 216 L188 216 L220 442 Q160 458 100 442 Z"
                      fill="#18181B"
                      stroke="#27272A"
                      strokeWidth="1.5"
                    />
                    <path d="M145 220 Q142 330 135 444" stroke="#27272A" strokeWidth="1.2" fill="none" />
                    <path d="M175 220 Q178 330 185 444" stroke="#27272A" strokeWidth="1.2" fill="none" />
                  </g>
                ) : outfit.bottomPiece.id === 'bottom-parachute-cargo' ? (
                  /* Quần Cargo Techwear Gen Z */
                  <g>
                    <path
                      d="M130 216 L190 216 L210 476 L168 476 L160 280 L152 476 L110 476 Z"
                      fill="#1E293B"
                      stroke="#334155"
                      strokeWidth="1.5"
                    />
                    <line x1="118" y1="312" x2="148" y2="312" stroke="#CCFF00" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="172" y1="312" x2="202" y2="312" stroke="#CCFF00" strokeWidth="2" strokeDasharray="3 3" />
                    <rect x="120" y="322" width="22" height="26" rx="2" fill="#0F172A" stroke="#334155" />
                    <rect x="178" y="322" width="22" height="26" rx="2" fill="#0F172A" stroke="#334155" />
                  </g>
                ) : (
                  /* Quần Lụa Trắng / Quần Lụa Đen Ống Suông */
                  <g>
                    <path
                      d="M134 216 L186 216 L202 478 L168 478 L160 262 L152 478 L118 478 Z"
                      fill={outfit.bottomPiece.defaultColor?.hex || '#F8FAFC'}
                      stroke="#CBD5E1"
                      strokeWidth="0.8"
                      opacity={isXRay ? 0.35 : 1}
                    />
                    <path d="M142 240 Q138 360 134 478" stroke={outfit.bottomPiece.defaultColor?.hex === '#F8FAFC' ? '#E2E8F0' : '#27272A'} strokeWidth="1" fill="none" />
                    <path d="M178 240 Q182 360 186 478" stroke={outfit.bottomPiece.defaultColor?.hex === '#F8FAFC' ? '#E2E8F0' : '#27272A'} strokeWidth="1" fill="none" />
                  </g>
                )}
              </g>
            )}

            {/* =============================================================== */}
            {/* 5. LAYER 3: CORE ROBES & SEAMLESS SLEEVES (ZERO CLIPPING!)       */}
            {/* =============================================================== */}
            {visibleLayers.core && (
              <g id="layer-core" opacity={isXRay ? 0.45 : 1} filter="url(#softGlow)">
                
                {/* ------------------------------------------------------------- */}
                {/* A. ÁO NHẬT BÌNH HOÀNG CUNG HUẾ                                */}
                {/* ------------------------------------------------------------- */}
                {coreId === 'core-nhat-binh' || coreCat === 'NHAT_BINH' ? (
                  <g id="robe-nhat-binh">
                    {/* Main Imperial Crimson Robe Body */}
                    <path
                      d="M108 114 L212 114 L228 436 Q160 448 92 436 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.5"
                    />

                    {/* SEAMLESS COURTLY SLEEVES WITH FIVE-ELEMENT CUFF BANDS */}
                    {/* Left Drooping Sleeve (Thụng Cung Đình) */}
                    <path
                      d="M108 114 Q78 190 62 272 L102 280 Q122 196 126 150 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.2"
                    />
                    {/* 5-Element Wrist Bands on Left Cuff */}
                    <rect x="63" y="266" width="38" height="3" fill="#1E3A8A" transform="rotate(11, 63, 266)" />
                    <rect x="65" y="269" width="38" height="3" fill="#D69E2E" transform="rotate(11, 65, 269)" />
                    <rect x="67" y="272" width="38" height="3" fill="#FFFFFF" transform="rotate(11, 67, 272)" />
                    <rect x="69" y="275" width="38" height="3" fill="#C53030" transform="rotate(11, 69, 275)" />
                    <rect x="71" y="278" width="38" height="3" fill="#0E0F12" transform="rotate(11, 71, 278)" />

                    {/* Right Drooping Sleeve (Thụng Cung Đình) */}
                    <path
                      d="M212 114 Q242 190 258 272 L218 280 Q198 196 194 150 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.2"
                    />
                    {/* 5-Element Wrist Bands on Right Cuff */}
                    <rect x="220" y="278" width="38" height="3" fill="#0E0F12" transform="rotate(-11, 220, 278)" />
                    <rect x="218" y="275" width="38" height="3" fill="#C53030" transform="rotate(-11, 218, 275)" />
                    <rect x="216" y="272" width="38" height="3" fill="#FFFFFF" transform="rotate(-11, 216, 272)" />
                    <rect x="214" y="269" width="38" height="3" fill="#D69E2E" transform="rotate(-11, 214, 269)" />
                    <rect x="212" y="266" width="38" height="3" fill="#1E3A8A" transform="rotate(-11, 212, 266)" />

                    {/* Graceful Courtly Hands emerging cleanly at cuffs */}
                    {displayMode === 'FIGURE' && (
                      <g id="nhat-binh-hands">
                        {/* Left Hand */}
                        <path d="M84 278 Q88 296 94 298 Q98 294 96 280 Z" fill="url(#skinTone)" stroke="#CBB5A1" strokeWidth="0.6" />
                        {/* Right Hand */}
                        <path d="M224 280 Q222 294 226 298 Q232 296 236 278 Z" fill="url(#skinTone)" stroke="#CBB5A1" strokeWidth="0.6" />
                      </g>
                    )}

                    {/* Wide Rectangular Embroidered Collar (Cổ Vuông Chữ Nhật) */}
                    <rect
                      x="140"
                      y="98"
                      width="40"
                      height="176"
                      rx="3"
                      fill="#831843"
                      stroke="url(#goldSeam)"
                      strokeWidth="2.5"
                    />
                    <circle cx="160" cy="128" r="4" fill="#FDE68A" />
                    <circle cx="160" cy="178" r="4" fill="#FDE68A" />
                    <circle cx="160" cy="228" r="4" fill="#FDE68A" />

                    {/* Imperial Jade Tassels & Chest Cord (Đai ngọc thắt ngực) */}
                    <circle cx="160" cy="274" r="6" fill="#00F5D4" stroke="#FDE68A" strokeWidth="1.8" />
                    <line x1="160" y1="280" x2="160" y2="350" stroke="#FDE68A" strokeWidth="2.2" />
                    <circle cx="160" cy="352" r="3" fill="#FDE68A" />
                  </g>
                ) : coreId === 'core-ao-tac' || coreCat === 'AO_TAC' ? (
                  /* ----------------------------------------------------------- */
                  /* B. ÁO TẤC / TAY THỤ (ĐẠI LỄ TRIỀU NGUYỄN)                   */
                  /* ----------------------------------------------------------- */
                  <g id="robe-ao-tac">
                    {/* Robe Body flared wide past knees */}
                    <path
                      d="M110 114 L210 114 L232 444 Q160 456 88 444 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.5"
                    />

                    {/* Standing Collar Lập Lĩnh */}
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

                    {/* MAGNIFICENT SQUARE DROOPING SLEEVES (Tay Thụng Rộng 35-45cm) */}
                    {/* Left Wide Drooping Sleeve */}
                    <path
                      d="M110 114 Q74 190 48 282 L112 290 Q124 196 126 150 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.3"
                    />
                    {/* Right Wide Drooping Sleeve */}
                    <path
                      d="M210 114 Q246 190 272 282 L208 290 Q196 196 194 150 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.3"
                    />

                    {/* Hands folded reverently inside square cuffs (Chắp tay cung kính) */}
                    {displayMode === 'FIGURE' && (
                      <g id="ao-tac-hands">
                        <path d="M102 284 Q106 298 112 300 Q116 296 114 286 Z" fill="url(#skinTone)" stroke="#CBB5A1" strokeWidth="0.6" />
                        <path d="M206 286 Q204 296 208 300 Q214 298 218 284 Z" fill="url(#skinTone)" stroke="#CBB5A1" strokeWidth="0.6" />
                      </g>
                    )}

                    {/* Sống Lưng Chính Trung Seamline */}
                    <line x1="160" y1="104" x2="160" y2="446" stroke="url(#goldSeam)" strokeWidth="1.8" />

                    {/* Lapel Overlay: Hữu Nhậm vs Tả Nhậm */}
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
                  /* ----------------------------------------------------------- */
                  /* C. ÁO GIAO LĨNH CỔ CHÉO (ĐẠI VIỆT TK 11 - 18)               */
                  /* ----------------------------------------------------------- */
                  <g id="robe-giao-linh">
                    <path
                      d="M108 114 L212 114 L228 438 Q160 450 92 438 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.5"
                    />

                    {/* Broad sleeves */}
                    <path
                      d="M108 114 Q78 186 66 264 L104 272 Q122 196 126 150 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M212 114 Q242 186 254 264 L216 272 Q198 196 194 150 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.2"
                    />

                    {displayMode === 'FIGURE' && (
                      <g id="giao-linh-hands">
                        <path d="M92 270 Q94 286 100 288 Q104 284 102 272 Z" fill="url(#skinTone)" />
                        <path d="M218 272 Q216 284 220 288 Q226 286 228 270 Z" fill="url(#skinTone)" />
                      </g>
                    )}

                    {/* Crossed Y-Collar (Cổ chéo Hữu Nhậm: Trái đè Phải) */}
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
                  </g>
                ) : coreId === 'core-ao-dai-raglan' || coreCat === 'AO_DAI_RAGLAN' ? (
                  /* ----------------------------------------------------------- */
                  /* D. ÁO DÀI RAGLAN (THẬP NIÊN 1960)                            */
                  /* ----------------------------------------------------------- */
                  <g id="robe-raglan">
                    <path
                      d="M122 116 L198 116 L208 456 Q160 464 112 456 Z"
                      fill="url(#coreFabric)"
                      stroke="#FDE68A"
                      strokeWidth="1.2"
                    />
                    <rect x="145" y="92" width="30" height="12" rx="3" fill={activeColor} stroke="#FDE68A" strokeWidth="1.2" />

                    {/* Raglan Diagonal Seams (Nối xéo triệt tiêu nếp nhăn) */}
                    <line x1="145" y1="104" x2="114" y2="148" stroke="#CCFF00" strokeWidth="1.8" strokeDasharray="4 2" />
                    <line x1="175" y1="104" x2="206" y2="148" stroke="#CCFF00" strokeWidth="1.8" strokeDasharray="4 2" />

                    {/* Fitted Wrist Sleeves (Ôm gọn cổ tay, không clip) */}
                    <path
                      d="M118 116 Q92 186 94 250 L106 252 Q116 186 130 144 Z"
                      fill="url(#coreFabric)"
                      stroke="#FDE68A"
                      strokeWidth="1"
                    />
                    <path
                      d="M202 116 Q228 186 226 250 L214 252 Q204 186 190 144 Z"
                      fill="url(#coreFabric)"
                      stroke="#FDE68A"
                      strokeWidth="1"
                    />

                    {/* Delicate Hands emerging naturally */}
                    {displayMode === 'FIGURE' && (
                      <g id="raglan-hands">
                        <path d="M96 252 Q94 266 98 270 Q102 266 104 252 Z" fill="url(#skinTone)" />
                        <path d="M216 252 Q218 266 222 270 Q226 266 224 252 Z" fill="url(#skinTone)" />
                      </g>
                    )}

                    {/* Side snap buttons */}
                    <circle cx="196" cy="172" r="2" fill="#FDE68A" />
                    <circle cx="196" cy="186" r="2" fill="#FDE68A" />
                  </g>
                ) : coreId === 'core-ao-dai-lemur' || coreCat === 'AO_DAI_LEMUR' ? (
                  /* ----------------------------------------------------------- */
                  /* E. ÁO DÀI LE MUR (CẢI CÁCH CÁT TƯỜNG 1930s)                */
                  /* ----------------------------------------------------------- */
                  <g id="robe-lemur">
                    <path
                      d="M122 116 L198 116 L206 450 Q160 460 114 450 Z"
                      fill="url(#coreFabric)"
                      stroke="#E9D5FF"
                      strokeWidth="1.2"
                    />
                    {/* Lotus Collar */}
                    <ellipse cx="160" cy="106" rx="22" ry="8" fill="#6B21A8" stroke="#F3E8FF" strokeWidth="1.2" />

                    {/* Puffed Sleeves (Vai bồng Parisienne) */}
                    <circle cx="110" cy="118" r="16" fill="url(#coreFabric)" stroke="#F3E8FF" strokeWidth="1" />
                    <circle cx="210" cy="118" r="16" fill="url(#coreFabric)" stroke="#F3E8FF" strokeWidth="1" />

                    {/* Fitted Sleeves downwards */}
                    <path
                      d="M102 130 Q92 186 94 250 L106 252 Q114 186 122 142 Z"
                      fill="url(#coreFabric)"
                      stroke="#E9D5FF"
                      strokeWidth="1"
                    />
                    <path
                      d="M218 130 Q228 186 226 250 L214 252 Q206 186 198 142 Z"
                      fill="url(#coreFabric)"
                      stroke="#E9D5FF"
                      strokeWidth="1"
                    />

                    {displayMode === 'FIGURE' && (
                      <g id="lemur-hands">
                        <path d="M96 252 Q94 266 98 270 Q102 266 104 252 Z" fill="url(#skinTone)" />
                        <path d="M216 252 Q218 266 222 270 Q226 266 224 252 Z" fill="url(#skinTone)" />
                      </g>
                    )}
                  </g>
                ) : coreId === 'core-ba-ba' || coreCat === 'BA_BA' ? (
                  /* ----------------------------------------------------------- */
                  /* F. ÁO BÀ BA NAM BỘ                                          */
                  /* ----------------------------------------------------------- */
                  <g id="robe-ba-ba">
                    <path
                      d="M118 114 L202 114 L206 296 Q160 302 114 296 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.2"
                    />
                    {/* Clean Center Slit & Button Row */}
                    <line x1="160" y1="108" x2="160" y2="294" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3 3" />
                    {[125, 155, 185, 215, 245, 275].map(y => (
                      <circle key={y} cx="160" cy={y} r="2.5" fill="#FDE68A" stroke="#78350F" strokeWidth="0.8" />
                    ))}
                    {/* Front Pockets */}
                    <rect x="128" y="250" width="22" height="24" rx="2" fill="none" stroke="#FDE68A" strokeWidth="1" />
                    <rect x="170" y="250" width="22" height="24" rx="2" fill="none" stroke="#FDE68A" strokeWidth="1" />

                    {/* Fitted Sleeves */}
                    <path
                      d="M118 114 Q92 186 94 250 L106 252 Q116 186 130 144 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1"
                    />
                    <path
                      d="M202 114 Q228 186 226 250 L214 252 Q204 186 190 144 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1"
                    />

                    {displayMode === 'FIGURE' && (
                      <g id="ba-ba-hands">
                        <path d="M96 252 Q94 266 98 270 Q102 266 104 252 Z" fill="url(#skinTone)" />
                        <path d="M216 252 Q218 266 222 270 Q226 266 224 252 Z" fill="url(#skinTone)" />
                      </g>
                    )}
                  </g>
                ) : coreId === 'core-tu-than' || coreCat === 'TU_THAN' ? (
                  /* ----------------------------------------------------------- */
                  /* G. ÁO TỨ THÂN KINH BẮC (THẮT VẠT LƯƠN)                      */
                  /* ----------------------------------------------------------- */
                  <g id="robe-tu-than">
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
                    {/* Tied flap bow at waist (Thắt Vạt Lươn) */}
                    <ellipse cx="160" cy="226" rx="15" ry="9" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
                    <path d="M152 232 Q144 282 138 316" stroke="#FDE68A" strokeWidth="3.2" strokeLinecap="round" />
                    <path d="M168 232 Q176 282 182 316" stroke="#FDE68A" strokeWidth="3.2" strokeLinecap="round" />

                    {/* Seamless sleeves */}
                    <path
                      d="M114 114 Q92 186 94 250 L106 252 Q116 186 130 144 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1"
                    />
                    <path
                      d="M206 114 Q228 186 226 250 L214 252 Q204 186 190 144 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1"
                    />

                    {displayMode === 'FIGURE' && (
                      <g id="tu-than-hands">
                        <path d="M96 252 Q94 266 98 270 Q102 266 104 252 Z" fill="url(#skinTone)" />
                        <path d="M216 252 Q218 266 222 270 Q226 266 224 252 Z" fill="url(#skinTone)" />
                      </g>
                    )}
                  </g>
                ) : (
                  /* ----------------------------------------------------------- */
                  /* H. ÁO NGŨ THÂN TAY CHẼN (CHUẨN MỰC QUỐC PHỤC TRIỀU NGUYỄN)  */
                  /* ----------------------------------------------------------- */
                  <g id="robe-ngu-than">
                    {/* Flared A-line robe body */}
                    <path
                      d="M120 114 L200 114 L210 436 Q160 446 110 436 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1.5"
                    />

                    {/* High Standing Collar (Lập Lĩnh 2-3cm) */}
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

                    {/* Sống Lưng Chính Trung Seamline */}
                    <line x1="160" y1="104" x2="160" y2="438" stroke="url(#goldSeam)" strokeWidth="1.8" />

                    {/* Lapel Overlay: Hữu Nhậm vs Tả Nhậm */}
                    {isTaNham ? (
                      <path d="M175 104 Q150 142 124 154 L124 436" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                    ) : (
                      <path d="M145 104 Q170 142 196 154 L196 436" stroke="url(#goldSeam)" strokeWidth="2.5" fill="none" />
                    )}

                    {/* 5 Brass Buttons (Ngũ Thường: Nhân, Lễ, Nghĩa, Trí, Tín) */}
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

                    {/* SEAMLESS FITTED WRIST SLEEVES (TAY CHẼN) */}
                    {/* Left Fitted Sleeve */}
                    <path
                      d="M120 114 Q92 186 94 250 L106 252 Q116 186 132 144 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1"
                    />
                    {/* Right Fitted Sleeve */}
                    <path
                      d="M200 114 Q228 186 226 250 L214 252 Q204 186 188 144 Z"
                      fill="url(#coreFabric)"
                      stroke="#D69E2E"
                      strokeWidth="1"
                    />

                    {/* Hands emerging naturally at cuffs with jade rings */}
                    {displayMode === 'FIGURE' && (
                      <g id="ngu-than-hands">
                        {/* Left Hand */}
                        <path d="M96 252 Q94 266 98 270 Q102 266 104 252 Z" fill="url(#skinTone)" />
                        <ellipse cx="99" cy="264" rx="1.5" ry="1.5" fill="#00F5D4" />
                        {/* Right Hand */}
                        <path d="M216 252 Q218 266 222 270 Q226 266 224 252 Z" fill="url(#skinTone)" />
                        <ellipse cx="221" cy="264" rx="1.5" ry="1.5" fill="#00F5D4" />
                      </g>
                    )}
                  </g>
                )}

              </g>
            )}

            {/* =============================================================== */}
            {/* 6. LAYER 4: OUTERWEAR / KHOÁC NGOÀI (CYBER TRENCH / SA NGOÀI)   */}
            {/* =============================================================== */}
            {visibleLayers.outer && outfit.outerGarment && !isXRay && (
              <g id="layer-outer" filter="url(#softGlow)">
                {outfit.outerGarment.id === 'outer-cyber-organza' ? (
                  /* Translucent Cyber Organza Silhouette */
                  <g>
                    <path
                      d="M104 110 L216 110 L234 460 Q160 470 86 460 Z"
                      fill="url(#organzaSheer)"
                      stroke="#CCFF00"
                      strokeWidth="1.5"
                      strokeDasharray="5 3"
                    />
                    <line x1="118" y1="176" x2="202" y2="176" stroke="#CCFF00" strokeWidth="2" />
                    <rect x="152" y="170" width="16" height="12" rx="2" fill="#CCFF00" />
                  </g>
                ) : (
                  /* Áo Tấc Sa Khoác Ngoài */
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
            {/* 7. LAYER 5: ACCESSORIES / PHỤ KIỆN (KIỀNG, NÓN, KHĂN)           */}
            {/* =============================================================== */}
            {visibleLayers.accessory && (
              <g id="layer-accessories" filter="url(#softGlow)">
                
                {/* Kiềng Bạc Chạm Hoa Sen */}
                {hasKiengBac && (
                  <path
                    d="M142 108 Q160 124 178 108"
                    stroke="#E2E8F0"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                )}

                {/* Khăn Rằn Nam Bộ */}
                {hasKhanRan && (
                  <g id="acc-khan-ran">
                    <path
                      d="M146 102 Q160 112 174 102 L180 234 L168 234 L158 112 L148 212 L138 212 Z"
                      fill="#38BDF8"
                      stroke="#0F172A"
                      strokeWidth="1.2"
                    />
                    <line x1="140" y1="158" x2="180" y2="158" stroke="#FFFFFF" strokeWidth="1" />
                    <line x1="140" y1="188" x2="180" y2="188" stroke="#FFFFFF" strokeWidth="1" />
                  </g>
                )}

                {/* Nón Ba Tầm / Quai Thao */}
                {hasNonQuaiThao && (
                  <g id="acc-non-quai-thao">
                    <ellipse cx="160" cy="48" rx="58" ry="16" fill="#D69E2E" stroke="#FDE68A" strokeWidth="1.5" />
                    <ellipse cx="160" cy="46" rx="50" ry="12" fill="#B45309" opacity="0.4" />
                    <path d="M120 52 Q105 128 112 208" stroke="#D69E2E" strokeWidth="2" fill="none" />
                    <path d="M200 52 Q215 128 208 208" stroke="#D69E2E" strokeWidth="2" fill="none" />
                    <circle cx="112" cy="210" r="3" fill="#FDE68A" />
                    <circle cx="208" cy="210" r="3" fill="#FDE68A" />
                  </g>
                )}

                {/* Nón Lá Huế */}
                {hasNonLa && (
                  <g id="acc-non-la">
                    <path d="M160 20 L112 64 L208 64 Z" fill="#FDE68A" stroke="#D69E2E" strokeWidth="1.2" />
                    <line x1="126" y1="50" x2="194" y2="50" stroke="#D69E2E" strokeWidth="0.8" />
                    <line x1="142" y1="36" x2="178" y2="36" stroke="#D69E2E" strokeWidth="0.8" />
                  </g>
                )}

                {/* Khăn Vành Dây Hoàng Tộc */}
                {hasKhanVanh && (
                  <g id="acc-khan-vanh">
                    <path
                      d="M138 50 Q160 44 182 50 L186 62 Q160 58 134 62 Z"
                      fill="#D69E2E"
                      stroke="#FDE68A"
                      strokeWidth="1.2"
                    />
                    <line x1="136" y1="54" x2="184" y2="54" stroke="#FDE68A" strokeWidth="1" />
                    <line x1="135" y1="58" x2="185" y2="58" stroke="#FDE68A" strokeWidth="1" />
                  </g>
                )}

                {/* Lai căng: Kimono Obi Alert */}
                {hasForeignObi && (
                  <g id="foreign-obi">
                    <rect x="122" y="196" width="76" height="28" rx="2" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                    <text x="160" y="214" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      OBI NHẬT (LAI CĂNG)
                    </text>
                  </g>
                )}

                {/* Lai căng: Hanfu Ruqun Ribbon Alert */}
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
            {/* 8. LAYER 6: FOOTWEAR / GIÀY DÉP                                 */}
            {/* =============================================================== */}
            {visibleLayers.footwear && (
              <g id="layer-footwear">
                {outfit.footwear?.id === 'acc-sneaker-chunky' ? (
                  /* Chunky Sneaker Cyber Lime */
                  <g>
                    <rect x="134" y="476" width="22" height="16" rx="4" fill="#FFFFFF" stroke="#CCFF00" strokeWidth="1.6" />
                    <rect x="164" y="476" width="22" height="16" rx="4" fill="#FFFFFF" stroke="#CCFF00" strokeWidth="1.6" />
                    <line x1="134" y1="488" x2="156" y2="488" stroke="#00F5D4" strokeWidth="2" />
                    <line x1="164" y1="488" x2="186" y2="488" stroke="#00F5D4" strokeWidth="2" />
                  </g>
                ) : (
                  /* Guốc Mộc Quai Nhung Đỏ Son */
                  <g>
                    <ellipse cx="145" cy="486" rx="10" ry="4" fill="#78350F" />
                    <ellipse cx="175" cy="486" rx="10" ry="4" fill="#78350F" />
                    <path d="M140 484 Q145 480 150 484" stroke="#BE123C" strokeWidth="2.5" fill="none" />
                    <path d="M170 484 Q175 480 180 484" stroke="#BE123C" strokeWidth="2.5" fill="none" />
                  </g>
                )}
              </g>
            )}

          </svg>
        </div>

      </div>

      {/* ===================================================================== */}
      {/* CANVAS DOCK: CLEAN BOTTOM UTILITY BAR                                  */}
      {/* ===================================================================== */}
      <div className="w-full pt-2.5 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2 z-20 text-xs">
        
        {/* Flip Lapel Test Button */}
        <button
          onClick={onToggleLapel}
          className={`px-3 py-1.5 rounded-lg font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs text-xs border ${
            isTaNham
              ? 'bg-amber-600 text-white border-amber-600'
              : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200'
          }`}
          title="Kiểm tra quy chuẩn khép vạt Hữu Nhậm / Tả Nhậm"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-700" />
          <span>{isTaNham ? 'Đang Tả Nhậm (Click Sửa)' : 'Vạt Hữu Nhậm Chuẩn'}</span>
        </button>

        {/* Skin Tone Selector */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span className="text-stone-500 hidden sm:inline">Nước Da:</span>
          {[
            { id: 'IVORY', label: 'Trắng Ngà', color: '#ECD9C8' },
            { id: 'HONEY', label: 'Bánh Mật', color: '#C89D7A' },
            { id: 'ROSE', label: 'Trắng Hồng', color: '#FAD8D0' },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setSkinToneType(st.id as any)}
              className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all cursor-pointer border ${
                skinToneType === st.id ? 'bg-amber-100 text-amber-900 font-bold border-amber-300' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span className="w-2 h-2 rounded-full border border-black/20" style={{ backgroundColor: st.color }} />
              <span>{st.label}</span>
            </button>
          ))}
        </div>

      </div>

      {/* ===================================================================== */}
      {/* CAMERA / FACE TRY-ON MODAL                                            */}
      {/* ===================================================================== */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-stone-200 rounded-2xl p-6 shadow-2xl space-y-4 text-center">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-700" />
                <h4 className="font-imperial font-bold text-stone-900 text-base">
                  Thử Mặt Cá Nhân (Face Try-On)
                </h4>
              </div>
              <button
                onClick={stopCamera}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Chụp ảnh selfie trực tiếp từ webcam hoặc tải ảnh chân dung cận mặt để ướm lên ma-nơ-canh cổ phục.
            </p>

            {/* Webcam Video Preview or Upload Box */}
            <div className="relative w-60 h-60 mx-auto rounded-full overflow-hidden border-4 border-amber-500 bg-stone-900 flex items-center justify-center shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />
              <div className="absolute inset-0 border-2 border-dashed border-white/40 rounded-full pointer-events-none" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={capturePhoto}
                className="px-5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold font-mono text-xs flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Chụp Ảnh Thử Đồ</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 font-mono text-xs flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Tải Ảnh Từ Máy</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default MannequinCanvas2D;
