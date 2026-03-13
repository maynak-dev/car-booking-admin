import { useForm } from 'react-hook-form';
import { FaTimes, FaUpload, FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function CarFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      type: 'SEDAN',
      fuelType: 'PETROL',
      transmission: 'AUTOMATIC',
      seats: 5,
      pricePerDay: 50,
      description: '',
      isAvailable: true,
    }
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const carTypes = ['SUV', 'SEDAN', 'HATCHBACK', 'CONVERTIBLE', 'COUPE', 'WAGON', 'VAN', 'PICKUP'];
  const fuelTypes = ['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID'];
  const transmissions = ['MANUAL', 'AUTOMATIC'];

  // Reset form whenever modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Editing: populate with existing data
        reset({
          name: initialData.name || '',
          brand: initialData.brand || '',
          model: initialData.model || '',
          year: initialData.year || new Date().getFullYear(),
          licensePlate: initialData.licensePlate || '',
          type: initialData.type || 'SEDAN',
          fuelType: initialData.fuelType || 'PETROL',
          transmission: initialData.transmission || 'AUTOMATIC',
          seats: initialData.seats || 5,
          pricePerDay: initialData.pricePerDay || 50,
          description: initialData.description || '',
          isAvailable: initialData.isAvailable ?? true,
        });
        // Set image previews from existing images
        if (initialData.images) {
          try {
            setImagePreviews(JSON.parse(initialData.images));
          } catch (e) {
            setImagePreviews([]);
          }
        } else {
          setImagePreviews([]);
        }
        setNewImages([]);
      } else {
        // New car: reset to defaults
        reset();
        setImagePreviews([]);
        setNewImages([]);
      }
    }
  }, [isOpen, initialData, reset]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'isAvailable') {
        formData.append(key, data[key] ? 'true' : 'false');
      } else if (key !== 'images') {
        formData.append(key, data[key]);
      }
    });

    // Append existing image URLs if editing
    if (initialData) {
      const existingUrls = imagePreviews.filter(url => url.startsWith('http'));
      formData.append('existingImages', JSON.stringify(existingUrls));
    }

    // Append new image files
    newImages.forEach(file => {
      formData.append('images', file);
    });

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg w-full max-w-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{initialData ? 'Edit Car' : 'Add New Car'}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input {...register('name', { required: true })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Brand *</label>
                <input {...register('brand', { required: true })} className="w-full border p-2 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Model *</label>
                <input {...register('model', { required: true })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year *</label>
                <input type="number" {...register('year', { required: true })} className="w-full border p-2 rounded" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">License Plate *</label>
              <input {...register('licensePlate', { required: true })} className="w-full border p-2 rounded" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select {...register('type')} className="w-full border p-2 rounded">
                  {carTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fuel Type</label>
                <select {...register('fuelType')} className="w-full border p-2 rounded">
                  {fuelTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Transmission</label>
                <select {...register('transmission')} className="w-full border p-2 rounded">
                  {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Seats</label>
                <input type="number" {...register('seats')} className="w-full border p-2 rounded" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price per Day ($)</label>
              <input type="number" step="0.01" {...register('pricePerDay')} className="w-full border p-2 rounded" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea rows="3" {...register('description')} className="w-full border p-2 rounded"></textarea>
            </div>

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Car Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
                <label htmlFor="images" className="cursor-pointer text-blue-600 hover:text-blue-700">
                  Upload files
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>

            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img src={src} alt="preview" className="h-16 w-full object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Availability toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Available for booking</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register('isAvailable')} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {initialData ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}