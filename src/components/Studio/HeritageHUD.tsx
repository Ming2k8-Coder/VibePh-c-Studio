import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Wand2, 
  CheckCircle2, 
  XCircle, 
  Info, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { HeritageValidationResult } from '../../types/heritage';

interface HeritageHUDProps {
  validationResult: HeritageValidationResult;
  onAutoFix: () => void;
  onOpenHeritageGuide?: () => void;
}

export const HeritageHUD: React.FC<HeritageHUDProps> = ({
  validationResult,
  onAutoFix,
  onOpenHeritageGuide,
}) => {
  const { score, isValid, violations, badges } = validationResult;

  // Determine score color & ring circumference
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const scoreColor = score >= 90 
    ? '#00F5D4' // Cyber Jade
    : score >= 70 
    ? '#D69E2E' // Heritage Hoàng
    : '#C53030'; // Heritage Sơn (Danger)

  return (
    <div className="w-full space-y-3">
      {/* Top Glassmorphic HUD Bar */}
      <div className="w-full bg-obsidian-800/80 backdrop-blur-organza border border-white/10 rounded-m3-lg p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Energy Ring HIS Score Indicator */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 70 70">
              {/* Background Track */}
              <circle
                cx="35"
                cy="35"
                r={radius}
                stroke="#22262F"
                strokeWidth="5"
                fill="transparent"
              />
              {/* Animated Progress Track */}
              <motion.circle
                cx="35"
                cy="35"
                r={radius}
                stroke={scoreColor}
                strokeWidth="5.5"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: score >= 90 
                    ? 'drop-shadow(0 0 6px rgba(0,245,212,0.6))'
                    : score < 70 
                    ? 'drop-shadow(0 0 6px rgba(197,48,48,0.7))'
                    : 'drop-shadow(0 0 6px rgba(214,158,46,0.6))',
                }}
              />
            </svg>

            {/* Centered Score Number */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-bold font-mono tracking-tighter" style={{ color: scoreColor }}>
                {score}%
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                Heritage Integrity Score (HIS)
              </span>
              {onOpenHeritageGuide && (
                <button 
                  onClick={onOpenHeritageGuide} 
                  className="text-neutral-400 hover:text-white transition-colors"
                  title="Tìm hiểu bộ tiêu chuẩn di sản"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-sm font-bold font-imperial text-white">
                {score >= 90 ? 'Di Sản Hoàn Hảo' : score >= 70 ? 'Cảnh Báo Lệch Chuẩn' : 'Vi Phạm Đại Kỵ'}
              </h3>
              <span className={`text-[10px] px-2 py-0.5 rounded-m3-full font-mono font-bold ${
                isValid ? 'bg-cyber-jade/20 text-cyber-jade border border-cyber-jade/40' : 'bg-heritage-son/20 text-rose-300 border border-heritage-son/40'
              }`}>
                {isValid ? 'AUTHENTIC APPROVED' : 'NEEDS CALIBRATION'}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Dynamic Status Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
          {/* Badge 1: Hữu Nhậm */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-m3-full text-xs font-mono font-medium transition-all ${
            badges.huuNhamVerified
              ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/80 border border-rose-500/60 text-rose-300 animate-pulse shadow-rule-error'
          }`}>
            {badges.huuNhamVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
            <span>{badges.huuNhamVerified ? '✓ Hữu Nhậm (Chuẩn)' : '✕ Tả Nhậm (Đại Kỵ)'}</span>
          </div>

          {/* Badge 2: 5 Cúc Ngũ Thường */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-m3-full text-xs font-mono font-medium transition-all ${
            badges.buttonCountVerified
              ? 'bg-amber-950/60 border border-heritage-hoang/40 text-amber-300'
              : 'bg-rose-950/70 border border-rose-500/50 text-rose-300'
          }`}>
            {badges.buttonCountVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
            <span>{badges.buttonCountVerified ? '✓ 5 Cúc Chuẩn' : '✕ Sai Số Cúc'}</span>
          </div>

          {/* Badge 3: Sống lưng Chính Trung */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-m3-full text-xs font-mono font-medium transition-all ${
            badges.chinhTrungVerified
              ? 'bg-blue-950/60 border border-blue-500/40 text-blue-300'
              : 'bg-neutral-800/80 border border-white/10 text-neutral-400'
          }`}>
            {badges.chinhTrungVerified ? <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> : <XCircle className="w-3.5 h-3.5 text-neutral-400" />}
            <span>{badges.chinhTrungVerified ? '✓ Sống Lưng Chính Trung' : '○ Chưa Ráp Sống'}</span>
          </div>

          {/* Badge 4: Chống Đồng Hóa Văn Hóa */}
          <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-m3-full text-xs font-mono font-medium transition-all ${
            badges.noCrossConflation
              ? 'bg-purple-950/60 border border-purple-500/40 text-purple-300'
              : 'bg-rose-950/80 border border-rose-500/60 text-rose-300'
          }`}>
            {badges.noCrossConflation ? <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> : <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
            <span>{badges.noCrossConflation ? '✓ Thuần Việt' : '✕ Lai Tạp Ngoại Lai'}</span>
          </div>
        </div>

        {/* Right: Quick Action / Auto-Fix button */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {!isValid && (
            <button
              onClick={onAutoFix}
              className="w-full md:w-auto px-4 py-2 rounded-m3-full bg-heritage-hoang hover:bg-amber-400 text-black font-semibold text-xs transition-all shadow-heritage-glow flex items-center justify-center gap-2 cursor-pointer hover:scale-105"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Tự Động Sửa Chuẩn (Auto-Fix)
            </button>
          )}

          {isValid && (
            <div className="flex items-center gap-1.5 text-xs text-cyber-jade font-mono bg-cyber-jade/10 px-3 py-1.5 rounded-m3-full border border-cyber-jade/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sẵn sàng xuất Lookbook</span>
            </div>
          )}
        </div>
      </div>

      {/* Violation Alert Banner (Shown when HIS < 90%) */}
      <AnimatePresence>
        {!isValid && violations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-heritage-son/15 border-l-4 border-heritage-son rounded-r-m3-md p-3.5 backdrop-blur-organza shadow-rule-error">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-heritage-son/20 text-rose-300 mt-0.5">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-mono tracking-wide text-rose-200 uppercase">
                      Cảnh Báo Di Sản: {violations[0].title}
                    </h4>
                    <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                      {violations[0].message}
                    </p>
                    <div className="mt-2 text-xs font-medium text-amber-200 flex items-center gap-1.5">
                      <span className="text-neutral-400">Khắc phục đề xuất:</span>
                      <span>{violations[0].fixSuggestion}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onAutoFix}
                  className="flex-shrink-0 px-3 py-1.5 rounded-m3-md bg-heritage-son hover:bg-rose-700 text-white font-mono text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Wand2 className="w-3 h-3" />
                  Sửa ngay
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
