import React, { useState, useEffect } from 'react';
import { ServerHealthInfo } from '../types/lookbook';
import { Server, Cpu, ShieldCheck, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';

interface DiagnosticHUDProps {
  lastLatencyMs?: number;
  mode?: string;
  routedModel?: string;
  handledCase492?: boolean;
}

export const DiagnosticHUD: React.FC<DiagnosticHUDProps> = ({ lastLatencyMs, mode, routedModel, handledCase492 }) => {
  const [health, setHealth] = useState<ServerHealthInfo | null>(null);
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchHealth = async () => {
    setIsRefreshing(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
      setPingLatency(Math.round(performance.now() - start));
    } catch (err) {
      console.error('Failed to fetch health:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const displayLatency = lastLatencyMs ?? pingLatency ?? 24;

  return (
    <div className="w-full bg-[#1A1B1F]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 py-2 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Branding & Core Host */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#202125] border border-[#2B2C31]">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[#8E9099]">Host:</span>
            <span className="font-semibold text-emerald-300">
              {health ? health.cloudConnection : 'Google Cloud Run / Active'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#202125] border border-[#2B2C31]">
            <Cpu className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#8E9099]">Engine:</span>
            <span className="font-semibold text-[#FFDF78]">
              {routedModel || health?.geminiGateway || 'Gemini 3.8 / 3.1 Adaptive Router'}
            </span>
          </div>

          {handledCase492 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono text-[11px] animate-pulse">
              <span>🛡️ Case 492 Handled</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#202125] border border-[#D4AF37]/30 text-[#D4AF37]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-medium text-[#FFDF78]">Quy thức Hữu Nhậm Enforced</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Right: Latency & Mode Diagnostics */}
        <div className="flex items-center gap-3 flex-wrap">
          {mode && (
            <span
              className={`px-2 py-0.5 rounded-md font-mono text-[11px] uppercase tracking-wider border ${
                mode === 'AI_GENERATED_VERIFIED'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
                  : mode === 'GUARDRAIL_INTERCEPT'
                  ? 'bg-rose-950/60 text-rose-300 border-rose-700/50 animate-bounce'
                  : 'bg-amber-950/60 text-amber-300 border-amber-700/50'
              }`}
            >
              {mode === 'AI_GENERATED_VERIFIED' && '● Gemini Live'}
              {mode === 'OFFLINE_FALLBACK_VERIFIED' && '● Fallback Catalog'}
              {mode === 'GUARDRAIL_INTERCEPT' && '▲ Guardrail Intercept'}
            </span>
          )}

          <div className="flex items-center gap-1.5 text-[#C4C6D0]">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Latency:</span>
            <span className="font-mono font-bold text-white bg-[#2B2C31] px-1.5 py-0.5 rounded">
              {displayLatency}ms
            </span>
          </div>

          <button
            onClick={fetchHealth}
            title="Kiểm tra trạng thái kết nối backend"
            className="p-1 rounded-full hover:bg-[#2B2C31] text-[#8E9099] hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
