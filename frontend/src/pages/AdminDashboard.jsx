import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Users, Briefcase, Clock, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { api } = useContext(AuthContext);
  
  const [stats, setStats] = useState(null);
  const [pendingJobs, setPendingJobs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, jobsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/jobs/admin/all'),
        api.get('/admin/users')
      ]);
      
      setStats(statsRes.data);
      setPendingJobs(jobsRes.data.filter(job => job.status === 'Pending'));
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load admin dashboard data.');
    } finally {
      setLoading(false);
    }
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
           <div className="bg-white/60 dark:bg-dark-800/60 backdrop-blur-md px-5 py-2.5 rounded-xl border border-gray-200/50 dark:border-dark-700/50 text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm w-fit self-start md:self-end">
             {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
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

          </div>
        )}

        {/* Pending Jobs Table */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              Pending Approvals
              {pendingJobs.length > 0 && (
                <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-800 dark:text-orange-400 py-1 px-3 rounded-full text-xs font-bold border border-orange-200 dark:border-orange-500/30 shadow-sm animate-pulse-slow">
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

        {/* Users Directory */}
        <div>
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
                          {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
