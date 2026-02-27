import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { MoreHorizontal, Download, ChevronLeft, ChevronRight, Check } from 'lucide-react';

const CompanyDashboard = () => {
  const { user, api } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsRes = await api.get('/jobs/company');
        setJobs(jobsRes.data);
        
        // In a real app we'd fetch actual real-time aggregated stats.
        // For now, we fetch applications and build mock stats around them for the visual.
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  // Mock data to exactly match the visual style of the reference image
  const barChartData = [
    { name: 'Jan', Applications: 10, Shortlisted: 2 },
    { name: 'Feb', Applications: 25, Shortlisted: 5 },
    { name: 'Mar', Applications: 40, Shortlisted: 12 },
    { name: 'Apr', Applications: 55, Shortlisted: 18 },
    { name: 'May', Applications: 15, Shortlisted: 4 },
    { name: 'Jun', Applications: 35, Shortlisted: 8 },
    { name: 'Jul', Applications: 25, Shortlisted: 5 },
    { name: 'Aug', Applications: 45, Shortlisted: 15 },
    { name: 'Sep', Applications: 50, Shortlisted: 18 },
    { name: 'Oct', Applications: 80, Shortlisted: 45 },
    { name: 'Nov', Applications: 95, Shortlisted: 55 },
    { name: 'Dec', Applications: 20, Shortlisted: 5 },
  ];

  const pieData1 = [{ value: 60, color: '#4c1d95' }, { value: 40, color: '#f3f4f6' }];
  const pieData2 = [{ value: 50, color: '#16a34a' }, { value: 50, color: '#f3f4f6' }];
  const pieData3 = [{ value: 34, color: '#ca8a04' }, { value: 66, color: '#f3f4f6' }];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Loading Dashboard Analytics...</p>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-dark-900 transition-colors duration-300 min-h-screen pt-28 pb-12 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-brand-500/10 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Analytics Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Welcome back, <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.name || 'Company'}</span>!</p>
          </div>
          <Link to="/post-job" className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-500/30 transition-all duration-200 flex items-center gap-2 transform hover:-translate-y-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            Post New Job
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Main Content Area (Left 3 Columns) */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {/* Card 1 */}
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700 flex items-center justify-between hover:shadow-md transition-shadow group cursor-default">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Applications</p>
                  <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">132.0K</h3>
                </div>
                <div className="w-16 h-16 relative transform group-hover:scale-110 transition-transform duration-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData1} innerRadius={22} outerRadius={30} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                        {pieData1.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#4c1d95' : 'var(--tw-colors-gray-100)'} className={index === 1 ? 'dark:fill-dark-700' : ''} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">60%</span>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700 flex items-center justify-between hover:shadow-md transition-shadow group cursor-default">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Shortlisted</p>
                  <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">10.9k</h3>
                </div>
                <div className="w-16 h-16 relative transform group-hover:scale-110 transition-transform duration-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData2} innerRadius={22} outerRadius={30} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                        {pieData2.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#16a34a' : 'var(--tw-colors-gray-100)'} className={index === 1 ? 'dark:fill-dark-700' : ''} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">50%</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700 flex items-center justify-between hover:shadow-md transition-shadow group cursor-default">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">On-Hold</p>
                  <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">03.1k</h3>
                </div>
                <div className="w-16 h-16 relative transform group-hover:scale-110 transition-transform duration-300">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData3} innerRadius={22} outerRadius={30} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                        {pieData3.map((entry, index) => <Cell key={`cell-${index}`} fill={index === 0 ? '#ca8a04' : 'var(--tw-colors-gray-100)'} className={index === 1 ? 'dark:fill-dark-700' : ''} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">34%</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Chart and Total Applications side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              
              {/* Left Chart: Active Jobs */}
              <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-xl">Active Jobs</h3>
                  <button className="bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/40 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors">
                    Download <Download size={14} strokeWidth={2.5}/>
                  </button>
                </div>
                <div className="flex gap-4 mb-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#4c1d95] shadow-sm"></div> Applications</span>
                  <span className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm bg-[#10b981] shadow-sm"></div> Shortlisted</span>
                </div>
                <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--tw-colors-gray-200)" className="dark:opacity-10" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--tw-colors-gray-500)' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--tw-colors-gray-500)' }} />
                      <RechartsTooltip 
                         cursor={{ fill: 'var(--tw-colors-gray-100)', className: 'dark:opacity-5' }} 
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-white)', color: 'var(--tw-colors-gray-900)' }}
                         wrapperClassName="dark:!bg-dark-800 dark:!text-white"
                      />
                      <Bar dataKey="Applications" fill="#4c1d95" radius={[4, 4, 0, 0]} barSize={8} />
                      <Bar dataKey="Shortlisted" fill="#10b981" radius={[4, 4, 0, 0]} barSize={8} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Col: Total Applications */}
              <div className="space-y-6 flex flex-col">
                <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700 flex-grow hover:shadow-md transition-shadow">
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-xl mb-6">Total Applications</h3>
                  
                  {/* Stacked Progress Bar */}
                  <div className="w-full h-3 flex rounded-full overflow-hidden mb-8 shadow-inner bg-gray-100 dark:bg-dark-700">
                    <div className="bg-[#4c1d95] transform hover:scale-y-110 transition-transform origin-left" style={{ width: '45%' }} title="Applications: 45%"></div>
                    <div className="bg-[#10b981] transform hover:scale-y-110 transition-transform" style={{ width: '22%' }} title="Shortlisted: 22%"></div>
                    <div className="bg-[#eab308] transform hover:scale-y-110 transition-transform" style={{ width: '15%' }} title="On-Hold: 15%"></div>
                    <div className="bg-[#f43f5e] transform hover:scale-y-110 transition-transform origin-right" style={{ width: '18%' }} title="Rejected: 18%"></div>
                  </div>

                  <div className="space-y-4">
                    {[
                       { label: 'Applications', color: '#4c1d95', pct: '45%', bgCls: 'bg-indigo-50 dark:bg-indigo-900/20', textCls: 'text-indigo-700 dark:text-indigo-400' },
                       { label: 'Shortlisted', color: '#10b981', pct: '22%', bgCls: 'bg-green-50 dark:bg-green-900/20', textCls: 'text-green-700 dark:text-green-400' },
                       { label: 'On-Hold', color: '#eab308', pct: '15%', bgCls: 'bg-yellow-50 dark:bg-yellow-900/20', textCls: 'text-yellow-700 dark:text-yellow-400' },
                       { label: 'Rejected', color: '#f43f5e', pct: '18%', bgCls: 'bg-red-50 dark:bg-red-900/20', textCls: 'text-red-700 dark:text-red-400' }
                    ].map((idx, item) => (
                       <div key={item} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 dark:hover:bg-dark-700/50 rounded-lg transition-colors cursor-default">
                         <span className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-bold">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: idx.color }}></div> 
                            {idx.label}
                         </span>
                         <span className={`${idx.bgCls} ${idx.textCls} px-2.5 py-1 rounded font-extrabold shadow-sm border border-transparent dark:border-current/10`}>{idx.pct}</span>
                       </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Detailed Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
               {/* Job Role List */}
               <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-xl">Job Role</h3>
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Applications</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { role: 'Project Manager', count: 324, icon: '💼' },
                      { role: 'Sales Manager', count: 184, icon: '🔥' },
                      { role: 'Machine Instrument', count: 452, icon: '⚙️' },
                      { role: 'Operation Manager', count: 452, icon: '📈' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-dark-700/50 rounded-xl transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-dark-700 flex items-center justify-center text-xl shadow-sm border border-gray-100 dark:border-dark-600 group-hover:bg-white dark:group-hover:bg-dark-600 transition-colors transform group-hover:scale-105">{item.icon}</div>
                           <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{item.role}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="font-extrabold text-gray-900 dark:text-white">{item.count}</span>
                           <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-50 text-green-500 dark:bg-green-900/20 dark:text-green-400"><Check size={14} strokeWidth={3} /></span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* New Applications List */}
               <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700">
                  <h3 className="font-extrabold text-gray-900 dark:text-white text-xl mb-6">New Applications</h3>
                  <div className="space-y-4">
                    {[
                      { name: 'Crystal Doe', role: 'UI/UX Designer', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop' },
                      { name: 'Mason Clark', role: 'Project Coordinator', img: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop' },
                      { name: 'Emily Yates', role: 'Logical Support', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop' },
                      { name: 'Daniel Smith', role: 'Database Architect', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop' },
                    ].map((applicant, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 dark:hover:bg-dark-700/50 rounded-xl transition-all cursor-pointer group border border-transparent hover:border-gray-200 dark:hover:border-dark-600 hover:shadow-sm">
                        <div className="flex items-center gap-4">
                           <img src={applicant.img} alt={applicant.name} className="w-12 h-12 rounded-full border-2 border-white dark:border-dark-600 shadow-sm object-cover" />
                           <div>
                             <h4 className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{applicant.name}</h4>
                             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">Applied for <span className="font-bold text-gray-600 dark:text-gray-300">{applicant.role}</span></p>
                           </div>
                        </div>
                        <button className="text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"><MoreHorizontal size={20} /></button>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

          </div>

          {/* Right Sidebar Area */}
          <div className="xl:col-span-1 space-y-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            
            {/* Calendar Widget */}
            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-extrabold text-gray-900 dark:text-white">December 2026</h3>
                 <div className="flex gap-2">
                   <button className="p-1.5 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 text-gray-500 dark:text-gray-400 transition-colors"><ChevronLeft size={16} strokeWidth={3} /></button>
                   <button className="p-1.5 rounded-lg bg-gray-50 dark:bg-dark-700 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/30 dark:hover:text-brand-400 text-gray-500 dark:text-gray-400 transition-colors"><ChevronRight size={16} strokeWidth={3} /></button>
                 </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-3">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} className="font-bold text-gray-400 dark:text-gray-500 uppercase">{day}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm font-bold text-gray-700 dark:text-gray-300">
                {/* Empty slots for spacing */}
                <div></div><div></div>
                {/* Days */}
                {[...Array(31)].map((_, i) => (
                  <div key={i} className={`p-2 flex items-center justify-center rounded-xl transition-all ${i+1===4 ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 transform scale-110' : 'hover:bg-gray-100 dark:hover:bg-dark-700 cursor-pointer hover:text-brand-600 dark:hover:text-brand-400'}`}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Scheduled Meeting / Interview Widget */}
            <div className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700 hidden sm:block">
               <h3 className="font-extrabold text-gray-900 dark:text-white text-xl mb-6">Scheduled Meetings</h3>
               
               <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-500/50 before:via-gray-200 dark:before:via-dark-600 before:to-transparent">
                  {/* Timeline Item 1 */}
                  <div className="relative flex items-start group">
                     <div className="flex text-lg items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-dark-800 bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 z-10 shadow-sm mt-0.5">
                       <span className="w-2.5 h-2.5 bg-brand-500 rounded-full"></span>
                     </div>
                     <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Interview - UI Designer</h4>
                           <span className="text-xs text-brand-700 dark:text-brand-300 font-extrabold bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-md border border-brand-100 dark:border-brand-800">9</span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">9:00 AM - 11:30 AM</p>
                     </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="relative flex items-start group">
                     <div className="flex text-lg items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-dark-800 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 z-10 shadow-sm mt-0.5">
                        <span className="w-2h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                     </div>
                     <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Team Sync</h4>
                           <span className="text-xs text-gray-600 dark:text-gray-400 font-extrabold bg-gray-100 dark:bg-dark-700 px-2 py-0.5 rounded-md">10</span>
                        </div>
                     </div>
                  </div>

                  {/* Timeline Item 3 (Active) */}
                  <div className="relative flex items-start group">
                     <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-dark-800 bg-yellow-400 z-10 shadow-[0_0_15px_rgba(250,204,21,0.5)] mt-0.5 animate-pulse"></div>
                     <div className="ml-4 flex-1 bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/20 dark:to-dark-800/50 rounded-xl p-4 border border-yellow-100 dark:border-yellow-900/30 shadow-sm relative -top-3 group-hover:-translate-y-1 transition-transform">
                        <div className="flex justify-between items-start mb-1.5">
                           <h4 className="font-extrabold text-yellow-800 dark:text-yellow-500 text-sm">Meeting with Manager</h4>
                           <span className="text-xs text-yellow-700 dark:text-yellow-400 font-extrabold bg-yellow-100 dark:bg-yellow-900/40 px-2 py-0.5 rounded-md border border-yellow-200 dark:border-yellow-800">17</span>
                        </div>
                        <p className="text-xs font-bold text-yellow-600 dark:text-yellow-600">10:00 AM - 10:30 AM</p>
                        <div className="flex -space-x-2 mt-3">
                           <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop" className="w-6 h-6 rounded-full border-2 border-white dark:border-dark-800" alt="participant" />
                           <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop" className="w-6 h-6 rounded-full border-2 border-white dark:border-dark-800" alt="participant" />
                        </div>
                     </div>
                  </div>

                  {/* Timeline Item 4 */}
                  <div className="relative flex items-start group">
                     <div className="flex text-lg items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-dark-800 bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 z-10 shadow-sm mt-0.5">
                         <span className="w-2.5 h-2.5 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                     </div>
                     <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Interview - Full Stack</h4>
                           <span className="text-xs text-gray-600 dark:text-gray-400 font-extrabold bg-gray-100 dark:bg-dark-700 px-2 py-0.5 rounded-md">18</span>
                        </div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">10:50 AM - 11:20 AM</p>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyDashboard;
