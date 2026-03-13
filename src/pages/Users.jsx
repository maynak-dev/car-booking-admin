import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
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
    }
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user.id} className="border-t">
                <td className="px-6 py-4">{user.name || '-'}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone || '-'}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${user.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {user.isActive ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleBlock.mutate({ id: user.id, isActive: user.isActive })}
                    className={`px-3 py-1 rounded text-sm ${user.isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                  >
                    {user.isActive ? 'Block' : 'Unblock'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}