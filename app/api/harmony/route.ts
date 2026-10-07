/**
 * VibePhục Studio — Five Elements (Ngũ Hành) & Color Harmony Engine (Next.js Route Handler)
 * Route: POST /api/harmony
 * Analyzes Eastern Five Elements balance (Tương Sinh - Tương Khắc) and traditional Vietnamese palettes.
 */

import { Type } from '@google/genai';
import { geminiClient } from '../../../lib/gemini';
import { HarmonyElement, OutfitState } from '../../../types/vibephuc';

export interface HarmonyRequestBody {
  colors?: string[];
  outfit?: OutfitState;
  outfitName?: string;
  occasion?: string;
}

export interface ElementAnalysisItem {
  colorHex: string;
  element: HarmonyElement | string;
  meaning: string;
}

export interface GeneratingPair {
  from: string;
  to: string;
  description: string;
}

export interface OvercomingPair {
  from: string;
  to: string;
  warning: string;
}

export interface HarmonyResponseBody {
  harmonyScore: number;
  dominantElement: HarmonyElement | string;
  elementBreakdown: ElementAnalysisItem[];
  generatingPairs: GeneratingPair[];
  overcomingPairs: OvercomingPair[];
  analysis: string;
  advice: string;
  colorBalanceRecommendations: string[];
}

/**
 * Heuristic mapping from Hex to Eastern Five Elements
 */
function mapHexToElement(hex: string): { element: HarmonyElement; meaning: string } {
  const cleanHex = hex.replace('#', '').toUpperCase();
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;

  // White / Silver / Grey / Pale -> Kim
  if (r > 200 && g > 200 && b > 200) {
    return { element: 'KIM', meaning: 'Hành Kim (Bạch kim, tơ tằm thanh khiết, đức nghĩa kiên định)' };
  }
  // Black / Deep Blue / Navy -> Thủy
  if (r < 60 && g < 80 && b > 100) {
    return { element: 'THUY', meaning: 'Hành Thủy (Lam chàm sông nước, trí tuệ uyển chuyển, thâm trầm)' };
  }
  if (r < 50 && g < 50 && b < 50) {
    return { element: 'THUY', meaning: 'Hành Thủy (Đen tuyền Lãnh Mỹ Á, vực sâu bao la tĩnh lặng)' };
  }
  // Green / Cyan -> Mộc
  if (g > r + 30 && g > b) {
    return { element: 'MOC', meaning: 'Hành Mộc (Xanh lục ngọc bích, cỏ cây sinh sôi, lòng nhân ái)' };
  }
  // Red / Magenta / Purple -> Hỏa
  if (r > 160 && g < 90) {
    return { element: 'HOA', meaning: 'Hành Hỏa (Đỏ son chu sa, nhiệt huyết, quang minh chính đại)' };
  }
  // Yellow / Brown / Ochre -> Thổ
  if (r > 150 && g > 110 && b < 100) {
    return { element: 'THO', meaning: 'Hành Thổ (Vàng hoàng thổ, đất mẹ bao dung, tín nghĩa bền vững)' };
  }

  // Default fallback to Mộc
  return { element: 'MOC', meaning: 'Hành Mộc (Sắc tự nhiên hài hòa)' };
}

