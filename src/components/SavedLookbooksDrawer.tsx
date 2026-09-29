import React, { useState } from 'react';
import { LookbookRecord, RemixResponse } from '../types/lookbook';
import {
  X,
  BookmarkCheck,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Search,
  Calendar,
} from 'lucide-react';

interface SavedLookbooksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lookbooks: LookbookRecord[];
  onSelectLookbook: (item: RemixResponse) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const SavedLookbooksDrawer: React.FC<SavedLookbooksDrawerProps> = ({
  isOpen,
  onClose,
  lookbooks,
  onSelectLookbook,
  onRefresh,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = lookbooks.filter(
    (lb) =>
      lb.outfitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lb.periodReference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#16171B] border-l border-[#2B2C31] h-full flex flex-col shadow-2xl overflow-hidden"
        style={{
          borderTopLeftRadius: '28px',
          borderBottomLeftRadius: '28px',
        }}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#2B2C31] flex items-center justify-between bg-[#1A1B1F]">
          <div className="flex items-center gap-2.5">
            <BookmarkCheck className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="font-imperial font-bold text-lg text-white">
                Bộ Sưu Tập Lookbook Đã Lưu
              </h3>
              <p className="text-xs text-[#8E9099]">
                Đồng bộ Firestore Collection: {lookbooks.length} bản phối
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              title="Tải lại danh sách từ cơ sở dữ liệu"
              className="p-2 rounded-full hover:bg-[#2B2C31] text-[#C4C6D0] hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#2B2C31] text-[#C4C6D0] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-[#2B2C31] bg-[#121316]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8E9099] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc triều đại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1A1B1F] border border-[#2B2C31] rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder:text-[#5E6068] focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>
        </div>

        {/* Lookbook Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#8E9099] space-y-2">
              <BookmarkCheck className="w-10 h-10 mx-auto text-[#2B2C31]" />
              <p className="text-sm">Chưa tìm thấy bản phối phù hợp.</p>
              <p className="text-xs text-[#5E6068]">
                Hãy bấm "Lưu Vào Bộ Sưu Tập" sau khi tạo bản phối mới!
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const isViolation = item.culturalGuardrailStatus === 'FLAGGED_VIOLATION';
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectLookbook(item);
                    onClose();
                  }}
                  className="p-4 rounded-m3-md bg-[#1A1B1F] border border-[#2B2C31] hover:border-[#D4AF37]/60 hover:bg-[#202125] transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-[#FFDF78] transition-colors">
                        {item.outfitName}
                      </h4>
                      <div className="text-[11px] text-[#8E9099] mt-0.5">
                        {item.periodReference}
                      </div>
                    </div>

                    {isViolation ? (
                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                        Cảnh Báo
                      </span>
                    ) : (
                      <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-[#2B2412] text-[#FFDF78] border border-[#D4AF37]/50 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                        {item.heritageScore}/100
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#C4C6D0] line-clamp-2">
                    {item.layers?.heritageOuter || item.stylingGuide}
                  </p>

                  {/* Palette Preview */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#2B2C31]/60 text-[11px]">
                    <div className="flex items-center gap-1">
                      {item.colorPalette?.map((swatch, sIdx) => (
                        <div
                          key={sIdx}
                          title={`${swatch.name} (${swatch.hex})`}
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: swatch.hex }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-[#8E9099] text-[10px]">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                      <ExternalLink className="w-3 h-3 ml-1 group-hover:text-[#D4AF37] transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#2B2C31] bg-[#1A1B1F] text-center text-xs text-[#8E9099]">
          Dữ liệu bảo chứng lưu trữ an toàn trên máy chủ đám mây.
        </div>
      </div>
    </div>
  );
};
