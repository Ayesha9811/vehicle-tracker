import { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Mock data for demo
    const mockAlerts = [
      { id: 1, message: 'Overspeed detected', vehicleName: 'Truck 1', timestamp: new Date().toISOString(), severity: 'high' },
      { id: 2, message: 'Vehicle stopped', vehicleName: 'Truck 2', timestamp: new Date().toISOString(), severity: 'medium' },
      { id: 3, message: 'Offline vehicle', vehicleName: 'Truck 3', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'low' },
    ];
    setAlerts(mockAlerts);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Alerts</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
          <div className="space-y-4">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start p-4 border border-gray-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {alert.vehicleName} • {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                  alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;