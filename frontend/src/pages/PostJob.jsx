import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, Briefcase, MapPin, DollarSign, List, Tag } from 'lucide-react';

const PostJob = () => {
  const { api, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  // Protect route
  if (!user || user.role !== 'company') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900">
        <div className="text-center bg-white dark:bg-dark-800 p-10 rounded-3xl shadow-xl w-full max-w-md border border-gray-100 dark:border-dark-700">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🛑</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">You need an employer account to post jobs.</p>
          <button onClick={() => navigate('/')} className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 rounded-xl font-bold w-full">Return Home</button>
        </div>
      </div>
    );
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      salary: '',
      location: '',
      category: 'Engineering',
      skills: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Job Title is required'),
      description: Yup.string().min(50, 'Please provide a detailed description (min 50 chars)').required('Description is required'),
      salary: Yup.number().positive('Salary must be positive').required('Salary is required'),
      location: Yup.string().required('Location is required'),
      category: Yup.string().required('Category is required'),
      skills: Yup.string().required('At least one skill is required (comma separated)'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setServerError('');
      // Format skills string into array
      const skillsArray = values.skills.split(',').map(s => s.trim()).filter(s => s);
      
      try {
        await api.post('/jobs', {
          ...values,
          skills: skillsArray
        });
        toast.success('Job posted successfully! Pending admin approval.');
        navigate('/dashboard'); // Route back to company dashboard
      } catch (err) {
        setServerError(err.response?.data?.message || 'Failed to post job. Please try again.');
        toast.error('Error posting job');
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300 pt-28 pb-12 relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-500/10 rounded-full mix-blend-multiply filter blur-[100px] animate-blob pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Post a New Job</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Find the perfect candidate for your team</p>
          </div>
          <Link to="/dashboard" className="flex items-center text-gray-600 dark:text-gray-300 font-bold hover:text-brand-600 dark:hover:text-brand-400 bg-white dark:bg-dark-800 px-5 py-2.5 rounded-xl shadow-sm border border-gray-100 dark:border-dark-700 transition-all">
            <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-xl shadow-brand-900/5 dark:shadow-none border border-white/50 dark:border-dark-700">
          {serverError && (
             <div className="mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800/50 text-sm font-bold flex items-center animate-shake">
              <span className="mr-3 text-xl">⚠️</span> {serverError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Job Title <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Briefcase size={20} className="text-gray-400" />
                  </div>
                  <input
                    name="title"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                    className={`block w-full pl-11 pr-4 py-4 rounded-xl border ${formik.touched.title && formik.errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-600'} bg-gray-50/50 dark:bg-dark-900/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium`}
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>
                {formik.touched.title && formik.errors.title && <div className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">{formik.errors.title}</div>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Job Description <span className="text-red-500">*</span></label>
                <textarea
                  name="description"
                  rows="8"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.description}
                  className={`block w-full p-4 rounded-xl border ${formik.touched.description && formik.errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-600'} bg-gray-50/50 dark:bg-dark-900/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium custom-scrollbar`}
                  placeholder="Describe the responsibilities, requirements, and benefits..."
                />
                {formik.touched.description && formik.errors.description && <div className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">{formik.errors.description}</div>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Salary (Annual USD) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <DollarSign size={20} className="text-gray-400" />
                  </div>
                  <input
                    name="salary"
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.salary}
                    className={`block w-full pl-11 pr-4 py-4 rounded-xl border ${formik.touched.salary && formik.errors.salary ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-600'} bg-gray-50/50 dark:bg-dark-900/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium`}
                    placeholder="120000"
                  />
                </div>
                 {formik.touched.salary && formik.errors.salary && <div className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">{formik.errors.salary}</div>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Location <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <MapPin size={20} className="text-gray-400" />
                  </div>
                  <input
                    name="location"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.location}
                    className={`block w-full pl-11 pr-4 py-4 rounded-xl border ${formik.touched.location && formik.errors.location ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-600'} bg-gray-50/50 dark:bg-dark-900/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium`}
                    placeholder="Remote, NY, etc."
                  />
                </div>
                {formik.touched.location && formik.errors.location && <div className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">{formik.errors.location}</div>}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <List size={20} className="text-gray-400" />
                  </div>
                  <select
                    name="category"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.category}
                    className={`block w-full pl-11 pr-10 py-4 rounded-xl border ${formik.touched.category && formik.errors.category ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-600'} bg-gray-50/50 dark:bg-dark-900/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium appearance-none`}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Product">Product</option>
                    <option value="Data">Data</option>
                    <option value="Support">Support</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Required Skills (Comma separated) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Tag size={20} className="text-gray-400" />
                  </div>
                  <input
                    name="skills"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.skills}
                    className={`block w-full pl-11 pr-4 py-4 rounded-xl border ${formik.touched.skills && formik.errors.skills ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 dark:border-dark-600'} bg-gray-50/50 dark:bg-dark-900/50 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium`}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                {formik.touched.skills && formik.errors.skills && <div className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">{formik.errors.skills}</div>}
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 font-medium pl-1 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all">Example: JavaScript, Python, UI/UX Design</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`w-full mt-10 py-5 px-4 border border-transparent text-xl font-extrabold tracking-wide rounded-xl text-white shadow-lg transition-all transform flex items-center justify-center gap-2 ${formik.isSubmitting ? 'bg-gray-400 dark:bg-dark-600 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-500 hover:shadow-brand-500/30 hover:-translate-y-1'}`}
            >
              {formik.isSubmitting ? (
                <><div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> Publishing...</>
              ) : 'Publish Job Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