export async function POST(request: Request): Promise<Response> {
  let body: HarmonyRequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Extract color hex array from body
  let colorList: string[] = [];
  if (body.colors && Array.isArray(body.colors) && body.colors.length > 0) {
    colorList = body.colors;
  } else if (body.outfit?.customColors) {
    colorList = Object.values(body.outfit.customColors);
  }

  if (colorList.length === 0) {
    colorList = ['#C53030', '#D69E2E', '#1E3A8A', '#F8FAFC']; // Curated classic baseline
  }

  // Compute baseline elemental mapping
  const elementalBreakdown: ElementAnalysisItem[] = colorList.map(hex => {
    const info = mapHexToElement(hex);
    return {
      colorHex: hex,
      element: info.element,
      meaning: info.meaning
    };
  });

  const prompt = `
Bạn là bậc thầy triết học Đông Phương và chuyên gia hòa sắc di sản Việt Nam.
Hãy phân tích ngũ hành tương sinh, tương khắc và thẩm mỹ hòa sắc truyền thống của bảng màu sau:
- Danh sách màu: ${colorList.join(', ')}
- Tên bộ đồ: ${body.outfitName || 'Cổ phục đương đại VibePhục'}
- Bối cảnh diện: ${body.occasion || 'Trang trọng & xuống phố'}

Quy luật Ngũ Hành cốt lõi:
- Tương sinh: Mộc sinh Hỏa, Hỏa sinh Thổ, Thổ sinh Kim, Kim sinh Thủy, Thủy sinh Mộc.
- Tương khắc: Mộc khắc Thổ, Thổ khắc Thủy, Thủy khắc Hỏa, Hỏa khắc Kim, Kim khắc Mộc.
- Các phối màu kinh điển Việt Nam: Tím Huế x Bạch Lụa, Nâu non x Hoa lý, Đỏ son x Hoa hòe, Đen Lãnh Mỹ Á x Chỉ Hoàng.

Hãy đánh giá và xuất ra JSON chuẩn xác theo cấu trúc yêu cầu.
`;

  try {
    if (!geminiClient) {
      throw new Error('GEMINI_API_KEY is not configured on the server');
    }

    const response = await geminiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Bạn là chuyên gia tư vấn hòa sắc Ngũ Hành Phương Đông của VibePhục Studio. ' +
          'Hãy phân tích sâu sắc các cặp tương sinh, tương khắc và đưa ra lời khuyên điều hòa năng lượng màu sắc chuẩn xác, tinh tế.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            harmonyScore: {
              type: Type.NUMBER,
              description: 'Điểm cân bằng hòa sắc ngũ hành từ 0 đến 100'
            },
            dominantElement: {
              type: Type.STRING,
              description: "Hành chủ đạo chiếm ưu thế: 'KIM' | 'MOC' | 'THUY' | 'HOA' | 'THO'"
            },
            elementBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  colorHex: { type: Type.STRING },
                  element: { type: Type.STRING },
                  meaning: { type: Type.STRING }
                },
                required: ['colorHex', 'element', 'meaning']
              }
            },
            generatingPairs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  from: { type: Type.STRING },
                  to: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['from', 'to', 'description']
              }
            },
            overcomingPairs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  from: { type: Type.STRING },
                  to: { type: Type.STRING },
                  warning: { type: Type.STRING }
                },
                required: ['from', 'to', 'warning']
              }
            },
            analysis: {
              type: Type.STRING,
              description: 'Phân tích tổng thể về dòng chảy năng lượng âm dương ngũ hành'
            },
            advice: {
              type: Type.STRING,
              description: 'Lời khuyên điều hòa sắc thái tôn vinh thần thái người mặc'
            },
            colorBalanceRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Gợi ý các phụ kiện hoặc màu sắc trung gian giúp hóa giải xung khắc'
            }
          },
          required: [
            'harmonyScore',
            'dominantElement',
            'elementBreakdown',
            'generatingPairs',
            'overcomingPairs',
            'analysis',
            'advice',
            'colorBalanceRecommendations'
          ]
        }
      }
    });

    const parsed: HarmonyResponseBody = JSON.parse(response.text?.trim() || '{}');
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.warn('[Harmony API] Gemini call failed or offline, returning deterministic fallback:', error);

    // Deterministic fallback response
    const fallbackResponse: HarmonyResponseBody = {
      harmonyScore: 92,
      dominantElement: elementalBreakdown[0]?.element || 'THO',
      elementBreakdown: elementalBreakdown,
      generatingPairs: [
        {
          from: 'THUY (Chàm sẫm)',
          to: 'MOC (Xanh lục ngọc)',
          description: 'Thủy dưỡng Mộc: Nước nguồn trong trẻo tưới tắm mầm xanh di sản vươn dậy.'
        },
        {
          from: 'HOA (Đỏ chu sa)',
          to: 'THO (Vàng hoàng thổ)',
          description: 'Hỏa sinh Thổ: Ngọn lửa văn hiến tôi luyện nên mảnh đất trù phú vững chãi.'
        }
      ],
      overcomingPairs: [],
      analysis:
        'Bảng màu mang cấu trúc tương sinh bền vững, hòa trộn giữa sắc son cung đình và lam chàm dân dã, tái hiện khí sắc uyển chuyển của các bức tranh Hàng Trống và gấm vóc cung đình xưa.',
      advice:
        'Bản phối đạt trạng thái ngũ hành tương sinh êm dịu, giúp người mặc toát lên phong thái điềm tĩnh, đĩnh đạc và cuốn hút.',
      colorBalanceRecommendations: [
        'Giữ nguyên tông nền đen than hoặc bạch tơ tằm để làm bệ đỡ cho các sắc màu chính.',
        'Có thể điểm xuyết thêm một chiếc kiềng bạc (hành Kim) để hoàn tất vòng tuần hoàn ngũ hành khép kín.'
      ]
    };

    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
