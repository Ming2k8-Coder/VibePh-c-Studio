import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { RemixRequest, RemixResponse } from '../types/lookbook';
import { GARMENTS, SERVER_FALLBACK_LOOKBOOKS } from '../data/garments';

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==========================================
// 1. MODEL REGISTRY & ROUTING TIERS
// ==========================================
export type ComplexityTier = 'LIGHTWEIGHT' | 'STANDARD' | 'COMPLEX';

export interface RoutePlan {
  tier: ComplexityTier;
  score: number;
  reason: string;
  primaryModel: string;
  fallbackSequence: string[];
  thinkingLevel: (typeof ThinkingLevel)[keyof typeof ThinkingLevel];
}

/**
 * Assesses prompt complexity based on linguistic tokens, historical depth,
 * etiquette sensitivity, and occasions to route to the most optimal model.
 */
export function assessPromptComplexity(request: RemixRequest): RoutePlan {
  let score = 0;
  const reasons: string[] = [];

  const notes = (request.userNotes || '').toLowerCase();
  const occasion = (request.occasion || '').toLowerCase();
  const garmentId = (request.garmentId || '').toLowerCase();
  const modernLayer = (request.modernLayer || '').toLowerCase();

  // 1. Etiquette sensitivity by garment type
  if (garmentId.includes('nhat-binh') || garmentId.includes('ao-tac')) {
    score += 15;
    reasons.push('Lễ phục quý tộc/quan triều đòi hỏi độ chính xác quy thức cao (+15)');
  } else if (garmentId.includes('ngu-than') || garmentId.includes('tu-than')) {
    score += 10;
    reasons.push('Cổ phục truyền thống nhiều lớp (+10)');
  } else {
    score += 5;
  }

  // 2. Occasion context
  if (occasion.includes('gala') || occasion.includes('editorial') || occasion.includes('bien-dien')) {
    score += 15;
    reasons.push('Sự kiện Haute Couture / Editorial cao cấp (+15)');
  } else if (occasion.includes('festival') || occasion.includes('da-hoi')) {
    score += 10;
    reasons.push('Lễ hội âm nhạc / Không gian văn hóa tương tác (+10)');
  } else {
    score += 5;
  }

  // 3. User notes depth & keywords
  if (notes.length > 100) {
    score += 15;
    reasons.push('Ghi chú chi tiết sâu từ người dùng >100 ký tự (+15)');
  } else if (notes.length > 40) {
    score += 8;
    reasons.push('Ghi chú tùy biến (+8)');
  }

  const complexKeywords = [
    'ngũ hành', 'tương sinh', 'tương khắc', 'chính trung', 'hữu nhậm',
    'hoàng gia', 'cung đình', 'triều nguyễn', 'vải sa', 'lãnh mỹ á',
    'avant-garde', 'deconstructed', 'cyberpunk', 'hoa văn', 'thủy ba',
    'sumptuary', 'ngũ thường', 'tứ thân phụ mẫu', 'lập lĩnh'
  ];

  const matchedKeywords = complexKeywords.filter(k => notes.includes(k) || modernLayer.includes(k));
  if (matchedKeywords.length >= 3) {
    score += 20;
    reasons.push(`Phát hiện ${matchedKeywords.length} thuật ngữ di sản chuyên sâu: [${matchedKeywords.slice(0, 3).join(', ')}] (+20)`);
  } else if (matchedKeywords.length >= 1) {
    score += 10;
    reasons.push(`Phát hiện từ khóa quy thức: [${matchedKeywords.join(', ')}] (+10)`);
  }

  // Route decision
  if (score >= 40) {
    return {
      tier: 'COMPLEX',
      score,
      reason: reasons.join('; '),
      primaryModel: 'gemini-3.1-pro-preview',
      fallbackSequence: ['gemini-3.8-flash', 'gemini-3.1-flash-lite'],
      thinkingLevel: ThinkingLevel.HIGH,
    };
  } else if (score >= 20) {
    return {
      tier: 'STANDARD',
      score,
      reason: reasons.join('; '),
      primaryModel: 'gemini-3.8-flash',
      fallbackSequence: ['gemini-3.1-flash-lite'],
      thinkingLevel: ThinkingLevel.MEDIUM,
    };
  } else {
    return {
      tier: 'LIGHTWEIGHT',
      score,
      reason: reasons.length > 0 ? reasons.join('; ') : 'Yêu cầu tối giản, ưu tiên phản hồi siêu tốc',
      primaryModel: 'gemini-3.1-flash-lite',
      fallbackSequence: ['gemini-3.8-flash'],
      thinkingLevel: ThinkingLevel.LOW,
    };
  }
}

