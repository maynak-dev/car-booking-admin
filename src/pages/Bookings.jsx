import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function Bookings() {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: () => API.get('/admin/bookings').then(res => res.data)
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => API.put(`/admin/bookings/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBookings']);
      toast.success('Status updated');
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Bookings</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">User</th>
              <th className="px-6 py-3 text-left">Car</th>
              <th className="px-6 py-3 text-left">Dates</th>
              <th className="px-6 py-3 text-left">Total</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.map(booking => (
              <tr key={booking.id} className="border-t">
                <td className="px-6 py-4">{booking.user.name || booking.user.email}</td>
                <td className="px-6 py-4">{booking.car.name}</td>
                <td className="px-6 py-4">
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">${booking.totalPrice}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    booking.status === 'CONFIRMED' ? 'bg-green-200 text-green-800' :
                    booking.status === 'CANCELLED' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={booking.status}
                    onChange={(e) => updateStatus.mutate({ id: booking.id, status: e.target.value })}
                    className="border rounded p-1"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}