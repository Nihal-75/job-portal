import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled 
      ? 'bg-white/80 dark:bg-dark-900/80 backdrop-blur-lg shadow-sm py-3' 
      : 'bg-transparent py-5'
  }`;

  const linkClass = "font-medium text-gray-700 hover:text-brand-600 dark:text-gray-200 dark:hover:text-brand-400 transition-colors";
  const mobileLinkClass = "block py-3 text-lg font-medium text-gray-800 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800";

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          
          {/* Premium Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo Mark */}
            <div className="relative flex items-center justify-center w-10 h-10 overflow-visible">
               {/* Animated Background Glow */}
               <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-purple-600 dark:from-brand-500 dark:to-purple-500 rounded-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-brand-500/40"></div>
               {/* Inner shine */}
               <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-br from-white/30 to-transparent rounded-xl blur-[1px]"></div>
               {/* Rocket/Paper Plane SVG */}
               <svg className="w-5 h-5 text-white relative z-10 drop-shadow-md transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 2L2 22l10-6 10 6L12 2z"></path>
                 <path d="M12 2v14"></path>
               </svg>
            </div>
            
            {/* Logo Text */}
            <div className="flex flex-col justify-center">
              <span className={`text-[1.4rem] font-black tracking-tight leading-none transition-colors ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'}`}>
                Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">Spring</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#jobs" className={linkClass}>Jobs</a>
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
              title="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="px-4 py-2 font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 dark:text-brand-400 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 rounded-lg transition-colors">
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="px-4 py-2 font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className={linkClass}>Login</Link>
                <Link to="/register" className="px-5 py-2.5 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 shadow-sm hover:shadow-brand-500/30 hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
               {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-dark-900 shadow-xl border-t border-gray-100 dark:border-gray-800 animate-slide-up">
          <div className="flex flex-col px-6 py-4">
            <a href="/#jobs" className={mobileLinkClass} onClick={() => setMobileMenuOpen(false)}>Jobs</a>
            
            {user ? (
              <>
                <Link to="/dashboard" className={mobileLinkClass}>Dashboard</Link>
                <button 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left py-3 text-lg font-medium text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={mobileLinkClass}>Login</Link>
                <Link to="/register" className="w-full mt-4 py-3 bg-brand-600 text-white text-center font-medium rounded-xl shadow-md">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
