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
    
    // Strict Admin check: optionally restrict to admin email on frontend too
    if (email.toLowerCase() !== 'admin@gmail.com') {
      toast.error('This entrance is restricted to the Master Admin only.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(email, password);
      if (res && res.role === 'admin') {
        toast.success('System Access Granted. Welcome, Master.');
        navigate('/admin');
      } else {
        toast.error('Unauthorized access attempt.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication Protocol Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] animate-pulse-slow font-delay-2000"></div>
      </div>

      <div className="w-full max-w-xl relative animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white/70 dark:bg-dark-900/70 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-gray-100 dark:border-dark-800 shadow-2xl relative overflow-hidden">
          {/* Header Section */}
          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-dark-900 dark:bg-white text-white dark:text-dark-900 mb-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 group">
               <ShieldCheck size={48} className="group-hover:scale-110 transition-transform" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-3 uppercase">Master Entrance</h1>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-widest uppercase">Administrative Security Protocol Required</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  placeholder="MASTER IDENTITY (EMAIL)"
                  required
                  className="w-full pl-16 pr-8 py-6 bg-gray-50 dark:bg-dark-950/50 border-2 border-transparent focus:border-brand-600 dark:focus:border-brand-500 rounded-3xl outline-none transition-all font-bold text-gray-900 dark:text-white text-sm tracking-widest placeholder:text-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="SECURITY KEY (PASSWORD)"
                  required
                  className="w-full pl-16 pr-8 py-6 bg-gray-50 dark:bg-dark-950/50 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-3xl outline-none transition-all font-bold text-gray-900 dark:text-white text-sm tracking-widest placeholder:text-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-dark-900 dark:bg-white text-white dark:text-dark-900 py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl disabled:opacity-50 group"
              >
                {loading ? (
                  <Activity size={20} className="animate-spin" />
                ) : (
                  <>
                    Initiate Connection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* System Footer */}
          <div className="mt-12 text-center border-t border-gray-100 dark:border-dark-800 pt-8 opacity-50">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Authorized Access Only</p>
            <p className="text-[10px] font-medium text-gray-300 mt-1 italic tracking-widest">© Platform Security Grid 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
