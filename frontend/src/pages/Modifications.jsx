import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { loadJson, saveJson } from '../utils/storage';

const Modifications = () => {
  const [vehicles, setVehicles] = useState([]);
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    vehicleId: '',
    date: '',
    type: 'Upgrade',
    description: '',
    cost: '',
    odometer: '',
    notes: '',
  });

  useEffect(() => {
    setVehicles(loadJson('vehicles', []));
    setEntries(loadJson('modificationEntries', []));
  }, []);

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, entry) => ({
        totalCost: acc.totalCost + Number(entry.cost || 0),
        count: acc.count + 1,
      }),
      { totalCost: 0, count: 0 }
    );
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vehicleId || !form.date || !form.description) {
      return;
    }
    const newEntry = {
      id: Date.now(),
      vehicleId: Number(form.vehicleId),
      date: form.date,
      type: form.type,
      description: form.description,
      cost: Number(form.cost || 0),
      odometer: Number(form.odometer) || 0,
      notes: form.notes,
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    saveJson('modificationEntries', updated);
    setForm({ vehicleId: '', date: '', type: 'Upgrade', description: '', cost: '', odometer: '', notes: '' });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Modifications</h1>
          <p className="text-sm text-gray-600 mt-1">Manage upgrades, accessories and customizations for the fleet.</p>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
          <Sparkles className="h-5 w-5" />
          Total mods: {totals.count}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Modification count</p>
          <p className="mt-2 text-2xl font-semibold">{totals.count}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-sm text-gray-500">Total modification cost</p>
          <p className="mt-2 text-2xl font-semibold">${totals.totalCost.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4">Add Modification</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle</label>
            <select
              value={form.vehicleId}
              onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option>Upgrade</option>
              <option>Accessory</option>
              <option>Customization</option>
            </select>
          </div>
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Describe the upgrade or customization"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Cost</label>
            <input
              type="number"
              step="0.01"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g. 350.00"
            />
          <div>
            <label className="block text-sm font-medium text-gray-700">Odometer</label>
            <input
              type="number"
              value={form.odometer}
              onChange={(e) => setForm({ ...form, odometer: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="km"
            />
          </div>
          </div>
          <div className="lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows="3"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Optional details"
            />
          </div>
          <div className="lg:col-span-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Save Modification
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Modification History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Odometer</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((entry) => {
                const vehicle = vehicles.find((v) => v.id === entry.vehicleId);
                return (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{vehicle?.name || 'Unknown'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{entry.description}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">${entry.cost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-700">{entry.odometer || '-'} km</td>
                  </tr>
                );
              })}
              {entries.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500">No modification records yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Modifications;
