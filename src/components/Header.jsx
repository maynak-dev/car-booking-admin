import { FaBars, FaUserCircle } from 'react-icons/fa';
import useAuthStore from '../store/authStore';

export default function Header({ setSidebarOpen }) {
  const { user } = useAuthStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
        >
          <FaBars size={24} />
        </button>

        <div className="flex-1 lg:ml-0 ml-4">
          <h2 className="text-lg font-semibold text-gray-800">Welcome back, {user?.name || 'Admin'}!</h2>
          <p className="text-sm text-gray-500">Here's what's happening with your business today.</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-gray-400" size={32} />
            <span className="hidden md:inline-block text-sm font-medium text-gray-700">{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}