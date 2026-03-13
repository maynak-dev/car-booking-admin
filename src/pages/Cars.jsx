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

  // Fetch cars
  const { data: cars, isLoading } = useQuery({
    queryKey: ['adminCars'],
    queryFn: () => API.get('/cars').then(res => res.data.cars)
  });

  // Create car mutation
  const createMutation = useMutation({
    mutationFn: (newCar) => API.post('/cars', newCar, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCars']);
      toast.success('Car added successfully');
      setShowModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add car');
    }
  });

  // Update car mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => API.put(`/cars/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
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

  // Delete car mutation
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

  // Toggle availability mutation (one-click)
  const toggleAvailability = useMutation({
    mutationFn: ({ id, isAvailable }) => {
      const formData = new FormData();
      formData.append('isAvailable', isAvailable);
      return API.put(`/cars/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCars']);
      toast.success('Availability updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update availability');
    }
  });

  // Handle form submission from modal
  const handleSubmit = (formData) => {
    if (editingCar) {
      updateMutation.mutate({ id: editingCar.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Handle availability toggle
  const handleAvailabilityToggle = (id, currentStatus) => {
    toggleAvailability.mutate({ id, isAvailable: !currentStatus });
  };

  // Define table columns
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'brand', label: 'Brand' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'licensePlate', label: 'License Plate' },
    { key: 'type', label: 'Type' },
    { 
      key: 'pricePerDay', 
      label: 'Price/Day', 
      render: (val) => `$${val}` 
    },
    {
      key: 'isAvailable',
      label: 'Available',
      render: (val, car) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={val}
            onChange={() => handleAvailabilityToggle(car.id, val)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
      )
    }
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
        onEdit={(car) => { 
          setEditingCar(car); 
          setShowModal(true); 
        }}
        onDelete={(id) => {
          if (window.confirm('Are you sure you want to delete this car?')) {
            deleteMutation.mutate(id);
          }
        }}
      />

      <CarFormModal
        isOpen={showModal}
        onClose={() => { 
          setShowModal(false); 
          setEditingCar(null); 
        }}
        onSubmit={handleSubmit}
        initialData={editingCar}
      />
    </div>
  );
}