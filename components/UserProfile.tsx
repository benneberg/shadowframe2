import React, { useState, useEffect } from 'react';
import { ViewState, User } from '../types';
import { storage } from '../services/storage';
import { GlowCard } from './ui/Shared';
import { 
  User as UserIcon, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Camera, 
  LogOut, 
  Save, 
  Calendar,
  Key,
  Smartphone,
  Eye,
  EyeOff,
  Activity
} from 'lucide-react';

interface UserProfileProps {
  onNavigate: (view: ViewState) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<User>(storage.getUser());
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [editForm, setEditForm] = useState({
    username: user.username,
    email: user.email,
    password: '',
    confirmPassword: ''
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      alert("Passwords don't match");
      setIsSaving(false);
      return;
    }

    const updatedUser: User = {
      ...user,
      username: editForm.username,
      email: editForm.email,
      password: editForm.password || user.password
    };

    setTimeout(() => {
      storage.saveUser(updatedUser);
      setUser(updatedUser);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const updateAvatar = () => {
    const seed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    const updated = { ...user, profilePicture: newAvatar };
    storage.saveUser(updated);
    setUser(updated);
  };

  return (
    <div className="space-y-12 animate-slide-up pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-accent rounded-full shadow-glow-purple" />
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase italic">IDENTITY <span className="text-accent">VAULT</span></h1>
                <p className="text-[10px] text-slate-600 font-mono uppercase tracking-[0.3em] mt-1">Personnel Management & Security Protocols</p>
            </div>
        </div>
        <button 
          onClick={() => onNavigate('home')}
          className="group flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-3.5 rounded-2xl text-slate-400 font-black text-[11px] uppercase tracking-widest hover:border-accent/30 hover:text-accent transition-all"
        >
          <LogOut className="w-5 h-5 mr-3" /> Terminate Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
            <GlowCard className="p-10 border-white/5 bg-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <ShieldCheck className="w-32 h-32 rotate-12" />
                </div>
                
                <div className="flex flex-col items-center text-center">
                    <div className="relative group/avatar mb-8">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center p-1 border-2 border-white/10 shadow-glow-purple/20 group-hover:shadow-glow-purple transition-all duration-500 overflow-hidden">
                            <img 
                                src={user.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" 
                                alt="Profile"
                            />
                        </div>
                        <button 
                            onClick={updateAvatar}
                            className="absolute -bottom-2 -right-2 p-3 bg-accent text-black rounded-2xl shadow-glow-purple hover:scale-110 active:scale-95 transition-all"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter italic mb-1">{user.username}</h2>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-8">{user.email}</p>

                    <div className="w-full space-y-4 pt-8 border-t border-white/5">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-slate-600" />
                                <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Enrolled</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                            <div className="flex items-center gap-3">
                                <Smartphone className="w-4 h-4 text-slate-600" />
                                <span className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Two-Factor</span>
                            </div>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic">ENABLED</span>
                        </div>
                    </div>
                </div>
            </GlowCard>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-8">
            <GlowCard className="p-10 border-white/5 bg-black/40">
                <div className="flex items-center gap-3 text-accent mb-10">
                    <UserIcon className="w-5 h-5 shadow-glow-purple" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">ACCOUNT_SYNCHRONIZATION</span>
                </div>

                <form onSubmit={handleUpdate} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">OPERATOR_IDENTIFIER</label>
                            <div className="relative">
                                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                <input 
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-[13px] font-bold text-foreground focus:border-accent/30 outline-none transition-all"
                                    value={editForm.username}
                                    onChange={e => setEditForm({...editForm, username: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">COMMUNICATION_UPLINK</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                <input 
                                    type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-[13px] font-bold text-foreground focus:border-accent/30 outline-none transition-all"
                                    value={editForm.email}
                                    onChange={e => setEditForm({...editForm, email: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">CIPHER_PROTOCOL (NEW)</label>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="LEAVE BLANK TO RETAIN..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-4 text-sm font-mono text-foreground focus:border-accent/30 outline-none transition-all placeholder:text-slate-800"
                                    value={editForm.password}
                                    onChange={e => setEditForm({...editForm, password: e.target.value})}
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-accent transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] ml-1">CONFIRMATION_STRING</label>
                            <div className="relative">
                                <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="RE-ENTER PROTOCOL..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-sm font-mono text-foreground focus:border-accent/30 outline-none transition-all placeholder:text-slate-800"
                                    value={editForm.confirmPassword}
                                    onChange={e => setEditForm({...editForm, confirmPassword: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-8">
                        <div className="flex items-center gap-3">
                            {showSuccess ? (
                                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest animate-in fade-in slide-in-from-left-4 duration-500">
                                    <ShieldCheck className="w-4 h-4" /> IDENTITY_UPDATED
                                </div>
                            ) : (
                                <p className="text-[9px] text-slate-700 font-mono uppercase tracking-widest leading-relaxed">
                                    All updates are cryptographically hashed <br/> before persistent commits.
                                </p>
                            )}
                        </div>
                        <button 
                            type="submit"
                            disabled={isSaving}
                            className="bg-accent text-black px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-glow-purple hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
                        >
                            {isSaving ? <Activity className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            COMMIT_CHANGES
                        </button>
                    </div>
                </form>
            </GlowCard>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
