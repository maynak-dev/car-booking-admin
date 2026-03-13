import { useState } from 'react';
import { FaTimes, FaUpload, FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

export default function CarFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const { register, handleSubmit } = useForm({
    defaultValues: initialData || {
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

  const [imagePreviews, setImagePreviews] = useState(
    initialData?.images ? JSON.parse(initialData.images) : []
  );
  const [newImages, setNewImages] = useState([]);

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
    if (initialData) {
      const existingUrls = imagePreviews.filter(url => url.startsWith('http'));
      formData.append('existingImages', JSON.stringify(existingUrls));
    }
    newImages.forEach(file => formData.append('images', file));
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
            {/* All form fields as before */}
            <div className="grid grid-cols-2 gap-4">
              <input {...register('name')} placeholder="Name" className="border p-2 rounded" required />
              <input {...register('brand')} placeholder="Brand" className="border p-2 rounded" required />
            </div>
            {/* ... include all fields from the full version ... */}

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium mb-1">Car Images</label>
              <div className="border-2 border-dashed p-4 rounded-lg text-center">
                <FaUpload className="mx-auto h-8 w-8 text-gray-400" />
                <label htmlFor="images" className="cursor-pointer text-blue-600">
                  Upload files
                  <input id="images" type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
              </div>
            </div>

            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img src={src} alt="preview" className="h-16 w-full object-cover rounded" />
                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Availability toggle */}
            <div className="flex items-center justify-between">
              <span>Available for booking</span>
              <input type="checkbox" {...register('isAvailable')} className="toggle" />
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}