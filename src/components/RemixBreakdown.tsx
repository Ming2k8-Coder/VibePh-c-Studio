import React, { useState } from 'react';
import { RemixResponse } from '../types/lookbook';
import {
  ShieldCheck,
  AlertOctagon,
  Copy,
  Check,
  BookmarkPlus,
  Share2,
  Sparkles,
  Layers,
  Palette,
  Compass,
  Scroll,
} from 'lucide-react';

interface RemixBreakdownProps {
  remix: RemixResponse;
  onSaveToCollection: (remix: RemixResponse) => Promise<boolean>;
  isSaving: boolean;
  isSaved?: boolean;
}

export const RemixBreakdown: React.FC<RemixBreakdownProps> = ({
  remix,
  onSaveToCollection,
  isSaving,
  isSaved,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const isViolation = remix.culturalGuardrailStatus === 'FLAGGED_VIOLATION';

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyLookbook = () => {
    const summary = `
[VibePhục Studio Lookbook]
Bộ trang phục: ${remix.outfitName}
Thời kỳ & Phong cách: ${remix.periodReference}
Trạng thái kiểm định: ${remix.culturalGuardrailStatus} (${remix.heritageScore}/100)
Lớp 1 (Inner): ${remix.layers.innerBase}
Lớp 2 (Heritage Outer): ${remix.layers.heritageOuter}
Lớp 3 (Modern Accent): ${remix.layers.modernAccent}
Bảng màu Ngũ Hành: ${remix.colorPalette.map((c) => `${c.name} (${c.hex} - ${c.element})`).join(', ')}
Lời giám tuyển: ${remix.curatorVerdict}
    `.trim();

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div
      className={`rounded-m3-lg p-6 md:p-8 space-y-8 transition-all border ${
        isViolation
          ? 'bg-[#1F1416] border-rose-600/60 shadow-2xl shadow-rose-950/30'
          : 'bg-[#1A1B1F] border-[#D4AF37]/40 shadow-2xl shadow-black/40'
      }`}
      style={{
        borderRadius: '32px 16px 32px 16px',
      }}
    >
      {/* Header: Title & Etiquette Certification Badge */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#2B2C31] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {isViolation ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-700">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                Vi Phạm Quy Thức: Tả Nhậm
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#282110] text-[#FFDF78] border border-[#D4AF37]">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                Quy Thức Hữu Nhậm Bảo Chứng: {remix.heritageScore}/100
              </span>
            )}

            <span className="text-xs text-[#8E9099] font-mono">
              {remix.periodReference}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-imperial font-bold text-white mt-1">
            {remix.outfitName}
          </h2>

          {/* Model Routing & Case 492 Resilience Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
            {remix.routedModel && (
              <span className="px-2.5 py-0.5 rounded-m3-full bg-cyber-lime/10 text-cyber-lime border border-cyber-lime/30 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3 h-3 text-cyber-lime" />
                Model: {remix.routedModel}
              </span>
            )}

            {remix.complexityTier && (
              <span className={`px-2 py-0.5 rounded-m3-full border ${
                remix.complexityTier === 'COMPLEX'
                  ? 'bg-purple-950/70 text-purple-300 border-purple-500/50'
                  : remix.complexityTier === 'STANDARD'
                  ? 'bg-blue-950/70 text-blue-300 border-blue-500/50'
                  : 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50'
              }`}>
                Độ phức tạp: {remix.complexityTier}
              </span>
            )}

            {remix.handledCase492 && (
              <span className="px-2.5 py-0.5 rounded-m3-full bg-amber-950/80 text-amber-300 border border-amber-500/60 font-semibold flex items-center gap-1 animate-pulse">
                <span>🛡️ Đã xử lý Case 492 (Tự động phục hồi & chuyển hướng)</span>
              </span>
            )}
          </div>

          {remix.routingReason && (
            <p className="text-[11px] text-neutral-400 font-mono mt-1">
              🧭 <strong className="text-neutral-300">Routing:</strong> {remix.routingReason}
            </p>
          )}

          {remix.culturalNotes && (
            <p className="text-xs text-rose-300 font-medium italic mt-1 bg-rose-950/40 p-2.5 rounded-md border border-rose-900/50">
              {remix.culturalNotes}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start flex-wrap">
          <button
            type="button"
            onClick={handleCopyLookbook}
            className="px-3.5 py-2 rounded-full bg-[#202125] hover:bg-[#2B2C31] text-[#C4C6D0] hover:text-white border border-[#2B2C31] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Đã Sao Chép' : 'Chia Sẻ Thẻ'}</span>
          </button>

          <button
            type="button"
            disabled={isSaving || isSaved}
            onClick={() => onSaveToCollection(remix)}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              isSaved
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                : 'bg-[#D4AF37] text-[#121316] hover:bg-[#E8B923] border border-[#D4AF37]'
            }`}
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-[#121316] border-t-transparent rounded-full animate-spin" />
            ) : isSaved ? (
              <Check className="w-3.5 h-3.5 text-emerald-300" />
            ) : (
              <BookmarkPlus className="w-3.5 h-3.5 text-[#121316]" />
            )}
            <span>{isSaved ? 'Đã Lưu Vào Bộ Sưu Tập' : 'Lưu Vào Bộ Sưu Tập'}</span>
          </button>
        </div>
      </div>

      {/* 1. Three-Layer Visual Breakdown Card */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
          <Layers className="w-4 h-4" />
          <span>Bóc Tách Cấu Trúc 3 Lớp (3-Layer Architecture)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Layer 1: Inner Base */}
          <div className="bg-[#121316] p-5 rounded-m3-md border border-[#2B2C31] space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#D4AF37] uppercase tracking-wider">
                Lớp 01 / Cốt Lõi
              </span>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            </div>
            <h4 className="font-bold text-sm text-white">Lớp Lót Trong Cùng (Inner Base)</h4>
            <p className="text-xs text-[#C4C6D0] leading-relaxed">
              {remix.layers.innerBase}
            </p>
          </div>

          {/* Layer 2: Heritage Outer */}
          <div className="bg-[#241E15] p-5 rounded-m3-md border-2 border-[#D4AF37]/70 space-y-2 relative overflow-hidden shadow-lg shadow-[#D4AF37]/5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#FFDF78] font-bold uppercase tracking-wider">
                Lớp 02 / Di Sản Hữu Nhậm
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h4 className="font-bold text-sm text-[#FFDF78]">Cổ Phục Trọng Tâm (Heritage Outer)</h4>
            <p className="text-xs text-[#E3E2E6] leading-relaxed">
              {remix.layers.heritageOuter}
            </p>
          </div>

          {/* Layer 3: Modern Streetwear Accent */}
          <div className="bg-[#121316] p-5 rounded-m3-md border border-[#2B2C31] space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#8E9099] uppercase tracking-wider">
                Lớp 03 / Đương Đại
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <h4 className="font-bold text-sm text-white">Điểm Nhấn Hiện Đại (Modern Accent)</h4>
            <p className="text-xs text-[#C4C6D0] leading-relaxed">
              {remix.layers.modernAccent}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Four-Swatch Five Elements (Ngũ Hành) Palette with One-Click Copy */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
            <Palette className="w-4 h-4" />
            <span>Phối Sắc Ngũ Hành (Five Elements Palette)</span>
          </div>
          <span className="text-[11px] text-[#8E9099]">Click mã HEX để sao chép</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {remix.colorPalette.map((swatch, idx) => {
            const isCopied = copiedHex === swatch.hex;
            return (
              <div
                key={`${swatch.hex}-${idx}`}
                onClick={() => handleCopyHex(swatch.hex)}
                className="group p-3.5 rounded-m3-md bg-[#121316] border border-[#2B2C31] hover:border-[#D4AF37]/60 transition-all cursor-pointer flex flex-col justify-between gap-3 relative"
              >
                {/* Visual Swatch Pill */}
                <div
                  className="w-full h-14 rounded-lg shadow-inner border border-white/10 flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: swatch.hex }}
                >
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                    {swatch.element}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-medium text-xs text-white group-hover:text-[#FFDF78] transition-colors truncate">
                    {swatch.name}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#8E9099]">
                    <span>{swatch.hex}</span>
                    {isCopied ? (
                      <span className="text-emerald-400 flex items-center gap-0.5 text-[10px]">
                        <Check className="w-3 h-3" /> Đã Copy
                      </span>
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Styling Guide & Curator Verdict */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Styling Guide */}
        <div className="bg-[#121316] p-5 rounded-m3-md border border-[#2B2C31] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
            <Compass className="w-4 h-4" />
            <span>Cẩm Nang Giữ Nếp & Phối Khí (Styling Guide)</span>
          </div>
          <p className="text-xs text-[#C4C6D0] leading-relaxed">
            {remix.stylingGuide}
          </p>
        </div>

        {/* Curator Verdict */}
        <div className="bg-[#121316] p-5 rounded-m3-md border border-[#2B2C31] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FFDF78]">
            <Scroll className="w-4 h-4 text-[#D4AF37]" />
            <span>Lời Bình Giám Tuyển (Curator Verdict)</span>
          </div>
          <p className="text-xs text-[#C4C6D0] leading-relaxed italic">
            "{remix.curatorVerdict}"
          </p>
        </div>
      </div>
    </div>
  );
};
