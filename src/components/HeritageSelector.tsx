import React from 'react';
import { GarmentInfo } from '../types/lookbook';
import { GARMENTS } from '../data/garments';
import { Compass, Scroll, Award } from 'lucide-react';

interface HeritageSelectorProps {
  selectedGarmentId: string;
  onSelectGarment: (garment: GarmentInfo) => void;
}

export const HeritageSelector: React.FC<HeritageSelectorProps> = ({
  selectedGarmentId,
  onSelectGarment,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700">
            <Compass className="w-4 h-4" />
            <span>Kho Tàng Y Phục Cổ Truyền Việt Nam</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-imperial text-stone-900 mt-1">
            Chọn Dáng Cổ Phục Di Sản
          </h2>
        </div>
        <span className="hidden sm:inline-block text-xs text-stone-500 bg-white px-3 py-1.5 rounded-full border border-stone-200 shadow-xs font-mono">
          Chuẩn Mực Điển Chế Lịch Sử
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {GARMENTS.map((garment) => {
          const isSelected = garment.id === selectedGarmentId;
          return (
            <div
              key={garment.id}
              onClick={() => onSelectGarment(garment)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectGarment(garment)}
              className={`group relative text-left p-5 transition-all duration-300 cursor-pointer overflow-hidden rounded-2xl ${
                isSelected
                  ? 'bg-amber-50/70 border-2 border-amber-600 shadow-md ring-2 ring-amber-600/10'
                  : 'bg-white border border-stone-200 hover:border-amber-400 hover:shadow-sm'
              }`}
            >
              {/* Top Accent Ribbon */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono ${
                    isSelected
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {garment.tag}
                </span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[11px] text-amber-800 font-bold">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Đã Chọn
                  </span>
                )}
              </div>

              {/* Title & Period */}
              <h3 className="font-bold text-lg text-stone-900 group-hover:text-amber-800 transition-colors leading-snug font-imperial">
                {garment.name}
              </h3>
              <p className="text-xs text-amber-700 mt-0.5 font-medium font-mono">
                {garment.period}
              </p>

              {/* Short Silhouette & Description */}
              <div className="mt-3 text-xs text-stone-600 line-clamp-3 leading-relaxed">
                {garment.description}
              </div>

              {/* Golden Etiquette Note */}
              <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] flex items-start gap-1.5 text-amber-900/90 bg-amber-50/50 p-2 rounded-lg">
                <Scroll className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span className="line-clamp-2 italic">{garment.etiquetteRule}</span>
              </div>

              {/* Color Swatch Preview */}
              <div className="mt-3 flex items-center justify-between pt-2">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">
                  Bảng Màu:
                </span>
                <div className="flex items-center gap-1.5">
                  {garment.suggestedPalettes.map((swatch) => (
                    <div
                      key={swatch.name}
                      title={`${swatch.name} (${swatch.element})`}
                      className="w-4 h-4 rounded-full border border-stone-300 shadow-xs"
                      style={{ backgroundColor: swatch.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HeritageSelector;
