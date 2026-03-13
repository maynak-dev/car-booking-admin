import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Cars() {
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const queryClient = useQueryClient();

  const { data: cars, isLoading } = useQuery({
    queryKey: ['adminCars'],
    queryFn: () => API.get('/cars').then(res => res.data.cars)
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/cars/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCars']);
      toast.success('Car deleted');
    },
    onError: () => toast.error('Delete failed')
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Cars</h1>
        <button
          onClick={() => { setEditingCar(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Car
        </button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Brand</th>
                <th className="px-6 py-3 text-left">Price/day</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars?.map(car => (
                <tr key={car.id} className="border-t">
                  <td className="px-6 py-4">{car.name}</td>
                  <td className="px-6 py-4">{car.brand}</td>
                  <td className="px-6 py-4">${car.pricePerDay}</td>
                  <td className="px-6 py-4">{car.type}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => { setEditingCar(car); setShowModal(true); }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure?')) deleteMutation.mutate(car.id);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Car Form Modal (simplified - you'd build a proper form) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">{editingCar ? 'Edit' : 'Add'} Car</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              // In a real app, handle form submission
              setShowModal(false);
            }}>
              <input placeholder="Name" className="w-full border p-2 mb-2" />
              <input placeholder="Brand" className="w-full border p-2 mb-2" />
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Save
              </button>
              <button type="button" onClick={() => setShowModal(false)} className="ml-2 px-4 py-2 border rounded">
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}