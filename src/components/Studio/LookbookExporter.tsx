import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Crown,
  QrCode,
  Calendar,
  Layers,
  Flame,
  Award
} from 'lucide-react';
import {
  OutfitState,
  HeritageValidationResult,
  DigitalPassport
} from '../../types/vibephuc';

interface LookbookExporterProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: OutfitState;
  validation: HeritageValidationResult;
}

export const LookbookExporter: React.FC<LookbookExporterProps> = ({
  isOpen,
  onClose,
  outfit,
  validation,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const serialNumber = `VP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;
  const conceptTitle = `${outfit.coreGarment.name} • ${outfit.coreGarment.region === 'TRUNG_BO' ? 'Kinh Đô Huế' : outfit.coreGarment.region === 'BAC_BO' ? 'Kinh Bắc' : 'Phương Nam'} Fusion`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopySummary = () => {
    const summary = `
[VibePhục Studio — Digital Heritage Passport]
Số Serial: ${serialNumber}
Concept: ${conceptTitle}
Áo chính: ${outfit.coreGarment.name} (${outfit.coreGarment.era})
Quy thức: ${outfit.lapelMode === 'HUU_NHAM' ? 'Hữu Nhậm (Chuẩn mực)' : 'Tả Nhậm'}
Điểm di sản (HIS): ${validation.score}/100
Hòa sắc Ngũ Hành: ${validation.fengshui.score}% (${validation.fengshui.dominantElement})
Lớp phối: Lót [${outfit.baseGarment?.name || 'Không'}], Khoác [${outfit.outerGarment?.name || 'Không'}], Quần [${outfit.bottomPiece?.name || 'Không'}]
Bảo chứng: VibePhục Studio Heritage Cultural Guardrails
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadCard = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      handleCopySummary();
      alert('Đã tạo bản tóm tắt Hộ Chiếu Di Sản vào bộ nhớ tạm (Clipboard). Bạn có thể chia sẻ lên Instagram/TikTok Story!');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-obsidian-900 border border-heritage-hoang/50 rounded-m3-xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden"
      >
        {/* Hologram Shimmer Ribbon */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-heritage-hoang via-cyber-lime to-cyber-jade animate-pulse" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-m3-md bg-heritage-hoang/20 text-heritage-hoang border border-heritage-hoang/40 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-imperial text-white">
                Hộ Chiếu Di Sản Số (Digital Heritage Passport)
              </h3>
              <span className="text-[11px] font-mono text-neutral-400">
                Chứng chỉ bảo chứng quy thức văn hóa Cổ Phục Việt Nam
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* HOLOGRAM CARD PREVIEW */}
        <div className="relative rounded-m3-xl bg-gradient-to-br from-obsidian-800 via-[#181A22] to-obsidian-900 border border-heritage-hoang/40 p-6 shadow-2xl space-y-5 overflow-hidden">
          
          {/* Card Top Strip */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-heritage-hoang" />
              <span className="font-imperial font-bold text-sm tracking-wider text-white">
                VIBEPHỤC STUDIO • OFFICIAL PASSPORT
              </span>
            </div>
            <span className="text-xs font-mono text-amber-300 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30">
              SERIAL: {serialNumber}
            </span>
          </div>

          {/* Outfit Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Visual Silhouette Box (5 cols) */}
            <div className="sm:col-span-5 h-64 rounded-m3-lg bg-obsidian-900 border border-white/10 flex flex-col items-center justify-center p-3 relative overflow-hidden shadow-inner">
              <div
                className="w-36 h-48 rounded-lg border-2 flex flex-col justify-between p-2 shadow-xl"
                style={{
                  backgroundColor: outfit.coreGarment.defaultColor.hex,
                  borderColor: outfit.lapelMode === 'TA_NHAM' ? '#DC2626' : '#D69E2E',
                }}
              >
                <span className="text-[9px] font-mono text-white text-center bg-black/60 py-0.5 rounded">
                  {outfit.coreGarment.name}
                </span>

                <div className="text-center my-auto">
                  <div className="w-6 h-6 mx-auto rounded-full bg-amber-300/30 border border-amber-300 flex items-center justify-center text-[10px] font-bold text-amber-200">
                    {outfit.lapelMode === 'HUU_NHAM' ? '✓' : '✕'}
                  </div>
                </div>

                <span className="text-[8px] font-mono text-neutral-300 text-center">
                  {outfit.coreGarment.era}
                </span>
              </div>
            </div>

            {/* Passport Data Specifications (7 cols) */}
            <div className="sm:col-span-7 space-y-3 text-xs font-sans">
              <div>
                <span className="text-[10px] font-mono uppercase text-heritage-hoang block">
                  CONCEPT PASSPORT
                </span>
                <h4 className="text-base font-bold font-imperial text-white">
                  {conceptTitle}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
                <div className="p-2 rounded bg-black/50 border border-white/10">
                  <span className="text-neutral-400 block text-[9px]">QUY THỨC VẠT ÁO:</span>
                  <strong className={outfit.lapelMode === 'HUU_NHAM' ? 'text-emerald-400' : 'text-rose-400'}>
                    {outfit.lapelMode === 'HUU_NHAM' ? 'Hữu Nhậm (Đúng chuẩn)' : 'Tả Nhậm (Vi phạm)'}
                  </strong>
                </div>

                <div className="p-2 rounded bg-black/50 border border-white/10">
                  <span className="text-neutral-400 block text-[9px]">ĐIỂM DI SẢN (HIS):</span>
                  <strong className={validation.score >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
                    {validation.score} / 100 Điểm
                  </strong>
                </div>

                <div className="p-2 rounded bg-black/50 border border-white/10">
                  <span className="text-neutral-400 block text-[9px]">NGŨ HÀNH CHỦ ĐẠO:</span>
                  <strong className="text-amber-300">
                    {validation.fengshui.dominantElement} ({validation.fengshui.score}% Hòa sắc)
                  </strong>
                </div>

                <div className="p-2 rounded bg-black/50 border border-white/10">
                  <span className="text-neutral-400 block text-[9px]">LỚP KHOÁC NGOÀI:</span>
                  <strong className="text-cyber-lime">
                    {outfit.outerGarment?.name || 'Không khoác'}
                  </strong>
                </div>
              </div>

              <p className="text-[11px] text-neutral-300 leading-relaxed italic bg-black/40 p-2.5 rounded border border-white/5">
                "{outfit.coreGarment.historicalNote}"
              </p>
            </div>

          </div>

          {/* Card Footer Bar */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-mono text-neutral-400">
            <span>Bảo chứng bởi: VibePhục Cultural Guardrails</span>
            <span>Phát hành: Năm 2026 • AI Studio Showcase</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-m3-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Đã Sao Chép Link' : 'Sao Chép Link'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-m3-full bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Award className="w-4 h-4" />}
              <span>{copiedSummary ? 'Đã Sao Chép Thẻ' : 'Sao Chép Văn Bản'}</span>
            </button>
          </div>

          <button
            onClick={handleDownloadCard}
            disabled={isExporting}
            className="px-6 py-2.5 rounded-m3-full bg-heritage-hoang hover:bg-amber-400 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-heritage-glow cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang Xuất Thẻ...' : 'Tải Thẻ Story (TikTok/Instagram)'}</span>
          </button>
        </div>

      </motion.div>
    </div>
  );
};
