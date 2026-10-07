/**
 * VibePhục Studio — Deterministic Cultural Guardrails Engine
 * Enforces historical integrity and prevents cultural taboos in Vietnamese attire styling.
 * Grounded in: Đại Nam Thực Lục, Khâm Định Đại Nam Hội Điển Sự Lệ, Ngàn Năm Áo Mũ.
 */

import {
  OutfitState,
  GarmentItem,
  HeritageValidationResult,
  CulturalViolation,
  ViolationSeverity,
  AthenyaReaction
} from '../types/vibephuc';

/**
 * Validates an outfit against peer-reviewed Vietnamese heritage rules.
 * 
 * @param outfit Current outfit composition across modular layers
 * @param catalog Complete historical garment catalog
 * @returns HeritageValidationResult with score (0-100), status, and actionable violations
 */
export function validateOutfit(
  outfit: OutfitState,
  catalog: GarmentItem[]
): HeritageValidationResult {
  const violations: CulturalViolation[] = [];
  let score = 100;

  // Resolve core garment from outerId, baseId, or catalog lookup
  const coreGarment =
    catalog.find(g => g.id === outfit.outerId) ||
    catalog.find(g => g.id === outfit.baseId) ||
    catalog[0];

  // Resolve all active garments in the outfit
  const activeGarments: GarmentItem[] = [];
  if (outfit.baseId) {
    const base = catalog.find(g => g.id === outfit.baseId);
    if (base) activeGarments.push(base);
  }
  if (outfit.outerId) {
    const outer = catalog.find(g => g.id === outfit.outerId);
    if (outer) activeGarments.push(outer);
  }
  if (activeGarments.length === 0 && coreGarment) {
    activeGarments.push(coreGarment);
  }

  // ==========================================================================
  // CHECK 1 (P0 - Đại kỵ Tả Nhậm - Left Lapel Closure)
  // ==========================================================================
  const isLeftClosure =
    activeGarments.some(g => g.closureDirection === 'LEFT') ||
    outfit.lapelMode === 'TA_NHAM' ||
    (outfit.customColors && outfit.customColors['lapel'] === 'LEFT');

  if (isLeftClosure) {
    score -= 100; // Trừ toàn bộ 100 điểm, đánh sập điểm HIS về 0
    violations.push({
      ruleId: 'RULE_P0_TA_NHAM',
      severity: 'CRITICAL_BLOCKER',
      message: 'Đại kỵ tang ma: Người Việt xưa chỉ gài vạt sang trái khi khâm liệm tử thi.',
      historicalContext:
        'Từ thời tiền nhân Đại Việt đến triều Nguyễn, quy thức may mặc bắt buộc luôn khép vạt từ Trái đè lên Phải (Hữu Nhậm) theo lẽ dương khí và sinh tồn của người sống. Vạt áo cài sang trái (Tả Nhậm - 左衽) xưa nay duy nhất chỉ dùng trong nghi lễ tang ma khâm liệm người đã khuất.',
      fixSuggestion: 'Chuyển vạt áo về quy thức Hữu Nhậm (Gài sang phải).'
    });
  }

  // ==========================================================================
  // CHECK 2 (P1 - Hoàng quyền - Royal Exclusive Violation)
  // ==========================================================================
  const CHINH_HOANG_COLOR = '#FFD700'; // Sắc vàng Chính Hoàng nguyên chất
  const hasChinhHoangColor =
    Object.values(outfit.customColors || {}).some(
      c => c.toUpperCase() === CHINH_HOANG_COLOR || c.toLowerCase() === 'chinh_hoang'
    ) ||
    activeGarments.some(g => g.defaultColor.toUpperCase() === CHINH_HOANG_COLOR);

  const hasRoyalSymbolMisuse =
    (coreGarment?.isRoyalExclusive && !outfit.outerId?.includes('ceremonial')) ||
    hasChinhHoangColor;

  if (hasRoyalSymbolMisuse) {
    score -= 30;
    violations.push({
      ruleId: 'RULE_P1_ROYAL_IMPERIAL',
      severity: 'WARNING',
      message:
        'Phạm quy biểu tượng quân vương: Sắc Chính Hoàng (#FFD700) và họa tiết rồng 5 móng là biểu tượng tối thượng của Hoàng đế triều đình.',
      historicalContext:
        'Theo điển chế sumptuary laws thời Lê và Nguyễn (Khâm Định Đại Nam Hội Điển Sự Lệ), sắc Chính Hoàng (vàng tươi nguyên chất) và rồng ngũ trảo (rồng 5 móng) là đặc quyền độc tôn của Thiên tử. Thường dân, học sinh hoặc quan lại chỉ được dùng màu Hoàng thổ (#D69E2E), vàng hoa hòe hoặc rồng 4 móng (mãng).',
      fixSuggestion: 'Đổi sang màu Vàng Hoàng Thổ (#D69E2E) hoặc Vàng Hoa Hòe nhã nhặn.'
    });
  }

  // ==========================================================================
  // CHECK 3 (P1 - Phản cảm hạ y - Missing Long Bottom Pants)
  // ==========================================================================
  const isLongPaneledGarment =
    coreGarment?.category === 'AO_DAI' ||
    coreGarment?.category === 'NGU_THAN' ||
    coreGarment?.category === 'NHAT_BINH';

  const hasBottomPants = Boolean(outfit.bottomId && outfit.bottomId.trim() !== '');

  if (isLongPaneledGarment && !hasBottomPants) {
    score -= 50;
    violations.push({
      ruleId: 'RULE_P1_MISSING_BOTTOM_PANTS',
      severity: 'CRITICAL_BLOCKER',
      message: 'Thiếu kín đáo đoan nghiêm: Mặc áo dài / cổ phục tà dài mà không có quần dài truyền thống.',
      historicalContext:
        'Áo dài và áo ngũ thân của người Việt luôn bắt buộc phải đi cùng quần dài (quần lụa trắng hoặc quần lụa đen Lãnh Mỹ Á) chạm mu bàn chân. Việc mặc áo dài không quần hoặc mặc váy cộc để lộ đùi là hành vi phản cảm, vi phạm nghiêm trọng tính đoan chính thuần phong mỹ tục.',
      fixSuggestion: 'Bổ sung Quần lụa trắng hoặc Quần lụa đen chạm mu bàn chân.'
    });
  }

  // ==========================================================================
  // CHECK 4 (P2 - Lai tạp văn hóa - Foreign Cultural Assimilation)
  // ==========================================================================
  const foreignAccessoryIds = ['acc-foreign-obi', 'acc-foreign-hanfu-ribbon'];
  const hasForeignAccessory = (outfit.accessoryIds || []).some(id =>
    foreignAccessoryIds.includes(id)
  );

  const isTraditionalCeremonial =
    coreGarment?.category === 'NGU_THAN' ||
    coreGarment?.category === 'NHAT_BINH' ||
    coreGarment?.category === 'GIAO_LINH' ||
    coreGarment?.category === 'TU_THAN';

  if (hasForeignAccessory && isTraditionalCeremonial) {
    score -= 30;
    violations.push({
      ruleId: 'RULE_P2_FOREIGN_ASSIMILATION',
      severity: 'CRITICAL_BLOCKER',
      message:
        'Lai tạp văn hóa: Phát hiện sự kết hợp phụ kiện ngoại lai (Đai Obi Nhật Bản / Nơ ngực Hanfu) trên cổ phục Việt Nam.',
      historicalContext:
        'Áo Tấc và Nhật Bình Việt Nam có kết cấu đai ngọc hoặc dải thao buông rủ thuần Việt, không dùng đai thắt lưng bản to (Obi của Kimono Nhật) hay dải lụa thắt nơ ngực Tiên hiệp của Hán phục. Việc lai tạp gây xói mòn tính nguyên bản và đánh tráo bản sắc di sản.',
      fixSuggestion:
        'Gỡ bỏ phụ kiện ngoại lai và thay thế bằng Đai ngọc, Kiềng bạc hoặc Khăn đóng truyền thống.'
    });
  }

  // Determine final status
  let status: HeritageValidationResult['status'] = 'PASSED';
  if (violations.some(v => v.severity === 'CRITICAL_BLOCKER')) {
    status = 'CRITICAL_BLOCKER';
  } else if (violations.length > 0) {
    status = 'WARNING';
  }

  const finalScore = Math.max(0, Math.min(100, score));

  return {
    score: finalScore,
    status,
    violations
  };
}

