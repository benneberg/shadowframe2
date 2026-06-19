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
  Layout,
  Eye,
  GripVertical,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface PlaylistBuilderProps {
  onNavigate?: (view: ViewState) => void;
}

interface SortableMediaItemProps {
    id: string;
    name: string;
    url: string;
    onRemove: () => void;
}

// Sortable Item Component
const SortableMediaItem: React.FC<SortableMediaItemProps> = ({ id, name, url, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-primary/20 transition-all"
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-700 hover:text-primary transition-colors">
                <GripVertical className="w-5 h-5" />
            </div>
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/5">
                <img src={url} className="w-full h-full object-cover" alt={name} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-foreground uppercase tracking-tight truncate">{name}</p>
                <p className="text-[9px] text-slate-600 font-mono">ID: {id.slice(0, 8)}...</p>
            </div>
            <button 
                onClick={onRemove}
                className="p-2 text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
};

const PlaylistBuilder: React.FC<PlaylistBuilderProps> = ({ onNavigate }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [previewPlaylist, setPreviewPlaylist] = useState<Playlist | null>(null);
  
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    selectedMedia: [] as string[],
    templateId: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setNewPlaylist((prev) => {
        const oldIndex = prev.selectedMedia.indexOf(active.id as string);
        const newIndex = prev.selectedMedia.indexOf(over.id as string);
        
        return {
          ...prev,
          selectedMedia: arrayMove(prev.selectedMedia, oldIndex, newIndex),
        };
      });
    }
  };

  const toggleMediaSelection = (id: string) => {
    setNewPlaylist(prev => {
      const selected = prev.selectedMedia.includes(id)
        ? prev.selectedMedia.filter(mid => mid !== id)
        : [...prev.selectedMedia, id];
      return { ...prev, selectedMedia: selected };
    });
  };

  const getMediaById = (id: string) => mediaItems.find(m => m.mediaId === id);

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
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/10 group-hover:border-primary/20 transition-all group-hover:shadow-glow-cyan-sm cursor-pointer" onClick={() => setPreviewPlaylist(pl)}>
                                <PlaySquare className="w-7 h-7" />
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setPreviewPlaylist(pl)}
                                    className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-500 hover:text-primary hover:border-primary/20 transition-all"
                                    title="Preview Manifest"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <StatusBadge status="online" className="bg-primary/10 border border-primary/20 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-primary italic">ACTIVE</StatusBadge>
                            </div>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                   {/* Module Selection */}
                   <div className="lg:col-span-1 space-y-8">
                       <div className="flex items-center gap-3">
                           <Layout className="w-5 h-5 text-primary shadow-glow-cyan" />
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">MODULE_LIBRARY</h3>
                       </div>
                       <div className="grid grid-cols-2 gap-4 h-[500px] overflow-y-auto pr-4 no-scrollbar">
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
                               </div>
                           ))}
                       </div>
                   </div>

                   {/* Sortable Sequence */}
                   <div className="lg:col-span-1 space-y-8">
                        <div className="flex items-center gap-3">
                           <List className="w-5 h-5 text-emerald-500 shadow-glow-emerald" />
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">SEQUENCE_MAP ({newPlaylist.selectedMedia.length})</h3>
                       </div>
                       <div className="h-[500px] overflow-y-auto pr-4 no-scrollbar space-y-3">
                            <DndContext 
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext 
                                    items={newPlaylist.selectedMedia}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {newPlaylist.selectedMedia.map((id) => {
                                        const media = getMediaById(id);
                                        if (!media) return null;
                                        return (
                                            <SortableMediaItem 
                                                key={id} 
                                                id={id} 
                                                name={media.name} 
                                                url={media.previewUrl} 
                                                onRemove={() => toggleMediaSelection(id)}
                                            />
                                        );
                                    })}
                                </SortableContext>
                            </DndContext>
                            {newPlaylist.selectedMedia.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-white/5 rounded-3xl p-10 text-center">
                                    <Zap className="w-10 h-10 mb-4 opacity-10" />
                                    <p className="text-[10px] font-mono uppercase tracking-widest leading-relaxed">Sequence empty. Select modules from library to populate manifest.</p>
                                </div>
                            )}
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

      {/* Preview Modal */}
      <AnimatePresence>
        {previewPlaylist && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setPreviewPlaylist(null)}
                    className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-5xl bg-card border border-white/10 rounded-[2.5rem] shadow-glow-card overflow-hidden flex flex-col max-h-[90vh]"
                >
                    <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-glow-cyan">
                                <PlaySquare className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2">MANIFEST_PREVIEW</p>
                                <h3 className="text-3xl font-black text-foreground uppercase tracking-tighter italic">{previewPlaylist.name}</h3>
                            </div>
                        </div>
                        <button 
                            onClick={() => setPreviewPlaylist(null)}
                            className="p-4 bg-white/5 hover:bg-red-500/10 hover:text-red-500 rounded-2xl border border-white/5 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {previewPlaylist.items.map((item, idx) => (
                                <div key={idx} className="group relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black/40">
                                    <img 
                                        src={item.url} 
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                                        alt={`Item ${idx + 1}`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-3 left-3">
                                        <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-lg">
                                            <span className="text-[9px] font-black text-primary uppercase">MODULE_{idx + 1}</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{item.type} protocol</p>
                                        <p className="text-[8px] text-slate-400 font-mono mt-0.5">{item.duration}S EXPOSURE</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 border-t border-white/5 bg-white/5 flex items-center justify-between">
                        <div className="flex gap-10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">TOTAL_RUNTIME</span>
                                <span className="text-sm font-black text-primary font-mono">{previewPlaylist.items.reduce((acc, i) => acc + i.duration, 0)}S</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">MODULE_COUNT</span>
                                <span className="text-sm font-black text-foreground font-mono">{previewPlaylist.items.length} UNITS</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setPreviewPlaylist(null)}
                            className="bg-primary text-black font-black text-[11px] uppercase tracking-widest px-10 py-4 rounded-2xl shadow-glow-cyan hover:scale-105 active:scale-95 transition-all"
                        >
                            Close Preview
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Add X icon to imports

export default PlaylistBuilder;
