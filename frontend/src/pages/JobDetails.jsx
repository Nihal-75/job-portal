import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Briefcase, MapPin, DollarSign, Star, CheckCircle, Clock } from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, api } = useContext(AuthContext);
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applicationState, setApplicationState] = useState({
    submitting: false,
    success: false,
    error: '',
  });

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    qualification: '',
    jobRole: '',
    position: '',
    experience: '',
    resume: null,
    experienceCertificate: null
  });

  // User data is intentionally not pre-filled so they enter it fresh per application
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/jobs`);
        const foundJob = response.data.find(j => j._id === id);
        
        if (foundJob) {
           setJob(foundJob);
        } else {
           setApplicationState(prev => ({ ...prev, error: 'Job not found' }));
        }
      } catch (err) {
        setApplicationState(prev => ({ ...prev, error: 'Failed to load job details.' }));
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (user?.role === 'user' && job?._id) {
        try {
          const res = await api.get('/applications');
          const existingApp = res.data.find(app => (app.jobId?._id || app.jobId) === job._id);
          if (existingApp) {
            setApplicationState(prev => ({ ...prev, success: true }));
          }
        } catch (err) {
          console.error("Error checking application status", err);
        }
      }
    };
    checkApplicationStatus();
  }, [user, job, api]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!formData.resume && !user?.resumeUrl) {
      return setApplicationState(prev => ({ ...prev, error: 'Resume file is required' }));
    }
    
    setApplicationState(prev => ({ ...prev, submitting: true, error: '' }));
    
    try {
      const submitData = new FormData();
      submitData.append('jobId', job._id);
      submitData.append('firstName', formData.firstName);
      submitData.append('middleName', formData.middleName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('address', formData.address);
      submitData.append('qualification', formData.qualification);
      submitData.append('jobRole', formData.jobRole);
      submitData.append('position', formData.position);
      submitData.append('experience', formData.experience);

      if (formData.resume) {
        submitData.append('resume', formData.resume);
      } else if (user?.resumeUrl) {
         submitData.append('resumeUrl', user.resumeUrl);
      }

      if (formData.experienceCertificate) {
        submitData.append('experienceCertificate', formData.experienceCertificate);
      }

      await api.post('/applications', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setApplicationState(prev => ({ ...prev, submitting: false, success: true }));
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to submit application. Did you already apply?';
      setApplicationState(prev => ({ ...prev, submitting: false, error: errMsg }));
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Loading Job Details...</p>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-xl text-center max-w-md animate-scale-in border border-gray-100 dark:border-dark-700">
         <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">⚠️</div>
         <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
         <p className="text-gray-500 mb-8">{applicationState.error}</p>
         <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors w-full">Go Back Home</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-300 pt-28 pb-12 relative overflow-hidden bg-gray-50 dark:bg-dark-900">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed opacity-40 dark:opacity-20 pointer-events-none mix-blend-multiply dark:mix-blend-overlay"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop')` }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-50/80 to-gray-100/95 dark:from-dark-900/90 dark:to-dark-800/95 pointer-events-none backdrop-blur-[2px]"></div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-brand-500/10 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-40 left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Job Header Card */}
        <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-brand-900/5 dark:shadow-none border border-white/50 dark:border-dark-700 overflow-hidden mb-10 animate-slide-up">
          <div className="h-4 w-full bg-gradient-to-r from-brand-600 via-purple-500 to-brand-400"></div>
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 dark:border-dark-700 pb-8 gap-6">
              <div className="flex-grow">
                <div className="flex items-center gap-4 mb-4">
                   {/* Company Logo Placeholder */}
                   <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-dark-700 dark:to-dark-600 rounded-2xl flex items-center justify-center text-3xl font-bold text-brand-600 shadow-inner flex-shrink-0 border border-white dark:border-dark-500">
                     {job.companyId?.companyName ? job.companyId.companyName.charAt(0).toUpperCase() : 'C'}
                   </div>
                   <div>
                     <h1 className="text-3xl md:text-4xl text-gray-900 dark:text-white font-extrabold mb-1 tracking-tight">{job.title}</h1>
                     <p className="text-xl text-brand-600 dark:text-brand-400 font-bold">{job.companyId?.companyName || 'Unknown Company'}</p>
                   </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-sm font-bold mt-6">
                  <span className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 px-4 py-2 rounded-xl border border-gray-200/50 dark:border-dark-600">
                     <MapPin size={16} className="mr-2 text-brand-500" /> {job.location}
                  </span>
                  <span className="flex items-center text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 px-4 py-2 rounded-xl border border-gray-200/50 dark:border-dark-600">
                     <Briefcase size={16} className="mr-2 text-purple-500" /> {job.category}
                  </span>
                  <span className="flex items-center text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-xl border border-green-200 dark:border-green-800/50">
                     <DollarSign size={16} className="mr-1" /> {job.salary?.toLocaleString()}
                  </span>
                  <span className="flex items-center text-yellow-700 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded-xl border border-yellow-200 dark:border-yellow-800/50 ml-auto md:ml-0 shadow-sm">
                    <Star size={14} className="mr-1.5 fill-current" /> 4.6
                  </span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex-shrink-0 w-full md:w-auto text-center">
                 <button onClick={() => document.getElementById('apply-section').scrollIntoView({ behavior: 'smooth' })} className="bg-brand-600 hover:bg-brand-500 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-500/30 transition-all duration-300 transform hover:-translate-y-1 w-full flex items-center justify-center gap-2">
                   Apply Now
                 </button>
                 <p className="flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 mt-4 font-bold uppercase tracking-wider">
                    <Clock size={12} className="mr-1.5" /> Posted {new Date(job.createdAt).toLocaleDateString()}
                 </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column: Descriptions */}
              <div className="lg:col-span-2 space-y-10">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center relative inline-block">
                    Job Description
                    <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-brand-500 rounded-full opacity-50"></div>
                  </h2>
                  <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg font-medium">
                    {job.description}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center relative inline-block">
                    Required Skills
                    <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-purple-500 rounded-full opacity-50"></div>
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {job.skills?.length > 0 ? job.skills.map((skill, index) => (
                      <span key={index} className="bg-white dark:bg-dark-800 text-brand-700 dark:text-brand-300 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm border border-gray-200 dark:border-dark-600 hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all cursor-default">
                        {skill}
                      </span>
                    )) : <span className="text-gray-500 italic">Not specified</span>}
                  </div>
                </div>
              </div>
              
              {/* Right Column: Company Snapshot */}
              <div className="lg:col-span-1">
                 <div className="bg-gray-50 dark:bg-dark-800/50 rounded-3xl p-8 border border-gray-100 dark:border-dark-700 h-fit sticky top-24 shadow-sm">
                    <div className="w-12 h-12 bg-white dark:bg-dark-700 rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm border border-gray-100 dark:border-dark-600">🏢</div>
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-xl mb-4 border-b border-gray-200 dark:border-dark-600 pb-4">About the Company</h3>
                    <p className="font-bold text-brand-600 dark:text-brand-400 text-lg mb-3">{job.companyId?.companyName}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                      {job.companyId?.description || "A leading company looking for talented individuals to join their expanding team. Focused on innovation and excellence in their field."}
                    </p>
                    <div className="space-y-3">
                       <div className="flex items-center text-sm"><CheckCircle size={16} className="text-green-500 mr-3" /> <span className="font-semibold text-gray-700 dark:text-gray-300">Fast growing team</span></div>
                       <div className="flex items-center text-sm"><CheckCircle size={16} className="text-green-500 mr-3" /> <span className="font-semibold text-gray-700 dark:text-gray-300">Competitive benefits</span></div>
                       <div className="flex items-center text-sm"><CheckCircle size={16} className="text-green-500 mr-3" /> <span className="font-semibold text-gray-700 dark:text-gray-300">Remote friendly</span></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div id="apply-section" className="scroll-mt-24 pb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-dark-700 relative overflow-hidden shadow-xl shadow-brand-900/5 dark:shadow-none">
            {/* Decor */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Ready to Take the Next Step?</h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Apply for <span className="font-bold text-brand-600 dark:text-brand-400">{job.title}</span> at {job.companyId?.companyName}</p>
              </div>
              
              {!user ? (
                <div className="bg-gray-50 dark:bg-dark-900/50 rounded-3xl p-10 text-center border border-gray-100 dark:border-dark-700 max-w-2xl mx-auto">
                  <div className="w-20 h-20 bg-white dark:bg-dark-800 rounded-2xl flex items-center justify-center text-4xl mb-6 mx-auto shadow-sm border border-gray-100 dark:border-dark-700">👋</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sign in to Apply</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">Create an account or login to streamline your application process and track your progress easily.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={() => navigate('/login')} className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-brand-500/30 transform hover:-translate-y-0.5">Login</button>
                    <button onClick={() => navigate('/register')} className="bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 text-gray-900 dark:text-white font-bold py-4 px-10 rounded-xl transition-all border border-gray-200 dark:border-dark-600 shadow-sm">Register</button>
                  </div>
                </div>
              ) : user.role === 'company' ? (
                 <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-2xl flex items-start gap-4 max-w-2xl mx-auto">
                  <div className="text-yellow-600 dark:text-yellow-500 mt-1"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
                  <p className="text-yellow-800 dark:text-yellow-300 font-bold">Employers cannot apply to jobs. Please sign in with a Job Seeker account.</p>
                </div>
              ) : applicationState.success ? (
                <div className="bg-white dark:bg-dark-800 border border-green-200 dark:border-green-900/30 rounded-3xl p-12 text-center shadow-xl relative overflow-hidden max-w-2xl mx-auto animate-scale-in">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500"></div>
                  <div className="w-24 h-24 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-100 dark:border-green-900/40">
                    <CheckCircle className="text-green-500 w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Application Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-10 font-medium">Your profile and application have been successfully delivered to <span className="font-bold text-gray-800 dark:text-gray-200">{job.companyId?.companyName}</span>.</p>
                  <button onClick={() => navigate('/dashboard')} className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold py-4 px-10 rounded-xl transition-colors shadow-lg w-full sm:w-auto">
                    Track Application Status
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="bg-gray-50 dark:bg-dark-900/50 p-8 md:p-12 rounded-3xl border border-gray-100 dark:border-dark-700">
                  {applicationState.error && (
                    <div className="mb-8 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800/50 text-sm font-bold flex items-center animate-shake">
                      <span className="mr-3 text-xl">⚠️</span> {applicationState.error}
                    </div>
                  )}

                  <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-dark-700 pb-4">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Input Fields */}
                    {['firstName', 'middleName', 'lastName'].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 capitalize">{field.replace('Name', ' Name')} {field !== 'middleName' && <span className="text-red-500">*</span>}</label>
                        <input 
                          type="text" name={field} required={field !== 'middleName'} 
                          value={formData[field]} onChange={handleChange} 
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm font-medium" 
                        />
                      </div>
                    ))}

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address <span className="text-red-500">*</span></label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Contact Number <span className="text-red-500">*</span></label>
                      <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm font-medium" />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Address <span className="text-red-500">*</span></label>
                      <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm font-medium" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-dark-700 pb-4 mt-12">Professional Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Highest Qualification <span className="text-red-500">*</span></label>
                      <input type="text" name="qualification" required value={formData.qualification} onChange={handleChange} className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Current/Target Job Role <span className="text-red-500">*</span></label>
                      <input type="text" name="jobRole" required value={formData.jobRole} onChange={handleChange} placeholder="e.g. Frontend Developer" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm font-medium" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Level/Position <span className="text-red-500">*</span></label>
                      <input type="text" name="position" required value={formData.position} onChange={handleChange} placeholder="e.g. Senior, Mid-level" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm font-medium" />
                    </div>
                 
                    <div className="md:col-span-3">
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Total Experience <span className="text-red-500">*</span></label>
                      <input type="text" name="experience" required value={formData.experience} onChange={handleChange} placeholder="e.g. 4 years, Fresher" className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-dark-600 bg-white dark:bg-dark-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all shadow-sm font-medium" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-dark-700 pb-4 mt-12">Documents</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="bg-white dark:bg-dark-800 border border-dashed border-gray-300 dark:border-dark-600 p-6 rounded-2xl text-center hover:border-brand-500 dark:hover:border-brand-500 transition-colors group">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 text-gray-400 group-hover:text-brand-600">📄</div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 cursor-pointer">
                        Upload Resume {user.resumeUrl ? '' : <span className="text-red-500">*</span>}
                        <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleChange} className="hidden" />
                      </label>
                      <p className="text-xs text-gray-500 font-medium mb-3">PDF, DOC up to 5MB</p>
                      {formData.resume ? (
                        <span className="inline-block text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full truncate max-w-full">{formData.resume.name}</span>
                      ) : user.resumeUrl ? (
                        <span className="inline-block text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">Using profile resume</span>
                      ) : (
                        <span className="inline-block bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">Select File</span>
                      )}
                    </div>
                    
                    <div className="bg-white dark:bg-dark-800 border border-dashed border-gray-300 dark:border-dark-600 p-6 rounded-2xl text-center hover:border-brand-500 dark:hover:border-brand-500 transition-colors group">
                      <div className="w-12 h-12 bg-gray-50 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 text-gray-400 group-hover:text-brand-600">🏆</div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2 cursor-pointer">
                        Experience Certificate <span className="text-gray-400 font-medium">(Optional)</span>
                        <input type="file" name="experienceCertificate" accept=".pdf,.doc,.docx,.jpg,.png" onChange={handleChange} className="hidden" />
                      </label>
                      <p className="text-xs text-gray-500 font-medium mb-3">PDF, DOC, Images</p>
                      {formData.experienceCertificate ? (
                         <span className="inline-block text-xs font-bold text-brand-600 bg-brand-50 px-3 py-1 rounded-full truncate max-w-full">{formData.experienceCertificate.name}</span>
                      ) : (
                         <span className="inline-block bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 text-xs font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors">Select File</span>
                      )}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={applicationState.submitting}
                    className={`w-full py-5 rounded-xl text-white font-extrabold text-xl tracking-wide transition-all transform flex justify-center items-center gap-2 ${applicationState.submitting ? 'bg-gray-400 dark:bg-dark-600 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-500 shadow-lg hover:shadow-brand-500/30 hover:-translate-y-1'}`}
                  >
                    {applicationState.submitting ? (
                      <><div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div> Submitting...</>
                    ) : 'Submit Application'}
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-6 font-medium">By submitting this application, you agree to our Terms of Service and Privacy Policy.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
