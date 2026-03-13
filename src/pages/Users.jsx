import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import DataTable from '../components/DataTable';
import toast from 'react-hot-toast';

export default function Users() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: () => API.get('/admin/users').then(res => res.data)
  });

  const toggleBlock = useMutation({
    mutationFn: ({ id, isActive }) => API.put(`/admin/users/${id}/block`, { isActive: !isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers']);
      toast.success('User status updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  });

  const columns = [
    { key: 'name', label: 'Name', render: (val) => val || '—' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (val) => val || '—' },
    { key: 'role', label: 'Role' },
    {
      key: 'isActive',
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {val ? 'Active' : 'Blocked'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (val) => new Date(val).toLocaleDateString()
    },
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
        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-gray-500 mt-1">View and manage user accounts</p>
      </div>

      <DataTable
        columns={columns}
        data={users || []}
        onStatusChange={(id, isActive) => toggleBlock.mutate({ id, isActive })}
        statusOptions={[
          { value: true, label: 'Active' },
          { value: false, label: 'Blocked' }
        ]}
      />
    </div>
  );
}