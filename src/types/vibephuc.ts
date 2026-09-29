/**
 * VibePhục Studio — Core Data Models & Heritage Cultural Guardrails Engine
 * Strictly typed architectural models for Vietnamese heritage garment styling.
 */

export type GarmentType =
  | 'AO_DAI_NGU_THAN'
  | 'AO_DAI_LEMUR'
  | 'AO_DAI_RAGLAN'
  | 'AO_DAI_HIEN_DAI'
  | 'AO_NGU_THAN_TAY_CHEN'
  | 'AO_TAC'
  | 'NHAT_BINH'
  | 'TU_THAN'
  | 'GIAO_LINH'
  | 'BA_BA';

export type Occasion =
  | 'KY_YEU_GRADUATION'
  | 'TET_SPRING'
  | 'LE_HOI_TRUONG'
  | 'STREETWEAR_CASUAL'
  | 'PROM_NIGHT'
  | 'DAM_CUOI_WEDDING';

export type Region =
  | 'BAC_BO'
  | 'TRUNG_BO'
  | 'NAM_BO'
  | 'TAY_NGUYEN_TAY_BAC';

export type Weather =
  | 'NANG_AM'
  | 'SE_LANH'
  | 'MUA_RAO';

export type FiveElement = 'KIM' | 'MOC' | 'THUY' | 'HOA' | 'THO';

export type LayerSlot =
  | 'base'          // Áo lót, Yếm đào, Trung đơn
  | 'core'          // Áo chính (Áo dài, Ngũ thân, Nhật Bình, Tứ Thân...)
  | 'outer'         // Áo khoác ngoài (Cyber Organza, Trench, Bomber, Áo Tấc khoác)
  | 'bottom'        // Quần lụa, Quần ống rộng, Quần parachute cargo, Váy đụp
  | 'footwear'      // Giày thêu, Hài cổ, Sneaker chunky, Boots da
  | 'accessory';    // Nón lá, Nón quai thao, Khăn rằn, Kiềng bạc, Túi tote...

export interface ColorDefinition {
  name: string;
  hex: string;
  element: FiveElement;
  symbolicMeaning: string;
}

export interface GarmentItem {
  id: string;
  name: string;
  category: GarmentType;
  era: string;               // e.g. "Triều Nguyễn (TK 19)", "Thập niên 1930"
  region: Region;
  slot: LayerSlot;
  defaultColor: ColorDefinition;
  allowableColors: ColorDefinition[];
  harmonyElement: FiveElement;
  historicalNote: string;
  visualLayerUrl?: string;
  recommendedOccasions: Occasion[];
  suitableWeather: Weather[];
  forbiddenPairings?: string[]; // Rule IDs or item categories
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
  isForeignOrAssimilated?: boolean; // True for Kimono Obi, Hanfu Ruqun ribbon, etc.
  culturalNote: string;
  element: FiveElement;
  colorHex: string;
  recommendedGarments: GarmentType[];
}

export interface OutfitState {
  avatarType: 'FEMALE_STUDENT' | 'MALE_STUDENT' | 'GENDER_NEUTRAL' | 'CUSTOM_UPLOAD';
  customAvatarUrl?: string;
  baseGarment: GarmentItem | null;
  coreGarment: GarmentItem;
  outerGarment: GarmentItem | null;
  bottomPiece: GarmentItem | null;
  footwear: AccessoryItem | null;
  accessories: AccessoryItem[];
  modernAccents: string[];
  lapelMode: 'HUU_NHAM' | 'TA_NHAM'; // Hữu Nhậm (chuẩn) vs Tả Nhậm (vi phạm tang lễ)
  buttonCount: number; // 5 for Ngũ Luân / Ngũ Thường
  isXRayMode: boolean; // X-Ray Skeleton mode
}

export type ViolationSeverity = 'CRITICAL_BLOCKER' | 'WARNING' | 'HISTORICAL_NOTE';

export interface CulturalViolation {
  ruleId: string;
  severity: ViolationSeverity;
  title: string;
  message: string;
  historicalContext: string;
  fixSuggestion: string;
  autoFixAction?: 'INVERT_LAPEL' | 'REMOVE_FOREIGN_ACCENT' | 'ADD_LONG_PANTS' | 'RESET_CEREMONIAL_CUT';
}

export interface FengshuiHarmony {
  score: number; // 0 - 100
  dominantElement: FiveElement;
  relationships: Array<{
    source: string;
    target: string;
    relation: 'GENERATING' | 'OVERCOMING' | 'NEUTRAL'; // Tương sinh / Tương khắc
    description: string;
  }>;
  advice: string;
}

export interface HeritageValidationResult {
  score: number; // 0 - 100 Heritage Integrity Score (HIS)
  status: 'PASSED' | 'WARNING' | 'CRITICAL_BLOCKER';
  violations: CulturalViolation[];
  fengshui: FengshuiHarmony;
  verifiedSeams: {
    chinhTrungBackSeam: boolean;
    huuNhamRightClosure: boolean;
    nguLuanFiveButtons: boolean;
    traditionalLongPants: boolean;
  };
}

export interface DigitalPassport {
  id: string;
  serialNumber: string;
  createdAt: string;
  conceptTitle: string;
  curatorVerdict: string;
  outfitSnapshot: OutfitState;
  validation: HeritageValidationResult;
  targetOccasion: Occasion;
  targetRegion: Region;
  stylingGuide: string[];
}
