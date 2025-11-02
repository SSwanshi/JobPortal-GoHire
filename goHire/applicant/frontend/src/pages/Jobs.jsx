import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { applicantApi } from "../services/applicantApi";
import Header from "../components/common/Header";
import EmptyState from "../components/common/EmptyState";
import JobCard from "../components/jobs/JobCard";
import JobFilters from "../components/jobs/JobFilters";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobs = await applicantApi.getJobs("");
        setJobs(jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Header title="Available Jobs" />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters - left column */}
          <div className="w-full lg:w-1/4">
            <JobFilters />
          </div>

          {/* Job list - right column */}
          <div className="w-full lg:w-3/4">
            {jobs.length === 0 ? (
              <EmptyState message="No jobs available at the moment" />
            ) : (
              <div className="flex flex-col gap-6">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
