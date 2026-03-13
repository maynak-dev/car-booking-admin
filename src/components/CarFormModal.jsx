import { FaTimes } from 'react-icons/fa';

export default function CarFormModal({ isOpen, onClose, onSubmit, initialData }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {initialData ? 'Edit Car' : 'Add New Car'}
            </h3>
            <button onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" className="w-full border p-2 mb-2" required />
            <input name="brand" placeholder="Brand" className="w-full border p-2 mb-2" required />
            <input name="model" placeholder="Model" className="w-full border p-2 mb-2" required />
            <input type="number" name="year" placeholder="Year" className="w-full border p-2 mb-2" required />
            <input name="licensePlate" placeholder="License Plate" className="w-full border p-2 mb-2" required />
            <select name="type" className="w-full border p-2 mb-2">
              <option value="SEDAN">Sedan</option>
              <option value="SUV">SUV</option>
            </select>
            <input type="number" name="pricePerDay" placeholder="Price per day" className="w-full border p-2 mb-2" required />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}