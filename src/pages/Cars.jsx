import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../services/api';
import DataTable from '../components/DataTable';
import CarFormModal from '../components/CarFormModal';
import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Cars() {
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const queryClient = useQueryClient();

  const { data: cars, isLoading } = useQuery({
    queryKey: ['adminCars'],
    queryFn: () => API.get('/cars').then(res => res.data.cars)
  });

  const createMutation = useMutation({
    mutationFn: (newCar) => API.post('/cars', newCar),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCars']);
      toast.success('Car added successfully');
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add car');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => API.put(`/cars/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCars']);
      toast.success('Car updated successfully');
      setShowModal(false);
      setEditingCar(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update car');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/cars/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCars']);
      toast.success('Car deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete car');
    }
  });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'brand', label: 'Brand' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'licensePlate', label: 'License Plate' },
    { key: 'type', label: 'Type' },
    { key: 'pricePerDay', label: 'Price/Day', render: (val) => `$${val}` },
    {
      key: 'isAvailable',
      label: 'Available',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {val ? 'Yes' : 'No'}
        </span>
      )
    },
  ];

  const handleSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images' && data[key]?.[0]) {
        formData.append('images', data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    });

    if (editingCar) {
      updateMutation.mutate({ id: editingCar.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Cars</h1>
          <p className="text-gray-500 mt-1">Add, edit, or remove cars from your fleet</p>
        </div>
        <button
          onClick={() => { setEditingCar(null); setShowModal(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <FaPlus /> Add New Car
        </button>
      </div>

      <DataTable
        columns={columns}
        data={cars || []}
        onEdit={(car) => { setEditingCar(car); setShowModal(true); }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this car?')) {
            deleteMutation.mutate(id);
          }
        }}
      />

      <CarFormModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingCar(null); }}
        onSubmit={handleSubmit}
        initialData={editingCar}
      />
    </div>
  );
}