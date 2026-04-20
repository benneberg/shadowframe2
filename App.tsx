
import React, { useState, useEffect } from 'react';
import { ViewState } from './types';
import Dashboard from './components/Dashboard';
import MediaLibrary from './components/MediaLibrary';
import PlaylistBuilder from './components/PlaylistBuilder';
import TemplatesManager from './components/TemplatesManager';
import DeviceRegistry from './components/DeviceRegistry';
import DebugInspector from './components/DebugInspector';
import ProvisioningView from './components/ProvisioningView';
import VirtualPlayer from './components/VirtualPlayer';
import HelpCenter from './components/HelpCenter';
import { 
  Layout, 
  PlaySquare, 
  FileCode, 
  Monitor, 
  Bug, 
  Zap, 
  Smartphone, 
  PlayCircle,
  Home,
  Menu,
  X,
  Info
} from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewState>('home');
  const [previousTab, setPreviousTab] = useState<ViewState>('home');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard onNavigate={setActiveTab} />;
      case 'media': return <MediaLibrary onNavigate={setActiveTab} />;
      case 'playlist': return <PlaylistBuilder onNavigate={setActiveTab} />;
      case 'templates': return <TemplatesManager onNavigate={setActiveTab} />;
      case 'devices': return <DeviceRegistry onNavigate={setActiveTab} />;
      case 'debug': return <DebugInspector onNavigate={setActiveTab} />;
      case 'provision': return <ProvisioningView onNavigate={setActiveTab} />;
      case 'player': return <VirtualPlayer onNavigate={setActiveTab} />;
      case 'help': return <HelpCenter onNavigate={setActiveTab} />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'media', label: 'Media', icon: <Layout className="w-5 h-5" /> },
    { id: 'playlist', label: 'Playlists', icon: <PlaySquare className="w-5 h-5" /> },
    { id: 'devices', label: 'Devices', icon: <Monitor className="w-5 h-5" /> },
    { id: 'provision', label: 'Provision', icon: <Zap className="w-5 h-5" /> },
    { id: 'templates', label: 'Templates', icon: <FileCode className="w-5 h-5" /> },
    { id: 'debug', label: 'Debug', icon: <Bug className="w-5 h-5" /> },
    { id: 'player', label: 'Engine', icon: <PlayCircle className="w-5 h-5" /> },
    { id: 'help', label: 'Help', icon: <Info className="w-5 h-5" /> },
  ];

  const handleTabChange = (id: ViewState) => {
    if (id !== activeTab) {
      setPreviousTab(activeTab);
    }
    setActiveTab(id);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleHelp = () => {
    if (activeTab === 'help') {
      handleTabChange(previousTab === 'help' ? 'home' : previousTab);
    } else {
      handleTabChange('help');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0 md:pl-64 flex flex-col font-sans transition-colors duration-500">
      {/* Global Top Bar (Mobile/Desktop Header) */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/5 px-4 py-3 md:px-10 md:py-4 flex justify-between items-center md:hidden">
        <h1 className="text-lg font-black text-foreground flex items-center gap-3 italic tracking-tighter uppercase">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20 shadow-glow-cyan">
            <Smartphone className="w-4 h-4" />
          </div>
          <span className="truncate">Signage <span className="text-primary">Lab</span></span>
        </h1>
        <button 
          onClick={toggleHelp}
          className={`p-2.5 rounded-xl transition-all ${
            activeTab === 'help' ? 'bg-primary text-black shadow-glow-cyan' : 'bg-white/5 text-slate-500 hover:text-white'
          }`}
        >
          <Info className="w-5 h-5" />
        </button>
      </header>

      {/* Desktop Info Toggle */}
      <div className="hidden md:flex fixed top-8 right-8 z-[100]">
        <button 
          onClick={toggleHelp}
          className={`group flex items-center gap-4 px-6 py-3 rounded-2xl transition-all duration-500 shadow-2xl border ${
            activeTab === 'help' 
              ? 'bg-primary border-primary/20 text-black shadow-glow-cyan' 
              : 'bg-black/60 border-white/5 text-slate-500 hover:text-primary hover:border-primary/20 hover:bg-primary/5'
          }`}
        >
          <div className={`p-1.5 rounded-lg transition-colors ${activeTab === 'help' ? 'bg-black/20 text-black' : 'bg-white/5 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary'}`}>
            <Info className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{activeTab === 'help' ? 'Return to Cluster' : 'Core Ops Protocol'}</span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-black/40 backdrop-blur-3xl border-r border-white/5 z-50">
        <div className="p-10">
          <h1 className="text-2xl font-black text-foreground flex items-center gap-3 tracking-tighter uppercase italic">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-glow-cyan">
              <Smartphone className="w-6 h-6" />
            </div>
            Signage <span className="text-primary">Lab</span>
          </h1>
          <p className="text-[9px] text-slate-600 mt-4 uppercase font-black tracking-[0.3em] opacity-80">EDGE_RUNTIME v3.0</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id as ViewState)}
              className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl transition-all duration-300 relative group ${
                activeTab === item.id 
                  ? 'bg-primary/10 text-primary font-bold border border-primary/20' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              {activeTab === item.id && (
                <div className="absolute left-0 w-1.5 h-6 bg-primary rounded-full -translate-x-1 shadow-glow-cyan" />
              )}
              <span className={`transition-transform duration-300 group-hover:scale-110 ${activeTab === item.id ? 'text-primary' : 'opacity-50'}`}>{item.icon}</span>
              <span className="text-[11px] uppercase font-bold tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group cursor-pointer hover:bg-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" className="w-full h-full opacity-80" alt="Avatar" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-foreground uppercase tracking-tight truncate">Commander Alex</p>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-glow-cyan" />
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.1em]">SUPERUSER</p>
                </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-12 max-w-7xl mx-auto w-full">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-2xl border-t border-white/5 flex justify-around p-4 z-50 rounded-t-[2.5rem] shadow-glow-card">
        {[navItems[0], navItems[1], navItems[2], navItems[3]].map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id as ViewState)}
            className={`flex flex-col items-center gap-2 flex-1 py-1 transition-all duration-300 ${
              activeTab === item.id ? 'text-primary scale-110' : 'text-slate-600'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === item.id ? 'bg-primary/10 shadow-glow-cyan-sm border border-primary/20' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col items-center gap-2 flex-1 py-1 text-slate-600"
        >
          <div className="p-2 border border-transparent">
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">More</span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] md:hidden animate-in fade-in duration-300">
           <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-white/5 rounded-t-[3rem] p-10 pb-16 animate-in slide-in-from-bottom-full duration-500">
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic">System <span className="text-primary">Modules</span></h2>
                 <button onClick={() => setIsMenuOpen(false)} className="p-3 bg-white/5 rounded-full border border-white/10">
                    <X className="w-6 h-6 text-slate-400" />
                 </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {navItems.map(item => (
                   <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as ViewState)}
                    className={`flex items-center gap-4 p-5 rounded-[2rem] border transition-all duration-300 ${
                       activeTab === item.id 
                        ? 'bg-primary/10 border-primary/30 text-primary shadow-glow-cyan' 
                        : 'bg-white/5 border-white/5 text-slate-500'
                    }`}
                   >
                     <div className={activeTab === item.id ? 'text-primary' : 'text-slate-600'}>
                        {item.icon}
                     </div>
                     <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                   </button>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
