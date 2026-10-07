'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Layers,
  Palette,
  ShoppingBag,
  Bot,
  Send,
  ArrowLeftRight,
  Check,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  Compass,
  Zap,
  Info,
  Sliders,
  BookmarkCheck,
  HelpCircle,
  Flame,
  Wind
} from 'lucide-react';
import {
  OutfitState,
  GarmentItem,
  AccessoryItem,
  HeritageValidationResult,
  HarmonyElement
} from '../../types/vibephuc';
import { GARMENT_CATALOG, ACCESSORY_CATALOG } from '../../data/heritageCatalog';
import { validateOutfit } from '../../lib/guardrails';

export type ConfiguratorTabId =
  | 'cot-cach'
  | 'ha-y-layer'
  | 'sac-mau-ngu-hanh'
  | 'phu-kien'
  | 'athenya-copilot';

export interface ConfiguratorTabsProps {
  outfit: OutfitState;
  onUpdateOutfit: (updater: (prev: OutfitState) => OutfitState) => void;
  onApplyPreset?: (preset: Partial<OutfitState>) => void;
  className?: string;
  catalog?: GarmentItem[];
  accessories?: AccessoryItem[];
}

interface ClassicPalettePreset {
  id: string;
  name: string;
  element: HarmonyElement;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  meaning: string;
}

const CLASSIC_PALETTES: ClassicPalettePreset[] = [
  {
    id: 'tim-hue-bach-lua',
    name: 'Tím Xứ Huế & Bạch Lụa',
    element: 'HOA',
    primaryHex: '#701A75',
    secondaryHex: '#F8FAFC',
    accentHex: '#D69E2E',
    meaning: 'Nét thâm trầm đoan trang sông Hương núi Ngự hòa cùng lụa tơ tằm thanh khiết.'
  },
  {
    id: 'nau-non-hoa-ly',
    name: 'Nâu Non & Xanh Hoa Lý',
    element: 'MOC',
    primaryHex: '#795548',
    secondaryHex: '#16A34A',
    accentHex: '#D69E2E',
    meaning: 'Hồn quê Bắc Bộ mộc mạc, tượng trưng cho mùa gặt ấm no và cỏ cây đâm chồi.'
  },
  {
    id: 'do-son-hoang-tho',
    name: 'Đỏ Son Chu Sa & Hoàng Thổ',
    element: 'HOA',
    primaryHex: '#C53030',
    secondaryHex: '#D69E2E',
    accentHex: '#F8FAFC',
    meaning: 'Sắc phục đại lễ cung đình, hân hoan rực rỡ, chiêu tài nghinh tân phúc khí.'
  },
  {
    id: 'den-lanh-chi-vang',
    name: 'Đen Lãnh Mỹ Á & Chỉ Vàng',
    element: 'THUY',
    primaryHex: '#0E0F12',
    secondaryHex: '#F8FAFC',
    accentHex: '#E5C158',
    meaning: 'Màu đen huyền thoại từ quả mặc nưa Tân Châu óng ả, quý phái sang trọng bậc nhất.'
  },
  {
    id: 'cyber-lime-cham',
    name: 'Cyber Lime & Chàm Sông Nước',
    element: 'THUY',
    primaryHex: '#1E3A8A',
    secondaryHex: '#CCFF00',
    accentHex: '#00F5D4',
    meaning: 'Bản phối Fusion Gen Z: Màu chàm thủy tộc nghìn năm hòa cùng sắc xanh điện tử phát quang.'
  }
];

