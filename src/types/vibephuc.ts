/**
 * VibePhục Studio — Core Data Models & Heritage Cultural Guardrails Engine
 * Strictly typed architectural models for Vietnamese heritage garment styling.
 */

// Re-export architectural types from root types/vibephuc
export type {
  GarmentCategory,
  GarmentEra,
  HarmonyElement,
  AthenyaReaction
} from '../../types/vibephuc';

import type {
  GarmentCategory,
  GarmentEra,
  HarmonyElement,
  AthenyaReaction
} from '../../types/vibephuc';

export type GarmentType =
  | 'AO_DAI'
  | 'NGU_THAN'
  | 'NHAT_BINH'
  | 'TU_THAN'
  | 'GIAO_LINH'
  | 'BA_BA'
  | 'AO_DAI_NGU_THAN'
  | 'AO_DAI_LEMUR'
  | 'AO_DAI_RAGLAN'
  | 'AO_DAI_HIEN_DAI'
  | 'AO_NGU_THAN_TAY_CHEN'
  | 'AO_TAC';

export type Occasion =
  | 'KY_YEU'
  | 'TET'
  | 'LE_HOI_TRUONG'
  | 'STREETWEAR'
  | 'PROM'
  | 'DAM_CUOI'
  | 'KY_YEU_GRADUATION'
  | 'TET_SPRING'
  | 'STREETWEAR_CASUAL'
  | 'PROM_NIGHT'
  | 'DAM_CUOI_WEDDING'
  | 'DI_CHUA_TEMPLE'
  | 'LE_HOI_LANG';

export type Region =
  | 'BAC_BO'
  | 'TRUNG_BO'
  | 'NAM_BO'
  | 'TAY_BAC'
  | 'TAY_NGUYEN_TAY_BAC';

export type Weather =
  | 'NANG_AM'
  | 'SE_LANH'
  | 'MUA_RAO';

export type FiveElement = HarmonyElement;

export type TrustLevel = 'DOC_CITED' | 'FOLK_TRADITION' | 'DEBATED_HYPOTHESIS';

export interface CitationInfo {
  trustLevel: TrustLevel;
  trustLabel: string;
  sourceDocument: string;
  citationText: string;
}

export type LayerSlot =
  | 'base'
  | 'core'
  | 'outer'
  | 'bottom'
  | 'footwear'
  | 'accessory';

export interface ColorDefinition {
  name: string;
  hex: string;
  element: HarmonyElement;
  symbolicMeaning: string;
}

export interface GarmentItem {
  id: string;
  name: string;
  category: GarmentCategory | GarmentType;
  era: GarmentEra | string;
  region: Region;
  slot?: LayerSlot;
  defaultColor: ColorDefinition;
  allowableColors: ColorDefinition[];
  harmonyElement: HarmonyElement;
  historicalNote: string;
  historicalBrief?: string;
  citation: CitationInfo;
  visualLayerUrl?: string;
  closureDirection?: 'RIGHT' | 'LEFT' | 'CENTER';
  collarType?: 'LAP_LINH' | 'GIAO_LINH' | 'CHU_NHAT' | 'TRON' | 'CO_BE';
  buttonCount?: number;
  hasChinhTrungSeam?: boolean;
  isRoyalExclusive?: boolean;
  recommendedOccasions: Occasion[];
  suitableWeather: Weather[];
  forbiddenPairings?: string[];
  sacredLevel: 'FOLK' | 'FORMAL_CEREMONIAL' | 'ROYAL_EXCLUSIVE';
  lapelDirection: 'HUU_NHAM' | 'CENTER_SLIT' | 'CROSS_CHEST';
  hasFiveButtons?: boolean;
}

export interface AccessoryItem {
  id: string;
  name: string;
  type: 'HEADWEAR' | 'JEWELRY' | 'BAG' | 'SCARF' | 'FOOTWEAR' | 'MODERN_ACCENT';
  region: Region | 'ALL';
  era: string;
  isForeignOrAssimilated?: boolean;
  culturalNote: string;
  citation?: CitationInfo;
  element: HarmonyElement;
  colorHex: string;
  recommendedGarments: Array<GarmentCategory | GarmentType>;
}

