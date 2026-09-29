export type CulturalGuardrailStatus = 'VERIFIED_HUU_NHAM' | 'FLAGGED_VIOLATION';

export type FiveElement = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';

export interface ColorSwatch {
  name: string;
  hex: string;
  element: FiveElement | string;
  symbolicMeaning?: string;
}

export interface OutfitLayers {
  innerBase: string;
  heritageOuter: string;
  modernAccent: string;
}

export interface RemixResponse {
  id?: string;
  outfitName: string;
  periodReference: string;
  culturalGuardrailStatus: CulturalGuardrailStatus;
  heritageScore: number;
  layers: OutfitLayers;
  colorPalette: ColorSwatch[];
  stylingGuide: string;
  curatorVerdict: string;
  // Execution metadata
  culturalNotes?: string;
  mode?: 'AI_GENERATED_VERIFIED' | 'OFFLINE_FALLBACK_VERIFIED' | 'GUARDRAIL_INTERCEPT';
  latencyMs?: number;
  timestamp?: string;
  createdAt?: string;
  savedAt?: string;
  garmentId?: string;
  heritageIntegrityScore?: number;
  coreGarment?: {
    name: string;
    period: string;
    historicalContext: string;
    keyFeatures: string[];
  };
  modernElement?: {
    name: string;
    category: string;
    stylingApproach: string;
    harmonicReasoning: string;
  };
  stylingTips?: string[];
  culturalEtiquetteCertified?: boolean;
  occasion?: string;
  modernLayer?: string;
  userNotes?: string;
  // Multi-Model Routing & Resilience Diagnostics
  routedModel?: string;
  complexityTier?: 'LIGHTWEIGHT' | 'STANDARD' | 'COMPLEX';
  routingReason?: string;
  handledCase492?: boolean;
  recoveryStrategy?: string;
  routerTrace?: string[];
  retryCount?: number;
}

export interface RemixRequest {
  garmentId: string;
  occasion: string;
  modernLayer: string;
  userNotes?: string;
  simulate492?: boolean;
}

export interface LookbookRecord extends RemixResponse {
  id: string;
  createdAt: string;
  savedAt?: string;
}

export interface GarmentInfo {
  id: string;
  name: string;
  vietnameseName: string;
  period: string;
  subType?: string;
  silhouette: string;
  description: string;
  etiquetteRule: string;
  originDetails: string;
  symbolism: string;
  tag: string;
  suggestedPalettes: ColorSwatch[];
  imageUrl?: string;
}

export interface ServerHealthInfo {
  status: string;
  environment: string;
  timestamp: string;
  cloudConnection: string;
  geminiGateway: string;
  guardrailEngine: string;
  port: number;
  activeLookbooksCount: number;
}
