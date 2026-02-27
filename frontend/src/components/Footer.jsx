import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark-900 border-t border-dark-800 pt-16 pb-8 text-gray-300 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-32 bg-brand-500/10 mix-blend-screen filter blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 gap-y-16 mb-16">
          
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 group mb-6 w-fit cursor-pointer">
              <div className="relative flex items-center justify-center w-10 h-10 overflow-visible">
                 <div className="absolute inset-0 bg-gradient-to-tr from-brand-600 to-purple-600 dark:from-brand-500 dark:to-purple-500 rounded-xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-brand-500/40"></div>
                 <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-br from-white/30 to-transparent rounded-xl blur-[1px]"></div>
                 <svg className="w-5 h-5 text-white relative z-10 drop-shadow-md transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M12 2L2 22l10-6 10 6L12 2z"></path>
                   <path d="M12 2v14"></path>
                 </svg>
              </div>
              <div className="flex flex-col justify-center">
                <span className={`text-[1.4rem] font-black tracking-tight leading-none text-white transition-colors`}>
                  Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">Spring</span>
                </span>
              </div>
            </Link>
            <p className="text-gray-300 max-w-md leading-relaxed text-base font-medium mb-4">
              Where exceptional talent meets extraordinary opportunities. 
            </p>
            <p className="text-gray-500 max-w-sm leading-relaxed text-sm">
              We bridge the gap between ambitious professionals and industry-leading companies, fostering growth, innovation, and career defining moments.
            </p>
          </div>

          <div>
            <h3 className="text-white font-extrabold mb-6 tracking-wider text-sm uppercase">Platform</h3>
            <ul className="space-y-4">
              <li><Link to="/#jobs" className="text-gray-400 hover:text-brand-400 transition-colors font-medium">Browse Jobs</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-brand-400 transition-colors font-medium">Candidate Login</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-brand-400 transition-colors font-medium">Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-extrabold mb-6 tracking-wider text-sm uppercase">Legal & Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-brand-400 transition-colors font-medium">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-400 transition-colors font-medium">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-extrabold mb-6 tracking-wider text-sm uppercase">Contact Us</h3>
            <ul className="space-y-4 font-medium text-sm">
              <li className="text-gray-300">SkillSpring Inc.</li>
              <li><a href="mailto:contact@skillspring.com" className="text-gray-400 hover:text-brand-400 transition-colors">nihalpandey636@gmail.com</a></li>
              <li><a href="tel:+1234567890" className="text-gray-400 hover:text-brand-400 transition-colors">+91 77177947185</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} SkillSpring Inc. All rights reserved.
          </p>
          <div className="flex gap-5">
            {/* Social Icons */}
            <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-[#0a66c2] bg-dark-800 hover:bg-white p-2.5 rounded-full transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-[#E1306C] bg-dark-800 hover:bg-white p-2.5 rounded-full transition-all duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" /></svg>
            </a>
            <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-black bg-dark-800 hover:bg-white p-2.5 rounded-full transition-all duration-300">
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
