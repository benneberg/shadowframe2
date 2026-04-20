import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../services/storage';
import { ViewState, PlayerConfig, TelemetryEvent } from '../types';
import { Runtime } from '../engine/core/Runtime';
import { PlayerRuntimeConfig } from '../engine/types';
import { eventBus } from '../engine/core/EventBus';
import { GlowCard, StatusBadge } from './ui/Shared';
import { 
    Play, 
    Square, 
    Loader2, 
    AlertCircle, 
    Maximize2, 
    Terminal, 
    Activity, 
    Zap,
    Cpu,
    Monitor,
    ShieldCheck,
    Radio
} from 'lucide-react';

interface VirtualPlayerProps {
  onNavigate?: (view: ViewState) => void;
}

const VirtualPlayer: React.FC<VirtualPlayerProps> = ({ onNavigate }) => {
  const [configs, setConfigs] = useState<PlayerConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [logEvents, setLogEvents] = useState<TelemetryEvent[]>([]);
  const engineRef = useRef<Runtime | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const availableConfigs = storage.getConfigs();
    setConfigs(availableConfigs);
    if (availableConfigs.length > 0) {
      setSelectedConfigId(availableConfigs[0].playerId);
    }

    const unsub = eventBus.subscribe((event: TelemetryEvent) => {
      setLogEvents(prev => [event, ...prev].slice(0, 50));
    });

    return () => {
      unsub();
      if (engineRef.current) engineRef.current.destroy();
    };
  }, []);

  const startEngine = async () => {
    const config = configs.find(c => c.playerId === selectedConfigId);
    if (!config || !containerRef.current) return;

    setIsPlaying(true);
    setEngineReady(false);
    setLogEvents([]);

    const runtimeConfig: PlayerRuntimeConfig = {
      playerId: config.playerId,
      playlist: config.playlist,
      template: config.template
    };

    engineRef.current = new Runtime(containerRef.current, runtimeConfig);
    await engineRef.current.init();
    setEngineReady(true);
  };

  const stopEngine = () => {
    if (engineRef.current) {
      engineRef.current.destroy();
      engineRef.current = null;
    }
    setIsPlaying(false);
    setEngineReady(false);
  };

  const selectedConfig = configs.find(c => c.playerId === selectedConfigId);

  return (
    <div className="space-y-12 animate-slide-up pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-primary rounded-full shadow-glow-cyan" />
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Edge <span className="text-primary">Runtime</span></h1>
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em] mt-1">Virtual Node Simulation Environment</p>
            </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            value={selectedConfigId}
            onChange={(e) => setSelectedConfigId(e.target.value)}
            disabled={isPlaying}
            className="flex-1 md:w-64 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-[11px] font-black uppercase tracking-widest text-slate-300 outline-none focus:border-primary/30 disabled:opacity-50 transition-all font-mono italic"
          >
            {configs.map(c => (
              <option key={c.playerId} value={c.playerId}>{c.playerId.toUpperCase()}</option>
            ))}
          </select>
          
          {!isPlaying ? (
            <button 
              onClick={startEngine}
              disabled={!selectedConfigId}
              className="flex items-center gap-3 bg-primary px-8 py-3.5 rounded-xl text-black font-black text-[11px] uppercase tracking-widest shadow-glow-cyan hover:shadow-cyan-500/40 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
              <Play className="w-5 h-5 fill-current" /> INITIALIZE_KERNEL
            </button>
          ) : (
            <button 
              onClick={stopEngine}
              className="flex items-center gap-3 bg-red-500 px-8 py-3.5 rounded-xl text-white font-black text-[11px] uppercase tracking-widest shadow-glow-red hover:shadow-red-500/40 transition-all active:scale-95"
            >
              <Square className="w-5 h-5 fill-current" /> HALT_EXECUTION
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Simulator Section */}
        <div className="xl:col-span-8 space-y-8">
          <GlowCard className="p-0 border-white/5 overflow-hidden bg-black/40 shadow-2xl relative aspect-video flex flex-col items-center justify-center group">
            {/* Simulation Overlay */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-4 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3 shadow-2xl">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-primary shadow-glow-cyan animate-pulse' : 'bg-slate-800'}`} />
                <span className="text-[9px] font-black font-mono uppercase tracking-[0.25em] text-slate-500">
                  {isPlaying ? (engineReady ? 'NODE_EXECUTING' : 'KERNEL_WARMUP') : 'IDLE_WAITING_FOR_BOOT'}
                </span>
              </div>
              {isPlaying && (
                <div className="bg-primary/20 backdrop-blur-xl border border-primary/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <Radio className="w-3 h-3 text-primary animate-pulse" />
                    <span className="text-[8px] font-black font-mono text-primary uppercase tracking-widest tracking-[0.2em]">Live Telemetry</span>
                </div>
              )}
            </div>

            <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
               <button className="p-3 bg-black/60 backdrop-blur-md rounded-xl text-slate-500 hover:text-white border border-white/10 transition-all">
                  <Maximize2 className="w-5 h-5" />
               </button>
            </div>

            {/* Virtual Screen Content Area */}
            <div 
              ref={containerRef}
              className={`w-full h-full relative z-10 overflow-hidden transition-opacity duration-1000 ${engineReady ? 'opacity-100' : 'opacity-0'}`}
            />

            {!isPlaying && (
              <div className="text-center space-y-6 animate-pulse pointer-events-none px-4">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover:border-primary/20 transition-all">
                  <Monitor className="w-10 h-10 text-slate-800 group-hover:text-primary transition-colors opacity-20" />
                </div>
                <h3 className="text-sm font-black text-slate-600 uppercase tracking-[0.4em] italic mb-2">VIRTUAL_HARDWARE_STANDBY</h3>
                <p className="text-[10px] text-slate-800 font-mono uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                  The Edge Signage Runtime is configured and ready for hardware-accelerated playback simulation. Select node UID and commit initialization.
                </p>
              </div>
            )}

            {isPlaying && !engineReady && (
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                    <Loader2 className="w-20 h-20 text-primary animate-spin opacity-20" />
                    <Zap className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse shadow-glow-cyan" />
                </div>
                <div className="text-center">
                    <p className="text-xs font-black text-primary uppercase tracking-[0.6em] animate-pulse">BOOTSTRAPPING_SYSTEM</p>
                    <p className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em] mt-3">Allocating OpenGL buffers... mapping DOM nodes</p>
                </div>
              </div>
            )}

            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,255,198,0.15) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
          </GlowCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlowCard className="p-6 border-white/5 bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Processing Load</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-foreground">{isPlaying ? '12.4' : '0.0'}</span>
                    <span className="text-[10px] font-mono text-slate-600">GFLOPS</span>
                </div>
            </GlowCard>
             <GlowCard className="p-6 border-white/5 bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Security State</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">ISOLATED_SANDBOX</span>
                </div>
            </GlowCard>
             <GlowCard className="p-6 border-white/5 bg-white/5">
                <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-4 h-4 text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Render Pipeline</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-foreground">{isPlaying ? '60.0' : '0.0'}</span>
                    <span className="text-[10px] font-mono text-slate-600">FPS_STABLE</span>
                </div>
            </GlowCard>
          </div>
        </div>

        {/* Console / Telemetry Section */}
        <div className="xl:col-span-4 space-y-6 flex flex-col h-[650px] xl:h-auto">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-3 uppercase tracking-widest">
                <Terminal className="w-5 h-5 text-primary" />
                <h2 className="text-xs font-black text-slate-400">TELEMETRY_LOG</h2>
             </div>
             <StatusBadge status="online" className="bg-white/5 px-3 py-1 text-[9px] font-mono tracking-widest border border-white/10 uppercase">
                Ver: 3.0.4
             </StatusBadge>
          </div>

          <GlowCard className="flex-1 bg-black/60 border-white/10 font-mono p-6 overflow-hidden flex flex-col relative group">
            <div className="mb-4 flex items-center justify-between text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] pb-4 border-b border-white/5">
                <span>Timestamp</span>
                <span>Signal_Protocol</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
              {logEvents.length > 0 ? logEvents.map((ev, i) => (
                <div key={i} className="flex gap-4 animate-in slide-in-from-left duration-300">
                  <span className="text-[9px] text-slate-800 shrink-0 font-bold">[{ev.timestamp.split('T')[1].split('.')[0]}]</span>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                             ev.type === 'HEARTBEAT' ? 'bg-primary' : 
                             ev.type === 'PLAYBACK_START' ? 'bg-emerald-500' :
                             ev.type === 'ERROR' ? 'bg-red-500' : 'bg-slate-500'
                        }`} />
                        <span className="text-[10px] font-black text-foreground tracking-tighter uppercase italic">{ev.type}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 break-all leading-relaxed uppercase tracking-tighter opacity-80">{JSON.stringify(ev.data)}</p>
                  </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                  <Monitor className="w-12 h-12 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Waiting for signal trace...</p>
                </div>
              )}
            </div>

            {/* Grain/Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
          </GlowCard>
          
          <GlowCard className="p-6 border-white/5 bg-accent/5">
             <div className="flex items-center gap-3 text-accent mb-3 uppercase tracking-widest">
                <AlertCircle className="w-4 h-4 shadow-glow-purple" />
                <span className="text-[10px] font-black italic">KERNEL_ADVISOR</span>
             </div>
             <p className="text-[10px] text-slate-500 font-mono leading-relaxed uppercase tracking-wider">
               Simulation detects deterministic frame-lock. Network latency spoofing is <span className="text-accent font-bold">DISABLED</span>. Telemetry events are reconciled with the local device shadow.
             </p>
          </GlowCard>
        </div>
      </div>
    </div>
  );
};

export default VirtualPlayer;
