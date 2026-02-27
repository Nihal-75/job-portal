import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setErrorMsg('');
      const success = await login(values.email, values.password);
      if (!success) {
        setErrorMsg('Invalid email or password');
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="flex min-h-[100vh] bg-white dark:bg-dark-900 transition-colors duration-300 pt-24 pb-12 relative overflow-hidden">
      
      {/* Decorative Blob */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob z-0 pointer-events-none"></div>

      {/* Left Panel: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 z-10 relative">
        <div className="max-w-md w-full animate-fade-in">
          
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
              <div className="bg-brand-600 p-1.5 rounded-lg group-hover:bg-brand-500 transition-colors">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">SkillSpring</span>
            </Link>
            
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">Welcome back</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Enter your details to access your account.</p>
          </div>
          
          {errorMsg && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-r-lg shadow-sm animate-fade-in">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                  </div>
                  <input
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`appearance-none block w-full pl-11 pr-4 py-3.5 border ${formik.touched.email && formik.errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-700'} rounded-xl placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white dark:focus:bg-dark-700 sm:text-sm transition-all shadow-sm`}
                    placeholder="you@example.com"
                  />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5 pl-1">{formik.errors.email}</div>
                ) : null}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Password</label>
                  <a href="#" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <input
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={`appearance-none block w-full pl-11 pr-4 py-3.5 border ${formik.touched.password && formik.errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-700'} rounded-xl placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white dark:focus:bg-dark-700 sm:text-sm transition-all shadow-sm`}
                    placeholder="••••••••"
                  />
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5 pl-1">{formik.errors.password}</div>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${formik.isSubmitting ? 'bg-brand-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/30 transform hover:-translate-y-0.5'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200`}
            >
              {formik.isSubmitting ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : 'Sign in'}
            </button>
          </form>
          
          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-dark-800 text-center">
             <p className="text-gray-600 dark:text-gray-400">
               Don't have an account? <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors ml-1">Register here</Link>
             </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Image/Gradient */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-dark-900 border-l border-dark-800">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-brand-900/40 to-dark-900 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1469&auto=format&fit=crop" 
          alt="Office professionals" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        
        {/* Floating Auth Card Graphic */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-white/10 dark:bg-dark-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-8 rounded-3xl shadow-2xl max-w-sm w-full transform -rotate-2 hover:rotate-0 transition-all duration-500">
            <div className="w-12 h-12 bg-brand-500 rounded-xl mb-6 shadow-inner flex items-center justify-center">
               <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Accelerate your career</h3>
            <p className="text-brand-100/80 mb-6 line-clamp-2">Join thousands of professionals finding their dream roles through SkillSpring's premium network.</p>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-dark-800"></div>
                <div className="w-8 h-8 rounded-full bg-red-400 border-2 border-dark-800"></div>
                <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-dark-800"></div>
              </div>
              <span className="text-sm font-medium text-white shadow-sm">+10k hired</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
