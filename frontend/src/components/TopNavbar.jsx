import { Bell, User } from 'lucide-react';

const TopNavbar = () => {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Welcome back!</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-700">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;