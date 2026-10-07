/**
 * VibePhục Studio — Core Domain Types & Heritage Architectural Tokens
 * Built for Next.js 14+ (App Router), TypeScript Strict Mode, and Framer Motion.
 */

// ============================================================================
// 1. HERITAGE TAXONOMY & CLASSIFICATION
// ============================================================================

/**
 * Six foundational garment categories of Vietnamese traditional attire
 */
export type GarmentCategory =
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
  | 'AO_TAC'
  | string;

/**
 * Historical eras spanning from Pre-Nguyen roots to Contemporary design
 */
export type GarmentEra =
  | 'TIEN_NGUYEN'
  | 'TRIEU_NGUYEN'
  | 'LEMUR_1930'
  | 'RAGLAN_1960'
  | 'DUONG_DAI'
  | string;

/**
 * Curated cultural occasions for occasion-matching engine
 */
export type Occasion =
  | 'KY_YEU'
  | 'TET'
  | 'LE_HOI_TRUONG'
  | 'STREETWEAR'
  | 'PROM'
  | 'DAM_CUOI';

/**
 * Geographical origins across Vietnam
 */
export type Region =
  | 'BAC_BO'
  | 'TRUNG_BO'
  | 'NAM_BO'
  | 'TAY_BAC'
  | 'TAY_NGUYEN_TAY_BAC'
  | string;

/**
 * Eastern Five Elements (Ngũ Hành) for color harmony and balance
 */
export type HarmonyElement =
  | 'KIM'
  | 'MOC'
  | 'THUY'
  | 'HOA'
  | 'THO';

// ============================================================================
// 2. GARMENT ARCHITECTURE & PIECES
// ============================================================================

/**
 * Color swatch definition with Five Elements metadata
 */
export interface ColorDefinition {
  name: string;
  hex: string;
  element: HarmonyElement;
  symbolicMeaning: string;
}

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

/**
 * Strict GarmentItem schema representing each piece in the Haute Heritage catalog
 */
export interface GarmentItem {
  id: string;
  name: string;
  category: GarmentCategory;
  era: GarmentEra;
  region: Region;
  defaultColor: string | { hex: string; nameVi?: string; [key: string]: any };
  allowableColors: string[];
  harmonyElement: HarmonyElement;
  historicalBrief: string;
  visualLayerUrl?: string;
  closureDirection: 'RIGHT' | 'LEFT' | 'CENTER';
  collarType: 'LAP_LINH' | 'GIAO_LINH' | 'CHU_NHAT' | 'TRON' | 'CO_BE';
  buttonCount: number;
  hasChinhTrungSeam: boolean;
  isRoyalExclusive: boolean;

  // Extended metadata for atelier & knowledge graph
  slot?: LayerSlot;
  historicalNote?: string;
  citation?: CitationInfo;
  recommendedOccasions?: Occasion[];
  suitableWeather?: string[];
  forbiddenPairings?: string[];
  sacredLevel?: 'FOLK' | 'FORMAL_CEREMONIAL' | 'ROYAL_EXCLUSIVE';
  lapelDirection?: 'HUU_NHAM' | 'CENTER_SLIT' | 'CROSS_CHEST';
  hasFiveButtons?: boolean;
}

/**
 * Accessory item definition for jewelry, headwear, bags, footwear
 */
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
  recommendedGarments: GarmentCategory[];
}

// ============================================================================
// 3. ATELIER OUTFIT & STYLING STATE
// ============================================================================

/**
 * Central State for outfit composition across the 5 modular layers
 */
export interface OutfitState {
  baseId?: string | null;
  outerId?: string | null;
  bottomId?: string | null;
  footwearId?: string | null;
  accessoryIds?: string[];
  customColors?: Record<string, string>;
  isXRayMode?: boolean;

  // Extended runtime references for 2D mannequin rendering
  avatarType?: 'FEMALE_STUDENT' | 'MALE_STUDENT' | 'GENDER_NEUTRAL' | 'CUSTOM_UPLOAD';
  customAvatarUrl?: string;
  baseGarment?: GarmentItem | null;
  coreGarment?: GarmentItem;
  outerGarment?: GarmentItem | null;
  bottomPiece?: GarmentItem | null;
  footwear?: AccessoryItem | null;
  accessories?: AccessoryItem[];
  modernAccents?: string[];
  lapelMode?: 'HUU_NHAM' | 'TA_NHAM';
  buttonCount?: number;
}

// ============================================================================
// 4. CULTURAL GUARDRAILS & VALIDATION RESULT
// ============================================================================

export type ViolationSeverity =
  | 'CRITICAL_BLOCKER'
  | 'WARNING'
  | 'HISTORICAL_NOTE';

export interface CulturalViolation {
  ruleId: string;
  severity: ViolationSeverity;
  message: string;
  historicalContext: string;
  fixSuggestion: string;
  title?: string;
  autoFixAction?: string;
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

/**
 * Output of deterministic Heritage Rule Engine evaluation
 */
export interface HeritageValidationResult {
  score: number; // 0 - 100 Heritage Integrity Score (HIS)
  status: 'PASSED' | 'WARNING' | 'CRITICAL_BLOCKER';
  violations: CulturalViolation[];

  // Optional extensions for HUD analysis
  fengshui?: FengshuiHarmony;
  occasionFeedback?: {
    occasion: Occasion | string;
    isAppropriate: boolean;
    verdict: string;
    warnings: string[];
  };
  verifiedSeams?: {
    chinhTrungBackSeam: boolean;
    huuNhamRightClosure: boolean;
    nguLuanFiveButtons: boolean;
    traditionalLongPants: boolean;
  };
}

// ============================================================================
// 5. ATHENYA REACTION (GUARDIAN CAT AI / COMPANION)
// ============================================================================

/**
 * Emotional response and advice from Athenya (Linh miêu di sản)
 */
export interface AthenyaReaction {
  mood: 'PURRING' | 'ALERT' | 'HISSING' | 'PROUD';
  catSpeech: string;
  advice: string;
}

// ============================================================================
// 6. STYLIST ADVICE & FABRICS
// ============================================================================

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