export interface OutfitState {
  // New architecture token identifiers
  baseId?: string | null;
  outerId?: string | null;
  bottomId?: string | null;
  footwearId?: string | null;
  accessoryIds?: string[];
  customColors?: Record<string, string>;
  isXRayMode: boolean;

  // Active studio composition objects
  avatarType?: 'FEMALE_STUDENT' | 'MALE_STUDENT' | 'GENDER_NEUTRAL' | 'CUSTOM_UPLOAD';
  customAvatarUrl?: string;
  baseGarment: GarmentItem | null;
  coreGarment: GarmentItem;
  outerGarment: GarmentItem | null;
  bottomPiece: GarmentItem | null;
  footwear: AccessoryItem | null;
  accessories: AccessoryItem[];
  modernAccents: string[];
  lapelMode: 'HUU_NHAM' | 'TA_NHAM';
  buttonCount: number;
}

export type ViolationSeverity = 'CRITICAL_BLOCKER' | 'WARNING' | 'HISTORICAL_NOTE';

export interface CulturalViolation {
  ruleId: string;
  severity: ViolationSeverity;
  title: string;
  message: string;
  historicalContext: string;
  fixSuggestion: string;
  autoFixAction?: 'INVERT_LAPEL' | 'REMOVE_FOREIGN_ACCENT' | 'ADD_LONG_PANTS' | 'RESET_CEREMONIAL_CUT' | 'CHANGE_WEDDING_COLOR';
}

export interface ClassicVietnamesePalette {
  id: 'TIM_TRANG_HUE' | 'NAU_NON_HOA_LY' | 'DO_SON_HOA_HOE' | 'DEN_LANH_MY_A';
  nameVi: string;
  description: string;
  historicalContext: string;
  matchScore: number;
}

export interface HSLHarmonyInfo {
  score: number;
  harmonyType: 'ANALOGOUS' | 'COMPLEMENTARY' | 'TRIADIC' | 'CLASSIC_VIETNAMESE' | 'MODERATE';
  harmonyNameVi: string;
  identifiedClassicPalette?: ClassicVietnamesePalette;
  hueDelta: number;
  details: string;
}

export interface FengshuiHarmony {
  score: number;
  dominantElement: HarmonyElement;
  relationships: Array<{
    source: string;
    target: string;
    relation: 'GENERATING' | 'OVERCOMING' | 'NEUTRAL';
    description: string;
  }>;
  advice: string;
  hslHarmony: HSLHarmonyInfo;
}

export interface HeritageValidationResult {
  score: number;
  status: 'PASSED' | 'WARNING' | 'CRITICAL_BLOCKER';
  violations: CulturalViolation[];
  fengshui: FengshuiHarmony;
  occasionFeedback: {
    occasion: Occasion;
    isAppropriate: boolean;
    verdict: string;
    warnings: string[];
  };
  verifiedSeams: {
    chinhTrungBackSeam: boolean;
    huuNhamRightClosure: boolean;
    nguLuanFiveButtons: boolean;
    traditionalLongPants: boolean;
  };
}

export interface FabricRecommendation {
  name: string;
  origin: string;
  suitability: string;
  feel: string;
}

export interface AIStylistCritique {
  lookbookTitle: string;
  genZCaption: string;
  stylingAdvice: string;
  fabricTips: FabricRecommendation[];
  weatherAdvice: string;
  occasionCritique: string;
}

export interface DigitalPassport {
  id: string;
  serialNumber: string;
  createdAt: string;
  conceptTitle: string;
  curatorVerdict: string;
  outfitSnapshot: OutfitState;
  validation: HeritageValidationResult;
  stylistCritique?: AIStylistCritique;
  targetOccasion: Occasion;
  targetRegion: Region;
  stylingGuide: string[];
}
