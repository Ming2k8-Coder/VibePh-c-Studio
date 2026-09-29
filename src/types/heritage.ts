/**
 * Heritage Types & Cultural Guardrails Engine
 * VibePhục Studio — Architectural Data Models
 */

export type GarmentCategory = 
  | 'NGU_THAN_TAY_CHEN' 
  | 'AO_TAC' 
  | 'NHAT_BINH' 
  | 'TU_THAN' 
  | 'BA_BA'
  | 'MODERN_STREETWEAR';

export type LayerSlot = 'base' | 'core' | 'outer' | 'bottom' | 'accessory';

export type ClosureDirection = 'HUU_NHAM' | 'TA_NHAM' | 'CHINH_TRUNG_BUTTONS' | 'OPEN_TIED';

export type RoyalGradeLevel = 'FOLK' | 'OFFICIAL' | 'IMPERIAL_NOBLE' | 'STREETWEAR_FUSION';

export type SleeveType = 'TAY_CHEN' | 'TAY_THU' | 'CANH_DOI' | 'RAGLAN_STREET' | 'SLEEVELESS';

export type CollarType = 'LAP_LINH' | 'NHAT_BINH_RECT' | 'GIAO_LINH_CROSS' | 'BA_BA_ROUND' | 'MODERN_HOOD' | 'CREWNECK';

export interface GarmentAttributes {
  closureDirection: ClosureDirection;
  buttonCount: number;
  hasChinhTrungSeam: boolean;
  royalGradeLevel: RoyalGradeLevel;
  sleeveType?: SleeveType;
  collarType?: CollarType;
  color?: string;
  material?: string;
  hasConflatedElements?: boolean;
  conflationDetails?: string;
  hasImperialForbiddenMonopoly?: boolean; // e.g. 5-claw imperial dragons or forbidden pure imperial yellow
}

export interface HeritageItem {
  id: string;
  name: string;
  category: GarmentCategory;
  slot: LayerSlot;
  era: string;
  isModern: boolean;
  attributes: GarmentAttributes;
  description: string;
  culturalNote?: string;
  imageUrl?: string;
  tags?: string[];
}

export type ViolationSeverity = 'CRITICAL_BLOCKER' | 'HIGH_VIOLATION' | 'MEDIUM_WARNING';

export interface HeritageRuleViolation {
  ruleId: string;
  severity: ViolationSeverity;
  title: string;
  message: string;
  fixSuggestion: string;
  penalty: number;
}

export interface HeritageBadges {
  huuNhamVerified: boolean;
  buttonCountVerified: boolean;
  chinhTrungVerified: boolean;
  noCrossConflation: boolean;
  sumptuarySafe: boolean;
}

export interface HeritageValidationResult {
  score: number; // 0 - 100 Heritage Integrity Score (HIS)
  isValid: boolean;
  violations: HeritageRuleViolation[];
  badges: HeritageBadges;
  summary: string;
}

export interface AtelierConfiguration {
  baseItem: HeritageItem | null;
  coreItem: HeritageItem | null;
  outerItem: HeritageItem | null;
  bottomItem: HeritageItem | null;
  accessoryItem: HeritageItem | null;
  customClosureOverride?: ClosureDirection;
  customButtonOverride?: number;
}

// ==========================================
// CULTURAL GUARDRAILS VALIDATION LOGIC
// ==========================================

