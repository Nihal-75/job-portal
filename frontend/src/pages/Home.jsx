import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    // Optionally prefetch suggestions, but don't fetch full job list until search
  }, []);

  const fetchJobs = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchCategory) queryParams.append('category', searchCategory);
      if (searchLocation) queryParams.append('location', searchLocation);

      let query = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/jobs`;
      if (queryParams.toString()) {
        query += `?${queryParams.toString()}`;
      }

      const res = await axios.get(query);
      setJobs(res.data);
    } catch (err) {
      console.error('Error fetching jobs', err);
    }
  };


  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchCategory.trim().length > 1) {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/jobs/suggestions?q=${searchCategory}`);
          setSuggestions(res.data);
          setShowSuggestions(true);
        } catch (err) {
          console.error('Error fetching suggestions', err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    setHasSearched(true);
    fetchJobs();
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchCategory(suggestion.title);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-300 overflow-hidden">
      
      {/* Premium Hero Section */}
      <section className="relative pt-36 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-white dark:bg-dark-800 flex items-center justify-center min-h-[600px]">
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-dark-900 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-900/90 via-dark-900/95 to-dark-900 z-10"></div>
          
          <img 
            src="/find-your-dream-job.jpeg" 
            alt="Find Your Dream Job Candidates" 
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay object-top transition-transform duration-[10000ms] ease-in-out hover:scale-105"
            onError={(e) => {
              // Fallback just in case
              e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop';
            }}
          />
        </div>

        {/* Animated Blobs (Kept subtle to not clash with image subject) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-20 pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-30 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-sm font-semibold tracking-wider mb-6 animate-fade-in shadow-sm backdrop-blur-sm">
            ELEVATE YOUR CAREER
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight animate-slide-up drop-shadow-lg">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-purple-300">perfect role</span><br className="hidden md:block" /> for your next move
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-2xl mx-auto font-medium leading-relaxed animate-slide-up drop-shadow-md" style={{animationDelay: '0.1s'}}>
            Connect with top-tier companies and discover opportunities that match your skills, ambition, and vision.
          </p>

          {/* Search Bar Container */}
          <div className="max-w-4xl mx-auto relative animate-slide-up" style={{animationDelay: '0.2s'}}>
            <form onSubmit={handleSearch} className="glass p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-2 md:gap-0">
              
              {/* Autocomplete Input Container */}
              <div className="relative flex-grow flex items-center">
                <span className="absolute left-4 text-gray-400 z-10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Job title, skills, or company" 
                  className="w-full py-4 pl-12 pr-4 bg-transparent text-white placeholder-gray-400 outline-none focus:ring-0 text-base md:text-lg rounded-xl md:rounded-l-full md:rounded-r-none border border-transparent focus:bg-white/5 transition-colors"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-dark-800 rounded-xl shadow-2xl border border-gray-100 dark:border-dark-700 overflow-hidden z-50 text-left">
                    <ul className="max-h-64 overflow-y-auto custom-scrollbar">
                      {suggestions.map((suggestion) => (
                        <li 
                          key={suggestion._id}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer border-b border-gray-100 dark:border-dark-700/50 last:border-0 transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevent blur
                            handleSuggestionClick(suggestion);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900 dark:text-white">{suggestion.title}</span>
                            <span className="text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 px-2.5 py-1 rounded-full">{suggestion.category}</span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {suggestion.companyId?.companyName}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="hidden md:block w-px h-8 bg-gray-600 my-auto self-center"></div>

              <div className="relative flex-grow flex items-center">
                <span className="absolute left-4 text-gray-400 z-10">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </span>
                <input 
                  type="text" 
                  placeholder="City, state, or remote" 
                  className="w-full py-4 pl-12 pr-4 bg-transparent text-white placeholder-gray-400 outline-none focus:ring-0 text-base md:text-lg rounded-xl md:rounded-none border border-transparent focus:bg-white/5 transition-colors"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>

              <button type="submit" className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-4 rounded-xl md:rounded-full transition-all shadow-lg hover:shadow-brand-500/30 hover:shadow-xl transform hover:-translate-y-0.5 text-lg w-full md:w-auto mt-2 md:mt-0 whitespace-nowrap">
                Search Jobs
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Jobs Listing - Only renders after search */}
      {hasSearched && (
        <section id="jobs" className="container mx-auto py-20 px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Search Results
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                Found roles matching your criteria.
              </p>
            </div>
          </div>
          
          {jobs.length === 0 ? (
            <div className="text-center bg-white dark:bg-dark-800 rounded-3xl p-12 py-24 border border-gray-100 dark:border-dark-700 shadow-sm animate-fade-in">
               <div className="text-6xl mb-6 text-gray-300 dark:text-dark-600">
                 <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
               </div>
              <p className="text-2xl text-gray-600 dark:text-gray-300 font-semibold mb-2">No jobs found</p>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">We couldn't find any positions matching your current search criteria. Try adjusting your filters.</p>
              <button 
                onClick={() => {setSearchCategory(''); setSearchLocation(''); setHasSearched(false);}} 
                className="mt-2 text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 dark:hover:text-brand-300 hover:underline transition-colors"
              >
                Clear all filters
              </button>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job, index) => (
              <div 
                key={job._id} 
                className="bg-white dark:bg-dark-800 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-dark-700 flex flex-col h-full group transform hover:-translate-y-1 animate-slide-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Job Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="w-12 h-12 bg-gray-100 dark:bg-dark-700 rounded-xl flex items-center justify-center text-xl font-bold text-gray-500 shadow-inner flex-shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                      {job.companyId?.companyName ? job.companyId.companyName.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
                        {job.companyId?.companyName || 'Unknown Company'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Meta Labels */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-600">
                    <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {job.location}
                  </span>
                  <span className="flex items-center text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-600">
                    <svg className="w-3.5 h-3.5 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    {job.category}
                  </span>
                  <span className="flex items-center text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800/50">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    ${job.salary?.toLocaleString()}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6 leading-relaxed flex-grow">
                  {job.description}
                </p>
                
                {/* Skills tags */}
                <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  {job.skills?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="text-xs font-medium text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/20 px-2.5 py-1 rounded-md">
                      {skill}
                    </span>
                  ))}
                  {job.skills?.length > 3 && (
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-700 px-2.5 py-1 rounded-md">
                      +{job.skills.length - 3}
                    </span>
                  )}
                </div>

                <div className="pt-5 border-t border-gray-100 dark:border-dark-700">
                  <Link 
                    to={`/job/${job._id}`} 
                    className="block w-full text-center bg-gray-50 dark:bg-dark-700 group-hover:bg-brand-600 text-gray-900 group-hover:text-white border border-transparent dark:text-white font-semibold py-3.5 rounded-xl transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;
