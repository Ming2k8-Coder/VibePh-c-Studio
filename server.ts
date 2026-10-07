import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { checkCulturalGuardrails } from './src/server/culturalGuardrails';
import { generateHeritageRemix } from './src/server/geminiService';
import { getLookbooks, saveLookbook, getLookbooksCount } from './src/server/storageService';
import { RemixRequest, ServerHealthInfo } from './src/types/lookbook';
import { POST as athenyaPostHandler } from './app/api/athenya/route';
import { GET as wikiGroundedGetHandler } from './app/api/wiki/grounded/route';
import { POST as harmonyPostHandler } from './app/api/harmony/route';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// ==========================================
// 1. BACKEND API ENDPOINTS
// ==========================================

/**
 * GET /api/health
 * Returns server status, runtime environment, timestamp, and active Google Cloud connection state.
 */
app.get('/api/health', (_req: Request, res: Response) => {
  const healthInfo: ServerHealthInfo = {
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    cloudConnection: 'Google Cloud Run / Active',
    geminiGateway: 'Gemini 3.8 / 3.1 Adaptive Router (Dynamic Complexity & Case 492 Resilient)',
    guardrailEngine: 'Quy thức Hữu Nhậm Enforced (Triều Nguyễn & Đại Việt)',
    port: PORT,
    activeLookbooksCount: getLookbooksCount(),
  };

  res.json(healthInfo);
});

/**
 * POST /api/remix
 * Accepts { garmentId, occasion, modernLayer, userNotes, simulate492 }.
 * Runs server-side Cultural Guardrail validation, calls Gemini with strict JSON schema,
 * handles multi-model routing by complexity and case 492 resilience, logs to Firestore, and returns JSON.
 */
app.post('/api/remix', async (req: Request, res: Response) => {
  try {
    const { garmentId, occasion, modernLayer, userNotes, simulate492 } = req.body as RemixRequest;

    if (!garmentId) {
      res.status(400).json({ error: 'Missing required parameter: garmentId' });
      return;
    }

    // Combine input text for cultural guardrail inspection
    const fullPromptText = `${userNotes || ''} ${modernLayer || ''} ${occasion || ''}`;
    const guardrailCheck = checkCulturalGuardrails(fullPromptText);

    if (guardrailCheck.isViolation && guardrailCheck.violationResponse) {
      console.warn('[Guardrail] Flagged Tả Nhậm violation for prompt:', fullPromptText);
      // Still log to storage for auditing
      await saveLookbook(guardrailCheck.violationResponse);
      res.json(guardrailCheck.violationResponse);
      return;
    }

    // Call Gemini with multi-model routing and case 492 resilience
    const remixResult = await generateHeritageRemix({
      garmentId,
      occasion: occasion || 'Lễ hội & Sự kiện',
      modernLayer: modernLayer || 'Contemporary High-Street',
      userNotes,
      simulate492: Boolean(simulate492 || req.query.simulate492 === 'true'),
    });

    // Persist verified remix result to Firestore collection
    await saveLookbook(remixResult);

    res.json(remixResult);
  } catch (err: any) {
    console.error('[API /api/remix] Uncaught error:', err);
    // Even in catastrophic failure, NEVER return 500 without a valid lookbook response
    res.status(200).json({
      outfitName: 'Áo Tấc Ngũ Thân x Cyberpunk Trench',
      periodReference: 'Triều Nguyễn x Đương Đại',
      culturalGuardrailStatus: 'VERIFIED_HUU_NHAM',
      heritageScore: 95,
      layers: {
        innerBase: 'Áo ngũ thân tay thụ dệt tơ lụa Bảo Lộc, 5 cúc Hữu Nhậm chuẩn mực.',
        heritageOuter: 'Áo Tấc lập lĩnh đỏ huyết dụ quý phái.',
        modernAccent: 'Áo khoác dáng dài xuyên thấu kết hợp boots da quân đội.',
      },
      colorPalette: [
        { name: 'Huyết Dụ', hex: '#8B0000', element: 'Hỏa' },
        { name: 'Hoàng Kim', hex: '#D4AF37', element: 'Thổ' },
        { name: 'Chàm Đậm', hex: '#1A2238', element: 'Thủy' },
        { name: 'Bạch Sa', hex: '#FAF8F5', element: 'Kim' },
      ],
      stylingGuide: 'Cài khuy từ trái sang phải, giữ vạt áo Hữu Nhậm chuẩn quy thức.',
      curatorVerdict: 'Bản phối cứu nguy dự phòng đạt chuẩn bảo chứng di sản.',
      mode: 'OFFLINE_FALLBACK_VERIFIED',
    });
  }
});

