import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { ViewState, Template } from '../types';
import { GlowCard, StatusBadge } from './ui/Shared';
import { 
  FileCode, 
  Code, 
  Palette, 
  Play, 
  Save, 
  Plus, 
  ExternalLink, 
  RefreshCw,
  Layout,
  Cpu,
  Zap,
  ChevronRight,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';

interface TemplatesManagerProps {
  onNavigate?: (view: ViewState) => void;
}

const TemplatesManager: React.FC<TemplatesManagerProps> = ({ onNavigate }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');

  useEffect(() => {
    setTemplates(storage.getTemplates());
  }, []);

  const handleSave = () => {
    if (!editingTemplate) return;
    const updated = storage.saveTemplate(editingTemplate);
    setTemplates(updated);
    setEditingTemplate(null);
  };

  const createNewTemplate = () => {
    const newTemplate: Template = {
      templateId: `tpl-${Date.now()}`,
      name: 'NEW_MODULE_PROTOCOL',
      html: '<div class="container">\n  <h1>{{media.name}}</h1>\n</div>',
      css: '.container {\n  padding: 2rem;\n  color: #00ffc6;\n}',
      js: 'console.log("Kernel module initialized");',
      createdAt: new Date().toISOString()
    };
    setEditingTemplate(newTemplate);
  };

  return (
    <div className="space-y-12 animate-slide-up pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-accent rounded-full shadow-glow-purple" />
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">Render <span className="text-accent">Architect</span></h1>
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em] mt-1">Template Engine & GL Layout Definition</p>
            </div>
        </div>
        <button 
          onClick={createNewTemplate}
          className="group flex items-center gap-3 bg-accent px-8 py-3.5 rounded-2xl text-black font-black text-[11px] uppercase tracking-widest shadow-glow-purple hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" /> Establish New Protocol
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Templates List */}
        <div className={`space-y-6 ${editingTemplate ? 'xl:col-span-4' : 'xl:col-span-12'}`}>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-5 bg-white/10 rounded-full" />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Available Protocols</h2>
            </div>
            <StatusBadge status="online" className="bg-white/5 px-2 py-0.5 text-[9px] font-mono border border-white/5 uppercase">
              DB_RES_OK
            </StatusBadge>
          </div>

          <div className={`grid gap-6 ${editingTemplate ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {templates.map((tpl) => (
              <GlowCard 
                key={tpl.templateId} 
                className={`p-6 border-white/5 hover:bg-white/5 transition-all group flex items-center justify-between cursor-pointer ${editingTemplate?.templateId === tpl.templateId ? 'border-accent/40 bg-accent/5 ring-1 ring-accent/20' : ''}`}
                onClick={() => setEditingTemplate(tpl)}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${editingTemplate?.templateId === tpl.templateId ? 'bg-accent/10 border-accent/30 text-accent shadow-glow-purple-sm' : 'bg-white/5 border-white/5 text-slate-600 group-hover:text-accent group-hover:border-accent/20'}`}>
                    <FileCode className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-black text-foreground truncate uppercase tracking-tighter italic">{tpl.name}</h3>
                    <p className="text-[10px] text-slate-600 font-mono mt-1 uppercase tracking-widest">ID: {tpl.templateId.toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <ChevronRight className={`w-5 h-5 transition-all ${editingTemplate?.templateId === tpl.templateId ? 'text-accent translate-x-1' : 'text-slate-800'}`} />
                </div>
              </GlowCard>
            ))}
            
            {templates.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-black/20 text-slate-800 group cursor-pointer hover:bg-white/5 transition-all" onClick={createNewTemplate}>
                 <Layers className="w-12 h-12 mb-6 opacity-10 group-hover:opacity-40 group-hover:text-accent" />
                 <p className="text-xs font-mono uppercase tracking-[0.2em] italic">Zero render protocols detected in local registry.</p>
              </div>
            )}
          </div>
        </div>

        {/* Editor Section */}
        {editingTemplate && (
          <div className="xl:col-span-8 animate-in slide-in-from-right duration-500">
            <GlowCard className="bg-black/40 border-accent/20 h-full flex flex-col p-8 overflow-hidden relative group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-white/5">
                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                      <Terminal className="w-5 h-5 text-accent shadow-glow-purple" />
                      <input 
                        className="bg-transparent text-xl font-black text-foreground uppercase tracking-tighter outline-none focus:text-accent transition-colors italic w-full md:w-auto"
                        value={editingTemplate.name}
                        onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                      />
                   </div>
                   <p className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.3em] ml-8">MODAL_LOGIC_DEF_3.0</p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button 
                        onClick={() => setEditingTemplate(null)}
                        className="px-6 py-3 bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all border border-transparent hover:border-white/10"
                    >
                        Discard
                    </button>
                    <button 
                        onClick={handleSave}
                        className="flex items-center gap-3 bg-accent px-8 py-3.5 rounded-xl text-black font-black text-[11px] uppercase tracking-widest shadow-glow-purple hover:shadow-purple-500/40 transition-all hover:scale-105 active:scale-95"
                    >
                        <Save className="w-5 h-5" /> Commit to Kernal
                    </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col space-y-6">
                <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/5 self-start">
                   {['html', 'css', 'js'].map((tab) => (
                     <button
                       key={tab}
                       onClick={() => setActiveTab(tab as any)}
                       className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                         activeTab === tab 
                           ? 'bg-accent text-black shadow-glow-purple-sm' 
                           : 'text-slate-600 hover:text-slate-300'
                       }`}
                     >
                       {tab}
                     </button>
                   ))}
                </div>

                <div className="relative flex-1 group">
                   <div className="absolute top-4 right-6 pointer-events-none text-[9px] font-mono text-slate-800 uppercase tracking-widest">
                     L: {editingTemplate[activeTab as keyof Template].toString().split('\n').length} | Syntax: {activeTab.toUpperCase()}
                   </div>
                   <textarea
                     className="w-full h-[500px] p-8 bg-black/40 border border-white/5 rounded-2xl text-sm font-mono text-accent leading-relaxed outline-none focus:border-accent/40 shadow-inner transition-all no-scrollbar resize-none"
                     spellCheck={false}
                     value={editingTemplate[activeTab as keyof Template]}
                     onChange={(e) => setEditingTemplate({...editingTemplate, [activeTab]: e.target.value})}
                   />
                </div>
              </div>

              {/* Scanline Detail */}
              <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-10">
                 <Activity className="w-16 h-16 animate-pulse text-accent" />
              </div>
            </GlowCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesManager;
