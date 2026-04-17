import { useEffect, useMemo, useState } from 'react';
import { MapPin, Plus, X } from 'lucide-react';
import { loadJson, saveJson } from '../utils/storage';

const INITIAL_FORM_STATE = {
  vehicleId: '',
  startDate: '',
  startTime: '',
  startLocation: '',
  endDate: '',
  endTime: '',
  endLocation: '',
  startOdometer: '',
  endOdometer: '',
  purpose: '',
  routeType: 'Mixed',
  fuelUsed: '',
  passengerLoad: '',
  notes: '',
  returnTrip: false,
};

const RunningChart = () => {
  const [vehicles, setVehicles] = useState([]);
  const [journeys, setJourneys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM_STATE);

  useEffect(() => {
    setVehicles(loadJson('vehicles', []));
    setJourneys(loadJson('journeyEntries', []));
  }, []);

  const totalDistance = useMemo(() => journeys.reduce((acc, journey) => {
    const start = Number(journey.startOdometer || 0);
    const end = Number(journey.endOdometer || 0);
    return acc + Math.max(end - start, 0);
  }, 0), [journeys]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.startDate || !form.startTime || !form.startLocation || !form.startOdometer) {
      return;
    }
    const newJourney = {
      id: Date.now(),
      vehicleId: Number(form.vehicleId),
      startDate: form.startDate,
      startTime: form.startTime,
      startLocation: form.startLocation,
      endDate: form.endDate,
      endTime: form.endTime,
      endLocation: form.endLocation,
      startOdometer: Number(form.startOdometer || 0),
      endOdometer: Number(form.endOdometer || 0),
      purpose: form.purpose,
      routeType: form.routeType,
      fuelUsed: Number(form.fuelUsed || 0),
      passengerLoad: form.passengerLoad,
      notes: form.notes,
      returnTrip: form.returnTrip,
    };
    const updated = [newJourney, ...journeys];
    setJourneys(updated);
    saveJson('journeyEntries', updated);
    setForm(INITIAL_FORM_STATE);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm(INITIAL_FORM_STATE);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Running Chart</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
              <MapPin className="h-4 w-4" />
              Total journeys: {journeys.length}
            </span>
            <p className="text-sm text-gray-500">Record journeys with locations, odometer and fuel</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Start Journey
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Journey count</p>
          <p className="text-3xl font-bold text-gray-900">{journeys.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Total distance</p>
          <p className="text-3xl font-bold text-gray-900">{totalDistance} <span className="text-lg text-gray-500">km</span></p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">Return trips</p>
          <p className="text-3xl font-bold text-gray-900">{journeys.filter((j) => j.returnTrip).length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Journey Log</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500 tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left rounded-tl-xl rounded-bl-xl">Vehicle</th>
                <th className="px-6 py-4 text-left">Start</th>
                <th className="px-6 py-4 text-left">End</th>
                <th className="px-6 py-4 text-left">Distance</th>
                <th className="px-6 py-4 text-left">Fuel Used</th>
                <th className="px-6 py-4 text-left rounded-tr-xl rounded-br-xl">Purpose</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {journeys.map((journey) => {
                const vehicle = vehicles.find((v) => v.id === journey.vehicleId);
                const distance = Math.max(journey.endOdometer - journey.startOdometer, 0);
                return (
                  <tr key={journey.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{vehicle?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="font-medium text-gray-900">{journey.startLocation}</div>
                      <div className="text-xs">{journey.startDate} {journey.startTime}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="font-medium text-gray-900">{journey.endLocation || '-'}</div>
                      <div className="text-xs">{journey.endDate || ''} {journey.endTime || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{distance} km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{journey.fuelUsed ? `${journey.fuelUsed} L` : '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{journey.purpose || '-'}</td>
                  </tr>
                );
              })}
              {journeys.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
                    <MapPin className="mx-auto h-8 w-8 text-gray-300 mb-3" />
                    <p className="font-medium text-gray-900">No journeys recorded yet.</p>
                    <p className="mt-1">Click 'Start Journey' to add your first record.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Start Journey Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-auto animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white rounded-t-3xl">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Start Journey
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="space-y-1.5 lg:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Vehicle</label>
                  <select
                    required
                    value={form.vehicleId}
                    onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-gray-700"
                  >
                    <option value="">Select a Vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>{vehicle.name} ({vehicle.plate})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 lg:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Purpose</label>
                  <input
                    type="text"
                    value={form.purpose}
                    onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="e.g. Office commute, delivery"
                  />
                </div>

                {/* Section Break */}
                <div className="col-span-full mt-2 mb-1 border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-bold text-gray-900">Start Details</h3>
                </div>

                <div className="space-y-1.5 lg:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Start Location</label>
                  <input
                    required
                    type="text"
                    value={form.startLocation}
                    onChange={(e) => setForm({ ...form, startLocation: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="Where are you starting?"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Start Date</label>
                  <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Start Time</label>
                  <input
                    required
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                  />
                </div>

                {/* Section Break */}
                <div className="col-span-full mt-2 mb-1 border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-bold text-gray-900">End Details (Optional)</h3>
                </div>

                <div className="space-y-1.5 lg:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">End Location</label>
                  <input
                    type="text"
                    value={form.endLocation}
                    onChange={(e) => setForm({ ...form, endLocation: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="Where are you arriving?"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">End Date</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">End Time</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                  />
                </div>

                {/* Section Break */}
                <div className="col-span-full mt-2 mb-1 border-t border-gray-100 pt-4">
                  <h3 className="text-sm font-bold text-gray-900">Metrics</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Start Odometer (km)</label>
                  <input
                    required
                    type="number"
                    value={form.startOdometer}
                    onChange={(e) => setForm({ ...form, startOdometer: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="Starting km"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">End Odometer (km)</label>
                  <input
                    type="number"
                    value={form.endOdometer}
                    onChange={(e) => setForm({ ...form, endOdometer: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="Ending km"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Fuel Used (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={form.fuelUsed}
                    onChange={(e) => setForm({ ...form, fuelUsed: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="Fuel usage"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Route Type</label>
                  <select
                    value={form.routeType}
                    onChange={(e) => setForm({ ...form, routeType: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
                  >
                    <option>Mixed</option>
                    <option>City</option>
                    <option>Highway</option>
                  </select>
                </div>

                <div className="col-span-full flex gap-3 mt-4 pt-4 border-t border-gray-100 z-10 sticky bottom-0 bg-white">
                  <label className="flex items-center gap-2 text-sm text-gray-700 font-medium py-3 px-1 mr-auto cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.returnTrip}
                      onChange={(e) => setForm({ ...form, returnTrip: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors"
                    />
                    Mark as Return Trip
                  </label>

                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors uppercase tracking-wider text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition-all active:scale-95 uppercase tracking-wider text-xs"
                  >
                    Save Journey
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunningChart;