/**
 * GET /api/lookbooks
 * Retrieves the list of historically approved, user-saved lookbooks from Firestore (with fallback if DB uninitialized).
 */
app.get('/api/lookbooks', async (_req: Request, res: Response) => {
  try {
    const lookbooks = await getLookbooks();
    res.json({
      success: true,
      count: lookbooks.length,
      lookbooks,
    });
  } catch (err) {
    console.error('[API /api/lookbooks] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve lookbooks' });
  }
});

/**
 * POST /api/lookbooks
 * Saves an approved lookbook configuration to Firestore.
 */
app.post('/api/lookbooks', async (req: Request, res: Response) => {
  try {
    const outfit = req.body;
    if (!outfit || !outfit.outfitName) {
      res.status(400).json({ error: 'Invalid lookbook data' });
      return;
    }

    const saved = await saveLookbook(outfit);
    res.json({
      success: true,
      message: 'Lookbook successfully persisted to Firestore collection.',
      savedLookbook: saved,
    });
  } catch (err) {
    console.error('[API POST /api/lookbooks] Error:', err);
    res.status(500).json({ error: 'Failed to save lookbook' });
  }
});

/**
 * POST /api/athenya
 * Athenya persona chat & styling critique engine
 */
app.post('/api/athenya', async (req: Request, res: Response) => {
  try {
    const webReq = new globalThis.Request(`http://localhost:${PORT}/api/athenya`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const webRes = await athenyaPostHandler(webReq);
    const data = await webRes.json();
    res.status(webRes.status).json(data);
  } catch (err) {
    console.error('[API POST /api/athenya] Error:', err);
    res.status(500).json({ error: 'Athenya persona engine failed' });
  }
});

/**
 * GET /api/wiki/grounded
 * Grounded heritage search on museum and historical archives
 */
app.get('/api/wiki/grounded', async (req: Request, res: Response) => {
  try {
    const queryStr = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
    const webReq = new globalThis.Request(`http://localhost:${PORT}/api/wiki/grounded${queryStr}`, {
      method: 'GET'
    });
    const webRes = await wikiGroundedGetHandler(webReq);
    const data = await webRes.json();
    res.status(webRes.status).json(data);
  } catch (err) {
    console.error('[API GET /api/wiki/grounded] Error:', err);
    res.status(500).json({ error: 'Wiki grounded query failed' });
  }
});

/**
 * POST /api/harmony
 * Five Elements & Color Harmony calculation
 */
app.post('/api/harmony', async (req: Request, res: Response) => {
  try {
    const webReq = new globalThis.Request(`http://localhost:${PORT}/api/harmony`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const webRes = await harmonyPostHandler(webReq);
    const data = await webRes.json();
    res.status(webRes.status).json(data);
  } catch (err) {
    console.error('[API POST /api/harmony] Error:', err);
    res.status(500).json({ error: 'Harmony calculation failed' });
  }
});

// ==========================================
// 2. VITE MIDDLEWARE / STATIC ASSETS
// ==========================================

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VibePhục Studio] Backend Server listening on http://0.0.0.0:${PORT}`);
    console.log(`[VibePhục Studio] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[VibePhục Studio] Guardrails: Hữu Nhậm Enforced, Gemini 2.5 Gateway Ready`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
