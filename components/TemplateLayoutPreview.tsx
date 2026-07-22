import React, { useState } from 'react';
import { Template } from '../types';
import { Layout, Eye, Code, Layers, Sparkles, Monitor } from 'lucide-react';

interface TemplateLayoutPreviewProps {
  template: Template;
  mode?: 'compact' | 'full';
  className?: string;
}

export const TemplateLayoutPreview: React.FC<TemplateLayoutPreviewProps> = ({
  template,
  mode = 'full',
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'schematic' | 'live'>('schematic');

  // Detect layout archetype from HTML/CSS structure
  const detectLayoutType = (html: string, css: string) => {
    const combined = (html + ' ' + css).toLowerCase();
    if (combined.includes('lbar') || (combined.includes('ticker') && combined.includes('side'))) {
      return 'L_BAR_TICKER';
    }
    if (combined.includes('split') || combined.includes('sidebar') || combined.includes('flex: 3') || combined.includes('flex: 7')) {
      return 'SPLIT_70_30';
    }
    if (combined.includes('grid') || combined.includes('menu')) {
      return 'GRID_MATRIX';
    }
    return 'FULLSCREEN_HUD';
  };

  const layoutType = detectLayoutType(template.html || '', template.css || '');

  // Generate populated HTML for live iframe sandbox
  const generateLiveHtml = () => {
    let populatedHtml = template.html || '';
    populatedHtml = populatedHtml.replace(/\{\{media\.url\}\}/g, 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80');
    populatedHtml = populatedHtml.replace(/\{\{media\.name\}\}/g, 'SUMMIT_KEYNOTE_2026');
    populatedHtml = populatedHtml.replace(/\{\{playlist\.name\}\}/g, 'GLOBAL_EXPO_LOOP');
    populatedHtml = populatedHtml.replace(/\{\{playerId\}\}/g, 'NODE_US_EAST_09');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 0; width: 100vw; height: 100vh; overflow: hidden; background: #000; color: #fff; font-family: system-ui, -apple-system, sans-serif; }
            ${template.css || ''}
          </style>
        </head>
        <body>
          ${populatedHtml}
          <script>${template.js || ''}</script>
        </body>
      </html>
    `;
  };

  if (mode === 'compact') {
    return (
      <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 group flex items-center justify-center ${className}`}>
        {/* SVG Mini Wireframe Schematic */}
        <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="mediaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ffc6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.25" />
            </linearGradient>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Canvas grid background */}
          <rect width="1920" height="1080" fill="#090a0f" />
          <rect width="1920" height="1080" fill="url(#gridPattern)" />

          {layoutType === 'FULLSCREEN_HUD' && (
            <>
              {/* Main Media Zone */}
              <rect x="40" y="40" width="1840" height="1000" rx="16" fill="url(#mediaGrad)" stroke="#00ffc6" strokeWidth="3" strokeDasharray="8 8" />
              <text x="960" y="520" textAnchor="middle" fill="#00ffc6" fontSize="42" fontWeight="900" letterSpacing="4" fontFamily="monospace">
                MAIN_CANVAS [100% COVER]
              </text>
              {/* Overlay HUD */}
              <rect x="80" y="780" width="600" height="220" rx="16" fill="rgba(0,0,0,0.85)" stroke="#00ffc6" strokeWidth="2" />
              <rect x="110" y="810" width="180" height="40" rx="8" fill="#00ffc6" />
              <text x="200" y="836" textAnchor="middle" fill="#000" fontSize="22" fontWeight="900" fontFamily="sans-serif">LIVE_HUD</text>
              <rect x="110" y="870" width="450" height="30" rx="4" fill="rgba(255,255,255,0.2)" />
              <rect x="110" y="920" width="300" height="20" rx="4" fill="rgba(255,255,255,0.1)" />
            </>
          )}

          {layoutType === 'SPLIT_70_30' && (
            <>
              {/* Main 70% Zone */}
              <rect x="40" y="40" width="1280" height="1000" rx="16" fill="url(#mediaGrad)" stroke="#00ffc6" strokeWidth="3" />
              <text x="680" y="540" textAnchor="middle" fill="#00ffc6" fontSize="38" fontWeight="900" letterSpacing="4" fontFamily="monospace">
                MEDIA_CANVAS [70%]
              </text>
              {/* Sidebar 30% Zone */}
              <rect x="1350" y="40" width="530" height="1000" rx="16" fill="rgba(13,14,21,0.95)" stroke="#7c3aed" strokeWidth="3" />
              <text x="1615" y="120" textAnchor="middle" fill="#a78bfa" fontSize="28" fontWeight="900" letterSpacing="3" fontFamily="monospace">
                SYSTEM_FEED [30%]
              </text>
              <rect x="1390" y="160" width="450" height="180" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
              <rect x="1390" y="370" width="450" height="180" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
              <rect x="1390" y="580" width="450" height="180" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
            </>
          )}

          {layoutType === 'L_BAR_TICKER' && (
            <>
              {/* Main Top Media Zone */}
              <rect x="40" y="40" width="1280" height="840" rx="16" fill="url(#mediaGrad)" stroke="#00ffc6" strokeWidth="3" />
              <text x="680" y="460" textAnchor="middle" fill="#00ffc6" fontSize="36" fontWeight="900" letterSpacing="4" fontFamily="monospace">
                PRIMARY_VIEWPORT
              </text>
              {/* Side Panel Zone */}
              <rect x="1350" y="40" width="530" height="840" rx="16" fill="rgba(18,19,30,0.95)" stroke="#7c3aed" strokeWidth="3" />
              <text x="1615" y="120" textAnchor="middle" fill="#a78bfa" fontSize="26" fontWeight="900" letterSpacing="3" fontFamily="monospace">
                INFO_SIDE_PANEL
              </text>
              {/* Bottom Ticker Zone */}
              <rect x="40" y="910" width="1840" height="130" rx="12" fill="rgba(9,9,14,0.95)" stroke="#00ffc6" strokeWidth="2" />
              <rect x="60" y="930" width="220" height="90" rx="8" fill="#00ffc6" />
              <text x="170" y="985" textAnchor="middle" fill="#000" fontSize="22" fontWeight="900" fontFamily="sans-serif">TICKER</text>
              <text x="320" y="985" fill="#00ffc6" fontSize="24" fontFamily="monospace">NEWS_FEED /// STATUS: OPTIMAL /// LIVE STREAM</text>
            </>
          )}

          {layoutType === 'GRID_MATRIX' && (
            <>
              <rect x="40" y="40" width="880" height="480" rx="12" fill="url(#mediaGrad)" stroke="#00ffc6" strokeWidth="2" />
              <rect x="960" y="40" width="920" height="480" rx="12" fill="url(#mediaGrad)" stroke="#00ffc6" strokeWidth="2" />
              <rect x="40" y="560" width="880" height="480" rx="12" fill="url(#mediaGrad)" stroke="#00ffc6" strokeWidth="2" />
              <rect x="960" y="560" width="920" height="480" rx="12" fill="url(#mediaGrad)" stroke="#00ffc6" strokeWidth="2" />
            </>
          )}
        </svg>

        {/* Compact Layout Badge Overlay */}
        <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md border border-white/10 text-[9px] font-mono text-accent font-bold uppercase tracking-wider flex items-center gap-1.5">
          <Layout className="w-3 h-3 text-accent" />
          {layoutType}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black/50 border border-white/10 rounded-2xl p-6 space-y-4 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 border border-accent/20 rounded-xl text-accent">
            <Layout className="w-4 h-4 shadow-glow-purple" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-foreground uppercase tracking-wider italic">
                {template.name}
              </h4>
              <span className="px-2 py-0.5 bg-accent/10 text-accent border border-accent/20 text-[9px] font-mono rounded-md font-bold uppercase">
                {layoutType}
              </span>
            </div>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">
              Layout Structure Visualizer & Realtime Renderer
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setViewMode('schematic')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
              viewMode === 'schematic'
                ? 'bg-accent text-black shadow-glow-purple-sm'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" /> Wireframe
          </button>
          <button
            type="button"
            onClick={() => setViewMode('live')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
              viewMode === 'live'
                ? 'bg-accent text-black shadow-glow-purple-sm'
                : 'text-slate-500 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" /> Live Sandbox
          </button>
        </div>
      </div>

      {/* Main Preview Screen */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/90 border border-white/10 shadow-2xl group">
        {viewMode === 'schematic' ? (
          <div className="w-full h-full relative flex items-center justify-center p-2">
            <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="mediaGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00ffc6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.3" />
                </linearGradient>
                <pattern id="gridPatternFull" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Background */}
              <rect width="1920" height="1080" fill="#08090e" />
              <rect width="1920" height="1080" fill="url(#gridPatternFull)" />

              {layoutType === 'FULLSCREEN_HUD' && (
                <>
                  <rect x="40" y="40" width="1840" height="1000" rx="20" fill="url(#mediaGradFull)" stroke="#00ffc6" strokeWidth="3" strokeDasharray="12 12" />
                  <text x="960" y="480" textAnchor="middle" fill="#00ffc6" fontSize="48" fontWeight="900" letterSpacing="6" fontFamily="monospace">
                    PRIMARY_MEDIA_ZONE [100% FULLSCREEN]
                  </text>
                  <text x="960" y="540" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="24" fontFamily="monospace">
                    Z-INDEX: 0 /// ASPECT: 16:9
                  </text>

                  {/* HUD Overlay */}
                  <rect x="80" y="740" width="700" height="260" rx="20" fill="rgba(0,0,0,0.85)" stroke="#00ffc6" strokeWidth="2" />
                  <rect x="110" y="770" width="220" height="44" rx="10" fill="#00ffc6" />
                  <text x="220" y="800" textAnchor="middle" fill="#000" fontSize="24" fontWeight="900" fontFamily="sans-serif">DYNAMIC_HUD</text>
                  <rect x="110" y="835" width="540" height="36" rx="6" fill="rgba(255,255,255,0.2)" />
                  <rect x="110" y="890" width="380" height="24" rx="6" fill="rgba(255,255,255,0.1)" />
                  <text x="110" y="960" fill="#00ffc6" fontSize="20" fontFamily="monospace">OVERLAY_LAYER [Z-INDEX: 1]</text>
                </>
              )}

              {layoutType === 'SPLIT_70_30' && (
                <>
                  <rect x="40" y="40" width="1260" height="1000" rx="20" fill="url(#mediaGradFull)" stroke="#00ffc6" strokeWidth="3" />
                  <text x="670" y="520" textAnchor="middle" fill="#00ffc6" fontSize="44" fontWeight="900" letterSpacing="6" fontFamily="monospace">
                    MAIN_VIEWPORT [70%]
                  </text>
                  <text x="670" y="580" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="22" fontFamily="monospace">
                    VIDEO / IMAGE CANVAS
                  </text>

                  <rect x="1340" y="40" width="540" height="1000" rx="20" fill="rgba(13,14,21,0.95)" stroke="#7c3aed" strokeWidth="3" />
                  <text x="1610" y="120" textAnchor="middle" fill="#a78bfa" fontSize="32" fontWeight="900" letterSpacing="4" fontFamily="monospace">
                    SIDEBAR_PANEL [30%]
                  </text>

                  <rect x="1380" y="170" width="460" height="220" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
                  <text x="1410" y="220" fill="#a78bfa" fontSize="20" fontWeight="700" fontFamily="monospace">WIDGET_ZONE_1</text>
                  
                  <rect x="1380" y="430" width="460" height="220" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
                  <text x="1410" y="480" fill="#a78bfa" fontSize="20" fontWeight="700" fontFamily="monospace">WIDGET_ZONE_2</text>

                  <rect x="1380" y="690" width="460" height="220" rx="16" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
                  <text x="1410" y="740" fill="#a78bfa" fontSize="20" fontWeight="700" fontFamily="monospace">WIDGET_ZONE_3</text>
                </>
              )}

              {layoutType === 'L_BAR_TICKER' && (
                <>
                  <rect x="40" y="40" width="1260" height="820" rx="20" fill="url(#mediaGradFull)" stroke="#00ffc6" strokeWidth="3" />
                  <text x="670" y="440" textAnchor="middle" fill="#00ffc6" fontSize="42" fontWeight="900" letterSpacing="6" fontFamily="monospace">
                    PRIMARY_MEDIA_BOX
                  </text>

                  <rect x="1340" y="40" width="540" height="820" rx="20" fill="rgba(18,19,30,0.95)" stroke="#7c3aed" strokeWidth="3" />
                  <text x="1610" y="120" textAnchor="middle" fill="#a78bfa" fontSize="30" fontWeight="900" letterSpacing="4" fontFamily="monospace">
                    ANNOUNCEMENTS_SIDEBAR
                  </text>

                  <rect x="40" y="890" width="1840" height="150" rx="16" fill="rgba(9,9,14,0.95)" stroke="#00ffc6" strokeWidth="3" />
                  <rect x="70" y="915" width="260" height="100" rx="12" fill="#00ffc6" />
                  <text x="200" y="975" textAnchor="middle" fill="#000" fontSize="26" fontWeight="900" fontFamily="sans-serif">NEWS_TICKER</text>
                  <text x="370" y="975" fill="#00ffc6" fontSize="26" fontFamily="monospace">
                    SYSTEM STATUS: OPTIMAL /// PLAYLIST: EXPO_2026 /// NODE: NODE_09
                  </text>
                </>
              )}

              {layoutType === 'GRID_MATRIX' && (
                <>
                  <rect x="40" y="40" width="880" height="480" rx="16" fill="url(#mediaGradFull)" stroke="#00ffc6" strokeWidth="3" />
                  <rect x="960" y="40" width="920" height="480" rx="16" fill="url(#mediaGradFull)" stroke="#00ffc6" strokeWidth="3" />
                  <rect x="40" y="560" width="880" height="480" rx="16" fill="url(#mediaGradFull)" stroke="#00ffc6" strokeWidth="3" />
                  <rect x="960" y="560" width="920" height="480" rx="16" fill="url(#mediaGradFull)" stroke="#00ffc6" strokeWidth="3" />
                </>
              )}
            </svg>
          </div>
        ) : (
          <iframe
            title="Template Live Preview"
            srcDoc={generateLiveHtml()}
            className="w-full h-full border-0 pointer-events-none"
            sandbox="allow-scripts"
          />
        )}

        {/* Viewport scanlines overlay */}
        <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none" />
      </div>

      {/* Structural Stats Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
          <span className="text-slate-600">Archetype</span>
          <span className="text-accent font-bold">{layoutType}</span>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
          <span className="text-slate-600">HTML Tags</span>
          <span className="text-foreground font-bold">{(template.html.match(/<[a-z]+/gi) || []).length}</span>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
          <span className="text-slate-600">CSS Selectors</span>
          <span className="text-foreground font-bold">{(template.css.match(/\{/g) || []).length}</span>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
          <span className="text-slate-600">Placeholders</span>
          <span className="text-emerald-400 font-bold">{(template.html.match(/\{\{.*?\}\}/g) || []).length}</span>
        </div>
      </div>
    </div>
  );
};
