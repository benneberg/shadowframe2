import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { ViewState, Device, Playlist } from '../types';
import { StatusBadge, GlowCard } from './ui/Shared';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  Cpu, 
  Globe, 
  CheckCircle2, 
  MoreVertical, 
  Plus, 
  Trash2, 
  Search, 
  ExternalLink,
  ShieldCheck,
  Zap,
  ChevronRight,
  Activity,
  Terminal,
  Radio,
  Box,
  Check,
  RotateCcw,
  PlaySquare,
  X,
  Wifi
} from 'lucide-react';

interface DeviceRegistryProps {
  onNavigate?: (view: ViewState) => void;
}

const DeviceRegistry: React.FC<DeviceRegistryProps> = ({ onNavigate }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Bulk Actions State
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [showBulkReassign, setShowBulkReassign] = useState(false);
  
  // Diagnostic State
  const [activeDiagnostic, setActiveDiagnostic] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<{latency: number, status: 'success' | 'failed'} | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  const refreshDevices = () => {
    setDevices(storage.getDevices());
    setPlaylists(storage.getPlaylists());
  };

  useEffect(() => {
    refreshDevices();
    const interval = setInterval(refreshDevices, 10000);
    return () => clearInterval(interval);
  }, []);

  const removeDevice = (id: string) => {
    const updated = storage.deleteDevice(id);
    setDevices(updated);
  };

  const runPing = (id: string) => {
    setIsPinging(true);
    setPingResult(null);
    setActiveDiagnostic(id);

    // Mock ping behavior
    setTimeout(() => {
      const latency = Math.floor(Math.random() * 150) + 20;
      setPingResult({ latency, status: 'success' });
      setIsPinging(false);
      
      // Update device latency in storage
      const dev = devices.find(d => d.deviceId === id);
      if (dev) {
          storage.saveDevice({ ...dev, latency });
      }
    }, 2000);
  };

  const reassignPlaylist = (playlistId: string) => {
    const updatedDevices = devices.map(d => {
        if (selectedDevices.includes(d.deviceId)) {
            return { ...d, assignedPlaylistId: playlistId };
        }
        return d;
    });
    storage.saveDevices(updatedDevices);
    setDevices(updatedDevices);
    setSelectedDevices([]);
    setShowBulkReassign(false);
  };

  const toggleSelect = (id: string) => {
    setSelectedDevices(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.deviceId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatus = (lastSeen: string) => {
    const now = new Date().getTime();
    const diff = (now - new Date(lastSeen).getTime()) / 1000 / 60;
    if (diff < 5) return 'online';
    if (diff < 30) return 'attention';
    return 'offline';
  };

  return (
    <div className="space-y-12 animate-slide-up pb-32">
       {/* Header */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-primary rounded-full shadow-glow-cyan" />
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Fleet <span className="text-primary">Registry</span></h1>
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em] mt-1">Global Node Inventory & Telemetry</p>
            </div>
        </div>
        <div className="flex gap-4">
            {selectedDevices.length > 0 && (
                <button 
                    onClick={() => setShowBulkReassign(true)}
                    className="flex items-center gap-3 bg-white/5 border border-primary/30 px-6 py-3.5 rounded-2xl text-primary font-black text-[11px] uppercase tracking-widest hover:bg-primary/5 transition-all shadow-glow-cyan-sm animate-pulse"
                >
                    <PlaySquare className="w-4 h-4" /> Reassign ({selectedDevices.length})
                </button>
            )}
            <button 
                onClick={() => onNavigate?.('provision')}
                className="group flex items-center gap-3 bg-primary px-8 py-3.5 rounded-2xl text-black font-black text-[11px] uppercase tracking-widest shadow-glow-cyan hover:shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95"
            >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> Register Node
            </button>
        </div>
      </div>

      {/* Bulk Reassign Modal */}
      <AnimatePresence>
        {showBulkReassign && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-lg bg-card border border-white/10 rounded-[2.5rem] p-10"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-foreground uppercase italic tracking-tighter">Mass Assignment</h3>
                        <button onClick={() => setShowBulkReassign(false)} className="p-2 text-slate-500 hover:text-white"><X /></button>
                    </div>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-8">Select target manifest for {selectedDevices.length} selected nodes.</p>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 no-scrollbar">
                        {playlists.map(pl => (
                            <button 
                                key={pl.playlistId}
                                onClick={() => reassignPlaylist(pl.playlistId)}
                                className="w-full p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/30 hover:bg-primary/5 text-left group transition-all"
                            >
                                <p className="text-[11px] font-black text-foreground uppercase tracking-widest group-hover:text-primary mb-1">{pl.name}</p>
                                <p className="text-[9px] font-mono text-slate-600 uppercase italic">{pl.items.length} MODULES DETECTED</p>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="FILTER NODES BY UID, IDENTIFIER, OR STATUS..."
            className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-mono text-foreground focus:border-primary/30 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-800 uppercase tracking-widest"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
            {selectedDevices.length > 0 && (
                <button 
                    onClick={() => setSelectedDevices([])}
                    className="flex items-center gap-3 px-6 py-4 border border-red-500/20 bg-red-500/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-all"
                >
                    <X className="w-4 h-4" /> Deselect All
                </button>
            )}
             <GlowCard className="flex items-center gap-4 px-6 py-4 border-white/5 bg-white/5">
                <Box className="w-4 h-4 text-slate-700" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Nodes: <span className="text-foreground">{devices.length}</span></span>
             </GlowCard>
              <GlowCard className="flex items-center gap-4 px-6 py-4 border-white/5 bg-white/5">
                <Radio className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Signals: <span className="text-primary">Active</span></span>
             </GlowCard>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredDevices.map((device) => {
          const status = getStatus(device.lastSeen);
          const isSelected = selectedDevices.includes(device.deviceId);
          const isDiagOpen = activeDiagnostic === device.deviceId;
          
          return (
            <GlowCard key={device.deviceId} className={`p-8 border-white/5 group hover:bg-white/5 transition-all relative overflow-hidden ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
              {/* Checkbox Overlay */}
              <div 
                onClick={() => toggleSelect(device.deviceId)}
                className={`absolute top-6 left-6 w-5 h-5 rounded-md border-2 cursor-pointer z-20 flex items-center justify-center transition-all ${
                    isSelected ? 'bg-primary border-primary text-black' : 'border-white/10 hover:border-primary/30 bg-black/20'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </div>

              {/* Scanline Background */}
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Monitor className="w-20 h-20 rotate-12" />
              </div>

              <div className="flex justify-between items-start mb-10 relative z-10 pl-10">
                <div className={`p-4 rounded-2xl border transition-all ${
                    status === 'online' ? 'bg-primary/10 border-primary/20 text-primary shadow-glow-cyan-sm' : 
                    status === 'attention' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-glow-amber-sm' : 
                    'bg-slate-500/10 border-slate-500/20 text-slate-500'
                }`}>
                  <Monitor className="w-8 h-8" />
                </div>
                <div className="flex flex-col items-end gap-3">
                  <StatusBadge status={status} className="px-3 py-1 text-[9px] font-black uppercase tracking-widest italic border border-white/5 bg-black/40 backdrop-blur-md">
                    {status === 'online' ? 'LINK_ESTABLISHED' : status === 'attention' ? 'WARN_LATENCY' : 'NODE_OFFLINE'}
                  </StatusBadge>
                  <p className="text-[9px] font-mono text-slate-700 truncate w-24 text-right uppercase tracking-tighter">ID: {device.deviceId.toUpperCase()}</p>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tighter truncate italic group-hover:text-primary transition-colors">{device.name}</h3>
                  <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Protocol: SignageNodes_v3.2</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">HARDWARE</p>
                      <p className="text-xs font-bold text-slate-400 truncate uppercase tracking-tighter">{device.platform}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">LATENCY</p>
                      <p className={`text-xs font-mono truncate tracking-tighter ${device.latency ? (device.latency < 50 ? 'text-emerald-500' : 'text-amber-500') : 'text-slate-600'}`}>
                          {device.latency ? `${device.latency} MS` : 'NO_DATA'}
                      </p>
                   </div>
                </div>

                <AnimatePresence>
                    {isDiagOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 mb-4">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Diagnostic</span>
                                    {isPinging ? (
                                        <div className="flex items-center gap-2">
                                            <RotateCcw className="w-3 h-3 text-primary animate-spin" />
                                            <span className="text-[8px] font-mono text-primary uppercase">Uplink Test...</span>
                                        </div>
                                    ) : (
                                        <span className="text-[8px] font-mono text-emerald-500 uppercase">Test Complete</span>
                                    )}
                                </div>
                                {pingResult && (
                                    <div className="flex items-center gap-4 text-emerald-400">
                                        <Wifi className="w-4 h-4" />
                                        <div className="flex-1">
                                            <p className="text-xs font-black uppercase">{pingResult.latency} MS LATENCY</p>
                                            <p className="text-[8px] text-slate-500 uppercase tracking-widest">Network integrity verified</p>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between pt-2">
                   <div className="flex gap-2">
                        <button 
                            onClick={() => isDiagOpen ? setActiveDiagnostic(null) : runPing(device.deviceId)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all ${
                                isDiagOpen ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/5 text-slate-600 hover:text-primary hover:border-primary/20'
                            }`}
                        >
                            <Activity className={`w-3.5 h-3.5 ${isDiagOpen && isPinging ? 'animate-pulse' : ''}`} />
                            {isDiagOpen ? (isPinging ? 'TESTING...' : 'DISMISS') : 'PING_NODE'}
                        </button>
                   </div>
                   <button 
                    onClick={() => removeDevice(device.deviceId)}
                    className="p-3 bg-red-500/5 hover:bg-red-500/20 text-slate-700 hover:text-red-400 rounded-xl transition-all border border-transparent hover:border-red-400/20"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </GlowCard>
          );
        })}

        {filteredDevices.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-black/20 text-slate-800 group cursor-pointer hover:bg-white/5 transition-all" onClick={() => onNavigate?.('provision')}>
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 opacity-10 group-hover:opacity-100 group-hover:text-primary group-hover:border-primary/20 transition-all">
                <ShieldCheck className="w-10 h-10 transition-transform group-hover:rotate-12" />
             </div>
             <p className="text-xs font-mono uppercase tracking-[0.2em] italic">Fleet monitoring database returned zero active nodes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceRegistry;
