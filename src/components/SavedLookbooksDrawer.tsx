'use client';

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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white border-l border-stone-200 h-full flex flex-col shadow-2xl overflow-hidden"
        style={{
          borderTopLeftRadius: '24px',
          borderBottomLeftRadius: '24px',
        }}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center">
              <BookmarkCheck className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-imperial font-bold text-lg text-stone-900">
                Kho Lưu Trữ Lookbook
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                {lookbooks.length} bản phối di sản đã lưu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              title="Tải lại danh sách"
              className="p-2 rounded-full hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3.5 border-b border-stone-200 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên bản phối hoặc triều đại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-full pl-9 pr-4 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Lookbook Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F5]">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-stone-400 space-y-2">
              <BookmarkCheck className="w-10 h-10 mx-auto text-stone-300" />
              <p className="text-sm font-medium text-stone-600">Chưa có bản phối nào trong kho lưu trữ.</p>
              <p className="text-xs text-stone-400">
                Hãy nhấn "Lưu Vào Bộ Sưu Tập" khi tạo bản phối mới!
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
                  className="p-4 rounded-xl bg-white border border-stone-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-amber-800 transition-colors font-imperial">
                        {item.outfitName}
                      </h4>
                      <div className="text-[11px] text-stone-500 mt-0.5 font-mono">
                        {item.periodReference}
                      </div>
                    </div>

                    {isViolation ? (
                      <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-300">
                        Cần Lưu Ý
                      </span>
                    ) : (
                      <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1 font-mono">
                        <ShieldCheck className="w-3 h-3 text-amber-700" />
                        {item.heritageScore}/100
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {item.layers?.heritageOuter || item.stylingGuide}
                  </p>

                  {/* Palette Preview */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
                    <div className="flex items-center gap-1">
                      {item.colorPalette?.map((swatch, sIdx) => (
                        <div
                          key={sIdx}
                          title={`${swatch.name} (${swatch.hex})`}
                          className="w-3.5 h-3.5 rounded-full border border-stone-200 shadow-xs"
                          style={{ backgroundColor: swatch.hex }}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-stone-400 text-[10px] font-mono">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                      <ExternalLink className="w-3 h-3 ml-1 group-hover:text-amber-700 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3.5 border-t border-stone-200 bg-stone-50 text-center text-xs text-stone-500 font-mono">
          Dữ liệu bản phối được lưu trữ liên phiên làm việc trên hệ thống
        </div>
      </div>
    </div>
  );
};

export default SavedLookbooksDrawer;
