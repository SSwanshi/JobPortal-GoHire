import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/jobs/JobCard';
import InternshipCard from '../components/internships/InternshipCard';

const highlightText = (text, query) => {
  if (!text || !query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-yellow-200 px-0.5 rounded">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    )
  );
};

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('jobs');

  const query = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') || location.state?.query || '';
  }, [location.search, location.state]);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.post('/search', {
          parsedValue: query,
        });

        setJobs(response.data.jobs || []);
        setInternships(response.data.internships || []);
      } catch (err) {
        setError(
          err.response?.data?.error ||
          'Something went wrong while fetching search results.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const totalJobs = jobs.length;
  const totalInternships = internships.length;
  const hasResults = totalJobs > 0 || totalInternships > 0;

  const handleNewSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newQuery = formData.get('q')?.toString().trim() || '';

    if (!newQuery) return;

    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      {/* Search Bar (local to this page) */}


      <section className="pt-8 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-700 text-lg">Loading search results...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center justify-center py-16">
            <div className="bg-white rounded-xl shadow-md border border-red-200 p-6 max-w-xl text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Failed to load results
              </h2>
              <p className="text-gray-700">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && query && hasResults && (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Search Results for{' '}
                <span className="text-blue-600">"{query}"</span>
              </h1>
              <p className="text-gray-600">
                Found {totalJobs} job{totalJobs !== 1 ? 's' : ''}
                {totalJobs > 0 && totalInternships > 0 && ' and '}
                {totalInternships} internship
                {totalInternships !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setActiveTab('jobs')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg ${activeTab === 'jobs'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  Jobs ({totalJobs})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('internships')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg ${activeTab === 'internships'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  Internships ({totalInternships})
                </button>
              </div>
            </div>

            {/* Jobs Section */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">💼</span> Job Opportunities
                </h2>

                {totalJobs > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {jobs.map((job) => (
                      <div key={job._id} className="fade-in">
                        <JobCard
                          job={{
                            ...job,
                            jobTitle: highlightText(job.jobTitle, query),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No jobs found matching{' '}
                      <span className="text-blue-600">"{query}"</span>
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search filters or browse our{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/jobs')}
                        className="text-blue-500 hover:underline"
                      >
                        job listings
                      </button>
                      .
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Internships Section */}
            {activeTab === 'internships' && (
              <div className="space-y-6 mt-12">
                <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                  <span className="mr-2">🎓</span> Internship Opportunities
                </h2>

                {totalInternships > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                    {internships.map((internship) => (
                      <div key={internship._id} className="fade-in">
                        <InternshipCard internship={internship} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No internships found matching{' '}
                      <span className="text-blue-600">"{query}"</span>
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search filters or browse our{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/internships')}
                        className="text-blue-500 hover:underline"
                      >
                        internship listings
                      </button>
                      .
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {!loading && !error && query && !hasResults && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                No Results Found
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We couldn&apos;t find any jobs or internships matching{' '}
                <span className="font-semibold text-blue-600">"{query}"</span>.
              </p>
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
              >
                Browse All Opportunities
              </button>
            </div>
          </div>
        )}

        {!loading && !error && !query && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Start your search
              </h2>
              <p className="text-gray-600">
                Enter a keyword above to find jobs and internships.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchResults;