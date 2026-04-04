import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { ShieldCheck, Lock, Mail, ArrowRight, Activity } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (email.toLowerCase() !== 'admin@gmail.com') {
      toast.error('This entrance is restricted to the Master Admin only.');
      return;
    }

    setLoading(true);
    try {
      const { success, message } = await login(email, password);
      if (success) {
        toast.success('System Access Granted. Welcome, Master.');
        navigate('/admin');
      } else {
        toast.error(message || 'Unauthorized access attempt.');
      }
    } catch (err) {
      toast.error('Authentication Protocol Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans transition-colors duration-500">
      {/* 🌌 Advanced Animated Backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary Glows */}
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[160px] animate-pulse-slow"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[160px] animate-pulse-slow font-delay-2000"></div>
        
        {/* Dynamic Lines (Floating Tech Grid) */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        {/* Moving Particles */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-3/4 left-2/3 w-1 h-1 bg-white rounded-full animate-ping delay-700 opacity-20"></div>
        <div className="absolute top-1/2 left-4/5 w-1 h-1 bg-white rounded-full animate-ping delay-1000 opacity-20"></div>
      </div>

      <div className="w-full max-w-[500px] relative">
        {/* Outer Glow Wrapper */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[40px] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        
        <div className="relative bg-white dark:bg-white/[0.03] backdrop-blur-[40px] p-10 md:p-14 rounded-[40px] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden">
          {/* Internal Reflection Edge */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
          {/* Header Section */}
          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white mb-8 shadow-2xl transform hover:rotate-6 transition-transform duration-500 group relative">
               {/* Pulsing Shield Glow */}
               <div className="absolute inset-0 bg-white rounded-3xl animate-ping opacity-10"></div>
               <ShieldCheck size={40} className="relative z-10" />
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-[0.2em] mb-4 uppercase">
              Master Access
            </h1>
            <div className="flex items-center justify-center gap-3">
              <span className="h-[1px] w-8 bg-indigo-500/50"></span>
              <p className="text-[10px] font-bold text-indigo-400/80 tracking-[0.3em] uppercase">Auth-Protocol: Omega</p>
              <span className="h-[1px] w-8 bg-indigo-500/50"></span>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-4">
              <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-indigo-500/50 group-focus-within:text-indigo-400 transition-colors">
                    <Mail size={18} />
                 </div>
                <input 
                  type="email" 
                  placeholder="MASTER IDENTITY"
                  required
                  autoComplete="off"
                  className="w-full pl-14 pr-8 py-5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 focus:border-indigo-500/50 rounded-2xl outline-none transition-all font-bold text-gray-900 dark:text-white text-xs tracking-[0.2em] placeholder:text-gray-400 dark:placeholder:text-white/20 placeholder:font-medium uppercase"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-indigo-500/50 group-focus-within:text-indigo-400 transition-colors">
                    <Lock size={18} />
                 </div>
                <input 
                  type="password" 
                  placeholder="SECURITY KEY"
                  required
                  className="w-full pl-14 pr-8 py-5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 focus:border-indigo-500/50 rounded-2xl outline-none transition-all font-bold text-gray-900 dark:text-white text-xs tracking-[0.2em] placeholder:text-gray-400 dark:placeholder:text-white/20 placeholder:font-medium uppercase"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-lg shadow-brand-500/25 active:scale-[0.98] disabled:opacity-50 group relative overflow-hidden"
              >
                {loading ? (
                  <Activity size={18} className="animate-spin" />
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-2">
                       Establish Link <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    {/* Shimmer Effect */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-black/10 opacity-40 group-hover:animate-shimmer"></div>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* System Status Indicators */}
          <div className="mt-10 flex justify-between items-center opacity-30 text-[9px] font-bold text-gray-500 dark:text-white uppercase tracking-widest">
             <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Encryption Active
             </div>
             <div>Grid: 0xFF-72</div>
          </div>
        </div>
        
        {/* Footer Text */}
        <p className="mt-8 text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
          Classified Information • Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
