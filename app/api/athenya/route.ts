/**
 * VibePhục Studio — Athenya Persona Engine (Next.js Route Handler)
 * Route: POST /api/athenya
 * Integrates Gemini 3.8 Flash with structured JSON response schema & cultural guardrail grounding.
 */

import { Type } from '@google/genai';
import { geminiClient } from '../../../lib/gemini';
import { GARMENT_CATALOG } from '../../../data/heritageCatalog';
import { validateOutfit, getAthenyaReaction } from '../../../lib/guardrails';
import { OutfitState } from '../../../types/vibephuc';

export interface AthenyaRequestBody {
  outfit: OutfitState;
  context?: {
    occasion?: string;
    weather?: string;
    promptText?: string;
  };
}

export interface AthenyaResponseBody {
  mood: 'PURRING' | 'ALERT' | 'HISSING' | 'PROUD' | string;
  catSpeech: string;
  advice: string;
  stylingTip: string;
  heritageScore?: number;
  status?: string;
}

export async function POST(request: Request): Promise<Response> {
  let body: AthenyaRequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON request payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { outfit, context } = body;
  if (!outfit) {
    return new Response(JSON.stringify({ error: 'Missing required field: outfit' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 1. Run deterministic cultural validation first
  const validation = validateOutfit(outfit, GARMENT_CATALOG);
  const fallbackReaction = getAthenyaReaction(validation);

  // 2. Prepare payload for Gemini 3.8 Flash
  const coreGarment =
    GARMENT_CATALOG.find(g => g.id === outfit.outerId) ||
    GARMENT_CATALOG.find(g => g.id === outfit.baseId) ||
    GARMENT_CATALOG[0];

  const violationsSummary = validation.violations.length > 0
    ? validation.violations.map(v => `[${v.severity}] ${v.message} (Gợi ý sửa: ${v.fixSuggestion})`).join('\n')
    : 'Không phát hiện vi phạm quy thức văn hóa nào. Điểm di sản hoàn hảo: 100/100.';

  const userPrompt = `
THÔNG TIN OUTFIT NGƯỜI DÙNG ĐANG PHỐI:
- Áo chính: ${coreGarment.name} (${coreGarment.category}, thời kỳ: ${coreGarment.era})
- Quy thức vạt áo: ${outfit.lapelMode || coreGarment.closureDirection}
- Hạ y (quần/váy): ${outfit.bottomId ? 'Có quần dài/váy đụp' : 'KHÔNG CÓ QUẦN (Thiếu hạ y)'}
- Phụ kiện: ${(outfit.accessoryIds || []).join(', ') || 'Không có'}
- Màu sắc tùy biến: ${JSON.stringify(outfit.customColors || {})}
- Bối cảnh sự kiện: ${context?.occasion || 'Xuống phố thường nhật'}
- Thời tiết: ${context?.weather || 'Nắng ấm'}
- Lời nhắn người dùng: "${context?.promptText || ''}"

KẾT QUẢ KIỂM DUYỆT DI SẢN (DETERMINISTIC GUARDRAILS):
- Điểm di sản (HIS): ${validation.score}/100 (Trạng thái: ${validation.status})
- Vi phạm văn hóa:
${violationsSummary}

Hãy phản hồi theo đúng cá tính mèo Athenya linh miêu di sản!
`;

  try {
    if (!geminiClient) {
      throw new Error('GEMINI_API_KEY is not configured on the server');
    }

    const response = await geminiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction:
          "Bạn là Athenya - Trợ lý thời trang thông minh mang linh hồn loài mèo của VibePhục Studio. Bạn thông thái, quan sát sắc sảo, có gu thẩm mỹ cao nhưng thân thiện với Gen Z.\n" +
          "- Nếu outfit đạt điểm di sản cao và phối đẹp: Hãy 'Purr' thích thú, tai vểnh lên khen ngợi hóm hỉnh.\n" +
          "- Nếu phát hiện đại kỵ (như Tả Nhậm) hoặc phối phản cảm: Hãy 'Hiss' hoặc cảnh giác xù lông nhẹ, nhắc nhở văn hóa tinh tế nhưng nghiêm cẩn.",
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: {
              type: Type.STRING,
              description: "Tâm trạng loài mèo: 'PURRING' | 'ALERT' | 'HISSING' | 'PROUD'"
            },
            catSpeech: {
              type: Type.STRING,
              description: "Câu cảm thán biểu cảm đậm chất mèo (có tiếng kêu meo, purr, xù lông, gừ...)"
            },
            advice: {
              type: Type.STRING,
              description: "Lời nhận xét về tính chuẩn mực di sản và lịch sử trang phục"
            },
            stylingTip: {
              type: Type.STRING,
              description: "Mẹo phối đồ thời thượng cho Gen Z (kết hợp phụ kiện, chất liệu hoặc giày sneaker)"
            }
          },
          required: ['mood', 'catSpeech', 'advice', 'stylingTip']
        }
      }
    });

    const responseText = response.text?.trim() || '';
    const parsedData: AthenyaResponseBody = JSON.parse(responseText);

    return new Response(
      JSON.stringify({
        ...parsedData,
        heritageScore: validation.score,
        status: validation.status
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.warn('[Athenya API] Gemini API unavailable or errored, using high-fidelity fallback:', error);

    // High-fidelity fallback guarantee
    const fallbackResponse: AthenyaResponseBody = {
      mood: fallbackReaction.mood,
      catSpeech: fallbackReaction.catSpeech,
      advice: fallbackReaction.advice,
      stylingTip:
        validation.status === 'PASSED'
          ? 'Thử phối cùng một đôi chunky sneaker trắng hoặc túi tote chàm thổ cẩm để tạo điểm nhấn High-Street Gen Z cá tính!'
          : 'Hãy chỉnh lại vạt áo Hữu Nhậm hoặc bổ sung quần lụa dài trước khi tiếp tục mix-match phụ kiện nhé sen!',
      heritageScore: validation.score,
      status: validation.status
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
