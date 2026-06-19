import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { ViewState, TelemetryEvent } from '../types';
import { 
    Bug, 
    Terminal, 
    RefreshCw, 
    Send, 
    AlertCircle, 
    Trash2, 
    ShieldCheck, 
    Activity,
    Cpu,
    Zap,
    ChevronRight,
    Search,
    Code,
    Box,
    X,
    Server,
    Radio
} from 'lucide-react';
import { GlowCard, StatusBadge } from './ui/Shared';

import { WebOSStorage } from '../engine/modules/WebOSStorage';
import { HardwareLoggingModule } from '../engine/modules/HardwareLoggingModule';
import { WebOSStorageProvider } from '../types';

interface DebugInspectorProps {
  onNavigate?: (view: ViewState) => void;
}

const DebugInspector: React.FC<DebugInspectorProps> = ({ onNavigate }) => {
  const [logs, setLogs] = useState<TelemetryEvent[]>([]);
  const [physicalLogs, setPhysicalLogs] = useState<string>('');
  const [command, setCommand] = useState('');
  const [storageProviders, setStorageProviders] = useState<WebOSStorageProvider[]>([]);

  const tools = [
    { name: 'KERNEL_VIDEO_PROBE', url: 'https://ais-applet.com/debug/v1/video', status: 'online' },
    { name: 'MANIFEST_STRUCT_DIFF', url: 'https://ais-applet.com/debug/v1/playlist', status: 'attention' },
    { name: 'REMOTE_CLI_PROXY', url: 'https://ais-applet.com/debug/v1/shell', status: 'online' }
  ];

  useEffect(() => {
    // Discovery: Get hardware storage tiers
    WebOSStorage.getInstance().listStorageProviders().then(setStorageProviders);
    
    // Initial physical log pull
    HardwareLoggingModule.getInstance().getLogs().then(l => setPhysicalLogs(l || 'NO_PHYS_DATA'));

    // Polling interval for hardware log sync (simulating physical write feedback)
    const interval = setInterval(() => {
        HardwareLoggingModule.getInstance().getLogs().then(l => setPhysicalLogs(l || 'NO_PHYS_DATA'));
    }, 5000);

    // Generate some initial mock telemetry for debug vibes
    const mockEvents: TelemetryEvent[] = Array.from({ length: 10 }).map((_, i) => ({
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      type: i % 4 === 0 ? 'ERROR' : i % 3 === 0 ? 'PLAYBACK_START' : 'HEARTBEAT',
      data: { signal_db: -45, heap_usage: '124MB', node_id: 'NODE-PX7' },
      playerId: 'VIRTUAL-01'
    }));
    setLogs(mockEvents);

    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => {
    setLogs([]);
    HardwareLoggingModule.getInstance().purge().then(() => setPhysicalLogs('LOGS_PURGED'));
  };

  const executeCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command) return;
    
    // Simulate command execution trace
    const newLog: TelemetryEvent = {
        timestamp: new Date().toISOString(),
        type: 'DEBUG_CMD',
        data: { cmd: command, result: 'EXECUTION_PENDING', auth: 'LEVEL_ALPHA' },
        playerId: 'LOCAL_KERNEL'
    };
    setLogs([newLog, ...logs]);
    setCommand('');
  };

  return (
    <div className="space-y-12 animate-slide-up pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-primary rounded-full shadow-glow-cyan" />
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Kernel <span className="text-primary">Monitor</span></h1>
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em] mt-1">Low-Level Telemetry & Protocol Debug</p>
            </div>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={clearLogs}
                className="group flex items-center gap-3 bg-white/5 px-6 py-3.5 rounded-2xl text-slate-500 font-black text-[10px] uppercase tracking-widest border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all active:scale-95"
            >
                <Trash2 className="w-4 h-4" /> Purge Logs
            </button>
            <button 
                className="group flex items-center gap-3 bg-white/5 px-6 py-3.5 rounded-2xl text-slate-500 font-black text-[10px] uppercase tracking-widest border border-white/5 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all active:scale-95"
            >
                <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-700" /> Resync Kernel
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Registry Section */}
        <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {tools.map((tool, idx) => (
                <GlowCard key={idx} className="p-8 border-white/5 hover:bg-white/5 transition-all group flex flex-col gap-6">
                    <div className="flex justify-between items-start">
                        <div className={`p-4 rounded-2xl border transition-all ${tool.status === 'online' ? 'bg-primary/10 border-primary/20 text-primary shadow-glow-cyan-sm' : 'bg-amber-500/10 border-amber-500/20 text-amber-50'}`}>
                            {idx === 0 ? <Cpu className="w-6 h-6" /> : idx === 1 ? <Box className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                        </div>
                        <StatusBadge status={tool.status as any} className="bg-black/40 border border-white/5 px-3 py-1 font-mono text-[9px] italic uppercase tracking-widest">{tool.status === 'online' ? 'LINK_READY' : 'MAINTENANCE'}</StatusBadge>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest italic group-hover:text-primary transition-colors">{tool.name}</h3>
                        <p className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.2em]">{tool.url}</p>
                    </div>
                </GlowCard>
            ))}
        </div>

        {/* Telemetry Console */}
        <div className="xl:col-span-8 flex flex-col h-[600px] space-y-6">
            <div className="flex items-center gap-3 px-2">
                <Terminal className="w-5 h-5 text-primary shadow-glow-cyan" />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">LIVE_TELEMETRY_STREAM</h2>
            </div>
            
            <GlowCard className="flex-1 bg-black/60 border-white/10 p-8 flex flex-col overflow-hidden font-mono text-xs relative group">
                <div className="mb-6 flex items-center justify-between text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] pb-6 border-b border-white/5">
                    <span className="flex items-center gap-3"><Radio className="w-4 h-4 animate-pulse text-primary" /> Trace</span>
                    <span>Class</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-6 animate-in slide-in-from-left duration-300 group/log">
                            <span className="text-[10px] text-slate-800 shrink-0 font-bold w-20">[{log.timestamp.split('T')[1].split('.')[0]}]</span>
                            <div className="space-y-2 flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        log.type === 'ERROR' ? 'bg-red-500 shadow-glow-red-sm' : 
                                        log.type === 'PLAYBACK_START' ? 'bg-emerald-500 shadow-glow-emerald-sm' : 
                                        log.type === 'DEBUG_CMD' ? 'bg-accent shadow-glow-purple-sm' : 'bg-primary opacity-50'
                                    }`} />
                                    <span className={`font-black uppercase italic tracking-tighter ${
                                         log.type === 'ERROR' ? 'text-red-500' : 
                                         log.type === 'PLAYBACK_START' ? 'text-emerald-500' : 
                                         log.type === 'DEBUG_CMD' ? 'text-accent' : 'text-slate-500'
                                    }`}>{log.type}</span>
                                    <span className="text-[9px] text-slate-700 font-mono uppercase px-2 py-0.5 bg-white/5 rounded border border-white/5 group-hover/log:border-white/10 transition-colors">{log.playerId}</span>
                                </div>
                                <div className="text-[10px] text-slate-600 bg-white/5 p-3 rounded-xl border border-white/5 group-hover/log:border-primary/10 transition-colors leading-relaxed">
                                    {JSON.stringify(log.data, null, 2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scanline Detail */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
            </GlowCard>

            <form onSubmit={executeCommand} className="relative group">
                <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-md opacity-25 group-focus-within:opacity-100 transition duration-500"></div>
                <div className="relative flex gap-3">
                    <input 
                        type="text"
                        placeholder="ENTER KERNEL DIRECTIVE (E.G. FLUSH_BUFFERS, RESYNC_CLUSTER)..."
                        className="flex-1 bg-black/60 border border-white/10 rounded-2xl px-8 py-5 text-xs font-mono text-primary outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-900 uppercase tracking-widest italic"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                    />
                    <button 
                        type="submit"
                        className="bg-primary px-10 rounded-2xl text-black font-black text-xs uppercase tracking-[0.2em] shadow-glow-cyan hover:shadow-cyan-500/40 transition-all active:scale-95"
                    >
                        Execute
                    </button>
                </div>
            </form>
        </div>

        {/* Sidebar Info */}
        <div className="xl:col-span-4 space-y-10">
            <GlowCard className="p-10 border-white/5 bg-white/5 relative group overflow-hidden">
                <Server className="absolute -right-12 -bottom-12 w-48 h-48 text-primary/5 -rotate-12 transition-transform group-hover:rotate-0 duration-1000" />
                <h3 className="text-lg font-black tracking-tighter uppercase mb-2 italic">System Health</h3>
                <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em] mb-10">Operational Parameters</p>
                
                <div className="space-y-8 relative z-10">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            <span>HEAP_ALLOCATION</span>
                            <span>42.1%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="w-[42%] h-full bg-primary shadow-glow-cyan" />
                        </div>
                    </div>
                     <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            <span>V-BUFFER_LATENCY</span>
                            <span>4ms</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="w-[12%] h-full bg-emerald-500 shadow-glow-emerald" />
                        </div>
                    </div>
                     <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            <span>CLUSTER_UPTIME</span>
                            <span>1,442H</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="w-[98%] h-full bg-accent shadow-glow-purple" />
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-10 border-t border-white/5 flex items-center justify-between">
                    <StatusBadge status="online" className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-mono text-[9px] px-3 py-1 uppercase tracking-widest italic animate-pulse">
                        Deterministic_Lock_Active
                    </StatusBadge>
                </div>
            </GlowCard>

            <GlowCard className="p-8 border-accent/20 bg-accent/5">
                <div className="flex items-center gap-3 text-accent mb-4">
                    <AlertCircle className="w-5 h-5 shadow-glow-purple" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">SECURITY_PROTOCOL</span>
                </div>
                <p className="text-[10px] text-slate-500 font-mono leading-relaxed uppercase tracking-wider">
                    Administrative access detected. Kernel logs are being replicated to the cloud-vault for forensic audits. <span className="text-accent underline cursor-pointer">View Cipher Keys.</span>
                </p>
            </GlowCard>

            <GlowCard className="p-8 border-white/5 bg-black/40">
                <div className="flex items-center gap-3 text-primary mb-6">
                    <Box className="w-5 h-5 shadow-glow-cyan" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">PLATFORM_RESOURCES</span>
                </div>
                <div className="space-y-4">
                    {storageProviders.map(p => (
                        <div key={p.driveId} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group">
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-black text-foreground uppercase italic group-hover:text-primary transition-colors">{p.label || p.driveId}</h4>
                                <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">{p.storageType} {"->"} {p.path}</p>
                            </div>
                            <StatusBadge status="online" className="text-[8px] bg-primary/10 border border-primary/20 text-primary">MOUNTED</StatusBadge>
                        </div>
                    ))}
                    {storageProviders.length === 0 && (
                        <div className="py-10 text-center text-slate-800 font-mono text-[9px] uppercase italic border border-dashed border-white/5 rounded-xl">
                            No physical storage volumes identified.
                        </div>
                    )}
                </div>
            </GlowCard>

            <GlowCard className="p-8 border-white/5 bg-white/5 flex flex-col gap-6">
                <div className="flex items-center gap-3 text-slate-400">
                    <Activity className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">PHYSICAL_SESSION_LOG</span>
                </div>
                <div className="bg-black/80 rounded-2xl p-6 font-mono text-[10px] text-emerald-500/80 leading-relaxed border border-white/5 h-[300px] overflow-y-auto no-scrollbar">
                    {physicalLogs.split('\n').map((line, i) => (
                        <div key={i} className="py-0.5 whitespace-pre-wrap">{line}</div>
                    ))}
                </div>
                <div className="flex justify-between items-center text-[8px] font-mono text-slate-700 uppercase tracking-widest italic">
                    <span>Target: /logs/kernel.log</span>
                    <span>Persistence: Virtual_Append</span>
                </div>
            </GlowCard>
        </div>
      </div>
    </div>
  );
};

export default DebugInspector;
