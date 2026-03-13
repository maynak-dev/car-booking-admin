import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import DataTable from '../components/DataTable';
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
      toast.success('Booking status updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  });

  // New mutation for updating payment status
  const updatePaymentStatus = useMutation({
    mutationFn: ({ id, paymentStatus }) => API.put(`/admin/bookings/${id}/payment`, { paymentStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBookings']);
      toast.success('Payment status updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    }
  });

  const handlePaymentToggle = (booking) => {
    const newStatus = booking.paymentStatus === 'PAID' ? 'PENDING' : 'PAID';
    updatePaymentStatus.mutate({ id: booking.id, paymentStatus: newStatus });
  };

  const columns = [
    { key: 'id', label: 'ID' },
    {
      key: 'user',
      label: 'Customer',
      render: (_, booking) => booking.user?.name || booking.user?.email || 'N/A'
    },
    {
      key: 'car',
      label: 'Car',
      render: (_, booking) => booking.car?.name || 'N/A'
    },
    {
      key: 'startDate',
      label: 'Start Date',
      render: (val) => new Date(val).toLocaleDateString()
    },
    {
      key: 'endDate',
      label: 'End Date',
      render: (val) => new Date(val).toLocaleDateString()
    },
    { key: 'totalPrice', label: 'Total Price', render: (val) => `$${val}` },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const colors = {
          PENDING: 'bg-yellow-100 text-yellow-800',
          CONFIRMED: 'bg-green-100 text-green-800',
          CANCELLED: 'bg-red-100 text-red-800',
          COMPLETED: 'bg-blue-100 text-blue-800',
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[val] || 'bg-gray-100 text-gray-800'}`}>{val}</span>;
      }
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (val, booking) => {
        const isPaid = val === 'PAID';
        return (
          <button
            onClick={() => handlePaymentToggle(booking)}
            disabled={updatePaymentStatus.isPending}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              isPaid
                ? 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500'
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPaid ? 'Paid' : 'Not Paid'}
          </button>
        );
      }
    },
  ];

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
        <p className="text-gray-500 mt-1">View and update booking statuses</p>
      </div>

      <DataTable
        columns={columns}
        data={bookings || []}
        onStatusChange={(id, status) => updateStatus.mutate({ id, status })}
        statusOptions={statusOptions}
      />
    </div>
  );
}