// Contemporary Bottom Options
const CONTEMPORARY_BOTTOMS = [
  {
    id: 'bottom-quan-lua-trang',
    name: 'Quần Lụa Trắng Ống Rộng',
    category: 'Cổ Điển',
    tag: 'Chuẩn Điển Lễ',
    colorHex: '#F8FAFC',
    desc: 'Lụa tơ tằm suông rộng chạm mu bàn chân, bất khả phân ly của Áo Dài & Ngũ Thân.'
  },
  {
    id: 'bottom-quan-lanh-my-a',
    name: 'Quần Lụa Đen Lãnh Mỹ Á',
    category: 'Nam Bộ',
    tag: 'Đen Huyền Bí',
    colorHex: '#0E0F12',
    desc: 'Nhuộm mặc nưa Tân Châu óng mượt, mặc cùng Áo Bà Ba hoặc Áo Tấc.'
  },
  {
    id: 'bottom-vay-dup-den',
    name: 'Váy Đụp Đen Bắc Bộ',
    category: 'Kinh Bắc',
    tag: 'Dân Gian',
    colorHex: '#1E2026',
    desc: 'Váy lụa đen buông dài, nét duyên thầm tần tảo của các liền chị Quan họ.'
  },
  {
    id: 'bottom-cargo-khaki',
    name: 'Quần Parachute Cargo Khaki',
    category: 'Gen Z Fusion',
    tag: 'Streetwear',
    colorHex: '#78716C',
    desc: 'Ống suông túi hộp phong cách High-Street, phá cách khi phối cùng Áo Tấc.'
  },
  {
    id: 'bottom-denim-recycle',
    name: 'Quần Denim Tái Chế Indigo',
    category: 'Gen Z Fusion',
    tag: 'Eco Chic',
    colorHex: '#1E3A8A',
    desc: 'Vải denim tái chế viền selvedge, tạo sự đối lập thú vị với tà áo dài mượt mà.'
  }
];

