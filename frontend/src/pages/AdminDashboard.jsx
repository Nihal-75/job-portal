import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Users, Briefcase, Clock, CheckCircle, FileText, PlusCircle, MapPin, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { api } = useContext(AuthContext);
  
  const [stats, setStats] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats'); // tabs: stats, jobs, users, applications
  const [selectedApp, setSelectedApp] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({ status: 'Accepted', interviewDate: '', adminFeedback: '' });

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, jobsRes, usersRes, appsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/jobs/admin/all'),
        api.get('/admin/users'),
        api.get('/admin/applications')
      ]);
      
      setStats(statsRes.data);
      setPendingJobs(jobsRes.data.filter(job => job.status === 'Pending'));
      setUsers(usersRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error('Admin Fetch Error:', err);
      const msg = err.response?.data?.message || 'Failed to load admin dashboard data.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateApplication = async (e) => {
    if (e) e.preventDefault();
    setUpdateLoading(true);
    try {
      await api.put(`/admin/applications/${selectedApp._id}`, formData);
      toast.success('Application updated successfully.');
      setShowApprovalModal(false);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update application.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const openApprovalModal = (app) => {
    setSelectedApp(app);
    setFormData({ 
      status: app.status || 'Accepted', 
      interviewDate: app.interviewDate || '', 
      adminFeedback: app.adminFeedback || '' 
    });
    setShowApprovalModal(true);
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line
  }, [api]);

  const handleJobApproval = async (jobId, newStatus) => {
    if(!window.confirm(`Are you sure you want to mark this job as ${newStatus}?`)) return;

    try {
      await api.put(`/jobs/${jobId}/status`, { status: newStatus });
      toast.success(`Job ${newStatus} successfully.`);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to update job status.`);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if(!window.confirm('Are you sure you want to delete this job forever?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job deleted successfully.');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to delete job.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if(!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully.');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to delete user.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        
        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl flex flex-col items-center justify-center relative z-10 border border-white/50 dark:border-dark-700/50">
           <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-6"></div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Loading Portal</h2>
           <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Fetching administrative data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white dark:bg-dark-800 p-8 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/30 text-center relative z-10">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Access Denied</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand-500/20"
          >
            Retry Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300 pt-28 pb-12 relative overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-brand-500/10 rounded-full mix-blend-multiply filter blur-[80px] animate-blob pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000 pointer-events-none z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">Admin Control Panel</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg font-medium">Platform statistics, job approvals, and user directory.</p>
          </div>
           {/* Date Display */}
           <div className="flex flex-col sm:flex-row gap-3 self-start md:self-end">
             <Link to="/post-job" className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all transform hover:-translate-y-0.5">
               <PlusCircle size={18} /> Post New Job
             </Link>
             <div className="bg-white/60 dark:bg-dark-800/60 backdrop-blur-md px-5 py-2.5 rounded-xl border border-gray-200/50 dark:border-dark-700/50 text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm">
               {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
             </div>
           </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-700 relative overflow-hidden group hover:shadow-md transition-shadow">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Users size={64} className="text-brand-600 dark:text-brand-400" />
               </div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="bg-brand-100 dark:bg-brand-900/30 p-2.5 rounded-xl text-brand-600 dark:text-brand-400">
                     <Users size={20} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-gray-600 dark:text-gray-400 font-bold tracking-wide text-sm uppercase">Total Users</h3>
               </div>
               <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">{stats.users.total}</div>
               <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">{stats.users.seekers} Seekers</span>
                  <span className="bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">{stats.users.companies} Companies</span>
               </div>
            </div>

            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-700 relative overflow-hidden group hover:shadow-md transition-shadow">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Briefcase size={64} className="text-blue-600 dark:text-blue-400" />
               </div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400">
                     <Briefcase size={20} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-gray-600 dark:text-gray-400 font-bold tracking-wide text-sm uppercase">Total Jobs</h3>
               </div>
               <div className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{stats.jobs.total}</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-dark-800 dark:to-orange-900/10 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-orange-200/50 dark:border-orange-500/20 relative overflow-hidden group hover:shadow-md transition-shadow">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Clock size={64} className="text-orange-600 dark:text-orange-400" />
               </div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-200/50 dark:bg-orange-500/20 p-2.5 rounded-xl text-orange-600 dark:text-orange-400">
                     <Clock size={20} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-orange-800 dark:text-orange-300 font-bold tracking-wide text-sm uppercase">Pending Jobs</h3>
               </div>
               <div className="text-4xl font-extrabold text-orange-600 dark:text-orange-400 tracking-tight">{stats.jobs.pending}</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-dark-800 dark:to-green-900/10 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-green-200/50 dark:border-green-500/20 relative overflow-hidden group hover:shadow-md transition-shadow">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CheckCircle size={64} className="text-green-600 dark:text-green-400" />
               </div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-200/50 dark:bg-green-500/20 p-2.5 rounded-xl text-green-600 dark:text-green-400">
                     <CheckCircle size={20} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-green-800 dark:text-green-300 font-bold tracking-wide text-sm uppercase">Approved Jobs</h3>
               </div>
                <div className="text-4xl font-extrabold text-green-600 dark:text-green-400 tracking-tight">{stats.jobs.approved}</div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-dark-800 dark:to-indigo-900/10 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-indigo-200/50 dark:border-indigo-500/20 relative overflow-hidden group hover:shadow-md transition-shadow">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FileText size={64} className="text-indigo-600 dark:text-indigo-400" />
               </div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="bg-indigo-200/50 dark:bg-indigo-500/20 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400">
                     <FileText size={20} className="stroke-[2.5]" />
                  </div>
                  <h3 className="text-indigo-800 dark:text-indigo-300 font-bold tracking-wide text-sm uppercase">Total Applications</h3>
               </div>
               <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">{applications.length}</div>
            </div>

          </div>
        )}

        {/* Tabs */}
        <div className="flex items-center gap-4 bg-white/40 dark:bg-dark-800/40 p-1.5 rounded-2xl backdrop-blur-md border border-gray-200/50 dark:border-dark-700/50 mb-10 overflow-x-auto no-scrollbar w-max max-w-full mx-auto">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-8 py-3 font-bold text-sm transition-all rounded-xl relative flex items-center gap-2 ${activeTab === 'stats' ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/30' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <Briefcase size={16} /> Global Master
          </button>
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`px-8 py-3 font-bold text-sm transition-all rounded-xl relative flex items-center gap-2 ${activeTab === 'jobs' ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30' : 'text-gray-500 dark:text-gray-400 hover:text-orange-500'}`}
          >
            <Clock size={16} /> Job Approvals
            {pendingJobs.length > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span><span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 text-[10px] items-center justify-center text-white">{pendingJobs.length}</span></span>}
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`px-8 py-3 font-bold text-sm transition-all rounded-xl relative flex items-center gap-2 ${activeTab === 'applications' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'text-gray-500 dark:text-gray-400 hover:text-indigo-500'}`}
          >
            <FileText size={16} /> Master Feed
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-8 py-3 font-bold text-sm transition-all rounded-xl relative flex items-center gap-2 ${activeTab === 'users' ? 'bg-purple-600 text-white shadow-xl shadow-purple-500/30' : 'text-gray-500 dark:text-gray-400 hover:text-purple-500'}`}
          >
            <Users size={16} /> User Control
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'stats' && (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                {/* Connection Health - Pending Actions */}
                <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-8 rounded-[2rem] border border-orange-100 dark:border-orange-900/30 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <Clock size={120} className="text-orange-600" />
                   </div>
                   <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                     <span className="w-1.5 h-6 bg-orange-500 rounded-full animate-pulse"></span>
                     Queue: Pending Approval
                   </h3>
                   <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-6 bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-orange-100/50 dark:border-orange-800/30">
                         <p className="text-[10px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-widest mb-3">Pending Jobs</p>
                         <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">{stats?.jobs.pending || 0}</p>
                         <p className="text-xs text-orange-500 font-bold">Needs Master Approval</p>
                      </div>
                      <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-800/30">
                         <p className="text-[10px] font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest mb-3">Unreviewed Apps</p>
                         <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">{applications.filter(a => a.status === 'Pending').length}</p>
                         <p className="text-xs text-indigo-500 font-bold">In-Queue for Connection</p>
                      </div>
                   </div>
                </div>

                {/* System Efficiency - Approved Entities */}
                <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-8 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <CheckCircle size={120} className="text-emerald-600" />
                   </div>
                   <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                     <span className="w-1.5 h-6 bg-emerald-600 rounded-full"></span>
                     Live: Verified Platform
                   </h3>
                   <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-6 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100/50 dark:border-emerald-800/30">
                         <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-3">Approved Jobs</p>
                         <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">{stats?.jobs.approved || 0}</p>
                         <p className="text-xs text-emerald-600 font-bold">Currently Active for Hiring</p>
                      </div>
                      <div className="p-6 bg-brand-50/50 dark:bg-brand-900/10 rounded-2xl border border-brand-100/50 dark:border-brand-800/30">
                         <p className="text-[10px] font-bold text-brand-700 dark:text-brand-400 uppercase tracking-widest mb-3">Hired Talent</p>
                         <p className="text-4xl font-black text-gray-900 dark:text-white mb-1">{applications.filter(a => a.status === 'Accepted').length}</p>
                         <p className="text-xs text-brand-600 font-bold">Total Portfolios Connected</p>
                      </div>
                   </div>
                </div>

              {/* Connected Activity Stream */}
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-10 rounded-[2rem] border border-gray-100 dark:border-dark-700 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Master Relationship Stream</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">Live tracking of corporate-talent connectivity.</p>
                  </div>
                  <button onClick={() => setActiveTab('applications')} className="p-3 bg-gray-50 dark:bg-dark-900 rounded-xl text-gray-400 hover:text-brand-600 transition-colors"><PlusCircle size={20} /></button>
                </div>
                <div className="overflow-x-auto -mx-10">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 dark:bg-dark-900/30 border-b border-gray-100 dark:border-dark-700">
                           <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Entity (Seeker)</th>
                           <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Portal Link (Job)</th>
                           <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Corporate Hub (Company)</th>
                           <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Moment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-dark-700/50">
                        {applications.slice(0, 10).map((app, idx) => (
                          <tr key={app._id} className="hover:bg-brand-50/30 dark:hover:bg-brand-900/5 transition-all group">
                            <td className="px-10 py-6">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 font-black">
                                    {app.firstName.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-900 dark:text-white text-sm">{app.firstName} {app.lastName}</div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{app.email}</div>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-6">
                               <div className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 inline-block">
                                  <span className="font-extrabold text-indigo-700 dark:text-indigo-400 text-sm">{app.jobId?.title || 'Unknown'}</span>
                               </div>
                            </td>
                            <td className="px-10 py-6 text-sm font-black text-gray-700 dark:text-gray-300">
                               {app.jobId?.companyId?.companyName || 'Unknown Employer'}
                            </td>
                            <td className="px-10 py-6 text-right">
                               <div className="text-xs font-bold text-gray-400">{new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                               <div className="text-[10px] font-medium text-gray-300">{new Date(app.createdAt).toLocaleDateString()}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </div>
           </div>
        )}

        {/* Keeping existing tabs but making sure they look 10/10 too */}
        {activeTab === 'jobs' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* [Existing Job Approval Logic but with enhanced cards...] */}
             <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden">
                {pendingJobs.length === 0 ? (
                  <div className="p-20 text-center flex flex-col items-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-full flex items-center justify-center text-5xl mb-8 shadow-2xl shadow-green-500/30 animate-bounce-slow">✨</div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Pure Perfection</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-bold max-w-sm mx-auto">No pending jobs are currently awaiting your master approval. The system is fully synced.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    {/* [Render Pending Table...] */}
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 dark:bg-dark-900/30 border-b border-gray-100 dark:border-dark-700">
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Strategic Position</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Employer Source</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Approval Protocol</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-dark-700/50">
                        {pendingJobs.map(job => (
                          <tr key={job._id} className="hover:bg-orange-50/50 dark:hover:bg-orange-900/5 transition-all group">
                             <td className="px-8 py-6">
                                <div className="font-black text-gray-900 dark:text-white text-base">{job.title}</div>
                                <div className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{job.location} | {job.category}</div>
                             </td>
                             <td className="px-8 py-6 text-sm font-black text-gray-700 dark:text-gray-300">
                                {job.companyId?.companyName || 'Anonymous Company'}
                             </td>
                             <td className="px-8 py-6 text-right">
                                <div className="flex gap-2 justify-end">
                                   <button onClick={() => handleJobApproval(job._id, 'Approved')} className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-green-500/20 transform hover:-translate-y-0.5 transition-all">APPROVE</button>
                                   <button onClick={() => handleJobApproval(job._id, 'Rejected')} className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 px-5 py-2 rounded-xl text-xs font-black border border-red-100 dark:border-red-900/40 transform hover:-translate-y-0.5 transition-all">DENY</button>
                                </div>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
             </div>
          </div>
        )}

        {/* [Applications Tab Restored with Connection Focus...] */}
        {activeTab === 'applications' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden">
                <div className="p-8 border-b border-gray-100 dark:border-dark-700 flex justify-between items-center bg-indigo-50/30 dark:bg-indigo-900/10">
                   <h3 className="text-xl font-black text-gray-900 dark:text-white">Master Applications Repository</h3>
                   <div className="flex gap-2">
                      <span className="px-3 py-1 bg-white dark:bg-dark-900 rounded-lg text-xs font-black text-brand-600 border border-brand-100 dark:border-brand-900/50 shadow-sm">{applications.length} Total</span>
                   </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-gray-50/50 dark:bg-dark-900/30 border-b border-gray-100 dark:border-dark-700 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                             <th className="px-8 py-4">Seeker Portal</th>
                             <th className="px-8 py-4">Connection Path (Job)</th>
                             <th className="px-8 py-4">Current Status</th>
                             <th className="px-8 py-4 text-right">Review Protocol</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100 dark:divide-dark-700/50">
                          {applications.map(app => (
                            <tr key={app._id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-all">
                               <td className="px-8 py-6">
                                  <div className="font-extrabold text-gray-900 dark:text-white">{app.firstName} {app.lastName}</div>
                                  <div className="text-xs text-brand-500 font-bold">{app.email}</div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="font-bold text-gray-700 dark:text-gray-300 text-sm">{app.jobId?.title}</div>
                                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{app.jobId?.companyId?.companyName}</div>
                               </td>
                               <td className="px-8 py-6">
                                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                    app.status === 'Accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    app.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  }`}>
                                    {app.status}
                                  </span>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <button onClick={() => openApprovalModal(app)} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-500/20 transform hover:-translate-y-0.5 transition-all">MASTER REVIEW</button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                </div>
             </div>
          </div>
        )}

        {/* [User Control Center...] */}
        {activeTab === 'users' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-[2rem] shadow-xl border border-gray-100 dark:border-dark-700 overflow-hidden">
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 dark:bg-dark-900/30 border-b border-gray-100 dark:border-dark-700 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                           <th className="px-10 py-5">Global Identity</th>
                           <th className="px-10 py-5">Role Permission</th>
                           <th className="px-10 py-5 text-right">Security Protocol</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-dark-700/50">
                        {users.map(u => (
                          <tr key={u._id} className="hover:bg-purple-50/30 dark:hover:bg-purple-900/5 transition-all group">
                             <td className="px-10 py-6">
                                <div className="flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg text-lg">
                                      {u.name.charAt(0)}
                                   </div>
                                   <div>
                                      <div className="font-black text-gray-900 dark:text-white">{u.name}</div>
                                      <div className="text-xs text-gray-400 font-bold">{u.email}</div>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-6">
                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-transparent shadow-sm ${
                                  u.role === 'admin' ? 'bg-dark-900 text-white dark:bg-white dark:text-dark-900' :
                                  u.role === 'company' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                  'bg-gray-100 text-gray-700 dark:bg-dark-700 dark:text-gray-300'
                                }`}>
                                  {u.role}
                                </span>
                             </td>
                             <td className="px-10 py-6 text-right">
                                {u.role !== 'admin' && (
                                   <button onClick={() => handleDeleteUser(u._id)} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20} /></button>
                                )}
                             </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* [Approval Modal Restored & Enhanced...] */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-md" onClick={() => setShowApprovalModal(false)}></div>
          <div className="bg-white dark:bg-dark-800 w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 border border-white/10 dark:border-dark-700 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-gray-100 dark:border-dark-700 bg-gradient-to-tr from-indigo-50/50 to-white dark:from-dark-900/50 dark:to-dark-800">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Master Connection Protocol</h3>
              <p className="text-gray-500 dark:text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Reviewing interaction for {selectedApp?.firstName}</p>
            </div>
            <form onSubmit={handleUpdateApplication} className="p-10 space-y-8">
              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Authority Decision</label>
                <div className="grid grid-cols-3 gap-4">
                  {['Pending', 'Accepted', 'Rejected'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: s })}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                        formData.status === s 
                          ? 'bg-brand-600 border-brand-600 text-white shadow-2xl shadow-brand-500/40' 
                          : 'bg-transparent border-gray-100 dark:border-dark-700 text-gray-400 hover:border-brand-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {formData.status === 'Accepted' && (
                <div className="animate-in slide-in-from-top-4 duration-300">
                  <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Liaison Chronology (Interview Date)</label>
                  <input 
                    type="text" 
                    placeholder="Moment of connection (e.g., April 15, 10 AM)"
                    className="w-full px-6 py-5 bg-gray-50 dark:bg-dark-900 rounded-2xl border-2 border-transparent focus:border-brand-500 outline-none font-black text-gray-900 dark:text-white transition-all shadow-inner"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                    required={formData.status === 'Accepted'}
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Master Directive (Feedback)</label>
                <textarea 
                  className="w-full px-6 py-5 bg-gray-50 dark:bg-dark-900 rounded-2xl border-2 border-transparent focus:border-brand-500 outline-none font-bold text-gray-900 dark:text-white transition-all shadow-inner h-40 resize-none"
                  placeholder="Official administrative directive..."
                  value={formData.adminFeedback}
                  onChange={(e) => setFormData({ ...formData, adminFeedback: e.target.value })}
                ></textarea>
              </div>

              <div className="flex gap-4 pt-6">
                <button type="submit" disabled={updateLoading} className="flex-1 px-8 py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/40 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50">
                   {updateLoading ? 'UPDATING...' : 'SAVE MASTER DIRECTIVE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminDashboard;
