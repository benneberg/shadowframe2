import React from 'react';

/**
 * Shared UI Components for the Signage Lab Platform v3
 */

/**
 * StatusBadge - A deterministic signal indicator
 */
export const StatusBadge: React.FC<{
  status: 'online' | 'attention' | 'offline' | string;
  className?: string;
  children?: React.ReactNode;
}> = ({ status, className = '', children }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'online':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-glow-emerald-sm';
      case 'attention':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-glow-amber-sm';
      case 'offline':
        return 'bg-red-500/10 text-red-500 border-red-500/20 shadow-glow-red-sm';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyles()} ${className}`}>
      {children || status.toUpperCase()}
    </span>
  );
};

/**
 * GlowCard - A glassmorphism container with deterministic shadows
 */
export const GlowCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2rem] shadow-2xl relative overflow-hidden transition-all duration-500 ${onClick ? 'cursor-pointer hover:border-primary/20 hover:bg-card/60' : ''} ${className}`}
    >
      {/* Subtle depth highlights */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      {children}
    </div>
  );
};

/**
 * MetricCard - A high-fidelity data readout
 */
export const MetricCard: React.FC<{
  title: string;
  value: string | number;
  status: 'online' | 'attention' | 'offline';
  icon?: React.ReactNode;
  trend?: string;
}> = ({ title, value, status, icon, trend }) => {
  const colors = {
    online: 'text-primary',
    attention: 'text-amber-500',
    offline: 'text-red-500'
  };

  return (
    <GlowCard className="p-8 group hover:scale-[1.02] active:scale-[0.98]">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${colors[status]} group-hover:scale-110 transition-transform duration-500`}>
          {icon}
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">{title}</p>
        <h3 className="text-4xl font-black text-foreground tracking-tighter italic">{value}</h3>
      </div>
      {trend && (
        <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
           <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">{trend}</span>
           <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-primary shadow-glow-cyan animate-pulse' : 'bg-slate-800'}`} />
        </div>
      )}
    </GlowCard>
  );
};
