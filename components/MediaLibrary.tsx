import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { ViewState, Media } from '../types';
import { StatusBadge, GlowCard } from './ui/Shared';
import { 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  Layout, 
  X,
  Image as ImageIcon,
  Video as VideoIcon,
  Code,
  Tag,
  Clock,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface MediaLibraryProps {
  onNavigate?: (view: ViewState) => void;
}

const MediaLibrary: React.FC<MediaLibraryProps> = ({ onNavigate }) => {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'html'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedia, setNewMedia] = useState({ name: '', url: '', type: 'image' as Media['type'] });

  useEffect(() => {
    setMediaList(storage.getMedia());
  }, []);

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedia.name || !newMedia.url) return;

    const mediaItem: Media = {
      mediaId: `m-${Date.now()}`,
      name: newMedia.name.toUpperCase(),
      url: newMedia.url,
      previewUrl: newMedia.type === 'image' ? newMedia.url : 'https://picsum.photos/seed/video/320/180',
      type: newMedia.type,
      duration: 10,
      createdAt: new Date().toISOString()
    };

    const updatedMediaList = storage.saveMedia(mediaItem);
    setMediaList(updatedMediaList);
    setNewMedia({ name: '', url: '', type: 'image' });
    setShowAddModal(false);
  };

  const removeMedia = (id: string) => {
    const updated = storage.deleteMedia(id);
    setMediaList(updated);
  };

  const filteredMedia = (mediaList || []).filter(m => {
    const matchesSearch = m.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || m.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-12 animate-slide-up pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-primary rounded-full shadow-glow-cyan" />
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Media <span className="text-primary">Vault</span></h1>
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em] mt-1">Asset Repository & Distribution</p>
            </div>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="group flex items-center gap-3 bg-primary px-8 py-3.5 rounded-2xl text-black font-black text-[11px] uppercase tracking-widest shadow-glow-cyan hover:shadow-cyan-500/40 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> Ingest Payload
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="FILTER ASSETS BY NAME, TYPE, OR TAG..."
            className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-mono text-foreground focus:border-primary/30 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-800 uppercase tracking-widest"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {['all', 'image', 'video', 'html'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${
                filterType === type 
                  ? 'bg-primary/10 border-primary/30 text-primary shadow-glow-cyan-sm' 
                  : 'bg-white/5 border-white/5 text-slate-600 hover:text-slate-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredMedia.map((m) => (
          <GlowCard key={m.mediaId} className="group relative border-white/5 hover:bg-white/10 transition-all flex flex-col overflow-hidden">
            <div className="aspect-video relative overflow-hidden bg-black/40">
              <img 
                src={m.previewUrl} 
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" 
                alt={m.name}
              />
              <div className="absolute top-4 left-4">
                <StatusBadge status="online" className="bg-black/60 backdrop-blur-md px-3 py-1 font-black text-[9px] uppercase tracking-widest border border-white/10">
                    {m.type}
                </StatusBadge>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                 <button className="w-full py-2.5 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white/20 transition-all">
                    Full Spectrum Preview
                 </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 border border-white/5 group-hover:border-primary/30 transition-colors">
                    {m.type === 'image' ? <ImageIcon className="w-5 h-5" /> : m.type === 'video' ? <VideoIcon className="w-5 h-5" /> : <Code className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-black text-foreground truncate w-32 uppercase tracking-tighter">{m.name}</h3>
                    <p className="text-[9px] text-slate-600 mt-1 uppercase font-mono flex items-center gap-2">
                        <Clock className="w-3 h-3" /> {new Date(m.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => removeMedia(m.mediaId)}
                  className="p-3 text-slate-700 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </GlowCard>
        ))}

        {filteredMedia.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-black/20 text-slate-700">
             <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Layout className="w-10 h-10 opacity-10" />
             </div>
             <p className="text-xs font-mono uppercase tracking-[0.2em] italic">Vault index returned empty for specified parameters.</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <GlowCard className="bg-card w-full max-w-lg relative z-50 p-10 border-white/10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-glow-cyan">
                    <Plus className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-foreground tracking-tighter uppercase italic">Ingest <span className="text-primary">Payload</span></h2>
                    <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mt-1">Establish new binary payload</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5"
              >
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleAddMedia} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Identity</label>
                <input 
                  type="text" 
                  placeholder="E.G. PROMO_BUMPER_MAIN"
                  className="w-full px-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-xs font-mono focus:border-primary/50 outline-none transition-all uppercase"
                  value={newMedia.name}
                  onChange={(e) => setNewMedia({...newMedia, name: e.target.value})}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Resource URL (CDN/S3)</label>
                <input 
                  type="url" 
                  placeholder="HTTPS://CDN.PROTOCOL.NETWORK/ASSETS/..."
                  className="w-full px-6 py-5 bg-black/40 border border-white/5 rounded-2xl text-xs font-mono focus:border-primary/50 outline-none transition-all"
                  value={newMedia.url}
                  onChange={(e) => setNewMedia({...newMedia, url: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Payload Classification</label>
                <div className="grid grid-cols-3 gap-3">
                  {['image', 'video', 'html'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewMedia({...newMedia, type: t as any})}
                      className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        newMedia.type === t 
                          ? 'bg-primary/20 border-primary/50 text-primary shadow-glow-cyan-sm' 
                          : 'bg-white/5 border-white/5 text-slate-600 hover:text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary py-5 rounded-2xl text-black font-black text-[11px] uppercase tracking-[0.3em] shadow-glow-cyan hover:shadow-cyan-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
              >
                Commit to Vault Registry
              </button>
            </form>
          </GlowCard>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
