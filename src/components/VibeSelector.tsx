import React from 'react';
import { OCCASIONS, MODERN_LAYERS } from '../data/garments';
import { Sparkles, SlidersHorizontal, CheckCircle, Wand2, HeartHandshake } from 'lucide-react';

interface VibeSelectorProps {
  selectedOccasion: string;
  onSelectOccasion: (id: string) => void;
  selectedModernLayer: string;
  onSelectModernLayer: (id: string) => void;
  userNotes: string;
  onChangeUserNotes: (text: string) => void;
  onRemix: () => void;
  isLoading: boolean;
}

export const VibeSelector: React.FC<VibeSelectorProps> = ({
  selectedOccasion,
  onSelectOccasion,
  selectedModernLayer,
  onSelectModernLayer,
  userNotes,
  onChangeUserNotes,
  onRemix,
  isLoading,
}) => {
  // Production Preset prompt quick-fills
  const handleQuickPreset = (type: 'dam-cuoi' | 'ky-yeu' | 'prom' | 'streetwear') => {
    if (type === 'dam-cuoi') {
      onChangeUserNotes('Phối đại lễ phục Áo Tấc đỏ chu sa hoặc vàng hoàng kim dự đám cưới cổ truyền, điểm xuyết kiềng bạc hoa sen và quần lụa trắng đoan trang.');
    } else if (type === 'ky-yeu') {
      onChangeUserNotes('Phối áo ngũ thân tay chẽn hoặc áo dài raglan trắng thanh thuần cho buổi chụp kỷ yếu học đường tốt nghiệp, kết hợp nón lá thanh tao.');
    } else if (type === 'prom') {
      onChangeUserNotes('Dạ hội Prom Night: Áo Nhật Bình cách tân tinh tế phối cùng áo khoác mỏng voan organza lụa hiện đại, tôn vinh dải ngũ sắc cung đình.');
    } else {
      onChangeUserNotes('Streetwear dạo phố: Áo Bà Ba lụa đen Tân Châu phối cùng quần suông ống rộng hiện đại và khăn rằn caro phong thái phóng khoáng.');
    }
  };

  return (
    <section className="bg-white border border-stone-200 p-6 rounded-2xl shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-5 h-5 text-amber-700" />
          <h2 className="text-lg font-bold font-imperial text-stone-900">
            Bối Cảnh Xuất Hiện & Lớp Phối Đương Đại
          </h2>
        </div>
        <span className="text-xs text-stone-500 font-mono">
          Trợ lý AI giám tuyển phong cách
        </span>
      </div>

      {/* 1. Occasion Selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
          <span>1. Dịp Sự Kiện (Occasion)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((occ) => {
            const isSelected = occ.id === selectedOccasion;
            return (
              <button
                key={occ.id}
                type="button"
                onClick={() => onSelectOccasion(occ.id)}
                className={`px-4 py-2 text-xs rounded-full font-medium transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white font-bold border-amber-600 shadow-sm scale-[1.02]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-400 hover:text-stone-900'
                }`}
                title={occ.desc}
              >
                {occ.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Modern Layer Selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
          <span>2. Lớp Khoác Ngoài Hiện Đại (Modern Outer Layer)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {MODERN_LAYERS.map((layer) => {
            const isSelected = layer.id === selectedModernLayer;
            return (
              <div
                key={layer.id}
                onClick={() => onSelectModernLayer(layer.id)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-50/70 border-amber-500 text-stone-900 shadow-xs'
                    : 'bg-stone-50/60 border-stone-200 text-stone-600 hover:border-amber-300'
                }`}
              >
                <div className="text-xs font-bold text-stone-900">{layer.label}</div>
                <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{layer.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. User Custom Notes & Quick Preset Buttons */}
      <div className="space-y-2.5 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-amber-900">
            3. Ý Tưởng & Gợi Ý Phối Đồ Cá Nhân (Styling Notes)
          </label>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-stone-500">Mẫu gợi ý nhanh:</span>
            <button
              type="button"
              onClick={() => handleQuickPreset('ky-yeu')}
              className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              🎓 Kỷ Yếu Tốt Nghiệp
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('dam-cuoi')}
              className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              💍 Đám Cưới Truyền Thống
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('prom')}
              className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              ✨ Dạ Hội Prom
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('streetwear')}
              className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              ⚡ Dạo Phố
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={userNotes}
          onChange={(e) => onChangeUserNotes(e.target.value)}
          placeholder="Nhập ý tưởng phối đồ (ví dụ: Phối áo ngũ thân màu chàm cổ cùng măng tô dáng suông, giữ nét trang nghiêm chuẩn mực)..."
          className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all resize-none"
        />
      </div>

      {/* Remix Action Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={onRemix}
          className={`w-full py-4 px-6 rounded-xl font-imperial font-bold text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-md cursor-pointer ${
            isLoading
              ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang Giám Tuyển Bản Phối Di Sản Cùng Gemini AI...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>Sáng Tạo Bản Phối Cùng Gemini AI</span>
              <Sparkles className="w-4 h-4 text-amber-200" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default VibeSelector;