export const ConfiguratorTabs: React.FC<ConfiguratorTabsProps> = ({
  outfit,
  onUpdateOutfit,
  onApplyPreset,
  className = '',
  catalog = GARMENT_CATALOG,
  accessories = ACCESSORY_CATALOG
}) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ConfiguratorTabId>('cot-cach');

  // A/B Comparison State
  const [snapshotA, setSnapshotA] = useState<OutfitState>(outfit);
  const [snapshotB, setSnapshotB] = useState<OutfitState>({
    ...outfit,
    outerId: 'ao-tac-tay-thu',
    bottomId: 'bottom-cargo-khaki',
    accessoryIds: ['acc-sneaker-chunky', 'acc-tui-tote-cham']
  });
  const [activePresetVersion, setActivePresetVersion] = useState<'A' | 'B'>('A');

  // Era filter for Tab 1
  const [selectedEraFilter, setSelectedEraFilter] = useState<string>('ALL');

  // Athenya Chat State
  const [chatPrompt, setChatPrompt] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'athenya'; text: string; stylingTip?: string }>>([
    {
      role: 'athenya',
      text: 'Meo meo~ Chào sen! Ta là Athenya, linh miêu bảo hộ cổ phục Việt. Ta sẽ đồng hành cùng sen khám phá từng tà áo, nếp cúc và quy thức Hữu Nhậm nhé!',
      stylingTip: 'Hãy thử phối áo Ngũ Thân với một đôi chunky sneaker cyber lime xem sao!'
    }
  ]);

  // Realtime Cultural Validation
  const validation: HeritageValidationResult = useMemo(() => {
    return validateOutfit(outfit, catalog);
  }, [outfit, catalog]);

  // Active Core Garment Lookup
  const coreGarment = useMemo(() => {
    return (
      catalog.find(g => g.id === outfit.outerId) ||
      catalog.find(g => g.id === outfit.baseId) ||
      catalog[0]
    );
  }, [catalog, outfit.baseId, outfit.outerId]);

  // Save current configuration to A or B
  const handleSaveSnapshot = (version: 'A' | 'B') => {
    if (version === 'A') {
      setSnapshotA(outfit);
      setActivePresetVersion('A');
    } else {
      setSnapshotB(outfit);
      setActivePresetVersion('B');
    }
  };

  // Switch between Snapshot A and B
  const handleSwitchSnapshot = (version: 'A' | 'B') => {
    setActivePresetVersion(version);
    const target = version === 'A' ? snapshotA : snapshotB;
    onUpdateOutfit(() => ({ ...target }));
  };

  // Handle Athenya Chat Submission
  const handleSendAthenyaPrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const promptText = chatPrompt.trim();
    if (!promptText || chatLoading) return;

    // Append user message immediately
    setChatHistory(prev => [...prev, { role: 'user', text: promptText }]);
    setChatPrompt('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/athenya', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outfit,
          context: {
            promptText,
            occasion: 'Trang phục Atelier cá nhân hóa'
          }
        })
      });

      if (!response.ok) throw new Error('Athenya API error');
      const data = await response.json();

      setChatHistory(prev => [
        ...prev,
        {
          role: 'athenya',
          text: `${data.catSpeech}\n\n${data.advice}`,
          stylingTip: data.stylingTip
        }
      ]);

      // If user asks to fix or select something, trigger preset
      if (promptText.toLowerCase().includes('áo tấc') || promptText.toLowerCase().includes('tay thụ')) {
        onUpdateOutfit(o => ({ ...o, outerId: 'ao-tac-tay-thu' }));
      } else if (promptText.toLowerCase().includes('bà ba')) {
        onUpdateOutfit(o => ({ ...o, outerId: 'ao-ba-ba' }));
      } else if (promptText.toLowerCase().includes('quần')) {
        onUpdateOutfit(o => ({ ...o, bottomId: 'bottom-quan-lua-trang' }));
      }
    } catch {
      setChatHistory(prev => [
        ...prev,
        {
          role: 'athenya',
          text: 'Meo! Ta thấy bản phối này rất hài hòa với cốt cách Hữu Nhậm. Nhớ giữ nếp quần lụa đoan chính nhé sen!',
          stylingTip: 'Thêm một chiếc kiềng bạc để tạo điểm nhấn vương giả.'
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Toggle Accessory Item
  const handleToggleAccessory = (accId: string) => {
    onUpdateOutfit(prev => {
      const current = prev.accessoryIds || [];
      const exists = current.includes(accId);
      const next = exists ? current.filter(id => id !== accId) : [...current, accId];
      return { ...prev, accessoryIds: next };
    });
  };

  // Filtered Garment List for Tab 1
  const filteredGarments = useMemo(() => {
    if (selectedEraFilter === 'ALL') return catalog.filter(g => g.slot === 'core' || !g.slot);
    return catalog.filter(g => g.era === selectedEraFilter);
  }, [catalog, selectedEraFilter]);

  return (
    <div
      className={`relative w-full rounded-m3-lg bg-obsidian-900/90 border border-white/10 backdrop-blur-organza shadow-2xl flex flex-col justify-between overflow-hidden ${className}`}
      style={{ minHeight: '680px' }}
    >
      {/* ==================================================================== */}
      {/* 1. HEADER: A/B Comparison Switcher & Athenya Dynamic Mascot Banner   */}
      {/* ==================================================================== */}
      <div className="px-5 py-3.5 border-b border-white/10 bg-obsidian-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        {/* Athenya Mascot Badge with Glowing Eyes */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full bg-obsidian-900 border border-cyber-jade/50 flex items-center justify-center shadow-cyber-glow">
            <span className="text-base select-none">🐾</span>
            {/* Glowing Cyber Jade Cat Eyes */}
            <span className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-cyber-jade shadow-[0_0_6px_#00F5D4] animate-pulse" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyber-jade shadow-[0_0_6px_#00F5D4] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-imperial font-bold text-white text-xs md:text-sm">
                Athenya Copilot
              </span>
              <span
                className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded-full font-bold ${
                  validation.status === 'PASSED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {validation.status === 'PASSED' ? 'Purring ~ Hài Lòng' : 'Hissing! Cảnh Báo'}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 hidden sm:block">
              Trợ lý di sản mang linh hồn loài mèo
            </p>
          </div>
        </div>

        {/* A/B Comparison Switcher */}
        <div className="flex items-center gap-1.5 bg-obsidian-900/80 p-1 rounded-m3-full border border-white/10">
          <button
            type="button"
            onClick={() => handleSwitchSnapshot('A')}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              activePresetVersion === 'A'
                ? 'bg-heritage-hoang text-obsidian-900 shadow-heritage-glow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PA-A (Gốc)
          </button>

          <button
            type="button"
            onClick={() => handleSwitchSnapshot('B')}
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
              activePresetVersion === 'B'
                ? 'bg-cyber-lime text-obsidian-900 shadow-cyber-glow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            PA-B (Cách Tân)
          </button>

          <span className="w-px h-3.5 bg-white/20 mx-0.5" />

          <button
            type="button"
            onClick={() => handleSaveSnapshot(activePresetVersion)}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title={`Lưu cấu hình hiện tại vào Phương Án ${activePresetVersion}`}
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-heritage-hoang" />
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. 5-TAB NAVIGATION BAR (FRAMER MOTION LAYOUT-ID)                   */}
      {/* ==================================================================== */}
      <div className="px-3 pt-2 border-b border-white/10 bg-obsidian-900/60 flex items-center gap-1 overflow-x-auto scrollbar-none">
        {[
          { id: 'cot-cach', name: '1. Cốt Cách', icon: Layers },
          { id: 'ha-y-layer', name: '2. Hạ Y & Lớp', icon: Sliders },
          { id: 'sac-mau-ngu-hanh', name: '3. Ngũ Hành', icon: Palette },
          { id: 'phu-kien', name: '4. Phụ Kiện', icon: ShoppingBag },
          { id: 'athenya-copilot', name: '5. Mèo Athenya', icon: Bot }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as ConfiguratorTabId)}
              className={`relative px-3.5 py-2.5 rounded-t-m3-md text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyber-lime' : 'text-gray-400'}`} />
              <span>{tab.name}</span>

              {/* Smooth Animated Tab Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeConfiguratorTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-heritage-hoang via-cyber-lime to-cyber-jade shadow-[0_0_8px_#CCFF00]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ==================================================================== */}
      {/* 3. TAB CONTENT WORKSPACE                                             */}
      {/* ==================================================================== */}
      <div className="flex-1 p-5 overflow-y-auto max-h-[500px] space-y-4">
        {/* ------------------------------------------------------------------ */}
        {/* TAB 1: CỐT CÁCH PHỤC SỨC (CHỌN ÁO NỀN TẢNG)                        */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'cot-cach' && (
          <div className="space-y-4">
            {/* Era Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'ALL', name: 'Tất Cả Triều Đại' },
                { id: 'TRIEU_NGUYEN', name: 'Triều Nguyễn (1802-1945)' },
                { id: 'TIEN_NGUYEN', name: 'Tiền Nguyễn (Lý-Trần-Lê)' },
                { id: 'LEMUR_1930', name: 'Tân Thời Le Mur 1930' },
                { id: 'RAGLAN_1960', name: 'Raglan Nữ Sinh 1960' }
              ].map(era => (
                <button
                  key={era.id}
                  type="button"
                  onClick={() => setSelectedEraFilter(era.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer shrink-0 ${
                    selectedEraFilter === era.id
                      ? 'bg-heritage-hoang/20 text-heritage-hoang border border-heritage-hoang/50 font-bold'
                      : 'bg-white/5 text-gray-400 hover:text-gray-200 border border-white/5'
                  }`}
                >
                  {era.name}
                </button>
              ))}
            </div>

            {/* Garment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredGarments.map(garment => {
                const isSelected = coreGarment.id === garment.id;
                return (
                  <div
                    key={garment.id}
                    onClick={() => onUpdateOutfit(o => ({ ...o, outerId: garment.id }))}
                    className={`relative p-3.5 rounded-m3-md border transition-all duration-200 cursor-pointer transform-gpu ${
                      isSelected
                        ? 'bg-heritage-hoang/15 border-heritage-hoang shadow-heritage-glow scale-[1.02]'
                        : 'bg-obsidian-800/50 border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-imperial font-bold text-sm text-white">
                        {garment.name}
                      </span>
                      {isSelected ? (
                        <div className="w-4 h-4 rounded-full bg-heritage-hoang text-obsidian-900 flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono text-gray-400 px-1.5 py-0.5 rounded bg-white/5">
                          {garment.category}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed mb-2.5">
                      {garment.historicalBrief}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                      <span className="text-cyber-lime">
                        {garment.collarType === 'LAP_LINH' ? 'Cổ Lập Lĩnh' : garment.collarType}
                      </span>
                      <span>·</span>
                      <span className="text-heritage-hoang">
                        {garment.buttonCount} Cúc
                      </span>
                      <span>·</span>
                      <span className="text-cyber-jade">
                        {garment.closureDirection === 'RIGHT' ? 'Hữu Nhậm' : 'Xẻ Giữa'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: PHỐI LỚP & HẠ Y (QUẦN THỤNG, CARGO, LỚP LÓT)                */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'ha-y-layer' && (
          <div className="space-y-5">
            {/* Section A: Hạ Y (Bottoms - Guardrail Enforced) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                  Hạ Y (Quần Dài & Váy Đụp)
                </span>
                <span className="text-[11px] font-mono text-heritage-hoang">
                  * Bắt buộc để tránh vi phạm đoan chính
                </span>
              </div>

              <div className="space-y-2">
                {CONTEMPORARY_BOTTOMS.map(bottom => {
                  const isSelected = outfit.bottomId === bottom.id;
                  return (
                    <div
                      key={bottom.id}
                      onClick={() => onUpdateOutfit(o => ({ ...o, bottomId: bottom.id }))}
                      className={`p-3 rounded-m3-md border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyber-lime/10 border-cyber-lime text-white shadow-cyber-glow'
                          : 'bg-obsidian-800/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: bottom.colorHex }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{bottom.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-gray-300">
                              {bottom.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400">{bottom.desc}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-cyber-lime" />}
                    </div>
                  );
                })}

                {/* Test button: Remove pants to trigger violation */}
                <button
                  type="button"
                  onClick={() => onUpdateOutfit(o => ({ ...o, bottomId: null }))}
                  className={`w-full py-2 rounded-m3-md text-xs font-mono border border-dashed transition-colors flex items-center justify-center gap-2 ${
                    !outfit.bottomId
                      ? 'bg-rose-500/10 border-rose-500 text-rose-300 font-bold'
                      : 'border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>[Thử nghiệm] Không mặc quần (Kích hoạt cảnh báo đoan chính)</span>
                </button>
              </div>
            </div>

            {/* Section B: Áo Lót Trong (Base Layer) */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                Áo Lót Trong (Lộ viền cổ 1.5mm)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'base-trung-don', name: 'Áo Trung Đơn Bạch Lụa', note: 'Viền cổ sạch sẽ trang nghiêm' },
                  { id: null, name: 'Không Mặc Lót Trong', note: 'Mặc trực tiếp áo chính' }
                ].map((base, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onUpdateOutfit(o => ({ ...o, baseId: base.id }))}
                    className={`p-2.5 rounded-m3-md border text-left transition-all ${
                      outfit.baseId === base.id
                        ? 'bg-white/10 border-white text-white font-bold'
                        : 'bg-obsidian-800/40 border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{base.name}</p>
                    <p className="text-[10px] text-gray-400">{base.note}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: SẮC MÀU & NGŨ HÀNH (BẢNG MÀU PHỐI DI SẢN)                  */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'sac-mau-ngu-hanh' && (
          <div className="space-y-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                Bảng Phối Màu Kinh Điển Việt Nam
              </span>
              <p className="text-[11px] text-gray-400 mb-2.5">
                Các tổ hợp màu ngũ hành tương sinh được lưu truyền từ hoàng cung và tranh dân gian.
              </p>
            </div>

            <div className="space-y-2.5">
              {CLASSIC_PALETTES.map(pal => (
                <div
                  key={pal.id}
                  onClick={() =>
                    onUpdateOutfit(o => ({
                      ...o,
                      customColors: {
                        [coreGarment.id]: pal.primaryHex,
                        core: pal.primaryHex,
                        bottom: pal.secondaryHex,
                        lapel: pal.accentHex
                      }
                    }))
                  }
                  className="p-3 rounded-m3-md bg-obsidian-800/50 border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{pal.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-cyber-lime font-bold">
                        Hành {pal.element}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 max-w-sm">{pal.meaning}</p>
                  </div>

                  {/* 3 Swatches */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: pal.primaryHex }}
                      title="Áo chính"
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: pal.secondaryHex }}
                      title="Hạ y"
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: pal.accentHex }}
                      title="Nẹp cúc"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Warning regarding Chinh Hoang Imperial Color */}
            <div className="p-3 rounded-m3-md bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong>Quy định triều đình:</strong> Sắc Chính Hoàng (#FFD700) nguyên chất là độc quyền của Hoàng đế. Nên dùng màu Vàng Hoàng Thổ (#D69E2E) hoặc Vàng Hoa Hòe nhã nhặn để đạt điểm di sản tối đa.
              </p>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: PHỤ KIỆN TÂN KỲ (JEWELRY, HEADWEAR, FOOTWEAR)                */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'phu-kien' && (
          <div className="space-y-3">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
                Kho Phụ Kiện Cổ Truyền & Đương Đại
              </span>
              <p className="text-[11px] text-gray-400">
                Nhấp chọn để gắn thêm phụ kiện lên ma-nơ-canh (Hệ thống tự động phát hiện lai tạp).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {accessories.map(acc => {
                const isSelected = (outfit.accessoryIds || []).includes(acc.id);
                const isForeign = acc.isForeignOrAssimilated;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleToggleAccessory(acc.id)}
                    className={`p-3 rounded-m3-md border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? isForeign
                          ? 'bg-rose-500/20 border-rose-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                          : 'bg-cyber-lime/10 border-cyber-lime text-white shadow-cyber-glow'
                        : 'bg-obsidian-800/40 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">{acc.name}</span>
                        {isForeign && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-rose-500/30 text-rose-300 font-bold">
                            Ngoại Lai
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-1">{acc.culturalNote}</p>
                    </div>

                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${
                        isSelected
                          ? isForeign
                            ? 'bg-rose-500 border-rose-500 text-white'
                            : 'bg-cyber-lime border-cyber-lime text-obsidian-900'
                          : 'border-white/20'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* TAB 5: ATHENYA COPILOT (CHATBOT THỜI TRANG LINH MIÊU)              */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === 'athenya-copilot' && (
          <div className="space-y-4 flex flex-col h-full">
            {/* Chat Messages Log */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-m3-md text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-white/10 text-white ml-6 rounded-tr-none'
                      : 'bg-obsidian-800 border border-cyber-jade/30 text-gray-200 mr-4 rounded-tl-none shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-cyber-jade">
                    <span>{msg.role === 'user' ? 'Bạn' : 'Athenya 🐾'}</span>
                  </div>
                  <p className="whitespace-pre-line">{msg.text}</p>
                  {msg.stylingTip && (
                    <div className="mt-2 pt-2 border-t border-white/10 text-[11px] text-heritage-hoang flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{msg.stylingTip}</span>
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div className="p-3 rounded-m3-md bg-obsidian-800 text-xs text-cyber-jade animate-pulse flex items-center gap-2">
                  <span>Athenya đang quan sát và vểnh tai suy ngẫm... 🐾</span>
                </div>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                'Gợi ý chụp kỷ yếu',
                'Phối Áo Tấc xuống phố',
                'Tối giản đi học',
                'Dạ hội vương giả'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setChatPrompt(chip);
                  }}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 shrink-0 cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handleSendAthenyaPrompt} className="relative flex items-center">
              <input
                type="text"
                value={chatPrompt}
                onChange={e => setChatPrompt(e.target.value)}
                placeholder="Nhập ý tưởng phối đồ cho Athenya..."
                className="w-full bg-obsidian-800 border border-white/15 rounded-m3-md px-3.5 py-2.5 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-cyber-jade pr-10"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatPrompt.trim()}
                className="absolute right-2 p-1.5 rounded-full bg-cyber-lime text-obsidian-900 hover:bg-white transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 4. FOOTER: Quick Action Toolbar & Reset Preset                      */}
      {/* ==================================================================== */}
      <div className="px-5 py-3 border-t border-white/10 bg-obsidian-800/90 backdrop-blur-md flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Đang chọn:</span>
          <span className="font-bold text-white">{coreGarment.name}</span>
          <span className="text-gray-400">·</span>
          <span className="text-cyber-lime font-bold">
            {outfit.bottomId ? 'Đã có quần dài' : 'Chưa có quần dài'}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            onUpdateOutfit(() => ({
              baseId: 'base-trung-don',
              outerId: 'ao-ngu-than-tay-chen',
              bottomId: 'bottom-quan-lua-trang',
              footwearId: 'acc-guoc-moc',
              accessoryIds: ['acc-kieng-bac'],
              customColors: {},
              isXRayMode: false
            }));
          }}
          className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-heritage-hoang" />
          <span>Đặt lại chuẩn gốc</span>
        </button>
      </div>
    </div>
  );
};

export default ConfiguratorTabs;
