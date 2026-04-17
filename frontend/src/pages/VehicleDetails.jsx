import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demo
    const mockVehicle = {
      id: parseInt(id),
      name: `Truck ${id}`,
      driver: 'John Doe',
      status: 'Moving',
      speed: 60,
      lat: 51.505,
      lng: -0.09,
      lastUpdated: new Date().toISOString(),
    };
    const mockHistory = [
      { lat: 51.505, lng: -0.09, speed: 60, timestamp: new Date().toISOString() },
      { lat: 51.506, lng: -0.091, speed: 65, timestamp: new Date(Date.now() - 300000).toISOString() },
      { lat: 51.507, lng: -0.092, speed: 55, timestamp: new Date(Date.now() - 600000).toISOString() },
    ];
    setVehicle(mockVehicle);
    setHistory(mockHistory);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!vehicle) {
    return <div className="p-6">Vehicle not found</div>;
  }

  const routePoints = history.map(h => [h.lat, h.lng]);
  const speedData = history.map(h => ({
    time: new Date(h.timestamp).toLocaleTimeString(),
    speed: h.speed,
  }));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{vehicle.name} Details</h1>

      {/* Vehicle Info */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">ID</p>
            <p className="font-medium">{vehicle.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Driver</p>
            <p className="font-medium">{vehicle.driver}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              vehicle.status === 'Moving' ? 'bg-green-100 text-green-800' :
              vehicle.status === 'Idle' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {vehicle.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Speed</p>
            <p className="font-medium">{vehicle.speed} km/h</p>
          </div>
        </div>
      </div>

      {/* Route Map */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Route History</h2>
        <div style={{ height: '400px' }}>
          <MapContainer center={[vehicle.lat, vehicle.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {routePoints.length > 1 && (
              <Polyline positions={routePoints} color="blue" />
            )}
          </MapContainer>
        </div>
      </div>

      {/* Speed Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Speed Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={speedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="speed" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VehicleDetails;