export function evaluateHeritageIntegrity(config: AtelierConfiguration): HeritageValidationResult {
  const violations: HeritageRuleViolation[] = [];
  let score = 100;

  const core = config.coreItem;
  const outer = config.outerItem;
  const activeGarment = core || outer;

  const effectiveClosure = config.customClosureOverride || 
    (activeGarment ? activeGarment.attributes.closureDirection : 'HUU_NHAM');

  const effectiveButtons = config.customButtonOverride !== undefined 
    ? config.customButtonOverride 
    : (activeGarment ? activeGarment.attributes.buttonCount : 5);

  let huuNhamVerified = true;
  let buttonCountVerified = true;
  let chinhTrungVerified = true;
  let noCrossConflation = true;
  let sumptuarySafe = true;

  // RULE 01: Quy thức Hữu Nhậm (Cực kỳ nghiêm ngặt)
  if (effectiveClosure === 'TA_NHAM') {
    huuNhamVerified = false;
    violations.push({
      ruleId: 'CRITICAL_01_TA_NHAM',
      severity: 'CRITICAL_BLOCKER',
      title: 'Đại Kỵ Tả Nhậm (Cài Vạt Trái)',
      message: 'Cài vạt áo sang bên trái (Tả Nhậm - 右衽) là đại kỵ trong văn hóa cổ phục Việt Nam, xưa nay chỉ dùng trong nghi thức liệm tang ma tử thi.',
      fixSuggestion: 'Lập tức chuyển sang Hữu Nhậm (Cài vạt trái phủ lên vạt phải, khuy bấm bên nách phải).',
      penalty: 60,
    });
    score -= 60;
  }

  // RULE 02: Ngũ Luân / Ngũ Thường khuy cúc (Áo Ngũ Thân & Áo Tấc)
  if (core && (core.category === 'NGU_THAN_TAY_CHEN' || core.category === 'AO_TAC')) {
    if (effectiveButtons !== 5) {
      buttonCountVerified = false;
      const penalty = 15;
      violations.push({
        ruleId: 'HIGH_02_BUTTON_COUNT',
        severity: 'HIGH_VIOLATION',
        title: 'Lệch Chuẩn 5 Hạt Nút (Ngũ Thường)',
        message: `Áo ngũ thân quy định chặt chẽ 5 hạt cúc tượng trưng Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín) & Ngũ Luân. Hiện tại đang có ${effectiveButtons} cúc.`,
        fixSuggestion: 'Chỉnh lại đúng 5 cúc truyền thống (1 ở cổ, 1 ở nách, 3 dọc lườn phải).',
        penalty,
      });
      score -= penalty;
    }

    // RULE 03: Đường sống lưng Chính Trung
    if (core.attributes.hasChinhTrungSeam === false) {
      chinhTrungVerified = false;
      violations.push({
        ruleId: 'MEDIUM_03_CHINH_TRUNG',
        severity: 'MEDIUM_WARNING',
        title: 'Thiếu Sống Lưng Chính Trung',
        message: 'Áo ngũ thân truyền thống bắt buộc ráp sống đôi thẳng tắp ở chính giữa lưng biểu trưng cho tâm tính ngay thẳng, quang minh chính đại.',
        fixSuggestion: 'Kích hoạt đường may sống lưng Chính Trung ráp đôi.',
        penalty: 10,
      });
      score -= 10;
    }
  }

  // RULE 04: Chống đồng hóa văn hóa (Cross-cultural conflation)
  const items = [config.baseItem, config.coreItem, config.outerItem, config.bottomItem, config.accessoryItem];
  for (const item of items) {
    if (item && item.attributes.hasConflatedElements) {
      noCrossConflation = false;
      violations.push({
        ruleId: 'CRITICAL_04_CONFLATION',
        severity: 'CRITICAL_BLOCKER',
        title: 'Phát Hiện Đồng Hóa Ngoại Lai',
        message: item.attributes.conflationDetails || 'Yếu tố ngoại lai không thuộc văn hóa trang phục Việt Nam (như đai Obi Kimono, dải ngực Hán phục Ruqun, hoặc xẻ đùi Sườn xám).',
        fixSuggestion: 'Thay thế bằng phụ kiện thuần Việt như thắt lưng lụa, dải ngũ sắc, hoặc bao sáp truyền thống.',
        penalty: 30,
      });
      score -= 30;
      break;
    }
  }

  // RULE 05: Độc quyền biểu tượng hoàng gia (Sumptuary laws)
  for (const item of items) {
    if (item && item.attributes.hasImperialForbiddenMonopoly) {
      sumptuarySafe = false;
      violations.push({
        ruleId: 'HIGH_05_SUMPTUARY',
        severity: 'HIGH_VIOLATION',
        title: 'Phạm Biểu Tượng Độc Quyền Hoàng Gia',
        message: 'Streetwear không được lạm dụng Rồng 5 móng (Ngũ trảo kim long) hoặc màu Chính Hoàng chỉ dành riêng cho Thiên tử.',
        fixSuggestion: 'Sử dụng rồng dân gian 4 móng cách điệu, hoa văn thủy ba, mây ngũ sắc hoặc sắc hoàng thổ nghệ thuật.',
        penalty: 15,
      });
      score -= 15;
      break;
    }
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    score: finalScore,
    isValid: finalScore >= 90 && huuNhamVerified,
    violations,
    badges: {
      huuNhamVerified,
      buttonCountVerified,
      chinhTrungVerified,
      noCrossConflation,
      sumptuarySafe,
    },
    summary: finalScore >= 90
      ? 'Đạt chuẩn di sản xuất sắc (Heritage Integrity Score: ' + finalScore + '%)'
      : 'Cần hiệu chỉnh để đảm bảo tính xác thực văn hóa (Heritage Integrity Score: ' + finalScore + '%)',
  };
}
