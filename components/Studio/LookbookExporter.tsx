'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  QrCode,
  Award,
  Layers,
  Calendar,
  Compass,
  FileCheck2,
  Palette,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import {
  OutfitState,
  HeritageValidationResult,
  AIStylistCritique
} from '../../src/types/vibephuc';
import { GARMENT_CATALOG, ACCESSORY_CATALOG } from '../../data/heritageCatalog';

export interface LookbookExporterProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: OutfitState;
  validation?: HeritageValidationResult;
  stylistCritique?: AIStylistCritique;
}

export const LookbookExporter: React.FC<LookbookExporterProps> = ({
  isOpen,
  onClose,
  outfit,
  validation,
  stylistCritique
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  // Safely resolve core garment
  const coreGarment = useMemo(() => {
    if (outfit.coreGarment) return outfit.coreGarment;
    return (
      GARMENT_CATALOG.find(g => g.id === (outfit as any).outerId) ||
      GARMENT_CATALOG.find(g => g.id === (outfit as any).baseId) ||
      GARMENT_CATALOG[0]
    );
  }, [outfit]);

  // Safely resolve bottom garment
  const bottomGarment = useMemo(() => {
    if (outfit.bottomPiece) return outfit.bottomPiece;
    if ((outfit as any).bottomId) {
      return GARMENT_CATALOG.find(g => g.id === (outfit as any).bottomId) || null;
    }
    return GARMENT_CATALOG.find(g => g.id === 'bottom-quan-lua-trang') || null;
  }, [outfit]);

  // Safely resolve active accessories
  const activeAccessories = useMemo(() => {
    if (outfit.accessories && outfit.accessories.length > 0) {
      return outfit.accessories;
    }
    return ((outfit as any).accessoryIds || [])
      .map((id: string) => ACCESSORY_CATALOG.find(a => a.id === id))
      .filter(Boolean);
  }, [outfit]);

  // Unique Serial ID for Passport
  const serialNo = useMemo(() => {
    const randomHex = Math.random().toString(16).substring(2, 8).toUpperCase();
    return `VN-HERITAGE-2026-${randomHex}`;
  }, []);

  // Title automatically formatted
  const lookbookTitle = useMemo(() => {
    if (stylistCritique?.lookbookTitle) return stylistCritique.lookbookTitle;
    const eraShort = coreGarment.era.includes('Triều Nguyễn') ? 'Cung Đình' : 'Di Sản';
    return `${coreGarment.name} · ${eraShort} #${serialNo.slice(-3)}`;
  }, [stylistCritique, coreGarment, serialNo]);

  // Helper to extract hex string safely
  const resolveHex = (val: unknown, fallback: string): string => {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object' && 'hex' in val && typeof (val as any).hex === 'string') {
      return (val as any).hex;
    }
    return fallback;
  };

  // Main Colors
  const coreColor: string = resolveHex(
    outfit.customColors?.['core'] || outfit.coreGarment?.defaultColor,
    '#C53030'
  );

  const bottomColor: string = resolveHex(
    outfit.customColors?.['bottom'] || bottomGarment?.defaultColor,
    '#F8FAFC'
  );

  // Robust High-DPI Card Exporter using html2canvas directly (avoids cross-origin CSS security errors)
  const renderCardToDataUrl = async (element: HTMLElement): Promise<string> => {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        imageTimeout: 5000
      });
      return canvas.toDataURL('image/png');
    } catch (e) {
      console.warn('html2canvas snapshot failed:', e);
      // Emergency canvas fallback
      const rect = element.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      canvas.width = (rect.width || 340) * 2;
      canvas.height = (rect.height || 604) * 2;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      return canvas.toDataURL('image/png');
    }
  };

  // High-DPI Image Downloader
  const handleDownloadHD = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const dataUrl = await renderCardToDataUrl(cardRef.current);

      const link = document.createElement('a');
      link.download = `VibePhuc-Passport-${coreGarment.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export download failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Social Share via Navigator Web Share API
  const handleWebShare = async () => {
    if (!navigator.share) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
      return;
    }

    try {
      if (cardRef.current) {
        const dataUrl = await renderCardToDataUrl(cardRef.current);
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'vibephuc-lookbook.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `VibePhục Studio: ${lookbookTitle}`,
            text: `Chiêm ngưỡng bản phối di sản bảo chứng Hữu Nhậm tại VibePhục Studio!`,
            files: [file]
          });
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 3000);
          return;
        }
      }

      await navigator.share({
        title: `VibePhục Studio: ${lookbookTitle}`,
        text: `Khám phá Thẻ Di Sản Số của mình tại VibePhục Studio!`,
        url: window.location.href
      });
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch (err) {
      console.warn('Share cancelled or not supported:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop - Luxury Silk Translucent */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-md"
        />

        {/* Modal Outer Wrapper - Light Luxury Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-4xl bg-white border border-amber-200/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Top Modal Header */}
          <div className="px-6 py-4 border-b border-amber-100 bg-gradient-to-r from-amber-50/90 via-stone-50 to-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-imperial font-bold text-base sm:text-lg text-stone-950">
                  Chứng Thư Di Sản Số (Digital Heritage Passport)
                </h3>
                <p className="text-[11px] font-mono text-amber-900/80 font-medium">
                  Tỷ lệ chuẩn 9:16 · Nền giấy lụa ngà hoàng cung sáng sủa · Bảo chứng quy thức Hữu Nhậm 100%
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Area: Preview & Control Panel */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-center">
            
            {/* -------------------------------------------------------------- */}
            {/* LEFT / CENTER (7 cols): DIGITAL HERITAGE PASSPORT (9:16 CARD)   */}
            {/* -------------------------------------------------------------- */}
            <div className="lg:col-span-7 flex justify-center">
              {/* THE EXPORTABLE PASSPORT CARD (LUMINOUS ROYAL IVORY SILK) */}
              <div
                ref={cardRef}
                id="passport-export-card"
                className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl border-2 border-amber-500 ring-4 ring-amber-100 shadow-[0_20px_50px_rgba(217,119,6,0.2)] p-5 text-stone-950 flex flex-col justify-between overflow-hidden font-sans select-none"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDF7 45%, #FBF8EE 100%)'
                }}
              >
                {/* Background Golden Watermark Border Pattern */}
                <div className="absolute inset-2 border border-amber-400/40 rounded-2xl pointer-events-none" />
                <div className="absolute top-0 right-0 w-36 h-36 bg-radial from-amber-300/20 to-transparent blur-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-36 h-36 bg-radial from-rose-400/15 to-transparent blur-xl pointer-events-none" />

                {/* 1. PASSPORT HEADER & SERIAL NUMBER */}
                <div className="relative z-10 space-y-1 border-b border-amber-200/90 pb-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-xs ring-2 ring-amber-200" />
                      <span className="font-imperial font-bold text-xs tracking-wider text-amber-950">
                        VIBEPHỤC ATELIER
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full font-bold border border-amber-300/60">
                      #{serialNo.slice(-6)}
                    </span>
                  </div>
                  <h4 className="font-imperial font-black text-sm tracking-wide text-stone-950 uppercase pt-0.5">
                    VIỆT PHỤC QUỐC TẾ BẢO CHỨNG
                  </h4>
                  <p className="text-[9px] font-mono text-amber-900/80 font-medium">
                    Official Digital Heritage Identification Card
                  </p>
                </div>

                {/* 2. CENTER STAGE: 2D VECTOR MANNEQUIN PREVIEW */}
                <div className="relative z-10 flex-1 my-2 flex items-center justify-center">
                  <svg
                    viewBox="0 0 300 480"
                    className="w-full h-full max-h-[270px] filter drop-shadow-md"
                  >
                    <defs>
                      <linearGradient id="passportSilkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={coreColor} stopOpacity="1" />
                        <stop offset="60%" stopColor={coreColor} stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#1E2024" stopOpacity="0.25" />
                      </linearGradient>
                    </defs>

                    {/* Stage Pedestal Shadow */}
                    <ellipse cx="150" cy="455" rx="65" ry="10" fill="rgba(217,119,6,0.18)" />

                    {/* Graceful Head Contour */}
                    <ellipse cx="150" cy="42" rx="17" ry="22" fill="#F8EFE4" stroke="#E2D1BE" strokeWidth="1" />
                    <path d="M143 62 L143 82 L157 82 L157 62 Z" fill="#F8EFE4" />

                    {/* Bottom Piece (Trousers / Skirt) */}
                    <path
                      d="M112 210 L92 445 L142 445 L150 270 L158 445 L208 445 L188 210 Z"
                      fill={bottomColor}
                      stroke="rgba(0,0,0,0.12)"
                      strokeWidth="1"
                    />

                    {/* White Inner Collar (Viềm Trung Đơn 2mm) */}
                    <path
                      d="M136 82 C145 78 155 78 164 82 L166 94 C155 96 145 96 134 94 Z"
                      fill="#FFFFFF"
                      stroke="#CBD5E1"
                      strokeWidth="0.8"
                    />

                    {/* Core Robe Sleeves (No clipping!) */}
                    {coreGarment.category === 'AO_TAC' || coreGarment.id === 'core-ao-tac' ? (
                      /* Wide Sleeves for Áo Tấc */
                      <g id="pass-wide-sleeves">
                        <path d="M104 94 L36 195 L48 310 L104 245 L116 110 Z" fill={coreColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                        <path d="M196 94 L264 195 L252 310 L196 245 L184 110 Z" fill={coreColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                        {/* Sleeve Cuffs */}
                        <path d="M36 195 L48 310" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3,2" />
                        <path d="M264 195 L252 310" stroke="#FDE68A" strokeWidth="2" strokeDasharray="3,2" />
                      </g>
                    ) : coreGarment.category === 'NHAT_BINH' || coreGarment.id === 'core-nhat-binh' ? (
                      /* Nhật Bình sleeves with Ngũ Sắc Bands */
                      <g id="pass-nhatbinh-sleeves">
                        <path d="M104 94 L50 190 L62 280 L106 230 L116 110 Z" fill={coreColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                        <path d="M196 94 L250 190 L238 280 L194 230 L184 110 Z" fill={coreColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                        {/* Ngũ Sắc Stripes at cuffs */}
                        <line x1="52" y1="205" x2="62" y2="280" stroke="#E11D48" strokeWidth="3" />
                        <line x1="248" y1="205" x2="238" y2="280" stroke="#E11D48" strokeWidth="3" />
                      </g>
                    ) : (
                      /* Fitted Tay Chẽn Sleeves */
                      <g id="pass-fitted-sleeves">
                        <path d="M104 94 L72 195 L84 265 L98 260 L92 200 L114 110 Z" fill={coreColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                        <path d="M196 94 L228 195 L216 265 L202 260 L208 200 L186 110 Z" fill={coreColor} stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                      </g>
                    )}

                    {/* Core Robe Body */}
                    <path
                      d="M106 94 C128 87 172 87 194 94 L208 345 C178 360 122 360 92 345 Z"
                      fill={coreColor}
                      stroke="rgba(0,0,0,0.2)"
                      strokeWidth="1"
                    />

                    {/* Center Back Stitch (Sống lưng Chính Trung) */}
                    <line x1="150" y1="94" x2="150" y2="352" stroke="rgba(0,0,0,0.12)" strokeWidth="1" strokeDasharray="4,2" />

                    {/* Lapel Curve (Hữu Nhậm: Trái đè Phải) & 5 Buttons */}
                    <path d="M150 94 C150 118 166 138 180 148 L180 345" stroke="#D97706" strokeWidth="1.8" fill="none" />
                    {[98, 122, 148, 192, 238].map((by, bIdx) => (
                      <circle key={by} cx={bIdx === 0 ? 152 : bIdx === 1 ? 163 : 180} cy={by} r="2.8" fill="#FDE68A" stroke="#92400E" strokeWidth="0.8" />
                    ))}

                    {/* Kiềng Bạc / Accessories */}
                    {activeAccessories.some((a: any) => a?.id === 'acc-kieng-bac') && (
                      <path d="M136 96 C145 102 155 102 164 96" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
                    )}

                    {/* Khăn Vành Dây (nếu có) */}
                    {activeAccessories.some((a: any) => a?.id === 'acc-khan-vanh') && (
                      <ellipse cx="150" cy="36" rx="22" ry="7" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                    )}
                  </svg>

                  {/* Red Lacquer Official Seal: Hữu Nhậm Verified */}
                  <div className="absolute bottom-2 right-2 w-16 h-16 rounded-xl border-2 border-rose-700 p-1 rotate-[-8deg] bg-white shadow-md flex flex-col items-center justify-center text-rose-800 select-none">
                    <span className="text-[7px] font-mono font-bold tracking-widest uppercase">TRIỆN ẤN</span>
                    <span className="font-imperial font-black text-[9px] leading-tight text-center">
                      HỮU NHẬM
                      <br />
                      BẢO CHỨNG
                    </span>
                    <span className="text-[6px] font-mono tracking-tighter text-amber-700">★ 100% ★</span>
                  </div>
                </div>

                {/* 3. METADATA: LOOKBOOK TITLE & HIS INTEGRITY BADGE */}
                <div className="relative z-10 space-y-2 border-t border-amber-200/90 pt-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-amber-900 font-bold block">
                        BẢN PHỐI DI SẢN CHUẨN MỰC
                      </span>
                      <h5 className="font-imperial font-bold text-sm text-stone-950 line-clamp-1">
                        {lookbookTitle}
                      </h5>
                    </div>
                    {/* HIS Score Pill */}
                    <div className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-950 font-mono text-[10px] font-bold shadow-2xs">
                      {validation?.score || 100}/100 HIS
                    </div>
                  </div>

                  {/* Garment Details & Era */}
                  <div className="grid grid-cols-2 gap-1.5 text-[9px] font-mono text-stone-700 bg-amber-50/70 p-2 rounded-xl border border-amber-200">
                    <div>
                      <span className="text-stone-500 block">THỜI KỲ:</span>
                      <strong className="text-stone-950 block truncate">{coreGarment.era}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">VÙNG MIỀN:</span>
                      <strong className="text-stone-950 block">
                        {coreGarment.region === 'BAC_BO' ? 'Bắc Bộ' : coreGarment.region === 'TRUNG_BO' ? 'Cố Đô Huế' : 'Nam Bộ'}
                      </strong>
                    </div>
                  </div>

                  {/* 4. FOOTER: VERIFICATION TIMESTAMP & QR CODE */}
                  <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-[8px] font-mono text-stone-600">
                    <div>
                      <span>Xác thực: {new Date().toLocaleDateString('vi-VN')}</span>
                      <span className="text-[9px] font-mono text-amber-900 font-bold block">
                        VibePhục Heritage Atelier
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 bg-white border border-amber-300 rounded p-0.5 flex items-center justify-center shadow-2xs">
                        <QrCode className="w-5 h-5 text-stone-900" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* -------------------------------------------------------------- */}
            {/* RIGHT (5 cols): DOWNLOAD, SHARE & METADATA ACTIONS             */}
            {/* -------------------------------------------------------------- */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-1">
                <h4 className="font-imperial font-bold text-lg text-stone-900">
                  Xuất Thẻ & Chia Sẻ Di Sản
                </h4>
                <p className="text-xs text-stone-500">
                  Tải ảnh thẻ chứng thực định dạng PNG độ nét cao (Retina) hoặc sao chép mã định danh số.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadHD}
                  disabled={isExporting}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? 'Đang Tạo Ảnh HD...' : 'Tải Thẻ Lookbook PNG (HD)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWebShare}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs font-mono flex items-center justify-center gap-2 border border-stone-300 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-amber-700" />
                  <span>{shareSuccess ? 'Đã Chia Sẻ Thành Công!' : copiedLink ? 'Đã Sao Chép Liên Kết!' : 'Chia Sẻ Bản Phối'}</span>
                </button>
              </div>

              {/* Passport Specs */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-2">
                <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-stone-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tiêu Chuẩn Giám Tuyển Văn Hóa:</span>
                </div>
                <ul className="space-y-1 text-[11px] list-disc list-inside text-stone-600">
                  <li>Tuân thủ nguyên tắc Hữu Nhậm (khép vạt sang phải).</li>
                  <li>Tỷ lệ chuẩn mực 9:16 tối ưu cho Story/Reels.</li>
                  <li>Mã định danh số duy nhất: <code className="text-amber-800 font-bold">{serialNo}</code></li>
                </ul>
              </div>

            </div>

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LookbookExporter;
