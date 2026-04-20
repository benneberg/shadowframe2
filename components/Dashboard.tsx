
import React, { useEffect, useState } from 'react';
import { storage } from '../services/storage';
import { ViewState, Media, Device, Playlist, PlayerConfig } from '../types';
import { StatusBadge, GlowCard, MetricCard } from './ui/Shared';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Power, 
  Layout, 
  PlaySquare, 
  FileCode, 
  Monitor, 
  Plus, 
  MoreVertical,
  Clock,
  ChevronRight,
  Activity,
  ShieldCheck,
  Cpu,
  Zap
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState({
    media: [] as Media[],
    devices: [] as Device[],
    playlists: [] as Playlist[],
    configs: [] as PlayerConfig[]
  });

  const [statusCounts, setStatusCounts] = useState({ online: 0, attention: 0, offline: 0 });

  useEffect(() => {
    const media = storage.getMedia();
    const devices = storage.getDevices();
    const playlists = storage.getPlaylists();
    const configs = storage.getConfigs();
    
    setData({ media, devices, playlists, configs });

    // Real-time status calculation
    const calculateStatus = () => {
      const now = new Date().getTime();
      const counts = devices.reduce((acc, dev) => {
        const lastSeen = new Date(dev.lastSeen).getTime();
        const diffMins = (now - lastSeen) / 1000 / 60;
        
        if (diffMins < 5) acc.online++;
        else if (diffMins < 30) acc.attention++;
        else acc.offline++;
        
        return acc;
      }, { online: 0, attention: 0, offline: 0 });
      setStatusCounts(counts);
    };

    calculateStatus();
    const interval = setInterval(calculateStatus, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  const recentMedia = [...data.media].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  return (
    <div className="space-y-12 animate-slide-up pb-32">
      {/* User Header */}
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden border border-white/10 shadow-glow-cyan/10 group cursor-pointer">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
              alt="User Avatar" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-1">NETWORK_OPERATOR_v3</p>
            <h1 className="text-3xl font-black text-foreground tracking-tighter italic">WELCOME, <span className="text-primary">COMMANDER</span></h1>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="relative p-3.5 bg-white/5 rounded-2xl border border-white/5 text-slate-500 hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all group">
            <Bell className="w-6 h-6" />
            <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background shadow-glow-cyan animate-pulse"></span>
          </button>
        </div>
      </div>

      {/* System Status Metrics */}
      <section className="space-y-6">
        <div className="flex justify-between items-end px-2">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow-cyan" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">FLEET_SYNOPSIS</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest shadow-glow-cyan-sm">
                <Activity className="w-3 h-3 animate-pulse" /> CLUSTER_LIVE
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            title="ACTIVE_NODES" 
            value={statusCounts.online} 
            status="online" 
            icon={<CheckCircle2 className="w-5 h-5" />}
            trend="OPERATIONAL"
          />
          <MetricCard 
            title="PENDING_SYNC" 
            value={statusCounts.attention} 
            status="attention" 
            icon={<AlertTriangle className="w-5 h-5" />}
            trend="WARN_LATENCY"
          />
          <MetricCard 
            title="OFFLINE_FAULT" 
            value={statusCounts.offline} 
            status="offline" 
            icon={<Power className="w-5 h-5" />}
            trend="CRITICAL_ERR"
          />
        </div>
      </section>

      {/* Recent Updates & Fleet Deployments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Recent Assets */}
        <section className="lg:col-span-12 space-y-6">
          <div className="flex justify-between items-end px-2">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-accent rounded-full shadow-glow-purple" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">INGESTED_PAYLOADS</h2>
            </div>
            <button onClick={() => onNavigate('media')} className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-[0.2em] bg-primary/10 px-4 py-1.5 rounded-lg border border-primary/20">INGEST_PAYLOAD</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {recentMedia.length > 0 ? recentMedia.map(m => (
              <GlowCard key={m.mediaId} className="flex flex-col border-white/5 group hover:bg-white/5 transition-all overflow-hidden">
                <div className="aspect-video relative overflow-hidden bg-black/40">
                  <img src={m.previewUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt={m.name} />
                  <div className="absolute top-4 left-4">
                    <StatusBadge status="online" className="bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-white/10">
                        {m.type}
                    </StatusBadge>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
                      <Layout className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate w-32 uppercase tracking-tighter">{m.name}</h4>
                      <p className="text-[9px] text-slate-600 mt-1 flex items-center gap-2 font-mono">
                        <Clock className="w-3 h-3" /> {timeAgo(m.createdAt).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-700 hover:text-primary transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </GlowCard>
            )) : (
              <GlowCard className="col-span-full py-20 border-dashed flex flex-col items-center justify-center text-slate-700 group cursor-pointer hover:bg-white/5 transition-all">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all">
                    <Plus className="w-8 h-8 opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all" />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] italic">INGEST_FIRST_PAYLOAD</p>
              </GlowCard>
            )}
          </div>
        </section>

        {/* Live Deployments */}
        <section className="lg:col-span-12 space-y-6">
          <div className="flex items-center gap-3 px-2">
              <div className="w-1.5 h-6 bg-primary rounded-full shadow-glow-cyan" />
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">ACTIVE_DEPLOYMENTS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.configs.length > 0 ? data.configs.map(cfg => (
              <GlowCard key={cfg.playerId} className="p-6 flex items-center gap-6 border-white/5 hover:bg-white/5 transition-all group">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-glow-cyan group-hover:scale-105 transition-transform duration-500">
                  <Monitor className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-black text-foreground truncate uppercase tracking-tighter">{cfg.playlist.name}</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-glow-cyan" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">EXECUTING</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 mt-2">
                     <p className="text-[10px] text-slate-600 flex items-center gap-2 font-mono">
                      <Cpu className="w-3.5 h-3.5 opacity-50" /> {cfg.playerId.toUpperCase()}
                    </p>
                    <p className="text-[10px] text-slate-600 flex items-center gap-2 font-mono">
                      <Layout className="w-3.5 h-3.5 opacity-50" /> {cfg.playlist.items.length} MODULES
                    </p>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full mt-5 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-1000 shadow-glow-cyan" 
                      style={{ width: '65%' }}
                    />
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('player')}
                  className="p-4 bg-white/5 rounded-2xl text-slate-600 hover:text-primary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </GlowCard>
            )) : (
              <GlowCard className="col-span-full p-12 py-20 border-dashed text-center group cursor-pointer hover:bg-white/5 transition-all">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-primary/10 transition-all">
                   <Zap className="w-10 h-10 text-slate-800 group-hover:text-primary transition-all opacity-20 group-hover:opacity-100" />
                </div>
                <p className="font-mono text-xs text-slate-600 uppercase tracking-[0.2em] italic mb-8">ZERO_ACTIVE_INSTANCES_DETECTED</p>
                <button 
                  onClick={() => onNavigate('provision')}
                  className="text-[11px] font-black uppercase tracking-[0.3em] text-primary flex items-center justify-center gap-3 mx-auto group-hover:gap-5 transition-all bg-primary/10 px-8 py-3 rounded-xl border border-primary/20 shadow-glow-cyan-sm hover:shadow-glow-cyan"
                >
                  INITIALIZE_HARDWARE_PROTOCOL <ChevronRight className="w-4 h-4" />
                </button>
              </GlowCard>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
