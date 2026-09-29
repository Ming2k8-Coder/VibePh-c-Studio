import React from 'react';
import { OCCASIONS, MODERN_LAYERS } from '../data/garments';
import { Sparkles, SlidersHorizontal, AlertTriangle, CheckCircle, Wand2, Zap } from 'lucide-react';

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
  // Preset prompt quick-fills
  const handleQuickPreset = (type: 'standard' | 'violation' | 'cyber' | 'case492' | 'complex') => {
    if (type === 'standard') {
      onChangeUserNotes('Phối áo ngũ thân tay thụ đỏ huyết dụ cùng măng tô hiện đại, cài nút sang phải (Hữu Nhậm) chuẩn điển lệ triều đình.');
    } else if (type === 'violation') {
      onChangeUserNotes('Thử nghiệm phá cách: Cài cúc sang trái (Tả Nhậm) và vạt phải đè vạt trái theo cảm hứng táng lễ cổ đại.');
    } else if (type === 'case492') {
      onChangeUserNotes('Kiểm thử mô phỏng lỗi Case 492 (simulate-492): Kiểm tra khả năng tự động bắt lỗi gateway rate-limit, backoff retry và chuyển hướng fallback an toàn.');
    } else if (type === 'complex') {
      onChangeUserNotes('Nghiên cứu phục dựng Haute Couture hoàng triều: Áo Nhật Bình cung đình phối cùng áo choàng deconstructed, phân tích ngũ hành tương sinh tương khắc, bảo đảm luật cấm sumptuary và sống lưng Chính Trung tuyệt đối.');
    } else {
      onChangeUserNotes('Bản phối Neo-Saigon tương lai: Tôn vinh gấm Lãnh Mỹ A phương Nam cùng phụ kiện công nghệ cao tối giản.');
    }
  };

  return (
    <section className="bg-[#1A1B1F] border border-[#2B2C31] p-6 rounded-m3-lg space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2B2C31] pb-4">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal className="w-5 h-5 text-[#D4AF37]" />
          <h2 className="text-lg font-bold font-imperial text-white">
            Bộ Lọc Không Gian & Lớp Phối Đương Đại
          </h2>
        </div>
        <span className="text-xs text-[#8E9099]">
          Cấu hình phong cách AI
        </span>
      </div>

      {/* 1. Occasion Selection */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#FFDF78] flex items-center gap-1.5">
          <span>1. Dịp Xuất Hiện (Occasion)</span>
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
                    ? 'bg-[#D4AF37] text-[#121316] font-bold border-[#D4AF37] shadow-md shadow-[#D4AF37]/20 scale-[1.02]'
                    : 'bg-[#202125] text-[#C4C6D0] border-[#2B2C31] hover:border-[#D4AF37]/40 hover:text-white'
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
        <label className="text-xs font-semibold uppercase tracking-wider text-[#FFDF78] flex items-center gap-1.5">
          <span>2. Lớp Thời Trang Đương Đại (Modern Layer)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {MODERN_LAYERS.map((layer) => {
            const isSelected = layer.id === selectedModernLayer;
            return (
              <div
                key={layer.id}
                onClick={() => onSelectModernLayer(layer.id)}
                className={`p-3 rounded-m3-md border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#2B2820] border-[#D4AF37] text-white shadow-sm'
                    : 'bg-[#202125] border-[#2B2C31] text-[#C4C6D0] hover:border-[#D4AF37]/30'
                }`}
              >
                <div className="text-xs font-semibold text-white">{layer.label}</div>
                <div className="text-[11px] text-[#8E9099] mt-0.5 line-clamp-1">{layer.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. User Custom Notes & Quick Preset Buttons */}
      <div className="space-y-2.5 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#FFDF78]">
            3. Ý Tưởng & Lưu Ý Tùy Biến (Styling Notes)
          </label>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-[#8E9099]">Mẫu thử nghiệm:</span>
            <button
              type="button"
              onClick={() => handleQuickPreset('standard')}
              className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition-colors flex items-center gap-1"
            >
              <CheckCircle className="w-3 h-3" /> Chuẩn Hữu Nhậm
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('complex')}
              className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800 hover:bg-purple-900 transition-colors flex items-center gap-1"
              title="Kích hoạt kiểm thử Routing Phức Tạp (Pro Tier)"
            >
              <Sparkles className="w-3 h-3 text-purple-400" /> Routing Phức Tạp
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('case492')}
              className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 hover:bg-amber-900 transition-colors flex items-center gap-1"
              title="Kích hoạt kiểm thử phục hồi lỗi Case 492"
            >
              <Zap className="w-3 h-3 text-amber-400" /> Thử Case 492
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={userNotes}
          onChange={(e) => onChangeUserNotes(e.target.value)}
          placeholder="Nhập ghi chú phối đồ (ví dụ: Phối áo ngũ thân màu chàm cổ với boots chiến thuật, giữ khuy cài sang phải Hữu Nhậm)..."
          className="w-full bg-[#121316] border border-[#2B2C31] rounded-m3-md p-3 text-sm text-white placeholder:text-[#5E6068] focus:outline-hidden focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none"
        />
      </div>

      {/* Remix Action Button */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isLoading}
          onClick={onRemix}
          className={`w-full py-4 px-6 rounded-m3-lg font-imperial font-bold text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-xl cursor-pointer ${
            isLoading
              ? 'bg-[#2B2C31] text-[#8E9099] cursor-not-allowed'
              : 'bg-gradient-to-r from-[#D4AF37] via-[#E8B923] to-[#D4AF37] text-[#121316] hover:brightness-110 shadow-[#D4AF37]/25 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-[#121316] border-t-transparent rounded-full animate-spin" />
              <span>Đang Giám Tuyển & Kiểm Tra Quy Thức Hữu Nhậm...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 text-[#121316]" />
              <span>Remix Di Sản (AI Heritage Synthesis)</span>
              <Sparkles className="w-4 h-4 text-[#121316]" />
            </>
          )}
        </button>
      </div>
    </section>
  );
};
