import { useQuery } from '@tanstack/react-query';
import API from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: () => API.get('/admin/stats').then(res => res.data)
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Cars</p>
          <p className="text-2xl font-bold">{stats?.totalCars}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Bookings</p>
          <p className="text-2xl font-bold">{stats?.totalBookings}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Revenue</p>
          <p className="text-2xl font-bold">${stats?.revenue}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Users</p>
          <p className="text-2xl font-bold">{stats?.totalUsers}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Bookings per day (last 7 days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats?.dailyBookings}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}