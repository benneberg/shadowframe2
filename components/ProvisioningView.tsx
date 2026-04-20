import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { ViewState, Device, Playlist, Media, Template, PlayerConfig } from '../types';
import { GlowCard, StatusBadge } from './ui/Shared';
import { 
    Zap, 
    Copy, 
    Download, 
    RefreshCw, 
    CheckCircle,
    Monitor,
    PlaySquare,
    Save,
    ChevronRight,
    Cpu,
    Activity,
    Smartphone,
    X,
    ShieldCheck,
    Radio,
    Terminal,
    Box
} from 'lucide-react';

interface ProvisioningViewProps {
  onNavigate?: (view: ViewState) => void;
}

const ProvisioningView: React.FC<ProvisioningViewProps> = ({ onNavigate }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [provisionedConfig, setProvisionedConfig] = useState<PlayerConfig | null>(null);

  useEffect(() => {
    setDevices(storage.getDevices());
    setPlaylists(storage.getPlaylists());
  }, []);

  const handleGenerateConfig = () => {
    if (!selectedDeviceId || !selectedPlaylistId) return;

    setIsProvisioning(true);
    
    // Simulate complex calculation
    setTimeout(() => {
        const device = devices.find(d => d.deviceId === selectedDeviceId);
        const playlist = playlists.find(p => p.playlistId === selectedPlaylistId);
        const template = storage.getTemplates().find(t => t.templateId === playlist?.templateId);

        if (device && playlist && template) {
            const config: PlayerConfig = {
                playerId: device.deviceId,
                playlist,
                template,
                lastProvisioned: new Date().toISOString()
            };
            storage.saveConfig(config);
            setProvisionedConfig(config);
        }
        setIsProvisioning(false);
    }, 1500);
  };

  const copyConfig = () => {
    if (!provisionedConfig) return;
    navigator.clipboard.writeText(JSON.stringify(provisionedConfig, null, 2));
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="space-y-12 animate-slide-up pb-32">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-primary rounded-full shadow-glow-cyan" />
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Node <span className="text-primary">Provisioning</span></h1>
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em] mt-1">Lifecycle Orchestration & Configuration</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Setup Column */}
        <div className="xl:col-span-12">
            <GlowCard className="p-10 border-white/5 bg-black/40 relative group overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Selectors */}
                    <div className="space-y-12">
                         <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <Monitor className="w-6 h-6 text-primary shadow-glow-cyan" />
                                <h3 className="text-sm font-black text-foreground uppercase tracking-widest italic">1. TARGET_HARDWARE_NODE</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {devices.map(dev => (
                                    <div 
                                        key={dev.deviceId}
                                        onClick={() => setSelectedDeviceId(dev.deviceId)}
                                        className={`p-6 rounded-2xl border flex flex-col gap-4 cursor-pointer transition-all ${
                                            selectedDeviceId === dev.deviceId 
                                            ? 'bg-primary/10 border-primary/40 ring-1 ring-primary/20' 
                                            : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-600'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className={`p-3 rounded-xl transition-all ${selectedDeviceId === dev.deviceId ? 'bg-primary/20 text-primary' : 'bg-black/20 text-slate-800'}`}>
                                                <Smartphone className="w-5 h-5" />
                                            </div>
                                            <div className={`w-2.5 h-2.5 rounded-full ${selectedDeviceId === dev.deviceId ? 'bg-primary shadow-glow-cyan' : 'bg-white/5'}`} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className={`text-xs font-black uppercase tracking-tighter italic ${selectedDeviceId === dev.deviceId ? 'text-foreground' : 'text-slate-600'}`}>{dev.name}</p>
                                            <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest truncate">{dev.deviceId}</p>
                                        </div>
                                    </div>
                                ))}
                                {devices.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-slate-800 font-mono text-[10px] uppercase border-2 border-dashed border-white/5 rounded-2xl italic">
                                        Zero active nodes detected in registry.
                                    </div>
                                )}
                            </div>
                         </div>

                         <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <PlaySquare className="w-6 h-6 text-accent shadow-glow-purple" />
                                <h3 className="text-sm font-black text-foreground uppercase tracking-widest italic">2. EXECUTION_MANIFEST</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {playlists.map(pl => (
                                    <div 
                                        key={pl.playlistId}
                                        onClick={() => setSelectedPlaylistId(pl.playlistId)}
                                        className={`p-6 rounded-2xl border flex flex-col gap-4 cursor-pointer transition-all ${
                                            selectedPlaylistId === pl.playlistId 
                                            ? 'bg-accent/10 border-accent/40 ring-1 ring-accent/20' 
                                            : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-600'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className={`p-3 rounded-xl transition-all ${selectedPlaylistId === pl.playlistId ? 'bg-accent/20 text-accent' : 'bg-black/20 text-slate-800'}`}>
                                                <Box className="w-5 h-5" />
                                            </div>
                                            <div className={`w-2.5 h-2.5 rounded-full ${selectedPlaylistId === pl.playlistId ? 'bg-accent shadow-glow-purple' : 'bg-white/5'}`} />
                                        </div>
                                        <div className="space-y-1">
                                            <p className={`text-xs font-black uppercase tracking-tighter italic ${selectedPlaylistId === pl.playlistId ? 'text-foreground' : 'text-slate-600'}`}>{pl.name}</p>
                                            <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">{pl.items.length} Content Blocks</p>
                                        </div>
                                    </div>
                                ))}
                                {playlists.length === 0 && (
                                    <div className="col-span-full py-12 text-center text-slate-800 font-mono text-[10px] uppercase border-2 border-dashed border-white/5 rounded-2xl italic">
                                        Zero manifests verified for distribution.
                                    </div>
                                )}
                            </div>
                         </div>
                    </div>

                    {/* Output / Action */}
                    <div className="space-y-10">
                         <GlowCard className="p-8 border-white/5 bg-black/60 min-h-[400px] flex flex-col">
                            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                <div className="flex items-center gap-3">
                                    <Terminal className="w-5 h-5 text-primary" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">MANIFEST_OBJECT_VIEW</h4>
                                </div>
                                {provisionedConfig && (
                                    <button 
                                        onClick={copyConfig}
                                        className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-white transition-colors"
                                    >
                                        {copySuccess ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copySuccess ? 'HASH_COPIED' : 'COPY_RAW_JSON'}
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 bg-black/40 rounded-xl p-6 font-mono text-[10px] text-slate-400 overflow-y-auto no-scrollbar border border-white/5">
                                {isProvisioning ? (
                                    <div className="h-full flex flex-col items-center justify-center space-y-4 animate-pulse">
                                        <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                                        <p className="text-primary font-black uppercase tracking-[0.3em]">RECONCILING_DEPENDENCIES...</p>
                                    </div>
                                ) : provisionedConfig ? (
                                    <pre className="whitespace-pre-wrap leading-relaxed opacity-60">
                                        {JSON.stringify(provisionedConfig, null, 2)}
                                    </pre>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center opacity-10 text-center px-10">
                                        <ShieldCheck className="w-16 h-16 mb-4" />
                                        <p className="uppercase tracking-[0.2em]">Select node cluster and manifest protocol to generate distribution object.</p>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={handleGenerateConfig}
                                disabled={!selectedDeviceId || !selectedPlaylistId || isProvisioning}
                                className="w-full mt-8 bg-primary py-5 rounded-2xl text-black font-black text-[11px] uppercase tracking-[0.3em] shadow-glow-cyan hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:shadow-none disabled:scale-100 flex items-center justify-center gap-3"
                            >
                                <Zap className="w-5 h-5 shadow-glow-cyan" /> Initialize Hardware Protocol
                            </button>
                         </GlowCard>

                         <div className="p-8 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group">
                             <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:opacity-20 transition-opacity">
                                <Radio className="w-16 h-16 animate-pulse" />
                             </div>
                             <div className="flex items-center gap-3 text-emerald-500 mb-4">
                                <Activity className="w-4 h-4 shadow-glow-cyan" />
                                <span className="text-[9px] font-black uppercase tracking-[0.3em] italic">Edge_Health_Advisory</span>
                             </div>
                             <p className="text-[10px] text-slate-500 font-mono leading-relaxed uppercase tracking-wider">
                                System ready for over-the-air (OTA) provisioning. Reconciled manifest will be pushed to node <span className="text-primary font-bold">SHA-256</span> vault via MQTT-Tunnel.
                             </p>
                         </div>
                    </div>
                </div>
            </GlowCard>
        </div>
      </div>
    </div>
  );
};

export default ProvisioningView;
