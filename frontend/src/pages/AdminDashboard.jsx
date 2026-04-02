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
        <div className="flex items-center gap-4 border-b border-gray-200 dark:border-dark-700 mb-8 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-4 font-bold text-sm transition-all relative ${activeTab === 'stats' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            Dashboard
            {activeTab === 'stats' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 dark:bg-brand-400 rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('jobs')}
            className={`px-6 py-4 font-bold text-sm transition-all relative flex items-center gap-2 ${activeTab === 'jobs' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            Job Approvals
            {pendingJobs.length > 0 && <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>}
            {activeTab === 'jobs' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 dark:bg-brand-400 rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('applications')}
            className={`px-6 py-4 font-bold text-sm transition-all relative ${activeTab === 'applications' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            Applications
            {activeTab === 'applications' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 dark:bg-brand-400 rounded-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-4 font-bold text-sm transition-all relative ${activeTab === 'users' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
          >
            User Directory
            {activeTab === 'users' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-600 dark:bg-brand-400 rounded-full"></div>}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'stats' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Could put charts or recent activity here */}
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 dark:border-dark-700 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity Summary</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">{stats?.jobs.pending || 0} jobs are awaiting review</p>
                      <p className="text-sm text-gray-500">Action required to make them public.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">{applications.length} applications total on platform</p>
                      <p className="text-sm text-gray-500">Consistent growth in candidate engagement.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 dark:border-dark-700 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">System Health</h3>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-gray-50 dark:bg-dark-900/50 rounded-2xl">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">API Status</p>
                      <p className="text-green-600 dark:text-green-400 font-extrabold flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Optimal</p>
                   </div>
                   <div className="p-4 bg-gray-50 dark:bg-dark-900/50 rounded-2xl">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Database</p>
                      <p className="text-green-600 dark:text-green-400 font-extrabold flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Connected</p>
                   </div>
                </div>
              </div>

              {/* Recent Applications Preview */}
              <div className="lg:col-span-2 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 dark:border-dark-700 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Applications</h3>
                  <button onClick={() => setActiveTab('applications')} className="text-brand-600 dark:text-brand-400 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto -mx-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-dark-900/30">
                        <th className="px-8 py-3 text-xs font-bold text-gray-500 uppercase">Applicant</th>
                        <th className="px-8 py-3 text-xs font-bold text-gray-500 uppercase">Position</th>
                        <th className="px-8 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-dark-700/50">
                      {applications.slice(0, 5).map(app => (
                        <tr key={app._id} className="hover:bg-gray-50/30 dark:hover:bg-dark-700/20">
                          <td className="px-8 py-4 font-semibold text-gray-800 dark:text-gray-200">{app.firstName} {app.lastName}</td>
                          <td className="px-8 py-4 text-gray-600 dark:text-gray-400">{app.jobId?.title || 'Unknown'}</td>
                          <td className="px-8 py-4 text-xs font-medium text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {applications.length === 0 && (
                        <tr>
                          <td colSpan="3" className="px-8 py-10 text-center text-gray-400">No applications received yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
           </div>
        )}

        {activeTab === 'jobs' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                Job Approvals
                {pendingJobs.length > 0 && (
                  <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-400 py-1 px-3 rounded-full text-xs font-bold border border-orange-200 dark:border-orange-500/30 shadow-sm">
                    {pendingJobs.length} Needs Review
                  </span>
                )}
              </h2>
            </div>

            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100 dark:border-dark-700 overflow-hidden">
              {pendingJobs.length === 0 ? (
                <div className="p-16 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">All caught up!</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">There are no jobs awaiting approval.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-dark-900/50 border-b border-gray-100 dark:border-dark-700">
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Job Details</th>
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Company</th>
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Salary</th>
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-dark-700/50">
                      {pendingJobs.map((job) => (
                        <tr key={job._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-700/30 transition-colors group">
                          <td className="p-5">
                            <div className="font-bold text-gray-900 dark:text-white text-base mb-1">{job.title}</div>
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1"><MapPin size={12}/>{job.location}</span>
                              <span>•</span>
                              <span className="bg-gray-100 dark:bg-dark-700 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">{job.category}</span>
                            </div>
                          </td>
                          <td className="p-5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {job.companyId?.companyName || 'Unknown Employer'}
                          </td>
                          <td className="p-5">
                            <span className="inline-flex items-center px-2.5 py-1 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm font-bold border border-green-100 dark:border-green-800/30">
                              ${job.salary?.toLocaleString()}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                             <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleJobApproval(job._id, 'Approved')}
                                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm focus:ring-2 focus:ring-green-500 focus:ring-offset-1 dark:focus:ring-offset-dark-800"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleJobApproval(job._id, 'Rejected')}
                                className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-red-100 dark:border-red-800/50 focus:ring-2 focus:ring-red-500 focus:ring-offset-1 dark:focus:ring-offset-dark-800"
                              >
                                Reject
                              </button>
                              <button 
                                onClick={() => handleDeleteJob(job._id)}
                                className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                                title="Delete Job"
                              >
                                <Trash2 size={18} />
                              </button>
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

        {activeTab === 'applications' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Platform Applications</h2>
            </div>

            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100 dark:border-dark-700 overflow-hidden">
              {applications.length === 0 ? (
                <div className="p-16 text-center text-gray-500 font-medium">No applications found on the platform.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-dark-900/50 border-b border-gray-100 dark:border-dark-700">
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Applicant</th>
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Applied For</th>
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Company</th>
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Status</th>
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">Applied On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-dark-700/50">
                      {applications.map((app) => (
                        <tr key={app._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-700/30 transition-colors">
                          <td className="p-5">
                             <div className="font-bold text-gray-900 dark:text-white text-sm">{app.firstName} {app.lastName}</div>
                             <div className="text-xs text-gray-500 dark:text-gray-400">{app.email}</div>
                          </td>
                          <td className="p-5">
                             <div className="font-bold text-brand-600 dark:text-brand-400 text-sm">{app.jobId?.title || 'Deleted Job'}</div>
                             <div className="text-xs text-gray-500 dark:text-gray-400">{app.jobId?.location}</div>
                          </td>
                          <td className="p-5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {app.jobId?.companyId?.companyName || 'Unknown'}
                          </td>
                          <td className="p-5">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                               app.status === 'Accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
                               app.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                               'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                             }`}>
                               {app.status}
                             </span>
                          </td>
                          <td className="p-5 text-gray-500 dark:text-gray-400 text-sm font-medium">
                             <div>{new Date(app.createdAt).toLocaleDateString()}</div>
                             {app.interviewDate && (
                               <div className="text-[10px] text-brand-500 font-bold uppercase mt-1 flex items-center gap-1">
                                 <Clock size={10} /> {app.interviewDate}
                               </div>
                             )}
                          </td>
                          <td className="p-5 text-right">
                             <div className="flex items-center justify-end gap-2">
                               {app.userId?.resumeUrl && (
                                 <a 
                                   href={`${api.defaults.baseURL.replace('/api', '')}/${app.userId.resumeUrl}`} 
                                   target="_blank" 
                                   rel="noreferrer" 
                                   className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 transition-colors"
                                   title="View Resume"
                                 >
                                   <FileText size={16} />
                                 </a>
                               )}
                               <button 
                                 onClick={() => openApprovalModal(app)}
                                 className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/10 transition-all hover:-translate-y-0.5"
                               >
                                 Review
                               </button>
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

        {activeTab === 'users' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">System Users</h2>
            </div>

            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-100 dark:border-dark-700 overflow-hidden">
              {users.length === 0 ? (
                <div className="p-16 text-center text-gray-500 font-medium">No users found in the system.</div>
              ) : (
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-dark-900/50 border-b border-gray-100 dark:border-dark-700">
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">User</th>
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Role</th>
                        <th className="p-5 font-bold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider text-right">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-dark-700/50">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-dark-700/30 transition-colors">
                          <td className="p-5">
                             <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold shadow-inner">
                                  {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-gray-900 dark:text-white text-sm">{u.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{u.email}</div>
                                </div>
                             </div>
                          </td>
                          <td className="p-5">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                              u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/50' :
                              u.role === 'company' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50' :
                              'bg-gray-100 text-gray-700 border-gray-200 dark:bg-dark-700 dark:text-gray-300 dark:border-dark-600'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-5 text-gray-500 dark:text-gray-400 text-sm font-medium text-right">
                            <div className="flex items-center justify-end gap-3">
                              {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {u.role !== 'admin' && (
                                <button 
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
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
      </div>
      {/* Approval & Interview Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm" onClick={() => setShowApprovalModal(false)}></div>
          <div className="bg-white dark:bg-dark-800 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 border border-gray-100 dark:border-dark-700 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-100 dark:border-dark-700">
              <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">Review Application</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Decide the status and schedule interviews for {selectedApp?.firstName}.</p>
            </div>
            <form onSubmit={handleUpdateApplication} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Application Status</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Pending', 'Accepted', 'Rejected'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: s })}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                        formData.status === s 
                          ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/30' 
                          : 'bg-transparent border-gray-100 dark:border-dark-700 text-gray-500 hover:border-brand-500'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {formData.status === 'Accepted' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Interview Date & Time</label>
                  <input 
                    type="text" 
                    placeholder="e.g., April 15, 2026, 10:00 AM"
                    className="w-full px-4 py-3.5 bg-gray-50 dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                    required={formData.status === 'Accepted'}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Internal Notes / Feedback</label>
                <textarea 
                  className="w-full px-4 py-3.5 bg-gray-50 dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none font-medium h-32 resize-none"
                  placeholder="Notes for the candidate or internal use..."
                  value={formData.adminFeedback}
                  onChange={(e) => setFormData({ ...formData, adminFeedback: e.target.value })}
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1 px-6 py-3.5 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-[2] px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-bold shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {updateLoading ? 'Updating...' : 'Save Decision'}
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
