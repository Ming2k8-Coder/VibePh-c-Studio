import React from 'react';
import { GarmentInfo } from '../types/lookbook';
import { GARMENTS } from '../data/garments';
import { Sparkles, Scroll, Compass, ShieldAlert, Award } from 'lucide-react';

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
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
            <Compass className="w-4 h-4" />
            <span>Kho Tàng Y Phục Cổ Truyền Việt Nam</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-imperial text-white mt-1">
            Chọn Dáng Cổ Phục Di Sản
          </h2>
        </div>
        <span className="hidden sm:inline-block text-xs text-[#8E9099] bg-[#1A1B1F] px-3 py-1.5 rounded-full border border-[#2B2C31]">
          Chuẩn Mực Điển Lễ Triều Đình
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
              className={`group relative text-left p-5 transition-all duration-300 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-[#25201A] to-[#1A1B1F] border-2 border-[#D4AF37] shadow-xl shadow-[#D4AF37]/10'
                  : 'bg-[#1A1B1F] border border-[#2B2C31] hover:border-[#D4AF37]/50 hover:bg-[#202125]'
              }`}
              style={{
                borderRadius: '28px 16px 28px 16px', // M3 Expressive Asymmetrical Corners
              }}
            >
              {/* Top Accent Ribbon */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isSelected
                      ? 'bg-[#D4AF37] text-[#121316] font-bold'
                      : 'bg-[#2B2C31] text-[#C4C6D0]'
                  }`}
                >
                  {garment.tag}
                </span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[11px] text-[#FFDF78] font-medium">
                    <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Đã Chọn
                  </span>
                )}
              </div>

              {/* Title & Period */}
              <h3 className="font-bold text-lg text-white group-hover:text-[#FFDF78] transition-colors leading-snug">
                {garment.name}
              </h3>
              <p className="text-xs text-[#D4AF37] mt-0.5 font-medium">
                {garment.period}
              </p>

              {/* Short Silhouette & Etiquette */}
              <div className="mt-3 text-xs text-[#C4C6D0] line-clamp-3 leading-relaxed">
                {garment.description}
              </div>

              {/* Golden Etiquette Note */}
              <div className="mt-4 pt-3 border-t border-[#2B2C31] text-[11px] flex items-start gap-1.5 text-[#FFDF78]/90">
                <Scroll className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="line-clamp-2 italic">{garment.etiquetteRule}</span>
              </div>

              {/* Subtle Color Swatch Preview */}
              <div className="mt-3 flex items-center justify-between pt-2">
                <span className="text-[10px] text-[#8E9099] uppercase tracking-wider">
                  Ngũ Hành:
                </span>
                <div className="flex items-center gap-1.5">
                  {garment.suggestedPalettes.map((swatch) => (
                    <div
                      key={swatch.name}
                      title={`${swatch.name} (${swatch.element})`}
                      className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                      style={{ backgroundColor: swatch.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* State Layer Glow */}
              {isSelected && (
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
