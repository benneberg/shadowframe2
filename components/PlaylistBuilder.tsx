import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { ViewState, Media, Playlist, Template } from '../types';
import { GlowCard, StatusBadge } from './ui/Shared';
import { 
  Plus, 
  List, 
  Save, 
  ChevronRight, 
  LayoutTemplate,
  PlaySquare,
  Clock,
  Trash2,
  Settings2,
  Activity,
  Zap,
  Box,
  Layout
} from 'lucide-react';

interface PlaylistBuilderProps {
  onNavigate?: (view: ViewState) => void;
}

const PlaylistBuilder: React.FC<PlaylistBuilderProps> = ({ onNavigate }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    selectedMedia: [] as string[],
    templateId: ''
  });

  useEffect(() => {
    setPlaylists(storage.getPlaylists());
    setMediaItems(storage.getMedia());
    const availableTemplates = storage.getTemplates();
    setTemplates(availableTemplates);
    if (availableTemplates.length > 0) {
      setNewPlaylist(prev => ({ ...prev, templateId: availableTemplates[0].templateId }));
    }
  }, []);

  const handleCreate = () => {
    if (!newPlaylist.name || newPlaylist.selectedMedia.length === 0) return;
    
    const playlist: Playlist = {
      playlistId: `pl-${Date.now()}`,
      name: newPlaylist.name.toUpperCase(),
      items: newPlaylist.selectedMedia.map(mid => {
        const m = mediaItems.find(mi => mi.mediaId === mid)!;
        return {
          mediaId: mid,
          duration: 10,
          type: m.type,
          url: m.url
        };
      }),
      templateId: newPlaylist.templateId,
      createdAt: new Date().toISOString()
    };

    const updated = storage.savePlaylist(playlist);
    setPlaylists(updated);
    setIsCreating(false);
    setNewPlaylist({ name: '', selectedMedia: [], templateId: templates[0]?.templateId || '' });
  };

  const toggleMediaSelection = (id: string) => {
    setNewPlaylist(prev => {
      const selected = prev.selectedMedia.includes(id)
        ? prev.selectedMedia.filter(mid => mid !== id)
        : [...prev.selectedMedia, id];
      return { ...prev, selectedMedia: selected };
    });
  };

  return (
    <div className="space-y-12 animate-slide-up pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-primary rounded-full shadow-glow-cyan" />
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Sequence <span className="text-primary">Architect</span></h1>
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em] mt-1">Manifest Construction & Logic Mapping</p>
            </div>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="group flex items-center gap-3 bg-primary px-8 py-3.5 rounded-2xl text-black font-black text-[11px] uppercase tracking-widest shadow-glow-cyan hover:shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> Orchestrate Playlist
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Existing Playlists */}
        <div className={`space-y-6 ${isCreating ? 'xl:col-span-4' : 'xl:col-span-12'}`}>
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3 uppercase tracking-widest">
                    <List className="w-5 h-5 text-slate-500" />
                    <h2 className="text-xs font-black text-slate-400">MANIFEST_REGISTRY</h2>
                </div>
            </div>

            <div className={`grid gap-6 ${isCreating ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {playlists.map((pl) => (
                    <GlowCard key={pl.playlistId} className="p-8 border-white/5 group hover:bg-white/5 transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/10 group-hover:border-primary/20 transition-all group-hover:shadow-glow-cyan-sm">
                                <PlaySquare className="w-7 h-7" />
                            </div>
                            <StatusBadge status="online" className="bg-primary/10 border border-primary/20 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-primary italic">ACTIVE</StatusBadge>
                        </div>
                        <h3 className="text-lg font-black text-foreground uppercase tracking-tighter italic mb-2 truncate">{pl.name}</h3>
                        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <Box className="w-4 h-4 text-slate-700" />
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{pl.items.length} Modules</span>
                            </div>
                             <div className="flex items-center gap-3">
                                <LayoutTemplate className="w-4 h-4 text-slate-700" />
                                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">v3 Protocol</span>
                            </div>
                        </div>
                    </GlowCard>
                ))}
                
                {playlists.length === 0 && !isCreating && (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-black/20 text-slate-700 group cursor-pointer hover:bg-white/5 transition-all" onClick={() => setIsCreating(true)}>
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/5 opacity-10 group-hover:opacity-100 group-hover:text-primary group-hover:border-primary/20 transition-all">
                             <Plus className="w-10 h-10 transition-transform group-hover:rotate-90" />
                        </div>
                        <p className="text-xs font-mono uppercase tracking-[0.2em] italic">ZERO_MANIFEST_DATA_STRUCTURES_LOCATED</p>
                    </div>
                )}
            </div>
        </div>

        {/* Creator Section */}
        {isCreating && (
          <div className="xl:col-span-8 space-y-8 animate-in slide-in-from-right duration-500">
             <GlowCard className="p-10 border-primary/20 bg-black/40 relative group overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 pb-10 border-b border-white/5">
                    <div className="space-y-4 flex-1 w-full">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono ml-1">Establish Manifest ID</label>
                        <input 
                            className="bg-transparent text-3xl font-black text-foreground uppercase tracking-tighter outline-none focus:text-primary transition-colors italic w-full border-b border-white/5 pb-2 border-transparent focus:border-primary/20"
                            placeholder="MANIFEST_ALias_v01..."
                            value={newPlaylist.name}
                            onChange={(e) => setNewPlaylist({...newPlaylist, name: e.target.value})}
                            autoFocus
                        />
                    </div>
                    <div className="flex gap-4 shrink-0">
                        <button 
                            onClick={() => setIsCreating(false)}
                            className="px-8 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                        >
                            Abort
                        </button>
                        <button 
                            onClick={handleCreate}
                            disabled={!newPlaylist.name || newPlaylist.selectedMedia.length === 0}
                            className="flex items-center gap-3 bg-primary px-10 py-4 rounded-2xl text-black font-black text-[11px] uppercase tracking-widest shadow-glow-cyan hover:shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:scale-100"
                        >
                            <Save className="w-5 h-5" /> Initialize Sequence
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   {/* Module Selection */}
                   <div className="space-y-8">
                       <div className="flex items-center gap-3">
                           <Layout className="w-5 h-5 text-primary shadow-glow-cyan" />
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">MAP_MODULE_PAYLOADS ({newPlaylist.selectedMedia.length})</h3>
                       </div>
                       <div className="grid grid-cols-2 gap-4 h-[400px] overflow-y-auto pr-4 no-scrollbar">
                           {mediaItems.map((m) => (
                               <div 
                                   key={m.mediaId}
                                   onClick={() => toggleMediaSelection(m.mediaId)}
                                   className={`relative group cursor-pointer border rounded-2xl overflow-hidden aspect-square transition-all ${
                                       newPlaylist.selectedMedia.includes(m.mediaId) 
                                       ? 'border-primary ring-1 ring-primary/30' 
                                       : 'border-white/5 hover:border-white/20'
                                   }`}
                               >
                                   <img src={m.previewUrl} className={`w-full h-full object-cover transition-all duration-700 ${newPlaylist.selectedMedia.includes(m.mediaId) ? 'scale-110 opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60'}`} />
                                   <div className={`absolute inset-0 bg-primary/20 opacity-0 transition-opacity ${newPlaylist.selectedMedia.includes(m.mediaId) ? 'opacity-100' : ''}`} />
                                   <div className="absolute top-3 right-3">
                                       <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                            newPlaylist.selectedMedia.includes(m.mediaId) 
                                            ? 'bg-primary border-primary text-black' 
                                            : 'bg-black/40 border-white/20 text-transparent'
                                       }`}>
                                           <ChevronRight className="w-3 h-3 rotate-90" />
                                       </div>
                                   </div>
                                   <div className="absolute bottom-4 left-4 right-4">
                                       <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate drop-shadow-lg">{m.name}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>

                   {/* Protocol Configuration */}
                   <div className="space-y-8">
                        <div className="flex items-center gap-3">
                           <Settings2 className="w-5 h-5 text-accent shadow-glow-purple" />
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">PROTOCOL_OVERRIDE</h3>
                        </div>
                        <div className="space-y-6">
                            <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 italic">Active Render Engine</label>
                            <div className="space-y-3">
                                {templates.map(tpl => (
                                    <div 
                                        key={tpl.templateId}
                                        onClick={() => setNewPlaylist({...newPlaylist, templateId: tpl.templateId})}
                                        className={`p-5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                                            newPlaylist.templateId === tpl.templateId 
                                            ? 'bg-accent/10 border-accent/40 ring-1 ring-accent/20' 
                                            : 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newPlaylist.templateId === tpl.templateId ? 'bg-accent/20 text-accent shadow-glow-purple-sm' : 'bg-black/20 text-slate-800'}`}>
                                                <LayoutTemplate className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`text-xs font-black uppercase tracking-tighter italic ${newPlaylist.templateId === tpl.templateId ? 'text-foreground' : 'text-slate-600'}`}>{tpl.name}</p>
                                                <p className="text-[9px] font-mono text-slate-700 uppercase tracking-widest mt-0.5">Manifest Proto: 3.0</p>
                                            </div>
                                        </div>
                                        <div className={`w-2.5 h-2.5 rounded-full ${newPlaylist.templateId === tpl.templateId ? 'bg-accent shadow-glow-purple animate-pulse' : 'bg-white/5'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 p-8 bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden">
                             <Zap className="absolute -right-8 -bottom-8 w-24 h-24 text-primary opacity-5 rotate-12" />
                             <div className="flex items-center gap-3 text-primary mb-3">
                                <Activity className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">SEQUENCE_PREFLIGHT_OK</span>
                             </div>
                             <p className="text-[10px] text-slate-600 font-mono leading-relaxed uppercase tracking-wider">
                                Deterministic order established. Total cycle duration: <span className="text-primary font-bold">{newPlaylist.selectedMedia.length * 10}S</span>. Memory allocation within heap limits.
                             </p>
                        </div>
                   </div>
                </div>
             </GlowCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistBuilder;
