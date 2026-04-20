import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  AlertTriangle, 
  LogOut,
  Fuel,
  Wrench,
  CircleDollarSign,
  Hammer,
  Disc,
  FileText,
  Route,
  BarChart3,
  Bell,
  Settings,
  Users
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const isAdmin = currentUser.role === 'admin';

  const sections = [
    {
      title: 'Operations',
      items: [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/vehicles', icon: Truck, label: 'Vehicles' },
      ]
    },
    {
      title: 'Management',
      items: [
        { path: '/journeys', icon: Route, label: 'Journeys' },
        { path: '/fuel', icon: Fuel, label: 'Fuel' },
        { path: '/expenses', icon: CircleDollarSign, label: 'Expenses' },
        { path: '/documents', icon: FileText, label: 'Documents' },
      ]
    },
    {
      title: 'Maintenance',
      items: [
        { path: '/services', icon: Wrench, label: 'Services' },
        { path: '/tires', icon: Disc, label: 'Tires' },
        { path: '/modifications', icon: Hammer, label: 'Modifications' },
        { path: '/reminders', icon: Bell, label: 'Reminders' },
      ]
    },
    {
      title: 'System',
      items: isAdmin ? [
        { path: '/alerts', icon: AlertTriangle, label: 'Alerts' },
        { path: '/reports', icon: BarChart3, label: 'Reports' },
        { path: '/users', icon: Users, label: 'User Management' },
        { path: '/settings', icon: Settings, label: 'Settings' },
      ] : [
        { path: '/alerts', icon: AlertTriangle, label: 'Alerts' },
        { path: '/reports', icon: BarChart3, label: 'Reports' }
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="bg-gray-800 text-white w-64 h-screen flex flex-col p-4 overflow-y-auto">
      <div className="mb-8 flex-shrink-0">
        <h1 className="text-xl font-bold">Vehicle Tracker</h1>
      </div>
      
      <nav className="flex-1 space-y-6">
        {sections.map(section => (
          <div key={section.title}>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;