/**
 * Generates Athenya Guardian Cat reaction based on validation results
 */
export function getAthenyaReaction(result: HeritageValidationResult): AthenyaReaction {
  if (result.status === 'CRITICAL_BLOCKER') {
    const blocker = result.violations.find(v => v.severity === 'CRITICAL_BLOCKER');
    return {
      mood: 'HISSING',
      catSpeech: 'Gừuuu! Xù lông rồi đấy nha sen!',
      advice: blocker
        ? `${blocker.message} Mau sửa lại theo gợi ý: "${blocker.fixSuggestion}" kẻo tiền nhân quở!`
        : 'Phát hiện đại kỵ văn hóa nghiêm trọng! Hãy kiểm tra lại hướng vạt hoặc phục sức hạ y.'
    };
  }

  if (result.status === 'WARNING') {
    return {
      mood: 'ALERT',
      catSpeech: 'Meo meo... Trông cũng ổn nhưng có chút cấn cấn đó nghen!',
      advice:
        result.violations[0]?.message ||
        'Có vài chi tiết chưa thật sự chuẩn mực quy thức cung đình, bạn nên cân nhắc tinh chỉnh lại sắc độ.'
    };
  }

  if (result.score >= 95) {
    return {
      mood: 'PROUD',
      catSpeech: 'Meoow! Tuyệt đỉnh phong thái Đại Việt! 🐾',
      advice:
        'Bộ trang phục chuẩn mực Hữu Nhậm, sống lưng Chính Trung thanh khiết, toát lên lòng tự tôn di sản của người mặc.'
    };
  }

  return {
    mood: 'PURRING',
    catSpeech: 'Meooo... Đạt chuẩn di sản rồi nè!',
    advice: 'Bản phối hài hòa và kín đáo. Bạn có thể tự tin diện bản phối này xuất hành xuống phố.'
  };
}
