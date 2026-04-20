import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { ViewState, Device } from '../types';
import { StatusBadge, GlowCard } from './ui/Shared';
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
  Box
} from 'lucide-react';

interface DeviceRegistryProps {
  onNavigate?: (view: ViewState) => void;
}

const DeviceRegistry: React.FC<DeviceRegistryProps> = ({ onNavigate }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshDevices = () => {
    setDevices(storage.getDevices());
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

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.deviceId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatus = (lastSeen: string) => {
    const now = new Date().getTime();
    const diff = (now - new Date(lastSeen).getTime()) / 1000 / 60;
    if (diff < 2) return 'online';
    if (diff < 15) return 'attention';
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
        <button 
          onClick={() => onNavigate?.('provision')}
          className="group flex items-center gap-3 bg-primary px-8 py-3.5 rounded-2xl text-black font-black text-[11px] uppercase tracking-widest shadow-glow-cyan hover:shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> Register Node
        </button>
      </div>

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
          return (
            <GlowCard key={device.deviceId} className="p-8 border-white/5 group hover:bg-white/5 transition-all relative overflow-hidden">
              {/* Scanline Background */}
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Monitor className="w-20 h-20 rotate-12" />
              </div>

              <div className="flex justify-between items-start mb-10 relative z-10">
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

                <div className="grid grid-cols-2 gap-4 pb-8 border-b border-white/5">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">HARDWARE</p>
                      <p className="text-xs font-bold text-slate-400 truncate uppercase tracking-tighter">{device.platform}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">LOCAL_IP</p>
                      <p className="text-xs font-mono text-slate-400 truncate tracking-tighter">{device.ipAddress}</p>
                   </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                   <div className="flex items-center gap-3">
                      <Activity className={`w-3.5 h-3.5 ${status === 'online' ? 'text-primary animate-pulse' : 'text-slate-800'}`} />
                      <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Heartbeat Trace: <span className="text-slate-400 italic">SEC_OK</span></span>
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
