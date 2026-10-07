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
Độ hài hòa di sản: ${remix.heritageScore}/100
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
      className={`rounded-2xl p-6 md:p-8 space-y-8 transition-all border shadow-sm ${
        isViolation
          ? 'bg-rose-50/70 border-rose-300'
          : 'bg-white border-stone-200'
      }`}
    >
      {/* Header: Title & Etiquette Certification Badge */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-stone-100 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            {isViolation ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-300">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                Cần Lưu Ý Quy Thức
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 font-mono">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                Hài Hòa Di Sản: {remix.heritageScore}/100
              </span>
            )}

            <span className="text-xs text-stone-500 font-mono">
              {remix.periodReference}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-imperial font-bold text-stone-900 mt-1">
            {remix.outfitName}
          </h2>

          {remix.culturalNotes && (
            <p className="text-xs text-amber-900 font-medium italic mt-2 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
              {remix.culturalNotes}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start flex-wrap">
          <button
            type="button"
            onClick={handleCopyLookbook}
            className="px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Đã Sao Chép' : 'Chia Sẻ Bản Phối'}</span>
          </button>

          <button
            type="button"
            disabled={isSaving || isSaved}
            onClick={() => onSaveToCollection(remix)}
            className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isSaved
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isSaved ? (
              <Check className="w-3.5 h-3.5 text-emerald-700" />
            ) : (
              <BookmarkPlus className="w-3.5 h-3.5 text-white" />
            )}
            <span>{isSaved ? 'Đã Lưu Vào Bộ Sưu Tập' : 'Lưu Vào Bộ Sưu Tập'}</span>
          </button>
        </div>
      </div>

      {/* 1. Three-Layer Visual Breakdown Card */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 font-mono">
          <Layers className="w-4 h-4 text-amber-700" />
          <span>Bóc Tách Cấu Trúc 3 Lớp Phục Sức</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Layer 1: Inner Base */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider font-semibold">
                Lớp 01 / Cốt Lõi
              </span>
              <span className="w-2 h-2 rounded-full bg-stone-400" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 font-imperial">Lớp Lót Trong Cùng (Inner Base)</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {remix.layers.innerBase}
            </p>
          </div>

          {/* Layer 2: Heritage Outer */}
          <div className="bg-amber-50/70 p-5 rounded-2xl border-2 border-amber-300 space-y-2 relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-amber-900 font-bold uppercase tracking-wider">
                Lớp 02 / Cổ Phục Di Sản
              </span>
              <span className="w-2 h-2 rounded-full bg-amber-600" />
            </div>
            <h4 className="font-bold text-sm text-amber-950 font-imperial">Cổ Phục Trọng Tâm (Heritage Outer)</h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              {remix.layers.heritageOuter}
            </p>
          </div>

          {/* Layer 3: Modern Streetwear Accent */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider font-semibold">
                Lớp 03 / Đương Đại
              </span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <h4 className="font-bold text-sm text-stone-900 font-imperial">Điểm Nhấn Hiện Đại (Modern Accent)</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              {remix.layers.modernAccent}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Four-Swatch Five Elements (Ngũ Hành) Palette with One-Click Copy */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900 font-mono">
            <Palette className="w-4 h-4 text-amber-700" />
            <span>Phối Sắc Ngũ Hành (Five Elements Palette)</span>
          </div>
          <span className="text-[11px] text-stone-500">Nhấp mã HEX để sao chép</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {remix.colorPalette.map((swatch, idx) => {
            const isCopied = copiedHex === swatch.hex;
            return (
              <div
                key={`${swatch.hex}-${idx}`}
                onClick={() => handleCopyHex(swatch.hex)}
                className="group p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between gap-3 relative"
              >
                {/* Visual Swatch Pill */}
                <div
                  className="w-full h-14 rounded-xl shadow-xs border border-stone-200 flex items-center justify-center transition-transform group-hover:scale-[1.02]"
                  style={{ backgroundColor: swatch.hex }}
                >
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                    {swatch.element}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="font-medium text-xs text-stone-900 group-hover:text-amber-800 transition-colors truncate">
                    {swatch.name}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span>{swatch.hex}</span>
                    {isCopied ? (
                      <span className="text-emerald-700 flex items-center gap-0.5 text-[10px] font-bold">
                        <Check className="w-3 h-3" /> Đã chép
                      </span>
                    ) : (
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-stone-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Styling Guide & Curator Verdict */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Styling Guide */}
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 font-mono">
            <Compass className="w-4 h-4 text-amber-700" />
            <span>Cẩm Nang Giữ Nếp & Phối Khí (Styling Guide)</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            {remix.stylingGuide}
          </p>
        </div>

        {/* Curator Verdict */}
        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 font-mono">
            <Scroll className="w-4 h-4 text-amber-700" />
            <span>Lời Bình Giám Tuyển (Curator Verdict)</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed italic">
            "{remix.curatorVerdict}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default RemixBreakdown;
