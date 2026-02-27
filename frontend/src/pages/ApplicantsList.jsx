import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ApplicantsList = () => {
  const { jobId } = useParams();
  const { api } = useContext(AuthContext);
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplications(res.data);
    } catch (err) {
      setErrorMsg('Failed to load applicants or unauthorized.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    if(!window.confirm(`Are you sure you want to ${newStatus} this application? This will send an email to the applicant.`)) return;

    try {
      await api.put(`/applications/${applicationId}/status`, { status: newStatus });
      // Remove or update from local slice
      setApplications(prev => prev.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      alert('Failed to update status: ' + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 dark:border-gray-700 pb-6 gap-4">
        <div>
           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Review Applicants</h1>
           <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Manage candidates who have applied to your listing.</p>
        </div>
        <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 transition flex items-center gap-2">
          <span className="text-xl">⬅️</span> Back to Dashboard
        </Link>
      </div>

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-800 mb-8 font-medium shadow-sm">
          ⚠️ {errorMsg}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-gray-500 dark:text-gray-400 font-medium text-lg flex flex-col items-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
             Loading applicants...
           </div>
        ) : applications.length === 0 ? (
           <div className="p-16 text-center bg-gray-50 dark:bg-gray-800/50">
             <div className="text-6xl mb-6 opacity-50">📬</div>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Applications Yet</h3>
             <p className="text-gray-500 dark:text-gray-400 text-lg">Wait for job seekers to apply to this position.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-b border-gray-100 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="p-5 font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">Applicant Name</th>
                  <th className="p-5 font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">Details & Contact</th>
                  <th className="p-5 font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">Applied Date</th>
                  <th className="p-5 font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">Documents</th>
                  <th className="p-5 font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider text-center">Status</th>
                  <th className="p-5 font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider text-center">Decisions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition">
                    <td className="p-5 font-extrabold text-gray-900 dark:text-white border-l-4 border-l-transparent hover:border-l-blue-500 text-lg">
                      {app.firstName} {app.middleName ? app.middleName + ' ' : ''}{app.lastName}
                    </td>
                    <td className="p-5 text-gray-600 dark:text-gray-300">
                      <div className="flex flex-col space-y-1">
                        <a href={`mailto:${app.email}`} className="hover:text-blue-600 dark:hover:text-blue-400 font-medium truncate max-w-[200px]" title={app.email}>
                          📧 {app.email}
                        </a>
                        <span className="text-sm font-medium"><span className="text-gray-400 mr-1">📞</span>{app.phone || <span className="italic text-gray-400">N/A</span>}</span>
                        <span className="text-sm font-medium"><span className="text-gray-400 mr-1">🎓</span>{app.qualification || <span className="italic text-gray-400">N/A</span>}</span>
                        <span className="text-sm font-medium"><span className="text-gray-400 mr-1">💼</span>{app.jobRole || <span className="italic text-gray-400">N/A</span>} ({app.experience || <span className="italic text-gray-400">N/A</span>})</span>
                      </div>
                    </td>
                    <td className="p-5 text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="p-5 flex flex-col gap-2">
                      <a 
                        href={app.resumeUrl?.startsWith('http') ? app.resumeUrl : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${app.resumeUrl}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/40 px-3 py-2 rounded-lg font-bold text-sm transition"
                      >
                         <span>📄</span> Resume
                      </a>
                      {app.experienceCertificateUrl && (
                        <a 
                          href={app.experienceCertificateUrl.startsWith('http') ? app.experienceCertificateUrl : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${app.experienceCertificateUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/40 px-3 py-2 rounded-lg font-bold text-sm transition"
                        >
                           <span>📜</span> Certificate
                        </a>
                      )}
                    </td>
                    <td className="p-5 text-center align-middle">
                       <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-sm ${
                        app.status === 'Accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="p-5 text-center align-middle">
                      <div className="flex justify-center space-x-2">
                        {app.status === 'Pending' ? (
                          <>
                            <button 
                              onClick={() => updateStatus(app._id, 'Accepted')}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm hover:shadow-md"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => updateStatus(app._id, 'Rejected')}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm hover:shadow-md"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-sm italic font-medium px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">Decision Made</span>
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
  );
};

export default ApplicantsList;
