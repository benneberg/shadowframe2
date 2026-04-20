
import React, { useState } from 'react';
import { ViewState } from '../types';
import { GlowCard } from './ui/Shared';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  Info, 
  ChevronDown, 
  ChevronUp,
  Monitor,
  Layout,
  PlaySquare,
  Zap,
  Smartphone,
  Cpu,
  ShieldCheck,
  Globe,
  Terminal,
  Activity
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "How do I provision a new node cluster?",
    answer: "Navigate to the 'FLEET' control panel. Assign a unique Node UID and define the underlying hardware specification (e.g. LG WebOS, Android SoC). Once authorized, the node enters the discovery grid."
  },
  {
    question: "Can I implement custom OpenGL/WebGL shaders?",
    answer: "Affirmative. The 'TEMPLATES' engine supports full hardware-accelerated canvas contexts. Inject custom GLSL via the JS snippet field to manipulate texture buffers in real-time."
  },
  {
    question: "What media encoding standards are supported?",
    answer: "The kernel supports H.264 High Profile, HEVC (H.265), and AV1. All containers must maintain deterministic frame rates to ensure zero-gap A/B slot decoding."
  },
  {
    question: "Describe the 'Virtual Runtime' architecture.",
    answer: "The Virtual Runtime is a high-fidelity simulation of the production node kernel. It executes provided manifests, simulates network latency, and manages local asset caching via Blob-abstraction."
  },
  {
    question: "Is offline execution supported by default?",
    answer: "Yes. The edge runtime implements a dual-layer caching strategy. Manifests are cached in LocalStorage while binary blobs (Video/Images) are persisted in a sandboxed filesystem (IndexedDB)."
  },
  {
    question: "What is the 'Signage Lab' design philosophy?",
    answer: "Deterministic execution. Polished aesthetics. Scalable orchestration. We build low-latency signage systems that feel like professional broadcast hardware."
  }
];

const INSTRUCTIONS = [
  {
    title: "1. INGEST_ASSETS",
    description: "Populate the cloud-isolated media vault with high-definition visual payloads for edge distribution.",
    icon: <Layout className="w-5 h-5 text-primary" />
  },
  {
    title: "2. BIND_SEQUENCES",
    description: "Construct logical content loops and map them to visual layout primitives in the sequence architect.",
    icon: <PlaySquare className="w-5 h-5 text-primary" />
  },
  {
    title: "3. AUTHORIZE_HARDWARE",
    description: "provision physical screen identities in the fleet registry to establish a trust handshake with the cloud.",
    icon: <Monitor className="w-5 h-5 text-primary" />
  },
  {
    title: "4. EXECUTE_RUNTIME",
    description: "Initialize the edge signage kernel to begin real-time content orchestration on the target node.",
    icon: <Zap className="w-5 h-5 text-primary" />
  }
];

