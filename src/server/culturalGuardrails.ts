import { RemixResponse } from '../types/lookbook';

/**
 * Validates whether user prompt or request attempts to violate the Golden Rule:
 * "Hữu Nhậm" (left over right / button to right).
 * "Tả Nhậm" (wrapping or buttoning to left) is strictly flagged.
 */
export function checkCulturalGuardrails(textToInspect: string): {
  isViolation: boolean;
  violationResponse?: RemixResponse;
} {
  if (!textToInspect) return { isViolation: false };

  const normalized = textToInspect.toLowerCase();

  // Pattern detection for Tả Nhậm violation
  const taNhamKeywords = [
    'tả nhậm',
    'ta nham',
    'cài sang trái',
    'cai sang trai',
    'khép sang trái',
    'khep sang trai',
    'khuy sang trái',
    'khuy trai',
    'cúc sang trái',
    'cuc sang trai',
    'đè sang trái',
    'de sang trai',
    'vạt phải đè vạt trái',
    'vat phai de vat trai',
    'wrap to left',
    'button to left',
    'button left',
    'buttoning to the left',
    'wrap left',
    'right over left',
    'left side buttoning',
    'cài áo sang trái',
    'cài vạt bên trái',
  ];

  const hasViolation = taNhamKeywords.some((kw) => normalized.includes(kw));

  if (hasViolation) {
    const violationResponse: RemixResponse = {
      id: `violation-${Date.now()}`,
      outfitName: 'Cảnh Báo Vi Phạm Quy Thức Di Sản (Tả Nhậm)',
      periodReference: 'Quy chuẩn Điển lễ Cổ phục Đại Việt & Triều Nguyễn',
      culturalGuardrailStatus: 'FLAGGED_VIOLATION',
      heritageScore: 15,
      layers: {
        innerBase: 'Cảnh báo: Yêu cầu tạo hình hoặc phối đồ có dấu hiệu khép vạt sang trái (Tả Nhậm - 左衽).',
        heritageOuter: 'Bị đình chỉ bảo chứng: Cổ phục Việt Nam qua các triều đại Lý, Trần, Lê, Nguyễn nghiêm cấm Tả Nhậm trong đời sống thường nhật.',
        modernAccent: 'Khuyến nghị tu chỉnh: Điều chỉnh chiều khuy và nếp áo từ trái đè sang phải (Hữu Nhậm - 右衽) để hợp quy thức.',
      },
      colorPalette: [
        { name: 'Chu Sa Cảnh Báo', hex: '#D32F2F', element: 'Hỏa' },
        { name: 'Tro Đen Tang Chế', hex: '#37474F', element: 'Thủy' },
        { name: 'Xám Kim Loại Cảnh Giác', hex: '#78909C', element: 'Kim' },
        { name: 'Nâu Đất Thầm Lặng', hex: '#5D4037', element: 'Thổ' },
      ],
      stylingGuide: 'Trang phục Việt Nam truyền thống bắt buộc cài nút/buộc dải từ trái sang phải. Chiều ngược lại (Tả Nhậm) chỉ xuất hiện trong nghi thức tế tự táng lễ hoặc phong tục phi truyền thống.',
      curatorVerdict: 'Hội đồng Thẩm định VibePhục Studio từ chối cấp chứng thư Hữu Nhậm cho phối thức này nhằm bảo tồn tính chuẩn xác của di sản dân tộc.',
      culturalNotes: 'Cảnh báo quy thức: Trang phục truyền thống Việt Nam bắt buộc khép vạt sang phải (Hữu Nhậm). Tuyệt đối không cài sang trái (Tả Nhậm).',
      mode: 'GUARDRAIL_INTERCEPT',
      timestamp: new Date().toISOString(),
    };

    return {
      isViolation: true,
      violationResponse,
    };
  }

  return { isViolation: false };
}
