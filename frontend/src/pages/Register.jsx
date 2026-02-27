import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Register = () => {
  const { register } = useContext(AuthContext);
  const [errorMsg, setErrorMsg] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
      companyName: '',
      phone: '',
      address: '',
      qualification: '',
      photo: null,
      resume: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      role: Yup.string().oneOf(['user', 'company']).required('Role is required'),
      companyName: Yup.string().when('role', {
        is: 'company',
        then: () => Yup.string().required('Company Name is required for Employer accounts'),
        otherwise: () => Yup.string().notRequired(),
      }),
      phone: Yup.string().when('role', {
        is: 'user',
        then: () => Yup.string().required('Contact Number is required for Job Seekers'),
        otherwise: () => Yup.string().notRequired(),
      }),
      address: Yup.string().when('role', {
        is: 'user',
        then: () => Yup.string().required('Address is required for Job Seekers'),
        otherwise: () => Yup.string().notRequired(),
      }),
      qualification: Yup.string().when('role', {
        is: 'user',
        then: () => Yup.string().required('Qualification is required for Job Seekers'),
        otherwise: () => Yup.string().notRequired(),
      }),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setErrorMsg('');
      let payload;
      
      if (values.role === 'user') {
        payload = new FormData();
        payload.append('name', values.name);
        payload.append('email', values.email);
        payload.append('password', values.password);
        payload.append('role', values.role);
        payload.append('phone', values.phone);
        payload.append('address', values.address);
        payload.append('qualification', values.qualification);
        if (values.photo) {
          payload.append('photo', values.photo);
        }
        if (values.resume) {
          payload.append('resume', values.resume);
        }
      } else {
        payload = {
          name: values.name,
          email: values.email,
          password: values.password,
          role: values.role,
          companyName: values.companyName,
        };
      }

      const success = await register(payload);
      if (!success) {
        setErrorMsg('Registration failed. Email might already be in use.');
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex transition-colors duration-300 pt-24 overflow-hidden">
      
      {/* Decorative Blob */}
      <div className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] bg-brand-500/10 rounded-full mix-blend-multiply filter blur-[120px] animate-blob z-0 pointer-events-none"></div>

      {/* Right Panel: Image/Gradient (Flipped for variety) */}
      <div className="hidden lg:block lg:w-[45%] xl:w-[40%] relative overflow-hidden bg-dark-900 border-r border-dark-800 fixed h-screen">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-800/40 via-purple-900/40 to-dark-900 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop" 
          alt="Networking professionals" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        
        {/* Floating Value Prop */}
        <div className="absolute inset-0 flex flex-col items-start justify-end p-16 z-20 pb-24">
          <div className="bg-glass p-8 rounded-3xl backdrop-blur-md border border-white/10 dark:border-white/5 opacity-0 animate-[fadeIn_1s_ease-out_ forwards]">
             <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight">Your next great hire <br/>or dream job awaits.</h3>
             <p className="text-brand-100/90 text-lg">Join a community built on connecting ambition with scale. Trusted by modern companies worldwide.</p>
          </div>
        </div>
      </div>

      {/* Left Panel: Form */}
      <div className="w-full lg:w-[55%] xl:w-[60%] lg:ml-auto flex items-center justify-center p-6 sm:p-12 lg:p-16 z-10 relative mt-16 lg:mt-0">
        <div className="max-w-xl w-full animate-fade-in">
          
          <div className="mb-8 text-center lg:text-left">
             <Link to="/" className="inline-flex items-center gap-2 mb-6 group lg:hidden">
              <div className="bg-brand-600 p-1.5 rounded-lg group-hover:bg-brand-500 transition-colors">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">SkillSpring</span>
            </Link>

            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">Create an Account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Setup your profile in seconds to get started.</p>
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
            
            {/* Account Type Toggle */}
            <div className="bg-gray-100 dark:bg-dark-800 p-1.5 rounded-xl flex shadow-inner">
               <label className={`flex-1 text-center cursor-pointer py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${formik.values.role === 'user' ? 'bg-white dark:bg-dark-700 shadow text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                  <input type="radio" name="role" value="user" onChange={formik.handleChange} checked={formik.values.role === 'user'} className="sr-only" />
                  Job Seeker
               </label>
               <label className={`flex-1 text-center cursor-pointer py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${formik.values.role === 'company' ? 'bg-white dark:bg-dark-700 shadow text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                  <input type="radio" name="role" value="company" onChange={formik.handleChange} checked={formik.values.role === 'company'} className="sr-only" />
                  Employer
               </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Common Fields */}
              <div className="md:col-span-2 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className={`appearance-none block w-full px-4 py-3.5 border ${formik.touched.name && formik.errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-700'} rounded-xl placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white dark:focus:bg-dark-700 sm:text-sm transition-all shadow-sm`}
                    placeholder="John Doe"
                  />
                  {formik.touched.name && formik.errors.name && <div className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5 pl-1">{formik.errors.name}</div>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    className={`appearance-none block w-full px-4 py-3.5 border ${formik.touched.email && formik.errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-700'} rounded-xl placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white dark:focus:bg-dark-700 sm:text-sm transition-all shadow-sm`}
                    placeholder="you@example.com"
                  />
                   {formik.touched.email && formik.errors.email && <div className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5 pl-1">{formik.errors.email}</div>}
                </div>

                <div>
                   <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                  <input
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    className={`appearance-none block w-full px-4 py-3.5 border ${formik.touched.password && formik.errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-700'} rounded-xl placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white dark:focus:bg-dark-700 sm:text-sm transition-all shadow-sm`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                   {formik.touched.password && formik.errors.password && <div className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5 pl-1">{formik.errors.password}</div>}
                </div>
              </div>
              
              {/* Conditional User Fields */}
              {formik.values.role === 'user' && (
                <>
                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Contact Number</label>
                    <input
                      name="phone"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                      className={`appearance-none block w-full px-4 py-3 border ${formik.touched.phone && formik.errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-700'} rounded-xl placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all shadow-sm`}
                      placeholder="123-456-7890"
                    />
                    {formik.touched.phone && formik.errors.phone && <div className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5 pl-1">{formik.errors.phone}</div>}
                  </div>

                  <div className="md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Highest Qualification</label>
                    <input
                      name="qualification"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.qualification}
                      className={`appearance-none block w-full px-4 py-3 border ${formik.touched.qualification && formik.errors.qualification ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-700'} rounded-xl placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all shadow-sm`}
                      placeholder="B.Tech, B.Sc, etc."
                    />
                    {formik.touched.qualification && formik.errors.qualification && <div className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5 pl-1">{formik.errors.qualification}</div>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Address</label>
                    <input
                      name="address"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.address}
                      className={`appearance-none block w-full px-4 py-3 border ${formik.touched.address && formik.errors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-700'} rounded-xl placeholder-gray-400 text-gray-900 dark:text-white bg-gray-50/50 dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all shadow-sm`}
                      placeholder="City, Country"
                    />
                    {formik.touched.address && formik.errors.address && <div className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5 pl-1">{formik.errors.address}</div>}
                  </div>

                  {/* File Uploads */}
                  <div className="md:col-span-2 bg-gray-50 dark:bg-dark-800/50 p-5 rounded-xl border border-gray-100 dark:border-dark-700">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-4">Profile Assets</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Profile Photo (Optional)</label>
                        <input
                          name="photo"
                          type="file"
                          accept="image/*"
                          onChange={(event) => formik.setFieldValue("photo", event.currentTarget.files[0])}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white dark:file:bg-dark-700 file:border file:border-gray-200 dark:file:border-dark-600 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-50 dark:hover:file:bg-dark-600 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Resume Document (Optional)</label>
                        <input
                          name="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(event) => formik.setFieldValue("resume", event.currentTarget.files[0])}
                          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white dark:file:bg-dark-700 file:border file:border-gray-200 dark:file:border-dark-600 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-50 dark:hover:file:bg-dark-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {/* Conditional Company Field */}
              {formik.values.role === 'company' && (
                <div className="md:col-span-2 bg-brand-50/50 dark:bg-brand-900/10 p-5 rounded-xl border border-brand-100 dark:border-brand-900/30">
                  <label className="block text-sm font-semibold text-brand-800 dark:text-brand-300 mb-2">Company Name</label>
                  <input
                    name="companyName"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyName}
                    className={`appearance-none block w-full px-4 py-3.5 border ${formik.touched.companyName && formik.errors.companyName ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-700'} rounded-xl placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-all shadow-sm`}
                    placeholder="Acme Corporation"
                  />
                   {formik.touched.companyName && formik.errors.companyName && <div className="text-red-500 dark:text-red-400 text-xs font-medium mt-1.5 pl-1">{formik.errors.companyName}</div>}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`w-full flex justify-center items-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white ${formik.isSubmitting ? 'bg-brand-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/30 transform hover:-translate-y-0.5'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all duration-200 mt-8`}
            >
              {formik.isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating Account...
                </div>
              ) : 'Complete Registration'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-800 text-center">
             <p className="text-gray-600 dark:text-gray-400">
               Already have an account? <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors ml-1">Sign in instead</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