interface HelpCenterProps {
  onNavigate?: (view: ViewState) => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaqs = FAQ_DATA.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInstructions = INSTRUCTIONS.filter(ins => 
    ins.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ins.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16 animate-slide-up pb-32 pt-8 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto border border-primary/20 shadow-glow-cyan/10 mb-8">
          <Info className="w-10 h-10" />
        </div>
        <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase">
          Command <span className="text-primary italic">Protocol</span> Library
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto leading-relaxed font-mono text-xs uppercase tracking-widest">
          Comprehensive documentation for the <span className="text-primary font-bold">EDGE_SIGNAGE_RUNTIME_v3.0</span>. 
          Hardware-accelerated content orchestration for high-density node clusters.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-3xl mx-auto group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-2xl blur-md opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
          <input 
            type="text"
            placeholder="SEARCH PROTOCOLS, KERNEL OPS, OR DIAGNOSTIC CODES..."
            className="w-full pl-16 pr-6 py-6 bg-black/60 border border-white/10 rounded-2xl text-xs font-mono text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-800 uppercase tracking-widest"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8">
        <div className="lg:col-span-8 space-y-16">
          {/* Instructions */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">Operational Deployment Guide</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredInstructions.map((item, idx) => (
                <GlowCard key={idx} className="p-8 border-white/5 hover:bg-white/5 transition-all group/card">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover/card:bg-primary/10 group-hover/card:shadow-glow-cyan-sm transition-all border border-transparent group-hover/card:border-primary/20">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-foreground mb-3 uppercase tracking-tighter text-base">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-mono uppercase tracking-wider">{item.description}</p>
                </GlowCard>
              ))}
              {filteredInstructions.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-700 font-mono text-xs uppercase italic bg-black/20 rounded-2xl border-2 border-dashed border-white/5">
                  Search query returned zero documentation modules for "{searchQuery}"
                </div>
              )}
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground tracking-tight uppercase">Terminal Support Inquiries</h2>
            </div>

            <div className="space-y-4">
              {filteredFaqs.map((faq, idx) => (
                <div key={idx} className="bg-black/40 rounded-2xl border border-white/5 overflow-hidden shadow-xl transition-all hover:border-primary/30 group">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left"
                  >
                    <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-primary transition-colors uppercase tracking-[0.1em]">{faq.question}</span>
                    <div className={`transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4 text-slate-700 group-hover:text-primary" />
                    </div>
                  </button>
                  {openFaq === idx && (
                    <div className="px-8 pb-8 animate-in slide-in-from-top-2 duration-300">
                      <div className="pt-6 border-t border-white/5">
                        <p className="text-xs text-slate-500 leading-loose font-mono uppercase tracking-wider">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filteredFaqs.length === 0 && (
                <div className="py-12 text-center text-slate-700 font-mono text-xs uppercase italic bg-black/20 rounded-2xl border-2 border-dashed border-white/5">
                  Protocol database returned null for specified query.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-10">
          <GlowCard className="p-10 border-white/5 bg-black/60 relative overflow-hidden group">
            <ShieldCheck className="absolute -right-12 -bottom-12 w-48 h-48 text-primary/5 rotate-12 transition-transform group-hover:rotate-0 duration-1000" />
            <h3 className="text-lg font-black tracking-tighter uppercase mb-2">Cluster Metrics</h3>
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.2em] mb-8">Edge System Parameters</p>
            
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-end border-b border-white/5 pb-3 group/item">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest group-hover/item:text-primary transition-colors">OS_VERSION</span>
                <span className="text-xs font-black font-mono">3.0.41-BETA</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-3 group/item">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest group-hover/item:text-primary transition-colors">RUNTIME_TYPE</span>
                <span className="text-[10px] font-black font-mono text-primary uppercase tracking-[0.15em] bg-primary/10 px-2 py-0.5 rounded border border-primary/20">DETERMINISTIC</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-3 group/item">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest group-hover/item:text-primary transition-colors">SYNC_PROTOCOL</span>
                <span className="text-xs font-black font-mono">MQTT_SHADOW_v2</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-3 group/item">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest group-hover/item:text-primary transition-colors">SECURITY_LAYER</span>
                <span className="text-[10px] font-black font-mono text-emerald-500 uppercase tracking-[0.15em] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">CAPSULE_ISO</span>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex items-center gap-3 text-emerald-500 mb-2">
                    <Activity className="w-4 h-4" />
                    <span className="text-[9px] font-mono font-black uppercase tracking-[0.3em]">Network Heartbeat Stable</span>
                </div>
                <p className="text-[9px] text-slate-600 leading-relaxed font-mono uppercase tracking-widest">
                  Live connection established with the Global Edge Cloud. Automated failover protocols are active for decentralized screen playback.
                </p>
            </div>
          </GlowCard>

          <GlowCard className="p-8 border-primary/20 bg-primary/5">
            <h4 className="text-xs font-black text-primary uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
                <Terminal className="w-4 h-4 shadow-glow-cyan" /> DEBUG_DIRECTIVE
            </h4>
             <p className="text-[10px] text-slate-400 leading-loose font-mono uppercase tracking-wider">
              Requires administrative clearance? Utilize the <span className="text-primary font-bold">KERNEL MONITOR</span> module to intercept raw telemetry packages and WebSocket diagnostic heartbeats.
            </p>
          </GlowCard>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
