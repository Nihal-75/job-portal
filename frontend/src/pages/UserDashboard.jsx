import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { api, user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(res.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [api]);

  return (
    <div className="min-h-[85vh] bg-gray-50 dark:bg-dark-900 transition-colors duration-300 pt-28 pb-12 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 animate-slide-up">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">My Applications</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Track and manage your job seeking journey.</p>
          </div>
          <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/30 transform hover:-translate-y-0.5 transition-all duration-200">
            Find More Jobs
             <svg className="ml-2 -mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-white/50 dark:border-dark-700 overflow-hidden animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center space-y-4">
               <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
               <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center bg-gray-50/50 dark:bg-dark-800/50 rounded-2xl">
              <div className="w-24 h-24 mb-6 relative">
                 <div className="absolute inset-0 bg-brand-100 dark:bg-brand-900/30 rounded-full animate-ping opacity-75"></div>
                 <div className="relative flex items-center justify-center w-24 h-24 bg-brand-50 dark:bg-dark-700 rounded-full text-5xl shadow-inner">
                    📄
                 </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No applications yet</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">Your dream job is out there. Start exploring open positions and track them here.</p>
              <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border-2 border-brand-600 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-sm font-bold rounded-xl transition-all duration-200">
                 Browse Jobs Now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 dark:bg-dark-900/50 border-b border-gray-100 dark:border-dark-700">
                    <th className="p-5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">Job Title</th>
                    <th className="p-5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs hidden md:table-cell">Applicant Name</th>
                    <th className="p-5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs hidden sm:table-cell">Company</th>
                    <th className="p-5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs hidden lg:table-cell">Applied On</th>
                    <th className="p-5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs text-center">Status</th>
                    <th className="p-5 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-700">
                  {applications.map((app, index) => (
                    <tr 
                      key={app._id} 
                      className={`hover:bg-gray-50/80 dark:hover:bg-dark-700/50 transition-colors animate-slide-up group`}
                      style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}
                    >
                      <td className="p-5">
                        <div className="font-bold text-gray-900 dark:text-white text-base">
                          {app.jobId?.title || 'Job Unavailable'}
                        </div>
                         <div className="text-gray-500 dark:text-gray-400 text-xs sm:hidden mt-1 font-medium flex items-center gap-1.5">
                           <span className="truncate max-w-[120px]">{app.jobId?.companyId?.companyName || 'Unknown'}</span>
                           <span>•</span>
                           <span>{new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        </div>
                      </td>
                      <td className="p-5 text-gray-700 dark:text-gray-300 font-medium hidden md:table-cell">
                        {app.firstName} {app.lastName}
                      </td>
                      <td className="p-5 hidden sm:table-cell">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded bg-gray-100 dark:bg-dark-600 flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold text-xs uppercase shrink-0">
                              {app.jobId?.companyId?.companyName ? app.jobId.companyId.companyName.substring(0,2) : 'NA'}
                           </div>
                           <span className="font-medium text-gray-700 dark:text-gray-300">
                             {app.jobId?.companyId?.companyName || 'Unknown'}
                           </span>
                        </div>
                      </td>
                      <td className="p-5 text-gray-500 dark:text-gray-400 text-sm hidden lg:table-cell font-medium">
                        {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-5 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                          app.status === 'Accepted' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800' :
                          app.status === 'Rejected' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800' :
                          'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                        }`}>
                           {app.status === 'Accepted' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>}
                           {app.status === 'Rejected' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>}
                           {(app.status !== 'Accepted' && app.status !== 'Rejected') && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5 animate-pulse"></span>}
                          {app.status}
                        </span>
                      </td>
                      <td className="p-5 text-right whitespace-nowrap">
                         <div className="flex items-center justify-end gap-2">
                           <Link 
                              to={`/job/${app.jobId?._id}`} 
                              className="inline-flex items-center text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 font-bold text-sm transition-colors p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20"
                              title="View Job Details"
                           >
                             <span className="sr-only sm:not-sr-only sm:mr-1">View</span>
                             <svg className="w-4 h-4 ml-0 sm:ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                             </svg>
                           </Link>
                           
                           <button 
                              onClick={async () => {
                                if(window.confirm('Are you sure you want to withdraw this application? This cannot be undone.')) {
                                  try {
                                    await api.delete(`/applications/${app._id}`);
                                    setApplications(applications.filter(a => a._id !== app._id));
                                  } catch(err) {
                                    console.error('Error deleting application', err);
                                    alert('Failed to delete application. Please try again.');
                                  }
                                }
                              }}
                              className="inline-flex items-center text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold text-sm transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                              title="Withdraw Application"
                           >
                             <span className="sr-only sm:not-sr-only sm:mr-1">Withdraw</span>
                             <svg className="w-4 h-4 ml-0 sm:ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
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
    </div>
  );
};

export default UserDashboard;
