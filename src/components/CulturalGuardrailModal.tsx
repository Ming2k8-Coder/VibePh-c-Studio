import React from 'react';
import { AlertOctagon, X, BookOpen, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface CulturalGuardrailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CulturalGuardrailModal: React.FC<CulturalGuardrailModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#1A1617] border-2 border-rose-600/80 rounded-m3-lg p-6 md:p-8 space-y-6 shadow-2xl relative"
        style={{
          borderRadius: '32px 16px 32px 16px',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-rose-950/60 text-[#C4C6D0] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-400 shrink-0">
            <AlertOctagon className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Hệ Thống Kiểm Định Văn Hóa Server-Side</span>
            </div>
            <h3 className="text-xl font-bold font-imperial text-white">
              Quy Thức Bất Biến: "Hữu Nhậm" vs "Tả Nhậm"
            </h3>
          </div>
        </div>

        {/* Core Content */}
        <div className="space-y-4 text-xs text-[#E3E2E6] leading-relaxed">
          <div className="p-4 rounded-xl bg-[#28181B] border border-rose-900/60 space-y-2">
            <h4 className="font-bold text-sm text-[#FFDF78] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              Điển Chế Cổ Phục Việt Nam (Quy thức ngàn năm)
            </h4>
            <p>
              Trong văn hóa phục sức truyền thống của người Việt (Đại Việt qua các triều Lý, Trần, Lê và Triều Nguyễn), trang phục luôn tuân thủ nguyên tắc <strong>"Hữu Nhậm" (右衽)</strong>: vạt áo bên trái luôn đè lên vạt áo bên phải, hàng nút cài về phía bên nách phải.
            </p>
          </div>

          <div className="space-y-2">
            <h5 className="font-semibold text-rose-300">Tại sao "Tả Nhậm" (Cài sang trái) bị cấm ngặt?</h5>
            <ul className="space-y-1.5 list-disc list-inside text-[#C4C6D0]">
              <li>
                <strong className="text-white">Nghi thức Tang lễ:</strong> Cài vạt sang trái chỉ dùng cho người đã khuất (y phục nhập liệm), tượng trưng cho sự quy tiên về thế giới bên kia.
              </li>
              <li>
                <strong className="text-white">Dấu hiệu dị tộc:</strong> Cổ thư phương Đông và sử Việt từng quy định người văn minh mặc áo khép vạt sang phải để phân biệt với phong tục các tộc man di bên ngoài.
              </li>
              <li>
                <strong className="text-white">Ngũ Thường triều Nguyễn:</strong> 5 hạt nút áo ngũ thân cài sang phải tượng trưng cho 5 đức tính của người quân tử: <em>Nhân, Lễ, Nghĩa, Trí, Tín</em>.
              </li>
            </ul>
          </div>

          <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-[11px]">
              VibePhục Studio tự động sửa đổi hoặc cảnh báo bất kỳ phong cách nào có nguy cơ xuyên tạc quy thức nhằm bảo vệ di sản văn hóa Việt Nam.
            </p>
          </div>
        </div>

        {/* Close action */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-rose-900/40"
          >
            Đã Hiểu Quy Thức
          </button>
        </div>
      </div>
    </div>
  );
};