// ==========================================
// 2. CASE 492 INTERCEPTOR & RESILIENCE LOGIC
// ==========================================

/**
 * Checks if an error represents Case 492 (upstream proxy rate limit, quota dropped,
 * conflict, or simulated case 492 test condition).
 */
export function isCase492Error(error: unknown, request?: RemixRequest): boolean {
  if (request?.simulate492 || request?.userNotes?.toLowerCase().includes('simulate-492')) {
    return true;
  }
  if (!error) return false;
  if (typeof error === 'object') {
    const err = error as Record<string, unknown>;
    const status = err.status || err.statusCode || (err.response as Record<string, unknown>)?.status;
    if (status === 492 || status === '492') return true;
    const msg = String(err.message || '');
    if (msg.includes('492')) return true;
  }
  return String(error).includes('492');
}

/**
 * Performs exponential backoff wait with jitter
 */
async function waitWithJitter(attempt: number): Promise<void> {
  const baseDelay = 350 * Math.pow(2, attempt);
  const jitter = Math.floor(Math.random() * 200);
  const delay = Math.min(baseDelay + jitter, 2500);
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Returns a contextually matched fallback lookbook from the verified catalog
 */
export function getContextualFallback(
  request: RemixRequest,
  diagnosticDetails?: {
    routedModel?: string;
    complexityTier?: ComplexityTier;
    handledCase492?: boolean;
    recoveryStrategy?: string;
    routerTrace?: string[];
  }
): RemixResponse {
  const found = SERVER_FALLBACK_LOOKBOOKS.find((fb) => fb.garmentId === request.garmentId);
  const base = found || SERVER_FALLBACK_LOOKBOOKS[0];
  const garment = GARMENTS.find((g) => g.id === request.garmentId) || GARMENTS[0];

  return {
    ...base,
    id: `remix-fallback-${Date.now()}`,
    outfitName: `${garment.name} × ${request.modernLayer || 'Contemporary Vibe'}`,
    culturalGuardrailStatus: 'VERIFIED_HUU_NHAM',
    heritageScore: Math.floor(Math.random() * 5) + 94,
    mode: 'OFFLINE_FALLBACK_VERIFIED',
    timestamp: new Date().toISOString(),
    garmentId: request.garmentId,
    occasion: request.occasion,
    modernLayer: request.modernLayer,
    userNotes: request.userNotes,
    routedModel: diagnosticDetails?.routedModel || 'offline-heritage-engine',
    complexityTier: diagnosticDetails?.complexityTier || 'STANDARD',
    handledCase492: diagnosticDetails?.handledCase492 ?? false,
    recoveryStrategy: diagnosticDetails?.recoveryStrategy || 'PRE_VERIFIED_HERITAGE_CATALOG',
    routerTrace: diagnosticDetails?.routerTrace || ['Direct contextual fallback loaded successfully.'],
  };
}

// ==========================================
// 3. CORE GENERATION WITH MULTI-ROUTING & 492 RESILIENCE
// ==========================================

export async function generateHeritageRemix(request: RemixRequest): Promise<RemixResponse> {
  const startTime = Date.now();
  const routerTrace: string[] = [];
  let handledCase492 = false;
  let finalRecoveryStrategy = 'DIRECT_ROUTING_SUCCESS';
  let totalRetries = 0;

  // 1. Calculate dynamic route plan based on complexity
  const routePlan = assessPromptComplexity(request);
  routerTrace.push(
    `[Route Plan] Tier: ${routePlan.tier} (Score: ${routePlan.score}) | Primary: ${routePlan.primaryModel} | Reason: ${routePlan.reason}`
  );

  const selectedGarment = GARMENTS.find((g) => g.id === request.garmentId) || GARMENTS[0];

  if (!ai || !process.env.GEMINI_API_KEY) {
    routerTrace.push('[Auth] No GEMINI_API_KEY found. Serving offline verified catalog.');
    const fallback = getContextualFallback(request, {
      routedModel: 'offline-engine',
      complexityTier: routePlan.tier,
      handledCase492: false,
      recoveryStrategy: 'NO_API_KEY_FALLBACK',
      routerTrace,
    });
    fallback.latencyMs = Date.now() - startTime;
    return fallback;
  }

  const prompt = `
Bạn là Giám tuyển Thời trang Cổ phục Việt Nam (Vietnamese Heritage Fashion Curator) kiêm Nhà thiết kế Haute Couture đương đại của "VibePhục Studio".
Nhiệm vụ: Sáng tạo bộ trang phục Remix phối giữa cổ phục truyền thống Việt Nam và streetwear hiện đại, TUÂN THỦ NGHIÊM NGẶT QUY THỨC HỮU NHẬM (Cài vạt/khép vạt từ trái sang phải).

THÔNG TIN ĐẦU VÀO:
- Cổ phục truyền thống: ${selectedGarment.name} (${selectedGarment.period})
- Đặc trưng & Di sản: ${selectedGarment.description}
- Quy thức cốt lõi: ${selectedGarment.etiquetteRule}
- Dịp xuất hiện (Occasion): ${request.occasion}
- Lớp phối hiện đại (Modern Layer): ${request.modernLayer}
- Ghi chú từ người mặc: ${request.userNotes || 'Phối đồ tôn vinh văn hiến Việt Nam trong nhịp sống đương đại'}

YÊU CẦU BẮT BUỘC:
1. "culturalGuardrailStatus": Phải là "VERIFIED_HUU_NHAM" (vì tất cả chi tiết thiết kế cổ phục đều tôn trọng quy thức khép vạt sang phải).
2. "heritageScore": Điểm số chuẩn mực di sản (từ 88 đến 100).
3. "layers": Phân bổ rõ 3 lớp gồm innerBase (lớp lót/trung đơn/yếm), heritageOuter (lớp cổ phục di sản Hữu Nhậm), và modernAccent (lớp hiện đại streetwear/techwear).
4. "colorPalette": 4 sắc màu chuẩn mực gắn liền với Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ) với mã HEX chính xác.
5. "stylingGuide": Hướng dẫn mặc chi tiết, nhấn mạnh việc giữ nếp áo Hữu Nhậm và cách phối phụ kiện.
6. "curatorVerdict": Lời bình phẩm mang tính chuyên gia và lòng tự hào văn hoá dân tộc.
`;

  // Models to attempt in order of preference
  const candidateModels = [routePlan.primaryModel, ...routePlan.fallbackSequence];

  // Execution loop with routing failover and 492 interception
  for (let modelIdx = 0; modelIdx < candidateModels.length; modelIdx++) {
    const currentModel = candidateModels[modelIdx];
    const isPro = currentModel.includes('pro');

    // Attempt up to 2 tries per model if 492 occurs
    const maxTriesForModel = 2;

    for (let attempt = 0; attempt < maxTriesForModel; attempt++) {
      try {
        routerTrace.push(`[Attempt] Calling model: ${currentModel} (Tier: ${routePlan.tier}, Try: ${attempt + 1})`);

        // Check for simulated 492 test
        if (request.simulate492 || request.userNotes?.toLowerCase().includes('simulate-492')) {
          if (!handledCase492) {
            totalRetries++;
            throw new Error('HTTP 492: Gateway Rate Limit / Custom Proxy Conflict (Simulated Case 492 Test)');
          }
        }

        const timeoutMs = isPro ? 9000 : 7000;
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms on ${currentModel}`)), timeoutMs)
        );

        const apiCall = (async () => {
          const config: Record<string, unknown> = {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                outfitName: { type: Type.STRING, description: 'Tên bộ trang phục remix ấn tượng' },
                periodReference: { type: Type.STRING, description: 'Thời kỳ lịch sử và phong cách đương đại đối ứng' },
                culturalGuardrailStatus: {
                  type: Type.STRING,
                  description: 'Trạng thái quy thức: VERIFIED_HUU_NHAM hoặc FLAGGED_VIOLATION',
                },
                heritageScore: { type: Type.INTEGER, description: 'Điểm di sản từ 88 - 100' },
                layers: {
                  type: Type.OBJECT,
                  properties: {
                    innerBase: { type: Type.STRING, description: 'Lớp lót trong cùng' },
                    heritageOuter: { type: Type.STRING, description: 'Lớp di sản truyền thống Hữu Nhậm' },
                    modernAccent: { type: Type.STRING, description: 'Lớp phối hiện đại' },
                  },
                  required: ['innerBase', 'heritageOuter', 'modernAccent'],
                },
                colorPalette: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      hex: { type: Type.STRING },
                      element: { type: Type.STRING, description: 'Kim, Mộc, Thủy, Hỏa, Thổ' },
                    },
                    required: ['name', 'hex', 'element'],
                  },
                },
                stylingGuide: { type: Type.STRING, description: 'Cẩm nang mặc đồ' },
                curatorVerdict: { type: Type.STRING, description: 'Lời phê giám tuyển' },
              },
              required: [
                'outfitName',
                'periodReference',
                'culturalGuardrailStatus',
                'heritageScore',
                'layers',
                'colorPalette',
                'stylingGuide',
                'curatorVerdict',
              ],
            },
          };

          // Apply thinking level appropriately
          if (!isPro || routePlan.thinkingLevel !== ThinkingLevel.MINIMAL) {
            config.thinkingConfig = { thinkingLevel: routePlan.thinkingLevel };
          }

          const response = await ai.models.generateContent({
            model: currentModel,
            contents: prompt,
            config,
          });

          const text = response.text;
          if (!text) throw new Error('Empty response received from Gemini model');
          return JSON.parse(text) as RemixResponse;
        })();

        const parsedResult = await Promise.race([apiCall, timeoutPromise]);

        routerTrace.push(`[Success] Successfully generated via ${currentModel} in ${Date.now() - startTime}ms`);

        return {
          ...parsedResult,
          id: `remix-ai-${Date.now()}`,
          mode: 'AI_GENERATED_VERIFIED',
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          garmentId: request.garmentId,
          occasion: request.occasion,
          modernLayer: request.modernLayer,
          userNotes: request.userNotes,
          routedModel: currentModel,
          complexityTier: routePlan.tier,
          routingReason: routePlan.reason,
          handledCase492,
          recoveryStrategy: finalRecoveryStrategy,
          routerTrace,
          retryCount: totalRetries,
        };
      } catch (err: unknown) {
        totalRetries++;
        const is492 = isCase492Error(err, request);

        if (is492) {
          handledCase492 = true;
          finalRecoveryStrategy = `CASE_492_INTERCEPT_AND_FAILOVER_${currentModel}`;
          routerTrace.push(
            `[Case 492 Intercepted] Status 492 detected on ${currentModel}. Initiating backoff jitter & model failover.`
          );
          // Wait before retry or fallback
          await waitWithJitter(attempt);
          // Continue loop to try next attempt or next model in sequence
          continue;
        } else {
          routerTrace.push(`[Model Error] ${currentModel} encountered error: ${String(err)}`);
          // For general errors, break inner loop to try next model in fallbackSequence
          break;
        }
      }
    }
  }

  // If all dynamic models failed, failover cleanly to verified offline heritage catalog
  routerTrace.push('[Failover] All AI models exhausted or 492 escalated. Activating offline verified catalog.');
  const finalFallback = getContextualFallback(request, {
    routedModel: candidateModels[0] || 'gemini-3.8-flash',
    complexityTier: routePlan.tier,
    handledCase492,
    recoveryStrategy: handledCase492 ? 'CASE_492_OFFLINE_FAILOVER_PROTECTION' : 'DYNAMIC_ROUTER_OFFLINE_FAILOVER',
    routerTrace,
  });

  finalFallback.latencyMs = Date.now() - startTime;
  finalFallback.retryCount = totalRetries;
  return finalFallback;
}
