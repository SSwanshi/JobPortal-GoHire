import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminApi } from '../../services/adminApi';
import { fetchPendingVerificationsCount } from '../../store/slices/pendingVerificationsSlice';
import Card from '../../components/ui/Card';
import Header from '../../components/common/Header';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { count: pendingCount } = useSelector((state) => state.pendingVerifications);
  const [stats, setStats] = useState({
    applicants: 0,
    recruiters: 0,
    companies: 0,
    jobs: 0,
    internships: 0,
    premiumUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    dispatch(fetchPendingVerificationsCount());
  }, [dispatch]);

  const fetchStats = async () => {
    try {
      const [applicants, recruiters, companies, jobs, internships, premiumUsers] = await Promise.all([
        adminApi.getApplicants().catch(() => []),
        adminApi.getRecruiters().catch(() => []),
        adminApi.getCompanies().catch(() => []),
        adminApi.getJobs().catch(() => []),
        adminApi.getInternships().catch(() => []),
        adminApi.getPremiumUsers().catch(() => []),
      ]);

      setStats({
        applicants: applicants.length || 0,
        recruiters: recruiters.length || 0,
        companies: companies.length || 0,
        jobs: jobs.flatMap(c => c.jobs || []).length || 0,
        internships: internships.flatMap(c => c.internships || []).length || 0,
        premiumUsers: premiumUsers.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header title="Dashboard" />
        <div className="text-center py-12">Loading dashboard...</div>
      </div>
    );
  }

  const statCards = [
    { name: 'Applicants', value: stats.applicants, href: '/applicants', color: 'bg-blue-500' },
    { name: 'Recruiters', value: stats.recruiters, href: '/recruiters', color: 'bg-green-500' },
    { name: 'Companies', value: stats.companies, href: '/companies', color: 'bg-purple-500' },
    { name: 'Jobs', value: stats.jobs, href: '/jobs', color: 'bg-yellow-500' },
    { name: 'Internships', value: stats.internships, href: '/internships', color: 'bg-pink-500' },
    { name: 'Premium Users', value: stats.premiumUsers, href: '/premium-users', color: 'bg-indigo-500' },
  ];

  return (
    <div>
      <Header title="Dashboard" />
      
      {/* View Awaiting Verification Button */}
      <div className="mt-6 mb-6">
        <Link to="/companies/awaiting-verification">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-orange-500 rounded-lg p-3 mr-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">View Awaiting Verification</p>
                  <p className="text-sm text-gray-500">Companies pending verification</p>
                </div>
              </div>
              {pendingCount > 0 && (
                <div className="relative">
                  <div className="bg-red-500 text-white rounded-full px-3 py-1 text-sm font-semibold flex items-center justify-center min-w-[24px] h-6">
                    {pendingCount}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {statCards.map((stat) => (
          <Link key={stat.name} to={stat.href}>
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
