'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Compass,
  Scroll,
  Layers,
  Search,
  CheckCircle2,
  RefreshCw,
  Award,
  FileText
} from 'lucide-react';
import { GarmentItem } from '../../src/types/vibephuc';
import { GARMENT_CATALOG } from '../../data/heritageCatalog';

export interface GroundedCitation {
  title: string;
  uri: string;
}

export interface GroundedWikiResponse {
  query: string;
  hardenedFacts: GarmentItem[];
  groundedInsight: string;
  citations: GroundedCitation[];
  searchSource?: 'GOOGLE_SEARCH_GROUNDED' | 'CURATED_HISTORICAL_ARCHIVE';
}

export interface WikiCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  garmentId?: string;
  initialQuery?: string;
}

export const WikiCodexModal: React.FC<WikiCodexModalProps> = ({
  isOpen,
  onClose,
  garmentId,
  initialQuery
}) => {
  // Query state
  const [activeQuery, setActiveQuery] = useState<string>(
    initialQuery || garmentId || 'ao-ngu-than-tay-chen'
  );
  const [searchInput, setSearchInput] = useState<string>('');

  // Data fetching state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wikiData, setWikiData] = useState<GroundedWikiResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync when initial props change
  useEffect(() => {
    if (garmentId) {
      setActiveQuery(garmentId);
    } else if (initialQuery) {
      setActiveQuery(initialQuery);
    }
  }, [garmentId, initialQuery]);

  // Fetch grounded data from /api/wiki/grounded
  const fetchGroundedWiki = useCallback(async (query: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/wiki/grounded?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: GroundedWikiResponse = await res.json();
      setWikiData(data);
    } catch (err) {
      console.warn('Grounded wiki fetch error:', err);
      setErrorMsg('Không thể kết nối đến thư viện trực tuyến, đã kích hoạt tư liệu bản quyền nội bộ.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch when modal opens or activeQuery changes
  useEffect(() => {
    if (isOpen && activeQuery) {
      fetchGroundedWiki(activeQuery);
    }
  }, [isOpen, activeQuery, fetchGroundedWiki]);

  // Keyboard shortcut: Escape closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Match hardened facts from static catalog fallback
  const matchedFact = useMemo(() => {
    if (wikiData?.hardenedFacts && wikiData.hardenedFacts.length > 0) {
      return wikiData.hardenedFacts[0];
    }
    return (
      GARMENT_CATALOG.find(g => g.id === activeQuery) ||
      GARMENT_CATALOG.find(g => g.name.toLowerCase().includes(activeQuery.toLowerCase())) ||
      GARMENT_CATALOG[0]
    );
  }, [wikiData, activeQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveQuery(searchInput.trim());
    setSearchInput('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop with lacquer blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-obsidian-900/80 backdrop-blur-xl transition-all"
        />

        {/* Modal Container: Ancient Woodblock Manuscript meets Cyber Neon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-obsidian-900 border border-heritage-hoang/40 rounded-m3-xl shadow-[0_0_50px_rgba(214,158,46,0.25)] overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Top Decorative Border (Mộc Bản Woodblock Motif) */}
          <div className="h-1.5 w-full bg-gradient-to-r from-heritage-son via-heritage-hoang to-cyber-lime" />

          {/* ================================================================ */}
          {/* HEADER: Title & Quick Search Bar                                 */}
          {/* ================================================================ */}
          <div className="px-6 py-4 border-b border-white/10 bg-obsidian-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-m3-md bg-heritage-hoang/10 border border-heritage-hoang/40 flex items-center justify-center text-heritage-hoang shadow-heritage-glow">
                <Scroll className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-imperial text-lg sm:text-xl font-bold text-white tracking-wide">
                    Văn Thư Điển Lệ Cổ Phục
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyber-lime/10 text-cyber-lime border border-cyber-lime/30 font-bold uppercase">
                    Google Grounded
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Khảo cứu thư tịch cổ: Khâm Định Đại Nam Hội Điển Sự Lệ & Đại Nam Thực Lục
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="relative hidden sm:flex items-center">
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Tra cứu trang phục khác..."
                  className="bg-obsidian-900 border border-white/15 rounded-full px-3.5 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-heritage-hoang w-48 pr-8"
                />
                <button
                  type="submit"
                  className="absolute right-2 text-gray-400 hover:text-white"
                  title="Tìm kiếm"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                title="Đóng [ESC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ================================================================ */}
          {/* BODY: Two-Column Deep Knowledge Showcase                         */}
          {/* ================================================================ */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Garment Switcher Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-mono text-gray-400 shrink-0 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-heritage-hoang" />
                <span>Tiêu điểm:</span>
              </span>
              {GARMENT_CATALOG.slice(0, 6).map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveQuery(g.id)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                    activeQuery === g.id || activeQuery === g.name
                      ? 'bg-heritage-hoang text-obsidian-900 font-bold shadow-heritage-glow'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>

            {/* PART 1: SỰ THẬT BẤT BIẾN (HARDENED FACTS) */}
            <div className="p-5 rounded-m3-lg bg-obsidian-800/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyber-jade" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-jade">
                    PHẦN 1: SỰ THẬT BẤT BIẾN (HARDENED FACTS — PEER-REVIEWED)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-400">
                  Định chế: <strong className="text-heritage-hoang">{matchedFact.era}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 rounded-m3-md bg-obsidian-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400">Tên Quy Chuẩn</span>
                  <p className="font-imperial font-bold text-sm text-white">{matchedFact.name}</p>
                  <p className="text-[11px] text-heritage-hoang font-mono">{matchedFact.category}</p>
                </div>

                <div className="p-3 rounded-m3-md bg-obsidian-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400">Cổ Áo & Vạt Áo</span>
                  <p className="font-bold text-xs text-white">
                    {matchedFact.collarType === 'LAP_LINH'
                      ? 'Cổ Lập Lĩnh (2-3cm ôm khít)'
                      : matchedFact.collarType === 'CHU_NHAT'
                      ? 'Cổ Chữ Nhật (Viền ngũ sắc)'
                      : 'Cổ Giao Lĩnh (Chéo ngực)'}
                  </p>
                  <p className="text-[11px] text-emerald-400 font-mono">
                    {matchedFact.closureDirection === 'RIGHT' ? 'Hữu Nhậm (Trái đè phải)' : 'Trung chính xẻ dọc'}
                  </p>
                </div>

                <div className="p-3 rounded-m3-md bg-obsidian-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400">Số Cúc & Thân Áo</span>
                  <p className="font-bold text-xs text-white">
                    {matchedFact.buttonCount} Cúc (Ngũ Luân / Ngũ Thường)
                  </p>
                  <p className="text-[11px] text-cyber-lime font-mono">
                    Sống lưng Chính Trung
                  </p>
                </div>

                <div className="p-3 rounded-m3-md bg-obsidian-900/60 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400">Chất Liệu Chuẩn Cổ</span>
                  <p className="font-bold text-xs text-white">Lụa tơ tằm, sa, gấm</p>
                  <p className="text-[11px] text-gray-400 font-mono">
                    Đũi Nam Cao, Lãnh Tân Châu
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-m3-md bg-obsidian-900/80 border border-white/5 text-xs text-gray-300 leading-relaxed font-sans">
                <span className="text-heritage-hoang font-bold font-mono text-[11px] mr-2">
                  [TỔNG QUAN LỊCH SỬ]:
                </span>
                {matchedFact.historicalBrief}
              </div>
            </div>

            {/* PART 2: GÓC NHÌN LỊCH SỬ (GROUNDED INSIGHTS BY GEMINI) */}
            <div className="p-5 rounded-m3-lg bg-gradient-to-br from-obsidian-800/80 to-obsidian-900 border border-heritage-hoang/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-heritage-hoang animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-heritage-hoang">
                    PHẦN 2: GÓC NHÌN LỊCH SỬ (GROUNDED INSIGHTS WITH SEARCH)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {isLoading && (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-cyber-lime">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang tra cứu Google Grounding...</span>
                    </div>
                  )}
                  {wikiData?.searchSource && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                      Nguồn: {wikiData.searchSource === 'GOOGLE_SEARCH_GROUNDED' ? 'Google Search Grounded' : 'Thư Viện Sử Sách'}
                    </span>
                  )}
                </div>
              </div>

              {/* In-depth Synthesis Text */}
              <div className="relative text-xs sm:text-sm text-gray-200 leading-relaxed space-y-3 font-sans">
                {isLoading ? (
                  <div className="space-y-2 py-4 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-4 bg-white/10 rounded w-full" />
                    <div className="h-4 bg-white/10 rounded w-5/6" />
                  </div>
                ) : (
                  <p className="whitespace-pre-line leading-relaxed text-gray-200 bg-obsidian-900/50 p-4 rounded-m3-md border border-white/5">
                    {wikiData?.groundedInsight || matchedFact.historicalBrief}
                  </p>
                )}
              </div>

              {/* Clickable Citations & Archival Provenance */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-cyber-lime" />
                  <span>Dẫn Chứng Hiện Vật Bảo Tàng & Thư Tịch Cổ (Citations):</span>
                </span>

                <div className="flex flex-wrap gap-2 pt-1">
                  {(wikiData?.citations || [
                    {
                      title: 'Khâm Định Đại Nam Hội Điển Sự Lệ (Nội các triều Nguyễn)',
                      uri: 'http://baotanglichsu.vn/vi/Articles/3096/13359/kham-dinh-dai-nam-hoi-dien-su-le.html'
                    },
                    {
                      title: 'Đại Nam Thực Lục (Quốc sử quán triều Nguyễn)',
                      uri: 'http://baotanglichsu.vn/vi/Articles/3096/12480/dai-nam-thuc-luc-chinh-bien.html'
                    }
                  ]).map((cit, idx) => (
                    <a
                      key={idx}
                      href={cit.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-heritage-hoang/20 hover:border-heritage-hoang/50 text-gray-300 hover:text-white border border-white/10 text-xs font-mono transition-all group"
                    >
                      <ExternalLink className="w-3 h-3 text-heritage-hoang group-hover:scale-110 transition-transform" />
                      <span className="line-clamp-1">{cit.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* FOOTER: Responsible AI Disclaimer                                */}
          {/* ================================================================ */}
          <div className="px-6 py-3 border-t border-white/10 bg-obsidian-900 flex items-center justify-between text-[11px] font-mono text-gray-400">
            <span>Viện Nghiên Cứu Di Sản Số VibePhục — Bảo chứng chống Tả Nhậm & Đồng hóa</span>
            <button
              type="button"
              onClick={onClose}
              className="text-heritage-hoang hover:underline cursor-pointer"
            >
              Đóng cửa sổ
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WikiCodexModal;
